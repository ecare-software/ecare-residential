import React, { Component } from "react";
import FormError from "../FormMods/FormError";
import FormAlert from "../Forms/FormAlert";
import "../../App.css";
import Axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { Form } from "react-bootstrap";
import ClientOption from "../../utils/ClientOption.util";
import SignatureCanvas from "react-signature-canvas";
import { GetUserSig } from "../../utils/GetUserSig";
import { FormSuccessAlert } from "../../utils/FormSuccessAlert";
import { FormSavedAlert } from "../../utils/FormSavedAlert";
import { isAdminUser } from "../../utils/AdminReportingRoles";
import TextareaAutosize from "react-textarea-autosize";
import { Container, Row, Col } from "react-bootstrap";

// Columbia-Suicide Severity Rating Scale (C-SSRS), Pediatric - Since Last
// Contact (version 6/23/10). Item text, definitions, and suggested probes
// are reproduced verbatim from the instrument. The skip logic here mirrors
// normalizeScreening in routes/api/cssrsScreening.js, which is
// authoritative and re-applies it on every save.

const FORM_TITLE = "C-SSRS Screening";
const FULL_TITLE =
  "Columbia-Suicide Severity Rating Scale (C-SSRS) - Pediatric - Since Last Contact";
const API_ROUTE = "/api/cssrsScreening";
const AUTO_SAVE_MS = 7000;

const DISCLAIMER =
  "This scale is intended to be used by individuals who have received training in its administration. The questions contained in the Columbia-Suicide Severity Rating Scale are suggested probes. Ultimately, the determination of the presence of suicidal ideation or behavior depends on the judgment of the individual administering the scale.";

const COPYRIGHT =
  "© 2008 The Research Foundation for Mental Hygiene, Inc. C-SSRS—Pediatric – Since Last Contact (Version 6/23/10)";

const IDEATION_ITEMS = [
  {
    key: "wishToBeDead",
    title: "1. Wish to be Dead",
    definition:
      "Subject endorses thoughts about a wish to be dead or not alive anymore, or wish to fall asleep and not wake up.",
    probes: [
      "Have you thought about being dead or what it would be like to be dead?",
      "Have you wished you were dead or wished you could go to sleep and never wake up?",
      "Do you wish you weren't alive anymore?",
    ],
  },
  {
    key: "nonSpecificActiveThoughts",
    title: "2. Non-Specific Active Suicidal Thoughts",
    definition:
      "General, non-specific thoughts of wanting to end one's life/commit suicide (e.g., \"I've thought about killing myself\") without thoughts of ways to kill oneself/associated methods, intent, or plan during the assessment period.",
    probes: [
      "Have you thought about doing something to make yourself not alive anymore?",
      "Have you had any thoughts about killing yourself?",
    ],
  },
  {
    key: "activeWithMethods",
    title: "3. Active Suicidal Ideation with Any Methods (Not Plan) without Intent to Act",
    definition:
      "Subject endorses thoughts of suicide and has thought of at least one method during the assessment period. This is different than a specific plan with time, place or method details worked out (e.g., thought of method to kill self but not a specific plan). Includes person who would say, \"I thought about taking an overdose but I never made a specific plan as to when, where or how I would actually do it…and I would never go through with it.\"",
    probes: [
      "Have you thought about how you would do that or how you would make yourself not alive anymore (kill yourself)? What did you think about?",
    ],
  },
  {
    key: "activeWithIntent",
    title: "4. Active Suicidal Ideation with Some Intent to Act, without Specific Plan",
    definition:
      "Active suicidal thoughts of killing oneself and subject reports having some intent to act on such thoughts, as opposed to \"I have the thoughts but I definitely will not do anything about them.\"",
    probes: [
      "When you thought about making yourself not alive anymore (or killing yourself), did you think that this was something you might actually do?",
      "This is different from (as opposed to) having the thoughts but knowing you wouldn't do anything about it.",
    ],
  },
  {
    key: "activeWithPlanAndIntent",
    title: "5. Active Suicidal Ideation with Specific Plan and Intent",
    definition:
      "Thoughts of killing oneself with details of plan fully or partially worked out and subject has some intent to carry it out.",
    probes: [
      "Have you decided how or when you would make yourself not alive anymore/kill yourself? Have you planned out (worked out the details of) how you would do it?",
      "What was your plan?",
      "When you made this plan (or worked out these details), was any part of you thinking about actually doing it?",
    ],
  },
];

// Items 3-5 are only asked if item 2 is "yes".
const ACTIVE_IDEATION_KEYS = ["activeWithMethods", "activeWithIntent", "activeWithPlanAndIntent"];

const FREQUENCY_OPTIONS = [
  [1, "(1) Only one time"],
  [2, "(2) A few times"],
  [3, "(3) A lot"],
  [4, "(4) All the time"],
  [0, "(0) Don't know/Not applicable"],
];

