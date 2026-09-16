// Mirrors client/src/utils/AdminReportingRoles.js's AdminReportingRoles/
// isAdminUser - the client and server don't share a module boundary, so
// this list is kept in sync manually. Used to gate server-side actions
// that should be restricted to admin/supervisor-level roles (e.g.
// back-dating an already-saved form's createDate - see
// utils/applyCreateDateEdit.js).
const ADMIN_JOB_TITLES = [
  "Admin",
  "Owner/CEO",
  "Executive/Director",
  "Administrator",
  "Case/Manager",
  "Supervisor",
  "Administrative/Assistant",
  "Therapist",
  "Medical/Coordinator",
];

function isAdminUser(user) {
  return ADMIN_JOB_TITLES.includes(user?.jobTitle);
}

module.exports = { ADMIN_JOB_TITLES, isAdminUser };
