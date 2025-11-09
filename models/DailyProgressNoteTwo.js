const mongoose = require("mongoose");

// ✅ Helper sub-schema for checkmarks per shift
const checkmarkSchema = new mongoose.Schema({
  shift1: { type: Boolean, default: false },
  shift2: { type: Boolean, default: false },
  shift3: { type: Boolean, default: false },
});

// ✅ Helper sub-schema for radio options (Yes / Refused)
const radioSchema = new mongoose.Schema({
  shift1: { type: String, enum: ["Yes", "Refused", ""], default: "" },
  shift2: { type: String, enum: ["Yes", "Refused", ""], default: "" },
  shift3: { type: String, enum: ["Yes", "Refused", ""], default: "" },
});

// Participation
const radioParticipationSchema = new mongoose.Schema({
  shift1: { type: String, enum: ["Yes", "No", "Prompting", ""], default: "" },
  shift2: { type: String, enum: ["Yes", "No", "Prompting", ""], default: "" },
  shift3: { type: String, enum: ["Yes", "No", "Prompting", ""], default: "" },
});

// Peer Interaction
const radioPeerSchema = new mongoose.Schema({
  shift1: { type: String, enum: ["Excellent", "Good", "Poor", ""], default: "" },
  shift2: { type: String, enum: ["Excellent", "Good", "Poor", ""], default: "" },
  shift3: { type: String, enum: ["Excellent", "Good", "Poor", ""], default: "" },
});

// ✅ Timeline entry sub-schema (staff initials per shift for each time slot)
const timelineEntrySchema = new mongoose.Schema({
  timeLabel: { type: String, required: true }, // single time, e.g., "9:00PM"
  shift1: { type: String, default: "" },
  shift2: { type: String, default: "" },
  shift3: { type: String, default: "" },
});

// ✅ Shift Summary sub-schema
const shiftSummarySchema = new mongoose.Schema({
  shift1: { type: String, default: "" },
  shift2: { type: String, default: "" },
  shift3: { type: String, default: "" },
});

// ✅ Clothing Description sub-schema
const clothingDescriptionSchema = new mongoose.Schema({
  shirtBottoms: { type: String, default: "" },
  shoes: { type: String, default: "" },
  other: { type: String, default: "" },
});

// ✅ Signature / Initials / Title sub-schema
const signatureSchema = new mongoose.Schema({
  signatures: [{ type: String, default: "" }], // store as base64 or URL
  initials: [{ type: String, default: "" }],
  titles: [{ type: String, default: "" }],
});


