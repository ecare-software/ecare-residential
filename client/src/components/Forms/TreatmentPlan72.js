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

class TreatmentPlan72 extends Component {
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

      fatherMeta_name: "",

      fatherMeta_address: "",

      fatherMeta_phoneNumber: "",

      motherMeta_name: "",

      motherMeta_address: "",

      motherMeta_phoneNumber: "",

      legalStatus: "",

      referringAgency_co: "",

      agentOfReferringAgency_co_name: "",

      agentOfReferringAgency_co_address: "",

      reactionToPlacement: "",

      interests: "",

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

      currentMedicalInformation: "",

      developmental_medicalHistory: "",

      drugAllergies: "",

      food1: "",

      allergies: "",

      chronicHealth: "",

      healthStrengths: "",

      healthNeeds: "",

      lastPhysicalExamination_date: "",

      lastPhysicalExamination_location: "",

      lastPhysicalExamination_monitoredBy: "",

      lastDentalExamination_date: "",

      lastDentalExamination_location: "",

      lastDentalExamination_monitoredBy: "",

      lastOpticalExamination_date: "",

      lastOpticalExamination_location: "",

      lastOpticalExamination_monitoredBy: "",

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

      behavioralStrengths: "",

      behavioralNeeds: "",

      behavioralTreatmentServices: "",

      emotionalStrengths: "",

      emotionalNeeds: "",

      emotionalTreatmentServices: "",

      food2: "",

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

      supervisionStrategies: "",

      social_recreationalStrengths: "",

      social_recreationalNeeds: "",

      familyStrengths: "",

      familyNeeds: "",

      visitor1_name: "",

      visitor1_relationship: "",

      visitor1_frequency: "",

      visitor1_supervisedBy: "",

      visitor1_location: "",

      visitor1_length: "",

      visitor2_name: "",

      visitor2_relationship: "",

      visitor2_frequency: "",

      visitor2_supervisedBy: "",

      visitor2_location: "",

      visitor2_length: "",

      visitor3_name: "",

      visitor3_relationship: "",

      visitor3_frequency: "",

      visitor3_supervisedBy: "",

      visitor3_location: "",

      visitor3_length: "",

      visitor4_name: "",

      visitor4_relationship: "",

      visitor4_frequency: "",

      visitor4_supervisedBy: "",

      visitor4_location: "",

      visitor4_length: "",

      educational_vacationalStrengths: "",

      educational_vacationalNeeds: "",

      transitionalLiving: "",

      dischargePlanning: "",

      longRangeGoals: "",

      shortRangeGoals: "",

      administorSign: "",

      administorSignDate: "",

      treatmentDirectorSign: "",

      treatmentDirectorSignDate: "",

      createdBy: this.props.valuesSet === true ? "" : this.props.userObj.email,

      createdByName:
        this.props.valuesSet === true
          ? ""
          : this.props.userObj.firstName + " " + this.props.userObj.lastName,

      lastEditDate: new Date(),

      homeId: this.props.valuesSet === true ? "" : this.props.userObj.homeId,

      formHasError: false,

      formSubmitted: false,

      formErrorMessage: "",

      loadingClients: true,

      loadingSig: true,

      clients: [],
      clientId: "",
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
      childMeta_ethnicity: "",
      childMeta_levelOfCare: "",

      childMeta_religion: "",

      childMeta_managingConservator: "",

      childMeta_dateOfAdmission: "",

      projectedDateForAchievingPermanency: "",

      legalStatus_PermancyGoal: "",

      fatherMeta_name: "",

      fatherMeta_address: "",

      fatherMeta_phoneNumber: "",

      motherMeta_name: "",

      motherMeta_address: "",

      motherMeta_phoneNumber: "",

      legalStatus: "",

      referringAgency_co: "",

      agentOfReferringAgency_co_name: "",

      agentOfReferringAgency_co_address: "",

      reactionToPlacement: "",

      interests: "",

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

      currentMedicalInformation: "",

      developmental_medicalHistory: "",

      drugAllergies: "",

      food1: "",

      allergies: "",

      chronicHealth: "",

      healthStrengths: "",

      healthNeeds: "",

      lastPhysicalExamination_date: "",

      lastPhysicalExamination_location: "",

      lastPhysicalExamination_monitoredBy: "",