const COUNTED_BEHAVIOR_ITEMS = [
  {
    key: "actualAttempt",
    title: "Actual Attempt",
    countLabel: "Total # of Attempts",
    definition: [
      "A potentially self-injurious act committed with at least some wish to die, as a result of act. Behavior was in part thought of as method to kill oneself. Intent does not have to be 100%. If there is any intent/desire to die associated with the act, then it can be considered an actual suicide attempt. There does not have to be any injury or harm, just the potential for injury or harm. If person pulls trigger while gun is in mouth but gun is broken so no injury results, this is considered an attempt.",
      "Inferring Intent: Even if an individual denies intent/wish to die, it may be inferred clinically from the behavior or circumstances. For example, a highly lethal act that is clearly not an accident so no other intent but suicide can be inferred (e.g., gunshot to head, jumping from window of a high floor/story). Also, if someone denies intent to die, but they thought that what they did could be lethal, intent may be inferred.",
    ],
    probes: [
      "Did you do anything to try to kill yourself or make yourself not alive anymore? What did you do?",
      "Did you hurt yourself on purpose? Why did you do that?",
      "Did you ______ as a way to end your life?",
      "Did you want to die (even a little) when you ______?",
      "Were you trying to make yourself not alive anymore when you ______?",
      "Or did you think it was possible you could have died from ______?",
      "Or did you do it purely for other reasons, not at all to end your life or kill yourself (like to make yourself feel better, or get something else to happen)? (Self-Injurious Behavior without suicidal intent)",
    ],
  },
  {
    key: "interruptedAttempt",
    title: "Interrupted Attempt",
    countLabel: "Total # of interrupted",
    definition: [
      "When the person is interrupted (by an outside circumstance) from starting the potentially self-injurious act (if not for that, actual attempt would have occurred).",
      "Overdose: Person has pills in hand but is stopped from ingesting. Once they ingest any pills, this becomes an attempt rather than an interrupted attempt. Shooting: Person has gun pointed toward self, gun is taken away by someone else, or is somehow prevented from pulling trigger. Once they pull the trigger, even if the gun fails to fire, it is an attempt. Jumping: Person is poised to jump, is grabbed and taken down from ledge. Hanging: Person has noose around neck but has not yet started to hang - is stopped from doing so.",
    ],
    probes: [
      "Has there been a time when you started to do something to make yourself not alive anymore (end your life or kill yourself) but someone or something stopped you before you actually did anything? What did you do?",
    ],
  },
  {
    key: "abortedAttempt",
    title: "Aborted Attempt or Self-Interrupted Attempt",
    countLabel: "Total # of aborted or self-interrupted",
    definition: [
      "When person begins to take steps toward making a suicide attempt, but stops themselves before they actually have engaged in any self-destructive behavior. Examples are similar to interrupted attempts, except that the individual stops him/herself, instead of being stopped by something else.",
    ],
    probes: [
      "Has there been a time when you started to do something to make yourself not alive anymore (end your life or kill yourself) but you changed your mind (stopped yourself) before you actually did anything? What did you do?",
    ],
  },
  {
    key: "preparatoryActs",
    title: "Preparatory Acts or Behavior",
    countLabel: "Total # of preparatory acts",
    definition: [
      "Acts or preparation towards imminently making a suicide attempt. This can include anything beyond a verbalization or thought, such as assembling a specific method (e.g., buying pills, purchasing a gun) or preparing for one's death by suicide (e.g., giving things away, writing a suicide note).",
    ],
    probes: [
      "Have you done anything to get ready to make yourself not alive anymore (to end your life or kill yourself)- like giving things away, writing a goodbye note, getting things you need to kill yourself?",
    ],
  },
];

const ACTUAL_LETHALITY_OPTIONS = [
  [0, "0. No physical damage or very minor physical damage (e.g., surface scratches)."],
  [1, "1. Minor physical damage (e.g., lethargic speech; first-degree burns; mild bleeding; sprains)."],
  [2, "2. Moderate physical damage; medical attention needed (e.g., conscious but sleepy, somewhat responsive; second-degree burns; bleeding of major vessel)."],
  [3, "3. Moderately severe physical damage; medical hospitalization and likely intensive care required (e.g., comatose with reflexes intact; third-degree burns less than 20% of body; extensive blood loss but can recover; major fractures)."],
  [4, "4. Severe physical damage; medical hospitalization with intensive care required (e.g., comatose without reflexes; third-degree burns over 20% of body; extensive blood loss with unstable vital signs; major damage to a vital area)."],
  [5, "5. Death"],
];

const POTENTIAL_LETHALITY_OPTIONS = [
  [0, "0 = Behavior not likely to result in injury"],
  [1, "1 = Behavior likely to result in injury but not likely to cause death"],
  [2, "2 = Behavior likely to result in death despite available medical care"],
];

const localNowIso = () =>
  new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString();

const yesNo = () => ({ answer: "", describe: "" });
const counted = () => ({ answer: "", count: null, describe: "" });

const blankIdeation = () =>
  IDEATION_ITEMS.reduce((acc, item) => ({ ...acc, [item.key]: yesNo() }), {});

