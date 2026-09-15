const { isAdminUser } = require("./adminRoles");

// Applies (or rejects) a client-requested createDate change on an
// existing record's update payload. Only call this when the incoming
// update actually includes a createDate - a request that doesn't touch
// it should just `delete updates.createDate` (there's nothing to check)
// and skip the extra existingDoc fetch this needs.
//
// createDate is otherwise immutable after creation (see commit d40af4d3,
// which locked it down everywhere following a Copilot security review) -
// these clinical/compliance records are exactly what a licensing/CPS
// audit would examine for filing timeliness, so silently letting any
// caller rewrite a record's creation date after the fact would reopen
// that same finding. This carves out one narrow, audited exception: an
// admin/supervisor-role user (see utils/adminRoles.js) correcting a
// genuine mistake.
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
// Mutates `updates` in place. `existingDoc` must have been fetched with
// at least createDate and originalCreateDate selected.
function applyCreateDateEdit(updates, authUser, existingDoc) {
  if (updates.createDate === undefined) return;

  const requested = new Date(updates.createDate);
  const current = existingDoc?.createDate ? new Date(existingDoc.createDate) : null;

  if (current && requested.getTime() === current.getTime()) {
    delete updates.createDate;
    return;
  }

  if (!isAdminUser(authUser)) {
    delete updates.createDate;
    return;
  }

  updates.originalCreateDate = existingDoc?.originalCreateDate || current || requested;
  updates.createDateEditedBy = authUser.email;
  updates.createDateEditedAt = new Date();
}

module.exports = { applyCreateDateEdit };
