import React, { Component } from "react";
import FormError from "../FormMods/FormError";
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

      homeId: this.props.valuesSet === true ? "" : this.props.userObj.homeId
    };
  }

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
    Axios.post("/api/restraintReport", currentState);
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
          <div style={{ margin: "75px 0px" }}>
            <h2>Restriant Report</h2>
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta_name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta_gender</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_gender"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta_dob</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="childMeta_dob"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              childMeta_dateOfAdmission
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
            <label className="control-label">date_of_incident</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="date_of_incident"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">staff_involved_name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="staff_involved_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">staff_involved_gender</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="staff_involved_gender"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">time_of_incident</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="time_of_incident"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">staff_witness_name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="staff_witness_name"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">staff_witness_gender</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="staff_witness_gender"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">staff_witness_name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="staff_witness_name"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> staff_witness_gender</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    staff_witness_gender"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> client_witness_name1</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    client_witness_name1"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              client_witness_gender1
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    client_witness_gender1"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> client_witness_dob1</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    client_witness_dob1"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> client_witness_doa1</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    client_witness_doa1"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> client_witness_name2</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    client_witness_name2"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              client_witness_gender2
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    client_witness_gender2"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> client_witness_dob2</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    client_witness_dob2"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> client_witness_doa2</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    client_witness_doa2"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> risk_explaination</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    risk_explaination"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              risk_alternative_strategies
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    risk_alternative_strategies"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> type_of_restraint</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    type_of_restraint"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> risk_stategies_used</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    risk_stategies_used"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> result_of_incident</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    result_of_incident"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> injuries</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    injuries"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> action_taken</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    action_taken"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> able_to_prevent</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    able_to_prevent"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> restraint_start_time</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    restraint_start_time"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> restraint_end_time</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    restraint_end_time"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> notification_made_to</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    notification_made_to"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              notification_made_date_time
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    notification_made_date_time"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> interviewer</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    interviewer"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> date_of_interview</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    date_of_interview"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> client_behavior</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    client_behavior"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              client_restraint_description
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    client_restraint_description"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> client_responce</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    client_responce"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              procedural_approved_reason
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    procedural_approved_reason"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              procedural_approved_standards
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
              procedural_any_injuries
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
            <label className="control-label"> procedural_comments</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="    procedural_comments"
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
    } else {
      return (
        <div style={{ margin: "50px 20px 0px 20px" }}>
          <div style={{ margin: "75px 0px" }}></div>
          <h2>Restriant Report</h2>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">childMeta_name</label>{" "}
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
            <label className="control-label">childMeta_gender</label>{" "}
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
            <label className="control-label">childMeta_dob</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_dob}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              childMeta_dateOfAdmission
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_dateOfAdmission}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">date_of_incident</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.date_of_incident}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">staff_involved_name</label>{" "}
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
            <label className="control-label">staff_involved_gender</label>{" "}
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
            <label className="control-label">time_of_incident</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.time_of_incident}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">staff_witness_name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.staff_witness_name}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">staff_witness_gender</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.staff_witness_gender}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">staff_witness_name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.staff_witness_name}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> staff_witness_gender</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.staff_witness_gender}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> client_witness_name1</label>{" "}
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
              client_witness_gender1
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
            <label className="control-label"> client_witness_dob1</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_dob1}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> client_witness_doa1</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_doa1}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> client_witness_name2</label>{" "}
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
              client_witness_gender2
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
            <label className="control-label"> client_witness_dob2</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_dob2}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> client_witness_doa2</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_doa2}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> risk_explaination</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.risk_explaination}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              risk_alternative_strategies
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.risk_alternative_strategies}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> type_of_restraint</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.type_of_restraint}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> risk_stategies_used</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.risk_stategies_used}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> result_of_incident</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.result_of_incident}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> injuries</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.injuries}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> action_taken</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.action_taken}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> able_to_prevent</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.able_to_prevent}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> restraint_start_time</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.restraint_start_time}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> restraint_end_time</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.restraint_end_time}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> notification_made_to</label>{" "}
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
            <label className="control-label">
              {" "}
              notification_made_date_time
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.notification_made_date_time}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> interviewer</label>{" "}
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
            <label className="control-label"> date_of_interview</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.date_of_interview}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> client_behavior</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_behavior}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              client_restraint_description
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_restraint_description}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label"> client_responce</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_responce}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              {" "}
              procedural_approved_reason
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
              procedural_approved_standards
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
              procedural_any_injuries
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
            <label className="control-label"> procedural_comments</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.procedural_comments}
              disabled={this.props.userObj.isAdmin ? false : true}
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

export default RestraintReport;