      lastDentalExamination_date: "",

      lastDentalExamination_location: "",

      lastDentalExamination_monitoredBy: "",

      lastOpticalExamination_date: "",

      lastOpticalExamination_location: "",

      lastOpticalExamination_monitoredBy: "",

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

      behavioralStrengths: "",

      behavioralNeeds: "",

      behavioralTreatmentServices: "",

      emotionalStrengths: "",

      emotionalNeeds: "",

      emotionalTreatmentServices: "",

      food2: "",

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

      supervisionStrategies: "",

      social_recreationalStrengths: "",

      social_recreationalNeeds: "",

      familyStrengths: "",

      familyNeeds: "",

      visitor1_name: "",

      visitor1_relationship: "",

      visitor1_frequency: "",

      visitor1_supervisedBy: "",

      visitor1_location: "",

      visitor1_length: "",

      visitor2_name: "",

      visitor2_relationship: "",

      visitor2_frequency: "",

      visitor2_supervisedBy: "",

      visitor2_location: "",

      visitor2_length: "",

      visitor3_name: "",

      visitor3_relationship: "",

      visitor3_frequency: "",

      visitor3_supervisedBy: "",

      visitor3_location: "",

      visitor3_length: "",

      visitor4_name: "",

      visitor4_relationship: "",

      visitor4_frequency: "",

      visitor4_supervisedBy: "",

      visitor4_location: "",

      visitor4_length: "",

      educational_vacationalStrengths: "",

      educational_vacationalNeeds: "",

      transitionalLiving: "",

      dischargePlanning: "",

      longRangeGoals: "",

      shortRangeGoals: "",

      administorSign: "",

      administorSignDate: "",

      treatmentDirectorSign: "",

      treatmentDirectorSignDate: "",

