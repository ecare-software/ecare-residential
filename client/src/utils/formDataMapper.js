export const mapStaffInitials = (initialsArr = []) => ({
  staffInitials: {
    shift1: initialsArr[0] || "",
    shift2: initialsArr[1] || "",
    shift3: initialsArr[2] || "",
  },
});

// Map 2D check arrays to { shift1, shift2, shift3 } using explicit schema keys
export const mapCheckmarks = (schemaKeys, arr) => {
  const obj = {};
  schemaKeys.forEach((key, i) => {
    const row = arr[i] || [];
    obj[key] = {
      shift1: row[0] || false,
      shift2: row[1] || false,
      shift3: row[2] || false,
    };
  });
  return obj;
};

// DAILY INTAKE
export const mapDailyIntake = (dailyIntakeArr) => ({
  breakfast: { shift1: dailyIntakeArr[0][0] || "", shift2: dailyIntakeArr[0][1] || "", shift3: dailyIntakeArr[0][2] || "" },
  lunch: { shift1: dailyIntakeArr[1][0] || "", shift2: dailyIntakeArr[1][1] || "", shift3: dailyIntakeArr[1][2] || "" },
  dinner: { shift1: dailyIntakeArr[2][0] || "", shift2: dailyIntakeArr[2][1] || "", shift3: dailyIntakeArr[2][2] || "" },
});

export const mapRecTherapeuticActivity = ({ radiosArr, checkmarksData }) => {
  const [participation, peerInteraction] = radiosArr;
  const checkLabels = checkmarksData.labels;
  const checkArr = checkmarksData.arr;

  const toShiftObj = (row) => ({
    shift1: row[0] || false,
    shift2: row[1] || false,
    shift3: row[2] || false,
  });

  return {
    participation: {
      shift1: participation[0] || "",
      shift2: participation[1] || "",
      shift3: participation[2] || "",
    },
    peerInteraction: {
      shift1: peerInteraction[0] || "",
      shift2: peerInteraction[1] || "",
      shift3: peerInteraction[2] || "",
    },
    activityExerciseTrainer: toShiftObj(checkArr[0]),
    whyTherapeutic: toShiftObj(checkArr[3]),
    physicalFitnessPeer: toShiftObj(checkArr[4]),
  };
};

// LEVEL OF PRECAUTION
export const mapLevelOfPrecaution = (arr = []) => {
  const keys = ["visuals", "suicidal", "homicidal", "oneToOne", "awol"];
  return mapCheckmarks(keys, arr);
};

// HYGIENE COMPLETED
export const mapHygieneCompleted = (arr = []) => {
  const keys = ["yes", "refused", "needAssistance"];
  return mapCheckmarks(keys, arr);
};

// DAILY CHORES COMPLETED
export const mapDailyChoresCompleted = (arr = []) => {
  const keys = ["yes", "neededPrompting", "refused"];
  return mapCheckmarks(keys, arr);
};

// MEDICATION COMPLIANCE
export const mapMedicationCompliance = (arr = []) => {
  const keys = ["yes", "neededPrompting", "medicationTraining"];
  return mapCheckmarks(keys, arr);
};

// STAFF INTERVENTION
export const mapStaffIntervention = (arr = []) => {
  const keys = ["supportingEncouragingPositiveFeedback", "redirectsDisruptingConversation"];
  return mapCheckmarks(keys, arr);
};

// RESIDENT BEHAVIOR PERFORMANCE
export const mapResidentBehaviorPerformance = (arr = []) => {
  const keys = [
    "receptiveToInformationFromStaffAndPeers",
    "enthusiasticAndHelpFulToOthers",
    "IdentifiesPotentialSoultionsForProblemSolving",
    "participatesWellInGroupActivities",
    "followsInstructionsWell",
    "destructionOfProperty",
    "physicalAggressionTowardsOthers",
    "temperOutburst",
    "NoncomplianceWithProgramHouseRules",
    "verbalAggressionTowardsPeers",
    "verbalAggressionTwoardsStaff",
    "sexualMisconduct",
    "limitedEyeContact",
    "refuseToProcessWithStaff",
    "InappropiateBehaviorConversation",
    "selfInjuriousBehavior",
    "isolation",
    "bulliesMeanToOthers",
    "peerInteractionIssues",
    "cursingAndProfanity",
    "actsFearful",
    "demandingForAttention",
    "liesAndManipulation",
    "passiveAggressive",
    "stealing",
    "agitatesOthers",
    "suddenMoodChanges",
    "notFollowingDirections",
    "disruptiveBehavior"
  ];
  return mapCheckmarks(keys, arr);
};

export const mapTimeline = (timeLabels = [], timelineArr = []) => {
  return timeLabels.map((timeLabel, i) => ({
    timeLabel: timeLabel || "",  // ensure it's always a string
    shift1: timelineArr[i]?.[0] || "",
    shift2: timelineArr[i]?.[1] || "",
    shift3: timelineArr[i]?.[2] || "",
  }));
};