const blankBehavior = () => ({
  actualAttempt: counted(),
  nonSuicidalSelfInjury: yesNo(),
  selfInjuryIntentUnknown: yesNo(),
  interruptedAttempt: counted(),
  abortedAttempt: counted(),
  preparatoryActs: counted(),
  suicide: yesNo(),
});

const isYes = (item) => !!item && item.answer === "yes";

// Mirrors computeRiskFlags/mostSevereIdeationType in the route. Descriptive
// only - the instrument leaves risk determination to the administrator.
const summarize = (ideation, behavior) => {
  let mostSevereType = 0;
  IDEATION_ITEMS.forEach((item, index) => {
    if (isYes(ideation[item.key])) mostSevereType = index + 1;
  });
  const ideationPresent = isYes(ideation.wishToBeDead) || isYes(ideation.nonSpecificActiveThoughts);
  const intentOrPlan =
    isYes(ideation.activeWithIntent) || isYes(ideation.activeWithPlanAndIntent);
  const suicidalBehavior = COUNTED_BEHAVIOR_ITEMS.some((item) => isYes(behavior[item.key]));
  const selfInjury =
    isYes(behavior.nonSuicidalSelfInjury) || isYes(behavior.selfInjuryIntentUnknown);
  const anyPositive =
    ideationPresent || intentOrPlan || suicidalBehavior || selfInjury || isYes(behavior.suicide);
  return { mostSevereType, ideationPresent, intentOrPlan, suicidalBehavior, selfInjury, anyPositive };
};

class CssrsScreening extends Component {
  constructor(props) {
    super(props);
    this.autoSaveInterval = null;
    this.autoSaveCreated = false;
    this.state = {
      ...this.blankFields(),
      createdBy: this.props.valuesSet === true ? "" : this.props.userObj.email,
      createdByName:
        this.props.valuesSet === true
          ? ""
          : this.props.userObj.firstName + " " + this.props.userObj.lastName,
      homeId: this.props.valuesSet === true ? "" : this.props.userObj.homeId,
      formHasError: false,
      formSubmitted: false,
      formErrorMessage: "",
      loadingClients: true,
      clients: [],
    };
  }

  blankFields = () => ({
    _id: "",
    lastEditDate: null,
    childMeta_name: "",
    clientId: "",
    assessmentDateTime: localNowIso().slice(0, 16),
    administeredBy: this.props.userObj
      ? `${this.props.userObj.firstName} ${this.props.userObj.lastName}`
      : "",
    ideation: blankIdeation(),
    mostSevereIdeationDescription: "",
    ideationFrequency: null,
    ideationFrequencyResponse: "",
    behavior: blankBehavior(),
    mostLethalAttemptDate: "",
    actualLethality: null,
    potentialLethality: null,
    actionsTaken: "",
    createDate: localNowIso(),
    status: "IN PROGRESS",
    childSelected: false,
  });

  toggleSuccessAlert = () => {
    this.setState({
      formSubmitted: !this.state.formSubmitted,
      loadingClients: false,
    });
  };

  toggleErrorAlert = () => {
    this.setState({
      formHasError: !this.state.formHasError,
      formErrorMessage: "",
    });
  };

  showError = (message) => {
    window.scrollTo(0, 0);
    this.setState({
      formHasError: true,
      formErrorMessage: message,
      loadingClients: false,
    });
  };

  handleFieldInput = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleFieldInputDate = (event) => {
    this.setState({ [event.target.id]: event.target.value.concat(":00.000Z") });
  };

  handleCode = (field) => (event) => {
    const value = event.target.value === "" ? null : Number(event.target.value);
    const update = { [field]: value };
    // Potential Lethality is only answered when Actual Lethality is 0.
    if (field === "actualLethality" && value !== 0) update.potentialLethality = null;
    this.setState(update);
  };

  setIdeationAnswer = (key, answer) => {
    const ideation = { ...this.state.ideation, [key]: { ...this.state.ideation[key], answer } };
    // Items 3-5 are only asked if item 2 is "yes" - clear them as soon as
    // they no longer apply, matching what the server stores.
    if (key === "nonSpecificActiveThoughts" && answer !== "yes") {
      ACTIVE_IDEATION_KEYS.forEach((k) => {
        ideation[k] = yesNo();
      });
    }
    const update = { ideation };
    if (!isYes(ideation.wishToBeDead) && !isYes(ideation.nonSpecificActiveThoughts)) {
      update.mostSevereIdeationDescription = "";
      update.ideationFrequency = null;
      update.ideationFrequencyResponse = "";
    }
    this.setState(update);
  };

  setIdeationDescribe = (key, describe) => {
    this.setState({
      ideation: { ...this.state.ideation, [key]: { ...this.state.ideation[key], describe } },
    });
  };

  setBehaviorField = (key, field, value) => {
    const item = { ...this.state.behavior[key], [field]: value };
    if (field === "answer" && value !== "yes" && "count" in item) {
      item.count = null;
      item.describe = "";
    }
    const update = { behavior: { ...this.state.behavior, [key]: item } };
    if (key === "actualAttempt" && field === "answer" && value !== "yes") {
      update.mostLethalAttemptDate = "";
      update.actualLethality = null;
      update.potentialLethality = null;
    }
    this.setState(update);
  };

