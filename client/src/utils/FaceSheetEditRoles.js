// Roles permitted to create/edit a Face Sheet. Everyone else (Direct Care Staff
// and all other roles) gets a read-only view.
export const FaceSheetEditRoles = ["Administrator", "Case/Manager", "Owner/CEO"];

export const canEditFaceSheet = (userObj) => {
  return FaceSheetEditRoles.includes(userObj?.jobTitle);
};
