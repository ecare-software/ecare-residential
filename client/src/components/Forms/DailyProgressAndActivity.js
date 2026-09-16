import React, { Component } from "react";
import FormError from "../FormMods/FormError";
import FormAlert from "../Forms/FormAlert";
import "../../App.css";
import Axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { Form, Modal, Button } from "react-bootstrap";
import ClientOption from "../../utils/ClientOption.util";
import SignatureCanvas from "react-signature-canvas";
import { GetUserSig } from "../../utils/GetUserSig";
import { FormSuccessAlert } from "../../utils/FormSuccessAlert";
import { FormSavedAlert } from "../../utils/FormSavedAlert";
import { isAdminUser } from "../../utils/AdminReportingRoles";
import TextareaAutosize from "react-textarea-autosize";
import { Container, Row, Col } from "react-bootstrap";
import { FetchHomeData } from "../../utils/FetchHomeData";


/*
  missing from form
    "Restricted field Trip"

*/

const standardIncidentOptions = [
  "Other",
  "Cussing",
  "Encopresis",
  "Hallucinations (v)",
  "Horse-playing",
  "Night Terrors",
  "Poss. of Contraband",
  "Suicidal (gesture)",
  "Vandalism",
  "Defiance",
  "Enuresis",
  "Hallucinations (a)",
  "Non-compliance",
  "Yelling/Screaming",
  "Aggression (physical)",
  "Disrespecting Others",
  "Fighting",
  "Hospitalization (psych)",
  "Out-of-Area",
  "Property Destruction",
  "Skipping School",
  "Suspension",
  "Aggression (verbal)",
  "Gang Activity",
  "Homicidal (ideations)",
  "Poor Soc. Interaction",
  "School Problems",
  "Social Isolation",
  "Bullying",
  "D/A possession",
  "Grooming",
  "Homicidal (threats)",
  "Lying",
  "Poor Boundaries",
  "Theft/Stealing",
  "Illness/Injury"
];

const seriousIncidentOptions = [
  "Other",
  "Awol",
  "Hospitalization (med)",
  "Homicidal (attempt/gesture)",
  "SAO (victim)",
  "Poss. of a Weapon",
  "Drug/Alcohol Use",
  "Arrest",
  "SAO (self)",
  "Illness/Injury",
  "SAO (aggressor)",
  "Suicidal (threat)",
  "Terroristic Threat",
  "Suicidal (attempt)"
];

