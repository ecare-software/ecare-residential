import React, { Component } from "react";
import FormError from "../FormMods/FormError";
import FormAlert from "../Forms/FormAlert";
import "../../App.css";
import Axios from "axios";

class RestraintReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childMeta_name: "",
      childMeta_gender: "",
      childMeta_dob: "",
      childMeta_dateOfAdmission: "",
      date_of_incident: "",
      staff_involved_name: "",
      staff_involved_gender: "",
      time_of_incident: "",
      staff_witness_name: "",
      staff_witness_gender: "",
      staff_witness_name: "",

      staff_witness_gender: "",

      client_witness_name1: "",

      client_witness_gender1: "",

      client_witness_dob1: "",

      client_witness_doa1: "",

      client_witness_name2: "",

      client_witness_gender2: "",

      client_witness_dob2: "",

      client_witness_doa2: "",

      risk_explaination: "",

      risk_alternative_strategies: "",

      type_of_restraint: "",

      risk_stategies_used: "",

      result_of_incident: "",

      injuries: "",

      action_taken: "",

      able_to_prevent: "",

      restraint_start_time: "",

      restraint_end_time: "",

      notification_made_to: "",

      notification_made_date_time: "",

      interviewer: "",

      date_of_interview: "",

      client_behavior: "",

      client_restraint_description: "",

      client_responce: "",

      procedural_approved_reason: "",

      procedural_approved_standards: "",

      procedural_any_injuries: "",

      procedural_comments: "",

      createdBy: this.props.valuesSet === true ? "" : this.props.userObj.email,

      createdByName:
        this.props.valuesSet === true
          ? ""
          : this.props.userObj.firstName + " " + this.props.userObj.lastName,

      lastEditDate: new Date(),

      homeId: this.props.valuesSet === true ? "" : this.props.userObj.homeId,

      formHasError: false,

      formSubmitted: false,

      formErrorMessage: ""
    };
  }

  toggleSuccessAlert = () => {
    this.setState({ formSubmitted: !this.state.formSubmitted });
  };

  toggleErrorAlert = () => {
    this.setState({
      formHasError: !this.state.formHasError,
      formErrorMessage: ""
    });
  };

  handleFieldInput = event => {
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

  submit = () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    console.log(JSON.stringify(currentState));
    Axios.post("/api/restraintReport", currentState).then((res)=>{
      window.scrollTo(0, 0);
      this.toggleSuccessAlert();
      setTimeout(this.toggleSuccessAlert, 3000);
    })
    .catch(e => {
      this.setState({
        formHasError: true,
        formErrorMessage: "Error Submitting Restraint Report"
      });
    });
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
    if (!this.props.valuesSet) {
      return (
        <div style={{ margin: "50px 20px 0px 20px" }}>
          <FormAlert
            doShow={this.state.formSubmitted}
            type="success"
            heading="Thank you for your submission!"
          ></FormAlert>
          <FormAlert
            doShow={this.state.formHasError}
            toggleErrorAlert={this.toggleErrorAlert}
            type="danger"
            heading="Error Submitting form"
          >
            <p>{this.state.formErrorMessage}</p>
          </FormAlert>
          <div style={{ margin: "75px 0px" }}>
            <h2>Restriant Report</h2>
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Child's Name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Child's Gender</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_gender"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Child's Date of Birth</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_dob"
              className="form-control"
              type="date"
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
              className="form-control"
              type="date"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Date of Incident</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="date_of_incident"
              className="form-control"
              type="datetime-local"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Name of Care Staff Involved
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="staff_involved_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Gender of Care Staff Involved
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="staff_involved_gender"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Time of Incident</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="time_of_incident"
              className="form-control"
              type="datetime-local"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Name of Staff Witness</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="staff_witness_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Gender of Staff Witness
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="staff_witness_gender"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Name of Client Witness (1)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="client_witness_name1"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              Gender of Client Witness (1)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="client_witness_gender1"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Client Witness Date of Birth (1)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="client_witness_dob1"
              className="form-control"
              type="date"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Client Witness Date of Admission (1)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="client_witness_doa1"
              className="form-control"
              type="date"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Name Client Witness (2)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="client_witness_name2"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              Gender of Client Witness (2)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="client_witness_gender2"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Client Witness Date of Birth (2)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="client_witness_dob2"
              className="form-control"
              type="date"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Client Witness Date of Admission (1)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="client_witness_doa2"
              className="form-control"
              type="date"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Description of behavior necessitating Restraint.<br/>Describe how
              client was at risk of harm to self or others. Include all
              pertinent details and behavior leading up to the incident. Be
              specific:
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="risk_explaination"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              Alternative strategies or intervention attempted prior to EPR.
              Client response to attempted interventions. Be specific.
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="risk_alternative_strategies"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Type of Restraint. Be specific.
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="type_of_restraint"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              What strategies were used during Restraint to calm client? How did
              you explain behaviors necessary for release? How often?
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="risk_stategies_used"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Results of incident, including Restraint. Examine client for
              injuries.
              <br />
              Injuries from client behavior prior to Restraint (e.g., SIB,
              physical aggression, Etc.), how they occurred, and treatment
              provided
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="result_of_incident"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Injuries sustained during or as result of the Restraint, How they
              occurred, and treatment provided
              <br />
              Client’s response to Restraint.
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="injuries"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Action taken to help client return to normal activities following
              release from the Restraint.
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="action_taken"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              In your opinion, were you able to prevent a more serious incident?
              Explain.
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="able_to_prevent"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Time restraint started</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="restraint_start_time"
              className="form-control"
              type="datetime-local"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Time restraint ended</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="restraint_end_time"
              className="form-control"
              type="datetime-local"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Name of individual you notified.
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="notification_made_to"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> Time of Notification</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="notification_made_date_time"
              className="form-control"
              type="datetime-local"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Name of Interviewer</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="interviewer"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Date of Interview</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="date_of_interview"
              className="form-control"
              type="datetime-local"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              What was your behavior?
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="client_behavior"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              Describe the Restraint?
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="client_restraint_description"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              How did you respond to the Restraint
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="client_responce"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              Restraint took place for approved reason:
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="procedural_approved_reason"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              Restraint met Standards:
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    procedural_approved_standards"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              Any injury or claim of injury:
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    procedural_any_injuries"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Comments. Corrective action, including training, needed
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="procedural_comments"
              className="form-control"
            ></textarea>
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
    } else {
      return (
        <div style={{ margin: "50px 20px 0px 20px" }}>
          <div style={{ margin: "75px 0px" }}>
            <h2>Restriant Report</h2>
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Child's Name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_name}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Child's Gender</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_gender}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Child's Date of Birth</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_dob}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="date"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Child's Date of Admission
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_dateOfAdmission}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="date"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Date of Incident</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.date_of_incident}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="datetime-local"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Name of Care Staff Involved
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.staff_involved_name}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Gender of Care Staff Involved
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.staff_involved_gender}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Time of Incident</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.time_of_incident}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="datetime-local"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Name of Staff Witness</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.staff_witness_name}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Gender of Staff Witness
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.staff_witness_gender}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"/>{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Name of Client Witness (1)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_name1}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              Gender of Client Witness (1)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_gender1}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Client Witness Date of Birth (1)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_dob1}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="date"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Client Witness Date of Admission (1)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_doa1}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="date"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Name Client Witness (2)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_name2}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              Gender of Client Witness (2)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_gender2}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Client Witness Date of Birth (2)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_dob2}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="date"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Client Witness Date of Admission (1)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_doa2}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="date"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Description of behavior necessitating Restraint. Describe how
              client was at risk of harm to self or others. Include all
              pertinent details and behavior leading up to the incident. Be
              specific:
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.risk_explaination}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              Alternative strategies or intervention attempted prior to EPR.
              Client response to attempted interventions. Be specific.
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.risk_alternative_strategies}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Type of Restraint. Be specific.
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.type_of_restraint}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              What strategies were used during Restraint to calm client? How did
              you explain behaviors necessary for release? How often?
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.risk_stategies_used}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Results of incident, including Restraint. Examine client for
              injuries.
              <br />
              Injuries from client behavior prior to Restraint (e.g., SIB,
              physical aggression, Etc.), how they occurred, and treatment
              provided
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.result_of_incident}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Injuries sustained during or as result of the Restraint, How they
              occurred, and treatment provided
              <br />
              Client’s response to Restraint.
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.injuries}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Action taken to help client return to normal activities following
              release from the Restraint.
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.action_taken}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              In your opinion, were you able to prevent a more serious incident?
              Explain.
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.able_to_prevent}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Time restraint started</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.restraint_start_time}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="datetime-local"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Time restraint ended</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.restraint_end_time}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="datetime-local"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Name of individual you notified.
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.notification_made_to}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> Time of Notification</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.notification_made_date_time}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="datetime-local"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Name of Interviewer</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.interviewer}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Date of Interview</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.date_of_interview}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="datetime-local"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              What was your behavior?
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.client_behavior}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              Describe the Restraint?
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.client_restraint_description}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              How did you respond to the Restraint
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.client_responce}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              Restraint took place for approved reason:
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.procedural_approved_reason}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              Restraint met Standards:
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.procedural_approved_standards}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              Any injury or claim of injury:
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.procedural_any_injuries}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Comments. Corrective action, including training, needed
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.procedural_comments}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>
          <FormError errorId={this.props.id + "-error"} />
          <div
            className="form-group logInInputField"
            style={{ textAlign: "right" }}>
            <button className="darkBtn" onClick={this.validateForm}>
              Submit
            </button>
          </div>
        </div>
      );
    }
  }
}

export default RestraintReport;
