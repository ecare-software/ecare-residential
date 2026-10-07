// Server-side integrity checks shared by the simple single-client form
// routes (searchLog, clientRefusal). The browser runs its own versions of
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
  if (Number.isNaN(parsed.getTime()) || parsed < EARLIEST_DATE) {
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
  return dateTimeLocalError(`${value}T00:00`, label);
}

// Same rules for a createDate (an ISO string or Date).
function createDateError(value) {
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

// Ownership keys on the immutable createdById, falling back to the
// createdBy email only for a record that predates createdById (see
// routes/api/SeriousIncidentReport.js).
function isFormAuthor(authUser, form) {
  if (form.createdById) return form.createdById === String(authUser._id);
  return !!form.createdBy && form.createdBy === authUser.email;
}

// A submitted (COMPLETED) form may only be changed by its author or an
// admin. Drafts stay editable by any staff in the home so a shift can hand
// one off.
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

module.exports = {
  dateTimeLocalError,
  dateOnlyError,
  createDateError,
  resolveHomeClient,
  missingRequiredFields,
  canEditForm,
  lastEditedFields,
};
