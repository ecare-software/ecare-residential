export const AdminReportingRoles = [
  "Admin",
  "Owner/CEO",
  "Executive/Director",
  "Administrator",
  "Case/Manager",
  "Supervisor",
];

export const isAdminUser = (userObj) => {
  return AdminReportingRoles.includes(userObj?.jobTitle);
};