  setBehaviorCount = (key, rawValue) => {
    if (rawValue === "") return this.setBehaviorField(key, "count", null);
    const value = parseInt(rawValue, 10);
    if (Number.isNaN(value) || value < 0) return;
    this.setBehaviorField(key, "count", value);
  };

  // Only the fields the route accepts - never UI state, identity, approval,
  // or the derived fields (which the server recomputes).
  buildPayload = (status) => ({
    homeId: this.state.homeId,
    childMeta_name: this.state.childMeta_name,
    clientId: this.state.clientId,
    assessmentDateTime: this.state.assessmentDateTime,
    administeredBy: this.state.administeredBy,
    ideation: this.state.ideation,
    mostSevereIdeationDescription: this.state.mostSevereIdeationDescription,
    ideationFrequency: this.state.ideationFrequency,
    ideationFrequencyResponse: this.state.ideationFrequencyResponse,
    behavior: this.state.behavior,
    mostLethalAttemptDate: this.state.mostLethalAttemptDate,
    actualLethality: this.state.actualLethality,
    potentialLethality: this.state.potentialLethality,
    actionsTaken: this.state.actionsTaken,
    createDate: this.state.createDate,
    status,
  });

  resetForm = () => {
    this.setState(this.blankFields());
  };

  autoSave = async () => {
    if (!this.state.childMeta_name) return;
    try {
      if (this.autoSaveCreated) {
        // The create is still in flight - nothing to update yet.
        if (!this.state._id) return;
        const { data } = await Axios.put(
          `${API_ROUTE}/${this.state.homeId}/${this.state._id}`,
          this.buildPayload(this.state.status)
        );
        this.setState({ lastEditDate: data.lastEditDate });
      } else {
        // Set before the request resolves so a slow create can't be
        // followed by a second create on the next tick.
        this.autoSaveCreated = true;
        const { data } = await Axios.post(API_ROUTE, this.buildPayload(this.state.status));
        this.setState({ _id: data._id, lastEditDate: data.lastEditDate });
      }
    } catch (e) {
      console.log(e);
      if (!this.state._id) this.autoSaveCreated = false;
      this.showError(`Error saving ${FORM_TITLE}`);
    }
  };

  submit = async (save) => {
    const status = save ? this.state.status : "COMPLETED";
    clearInterval(this.autoSaveInterval);
    try {
      if (this.props.valuesSet || this.state._id) {
        const { data } = await Axios.put(
          `${API_ROUTE}/${this.state.homeId}/${this.state._id}`,
          this.buildPayload(status)
        );
        this.setState({ ...data, loadingClients: false });
        if (this.props.doUpdateFormDates) {
          this.props.doUpdateFormDates(data.createDate);
        }
      } else {
        const { data } = await Axios.post(API_ROUTE, this.buildPayload(status));
        this.setState({ ...data, loadingClients: false });
      }
      window.scrollTo(0, 0);
      this.toggleSuccessAlert();
      if (!this.props.valuesSet) {
        // A fresh blank form for the next screening - drop the saved
        // record and restart autosave from scratch.
        this.autoSaveCreated = false;
        this.resetForm();
        this.startAutoSave();
      }
    } catch (e) {
      console.log(e);
      const serverMessage = e.response && e.response.data && e.response.data.error;
      this.showError(serverMessage || `Error submitting ${FORM_TITLE}`);
      // A rejected Submit (e.g. unanswered items) leaves the draft open -
      // keep autosaving it.
      if (!this.props.valuesSet) this.startAutoSave();
    }
  };

  validateForm = async (save) => {
    if (!save) {
      const { data: createdUserData } = await GetUserSig(
        this.props.userObj.email,
        this.props.userObj.homeId
      );
      if (
        !createdUserData.signature ||
        Array.isArray(createdUserData.signature) === false ||
        !createdUserData.signature.length > 0
      ) {
        this.showError(
          `User signature required to submit a form. Create a new signature under 'Manage Profile'.`
        );
        return;
      }
    }
    this.setState({ loadingClients: true });
    this.submit(save);
  };

  startAutoSave = () => {
    clearInterval(this.autoSaveInterval);
    this.autoSaveInterval = setInterval(this.autoSave, AUTO_SAVE_MS);
  };

  componentWillUnmount() {
    clearInterval(this.autoSaveInterval);
  }

  setValues = async () => {
    const formData = this.props.formData;
    await this.setState({
      ...formData,
      ideation: { ...blankIdeation(), ...(formData.ideation || {}) },
      behavior: { ...blankBehavior(), ...(formData.behavior || {}) },
      loadingClients: false,
    });

    try {
      const { data: createdUserData } = await GetUserSig(
        // The signer is whoever submitted the form (older records: its creator).
        formData.submittedBy || formData.createdBy,
        this.props.userObj.homeId
      );
      if (this.staffSigCanvas && createdUserData.signature && createdUserData.signature.length) {
        this.staffSigCanvas.fromData(createdUserData.signature);
      }
      if (this.staffSigCanvas) this.staffSigCanvas.off();
    } catch (e) {
      console.log(e);
    }
  };

