export const TRAINING_MOD_TYPES = [
  { apiPath: "orientationTrainingMod", formType: "Orientation Training", rowCount: 7 },
  { apiPath: "preServiceTrainingMod", formType: "Pre Service Training", rowCount: 12 },
  { apiPath: "firstAidCprTrainingMod", formType: "First aid CPR Training", rowCount: 1 },
  { apiPath: "annualTrainingMod", formType: "Annual Training", rowCount: 32 },
];

export const getTrainingModType = (formType) =>
  TRAINING_MOD_TYPES.find((type) => type.formType === formType) ||
  TRAINING_MOD_TYPES[0];
