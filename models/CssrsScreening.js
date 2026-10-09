const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Columbia-Suicide Severity Rating Scale (C-SSRS), Pediatric - Since Last
// Contact (version 6/23/10). Field names follow the instrument's items.
// Yes/No answers are "yes" | "no" | "" (unanswered). The instrument's skip
// logic and required items are enforced server-side - see
// normalizeScreening/validateCompletion in routes/api/cssrsScreening.js.

const YesNoSchema = new Schema(
  {
    answer: { type: String, default: "" },
    describe: { type: String, default: "" },
  },
  { _id: false }
);

// A behavior item with its "Total #" box.
const BehaviorItemSchema = new Schema(
  {
    answer: { type: String, default: "" },
    count: { type: Number, default: null },
    describe: { type: String, default: "" },
  },
  { _id: false }
);

const CssrsScreeningSchema = new Schema({
  childMeta_name: {
    type: String,
  },
  clientId: {
    type: String,
  },
  // datetime-local value ("YYYY-MM-DDTHH:mm") - when the scale was
  // administered, which can differ from createDate.
  assessmentDateTime: {
    type: String,
  },
  // Who administered the scale (free text, prefilled with the submitter).
  administeredBy: {
    type: String,
  },

  // SUICIDAL IDEATION, items 1-5 (least to most severe).
  ideation: {
    wishToBeDead: { type: YesNoSchema, default: () => ({}) },
    nonSpecificActiveThoughts: { type: YesNoSchema, default: () => ({}) },
    activeWithMethods: { type: YesNoSchema, default: () => ({}) },
    activeWithIntent: { type: YesNoSchema, default: () => ({}) },
    activeWithPlanAndIntent: { type: YesNoSchema, default: () => ({}) },
  },

  // INTENSITY OF IDEATION. mostSevereIdeationType is derived (the highest
  // "yes" item, 1-5; 0 when there's no ideation) - never client-supplied.
  mostSevereIdeationType: { type: Number, default: 0 },
  mostSevereIdeationDescription: { type: String, default: "" },
  // 1 Only one time, 2 A few times, 3 A lot, 4 All the time,
  // 0 Don't know/Not applicable.
  ideationFrequency: { type: Number, default: null },
  // The instrument's "Write response" next to the Frequency code.
  ideationFrequencyResponse: { type: String, default: "" },

  // SUICIDAL BEHAVIOR
  behavior: {
    actualAttempt: { type: BehaviorItemSchema, default: () => ({}) },
    nonSuicidalSelfInjury: { type: YesNoSchema, default: () => ({}) },
    selfInjuryIntentUnknown: { type: YesNoSchema, default: () => ({}) },
    interruptedAttempt: { type: BehaviorItemSchema, default: () => ({}) },
    abortedAttempt: { type: BehaviorItemSchema, default: () => ({}) },
    preparatoryActs: { type: BehaviorItemSchema, default: () => ({}) },
    suicide: { type: YesNoSchema, default: () => ({}) },
  },
  // Lethality - only applies when an actual attempt is reported.
  mostLethalAttemptDate: { type: String, default: "" },
  // 0-5, see the instrument's Actual Lethality/Medical Damage codes.
  actualLethality: { type: Number, default: null },
  // 0-2, only answered when actualLethality is 0.
  potentialLethality: { type: Number, default: null },

  // Not part of the instrument - where staff record the response to a
  // positive screen (who was notified, safety steps taken).
  actionsTaken: { type: String, default: "" },

  // Derived summary of positive responses (descriptive only - not a
  // clinical risk level). Recomputed on every save.
  riskFlags: {
    ideationPresent: { type: Boolean, default: false },
    intentOrPlan: { type: Boolean, default: false },
    suicidalBehavior: { type: Boolean, default: false },
    selfInjury: { type: Boolean, default: false },
    anyPositive: { type: Boolean, default: false },
  },

  createdBy: {
    type: String,
  },
  // The author's immutable User._id - ownership should key on this, not
  // createdBy (an editable email). See routes/api/SeriousIncidentReport.js.
  createdById: {
    type: String,
  },
  createdByName: {
    type: String,
  },
  // Whoever moved the form to COMPLETED - the form's signer, whose profile
  // signature the report view shows (see submittedFields in
  // utils/formIntegrity.js). May differ from createdBy for a handed-off draft.
  submittedBy: {
    type: String,
  },
  submittedById: {
    type: String,
  },
  submittedByName: {
    type: String,
  },
  submittedAt: {
    type: Date,
  },
  lastEditDate: {
    type: Date,
    default: Date.now,
  },
  // Who made the most recent change (see utils/formIntegrity.js) -
  // createdBy* stays the original author.
  lastEditedBy: {
    type: String,
  },
  lastEditedById: {
    type: String,
  },
  lastEditedByName: {
    type: String,
  },
  homeId: {
    type: String,
  },
  formType: {
    type: String,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  approvedBy: {
    type: String,
  },
  approvedByName: {
    type: String,
  },
  approvedByDate: {
    type: Date,
  },
  approvedSig: {
    type: Array,
  },

  createDate: {
    type: Date,
  },
  // See models/BodyCheck.js - maintained by utils/applyCreateDateEdit.js.
  originalCreateDate: {
    type: Date,
  },
  createDateEditedBy: {
    type: String,
  },
  createDateEditedAt: {
    type: Date,
  },
  status: {
    type: String,
  },
});

module.exports = CssrsScreening = mongoose.model("cssrsScreening", CssrsScreeningSchema);