  getClients = async () => {
    try {
      let { data: clients } = await Axios.get(
        `/api/client/${this.props.userObj.homeId}?active=true`
      );
      clients = clients.filter((client) => {
        return !client.hasOwnProperty("active") || client.active === true;
      });
      this.setState({ clients, loadingClients: false });
    } catch (e) {
      console.log(e);
      alert("Error loading clients");
    }
  };

  async componentDidMount() {
    if (this.props.valuesSet) {
      this.setValues();
    } else {
      await this.getClients();
      this.startAutoSave();
    }
  }

  handleClientSelect = (event) => {
    if (!event.target.value) return;
    const client = JSON.parse(event.target.value);
    this.setState({
      childSelected: true,
      childMeta_name: client.childMeta_name,
      clientId: client._id,
    });
  };

  // Approved records are read-only (the route rejects non-admin edits to
  // them, and the save buttons are hidden once approved).
  isLocked = () => {
    if (!this.props.valuesSet) return false;
    const { formData, userObj } = this.props;
    if (formData.approved) return true;
    // Mirrors canEditForm in utils/formIntegrity.js: a submitted form is
    // read-only except to its signer (whoever submitted it, else - older
    // records - its creator) or an admin.
    if (formData.status !== "COMPLETED" || isAdminUser(userObj)) return false;
    const isAuthor = formData.submittedById
      ? formData.submittedById === userObj._id
      : formData.createdById
      ? formData.createdById === userObj._id
      : formData.createdBy === userObj.email;
    return !isAuthor;
  };

  isDisabled = () => {
    if (this.isLocked()) return true;
    return !this.props.valuesSet && !this.state.childSelected;
  };

  // Unique per rendered form - the print view renders many forms on one
  // page, and radio groups with the same name would interfere.
  groupName = (key) => `cssrs-${this.state._id || "new"}-${key}`;

  renderYesNo = (key, item, onChange) => {
    const disabled = this.isDisabled();
    return (
      <div className="d-flex" style={{ gap: 20 }}>
        {[
          ["yes", "Yes"],
          ["no", "No"],
        ].map(([value, label]) => (
          <Form.Check
            key={value}
            inline
            type="radio"
            className="d-flex align-items-center"
            id={`${this.groupName(key)}-${value}`}
            name={this.groupName(key)}
            label={label}
            checked={item.answer === value}
            disabled={disabled}
            onChange={() => onChange(value)}
          />
        ))}
      </div>
    );
  };

  renderProbes = (probes) => (
    <ul className="mb-2" style={{ paddingLeft: 20 }}>
      {probes.map((probe) => (
        <li key={probe}>
          <strong>
            <i>{probe}</i>
          </strong>
        </li>
      ))}
    </ul>
  );

  renderItemCard = ({ title, definitions, probes, children }) => (
    <div
      className="logInInputField"
      style={{ border: "1px solid #ccc", borderRadius: 6, padding: 12, marginBottom: 12 }}
    >
      <h6 style={{ fontWeight: 700 }}>{title}</h6>
      {definitions.map((text) => (
        <p key={text} style={{ fontSize: "0.9em", marginBottom: 6 }}>
          {text}
        </p>
      ))}
      {probes && this.renderProbes(probes)}
      {children}
    </div>
  );

  renderDescribe = (value, onChange) => (
    <div className="form-group mt-2 mb-0">
      <label className="control-label">If yes, describe:</label>
      <TextareaAutosize
        className="form-control"
        value={value}
        disabled={this.isDisabled()}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );

  renderPositiveBanner = (summary) =>
    summary.anyPositive && (
      <div className="alert alert-danger alert-inline" role="alert">
        <strong>This screening has positive responses</strong>
        {": "}
        {[
          summary.ideationPresent && "suicidal ideation",
          summary.intentOrPlan && "ideation with intent or plan",
          summary.suicidalBehavior && "suicidal behavior",
          summary.selfInjury && "self-injurious behavior",
        ]
          .filter(Boolean)
          .join(", ") || "see responses below"}
        . Follow your facility's suicide risk and safety protocol now: ensure the child's
        immediate safety and notify the supervisor on duty. Record what was done under
        Actions Taken.
      </div>
    );