// --- Base Daily Report Schema ---
const dailyReportSchema = new mongoose.Schema(
  {
    // 📅 Date and Time of Report Creation
    createDate: {
      type: Date,
      required: true,
    },

    // 🏠 Home Reference
    homeId: {
      type: String, // or mongoose.Schema.Types.ObjectId if you reference a Home collection
    },

    child: {
      childId: { type: String, required: false },
      name: { type: String, required: true },
    },

    // ✅ ADD THIS FIELD (for searching/filtering by child name)
    childMeta_name: {
      type: String,
      default: "",
    },

    // 🚨 LEVEL OF PRECAUTION
    levelOfPrecaution: {
      staffInitials: {
        shift1: { type: String, default: "" },
        shift2: { type: String, default: "" },
        shift3: { type: String, default: "" },
      },
      visuals: checkmarkSchema,
      suicidal: checkmarkSchema,
      homicidal: checkmarkSchema,
      oneToOne: checkmarkSchema,
      awol: checkmarkSchema,
    },

    // 🧼 HYGIENE COMPLETED
    hygieneCompleted: {
      staffInitials: {
        shift1: { type: String, default: "" },
        shift2: { type: String, default: "" },
        shift3: { type: String, default: "" },
      },
      yes: checkmarkSchema,
      refused: checkmarkSchema,
      needAssistance: checkmarkSchema,
    },

    // 🧹 DAILY CHORES COMPLETED
    dailyChoresCompleted: {
      staffInitials: {
        shift1: { type: String, default: "" },
        shift2: { type: String, default: "" },
        shift3: { type: String, default: "" },
      },
      yes: checkmarkSchema,
      neededPrompting: checkmarkSchema,
      refused: checkmarkSchema,
    },

    // 💊 MEDICATION COMPLIANCE
    medicationCompliance: {
      staffInitials: {
        shift1: { type: String, default: "" },
        shift2: { type: String, default: "" },
        shift3: { type: String, default: "" },
      },
      yes: checkmarkSchema,
      neededPrompting: checkmarkSchema,
      medicationTraining: checkmarkSchema,
    },

    // 🍽️ DAILY INTAKE
    dailyIntake: {
      staffInitials: {
        shift1: { type: String, default: "" },
        shift2: { type: String, default: "" },
        shift3: { type: String, default: "" },
      },
      breakfast: radioSchema,
      lunch: radioSchema,
      dinner: radioSchema,
    },

    // 🤝 STAFF INTERVENTION
    staffIntervention: {
      staffInitials: {
        shift1: { type: String, default: "" },
        shift2: { type: String, default: "" },
        shift3: { type: String, default: "" },
      },
      supportingEncouragingPositiveFeedback: checkmarkSchema,
      redirectsDisruptingConversation: checkmarkSchema,
    },

    // RESIDENT BEHAVIOR PERFORMANCE
    residentBehaviorPerformance: {
      staffInitials: {
        shift1: { type: String, default: "" },
        shift2: { type: String, default: "" },
        shift3: { type: String, default: "" },
      },
      receptiveToInformationFromStaffAndPeers: checkmarkSchema,
      enthusiasticAndHelpFulToOthers: checkmarkSchema,
      IdentifiesPotentialSoultionsForProblemSolving: checkmarkSchema,
      participatesWellInGroupActivities: checkmarkSchema,
      followsInstructionsWell: checkmarkSchema,
      destructionOfProperty: checkmarkSchema,
      physicalAggressionTowardsOthers: checkmarkSchema,
      temperOutburst: checkmarkSchema,
      NoncomplianceWithProgramHouseRules: checkmarkSchema,
      verbalAggressionTowardsPeers: checkmarkSchema,
      verbalAggressionTwoardsStaff: checkmarkSchema,
      sexualMisconduct: checkmarkSchema,
      limitedEyeContact: checkmarkSchema,
      refuseToProcessWithStaff: checkmarkSchema,
      InappropiateBehaviorConversation: checkmarkSchema,
      selfInjuriousBehavior: checkmarkSchema,
      isolation: checkmarkSchema,
      bulliesMeanToOthers: checkmarkSchema,
      peerInteractionIssues: checkmarkSchema,
      cursingAndProfanity: checkmarkSchema,
      actsFearful: checkmarkSchema,
      demandingForAttention: checkmarkSchema,
      liesAndManipulation: checkmarkSchema,
      passiveAggressive: checkmarkSchema,
      stealing: checkmarkSchema,
      agitatesOthers: checkmarkSchema,
      suddenMoodChanges: checkmarkSchema,
      notFollowingDirections: checkmarkSchema,
      disruptiveBehavior: checkmarkSchema,
    },

    // ✅ RECREATIONAL / THERAPEUTIC ACTIVITY
    recTherapeuticActivity: {
      staffInitials: {
        shift1: { type: String, default: "" },
        shift2: { type: String, default: "" },
        shift3: { type: String, default: "" },
      },
      activityExerciseTrainer: checkmarkSchema,
      whyTherapeutic: checkmarkSchema,
      physicalFitnessPeer: checkmarkSchema,
      participation: radioParticipationSchema,
      peerInteraction: radioPeerSchema,
    },

    // 🕒 TIMELINE (9:00PM – 6:15AM)
    timeline: {
      type: [timelineEntrySchema],
      default: [],
    },

     // 📝 SHIFT SUMMARY
    shiftSummary: shiftSummarySchema,

    // 👕 CLOTHING DESCRIPTION
    clothingDescription: clothingDescriptionSchema,

    // SIGNATURE 
    signatureSection: signatureSchema,

    // ✅ NEW FIELDS
    formType: {
      type: String,
      default: "Daily Progress Note Two", // pre-fill with form name
    },
    createdBy: {
      type: String,
      required: true, // store user email or ID
    },

     // ✅ ADD THIS FIELD (for approval filtering)
    approved: {
      type: Boolean,
      default: false,
    },
    createdByName: { type: String, default: "" }, // NEW
    status: { type: String, default: "IN_PROGRESS" },    // NEW
    lastEditDate: { type: Date, default: Date.now },     // NEW
  },
);

module.exports = mongoose.model("DailyReport", dailyReportSchema);