      clientId: "",
    });
  };

  submit = async () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    if (this.props.valuesSet) {
      try {
        await Axios.put(
          `/api/treatmentPlans72/${this.state.homeId}/${this.props.formData._id}`,
          {
            ...this.state,
          }
        );
        this.props.doUpdateFormDates();
        window.scrollTo(0, 0);
        this.toggleSuccessAlert();
        setTimeout(() => {
          this.toggleSuccessAlert();
        }, 2000);
      } catch (e) {
        this.setState({
          formHasError: true,
          formErrorMessage: "Error Submitting 72 Hour Treatment Plan",
          loadingClients: false,
        });
      }
    } else {
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/treatmentPlans72", currentState)
        .then((res) => {
          window.scrollTo(0, 0);
          this.toggleSuccessAlert();
          if (!this.props.valuesSet) {
            this.resetForm();
          }
        })
        .catch((e) => {
          this.setState({
            formHasError: true,
            formErrorMessage: "Error Submitting 72 Hour Treatment Plan",
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
        this.setState({
          ...this.state,
          formHasError: true,
          formErrorMessage: `User signature required to submit a form. Create a new signature under 'Manage Profile'.`,
          loadingClients: false,
        });
        return;
      }
    }

    var keysToExclude = [
      "formHasError",
      "formSubmitted",
      "formErrorMessage",
      "administorSign",
      "administorSignDate",
      "treatmentDirectorSign",
      "treatmentDirectorSignDate",
      "otherMeta2_name",
      "otherMeta2_relationship",
      "otherMeta2_address",
      "otherMeta2_phoneNumber",
      "otherMeta3_name",
      "otherMeta3_relationship",
      "otherMeta3_address",
      "otherMeta3_phoneNumber",
      "otherMeta4_name",
      "otherMeta4_relationship",
      "otherMeta4_address",
      "otherMeta4_phoneNumber",
      "currentMedications_dosages_targetedSymptoms2_medication",
      "currentMedications_dosages_targetedSymptoms2_dosage_frequency",
      "currentMedications_dosages_targetedSymptoms2_purpose",
      "currentMedications_dosages_targetedSymptoms2_possibleSideEffects",
      "currentMedications_dosages_targetedSymptoms2_monitoredBy",
      "currentMedications_dosages_targetedSymptoms3_medication",
      "currentMedications_dosages_targetedSymptoms3_dosage_frequency",
      "currentMedications_dosages_targetedSymptoms3_purpose",
      "currentMedications_dosages_targetedSymptoms3_possibleSideEffects",
      "currentMedications_dosages_targetedSymptoms3_monitoredBy",
      "currentMedications_dosages_targetedSymptoms4_medication",
      "currentMedications_dosages_targetedSymptoms4_dosage_frequency",
      "currentMedications_dosages_targetedSymptoms4_purpose",
      "currentMedications_dosages_targetedSymptoms4_possibleSideEffects",
      "currentMedications_dosages_targetedSymptoms4_monitoredBy",
      "currentMedications_dosages_targetedSymptoms5_medication",
      "currentMedications_dosages_targetedSymptoms5_dosage_frequency",
      "currentMedications_dosages_targetedSymptoms5_purpose",
      "currentMedications_dosages_targetedSymptoms5_possibleSideEffects",
      "currentMedications_dosages_targetedSymptoms5_monitoredBy",
      "visitor2_name",
      "visitor2_relationship",
      "visitor2_frequency",
      "visitor2_supervisedBy",
      "visitor2_location",
      "visitor2_length",
      "visitor3_name",
      "visitor3_relationship",
      "visitor3_frequency",
      "visitor3_supervisedBy",
      "visitor3_location",
      "visitor3_length",
      "visitor4_name",
      "visitor4_relationship",
      "visitor4_frequency",
      "visitor4_supervisedBy",
      "visitor4_location",
      "visitor4_length",
      "loadingClients",
    ];

    //resubmit fields
    keysToExclude = [
      ...keysToExclude,
      "__v",
      "approved",
      "approvedBy",
      "approvedByDate",
      "approvedByName",
      "clientId",
    ];

    var isValid = true;
    var errorFields = [];

    /*Object.keys(this.state).forEach((key) => {
      if (!keysToExclude.includes(key)) {
        if (
          !this.state[key] ||
          /^\s+$/.test(this.state[key]) ||
          this.state[key].length < 1
        ) {
          errorFields.push("\n" + key);
          isValid = false;
        }
      }
    });
*/
    if (!isValid && !isAdminUser(this.props.userObj)) {
      this.setState({
        formHasError: true,
        formErrorMessage: `Please complete the following field(s): ${errorFields
          .toString()
          .replace(/,/g, "\n")}`,
      });
      return;
    }

    this.submit();
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
  };

  getClients = async () => {
    try {
      let { data: clients } = await Axios.get(
        `/api/client/${this.props.userObj.homeId}`
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

  componentDidMount() {
    if (this.props.valuesSet) {
      this.setValues();
    } else {
      this.getClients();
    }
  }

  handleClientSelect = async (event) => {
    if (event.target.value !== null) {
      const client = JSON.parse(event.target.value);
      const clonedState = { ...this.state };
      Object.keys(client).forEach((key) => {
        if (clonedState.hasOwnProperty(key)) {
          clonedState[key] = client[key];
        }
        // if (key.includes("childMeta_placeOfBirth")) {
        //   clonedState.childMeta_placeOfBirth = `${client[key]} `;
        // }
      });
      await this.setState({ ...clonedState, clientId: client._id });
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
            <h2 className="formTitle">72 Hour Treatment Plan</h2>
          </div>

          <div className="formFieldsMobile">
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
              <div>
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
                  <label className="control-label">Child's Gender</label>{" "}
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
                  <label className="control-label">Child's Religion</label>{" "}
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
                  <label className="control-label">Father's Name</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="fatherMeta_name"
                    value={this.state.fatherMeta_name}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Father's Address</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="fatherMeta_address"
                    value={this.state.fatherMeta_address}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Father's Phone Number
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="fatherMeta_phoneNumber"
                    value={this.state.fatherMeta_phoneNumber}
                    className="form-control"
                    type="number"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Mother's Name</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="motherMeta_name"
                    value={this.state.motherMeta_name}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Mother's Address</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="motherMeta_address"
                    value={this.state.motherMeta_address}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Mother Phone Number
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="motherMeta_phoneNumber"
                    value={this.state.motherMeta_phoneNumber}
                    className="form-control"
                    type="number"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Legal Status</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="legalStatus"
                    value={this.state.legalStatus}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Referring Agency / Co
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="referringAgency_co"
                    value={this.state.referringAgency_co}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Name of Agent of Referring Agency / Co
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="agentOfReferringAgency_co_name"
                    value={this.state.agentOfReferringAgency_co_name}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Address of Agent of Referring Agency / Co
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="agentOfReferringAgency_co_address"
                    value={this.state.agentOfReferringAgency_co_address}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Child's Reaction to Placement
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="reactionToPlacement"
                    value={this.state.reactionToPlacement}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Child's Interests
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="interests"
                    value={this.state.interests}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  <h5>
                    Significant relationship to the child{" "}
                    <i>
                      (siblings, others relatives, CASA workers, and attorney)
                    </i>
                    :
                  </h5>
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
                <div className="form-group logInInputField">
                  <h5>MEDICAL / DENTAL / DEVELOPMENTAL</h5>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Current Medical Information
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="currentMedicalInformation"
                    value={this.state.currentMedicalInformation}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Developmental / Medical History
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
                  <label className="control-label">Drug Allergies</label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="drugAllergies"
                    value={this.state.drugAllergies}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Food Allergies</label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="food1"
                    value={this.state.food1}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Allergies</label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="allergies"
                    value={this.state.allergies}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Chronic Health</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="chronicHealth"
                    value={this.state.chronicHealth}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Health Strengths</label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="healthStrengths"
                    value={this.state.healthStrengths}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Health Needs</label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="healthNeeds"
                    value={this.state.healthNeeds}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Last Physical Examination
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="lastPhysicalExamination_date"
                    value={this.state.lastPhysicalExamination_date}
                    className="form-control"
                    type="date"
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
                  <h5>
                    CURRENT MEDICATIONS, DOSAGES AND TARGETED SYMPTOMS: NOTE:
                    refer to current Medical Logs for Possible Recent Medication
                    Alterations:
                  </h5>
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
                  <label className="control-label">Monitored By (1)</label>{" "}
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
                  <label className="control-label">Medication (2)</label>{" "}
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
                  <label className="control-label">Monitored By (2)</label>{" "}
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
                  <label className="control-label">Medication (3)</label>{" "}
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
                  <label className="control-label">Monitored By (3)</label>{" "}
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
                  <label className="control-label">Medication (4)</label>{" "}
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
                  <label className="control-label">Monitored By (4)</label>{" "}
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
                  <label className="control-label">Medication (5)</label>{" "}
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
                  <label className="control-label">Monitored By (5)</label>{" "}
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
                    Behavioral Strengths
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="behavioralStrengths"
                    value={this.state.behavioralStrengths}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Behavioral Needs</label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="behavioralNeeds"
                    value={this.state.behavioralNeeds}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Behavioral Treatment Services
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="behavioralTreatmentServices"
                    value={this.state.behavioralTreatmentServices}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Emotional Strengths
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="emotionalStrengths"
                    value={this.state.emotionalStrengths}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Emotional Needs</label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="emotionalNeeds"
                    value={this.state.emotionalNeeds}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Emotional Treatment Services
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="emotionalTreatmentServices"
                    value={this.state.emotionalTreatmentServices}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  <h5>
                    ISSUES OR CONCERNS THAT COULD INCREASE ESCALATING BEHAVIORS:
                  </h5>
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
                  <label className="control-label">Physical Touch</label>{" "}
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
                  <label className="control-label">Certain Topics</label>{" "}
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
                      this.state.de_escalatingTechniquesToAvoidRestraints_ebi
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
                    Social Recreational Strengths
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="social_recreationalStrengths"
                    value={this.state.social_recreationalStrengths}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Social Recreational Needs
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="social_recreationalNeeds"
                    value={this.state.social_recreationalNeeds}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Family Strengths</label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="familyStrengths"
                    value={this.state.familyStrengths}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Family Needs</label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="familyNeeds"
                    value={this.state.familyNeeds}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Name of visitor (1)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor1_name"
                    value={this.state.visitor1_name}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Relation of Visitor (1)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor1_relationship"
                    value={this.state.visitor1_relationship}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Frequency of visitation (1)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor1_frequency"
                    value={this.state.visitor1_frequency}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Who will visitor (1) be supervised by
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor1_supervisedBy"
                    value={this.state.visitor1_supervisedBy}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Location of visitor (1)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor1_location"
                    value={this.state.visitor1_location}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Visitation length of vistitor (1)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor1_length"
                    value={this.state.visitor1_length}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Name of visitor (2)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor2_name"
                    value={this.state.visitor2_name}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Relation of Visitor (2)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor2_relationship"
                    value={this.state.visitor2_relationship}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Frequency of visitation (2)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor2_frequency"
                    value={this.state.visitor2_frequency}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Who will visitor (2) be supervised by
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor2_supervisedBy"
                    value={this.state.visitor2_supervisedBy}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Location of visitor (2)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor2_location"
                    value={this.state.visitor2_location}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Visitation length of vistitor (2)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor2_length"
                    value={this.state.visitor2_length}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Name of visitor (3)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor3_name"
                    value={this.state.visitor3_name}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Relation of Visitor (3)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor3_relationship"
                    value={this.state.visitor3_relationship}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Frequency of visitation (3)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor3_frequency"
                    value={this.state.visitor3_frequency}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Who will visitor (3) be supervised by
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor3_supervisedBy"
                    value={this.state.visitor3_supervisedBy}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Location of visitor (3)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor3_location"
                    value={this.state.visitor3_location}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Visitation length of vistitor (3)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor3_length"
                    value={this.state.visitor3_length}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Name of visitor (4)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor4_name"
                    value={this.state.visitor4_name}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Relation of Visitor (4)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor4_relationship"
                    value={this.state.visitor4_relationship}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Frequency of visitation (4)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor4_frequency"
                    value={this.state.visitor4_frequency}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Who will visitor (4) be supervised by
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor4_supervisedBy"
                    value={this.state.visitor4_supervisedBy}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Location of visitor (4)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor4_location"
                    value={this.state.visitor4_location}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Visitation length of vistitor (4)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="visitor4_length"
                    value={this.state.visitor4_length}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Educational / Vacational Strengths
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="educational_vacationalStrengths"
                    value={this.state.educational_vacationalStrengths}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Educational / Vacational Needs
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="educational_vacationalNeeds"
                    value={this.state.educational_vacationalNeeds}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Transitional Living
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="transitionalLiving"
                    value={this.state.transitionalLiving}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Discharge Planning
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="dischargePlanning"
                    value={this.state.dischargePlanning}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Long Range Goals</label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="longRangeGoals"
                    value={this.state.longRangeGoals}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Short Range Goals
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="shortRangeGoals"
                    value={this.state.shortRangeGoals}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <FormError errorId={this.props.id + "-error"} />
                <div
                  className="form-group logInInputField"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <button
                    className="lightBtn"
                    onClick={() => {
                      this.validateForm(true);
                    }}
                  >
                    Save
                  </button>

                  <button
                    className="darkBtn"
                    onClick={() => {
                      this.validateForm(false);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
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
            <h2 className="formTitle">72 Hour Treatment Plan</h2>
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
            <div className="formFieldsMobileReport">
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Child's Name</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.childMeta_name}
                  id="childMeta_name"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Child's Date of Birth
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={
                    this.state.childMeta_dob !== undefined
                      ? new Date(this.state.childMeta_dob)
                          .toISOString()
                          .replace(/T.*/g, "")
                      : this.state.childMeta_dob
                  }
                  className="form-control"
                  type="date"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Child's Age</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.childMeta_age}
                  id="childMeta_age"
                  className="form-control"
                  type="number"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Child's SSN</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.childMeta_ssn}
                  id="childMeta_ssn"
                  className="form-control"
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
                  value={this.state.childMeta_medicaidNumber}
                  id="childMeta_medicaidNumber"
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
                  value={this.state.childMeta_county}
                  id="childMeta_county"
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
                  value={this.state.childMeta_placeOfBirth}
                  id="childMeta_placeOfBirth"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Child's Ethnicity</label>{" "}
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
                <label className="control-label">Child's Religion</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.childMeta_religion}
                  id="childMeta_religion"
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
                  value={this.state.childMeta_managingConservator}
                  id="childMeta_managingConservator"
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
                  value={
                    this.state.childMeta_dateOfAdmission !== undefined
                      ? new Date(this.state.childMeta_dateOfAdmission)
                          .toISOString()
                          .replace(/T.*/g, "")
                      : this.state.childMeta_dateOfAdmission
                  }
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
                  value={
                    this.state.projectedDateForAchievingPermanency !== undefined
                      ? new Date(this.state.projectedDateForAchievingPermanency)
                          .toISOString()
                          .replace(/T.*/g, "")
                      : this.state.projectedDateForAchievingPermanency
                  }
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
                  value={this.state.legalStatus_PermancyGoal}
                  id="legalStatus_PermancyGoal"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Father's Name</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.fatherMeta_name}
                  id="fatherMeta_name"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Father's Address</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.fatherMeta_address}
                  id="fatherMeta_address"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Father's Phone Number
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.fatherMeta_phoneNumber}
                  id="fatherMeta_phoneNumber"
                  className="form-control"
                  type="number"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Mother's Name</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.motherMeta_name}
                  id="motherMeta_name"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Mother's Address</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.motherMeta_address}
                  id="motherMeta_address"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Mother Phone Number
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.motherMeta_phoneNumber}
                  id="motherMeta_phoneNumber"
                  className="form-control"
                  type="number"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Legal Status</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.legalStatus}
                  id="legalStatus"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Referring Agency / Co
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.referringAgency_co}
                  id="referringAgency_co"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Name of Agent of Referring Agency / Co
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.agentOfReferringAgency_co_name}
                  id="agentOfReferringAgency_co_name"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Address of Agent of Referring Agency / Co
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.agentOfReferringAgency_co_address}
                  id="agentOfReferringAgency_co_address"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Child's Reaction to Placement
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.reactionToPlacement}
                  id="reactionToPlacement"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Child's Interests</label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.interests}
                  id="interests"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                <h5>
                  Significant relationship to the child{" "}
                  <i>
                    (siblings, others relatives, CASA workers, and attorney)
                  </i>
                  :
                </h5>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Name of Significant Relation (1)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.otherMeta1_name}
                  id="otherMeta1_name"
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
                  value={this.state.otherMeta1_relationship}
                  id="otherMeta1_relationship"
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
                  value={this.state.otherMeta1_address}
                  id="otherMeta1_address"
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
                  value={this.state.otherMeta1_phoneNumber}
                  id="otherMeta1_phoneNumber"
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
                  value={this.state.otherMeta2_name}
                  id="otherMeta2_name"
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
                  value={this.state.otherMeta2_relationship}
                  id="otherMeta2_relationship"
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
                  value={this.state.otherMeta2_address}
                  id="otherMeta2_address"
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
                  value={this.state.otherMeta2_phoneNumber}
                  id="otherMeta2_phoneNumber"
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
                  value={this.state.otherMeta3_name}
                  id="otherMeta3_name"
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
                  value={this.state.otherMeta3_relationship}
                  id="otherMeta3_relationship"
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
                  value={this.state.otherMeta3_address}
                  id="otherMeta3_address"
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
                  value={this.state.otherMeta3_phoneNumber}
                  id="otherMeta3_phoneNumber"
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
                  value={this.state.otherMeta4_name}
                  id="otherMeta4_name"
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
                  value={this.state.otherMeta4_relationship}
                  id="otherMeta4_relationship"
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
                  value={this.state.otherMeta4_address}
                  id="otherMeta4_address"
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
                  value={this.state.otherMeta4_phoneNumber}
                  id="otherMeta4_phoneNumber"
                  className="form-control"
                  type="number"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                <h5>MEDICAL / DENTAL / DEVELOPMENTAL</h5>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Current Medical Information
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.currentMedicalInformation}
                  id="currentMedicalInformation"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Developmental / Medical History
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.developmental_medicalHistory}
                  id="developmental_medicalHistory"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Drug Allergies</label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.drugAllergies}
                  id="drugAllergies"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Food Allergies</label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.food1}
                  id="food1"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Allergies</label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.allergies}
                  id="allergies"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Chronic Health</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.chronicHealth}
                  id="chronicHealth"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Health Strengths</label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.healthStrengths}
                  id="healthStrengths"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Health Needs</label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.healthNeeds}
                  id="healthNeeds"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Last Physical Examination
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={
                    this.state.lastPhysicalExamination_date !== undefined
                      ? new Date(this.state.lastPhysicalExamination_date)
                          .toISOString()
                          .replace(/T.*/g, "")
                      : this.state.lastPhysicalExamination_date
                  }
                  className="form-control"
                  type="date"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Location of Last Physical Examination
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.lastPhysicalExamination_location}
                  id="lastPhysicalExamination_location"
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
                  value={this.state.lastPhysicalExamination_monitoredBy}
                  id="lastPhysicalExamination_monitoredBy"
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
                  value={
                    this.state.lastDentalExamination_date !== undefined
                      ? new Date(this.state.lastDentalExamination_date)
                          .toISOString()
                          .replace(/T.*/g, "")
                      : this.state.lastDentalExamination_date
                  }
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
                  value={this.state.lastDentalExamination_location}
                  id="lastDentalExamination_location"
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
                  value={this.state.lastDentalExamination_monitoredBy}
                  id="lastDentalExamination_monitoredBy"
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
                  value={
                    this.state.lastOpticalExamination_date !== undefined
                      ? new Date(this.state.lastOpticalExamination_date)
                          .toISOString()
                          .replace(/T.*/g, "")
                      : this.state.lastOpticalExamination_date
                  }
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
                  value={this.state.lastOpticalExamination_location}
                  id="lastOpticalExamination_location"
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
                  value={this.state.lastOpticalExamination_monitoredBy}
                  id="lastOpticalExamination_monitoredBy"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                <h5>
                  CURRENT MEDICATIONS, DOSAGES AND TARGETED SYMPTOMS: NOTE:
                  refer to current Medical Logs for Possible Recent Medication
                  Alterations:
                </h5>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Medication (1)</label>{" "}
                <input
                  onChange={this.handleFieldInput}
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
                <label className="control-label">Monitored By (1)</label>{" "}
                <input
                  onChange={this.handleFieldInput}
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
                <label className="control-label">Medication (2)</label>{" "}
                <input
                  onChange={this.handleFieldInput}
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
                <label className="control-label">Monitored By (2)</label>{" "}
                <input
                  onChange={this.handleFieldInput}
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
                <label className="control-label">Medication (3)</label>{" "}
                <input
                  onChange={this.handleFieldInput}
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
                <label className="control-label">Monitored By (3)</label>{" "}
                <input
                  onChange={this.handleFieldInput}
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
                <label className="control-label">Medication (4)</label>{" "}
                <input
                  onChange={this.handleFieldInput}
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
                <label className="control-label">Monitored By (4)</label>{" "}
                <input
                  onChange={this.handleFieldInput}
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
                <label className="control-label">Medication (5)</label>{" "}
                <input
                  onChange={this.handleFieldInput}
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
                <label className="control-label">Monitored By (5)</label>{" "}
                <input
                  onChange={this.handleFieldInput}
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
                  Behavioral Strengths
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.behavioralStrengths}
                  id="behavioralStrengths"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Behavioral Needs</label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.behavioralNeeds}
                  id="behavioralNeeds"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Behavioral Treatment Services
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.behavioralTreatmentServices}
                  id="behavioralTreatmentServices"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Emotional Strengths
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.emotionalStrengths}
                  id="emotionalStrengths"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Emotional Needs</label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.emotionalNeeds}
                  id="emotionalNeeds"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Emotional Treatment Services
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.emotionalTreatmentServices}
                  id="emotionalTreatmentServices"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                <h5>
                  ISSUES OR CONCERNS THAT COULD INCREASE ESCALATING BEHAVIORS:
                </h5>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Food</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.food2}
                  id="food2"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Eye Contact</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.eyeContact}
                  id="eyeContact"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Physical Touch</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.physicalTouch}
                  id="physicalTouch"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Personal Property</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.personalProperty}
                  id="personalProperty"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Certain Topics</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.certainTopics}
                  id="certainTopics"
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
                  value={this.state.knownContraindicationsToTheUuseOfRestraint}
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
                  value={
                    this.state.de_escalatingTechniquesToAvoidRestraints_ebi
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
                  value={this.state.child_de_escalator}
                  id="child_de_escalator"
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
                  value={this.state.staff_de_escalator}
                  id="staff_de_escalator"
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
                  value={this.state.therapist_de_escalator}
                  id="therapist_de_escalator"
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
                  value={this.state.childPreferred_de_escalation}
                  id="childPreferred_de_escalation"
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
                  value={this.state.interventionStrategies}
                  id="interventionStrategies"
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
                  value={this.state.supervisionStrategies}
                  id="supervisionStrategies"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Social Recreational Strengths
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.social_recreationalStrengths}
                  id="social_recreationalStrengths"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Social Recreational Needs
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.social_recreationalNeeds}
                  id="social_recreationalNeeds"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Family Strengths</label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.familyStrengths}
                  id="familyStrengths"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Family Needs</label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.familyNeeds}
                  id="familyNeeds"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Name of visitor (1)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor1_name}
                  id="visitor1_name"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Relation of Visitor (1)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor1_relationship}
                  id="visitor1_relationship"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Frequency of visitation (1)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor1_frequency}
                  id="visitor1_frequency"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Who will visitor (1) be supervised by
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor1_supervisedBy}
                  id="visitor1_supervisedBy"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Location of visitor (1)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor1_location}
                  id="visitor1_location"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Visitation length of vistitor (1)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor1_length}
                  id="visitor1_length"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Name of visitor (2)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor2_name}
                  id="visitor2_name"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Relation of Visitor (2)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor2_relationship}
                  id="visitor2_relationship"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Frequency of visitation (2)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor2_frequency}
                  id="visitor2_frequency"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Who will visitor (2) be supervised by
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor2_supervisedBy}
                  id="visitor2_supervisedBy"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Location of visitor (2)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor2_location}
                  id="visitor2_location"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Visitation length of vistitor (2)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor2_length}
                  id="visitor2_length"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Name of visitor (3)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor3_name}
                  id="visitor3_name"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Relation of Visitor (3)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor3_relationship}
                  id="visitor3_relationship"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Frequency of visitation (3)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor3_frequency}
                  id="visitor3_frequency"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Who will visitor (3) be supervised by
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor3_supervisedBy}
                  id="visitor3_supervisedBy"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Location of visitor (3)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor3_location}
                  id="visitor3_location"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Visitation length of vistitor (3)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor3_length}
                  id="visitor3_length"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Name of visitor (4)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor4_name}
                  id="visitor4_name"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Relation of Visitor (4)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor4_relationship}
                  id="visitor4_relationship"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Frequency of visitation (4)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor4_frequency}
                  id="visitor4_frequency"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Who will visitor (4) be supervised by
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor4_supervisedBy}
                  id="visitor4_supervisedBy"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Location of visitor (4)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor4_location}
                  id="visitor4_location"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Visitation length of vistitor (4)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  value={this.state.visitor4_length}
                  id="visitor4_length"
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Educational / Vacational Strengths
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.educational_vacationalStrengths}
                  id="educational_vacationalStrengths"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Educational / Vacational Needs
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.educational_vacationalNeeds}
                  id="educational_vacationalNeeds"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Transitional Living
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.transitionalLiving}
                  id="transitionalLiving"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Discharge Planning</label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.dischargePlanning}
                  id="dischargePlanning"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Long Range Goals</label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.longRangeGoals}
                  id="longRangeGoals"
                  className="form-control"
                ></TextareaAutosize>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Short Range Goals</label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  value={this.state.shortRangeGoals}
                  id="shortRangeGoals"
                  className="form-control"
                ></TextareaAutosize>
              </div>
            </div>
          )}
          <label className="control-label">Signature</label>{" "}
          <div className="sigSection">
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SignatureCanvas
                ref={(ref) => {
                  this.sigCanvas = ref;
                }}
                style={{ border: "solid" }}
                penColor="black"
                clearOnResize={false}
                canvasProps={{
                  width: 600,
                  height: 200,
                  className: "sigCanvas",
                }}
                backgroundColor="#eeee"
              />
            </div>
          </div>
          {!this.props.formData.approved && (
            <>
              <FormError errorId={this.props.id + "-error"} />
              <div
                className="form-group logInInputField"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <button
                  className="lightBtn"
                  onClick={() => {
                    this.validateForm(true);
                  }}
                >
                  Save
                </button>

                {/* <button
                  className="darkBtn"
                  onClick={() => {
                    this.validateForm(false);
                  }}
                >
                  Submit
                </button> */}
              </div>
            </>
          )}
        </div>
      );
    }
  }
}

export default TreatmentPlan72;
