// Server-side integrity checks shared by the single-client form routes
// (searchLog, clientRefusal, roomCheck, clothingInventory, cssrsScreening,
// medicationDestruction). The browser runs its own versions of
// some of these, but the API is reachable directly, so nothing here may
// rely on the client having validated first.

const Client = require("../models/Client");
const { isAdminUser } = require("./adminRoles");

// datetime-local inputs send "YYYY-MM-DDTHH:mm". They carry no timezone,
// and the server may not share the user's, so "the future" allows a day of
// slack rather than comparing against the server clock exactly.
const DATETIME_LOCAL_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const FUTURE_TOLERANCE_MS = 24 * 60 * 60 * 1000;
const EARLIEST_DATE = new Date("2000-01-01T00:00:00Z");

const isTooFarInFuture = (date) =>
  date.getTime() > Date.now() + FUTURE_TOLERANCE_MS;

// Returns an error message, or null if `value` is a usable date/time.
function dateTimeLocalError(value, label) {
  if (typeof value !== "string" || !DATETIME_LOCAL_RE.test(value)) {
    return `${label} must be a valid date and time.`;
  }
  // Parsed as UTC purely to range-check it - the stored value stays the
  // string the user entered.
  const parsed = new Date(`${value}:00Z`);
  // Date rolls impossible values over instead of rejecting them
  // ("2026-02-30" becomes March 2), so require an exact round trip.
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 16) !== value ||
    parsed < EARLIEST_DATE
  ) {
    return `${label} must be a valid date and time.`;
  }
  if (isTooFarInFuture(parsed)) {
    return `${label} cannot be in the future.`;
  }
  return null;
}

// Same rules for a date input's "YYYY-MM-DD".
function dateOnlyError(value, label) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${label} must be a valid date.`;
  }
  const error = dateTimeLocalError(`${value}T00:00`, label);
  return error && error.endsWith("must be a valid date and time.")
    ? `${label} must be a valid date.`
    : error;
}

// The forms send createDate as an ISO string ("2026-10-07T14:30:00.000Z",
// or a bare "2026-10-07"); nothing else is accepted.
const ISO_DATE_RE =
  /^(\d{4})-(\d{2})-(\d{2})(T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?)?$/;

// Whether year/month/day name a real calendar day (Date would otherwise
// roll Feb 31 over to March 3).
function isRealCalendarDay(year, month, day) {
  const d = new Date(Date.UTC(year, month - 1, day));
  return (
    d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day
  );
}

// Same rules for a createDate (an ISO string or Date).
function createDateError(value) {
  if (!(value instanceof Date)) {
    const match = typeof value === "string" && ISO_DATE_RE.exec(value);
    if (!match || !isRealCalendarDay(Number(match[1]), Number(match[2]), Number(match[3]))) {
      return "createDate must be a valid date.";
    }
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime()) || parsed < EARLIEST_DATE) {
    return "createDate must be a valid date.";
  }
  if (isTooFarInFuture(parsed)) {
    return "createDate cannot be in the future.";
  }
  return null;
}

// Looks the client up within the authenticated user's own home. Returns
// { clientId, childMeta_name } taken from the Client record - the request's
// childMeta_name is never trusted - or null if there's no such client in
// this home (including a malformed id).
async function resolveHomeClient(authUser, clientId) {
  if (!clientId || typeof clientId !== "string") return null;
  try {
    const client = await Client.findOne({
      _id: clientId,
      homeId: authUser.homeId,
    }).select("childMeta_name");
    if (!client) return null;
    return { clientId: String(client._id), childMeta_name: client.childMeta_name };
  } catch (e) {
    return null; // CastError from a malformed id
  }
}

// Labels of the required fields that are blank in `doc`.
function missingRequiredFields(doc, requiredFields) {
  return requiredFields
    .filter(({ key }) => {
      const value = doc[key];
      return value === undefined || value === null || !String(value).trim();
    })
    .map(({ label }) => label);
}

// The form's signer: whoever submitted it (submittedById, set by
// submittedFields below), or for a record submitted before that existed,
// its creator - by the immutable createdById, falling back to the
// createdBy email only for a record that predates createdById (see
// routes/api/SeriousIncidentReport.js).
function isFormAuthor(authUser, form) {
  if (form.submittedById) return form.submittedById === String(authUser._id);
  if (form.createdById) return form.createdById === String(authUser._id);
  return !!form.createdBy && form.createdBy === authUser.email;
}

// A submitted (COMPLETED) form may only be changed by its signer or an
// admin. Drafts stay editable by any staff in the home so a shift can hand
// one off - whoever then submits it becomes the signer.
function canEditForm(authUser, form) {
  if (form.status !== "COMPLETED") return true;
  return isAdminUser(authUser) || isFormAuthor(authUser, form);
}

// Stamped on every create/edit so the record shows who last changed it,
// not just who first created it.
function lastEditedFields(authUser) {
  return {
    lastEditDate: new Date(),
    lastEditedBy: authUser.email,
    lastEditedById: String(authUser._id),
    lastEditedByName: `${authUser.firstName} ${authUser.lastName}`,
  };
}

// Stamped when a form moves to COMPLETED. The person who submits signs the
// form - their profile signature is what the report view shows - so a
// draft started by one staff member and submitted by another is never
// shown under the first one's signature.
function submittedFields(authUser) {
  return {
    submittedBy: authUser.email,
    submittedById: String(authUser._id),
    submittedByName: `${authUser.firstName} ${authUser.lastName}`,
    submittedAt: new Date(),
  };
}

// Every edit route checks status/approval/ownership against the record it
// loaded, then writes. Without this, anything that changed in between - a
// submit, an approval, a return to draft - would be silently overwritten
// (e.g. a slow autosave of a draft landing after Submit would turn the
// form back into a draft). Spread into the update's filter so the write
// only applies if the record is still in the state that was checked; a
// null result then means it changed (or was deleted) - see CONFLICT_ERROR.
function unchangedSince(existing) {
  return {
    // null also matches a record saved before status existed.
    status: existing.status === undefined ? null : existing.status,
    approved: existing.approved === true ? true : { $ne: true },
  };
}

const CONFLICT_ERROR =
  "This form was submitted, approved, or returned to draft by someone else while you were saving, so your changes weren't saved. Reload it to see the latest version.";

module.exports = {
  unchangedSince,
  CONFLICT_ERROR,
  submittedFields,
  dateTimeLocalError,
  dateOnlyError,
  createDateError,
  resolveHomeClient,
  missingRequiredFields,
  canEditForm,
  lastEditedFields,
};
