export const TRAINING_MOD_TYPES = [
  { apiPath: "orientationTrainingMod", formType: "Orientation Training", rowCount: 7 },
  { apiPath: "preServiceTrainingMod", formType: "Pre Service Training", rowCount: 12 },
  { apiPath: "firstAidCprTrainingMod", formType: "First aid CPR Training", rowCount: 1 },
  { apiPath: "annualTrainingMod", formType: "Annual Training", rowCount: 32 },
];

export const getTrainingModType = (formType) => {
  switch (formType) {
    case "First aid CPR Training":
      return {
        apiPath: "firstAidCprTrainingMod",
        rowCount: 1, // Default row count, but will grow dynamically
      };
    case "Orientation Training":
      return {
        apiPath: "orientationTrainingMod",
        rowCount: 14,
      };
    case "Pre Service Training":
      return {
        apiPath: "preServiceTrainingMod",
        rowCount: 6,
      };
    case "Annual Training":
      return {
        apiPath: "annualTrainingMod",
        rowCount: 15,
      };
    default:
      return {
        apiPath: "trainingMod",
        rowCount: 1,
      };
  }
};
