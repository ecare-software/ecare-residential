import React, { Component } from "react";
import FormError from "../FormMods/FormError";
import FormAlert from "../Forms/FormAlert";
import "../../App.css";
import Axios from "axios";
import { Form } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import ClientOption from "../../utils/ClientOption.util";
import SignatureCanvas from "react-signature-canvas";
import { GetUserSig } from "../../utils/GetUserSig";
import { FormSuccessAlert } from "../../utils/FormSuccessAlert";
import { FormSavedAlert } from "../../utils/FormSavedAlert";
import TextareaAutosize from "react-textarea-autosize";
import { Container, Row, Col } from "react-bootstrap";

var interval = 0; // used for autosaving
let initAutoSave = false;
class AdmissionAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childMeta_name: "",
      childMeta_dob: "",
      childMeta_age: "",
      childMeta_ssn: "",
      childMeta_gender: "",
      childMeta_medicaidNumber: "",
      childMeta_county: "",
      childMeta_placeOfBirth: "",
      childMeta_ethnicity: "",
      childMeta_levelOfCare: "",
      childMeta_religion: "",
      childMeta_managingConservator: "",
      childMeta_dateOfAdmission: "",
      projectedDateForAchievingPermanency: "",
      legalStatus_PermancyGoal: "",
      est_length_of_stay: "",
      recHistory: "",
      desc_of_circum: "",
      family_social_history: "",
      env_family_function: "",
      otherMeta1_name: "",
      otherMeta1_relationship: "",
      otherMeta1_address: "",
      otherMeta1_phoneNumber: "",
      otherMeta2_name: "",
      otherMeta2_relationship: "",
      otherMeta2_address: "",
      otherMeta2_phoneNumber: "",
      otherMeta3_name: "",
      otherMeta3_relationship: "",
      otherMeta3_address: "",
      otherMeta3_phoneNumber: "",
      otherMeta4_name: "",
      otherMeta4_relationship: "",
      otherMeta4_address: "",
      otherMeta4_phoneNumber: "",
      food1: "",
      food2: "",
      drugAllergies: "",
      allergies: "",
      chronicHealthConditions: "",
      eyeContact: "",
      physicalTouch: "",
      personalProperty: "",
      certainTopics: "",
      knownContraindicationsToTheUuseOfRestraint: "",
      de_escalatingTechniquesToAvoidRestraints_ebi: "",
      child_de_escalator: "",
      staff_de_escalator: "",
      therapist_de_escalator: "",
      childPreferred_de_escalation: "",
      interventionStrategies: "",
      managingConservator_text: "",
      understanding_expectations: "",
      summary_of_discussion: "",
      previousPlacements: "",
      behavioralHistory: "",
      juvenileHistory: "",
      emotionalHistory: "",
      substanceAbuseStatus: "",
      developmental_medicalHistory: "",
      lastPhysicalExamination_date: "",
      lastPhysicalExamination_location: "",
      lastPhysicalExamination_monitoredBy: "",
      lastDentalExamination_date: "",
      lastDentalExamination_location: "",
      lastDentalExamination_monitoredBy: "",
      lastOpticalExamination_date: "",
      lastOpticalExamination_location: "",
      lastOpticalExamination_monitoredBy: "",
      lastHearingExamination_date: "",
      lastHearingExamination_location: "",
      lastHearingExamination_monitoredBy: "",
      currentMedications_dosages_targetedSymptoms1_medication: "",
      currentMedications_dosages_targetedSymptoms1_dosage_frequency: "",
      currentMedications_dosages_targetedSymptoms1_purpose: "",
      currentMedications_dosages_targetedSymptoms1_possibleSideEffects: "",
      currentMedications_dosages_targetedSymptoms1_monitoredBy: "",
      currentMedications_dosages_targetedSymptoms2_medication: "",
      currentMedications_dosages_targetedSymptoms2_dosage_frequency: "",
      currentMedications_dosages_targetedSymptoms2_purpose: "",
      currentMedications_dosages_targetedSymptoms2_possibleSideEffects: "",
      currentMedications_dosages_targetedSymptoms2_monitoredBy: "",
      currentMedications_dosages_targetedSymptoms3_medication: "",
      currentMedications_dosages_targetedSymptoms3_dosage_frequency: "",
      currentMedications_dosages_targetedSymptoms3_purpose: "",
      currentMedications_dosages_targetedSymptoms3_possibleSideEffects: "",
      currentMedications_dosages_targetedSymptoms3_monitoredBy: "",
      currentMedications_dosages_targetedSymptoms4_medication: "",
      currentMedications_dosages_targetedSymptoms4_dosage_frequency: "",
      currentMedications_dosages_targetedSymptoms4_purpose: "",
      currentMedications_dosages_targetedSymptoms4_possibleSideEffects: "",
      currentMedications_dosages_targetedSymptoms4_monitoredBy: "",
      currentMedications_dosages_targetedSymptoms5_medication: "",
      currentMedications_dosages_targetedSymptoms5_dosage_frequency: "",
      currentMedications_dosages_targetedSymptoms5_purpose: "",
      currentMedications_dosages_targetedSymptoms5_possibleSideEffects: "",
      currentMedications_dosages_targetedSymptoms5_monitoredBy: "",
      educationHistory: "",
      lastSchoolAttended: "",
      progressReportInfo: "",
      educationalLevel: "",
      examiner: "",
      date_of_evaluation: "",
      diagnosis: "",
      stressors: "",
      healthIssues: "",
      effortsToObtainInfo: "",
      rationl_admission: "",
      parent_gaurdian_expectation: "",
      objective: "",
      basicNeeds: "",
      shortTermGoals: "",
      longTermGoals: "",
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

  handleFieldInput = (event) => {
    var stateObj = {};
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


  resetForm = () => {
    this.setState({
      childMeta_name: "",
      childMeta_dob: "",
      childMeta_age: "",
      childMeta_ssn: "",
      childMeta_gender: "",
      childMeta_medicaidNumber: "",
      childMeta_county: "",
      childMeta_placeOfBirth: "",
      recHistory: "",
      childMeta_ethnicity: "",
      childMeta_levelOfCare: "",
      childMeta_religion: "",
      childMeta_managingConservator: "",
      childMeta_dateOfAdmission: "",
      projectedDateForAchievingPermanency: "",
      legalStatus_PermancyGoal: "",
      est_length_of_stay: "",
      desc_of_circum: "",
      family_social_history: "",
      env_family_function: "",
      otherMeta1_name: "",
      otherMeta1_relationship: "",
      otherMeta1_address: "",
      otherMeta1_phoneNumber: "",
      otherMeta2_name: "",
      otherMeta2_relationship: "",
      otherMeta2_address: "",
      otherMeta2_phoneNumber: "",
      otherMeta3_name: "",
      otherMeta3_relationship: "",
      otherMeta3_address: "",
      otherMeta3_phoneNumber: "",
      otherMeta4_name: "",
      otherMeta4_relationship: "",
      otherMeta4_address: "",
      otherMeta4_phoneNumber: "",
      food1: "",
      food2: "",
      drugAllergies: "",
      allergies: "",
      chronicHealthConditions: "",
      eyeContact: "",
      physicalTouch: "",
      personalProperty: "",
      certainTopics: "",
      knownContraindicationsToTheUuseOfRestraint: "",
      de_escalatingTechniquesToAvoidRestraints_ebi: "",
      child_de_escalator: "",
      staff_de_escalator: "",
      therapist_de_escalator: "",
      childPreferred_de_escalation: "",
      interventionStrategies: "",
      managingConservator_text: "",
      understanding_expectations: "",
      summary_of_discussion: "",
      previousPlacements: "",
      behavioralHistory: "",
      juvenileHistory: "",
      emotionalHistory: "",
      substanceAbuseStatus: "",
      developmental_medicalHistory: "",
      lastPhysicalExamination_date: "",
      lastPhysicalExamination_location: "",
      lastPhysicalExamination_monitoredBy: "",
      lastDentalExamination_date: "",
      lastDentalExamination_location: "",
      lastDentalExamination_monitoredBy: "",
      lastOpticalExamination_date: "",
      lastOpticalExamination_location: "",
      lastOpticalExamination_monitoredBy: "",
      lastHearingExamination_date: "",
      lastHearingExamination_location: "",
      lastHearingExamination_monitoredBy: "",
      currentMedications_dosages_targetedSymptoms1_medication: "",
      currentMedications_dosages_targetedSymptoms1_dosage_frequency: "",
      currentMedications_dosages_targetedSymptoms1_purpose: "",
      currentMedications_dosages_targetedSymptoms1_possibleSideEffects: "",
      currentMedications_dosages_targetedSymptoms1_monitoredBy: "",
      currentMedications_dosages_targetedSymptoms2_medication: "",
      currentMedications_dosages_targetedSymptoms2_dosage_frequency: "",
      currentMedications_dosages_targetedSymptoms2_purpose: "",
      currentMedications_dosages_targetedSymptoms2_possibleSideEffects: "",
      currentMedications_dosages_targetedSymptoms2_monitoredBy: "",
      currentMedications_dosages_targetedSymptoms3_medication: "",
      currentMedications_dosages_targetedSymptoms3_dosage_frequency: "",
      currentMedications_dosages_targetedSymptoms3_purpose: "",
      currentMedications_dosages_targetedSymptoms3_possibleSideEffects: "",
      currentMedications_dosages_targetedSymptoms3_monitoredBy: "",
      currentMedications_dosages_targetedSymptoms4_medication: "",
      currentMedications_dosages_targetedSymptoms4_dosage_frequency: "",
      currentMedications_dosages_targetedSymptoms4_purpose: "",
      currentMedications_dosages_targetedSymptoms4_possibleSideEffects: "",
      currentMedications_dosages_targetedSymptoms4_monitoredBy: "",
      currentMedications_dosages_targetedSymptoms5_medication: "",
      currentMedications_dosages_targetedSymptoms5_dosage_frequency: "",
      currentMedications_dosages_targetedSymptoms5_purpose: "",
      currentMedications_dosages_targetedSymptoms5_possibleSideEffects: "",
      currentMedications_dosages_targetedSymptoms5_monitoredBy: "",
      educationHistory: "",
      lastSchoolAttended: "",
      progressReportInfo: "",
      educationalLevel: "",
      examiner: "",
      date_of_evaluation: "",
      diagnosis: "",
      stressors: "",
      healthIssues: "",
      effortsToObtainInfo: "",
      rationl_admission: "",
      parent_gaurdian_expectation: "",
      objective: "",
      basicNeeds: "",
      shortTermGoals: "",
      longTermGoals: "",
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
          `/api/admissionAssessment/${this.state.homeId}/${this.state._id}`,
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
          formErrorMessage: "Error Submitting Admission Assessment",
          loadingClients: false,
        });
      }
    } else {
      console.log("autosaving new form");
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/admissionAssessment/", currentState)
        .then((res) => {
          initAutoSave = true;

          this.setState({
            ...this.state,
            _id: res.data._id,
          });
        })
        .catch((e) => {
          console.log(e);
          this.setState({
            formHasError: true,
            formErrorMessage: "Error Submitting Admission Assessment",
            loadingClients: false,
          });
        });
    }
  };

  submit = async (save) => {
    if (!save) this.state.status = "COMPLETED";
    let currentState = JSON.parse(JSON.stringify(this.state));
    delete currentState.clients;
    delete currentState.staff;
    initAutoSave = false;
    clearInterval(interval);
    if (this.props.valuesSet || this.state._id) {
      try {
        const { data } = await Axios.put(
          `/api/admissionAssessment/${this.state.homeId}/${this.state._id}`,
          {
            ...currentState,
          }
        );
        console.log('data', data)
        console.log('currentState', currentState)
        console.log('state', this.state)
        this.setState({ ...this.state, ...data });
        window.scrollTo(0, 0);
        this.toggleSuccessAlert();
      } catch (e) {
        console.log(e);
        this.setState({
          formHasError: true,
          formErrorMessage: "Error Submitting Admission Assessment",
          loadingClients: false,
        });
      }
    } else {
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/admissionAssessment", currentState)
        .then((res) => {
          window.scrollTo(0, 0);
          this.toggleSuccessAlert();
          if (!this.props.valuesSet) {
            this.resetForm();
          }
        })
        .catch((e) => {
          console.log(e);
          this.setState({
            formHasError: true,
            formErrorMessage: "Error Submitting Admission Assessment",
            loadingClients: false,
          });
        });
    }
  };

  validateForm = async (save) => {
    this.setState({
      ...this.state,
      loadingClients: true,
    });

    this.submit(save);
  };

  setSignature = (userObj) => {
    if (userObj.signature && userObj.signature.length) {
      this.sigCanvas.fromData(userObj.signature);
    }
  };

  setValues = async () => {
    const { data: createdUserData } = await GetUserSig(
      this.props.formData.createdBy,
      this.props.userObj.homeId
    );
    this.setSignature(createdUserData);
    this.sigCanvas.off();
    this.setState({
      ...this.state,
      ...this.props.formData,
      loadingSig: false,
      loadingClients: false,
    });
    console.log('setValues:', this.state);
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

  componentWillUnmount() {
    console.log("clearing auto save interval");
    initAutoSave = false;
    clearInterval(interval);
  }

  async componentDidMount() {
    if (this.props.valuesSet) {
      this.setValues();
    } else {
      await this.getClients();
      interval = setInterval(() => {
        this.autoSave();
      }, 7000);
    }
  }

  handleClientSelect = async (event) => {
    this.state.childSelected = true;
    document.querySelector(".save-submit-btn").setAttribute('disabled', true);
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
            <h2 className="formTitle">Admission Assessment</h2>
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
                <Col md={3} className="print-column">
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child's Date of Birth
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="childMeta_dob"
                      value={this.state.childMeta_dob}
                      disabled={this.state.childSelected ? false : true}
                      type="date"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Child's Age</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="childMeta_age"
                      value={this.state.childMeta_age}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="number"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Child's SSN</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="childMeta_ssn"
                      value={this.state.childMeta_ssn}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="number"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Child's Gender</label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.childMeta_gender}
                      id="childMeta_gender"
                      disabled={this.state.childSelected ? false : true}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option value={""}>Choose</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child's Medicaid Number
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="childMeta_medicaidNumber"
                      value={this.state.childMeta_medicaidNumber}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child's Birth County
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="childMeta_county"
                      value={this.state.childMeta_county}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child's Place of Birth (City, State)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="childMeta_placeOfBirth"
                      value={this.state.childMeta_placeOfBirth}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child's Ethnicity
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.childMeta_ethnicity}
                      id="childMeta_ethnicity"
                      disabled={this.state.childSelected ? false : true}
                    >
                      <option>Black</option>
                      <option>White</option>
                      <option>Hispanic</option>
                      <option>Asian</option>
                      <option>Pacific Islander</option>
                      <option>Native American</option>
                      <option>Other</option>
                      <option value={""}>Choose</option>
                    </Form.Control>
                  </div>

                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child's Level of Care
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.childMeta_levelOfCare}
                      id="childMeta_levelOfCare"
                      disabled={this.state.childSelected ? false : true}
                    >
                      <option>Basic</option>
                      <option>Moderate</option>
                      <option>Specialized</option>
                      <option>Intense</option>
                      <option>Intense-plus</option>
                      <option value={""}>Choose</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child's Religion
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="childMeta_religion"
                      value={this.state.childMeta_religion}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child's Managing Conservator
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="childMeta_managingConservator"
                      value={this.state.childMeta_managingConservator}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child's Date of Admission
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="childMeta_dateOfAdmission"
                      value={this.state.childMeta_dateOfAdmission}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="date"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Projected Date For Achieving Permanency
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="projectedDateForAchievingPermanency"
                      value={this.state.projectedDateForAchievingPermanency}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="date"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Legal Status / Permancy Goal
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="legalStatus_PermancyGoal"
                      value={this.state.legalStatus_PermancyGoal}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Estimated Length of Stay at New Pathways
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="est_length_of_stay"
                      value={this.state.est_length_of_stay}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Description of circumstances making placement necessary
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="desc_of_circum"
                      value={this.state.desc_of_circum}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Family/Social History
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="family_social_history"
                      value={this.state.family_social_history}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Environment and Family function
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="env_family_function"
                      value={this.state.env_family_function}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                </Col>
                <Col md={3} className="print-column">
                  <div className="form-group logInInputField">
                    <h6>
                      Significant relationship to the child{" "}
                      <i>
                        (siblings, others relatives, CASA workers, and attorney)
                      </i>
                      :
                    </h6>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Name of Significant Relation (1)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta1_name"
                      value={this.state.otherMeta1_name}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Relationship of Significant Relation (1)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta1_relationship"
                      value={this.state.otherMeta1_relationship}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Adress of Significant Relation (1)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta1_address"
                      value={this.state.otherMeta1_address}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Phone Number of Significant Relation (1)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta1_phoneNumber"
                      value={this.state.otherMeta1_phoneNumber}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="number"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Name of Significant Relation (2)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta2_name"
                      value={this.state.otherMeta2_name}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Relationship of Significant Relation (2)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta2_relationship"
                      value={this.state.otherMeta2_relationship}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Address of Significant Relation (2)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta2_address"
                      value={this.state.otherMeta2_address}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Phone Number of Significant Relation (2)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta2_phoneNumber"
                      value={this.state.otherMeta2_phoneNumber}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="number"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Name of Significant Relation (3)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta3_name"
                      value={this.state.otherMeta3_name}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Relationship of Significant Relation (3)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta3_relationship"
                      value={this.state.otherMeta3_relationship}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Address of Significant Relation (3)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta3_address"
                      value={this.state.otherMeta3_address}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Phone Number of Significant Relation (3)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta3_phoneNumber"
                      value={this.state.otherMeta3_phoneNumber}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="number"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Name of Significant Relation (4)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta4_name"
                      value={this.state.otherMeta4_name}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Relationship of Significant Relation (4)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta4_relationship"
                      value={this.state.otherMeta4_relationship}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Address of Significant Relation (4)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta4_address"
                      value={this.state.otherMeta4_address}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Phone Number of Significant Relation (4)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="otherMeta4_phoneNumber"
                      value={this.state.otherMeta4_phoneNumber}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="number"
                    />{" "}
                  </div>
                </Col>
                <Col md={3} className="print-column">
                  <div className="form-group logInInputField">
                    <h6>
                      ISSUES OR CONCERNS THAT COULD INCREASE ESCALATING
                      BEHAVIORS:
                    </h6>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Food</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="food1"
                      value={this.state.food1}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Eye Contact</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="eyeContact"
                      value={this.state.eyeContact}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Physical Touch</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="physicalTouch"
                      value={this.state.physicalTouch}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Personal Property
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="personalProperty"
                      value={this.state.personalProperty}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Certain Topics</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="certainTopics"
                      value={this.state.certainTopics}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Known contraindications to the use of restraint
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="knownContraindicationsToTheUuseOfRestraint"
                      disabled={this.state.childSelected ? false : true}
                      value={
                        this.state.knownContraindicationsToTheUuseOfRestraint
                      }
                      className="form-control"
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      De-escalating Techniques to avoid restraints (EBI)
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="de_escalatingTechniquesToAvoidRestraints_ebi"
                      value={
                        this.state.de_escalatingTechniquesToAvoidRestraints_ebi
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child's De-escalation Technique:
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="child_de_escalator"
                      value={this.state.child_de_escalator}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Staff Member's De-escalation Technique:
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="staff_de_escalator"
                      value={this.state.staff_de_escalator}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Therapist's De-escalation Technique:
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="therapist_de_escalator"
                      value={this.state.therapist_de_escalator}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child's Preferred De-escalation
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="childPreferred_de_escalation"
                      value={this.state.childPreferred_de_escalation}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Intervention Strategies
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="interventionStrategies"
                      value={this.state.interventionStrategies}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                </Col>
                <Col md={3} className="print-column">
                  <div className="form-group logInInputField">
                    <h6>
                      Summary of discussion with managing conservator and/or
                      family members (as appropriate) regarding placement
                    </h6>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Managing conservator/family members (as appropriate)
                      expectation of placement
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="managingConservator_text"
                      value={this.state.managingConservator_text}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child’s understanding and expectations of placement
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="understanding_expectations"
                      value={this.state.understanding_expectations}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Previous Placements
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="previousPlacements"
                      value={this.state.previousPlacements}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Summary of discussion with child care staff regarding the
                      child’s medical, social psychological and educational
                      history and needs (include date of discussion.){" "}
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="summary_of_discussion"
                      value={this.state.summary_of_discussion}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    <h6>
                      HISTORY OF PHYSICAL, SEXUAL, EMOTIONAL ABUSE OR NEGLECT:
                      According to the common application, there are 19 CPS
                      referrals. Allegations include: Physical Neglect (6),
                      Sexual Abuse (2) and Refusal of Parental Responsibility
                      (1) and Neglectful Supervision (10). After investigations
                      by CPS, 3 allegations were found REASON TO BELIEVE for
                      Physical Neglect (1) and Neglectful Supervision (2).
                    </h6>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child’s Behavioral History
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="behavioralHistory"
                      value={this.state.behavioralHistory}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      JUVENILE JUSTICE HISTORY: If child has had any involvement
                      in the Juvenile Justice System, list incidents, status,
                      Probation Department, and contact person
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="juvenileHistory"
                      value={this.state.juvenileHistory}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child’s Emotional History
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="emotionalHistory"
                      value={this.state.emotionalHistory}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      CURRENT MENTAL HEALTH/SUBSTANCE ABUSE STATUS
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="substanceAbuseStatus"
                      value={this.state.substanceAbuseStatus}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child’s Recreational History (skills/interest):{" "}
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="recHistory"
                      value={this.state.recHistory}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child’s Developmental/Medical History
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="developmental_medicalHistory"
                      value={this.state.developmental_medicalHistory}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Drug Allergies</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="drugAllergies"
                      value={this.state.drugAllergies}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Food</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="food2"
                      value={this.state.food2}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Allergies</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="allergies"
                      value={this.state.allergies}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Chronic Health Conditions
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="chronicHealthConditions"
                      value={this.state.chronicHealthConditions}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Date of Last Physical Examination
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="lastPhysicalExamination_date"
                      value={this.state.lastPhysicalExamination_date}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Location of Last Physical Examination
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="lastPhysicalExamination_location"
                      value={this.state.lastPhysicalExamination_location}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Who monitored the child's last physical examination?
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="lastPhysicalExamination_monitoredBy"
                      value={this.state.lastPhysicalExamination_monitoredBy}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Last Dental Examination
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="lastDentalExamination_date"
                      value={this.state.lastDentalExamination_date}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="date"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Location of the Last Dental Examination
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="lastDentalExamination_location"
                      value={this.state.lastDentalExamination_location}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Who monitored the child's last dental examination?
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="lastDentalExamination_monitoredBy"
                      value={this.state.lastDentalExamination_monitoredBy}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Last Optical Examination
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="lastOpticalExamination_date"
                      value={this.state.lastOpticalExamination_date}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="date"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Location of the last optical examination
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="lastOpticalExamination_location"
                      value={this.state.lastOpticalExamination_location}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Who monitored the last optical examination?
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="lastOpticalExamination_monitoredBy"
                      value={this.state.lastOpticalExamination_monitoredBy}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Last hearing Examination
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="lastHearingExamination_date"
                      value={this.state.lastHearingExamination_date}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="date"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Location of the last hearing examination
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="lastHearingExamination_location"
                      value={this.state.lastHearingExamination_location}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Who monitored the last hearing examination?
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="lastHearingExamination_monitoredBy"
                      value={this.state.lastHearingExamination_monitoredBy}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    <h6>
                      CURRENT MEDICATIONS, DOSAGES AND TARGETED SYMPTOMS: NOTE:
                      refer to current Medical Logs for Possible Recent
                      Medication Alterations:
                    </h6>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Medication (1)</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms1_medication"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms1_medication
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Dosage / Frequency (1)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms1_dosage_frequency"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms1_dosage_frequency
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Purpose (1)</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms1_purpose"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms1_purpose
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Possible side effects (1)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms1_possibleSideEffects"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms1_possibleSideEffects
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Monitored By (1)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms1_monitoredBy"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms1_monitoredBy
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Medication (2)</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms2_medication"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms2_medication
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Dosage / Frequency (2)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms2_dosage_frequency"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms2_dosage_frequency
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Purpose (2)</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms2_purpose"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms2_purpose
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Possible Side Effects (2)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms2_possibleSideEffects"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms2_possibleSideEffects
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Monitored By (2)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms2_monitoredBy"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms2_monitoredBy
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Medication (3)</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms3_medication"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms3_medication
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Dosage Frequency (3)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms3_dosage_frequency"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms3_dosage_frequency
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Purpose (3)</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms3_purpose"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms3_purpose
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Possible Side Effects (3)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms3_possibleSideEffects"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms3_possibleSideEffects
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Monitored By (3)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms3_monitoredBy"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms3_monitoredBy
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Medication (4)</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms4_medication"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms4_medication
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Dosage Frequency (4)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms4_dosage_frequency"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms4_dosage_frequency
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Purpose (4)</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms4_purpose"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms4_purpose
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Possible Side Effects (4)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms4_possibleSideEffects"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms4_possibleSideEffects
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Monitored By (4)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms4_monitoredBy"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms4_monitoredBy
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Medication (5)</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms5_medication"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms5_medication
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Dosage Frequency (5)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms5_dosage_frequency"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms5_dosage_frequency
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Purpose (5)</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms5_purpose"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms5_purpose
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Possible Side Effects (5)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms5_possibleSideEffects"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms5_possibleSideEffects
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Monitored By (5)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="currentMedications_dosages_targetedSymptoms5_monitoredBy"
                      value={
                        this.state
                          .currentMedications_dosages_targetedSymptoms5_monitoredBy
                      }
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child’s Educational History
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="educationHistory"
                      value={this.state.educationHistory}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      LAST SCHOOL ATTENDED
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="lastSchoolAttended"
                      value={this.state.lastSchoolAttended}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Last Progress Report
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="progressReportInfo"
                      value={this.state.progressReportInfo}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Child’s educational level and any pertinent school
                      problems
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="educationalLevel"
                      value={this.state.educationalLevel}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Examiner</label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="examiner"
                      value={this.state.examiner}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Date of Evaluation
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="date_of_evaluation"
                      value={this.state.date_of_evaluation}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                      type="date"
                    ></input>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Diagnosis</label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="diagnosis"
                      value={this.state.diagnosis}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Stressors</label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="stressors"
                      value={this.state.stressors}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Health Issues</label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="healthIssues"
                      value={this.state.healthIssues}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Supervision Strategies
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="supervisionStrategies"
                      value={this.state.supervisionStrategies}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Efforts made to obtain information that was unavailable at
                      the time of admission
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="effortsToObtainInfo"
                      value={this.state.effortsToObtainInfo}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Rationale for appropriate admission
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="rationl_admission"
                      value={this.state.rationl_admission}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Parent/guardian’s expectation for placement and family
                      involvement
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="parent_gaurdian_expectation"
                      value={this.state.parent_gaurdian_expectation}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      OBJECTIVE OF PLACEMENT
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="objective"
                      value={this.state.objective}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">BASIC NEEDS</label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="basicNeeds"
                      value={this.state.basicNeeds}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Short-term Goals of Placement
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="shortTermGoals"
                      value={this.state.shortTermGoals}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Long-term Goals of Placement
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="longTermGoals"
                      value={this.state.longTermGoals}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                </Col>
              </Row>

              <FormError errorId={this.props.id + "-error"} />

              <Row style={{ display: "flex", justifyContent: "space-between", paddingRight: "0px", marginLeft: "1px", marginRight: "1px" }}>
                <div style={{ display: "flex", width: "46%" }}>
                  <button
                    className="lightBtn hide hide-on-print save-submit-btn"
                    style={{ width: "100%" }}
                    onClick={() => {
                      this.validateForm(true);
                    }}
                    disabled={this.state.childSelected ? false : true}
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
                    disabled={this.state.childSelected ? false : true}
                  >
                    Submit
                  </button>
                </div>
              </Row>
            </Container>
          )}
        </div>
      );
    } else {
      return (
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
            <h2 className="formTitle"> Admission Assessment</h2>
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
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Child's Name</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="childMeta_name"
                        value={this.state.childMeta_name}
                        className="form-control"
                        type="text"
                        disabled
                      />{" "}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={3} className="print-column">
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child's Date of Birth
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="childMeta_dob"
                        value={this.state.childMeta_dob}
                        className="form-control"
                        type="date"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Child's Age</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="childMeta_age"
                        value={this.state.childMeta_age}
                        className="form-control"
                        type="number"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Child's SSN</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="childMeta_ssn"
                        value={this.state.childMeta_ssn}
                        className="form-control"
                        type="number"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child's Gender
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.childMeta_gender}
                        id="childMeta_gender"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                        <option value={""}>Choose</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child's Medicaid Number
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="childMeta_medicaidNumber"
                        value={this.state.childMeta_medicaidNumber}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child's Birth County
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="childMeta_county"
                        value={this.state.childMeta_county}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child's Place of Birth (City, State)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="childMeta_placeOfBirth"
                        value={this.state.childMeta_placeOfBirth}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child's Ethnicity
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.childMeta_ethnicity}
                        id="childMeta_ethnicity"
                      >
                        <option>Black</option>
                        <option>White</option>
                        <option>Hispanic</option>
                        <option>Asian</option>
                        <option>Pacific Islander</option>
                        <option>Native American</option>
                        <option>Other</option>
                        <option value={""}>Choose</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child's Level of Care
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.childMeta_levelOfCare}
                        id="childMeta_levelOfCare"
                      >
                        <option>Basic</option>
                        <option>Moderate</option>
                        <option>Specialized</option>
                        <option>Intense</option>
                        <option>Intense-plus</option>
                        <option value={""}>Choose</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child's Religion
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="childMeta_religion"
                        value={this.state.childMeta_religion}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child's Managing Conservator
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="childMeta_managingConservator"
                        value={this.state.childMeta_managingConservator}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child's Date of Admission
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="childMeta_dateOfAdmission"
                        value={this.state.childMeta_dateOfAdmission}
                        className="form-control"
                        type="date"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Projected Date For Achieving Permanency
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="projectedDateForAchievingPermanency"
                        value={this.state.projectedDateForAchievingPermanency}
                        className="form-control"
                        type="date"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Legal Status / Permancy Goal
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="legalStatus_PermancyGoal"
                        value={this.state.legalStatus_PermancyGoal}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Estimated Length of Stay at New Pathways
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="est_length_of_stay"
                        value={this.state.est_length_of_stay}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Description of circumstances making placement necessary
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="desc_of_circum"
                        value={this.state.desc_of_circum}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Family/Social History
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="family_social_history"
                        value={this.state.family_social_history}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Environment and Family function
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="env_family_function"
                        value={this.state.env_family_function}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                  </Col>
                  <Col md={3} className="print-column">
                    <div className="form-group logInInputField">
                      <h6>
                        Significant relationship to the child{" "}
                        <i>
                          (siblings, others relatives, CASA workers, and
                          attorney)
                        </i>
                        :
                      </h6>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Name of Significant Relation (1)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta1_name"
                        value={this.state.otherMeta1_name}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Relationship of Significant Relation (1)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta1_relationship"
                        value={this.state.otherMeta1_relationship}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Adress of Significant Relation (1)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta1_address"
                        value={this.state.otherMeta1_address}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Phone Number of Significant Relation (1)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta1_phoneNumber"
                        value={this.state.otherMeta1_phoneNumber}
                        className="form-control"
                        type="number"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Name of Significant Relation (2)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta2_name"
                        value={this.state.otherMeta2_name}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Relationship of Significant Relation (2)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta2_relationship"
                        value={this.state.otherMeta2_relationship}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Address of Significant Relation (2)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta2_address"
                        value={this.state.otherMeta2_address}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>

                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Phone Number of Significant Relation (2)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta2_phoneNumber"
                        value={this.state.otherMeta2_phoneNumber}
                        className="form-control"
                        type="number"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Name of Significant Relation (3)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta3_name"
                        value={this.state.otherMeta3_name}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Relationship of Significant Relation (3)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta3_relationship"
                        value={this.state.otherMeta3_relationship}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Address of Significant Relation (3)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta3_address"
                        value={this.state.otherMeta3_address}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Phone Number of Significant Relation (3)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta3_phoneNumber"
                        value={this.state.otherMeta3_phoneNumber}
                        className="form-control"
                        type="number"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Name of Significant Relation (4)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta4_name"
                        value={this.state.otherMeta4_name}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Relationship of Significant Relation (4)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta4_relationship"
                        value={this.state.otherMeta4_relationship}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Address of Significant Relation (4)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta4_address"
                        value={this.state.otherMeta4_address}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Phone Number of Significant Relation (4)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="otherMeta4_phoneNumber"
                        value={this.state.otherMeta4_phoneNumber}
                        className="form-control"
                        type="number"
                      />{" "}
                    </div>
                  </Col>
                  <Col md={3} className="print-column">
                    <div className="form-group logInInputField">
                      <h6>
                        ISSUES OR CONCERNS THAT COULD INCREASE ESCALATING
                        BEHAVIORS:
                      </h6>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Food</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="food1"
                        value={this.state.food1}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Eye Contact</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="eyeContact"
                        value={this.state.eyeContact}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Physical Touch
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="physicalTouch"
                        value={this.state.physicalTouch}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Personal Property
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="personalProperty"
                        value={this.state.personalProperty}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Certain Topics
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="certainTopics"
                        value={this.state.certainTopics}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Known contraindications to the use of restraint
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="knownContraindicationsToTheUuseOfRestraint"
                        value={
                          this.state.knownContraindicationsToTheUuseOfRestraint
                        }
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        De-escalating Techniques to avoid restraints (EBI)
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="de_escalatingTechniquesToAvoidRestraints_ebi"
                        value={
                          this.state
                            .de_escalatingTechniquesToAvoidRestraints_ebi
                        }
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child's De-escalation Technique:
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="child_de_escalator"
                        value={this.state.child_de_escalator}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Staff Member's De-escalation Technique:
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="staff_de_escalator"
                        value={this.state.staff_de_escalator}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Therapist's De-escalation Technique:
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="therapist_de_escalator"
                        value={this.state.therapist_de_escalator}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child's Preferred De-escalation
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="childPreferred_de_escalation"
                        value={this.state.childPreferred_de_escalation}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Intervention Strategies
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="interventionStrategies"
                        value={this.state.interventionStrategies}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                  </Col>
                  <Col md={3} className="print-column">
                    <div className="form-group logInInputField">
                      <h6>
                        Summary of discussion with managing conservator and/or
                        family members (as appropriate) regarding placement
                      </h6>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Managing conservator/family members (as appropriate)
                        expectation of placement
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="managingConservator_text"
                        value={this.state.managingConservator_text}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child’s understanding and expectations of placement
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="understanding_expectations"
                        value={this.state.understanding_expectations}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Previous Placements
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="previousPlacements"
                        value={this.state.previousPlacements}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Summary of discussion with child care staff regarding
                        the child’s medical, social psychological and
                        educational history and needs (include date of
                        discussion.){" "}
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="summary_of_discussion"
                        value={this.state.summary_of_discussion}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      <h6>
                        HISTORY OF PHYSICAL, SEXUAL, EMOTIONAL ABUSE OR NEGLECT:
                        According to the common application, there are 19 CPS
                        referrals. Allegations include: Physical Neglect (6),
                        Sexual Abuse (2) and Refusal of Parental Responsibility
                        (1) and Neglectful Supervision (10). After
                        investigations by CPS, 3 allegations were found REASON
                        TO BELIEVE for Physical Neglect (1) and Neglectful
                        Supervision (2).
                      </h6>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child’s Behavioral History
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="behavioralHistory"
                        value={this.state.behavioralHistory}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        JUVENILE JUSTICE HISTORY: If child has had any
                        involvement in the Juvenile Justice System, list
                        incidents, status, Probation Department, and contact
                        person
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="juvenileHistory"
                        value={this.state.juvenileHistory}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child’s Emotional History
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="emotionalHistory"
                        value={this.state.emotionalHistory}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        CURRENT MENTAL HEALTH/SUBSTANCE ABUSE STATUS
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="substanceAbuseStatus"
                        value={this.state.substanceAbuseStatus}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child’s Recreational History (skills/interest):{" "}
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="recHistory"
                        value={this.state.recHistory}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child’s Developmental/Medical History
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="developmental_medicalHistory"
                        value={this.state.developmental_medicalHistory}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Drug Allergies
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="drugAllergies"
                        value={this.state.drugAllergies}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Food</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="food2"
                        value={this.state.food2}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Allergies</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="allergies"
                        value={this.state.allergies}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Chronic Health Conditions
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="chronicHealthConditions"
                        value={this.state.chronicHealthConditions}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Date of Last Physical Examination
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="lastPhysicalExamination_date"
                        value={this.state.lastPhysicalExamination_date}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Location of Last Physical Examination
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="lastPhysicalExamination_location"
                        value={this.state.lastPhysicalExamination_location}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Who monitored the child's last physical examination?
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="lastPhysicalExamination_monitoredBy"
                        value={this.state.lastPhysicalExamination_monitoredBy}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Last Dental Examination
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="lastDentalExamination_date"
                        value={this.state.lastDentalExamination_date}
                        className="form-control"
                        type="date"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Location of the Last Dental Examination
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="lastDentalExamination_location"
                        value={this.state.lastDentalExamination_location}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Who monitored the child's last dental examination?
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="lastDentalExamination_monitoredBy"
                        value={this.state.lastDentalExamination_monitoredBy}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Last Optical Examination
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="lastOpticalExamination_date"
                        value={this.state.lastOpticalExamination_date}
                        className="form-control"
                        type="date"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Location of the last optical examination
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="lastOpticalExamination_location"
                        value={this.state.lastOpticalExamination_location}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Who monitored the last optical examination?
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="lastOpticalExamination_monitoredBy"
                        value={this.state.lastOpticalExamination_monitoredBy}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Last hearing Examination
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="lastHearingExamination_date"
                        value={this.state.lastHearingExamination_date}
                        className="form-control"
                        type="date"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Location of the last hearing examination
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="lastHearingExamination_location"
                        value={this.state.lastHearingExamination_location}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Who monitored the last hearing examination?
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="lastHearingExamination_monitoredBy"
                        value={this.state.lastHearingExamination_monitoredBy}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      <h6>
                        CURRENT MEDICATIONS, DOSAGES AND TARGETED SYMPTOMS:
                        NOTE: refer to current Medical Logs for Possible Recent
                        Medication Alterations:
                      </h6>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Medication (1)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms1_medication"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms1_medication
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Dosage / Frequency (1)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms1_dosage_frequency"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms1_dosage_frequency
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Purpose (1)</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms1_purpose"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms1_purpose
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Possible side effects (1)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms1_possibleSideEffects"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms1_possibleSideEffects
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Monitored By (1)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms1_monitoredBy"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms1_monitoredBy
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Medication (2)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms2_medication"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms2_medication
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Dosage / Frequency (2)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms2_dosage_frequency"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms2_dosage_frequency
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Purpose (2)</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms2_purpose"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms2_purpose
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Possible Side Effects (2)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms2_possibleSideEffects"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms2_possibleSideEffects
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Monitored By (2)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms2_monitoredBy"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms2_monitoredBy
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Medication (3)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms3_medication"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms3_medication
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Dosage Frequency (3)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms3_dosage_frequency"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms3_dosage_frequency
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Purpose (3)</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms3_purpose"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms3_purpose
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Possible Side Effects (3)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms3_possibleSideEffects"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms3_possibleSideEffects
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Monitored By (3)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms3_monitoredBy"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms3_monitoredBy
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Medication (4)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms4_medication"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms4_medication
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Dosage Frequency (4)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms4_dosage_frequency"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms4_dosage_frequency
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Purpose (4)</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms4_purpose"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms4_purpose
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Possible Side Effects (4)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms4_possibleSideEffects"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms4_possibleSideEffects
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Monitored By (4)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms4_monitoredBy"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms4_monitoredBy
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Medication (5)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms5_medication"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms5_medication
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Dosage Frequency (5)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms5_dosage_frequency"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms5_dosage_frequency
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Purpose (5)</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms5_purpose"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms5_purpose
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Possible Side Effects (5)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms5_possibleSideEffects"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms5_possibleSideEffects
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Monitored By (5)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="currentMedications_dosages_targetedSymptoms5_monitoredBy"
                        value={
                          this.state
                            .currentMedications_dosages_targetedSymptoms5_monitoredBy
                        }
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child’s Educational History
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="educationHistory"
                        value={this.state.educationHistory}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        LAST SCHOOL ATTENDED
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="lastSchoolAttended"
                        value={this.state.lastSchoolAttended}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Last Progress Report
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="progressReportInfo"
                        value={this.state.progressReportInfo}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Child’s educational level and any pertinent school
                        problems
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="educationalLevel"
                        value={this.state.educationalLevel}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Examiner</label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="examiner"
                        value={this.state.examiner}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Date of Evaluation
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="date_of_evaluation"
                        value={this.state.date_of_evaluation}
                        className="form-control"
                        type="date"
                      ></input>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Diagnosis</label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="diagnosis"
                        value={this.state.diagnosis}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Stressors</label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="stressors"
                        value={this.state.stressors}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Health Issues
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="healthIssues"
                        value={this.state.healthIssues}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Supervision Strategies
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="supervisionStrategies"
                        value={this.state.supervisionStrategies}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Efforts made to obtain information that was unavailable
                        at the time of admission
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="effortsToObtainInfo"
                        value={this.state.effortsToObtainInfo}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Rationale for appropriate admission
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="rationl_admission"
                        value={this.state.rationl_admission}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Parent/guardian’s expectation for placement and family
                        involvement
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="parent_gaurdian_expectation"
                        value={this.state.parent_gaurdian_expectation}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        OBJECTIVE OF PLACEMENT
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="objective"
                        value={this.state.objective}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">BASIC NEEDS</label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="basicNeeds"
                        value={this.state.basicNeeds}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Short-term Goals of Placement
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="shortTermGoals"
                        value={this.state.shortTermGoals}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Long-term Goals of Placement
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="longTermGoals"
                        value={this.state.longTermGoals}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                  </Col>
                </Row>
              </Container>
            )}

            <div className="sigSection"
              style={{ display: this.state.status === 'IN PROGRESS' ? 'none' : 'block' }}
            >
              <label className="control-label">Signature</label>{" "}
              <div id='sigCanvasDiv'>
                <SignatureCanvas
                  ref={(ref) => {
                    this.sigCanvas = ref;
                  }}
                  style={{ border: "solid" }}
                  penColor="black"
                  clearOnResize={false}
                  canvasProps={{
                    width: 300,
                    height: 100,
                    className: "sigCanvas",
                  }}
                  backgroundColor="#eeee"
                />
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
                        display: this.state.status === 'COMPLETED' ? "none" : "block"
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
      );
    }
  }
}

export default AdmissionAssessment;