  renderIdeation = (summary) => {
    const disabled = this.isDisabled();
    const { ideation } = this.state;
    const askActive = isYes(ideation.nonSpecificActiveThoughts);
    return (
      <>
        <h4 className="mt-3">Suicidal Ideation</h4>
        <p className="text-muted" style={{ fontSize: "0.9em" }}>
          Ask questions 1 and 2. If both are negative, proceed to "Suicidal Behavior" section. If
          the answer to question 2 is "yes", ask questions 3, 4 and 5. If the answer to question 1
          and/or 2 is "yes", complete "Intensity of Ideation" section below.
        </p>
        {IDEATION_ITEMS.map((item) => {
          if (ACTIVE_IDEATION_KEYS.includes(item.key) && !askActive) return null;
          const value = ideation[item.key];
          return (
            <React.Fragment key={item.key}>
              {this.renderItemCard({
                title: item.title,
                definitions: [item.definition],
                probes: item.probes,
                children: (
                  <>
                    {this.renderYesNo(item.key, value, (answer) =>
                      this.setIdeationAnswer(item.key, answer)
                    )}
                    {isYes(value) &&
                      this.renderDescribe(value.describe, (text) =>
                        this.setIdeationDescribe(item.key, text)
                      )}
                  </>
                ),
              })}
            </React.Fragment>
          );
        })}
        {!askActive && (
          <p className="text-muted hide-on-print" style={{ fontSize: "0.9em" }}>
            Questions 3, 4 and 5 are asked only if the answer to question 2 is "yes".
          </p>
        )}

        {summary.ideationPresent && (
          <>
            <h5 className="mt-3">Intensity of Ideation</h5>
            <p className="text-muted" style={{ fontSize: "0.9em" }}>
              The following feature should be rated with respect to the most severe type of
              ideation (i.e., 1-5 from above, with 1 being the least severe and 5 being the most
              severe).
            </p>
            <Row>
              <Col md={4} className="print-column">
                <div className="form-group logInInputField">
                  <label className="control-label">Most Severe Ideation: Type # (1-5)</label>
                  <input
                    className="form-control"
                    type="text"
                    value={summary.mostSevereType || ""}
                    disabled
                    title="Set automatically from the most severe item answered Yes above."
                  />
                </div>
              </Col>
              <Col md={8} className="print-column">
                <div className="form-group logInInputField">
                  <label className="control-label">Description of Ideation</label>
                  <TextareaAutosize
                    id="mostSevereIdeationDescription"
                    className="form-control"
                    value={this.state.mostSevereIdeationDescription}
                    disabled={disabled}
                    onChange={this.handleFieldInput}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={4} className="print-column">
                <div className="form-group logInInputField">
                  <label className="control-label">
                    Frequency - <i>How many times have you had these thoughts?</i>
                  </label>
                  <Form.Control
                    as="select"
                    value={this.state.ideationFrequency === null ? "" : this.state.ideationFrequency}
                    disabled={disabled}
                    onChange={this.handleCode("ideationFrequency")}
                  >
                    <option value="">Choose...</option>
                    {FREQUENCY_OPTIONS.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Form.Control>
                </div>
              </Col>
              <Col md={8} className="print-column">
                <div className="form-group logInInputField">
                  <label className="control-label">Write response</label>
                  <TextareaAutosize
                    id="ideationFrequencyResponse"
                    className="form-control"
                    value={this.state.ideationFrequencyResponse}
                    disabled={disabled}
                    onChange={this.handleFieldInput}
                  />
                </div>
              </Col>
            </Row>
          </>
        )}
      </>
    );
  };

  renderSelfInjuryQuestion = (key, label) => (
    <div className="d-flex flex-wrap align-items-center mt-2" style={{ gap: 16 }}>
      <strong>{label}</strong>
      {this.renderYesNo(key, this.state.behavior[key], (answer) =>
        this.setBehaviorField(key, "answer", answer)
      )}
    </div>
  );

  renderBehavior = () => {
    const disabled = this.isDisabled();
    const { behavior } = this.state;
    return (
      <>
        <h4 className="mt-3">Suicidal Behavior</h4>
        <p className="text-muted" style={{ fontSize: "0.9em" }}>
          (Check all that apply, so long as these are separate events; must ask about all types)
        </p>
        {COUNTED_BEHAVIOR_ITEMS.map((item) => {
          const value = behavior[item.key];
          return (
            <React.Fragment key={item.key}>
              {this.renderItemCard({
                title: item.title,
                definitions: item.definition,
                probes: item.probes,
                children: (
                  <>
                    {this.renderYesNo(item.key, value, (answer) =>
                      this.setBehaviorField(item.key, "answer", answer)
                    )}
                    {isYes(value) && (
                      <>
                        <div className="form-group mt-2 mb-0" style={{ maxWidth: 260 }}>
                          <label className="control-label">{item.countLabel}</label>
                          <input
                            className="form-control"
                            type="number"
                            min="1"
                            step="1"
                            value={value.count === null ? "" : value.count}
                            disabled={disabled}
                            onChange={(e) => this.setBehaviorCount(item.key, e.target.value)}
                          />
                        </div>
                        {this.renderDescribe(value.describe, (text) =>
                          this.setBehaviorField(item.key, "describe", text)
                        )}
                      </>
                    )}
                    {item.key === "actualAttempt" && (
                      <>
                        {this.renderSelfInjuryQuestion(
                          "nonSuicidalSelfInjury",
                          "Has subject engaged in Non-Suicidal Self-Injurious Behavior?"
                        )}
                        {this.renderSelfInjuryQuestion(
                          "selfInjuryIntentUnknown",
                          "Has subject engaged in Self-Injurious Behavior, intent unknown?"
                        )}
                      </>
                    )}
                  </>
                ),
              })}
            </React.Fragment>
          );
        })}
        {this.renderItemCard({
          title: "Suicide",
          definitions: ["Death by suicide occurred since last assessment."],
          children: this.renderYesNo("suicide", behavior.suicide, (answer) =>
            this.setBehaviorField("suicide", "answer", answer)
          ),
        })}

        {isYes(behavior.actualAttempt) && (
          <>
            <h5 className="mt-3">Lethality</h5>
            <Row>
              <Col md={4} className="print-column">
                <div className="form-group logInInputField">
                  <label className="control-label">Most Lethal Attempt Date</label>
                  <input
                    id="mostLethalAttemptDate"
                    className="form-control"
                    type="date"
                    value={this.state.mostLethalAttemptDate}
                    disabled={disabled}
                    onChange={this.handleFieldInput}
                  />
                </div>
              </Col>
              <Col md={8} className="print-column">
                <div className="form-group logInInputField">
                  <label className="control-label">Actual Lethality/Medical Damage</label>
                  <Form.Control
                    as="select"
                    value={this.state.actualLethality === null ? "" : this.state.actualLethality}
                    disabled={disabled}
                    onChange={this.handleCode("actualLethality")}
                  >
                    <option value="">Enter Code...</option>
                    {ACTUAL_LETHALITY_OPTIONS.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Form.Control>
                </div>
              </Col>
            </Row>
            {this.state.actualLethality === 0 && (
              <div className="form-group logInInputField">
                <label className="control-label">
                  Potential Lethality: Only Answer if Actual Lethality=0
                </label>
                <p style={{ fontSize: "0.9em", marginBottom: 6 }}>
                  Likely lethality of actual attempt if no medical damage (the following examples,
                  while having no actual medical damage, had potential for very serious lethality:
                  put gun in mouth and pulled the trigger but gun fails to fire so no medical
                  damage; laying on train tracks with oncoming train but pulled away before run
                  over).
                </p>
                <Form.Control
                  as="select"
                  value={
                    this.state.potentialLethality === null ? "" : this.state.potentialLethality
                  }
                  disabled={disabled}
                  onChange={this.handleCode("potentialLethality")}
                >
                  <option value="">Enter Code...</option>
                  {POTENTIAL_LETHALITY_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Form.Control>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  renderFields = () => {
    const disabled = this.isDisabled();
    const isAdmin = isAdminUser(this.props.userObj);
    const summary = summarize(this.state.ideation, this.state.behavior);
    return (
      <Container className="print-container cssrs-screening">
        <div className="alert alert-secondary alert-inline" style={{ fontSize: "0.9em" }}>
          <strong>{FULL_TITLE}</strong>
          <br />
          <i>{DISCLAIMER}</i>
        </div>
        {this.renderPositiveBanner(summary)}
        <Row>
          <Col md={6} className="print-column">
            <div className="form-group logInInputField">
              <label className="control-label">Create Date</label>{" "}
              <input
                id="createDate"
                onChange={this.handleFieldInputDate}
                value={this.state.createDate ? this.state.createDate.slice(0, -8) : ""}
                className="form-control"
                type="datetime-local"
                // Back-dating an already-saved record is admin/supervisor
                // only (see utils/applyCreateDateEdit.js server-side).
                disabled={this.props.valuesSet ? !isAdmin : false}
                title={
                  this.props.valuesSet && !isAdmin
                    ? "Only an admin or supervisor can change the creation date after a form has been saved."
                    : undefined
                }
              />{" "}
              {this.state.createDateEditedBy && (
                <small className="text-muted d-block mt-1">
                  Creation date corrected by {this.state.createDateEditedBy}
                  {this.state.createDateEditedAt
                    ? ` on ${new Date(this.state.createDateEditedAt).toLocaleString()}`
                    : ""}
                  {this.state.originalCreateDate
                    ? ` (originally ${new Date(this.state.originalCreateDate).toLocaleString()})`
                    : ""}
                </small>
              )}
            </div>
          </Col>
          <Col md={6} className="print-column">
            <div className="form-group logInInputField">
              <label className="control-label">Child's Name</label>{" "}
              {this.props.valuesSet ? (
                <input
                  id="childMeta_name"
                  value={this.state.childMeta_name}
                  className="form-control"
                  type="text"
                  disabled
                />
              ) : (
                <Form.Control as="select" defaultValue={null} onChange={this.handleClientSelect}>
                  {[null, ...this.state.clients].map((client) => (
                    <ClientOption key={client ? client._id : "none"} data={client} />
                  ))}
                </Form.Control>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="print-column">
            <div className="form-group logInInputField">
              <label className="control-label">Date/Time of Assessment</label>{" "}
              <input
                id="assessmentDateTime"
                onChange={this.handleFieldInput}
                value={this.state.assessmentDateTime}
                className="form-control"
                type="datetime-local"
                disabled={disabled}
              />
            </div>
          </Col>
          <Col md={6} className="print-column">
            <div className="form-group logInInputField">
              <label className="control-label">Administered By</label>{" "}
              <input
                id="administeredBy"
                onChange={this.handleFieldInput}
                value={this.state.administeredBy}
                className="form-control"
                type="text"
                disabled={disabled}
              />
            </div>
          </Col>
        </Row>

        {this.renderIdeation(summary)}
        {this.renderBehavior()}

        <h5 className="mt-3">Actions Taken</h5>
        {this.renderPositiveBanner(summary)}
        <div className="form-group logInInputField">
          <label className="control-label">
            Who was notified and what safety steps were taken (if any responses were positive)
          </label>
          <TextareaAutosize
            id="actionsTaken"
            className="form-control"
            minRows={3}
            value={this.state.actionsTaken}
            disabled={disabled}
            onChange={this.handleFieldInput}
          />
        </div>
        <p className="text-muted" style={{ fontSize: "0.8em" }}>
          {COPYRIGHT}
        </p>
      </Container>
    );
  };

  renderSaveButtons = () => {
    const disabled = this.isDisabled();
    return (
      <>
        <FormError errorId={this.props.id + "-error"} />
        <Row className="save-submit-row">
          <div style={{ display: "flex", width: "46%" }}>
            <button
              className="lightBtn hide hide-on-print save-submit-btn"
              style={{
                width: "100%",
                display: this.state.status === "COMPLETED" ? "none" : "block",
              }}
              disabled={disabled}
              onClick={() => {
                this.validateForm(true);
              }}
            >
              Finish Later
            </button>
          </div>
          <div style={{ display: "flex", width: "46%" }}>
            <button
              className="darkBtn hide hide-on-print save-submit-btn"
              style={{ width: "100%" }}
              disabled={disabled}
              onClick={() => {
                this.validateForm(false);
              }}
            >
              Submit
            </button>
          </div>
        </Row>
      </>
    );
  };

  renderAlerts = () =>
    this.state.formSubmitted || this.state.formHasError ? (
      <React.Fragment>
        {this.state.formSubmitted &&
          (this.props.valuesSet ? <FormSavedAlert /> : <FormSuccessAlert />)}
        <FormAlert
          doShow={this.state.formHasError}
          toggleErrorAlert={this.toggleErrorAlert}
          type="danger"
          heading="Error Submitting form"
        >
          <p>{this.state.formErrorMessage}</p>
        </FormAlert>
      </React.Fragment>
    ) : (
      <React.Fragment />
    );

  renderLoading = () => (
    <div className="formLoadingDiv">
      <div>
        <ClipLoader className="formSpinner" size={50} color={"#ffc107"} />
      </div>
      <p>Loading...</p>
    </div>
  );

  render() {
    if (!this.props.valuesSet) {
      return (
        <div className="formComp">
          {this.renderAlerts()}
          <div className="formTitleDiv">
            <h2 className="formTitle">{FORM_TITLE}</h2>
            <h5 className="text-center hide-on-print" style={{ color: "rgb(119 119 119 / 93%)" }}>
              {this.state.lastEditDate ? (
                <i>
                  {" "}
                  Last Saved:
                  {`${new Date(this.state.lastEditDate)
                    .toTimeString()
                    .replace(/\s.*/, "")} - ${new Date(this.state.lastEditDate).toDateString()}`}
                </i>
              ) : (
                "-"
              )}
            </h5>
          </div>
          {this.state.loadingClients && this.renderLoading()}
          <div style={{ display: this.state.loadingClients ? "none" : "block" }}>
            {this.renderFields()}
            {this.renderSaveButtons()}
          </div>
        </div>
      );
    }

    return (
      <div className="formComp">
        {this.renderAlerts()}
        <div className="formTitleDivReport">
          <h2 className="formTitle">{FORM_TITLE}</h2>
        </div>
        <div className="formFieldsMobileReport">
          {this.state.loadingClients && this.renderLoading()}
          <div style={{ display: this.state.loadingClients ? "none" : "block" }}>
            {this.renderFields()}
            <div
              className="sigSection"
              style={{ display: this.state.status === "IN PROGRESS" ? "none" : "block" }}
            >
              <label className="control-label">Staff Signature</label>{" "}
              <div id="sigCanvasDiv">
                <SignatureCanvas
                  ref={(ref) => {
                    this.staffSigCanvas = ref;
                  }}
                  style={{ border: "solid" }}
                  penColor="black"
                  clearOnResize={false}
                  canvasProps={{ width: 300, height: 100, className: "sigCanvas" }}
                  backgroundColor="#eeee"
                />
              </div>
              <small className="text-muted">
                {this.state.submittedByName || this.state.createdByName}
                {/* Creation date, not last-edited date - only the creation date
                    appears on a printed form. */}
                {this.state.createDate
                  ? ` - ${new Date(this.state.createDate).toLocaleDateString()}`
                  : ""}
              </small>
            </div>
            {!this.isLocked() && this.renderSaveButtons()}
          </div>
        </div>
      </div>
    );
  }
}

export default CssrsScreening;
