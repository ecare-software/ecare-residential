import React, { Component } from "react";
import FormError from "../FormMods/FormError";
import "../../App.css";
import Axios from "axios";

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

      createdBy: (this.props.valuesSet === true) ? "" : this.props.userObj.email,

      createdByName: (this.props.valuesSet === true) ? "" :this.props.userObj.firstName + " " + this.props.userObj.lastName,

      lastEditDate: new Date(),

      homeId:(this.props.valuesSet === true) ? "" :this.props.userObj.homeId
    };

    this.submit = this.submit.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  handleFieldInput = event => {
    var stateObj = {};
    if (event.target.id.indexOf(".") > -1) {
      let level1Obj = event.target.id.split(".")[0];
      let level2Obj = event.target.id.split(".")[1];

      let nestedProperty = { ...this.state[level1Obj] };
      nestedProperty[level2Obj] = event.target.value;
      stateObj[level1Obj] = nestedProperty;
      // let objCopy = JSON.parse(JSON.stringify(this.state[level1Obj]));
      // console.log(objCopy);
      // objCopy[level2Obj] = event.target.value;
      // console.log(objCopy);
      // this.setState(objCopy);
    } else {
      stateObj[event.target.id] = event.target.value;
    }
    this.setState(stateObj);
  };

  submit = () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    console.log(JSON.stringify(currentState));
    Axios.post("/api/treatmentPlans72",currentState);
    // Axios({
    //   method: "post",
    //   url: "/api/treatmentPlans72",
    //   body: "",
    //   headers: { test: "test" }
    // })
    //   .then(response => {
    //     console.log(response);
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
  };

  validateForm = () => {

    // //is empty or leading spaces
    // document.getElementById(this.props.id + "-error").style.display = "none";
    // for (var valIndex in Object.values(childMeta)) {
    //   if (
    //     Object.values(childMeta)[valIndex].length === 0 ||
    //     /^\s+/g.test(Object.values(childMeta)[valIndex])
    //   ) {
    //     console.log("invalid");
    //     document.getElementById(this.props.id + "-error").innerText =
    //       "Child Information is Required";
    //     document.getElementById(this.props.id + "-error").style.display =
    //       "block";
    //     return;
    //   }
    // }

    this.submit();
  };

  render() {

    if(!this.props.valuesSet){
      return (
        <div style={{ margin: "50px 100px 0px 100px" }}>
          <div style={{ margin: "75px 0px"}}>
            <h2>72 Hour Treatment Plan</h2>
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta dob</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_dob"
              className="form-control"
              type="date"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta age</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_age"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta ssn</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_ssn"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta gender</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_gender"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta medicaidNumber</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_medicaidNumber"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta county</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_county"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta placeOfBirth</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_placeOfBirth"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta ethnicity</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_ethnicity"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta levelOfCare</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_levelOfCare"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta religion</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_religion"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              childMeta managingConservator
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_managingConservator"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              childMeta dateOfAdmission
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_dateOfAdmission"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              projectedDateForAchievingPermanency
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="projectedDateForAchievingPermanency"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">legalStatus_PermancyGoal</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="legalStatus_PermancyGoal"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">fatherMeta name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="fatherMeta_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">fatherMeta address</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="fatherMeta_address"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">fatherMeta phoneNumber</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="fatherMeta_phoneNumber"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">motherMeta name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="motherMeta_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">motherMeta address</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="motherMeta_address"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">motherMeta phoneNumber</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="motherMeta_phoneNumber"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">legalStatus</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="legalStatus"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">referringAgency_co</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="referringAgency_co"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              agentOfReferringAgency_co name
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="agentOfReferringAgency_co_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              agentOfReferringAgency_co address
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="agentOfReferringAgency_co_address"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">reactionToPlacement</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="reactionToPlacement"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">interests</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="interests"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta1 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta1_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta1 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta1_relationship"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta1 address</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta1_address"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta1 phoneNumber</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta1_phoneNumber"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta2 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta2_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta2 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta2_relationship"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta2 address</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta2_address"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta2 phoneNumber</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta2_phoneNumber"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta3 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta3_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta3 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta3_relationship"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta3 address</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta3_address"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta3 phoneNumber</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta3_phoneNumber"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta4 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta4_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta4 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta4_relationship"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta4 address</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta4_address"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta4 phoneNumber</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="otherMeta4_phoneNumber"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedicalInformation
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedicalInformation"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              developmental_medicalHistory
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="developmental_medicalHistory"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">drugAllergies</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="drugAllergies"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">food1</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="food1"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">allergies</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="allergies"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">chronicHealth</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="chronicHealth"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">healthStrengths</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="healthStrengths"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">healthNeeds</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="healthNeeds"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastPhysicalExamination date
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="lastPhysicalExamination_date"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastPhysicalExamination location
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="lastPhysicalExamination_location"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastPhysicalExamination monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="lastPhysicalExamination_monitoredBy"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastDentalExamination date
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="lastDentalExamination_date"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastDentalExamination location
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="lastDentalExamination_location"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastDentalExamination monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="lastDentalExamination_monitoredBy"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastOpticalExamination date
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="lastOpticalExamination_date"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastOpticalExamination location
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="lastOpticalExamination_location"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastOpticalExamination monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="lastOpticalExamination_monitoredBy"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms1 medication
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms1_medication"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms1 dosage_frequency
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms1_dosage_frequency"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms1 purpose
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms1_purpose"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms1 possibleSideEffects
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms1_possibleSideEffects"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms1 monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms1_monitoredBy"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms2 medication
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms2_medication"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms2 dosage_frequency
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms2_dosage_frequency"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms2 purpose
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms2_purpose"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms2 possibleSideEffects
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms2_possibleSideEffects"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms2 monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms2_monitoredBy"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms3 medication
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms3_medication"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms3 dosage_frequency
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms3_dosage_frequency"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms3 purpose
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms3_purpose"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms3 possibleSideEffects
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms3_possibleSideEffects"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms3 monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms3_monitoredBy"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms4 medication
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms4_medication"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms4 dosage_frequency
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms4_dosage_frequency"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms4 purpose
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms4_purpose"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms4 possibleSideEffects
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms4_possibleSideEffects"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms4 monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms4_monitoredBy"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms5 medication
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms5_medication"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms5 dosage_frequency
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms5_dosage_frequency"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms5 purpose
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms5_purpose"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms5 possibleSideEffects
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms5_possibleSideEffects"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms5 monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="currentMedications_dosages_targetedSymptoms5_monitoredBy"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">behavioralStrengths</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="behavioralStrengths"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">behavioralNeeds</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="behavioralNeeds"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              behavioralTreatmentServices
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="behavioralTreatmentServices"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">emotionalStrengths</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="emotionalStrengths"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">emotionalNeeds</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="emotionalNeeds"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              emotionalTreatmentServices
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="emotionalTreatmentServices"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">food2</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="food2"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">eyeContact</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="eyeContact"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">physicalTouch</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="physicalTouch"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">personalProperty</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="personalProperty"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">certainTopics</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="certainTopics"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              knownContraindicationsToTheUuseOfRestraint
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="knownContraindicationsToTheUuseOfRestraint"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              de_escalatingTechniquesToAvoidRestraints_ebi
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="de_escalatingTechniquesToAvoidRestraints_ebi"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">child_de_escalator</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="child_de_escalator"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">staff_de_escalator</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="staff_de_escalator"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">therapist_de_escalator</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="therapist_de_escalator"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              childPreferred_de_escalation
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childPreferred_de_escalation"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">interventionStrategies</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="interventionStrategies"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">supervisionStrategies</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="supervisionStrategies"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              social_recreationalStrengths
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="social_recreationalStrengths"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">social_recreationalNeeds</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="social_recreationalNeeds"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">familyStrengths</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="familyStrengths"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">familyNeeds</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="familyNeeds"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor1 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor1_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor1 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor1_relationship"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor1 frequency</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor1_frequency"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor1supervisedBy</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor1_supervisedBy"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor1 location</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor1_location"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor1 length</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor1_length"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor2 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor2_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor2 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor2_relationship"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor2 frequency</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor2_frequency"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor2 supervisedBy</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor2_supervisedBy"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor2 location</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor2_location"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor2 length</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor2_length"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor3 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor3_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor3 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor3_relationship"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor3 frequency</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor3_frequency"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor3 supervisedBy</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor3_supervisedBy"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor3 location</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor3_location"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor3 length</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor3_length"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor4 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor4_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor4 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor4_relationship"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor4 frequency</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor4_frequency"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor4 supervisedBy</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor4_supervisedBy"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor4 location</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor4_location"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor4 length</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="visitor4_length"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              educational_vacationalStrengths
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="educational_vacationalStrengths"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              educational_vacationalNeeds
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="educational_vacationalNeeds"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">transitionalLiving</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="transitionalLiving"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">dischargePlanning</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="dischargePlanning"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">longRangeGoals</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="longRangeGoals"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">shortRangeGoals</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="shortRangeGoals"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">administorSign</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="administorSign"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">administorSignDate</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="administorSignDate"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">treatmentDirectorSign</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="treatmentDirectorSign"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              treatmentDirectorSignDate
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="treatmentDirectorSignDate"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <FormError errorId={this.props.id + "-error"} />
          <div
            className="form-group logInInputField"
            style={{ textAlign: "right" }}
          >
            <button className="darkBtn" onClick={this.validateForm}>
              Submit
            </button>
          </div>
        </div>
      );
    }else{
      return(
        <div style={{ margin: "50px 100px 0px 100px" }}>
          <div style={{ margin: "75px 0px"}}>
          </div>
          <h2>72 Hour Treatment Plan</h2>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_name} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta dob</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_dob} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta age</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_age} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta ssn</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_ssn} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta gender</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_gender} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta medicaidNumber</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_medicaidNumber} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta county</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_county} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta placeOfBirth</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_placeOfBirth} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta ethnicity</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_ethnicity} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta levelOfCare</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_levelOfCare} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta religion</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_religion} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              childMeta managingConservator
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_managingConservator} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              childMeta dateOfAdmission
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_dateOfAdmission} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              projectedDateForAchievingPermanency
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.projectedDateForAchievingPermanency} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">legalStatus_PermancyGoal</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.legalStatus_PermancyGoal} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">fatherMeta name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.fatherMeta_name} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">fatherMeta address</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.fatherMeta_address} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">fatherMeta phoneNumber</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.fatherMeta_phoneNumber} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">motherMeta name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.motherMeta_name} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">motherMeta address</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.motherMeta_address} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">motherMeta phoneNumber</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.motherMeta_phoneNumber} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">legalStatus</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.legalStatus} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">referringAgency_co</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.referringAgency_co} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              agentOfReferringAgency_co name
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.agentOfReferringAgency_co_name} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              agentOfReferringAgency_co address
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.agentOfReferringAgency_co_address} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">reactionToPlacement</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.reactionToPlacement} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">interests</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.interests} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta1 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta1_name} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta1 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta1_relationship} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta1 address</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta1_address} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta1 phoneNumber</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta1_phoneNumber} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta2 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta2_name} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta2 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta2_relationship} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta2 address</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta2_address} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta2 phoneNumber</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta2_phoneNumber} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta3 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta3_name} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta3 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta3_relationship} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta3 address</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta3_address} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta3 phoneNumber</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta3_phoneNumber} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta4 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta4_name} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta4 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta4_relationship} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta4 address</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta4_address} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">otherMeta4 phoneNumber</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.otherMeta4_phoneNumber} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedicalInformation
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedicalInformation} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              developmental_medicalHistory
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.developmental_medicalHistory} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">drugAllergies</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.drugAllergies} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">food1</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.food1} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">allergies</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.allergies} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">chronicHealth</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.chronicHealth} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">healthStrengths</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.healthStrengths} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">healthNeeds</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.healthNeeds} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastPhysicalExamination date
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.lastPhysicalExamination_date} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastPhysicalExamination location
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.lastPhysicalExamination_location} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastPhysicalExamination monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.lastPhysicalExamination_monitoredBy} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastDentalExamination date
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.lastDentalExamination_date} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastDentalExamination location
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.lastDentalExamination_location} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastDentalExamination monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.lastDentalExamination_monitoredBy} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastOpticalExamination date
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.lastOpticalExamination_date} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastOpticalExamination location
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.lastOpticalExamination_location} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              lastOpticalExamination monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.lastOpticalExamination_monitoredBy} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms1 medication
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms1_medication} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms1 dosage_frequency
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms1_dosage_frequency} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms1 purpose
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms1_purpose} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms1 possibleSideEffects
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms1_possibleSideEffects} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms1 monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms1_monitoredBy} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms2 medication
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms2_medication} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms2 dosage_frequency
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms2_dosage_frequency} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms2 purpose
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms2_purpose} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms2 possibleSideEffects
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms2_possibleSideEffects} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms2 monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms2_monitoredBy} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms3 medication
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms3_medication} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms3 dosage_frequency
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms3_dosage_frequency} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms3 purpose
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms3_purpose} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms3 possibleSideEffects
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms3_possibleSideEffects} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms3 monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms3_monitoredBy} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms4 medication
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms4_medication} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms4 dosage_frequency
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms4_dosage_frequency} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms4 purpose
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms4_purpose} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms4 possibleSideEffects
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms4_possibleSideEffects} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms4 monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms4_monitoredBy} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms5 medication
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms5_medication} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms5 dosage_frequency
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms5_dosage_frequency} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms5 purpose
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms5_purpose} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms5 possibleSideEffects
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms5_possibleSideEffects} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              currentMedications_dosages_targetedSymptoms5 monitoredBy
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.currentMedications_dosages_targetedSymptoms5_monitoredBy} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">behavioralStrengths</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.behavioralStrengths} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">behavioralNeeds</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.behavioralNeeds} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              behavioralTreatmentServices
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.behavioralTreatmentServices} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">emotionalStrengths</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.emotionalStrengths} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">emotionalNeeds</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.emotionalNeeds} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              emotionalTreatmentServices
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.emotionalTreatmentServices} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">food2</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.food2} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">eyeContact</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.eyeContact} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">physicalTouch</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.physicalTouch} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">personalProperty</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.personalProperty} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">certainTopics</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.certainTopics} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              knownContraindicationsToTheUuseOfRestraint
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.knownContraindicationsToTheUuseOfRestraint} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              de_escalatingTechniquesToAvoidRestraints_ebi
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.de_escalatingTechniquesToAvoidRestraints_ebi} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">child_de_escalator</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.child_de_escalator} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">staff_de_escalator</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.staff_de_escalator} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">therapist_de_escalator</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.therapist_de_escalator} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              childPreferred_de_escalation
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childPreferred_de_escalation} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">interventionStrategies</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.interventionStrategies} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">supervisionStrategies</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.supervisionStrategies} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              social_recreationalStrengths
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.social_recreationalStrengths} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">social_recreationalNeeds</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.social_recreationalNeeds} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">familyStrengths</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.familyStrengths} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">familyNeeds</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.familyNeeds} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor1 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor1_name} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor1 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor1_relationship} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor1 frequency</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor1_frequency} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor1supervisedBy</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor1_supervisedBy} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor1 location</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor1_location} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor1 length</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor1_length} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor2 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor2_name} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor2 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor2_relationship} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor2 frequency</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor2_frequency} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor2 supervisedBy</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor2_supervisedBy} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor2 location</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor2_location} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor2 length</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor2_length} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor3 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor3_name} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor3 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor3_relationship} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor3 frequency</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor3_frequency} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor3 supervisedBy</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor3_supervisedBy} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor3 location</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor3_location} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor3 length</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor3_length} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor4 name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor4_name} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor4 relationship</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor4_relationship} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor4 frequency</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor4_frequency} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor4 supervisedBy</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor4_supervisedBy} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor4 location</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor4_location} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">visitor4 length</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.visitor4_length} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              educational_vacationalStrengths
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.educational_vacationalStrengths} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              educational_vacationalNeeds
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.educational_vacationalNeeds} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">transitionalLiving</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.transitionalLiving} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">dischargePlanning</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.dischargePlanning} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">longRangeGoals</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.longRangeGoals} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">shortRangeGoals</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.shortRangeGoals} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">administorSign</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.administorSign} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">administorSignDate</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.administorSignDate} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">treatmentDirectorSign</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.treatmentDirectorSign} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              treatmentDirectorSignDate
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.treatmentDirectorSignDate} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <FormError errorId={this.props.id + "-error"} />
          <div
            style={{ textAlign: "right" }}
            className={this.props.userObj.isAdmin ? "form-group logInInputField" : "hideIt form-group logInInputField"}
          >
            <button className="darkBtn" onClick={this.validateForm}>
              Submit
            </button>
          </div>
        </div>
      );
    }
  }
}

export default TreatmentPlan72;
