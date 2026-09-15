const { isAdminUser } = require("./adminRoles");

// Applies (or rejects) a client-requested createDate change on an
// existing record's update payload. Only call this when the incoming
// update actually includes a createDate - a request that doesn't touch
// it should just `delete updates.createDate` (there's nothing to check)
// and skip the extra existingDoc fetch this needs.
//
// createDate is otherwise immutable after creation ON THE ROUTES THAT CALL
// THIS HELPER (see commit d40af4d3, and the 10 route files that require()
// it - dailyProgressNoteTwo, dailyProgressAndActivity, incidentReport,
// admissionAssessment, treatmentPlans72, illnessInjury, bodyCheck,
// restraintReport, SeriousIncidentReport, medicationRouter). This is NOT a
// repo-wide guarantee - several other form-shaped routes (nightMonitoring,
// awakeNightStaffSignoff, the four training routes and their *Mod
// counterparts) still have no auth, no homeId scoping, and no field
// immutability of any kind, so createDate (and createdBy/homeId) on those
// records remains freely rewritable by any caller today. See memory
// (users-route-auth-hole and the sibling note on these routes) - fixing
// createDate there requires first giving them the same auth/scoping
// baseline the 10 routes above already have, which is a separate,
// deliberately deferred task.
//
// Where it IS wired in: these clinical/compliance records are exactly
// what a licensing/CPS audit would examine for filing timeliness, so
// silently letting any caller rewrite a record's creation date after the
// fact would reopen that same finding. This carves out one narrow,
// audited exception: an admin/supervisor-role user (see
// utils/adminRoles.js) correcting a genuine mistake.
//
// - Non-admins: createDate is stripped, exactly as before - direct care
//   staff can still set it once at creation, never edit it afterward.
// - Admins changing it to a real, different value: the new createDate is
//   kept, and the edit is recorded - createDateEditedBy/createDateEditedAt
//   capture who made the change and when, and originalCreateDate captures
//   what the record was FIRST created with (taken from existingDoc, which
//   already carries it forward if a previous edit already set it - never
//   overwritten again afterward), so an audit can always see the
//   record's true original creation date even after a correction.
// - Anyone re-sending the value the record already has: not a real
//   change, so createDate and the audit fields are all left untouched
//   rather than manufacturing an edit out of a no-op save.
//
const INVALID_CREATE_DATE_ERROR = "createDate must be a valid date.";

// Mutates `updates` in place. `existingDoc` must have been fetched with
// at least createDate and originalCreateDate selected.
//
// Returns `null` on success (including every case where createDate ends
// up stripped, not just where it's kept), or an error message string if
// the caller should reject the whole request with a 400 instead of
// proceeding to the update - callers must check this and respond/return
// before calling updateOne/findOneAndUpdate. A malformed or cleared
// datetime-local value (e.g. `new Date("")`) parses to Invalid Date; its
// getTime() is NaN, which trivially fails the "same as current" equality
// check below, so without this validation an admin would still fall
// through to the write branch and this function would leave that
// unparseable value sitting in `updates.createDate`. Mongoose then throws
// a CastError when the actual update runs - and every route that calls
// this helper only logs that rejection in its updateOne(...).catch(),
// never sending a response, so the request would hang instead of
// returning a clean error.
function applyCreateDateEdit(updates, authUser, existingDoc) {
  if (updates.createDate === undefined) return null;

  if (updates.createDate === null) {
    delete updates.createDate;
    return INVALID_CREATE_DATE_ERROR;
  }
  const requested = new Date(updates.createDate);
  if (Number.isNaN(requested.getTime())) {
    delete updates.createDate;
    return INVALID_CREATE_DATE_ERROR;
  }
  // Normalize to the actually-parsed Date, not whatever raw string/format
  // the client sent - every later comparison and write below (and the
  // eventual Mongoose cast) should all see the same value.
  updates.createDate = requested;

  const current = existingDoc?.createDate ? new Date(existingDoc.createDate) : null;

  if (current && requested.getTime() === current.getTime()) {
    delete updates.createDate;
    return null;
  }

  if (!isAdminUser(authUser)) {
    delete updates.createDate;
    return null;
  }

  updates.originalCreateDate = existingDoc?.originalCreateDate || current || requested;
  updates.createDateEditedBy = authUser.email;
  updates.createDateEditedAt = new Date();
  return null;
}

module.exports = { applyCreateDateEdit, INVALID_CREATE_DATE_ERROR };
