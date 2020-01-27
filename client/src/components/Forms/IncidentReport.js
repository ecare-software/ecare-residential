import React, { Component } from "react";
import FormError from "../FormMods/FormError";
import "../../App.css";
import Axios from "axios";

/*
  missing from form
    "incident"

  to change
    remove time_of_incident - i change dateOfIncident to a date time picker

    seperation should probably be a date
*/

class IncidentReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childMeta_name: "",

      childMeta_gender: "",

      childMeta_dob: "",

      childMeta_dateOfAdmission: "",

      dateOfIncident: "",

      staff_involved_name: "",

      staff_involved_gender: "",

      time_of_incident: "",

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

      incident_explaination: "",

      seperation: "",

      result: "",

      able_to_prevent: "",

      notification_made_to: "",

      notification_made_date_time: "",

      notification_made_by: "",

      follow_up_results: "",

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
    Axios.post("/api/incidentReport", currentState);
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
            <h2>Incident Report</h2>
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
            <label className="control-label">Date of Admission</label>{" "}
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
              id="dateOfIncident"
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
              type="text"
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
              Name of Client Witness (2)
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
              Client Witness Date of Admission (2)
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
            <label className="control-label">Explain the Incident</label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="incident_explaination"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              If supervised seperation was used, how long was the student
              seperated?
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="seperation"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Result of the incident</label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="result"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Were you able to prevent a more serious incident ?
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              id="able_to_prevent"
              className="form-control"
            ></textarea>
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
            <label className="control-label">
              When was the notification made ?
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="notification_made_date_time"
              className="form-control"
              type="datetime-local"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">By who ?</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="notification_made_by"
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Results After Following Up</label>{" "}
            <textarea onChange={this.handleFieldInput}
              id="follow_up_results"
              className="form-control"></textarea>
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
            <h2>Incident Report</h2>
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Child's Name</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_name} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Child's Gender</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_gender} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Child's Date of Birth</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_dob} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="date"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Date of Admission</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.childMeta_dateOfAdmission} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="date"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Date of Incident</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.dateOfIncident} disabled={this.props.userObj.isAdmin ? false : true}
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
              value={this.props.formData.staff_involved_name} disabled={this.props.userObj.isAdmin ? false : true}
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
              value={this.props.formData.staff_involved_gender} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Time of Incident</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.time_of_incident} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Name of Staff Witness</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.staff_witness_name} disabled={this.props.userObj.isAdmin ? false : true}
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
              value={this.props.formData.staff_witness_gender} disabled={this.props.userObj.isAdmin ? false : true}
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
              value={this.props.formData.client_witness_name1} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Gender of Client Witness (1)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_gender1} disabled={this.props.userObj.isAdmin ? false : true}
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
              value={this.props.formData.client_witness_dob1} disabled={this.props.userObj.isAdmin ? false : true}
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
              value={this.props.formData.client_witness_doa1} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="date"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Name of Client Witness (2)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_name2} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Gender of Client Witness (2)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_gender2} disabled={this.props.userObj.isAdmin ? false : true}
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
              value={this.props.formData.client_witness_dob2} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="date"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Client Witness Date of Admission (2)
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.client_witness_doa2} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="date"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Explain the Incident</label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.incident_explaination} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              If supervised seperation was used, how long was the student
              seperated?
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.seperation} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Result of the incident</label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.result} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Were you able to prevent a more serious incident ?
            </label>{" "}
            <textarea
              onChange={this.handleFieldInput}
              value={this.props.formData.able_to_prevent} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              Name of individual you notified.
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.notification_made_to} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              When was the notification made ?
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.notification_made_date_time} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="datetime-local"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">By who ?</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.notification_made_by} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>

          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">Results After Following Up</label>{" "}
            <textarea onChange={this.handleFieldInput}
              value={this.props.formData.follow_up_results} disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"></textarea>
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
    }
  }
}

export default IncidentReport;