var interval = 0; // used for autosaving
let initAutoSave = false;
class DailyProgressAndActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incident_type: "",
      nature_of_incident: "",
      other_incident_description:"",
      childMeta_name: "",
      personal_hygiene: "",
      dressing: "",
      table_mannders: "",
      clothes_maintenace: "",
      self_feeding: "",
      care_of_property: "",
      maintenace_of_personal_space: "",
      household_chorse: "",
      informal_counseling: "",
      verbal_redirection: "",
      modeling: "",
      supervised_separation: "",
      provider_feedback_to_client: "",
      positive_reinforcement: "",
      other: "",
      home_restrictions: "",
      restricted_leisure_activity: "",
      no_allowance: "",
      other2: "",
      no_of_home_incidents: "",
      no_of_home_serious_incidents: "",
      no_of_home_restraints: "",
      no_of_school_incidents: "",
      no_of_school_restraints: "",
      illness_injury: "",
      level_of_supervison: "",
      summary_of_daily_schedule: "",
      summary_of_behavior_at_school: "",
      summary_of_behavior_at_home: "",
      therapeutic_recreational: "",
      therapeutic_value: "",
      phone_calls_or_visits: "",
      createdBy: this.props.valuesSet === true ? "" : this.props.userObj.email,
      createdByName:
        this.props.valuesSet === true
          ? ""
          : this.props.userObj.firstName + " " + this.props.userObj.lastName,
      lastEditDate: null,
      homeId: this.props.valuesSet === true ? "" : this.props.userObj.homeId,
      formHasError: false,
      formSubmitted: false,
      formErrorMessage: "",
      loadingClients: true,
      loadingSig: true,
      clients: [],
      clientId: "",
      createDate: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
      status: "IN PROGRESS",
      childSelected: false,
      signature1: [],
      signature2: [],
      twoSignaturesRequired: false,
      showIncidentModal: false,
      incidentModalMessage: "",
      pendingSuccessAlert: false,
    };
  }

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

  handleFieldInputDate = (event) => {
    var stateObj = {};
    if (event.target.id.indexOf(".") > -1) {
      let level1Obj = event.target.id.split(".")[0];
      let level2Obj = event.target.id.split(".")[1];

      let nestedProperty = { ...this.state[level1Obj] };
      nestedProperty[level2Obj] = event.target.value;
      stateObj[level1Obj] = nestedProperty;
    } else {
      stateObj[event.target.id] = event.target.value.concat(':00.000Z');
    }
    this.setState(stateObj);
  };

  handleFieldInput = (event) => {
    const {id, value} = event.target;
    var stateObj = {};

    // 👇 Special handling for Incident Type
    if (id === "incident_type") {
      stateObj.incident_type = value;
      stateObj.nature_of_incident = value === "No Incident" ? "No Incident" : "";
      this.setState(stateObj);
      return;
    }
    
    if (event.target.id.indexOf(".") > -1) {
      let level1Obj = event.target.id.split(".")[0];
      let level2Obj = event.target.id.split(".")[1];

      let nestedProperty = { ...this.state[level1Obj] };
      nestedProperty[level2Obj] = event.target.value;
      stateObj[level1Obj] = nestedProperty;
    } else {
      stateObj[event.target.id] = event.target.value;
    }
    this.setState(stateObj);
  };

  // Called once from componentDidMount (and again from componentDidUpdate
  // if userObj.homeId ever changes) - not from render(), which would refire
  // this on every keystroke for no benefit since homeId doesn't change
  // mid-session.
  //
  // Reads the home's own persisted twoSignatures flag (Home model), not a
  // hardcoded homeId list - kept in sync with the server's identical
  // isTwoSignatureHome() in routes/api/dailyProgressAndActivity.js, which
  // is the actual source of truth this client-side value only mirrors for
  // UI purposes (showing/hiding the second signature slot). The server
  // never trusts this value back from the client.
  doGetHomeInfo = async () => {
    try {
      const { data } = await FetchHomeData(this.props.userObj.homeId);
      // setState, not a direct mutation - this resolves asynchronously
      // (after the initial render, from componentDidMount/componentDidUpdate,
      // not render()), so without setState nothing tells React to re-render
      // once the real value is known. The signature2 UI's visibility reads
      // this same state field (see the render() condition near "signature2"),
      // so a home that becomes two-signature after this component already
      // rendered would otherwise never show the second signature slot.
      this.setState({ twoSignaturesRequired: !!data[0]?.twoSignatures });
      return (data)
    } catch (e) {
      console.log("Error fetching home info");
    };
  }

  resetForm = () => {
    // Cleared explicitly - without this, a fresh new-report form (which
    // reuses this same component instance after a create) inherited
    // whatever signature1/signature2 the PREVIOUS report ended up with.
    // In a two-signature home, validateForm's missingRequiredSignature
    // check treats a non-empty signature1/2 as already captured, so the
    // next report could reach COMPLETED using a prior report's second
    // signer's signature without that signer ever touching this one.
    // _id/lastEditDate are cleared for the same reason as the other
    // forms' resetForm (see e.g. BodyCheck.js) - submit()'s/autoSave()'s
    // create branches merge the just-created record's _id/lastEditDate
    // into state, so without this a subsequent new entry would still
    // point at (and display the timestamp of) the record just created.
    this.sigCanvas1?.clear();
    this.sigCanvas2?.clear();
    this.setState({
      _id: "",
      lastEditDate: null,
      signature1: [],
      signature2: [],
      incident_type:"",
      nature_of_incident:"",
      other_incident_description:"",
      childMeta_name: "",
      personal_hygiene: "",
      dressing: "",
      table_mannders: "",
      clothes_maintenace: "",
      self_feeding: "",
      care_of_property: "",
      maintenace_of_personal_space: "",
      household_chorse: "",
      informal_counseling: "",
      verbal_redirection: "",
      modeling: "",
      supervised_separation: "",
      provider_feedback_to_client: "",
      positive_reinforcement: "",
      other: "",
      home_restrictions: "",
      restricted_leisure_activity: "",
      no_allowance: "",
      other2: "",
      no_of_home_incidents: "",
      no_of_home_serious_incidents: "",
      no_of_home_restraints: "",
      no_of_school_incidents: "",
      no_of_school_restraints: "",
      illness_injury: "",
      level_of_supervison: "",
      summary_of_daily_schedule: "",
      summary_of_behavior_at_school: "",
      summary_of_behavior_at_home: "",
      therapeutic_recreational: "",
      therapeutic_value: "",
      phone_calls_or_visits: "",
      clientId: "",
      createDate: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
      status: "IN PROGRESS",
      childSelected: false,
    });
  };

  // auto save
  autoSave = async () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    delete currentState.clients;
    delete currentState.staff;

    if (
      currentState.childMeta_name === "" ||
      currentState.childMeta_name.length === 0
    ) {
      return;
    }

    if (initAutoSave) {
      console.log("autosaving existing form");
      try {
        const { data } = await Axios.put(
          `/api/dailyProgressAndActivity/${this.state.homeId}/${this.state._id}`,
          {
            ...currentState,
          }
        );

        this.setState({
          ...this.state,
          lastEditDate: data.lastEditDate,
        });
      } catch (e) {
        console.log(e);
        this.setState({
          formHasError: true,
          formErrorMessage:
            "Error Submitting Daily Progress and Activity Report",
          loadingClients: false,
        });
      }
    } else {
      console.log("autosaving new form");
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/dailyProgressAndActivity", { ...currentState })
        .then((res) => {
          initAutoSave = true;

          // Merge the full response, not just _id - it also carries the
          // server-generated lastEditDate, which the PUT branch above
          // already merges on every later autosave. Storing only _id
          // here left "Last Saved" blank from the moment this first
          // autosave create completes until the next autosave tick.
          this.setState({
            ...this.state,
            ...res.data,
          });
        })
        .catch((e) => {
          console.log(e);
          this.setState({
            formHasError: true,
            formErrorMessage:
              "Error Submitting Daily Progress and Activity Report",
            loadingClients: false,
          });
        });
    }
  };

  submit = async (save, effectiveSignature1 = this.state.signature1, effectiveSignature2 = this.state.signature2) => {
    if (this.props.valuesSet) {
      console.log('signature1 in submit, state:', this.state.signature1, 'props:', this.props.formData.signature1);
      console.log('signature2 in submit, state:', this.state.signature2, 'props:', this.props.formData.signature2);
    }
    else {
      console.log('signature1 in submit, state:', this.state.signature1);
      console.log('signature2 in submit, state:', this.state.signature2);
    }

    // Use the effective (just-computed) signature values rather than
    // this.state directly - setState from validateForm() may not have
    // flushed yet when submit() is called right after it.
    //
    // Completion is decided purely by whether the effective signatures
    // this submission actually carries satisfy the home's policy - not
    // by this.props.valuesSet. New Daily Activity forms are mounted with
    // valuesSet={false} (see App.js), so requiring valuesSet here meant a
    // two-signature-home report could never be marked COMPLETED through
    // this handler for a new report, even once both signatures were
    // genuinely present - it stayed IN PROGRESS regardless.
    if (this.state.twoSignaturesRequired && effectiveSignature1.length > 0 && effectiveSignature2.length > 0 && !save) {
      this.state.status = 'COMPLETED'
    }
    else if (!this.state.twoSignaturesRequired && !save) this.state.status = "COMPLETED";
    console.log('status after submitted', this.state.status)

    let currentState = JSON.parse(JSON.stringify(this.state));
    delete currentState.clients;
    delete currentState.staff;
    // Build the payload from the effective signature values, not
    // this.state - the completion decision above is already based on
    // effectiveSignature1/2, and the request must match it. Serializing
    // this.state directly here risks sending signature arrays that don't
    // reflect what was just decided (e.g. if a caller ever passes
    // effective values that differ from this.state, or setState from
    // validateForm() hasn't flushed for some other reason), which would
    // let a request mark the form COMPLETED while sending signatures that
    // don't actually back that status.
    currentState.signature1 = effectiveSignature1;
    currentState.signature2 = effectiveSignature2;
    initAutoSave = false;
    clearInterval(interval);
    if (this.props.valuesSet || this.state._id) {
      try {
        const { data } = await Axios.put(
          `/api/dailyProgressAndActivity/${this.state.homeId}/${this.state._id}`,
          {
            ...currentState,
          }
        );

        this.setState({ ...this.state, ...data });
        window.scrollTo(0, 0);
        // this.toggleSuccessAlert();
         if (this.state.showIncidentModal) {
            this.setState({pendingSuccessAlert: true});
          } else {
            this.toggleSuccessAlert();
          }
      } catch (e) {
        console.log(e);
        this.setState({
          formHasError: true,
          formErrorMessage:
            e?.response?.data?.error ||
            "Error Submitting Daily Progress and Activity Report",
          loadingClients: false,
        });
      }
    } else {
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/dailyProgressAndActivity", currentState)
        .then((res) => {
          window.scrollTo(0, 0);
          // this.toggleSuccessAlert();
          if (this.state.showIncidentModal) {
            this.setState({pendingSuccessAlert: true});
          } else {
            this.toggleSuccessAlert();
          }
          if (!this.props.valuesSet) {
            this.resetForm();
          }
        })
        .catch((e) => {
          console.log(e);
          this.setState({
            formHasError: true,
            formErrorMessage:
              e?.response?.data?.error ||
              "Error Submitting Daily Progress and Activity Report",
            loadingClients: false,
          });
        });
    }
  };

  validateForm = async (save) => {
    // Snapshot whether signature1 was already there *before* this call
    // touches anything. validateForm runs after an `await`, so it's no
    // longer inside React's synchronous event-batching window - the
    // setState() calls below apply immediately, not on next render. That
    // means this.state.signature1 can no longer be trusted later in this
    // same function to mean "as of before this submission" - it may
    // already reflect a value this very call just set.
    const hadSignature1Already = this.state.signature1.length > 0;

    const { data: createdUserData } =
      await GetUserSig(
        this.props.userObj.email,
        this.props.userObj.homeId
      );

    // Track the signature values this submission will actually use,
    // rather than reading this.state back later - setState below may not
    // have flushed by the time submit() runs.
    let effectiveSignature1 = this.state.signature1;
    let effectiveSignature2 = this.state.signature2;

    if (this.state.signature1.length === 0 && !save) {
      effectiveSignature1 = createdUserData.signature || [];
      this.setState({
        ...this.state,
        signature1: effectiveSignature1,
      })
      if (this.props.valuesSet) this.sigCanvas1.fromData(effectiveSignature1);
    }

    else if (this.state.twoSignaturesRequired && this.state.signature1.length > 0 && !save) {
      // Only restore the persisted first signature onto the canvas for an
      // existing record - this.props.formData doesn't exist for a new
      // report (App.js mounts it with valuesSet={false} and no formData
      // prop at all), so dereferencing formData.signature1 unconditionally
      // threw here on a second Submit click once signature1 had already
      // been captured into state by the first (see the `if` branch above).
      // A new report has no sigCanvas1 to restore into anyway - it should
      // just keep whatever's already on the canvas from this session.
      if (this.props.valuesSet) {
        this.sigCanvas1.fromData(this.props.formData.signature1);
        effectiveSignature2 = createdUserData.signature || [];
        this.sigCanvas2.fromData(effectiveSignature2);
        this.setState({
          ...this.state,
          signature2: effectiveSignature2,
        })
      }
    }

    // Block submission outright if the signature(s) this form needs are
    // still missing after the auto-fill above - e.g. the submitting user
    // has no signature saved to their profile at all. Without this, a
    // single-signature home could mark a form COMPLETED with no signature
    // captured anywhere.
    if (!save) {
      // hadSignature1Already (not this.props.valuesSet) is what decides
      // whether signature2 is required here: it's true exactly when this
      // submission is NOT the one capturing signature1 for the first time
      // - i.e. a second signer's completion attempt, whether that's an
      // existing record (valuesSet=true) or a repeat Submit click on a
      // brand-new report that already captured signature1 on session.
      // Gating on valuesSet instead let a new two-signature-home report's
      // Submit silently save as a draft with signature2 still missing,
      // with no error and no path to ever complete it, instead of telling
      // the user a second signature is still needed. Using
      // hadSignature1Already for both cases still lets the very first
      // capture of signature1 (new or existing record) succeed
      // unblocked - only a submission that ALREADY had signature1 going
      // in now also requires signature2, in a two-signature home.
      const missingRequiredSignature = this.state.twoSignaturesRequired
        ? effectiveSignature1.length === 0 ||
          (hadSignature1Already && effectiveSignature2.length === 0)
        : effectiveSignature1.length === 0;

      if (missingRequiredSignature) {
        this.setState({
          ...this.state,
          formHasError: true,
          formErrorMessage: `User signature required to submit a form. Create a new signature under 'Manage Profile'.`,
        });
        return;
      }
    }

    this.setState({
      ...this.state,
      loadingClients: true,
    });

    let message = "";

    if(this.state.incident_type === "Serious Incident") {
      message = "You selected Serious Incident. Please remember to complete the Serious Incident Report.";
    }

    if (this.state.incident_type === "Standard Incident") {
      message = "you selected Standard Incident. Please remember to complete the Incident Report."
    }

    if(message) {
      this.setState(
        {
          showIncidentModal: true,
          incidentModalMessage: message,
        },
        () => this.submit(save, effectiveSignature1, effectiveSignature2)
      );
    } else {
      this.submit(save, effectiveSignature1, effectiveSignature2);
    }
  };

  setSignature = (userObj) => {
    console.log('createdate before update, status', this.props.formData.createDate < '2024-08-18T00:23:52.160Z', this.props.formData.status)
    console.log('signature1 in setSignature, props: ', this.props.formData.signature1, 'length: ', this.props.formData.signature1.length)
    // signature2 is a legacy-absent field - it was only added to this form
    // once two-signature homes existed, so a record saved before that has
    // no signature2 at all (not even an empty array), and .length would
    // throw on undefined.
    console.log('signature2 in setSignature, props: ', this.props.formData.signature2, 'length: ', this.props.formData.signature2?.length)

    if (this.props.formData.createDate < '2024-08-18T00:23:52.160Z' && this.props.formData.status === 'COMPLETED') {
      this.sigCanvas1.fromData(userObj.signature);
      this.setState({
        signature1: userObj.signature,
      })
    }
    if (this.props.formData.createDate < '2024-08-18T00:23:52.160Z' && this.props.formData.signature1.length > 0) {
      this.sigCanvas1.fromData(this.props.formData.signature1);
    }

    if (this.props.formData.signature1.length > 0) {
      this.sigCanvas1.fromData(this.props.formData.signature1);
    }
    // Guarded the same way as the signature1 checks above - a legacy
    // record predating signature2 has no such field at all, so this must
    // not assume it's present (or even an array) before reading it.
    if (
      this.state.twoSignaturesRequired &&
      this.props.formData.status === "COMPLETED" &&
      this.props.formData.signature2?.length > 0
    ) {
      this.sigCanvas2.fromData(this.props.formData.signature2)
    }
  };

  componentWillUnmount() {
    console.log("clearing auto save interval");
    initAutoSave = false;
    clearInterval(interval);
  }

  setValues = async () => {
    const { data: createdUserData } = await GetUserSig(
      this.props.formData.createdBy,
      this.props.userObj.homeId
    );
    this.setSignature(createdUserData);
    this.sigCanvas1.off();
    // Was `if (this.state.twoSignaturesRequired = true)` - an assignment, not
    // a comparison, which unconditionally forced this to true on every
    // valuesSet load and stomped the home-based value doGetHomeInfo() had
    // just set (or was about to set, via its own separate fetch).
    if (this.state.twoSignaturesRequired === true) this.sigCanvas2.off();
    this.setState({
      ...this.state,
      ...this.props.formData,
      loadingSig: false,
      loadingClients: false,
    });
  };

  getClients = async () => {
    try {
      let { data: clients } = await Axios.get(
        `/api/client/${this.props.userObj.homeId}?active=true`
      );

      clients = clients.filter((client) => {
        return !client.hasOwnProperty("active") || client.active === true;
      });

      setTimeout(() => {
        this.setState({
          ...this.state,
          clients,
          loadingClients: !this.state.loadingClients,
        });
      }, 2000);
    } catch (e) {
      console.log(e);
      alert("Error loading clients");
    }
  };

  async componentDidMount() {
    await this.doGetHomeInfo();
    if (this.props.valuesSet) {
      this.setValues();
    } else {
      await this.getClients();
      interval = setInterval(() => {
        this.autoSave();
      }, 7000);
    }
  }

  componentDidUpdate(prevProps) {
    // homeId is expected to be stable for the life of this component (it
    // comes from the logged-in user's session), but refetch if it ever
    // does change rather than assuming it never will.
    if (prevProps.userObj?.homeId !== this.props.userObj?.homeId) {
      this.doGetHomeInfo();
    }
  }

  handleClientSelect = async (event) => {
    this.state.childSelected = true;
    if (event.target.value !== null) {
      const client = JSON.parse(event.target.value);
      const clonedState = { ...this.state };
      const id = clonedState._id;
      const lastEditDate = clonedState.lastEditDate;
      Object.keys(client).forEach((key) => {
        if (!key.includes("create") && clonedState.hasOwnProperty(key)) {
          clonedState[key] = client[key];
        }
      });
      await this.setState({
        ...clonedState,
        clientId: client._id,
        _id: id,
        lastEditDate,
      });
    }
  };

  render() {
    if (!this.props.valuesSet) {
      return (
      <>
        <Modal
          show={this.state.showIncidentModal}
          onHide={() => this.setState({showIncidentModal: false})}
          centered
          contentClassName="custom-modal-content"
          dialogClassName="custom-modal-dialog"
        >
          <Modal.Header closeButton>
            <Modal.Title className="custom-modal-title">Reminder</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.state.incidentModalMessage}
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="primary"
              // onClick={() => this.setState({showIncidentModal: false})}
              onClick={() =>
                this.setState(
                  {showIncidentModal: false},
                  () => {
                    if(this.state.pendingSuccessAlert) {
                      this.toggleSuccessAlert();
                      this.setState({pendingSuccessAlert: false});
                    }
                  }
                )
              }
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="formComp">
          {this.state.formSubmitted || this.state.formHasError ? (
            <React.Fragment>
              {this.state.formSubmitted && <FormSuccessAlert />}
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
          )}
          <div className="formTitleDiv">
            <h2 className="formTitle">Daily Progress 1</h2>
            <h5
              className="text-center"
              style={{ color: "rgb(119 119 119 / 93%)" }}
            >
              {this.state.lastEditDate ? (
                <i>
                  {" "}
                  Last Saved:
                  {`${new Date(this.state.lastEditDate)
                    .toTimeString()
                    .replace(/\s.*/, "")} - ${new Date(
                      this.state.lastEditDate
                    ).toDateString()}`}
                </i>
              ) : (
                "-"
              )}
            </h5>
          </div>
          {this.state.loadingClients ? (
            <div className="formLoadingDiv">
              <div>
                <ClipLoader
                  className="formSpinner"
                  size={50}
                  color={"#ffc107"}
                />
              </div>

              <p>Loading...</p>
            </div>
          ) : (

            <Container className="print-container">
              <div className="form-group logInInputField">
                <label className="control-label">
                  Create Date
                </label>{" "}
                <input
                  onChange={this.handleFieldInputDate}
                  id="createDate"
                  value={this.state.createDate.slice(0, -8)}
                  className="form-control"
                  type="datetime-local"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Child's Name</label>{" "}
                <Form.Control
                  as="select"
                  defaultValue={null}
                  onChange={this.handleClientSelect}
                >
                  {[null, ...this.state.clients].map(
                    (client) => (
                      <ClientOption data={client} />
                    ),
                    []
                  )}
                </Form.Control>
              </div>
              <Row>
                <Col md={4} className="print-column">
                  <div className="form-group input-header">
                    <h6>
                      Daily living / Development skills :{" "}
                      <i>
                        G - Good; A - Adequate; P - Poor; NS - Needs
                        Supervision; PA - Physical Assistance; NA - Not
                        Applicable
                      </i>
                    </h6>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Personal Hygiene wk
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="personal_hygiene"
                      value={this.state.personal_hygiene}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Dressing</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="dressing"
                      value={this.state.dressing}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Table Manners</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="table_mannders"
                      value={this.state.table_mannders}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Clothes Maintenance
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="clothes_maintenace"
                      value={this.state.clothes_maintenace}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Self Feeding</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="self_feeding"
                      value={this.state.self_feeding}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Care of Property
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="care_of_property"
                      value={this.state.care_of_property}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Maintenance of Personal Space
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="maintenace_of_personal_space"
                      value={this.state.maintenace_of_personal_space}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Household Chores
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="household_chorse"
                      value={this.state.household_chorse}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                </Col>

                <Col md={4} className="print-column">
                  <div className="form-group input-header">
                    <h6>
                      Techniques used to encourage positive change :{" "}
                      <i>Y - Yes (if applicable)</i>
                    </h6>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Informal Counseling
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="informal_counseling"
                      value={this.state.informal_counseling}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Verbal Redirection
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="verbal_redirection"
                      value={this.state.verbal_redirection}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Modeling</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="modeling"
                      value={this.state.modeling}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Supervised Separation
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="supervised_separation"
                      value={this.state.supervised_separation}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Provider Feedback to Client
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="provider_feedback_to_client"
                      value={this.state.provider_feedback_to_client}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Positive Reinforcement
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="positive_reinforcement"
                      value={this.state.positive_reinforcement}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Other (Specify)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="other"
                      value={this.state.other}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group input-header">
                    <h6>
                      Consequences : <i>Y - Yes (if applicable)</i>
                    </h6>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Home Restrictions
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="home_restrictions"
                      value={this.state.home_restrictions}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Restricted Leisure Activity
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="restricted_leisure_activity"
                      value={this.state.restricted_leisure_activity}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">No Allowance</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="no_allowance"
                      value={this.state.no_allowance}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Other (Specify)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="other2"
                      value={this.state.other2}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                </Col>

                <Col md={4} className="print-column">
                  <div className="form-group logInInputField">
                    <div className="form-group input-header">
                      <h6>Behavior Summary</h6>
                    </div>{" "}
                    <label className="control-label">
                      Number of Home Incidents
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="no_of_home_incidents"
                      value={this.state.no_of_home_incidents}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Number of Home Serious Incidents
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="no_of_home_serious_incidents"
                      value={this.state.no_of_home_serious_incidents}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Number of Home Restraints
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="no_of_home_restraints"
                      value={this.state.no_of_home_restraints}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Number of School Incidents
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="no_of_school_incidents"
                      value={this.state.no_of_school_incidents}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Number of School Restraints
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="no_of_school_restraints"
                      value={this.state.no_of_school_restraints}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Illnesses / Injuries
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="illness_injury"
                      value={this.state.illness_injury}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Level of Supervison
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="level_of_supervison"
                      value={this.state.level_of_supervison}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Therapeutic / Recreational
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="therapeutic_recreational"
                      value={this.state.therapeutic_recreational}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Therapeutic Value
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="therapeutic_value"
                      value={this.state.therapeutic_value}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Phone Calls / Visits
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="phone_calls_or_visits"
                      value={this.state.phone_calls_or_visits}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <FormError errorId={this.props.id + "-error"} />
                  <div
                    className="form-group logInInputField"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  ></div>
                </Col>
              </Row>
              <Row>
                <Col md={12} className="print-column">
                  <div className="form-group logInputField">
                    <label className="control-label">Incident Type</label>
                    <Form.Control
                      as="select"
                      id="incident_type"
                      value={this.state.incident_type}
                      onChange={this.handleFieldInput}
                      disabled={this.state.childSelected ? false : true}
                    >
                      <option value="">Select Incident</option>
                      <option value="No Incident">No Incident</option>
                      <option value="Standard Incident">Standard Incident</option>
                      <option value="Serious Incident">Serious Incident</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInputField">
                    <label className="control-label">Nature of Incident</label>
                    <Form.Control
                      as="select"
                      id="nature_of_incident"
                      value={this.state.nature_of_incident}
                      onChange={this.handleFieldInput}
                      disabled={this.state.childSelected ? false : true}
                    >
                      <option value="">Select Nature of Incident</option>
                      {this.state.incident_type === "No Incident" && (
                        <option value='No Incident'>No Incident</option>
                      )}

                      {this.state.incident_type === "Standard Incident" && 
                        standardIncidentOptions.map((opt) => (
                          <option value={opt}>{opt}</option>
                      ))}

                      {this.state.incident_type === "Serious Incident" &&
                        seriousIncidentOptions.map((opt) => (
                          <option value={opt}>{opt}</option>
                        ))}
                    </Form.Control>
                  </div>
                  {this.state.nature_of_incident === "Other" && (
                    <div className="form-group logInoutField mt-2">
                      <label className="control-label">
                        Please describe the nature of the incident
                      </label>
                      <Form.Control
                        type="text"
                        id="other_incident_description"
                        value={this.state.other_incident_description}
                        onChange={this.handleFieldInput}
                        placeholder="Enter incident details"
                      />
                    </div>
                  )}
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Summary of Behavior at School
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="summary_of_behavior_at_school"
                      value={this.state.summary_of_behavior_at_school}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Summary of Behavior at Home
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="summary_of_behavior_at_home"
                      value={this.state.summary_of_behavior_at_home}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Summary of Daily Schedule
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="summary_of_daily_schedule"
                      value={this.state.summary_of_daily_schedule}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                </Col>
              </Row>


              <Row className="save-submit-row">
                <div style={{ display: "flex", width: "46%" }}>
                  <button
                    className="lightBtn hide hide-on-print save-submit-btn"
                    style={{ width: "100%" }}
                    disabled={this.state.childSelected ? false : true}
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
                    disabled={this.state.childSelected ? false : true}
                    onClick={() => {
                      this.validateForm(false);
                    }}
                  >
                    Submit
                  </button>
                </div>



              </Row>

            </Container>
          )}
        </div>
      </>
      );
    } else {
      return (
        <>
        <Modal
          show={this.state.showIncidentModal}
          onHide={() => this.setState({showIncidentModal: false})}
          centered
          contentClassName="custom-modal-content"
          dialogClassName="custom-modal-dialog"
        >
          <Modal.Header closeButton>
            <Modal.Title className="custom-modal-title">Reminder</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.state.incidentModalMessage}
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="primary"
              // onClick={() => this.setState({showIncidentModal: false})}
              onClick={() =>
                this.setState(
                  {showIncidentModal: false},
                  () => {
                    if(this.state.pendingSuccessAlert) {
                      this.toggleSuccessAlert();
                      this.setState({pendingSuccessAlert: false});
                    }
                  }
                )
              }
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="formComp">
          {this.state.formSubmitted || this.state.formHasError ? (
            <React.Fragment>
              {this.state.formSubmitted && <FormSavedAlert />}
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
          )}
          <div className="formTitleDivReport">
            <h2 className="formTitle">Daily Progress and Activity</h2>
          </div>

          <div className="formFieldsMobileReport">
            {this.state.loadingClients ? (
              <div className="formLoadingDiv">
                <div>
                  <ClipLoader
                    className="formSpinner"
                    size={50}
                    color={"#ffc107"}
                  />
                </div>

                <p>Loading...</p>
              </div>
            ) : (
              <Container className="print-container">
                <Row>
                  <Col md={12} className="print-column">
                    <div className="form-group logInInputField">
                      <label className="control-label">
                        Create Date
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInputDate}
                        id="createDate"
                        value={this.state.createDate !== null ? this.state.createDate.slice(0, -8) : ""}
                        className="form-control"
                        type="datetime-local"
                        // Back-dating an already-saved record is admin/
                        // supervisor-only (see utils/applyCreateDateEdit.js
                        // server-side) - direct care staff can still set
                        // this once at initial creation (the other
                        // Create Date input above, for valuesSet=false),
                        // just not edit it here afterward.
                        disabled={!isAdminUser(this.props.userObj)}
                        title={
                          isAdminUser(this.props.userObj)
                            ? undefined
                            : "Only an admin or supervisor can change the creation date after a form has been saved."
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
                    <div className="form-group logInInputField">
                      <label className="control-label">
                        Last Updated
                      </label>{" "}
                      <input
                        id="lastEditDate"
                        value={this.state.lastEditDate ? new Date(this.state.lastEditDate).toLocaleString() : ""}
                        className="form-control"
                        type="text"
                        disabled
                        readOnly
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Child's Name</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.childMeta_name}
                        id="childMeta_name"
                        className="form-control"
                        type="text"
                        disabled
                      />{" "}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={4} className="print-column">
                    <div className="form-group input-header">
                      <h6>
                        Daily living/development skills :{" "}
                        <i>
                          G - Good; A - Adequate; P - Poor; NS - Needs
                          Supervision; PA - Physical Assistance; NA - Not
                          Applicable
                        </i>
                      </h6>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Personal Hygiene wk
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.personal_hygiene}
                        id="personal_hygiene"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Dressing</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.dressing}
                        id="dressing"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Table Manners
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.table_mannders}
                        id="table_mannders"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Clothes Maintenance
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.clothes_maintenace}
                        id="clothes_maintenace"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Self Feeding</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.self_feeding}
                        id="self_feeding"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Care of Property
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.care_of_property}
                        id="care_of_property"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Maintenance of Personal Space
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.maintenace_of_personal_space}
                        id="maintenace_of_personal_space"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Household Chores
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.household_chorse}
                        id="household_chorse"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                  </Col>

                  <Col md={4} className="print-column">
                    <div className="form-group input-header">
                      <h6>
                        Techniques used to encourage positive change :{" "}
                        <i>Y - Yes (if applicable)</i>
                      </h6>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Informal Counseling
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.informal_counseling}
                        id="informal_counseling"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Verbal Redirection
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.verbal_redirection}
                        id="verbal_redirection"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Modeling</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.modeling}
                        id="modeling"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Supervised Separation
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.supervised_separation}
                        id="supervised_separation"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Provider Feedback to Client
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.provider_feedback_to_client}
                        id="provider_feedback_to_client"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Positive Reinforcement
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.positive_reinforcement}
                        id="positive_reinforcement"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Other (Specify)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.other}
                        id="other"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group input-header">
                      <h6>
                        Consequences : <i>Y - Yes (if applicable)</i>
                      </h6>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Home Restrictions
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.home_restrictions}
                        id="home_restrictions"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Restricted Leisure Activity
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.restricted_leisure_activity}
                        id="restricted_leisure_activity"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">No Allowance</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.no_allowance}
                        id="no_allowance"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Other (Specify)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.other2}
                        id="other2"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                  </Col>

                  <Col md={4} className="print-column">
                    <div className="form-group input-header">
                      <h6>Behavior Summary</h6>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Number of Home Incidents
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.no_of_home_incidents}
                        id="no_of_home_incidents"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Number of Home Serious Incidents
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.no_of_home_serious_incidents}
                        id="no_of_home_serious_incidents"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Number of Home Restraints
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.no_of_home_restraints}
                        id="no_of_home_restraints"
                        className="form-control"
                        type="text"

                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Number of School Incidents
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.no_of_school_incidents}
                        id="no_of_school_incidents"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Number of School Restraints
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.no_of_school_restraints}
                        id="no_of_school_restraints"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Illnesses / Injuries
                      </label>{" "}
                      <div className="hide-on-print">
                        <TextareaAutosize
                          onChange={this.handleFieldInput}
                          value={this.state.illness_injury}
                          id="illness_injury"
                          className="form-control"
                        ></TextareaAutosize>
                      </div>
                      <p className="hide-on-non-print">
                        {this.state.illness_injury}
                      </p>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Level of Supervison
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.level_of_supervison}
                        id="level_of_supervison"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Therapeutic / Recreational
                      </label>{" "}
                      <div className="hide-on-print">
                        <TextareaAutosize
                          onChange={this.handleFieldInput}
                          value={this.state.therapeutic_recreational}
                          id="therapeutic_recreational"
                          className="form-control"
                        ></TextareaAutosize>
                      </div>
                      <p className="hide-on-non-print">
                        {this.state.therapeutic_recreational}
                      </p>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label">Therapeutic Value</label>{" "}
                      <div className="hide-on-print">
                        <TextareaAutosize
                          onChange={this.handleFieldInput}
                          value={this.state.therapeutic_value}
                          id="therapeutic_value"
                          className="form-control"
                        ></TextareaAutosize>
                      </div>
                      <p className="hide-on-non-print">
                        {this.state.therapeutic_value}
                      </p>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Phone Calls / Visits
                      </label>{" "}
                      <div className="hide-on-print">
                        <TextareaAutosize
                          onChange={this.handleFieldInput}
                          value={this.state.phone_calls_or_visits}
                          id="phone_calls_or_visits"
                          className="form-control"
                        ></TextareaAutosize>
                      </div>
                      <p className="hide-on-non-print">
                        {this.state.phone_calls_or_visits}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row id='summary_of_daily_schedule-row'>
                  <Col md={12} className="print-column">
                    <div className="form-group logInputField">
                      <label className="control-label">Incident Type</label>
                      <Form.Control
                        as="select"
                        id="incident_type"
                        value={this.state.incident_type}
                        onChange={this.handleFieldInput}
                      >
                        <option value="">Select Incident</option>
                        <option value="No Incident">No Incident</option>
                        <option value="Standard Incident">Standard Incident</option>
                        <option value="Serious Incident">Serious Incident</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInputField">
                      <label className="control-label">Nature of Incident</label>
                      <Form.Control
                        as="select"
                        id="nature_of_incident"
                        value={this.state.nature_of_incident}
                        onChange={this.handleFieldInput}
                      >
                        <option value="">Select Nature of Incident</option>
                        {this.state.incident_type === "No Incident" && (
                          <option value='No Incident'>No Incident</option>
                        )}

                        {this.state.incident_type === "Standard Incident" && 
                          standardIncidentOptions.map((opt) => (
                            <option value={opt}>{opt}</option>
                        ))}

                        {this.state.incident_type === "Serious Incident" &&
                          seriousIncidentOptions.map((opt) => (
                            <option value={opt}>{opt}</option>
                          ))}
                      </Form.Control>
                    </div>
                    {this.state.nature_of_incident === "Other" && (
                      <div className="form-group logInoutField mt-2">
                        <label className="control-label">
                          Please describe the nature of the incident
                        </label>
                        <Form.Control
                          type="text"
                          id="other_incident_description"
                          value={this.state.other_incident_description}
                          onChange={this.handleFieldInput}
                          placeholder="Enter incident details"
                        />
                      </div>
                    )}
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Summary of Behavior at School
                      </label>{" "}
                      <div className="hide-on-print">
                        <TextareaAutosize
                          onChange={this.handleFieldInput}
                          value={this.state.summary_of_behavior_at_school}
                          id="summary_of_behavior_at_school"
                          className="form-control"
                        ></TextareaAutosize>
                      </div>
                      <p className="hide-on-non-print">
                        {this.state.summary_of_behavior_at_school}
                      </p>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Summary of Behavior at Home
                      </label>{" "}
                      <div className="hide-on-print">
                        <TextareaAutosize
                          onChange={this.handleFieldInput}
                          value={this.state.summary_of_behavior_at_home}
                          id="summary_of_behavior_at_home"
                          className="form-control"
                        ></TextareaAutosize>
                      </div>
                      <p className="hide-on-non-print">
                        {this.state.summary_of_behavior_at_home}
                      </p>
                    </div>
                    <div className="form-group logInInputField" >
                      {" "}
                      <label className="control-label">
                        Summary of Daily Schedule
                      </label>{" "}
                      <div className="hide-on-print">
                        <TextareaAutosize
                          onChange={this.handleFieldInput}
                          value={this.state.summary_of_daily_schedule}
                          id="summary_of_daily_schedule"
                          className="form-control"
                        ></TextareaAutosize>
                      </div>
                      <p className="hide-on-non-print">
                        {this.state.summary_of_daily_schedule}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Container>
            )}

            <div className="sigSection">
              <div id='signature1'
                style={{ display: this.props.formData.signature1.length > 0 ? 'block' : 'none' }}
              >
                <label className="control-label">Signature</label>{" "}
                <div id='sigCanvasDiv'>
                  <SignatureCanvas
                    ref={(ref) => {
                      this.sigCanvas1 = ref;
                    }}
                    style={{ border: "solid" }}
                    penColor="black"
                    clearOnResize={false}
                    canvasProps={{
                      width: 300,
                      height: 100,
                      className: "sigCanvas1",
                    }}
                    backgroundColor="#eeee"
                  />
                </div>
              </div>

              <div id='signature2'
                style={{
                  // Driven by state.twoSignaturesRequired (the home's real
                  // persisted twoSignatures flag - see doGetHomeInfo), not a
                  // hardcoded homeId check - otherwise a newly configured
                  // two-signature home would have the server correctly
                  // requiring a second signature (see
                  // routes/api/dailyProgressAndActivity.js's identical
                  // isTwoSignatureHome) while this UI never shows the field
                  // to enter it.
                  // signature2 is a legacy-absent field (see setSignature)
                  // - optional-chained so a legacy record that predates it
                  // doesn't throw reading .length off undefined.
                  display:
                    this.state.twoSignaturesRequired && this.props.formData.signature2?.length > 0
                      ? 'block' : 'none'
                }}
              >
                <label className="control-label">Signature</label>{" "}
                <div id='sigCanvasDiv'>
                  <SignatureCanvas
                    ref={(ref) => {
                      this.sigCanvas2 = ref;
                    }}
                    style={{ border: "solid" }}
                    penColor="black"
                    clearOnResize={false}
                    canvasProps={{
                      width: 300,
                      height: 100,
                      className: "sigCanvas2",
                    }}
                    backgroundColor="#eeee"
                  />
                </div>
              </div>
            </div>
            {!this.props.formData.approved && (
              <>
                <FormError errorId={this.props.id + "-error"} />
                <Row className="save-submit-row">
                  <div style={{ display: "flex", width: "46%" }}>
                    <button
                      className="lightBtn hide hide-on-print save-submit-btn"
                      style={{
                        width: "100%",
                        display: this.state.status === 'COMPLETED' ? "none" : "block",
                      }}
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
                      onClick={() => {
                        this.validateForm(false);
                      }}
                    >
                      Submit
                    </button>
                  </div>

                </Row>
              </>
            )}
          </div>
        </div>
        </>
      );
    }
  }
}

export default DailyProgressAndActivity;
