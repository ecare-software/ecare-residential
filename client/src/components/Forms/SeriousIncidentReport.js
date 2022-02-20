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
import { isAdminUser } from "../../utils/AdminReportingRoles";
import TextareaAutosize from "react-textarea-autosize";
import StaffOption from "../../utils/StaffOption.util";

class SeriousIncidentReport extends Component {
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

      homeId: this.props.valuesSet === true ? "" : this.props.userObj.homeId,

      formHasError: false,

      formSubmitted: false,

      formErrorMessage: "",

      loadingClients: true,

      loadingSig: true,

      clients: [],
      loadingStaff: true,
      staff: [],
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
      clientId: "",
    });
  };

  submit = async () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    if (this.props.valuesSet) {
      try {
        await Axios.put(
          `/api/seriousIncidentReport/${this.state.homeId}/${this.props.formData._id}`,
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
          formErrorMessage: "Error Submitting Incident Report",
          loadingClients: false,
        });
      }
    } else {
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/seriousIncidentReport", currentState)
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
            formErrorMessage: "Error Submitting Incident Report",
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
      "client_witness_gender2",
      "client_witness_dob2",
      "client_witness_doa2",
      "client_witness_name2",
      "loadingClients",
      "loadingStaff",
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
          loadingClients: false,
        });
      }, 2000);
    } catch (e) {
      console.log(e);
      alert("Error loading clients");
    }
  };

  getStaff = async () => {
    try {
      let { data: staff } = await Axios.get(
        `/api/users/${this.props.userObj.homeId}`
      );

      staff = staff.filter((staff) => {
        return !staff.hasOwnProperty("active") || staff.active === true;
      });

      setTimeout(() => {
        this.setState({
          ...this.state,
          staff,
          loadingStaff: false,
        });
      }, 2000);
    } catch (e) {
      console.log(e);
      alert("Error loading staff");
    }
  };

  componentDidMount() {
    if (this.props.valuesSet) {
      this.setValues();
    } else {
      this.getClients();
      this.getStaff();
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
      });
      await this.setState({ ...clonedState, clientId: client._id });
    }
  };

  handleStaffSelect = async (val, stateValToSet) => {
    if (val !== null) {
      try {
        let staff = JSON.parse(val);
        staff = `${staff.firstName} ${staff.lastName}`;

        await this.setState({ ...this.state, ...{ [stateValToSet]: staff } });
      } catch (e) {
        alert("Error parsing staff user data");
      }
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
            <h2 className="formTitle">Serious Incident Report</h2>
          </div>
          {this.state.loadingClients && this.state.loadingStaff ? (
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
            <div className="formFieldsMobile">
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
                <label className="control-label">Date of Admission</label>{" "}
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
                <label className="control-label">Date of Incident</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="dateOfIncident"
                  value={this.state.dateOfIncident}
                  className="form-control"
                  type="date"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Name of Care Staff Involved
                </label>{" "}
                <Form.Control
                  as="select"
                  defaultValue={null}
                  onChange={(e) => {
                    this.handleStaffSelect(
                      e.target.value,
                      "staff_involved_name"
                    );
                  }}
                >
                  {[null, ...this.state.staff].map(
                    (staff) => (
                      <StaffOption data={staff} />
                    ),
                    []
                  )}
                </Form.Control>
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Gender of Care Staff Involved
                </label>{" "}
                <Form.Control
                  as="select"
                  onChange={this.handleFieldInput}
                  value={this.state.staff_involved_gender}
                  id="staff_involved_gender"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Time of Incident</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="time_of_incident"
                  value={this.state.time_of_incident}
                  className="form-control"
                  type="time"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Name of Staff Witness
                </label>{" "}
                <Form.Control
                  as="select"
                  defaultValue={null}
                  onChange={(e) => {
                    this.handleStaffSelect(
                      e.target.value,
                      "staff_witness_name"
                    );
                  }}
                >
                  {[null, ...this.state.staff].map(
                    (staff) => (
                      <StaffOption data={staff} />
                    ),
                    []
                  )}
                </Form.Control>
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Gender of Staff Witness
                </label>{" "}
                <Form.Control
                  as="select"
                  onChange={this.handleFieldInput}
                  value={this.state.staff_witness_gender}
                  id="staff_witness_gender"
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
                  Name of Client Witness (1)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="client_witness_name1"
                  value={this.state.client_witness_name1}
                  className="form-control"
                  type="text"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Gender of Client Witness (1)
                </label>{" "}
                <Form.Control
                  as="select"
                  onChange={this.handleFieldInput}
                  value={this.state.client_witness_gender1}
                  id="client_witness_gender1"
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
                  Client Witness Date of Birth (1)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="client_witness_dob1"
                  value={this.state.client_witness_dob1}
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
                  value={this.state.client_witness_doa1}
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
                  value={this.state.client_witness_name2}
                  className="form-control"
                  type="text"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Gender of Client Witness (2)
                </label>{" "}
                <Form.Control
                  as="select"
                  onChange={this.handleFieldInput}
                  value={this.state.client_witness_gender2}
                  id="client_witness_gender2"
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
                  Client Witness Date of Birth (2)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="client_witness_dob2"
                  value={this.state.client_witness_dob2}
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
                  value={this.state.client_witness_doa2}
                  className="form-control"
                  type="date"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Explain the Incident
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id="incident_explaination"
                  value={this.state.incident_explaination}
                  className="form-control"
                ></TextareaAutosize>
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
                  value={this.state.seperation}
                  className="form-control"
                  type="text"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Result of the incident
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id="result"
                  value={this.state.result}
                  className="form-control"
                ></TextareaAutosize>
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Were you able to prevent a more serious incident ?
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id="able_to_prevent"
                  value={this.state.able_to_prevent}
                  className="form-control"
                ></TextareaAutosize>
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Name of individual you notified.
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="notification_made_to"
                  value={this.state.notification_made_to}
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
                  value={this.state.notification_made_date_time}
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
                  value={this.state.notification_made_by}
                  className="form-control"
                  type="text"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Results After Following Up
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id="follow_up_results"
                  value={this.state.follow_up_results}
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
            <h2 className="formTitle">Serious Incident Report</h2>
          </div>

          <div className="formFieldsMobileReport">
            {this.state.loadingClients && this.state.loadingStaff ? (
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
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.childMeta_name}
                    id={"childMeta_name"}
                    className="form-control"
                    type="text"
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
                    Child's Date of Birth
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.childMeta_dob}
                    className="form-control"
                    type="date"
                    id="childMeta_dob"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Date of Admission
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.childMeta_dateOfAdmission}
                    className="form-control"
                    type="date"
                    id="childMeta_dateOfAdmission"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Date of Incident</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.dateOfIncident}
                    className="form-control"
                    type="date"
                    id="dateOfIncident"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Name of Care Staff Involved
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.staff_involved_name}
                    id="staff_involved_name"
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
                  <Form.Control
                    as="select"
                    onChange={this.handleFieldInput}
                    value={this.state.staff_involved_gender}
                    id="staff_involved_gender"
                    id="staff_involved_gender"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option value={""}>Choose</option>
                  </Form.Control>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Time of Incident</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.time_of_incident}
                    id="time_of_incident"
                    className="form-control"
                    type="time"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Name of Staff Witness
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.staff_witness_name}
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
                  <Form.Control
                    as="select"
                    onChange={this.handleFieldInput}
                    value={this.state.staff_witness_gender}
                    id="staff_witness_gender"
                    id="staff_witness_gender"
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
                    Name of Client Witness (1)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_name1}
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
                  <Form.Control
                    as="select"
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_gender1}
                    id="client_witness_gender1"
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
                    Client Witness Date of Birth (1)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_dob1}
                    className="form-control"
                    type="date"
                    id="client_witness_dob1"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Client Witness Date of Admission (1)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_doa1}
                    className="form-control"
                    type="date"
                    id="client_witness_doa1"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Name of Client Witness (2)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_name2}
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
                  <Form.Control
                    as="select"
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_gender2}
                    id="client_witness_gender2"
                    id="client_witness_gender2"
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
                    Client Witness Date of Birth (2)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_dob2}
                    className="form-control"
                    type="date"
                    id="client_witness_dob2"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Client Witness Date of Admission (2)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_doa2}
                    className="form-control"
                    type="date"
                    id="client_witness_doa2"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Explain the Incident
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.incident_explaination}
                    id="incident_explaination"
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    If supervised seperation was used, how long was the student
                    seperated?
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.seperation}
                    id="seperation"
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Result of the incident
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.result}
                    id="result"
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Were you able to prevent a more serious incident ?
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.able_to_prevent}
                    id="able_to_prevent"
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Name of individual you notified.
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.notification_made_to}
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
                    value={this.state.notification_made_date_time}
                    className="form-control"
                    type="datetime-local"
                    id="notification_made_date_time"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">By who ?</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.notification_made_by}
                    id="notification_made_by"
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Results After Following Up
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.follow_up_results}
                    id="follow_up_results"
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
        </div>
      );
    }
  }
}

export default SeriousIncidentReport;
