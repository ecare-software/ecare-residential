export const AdminReportingRoles = [
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

export const isAdminUser = (userObj) => {
  return AdminReportingRoles.includes(userObj?.jobTitle);
};