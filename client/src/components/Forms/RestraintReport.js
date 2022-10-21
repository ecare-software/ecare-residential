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
var interval = 0; // used for autosaving
let initAutoSave = false;
class RestraintReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childMeta_name: "",
      childMeta_gender: "",
      childMeta_dob: "",
      childMeta_dateOfAdmission: "",
      staff_involved_name: "",
      staff_involved_gender: "",
      time_of_incident: "",
      staff_witness_name: "",
      staff_witness_gender: "",

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

      lastEditDate: null,

      homeId: this.props.valuesSet === true ? "" : this.props.userObj.homeId,

      formHasError: false,

      formSubmitted: false,

      formErrorMessage: "",

      loadingClients: true,

      loadingStaff: true,

      loadingSig: true,

      clients: [],
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
      staff_involved_name: "",
      staff_involved_gender: "",
      time_of_incident: "",
      staff_witness_name: "",
      staff_witness_gender: "",

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
      clientId: "",
    });
  };

  // auto save
  autoSave = async () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    delete currentState.clients;
    console.log("auto saving");
    if (initAutoSave) {
      console.log("updating existing form");
      try {
        const { data } = await Axios.put(
          `/api/restraintReport/${this.state.homeId}/${this.state._id}`,
          {
            ...currentState,
          }
        );

        this.setState({ ...this.state, ...data });
      } catch (e) {
        console.log(e);
        this.setState({
          formHasError: true,
          formErrorMessage: "Error Submitting Restraint Report",
          loadingClients: false,
        });
      }
    } else {
      console.log("creating");
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/restraintReport", currentState)
        .then((res) => {
          initAutoSave = true;

          this.setState({
            ...this.state,
            ...res.data,
          });
        })
        .catch((e) => {
          console.log(e);
          this.setState({
            formHasError: true,
            formErrorMessage: "Error Submitting Restraint Report",
            loadingClients: false,
          });
        });
    }
  };

  submit = async () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    delete currentState.clients;
    initAutoSave = false;
    clearInterval(interval);
    if (this.props.valuesSet || this.state._id) {
      try {
        const { data } = await Axios.put(
          `/api/restraintReport/${this.state.homeId}/${this.state._id}`,
          {
            ...currentState,
          }
        );

        this.setState({ ...this.state, ...data });
        window.scrollTo(0, 0);
        this.toggleSuccessAlert();
        // setTimeout(() => {
        //   this.toggleSuccessAlert();
        // }, 2000);
      } catch (e) {
        console.log(e);
        this.setState({
          formHasError: true,
          formErrorMessage: "Error Submitting Restraint Report",
          loadingClients: false,
        });
      }
    } else {
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/restraintReport", currentState)
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
            formErrorMessage: "Error Submitting Restraint Report",
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
      "client_witness_name2",
      "client_witness_gender2",
      "client_witness_dob2",
      "client_witness_doa2",
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

  async componentDidMount() {
    if (this.props.valuesSet) {
      this.setValues();
    } else {
      await this.getClients();
      //interval = setInterval(() => {
      //      this.autoSave();
      //      }, 10000);
    }
  }

  handleClientSelect = async (event) => {
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

  handleClientSelectWithness1 = async (event) => {
    if (event.target.value !== null) {
      try {
        const client = JSON.parse(event.target.value);
        await this.setState({
          ...this.state,
          client_witness_name1: client.childMeta_name,
          client_witness_gender1: client.childMeta_gender,
          client_witness_dob1: client.childMeta_dob,
          client_witness_doa1: client.childMeta_dateOfAdmission,
        });
      } catch (e) {
        alert("Error parsing data");
        console.log(e);
      }
    }
  };

  handleClientSelectWithness2 = async (event) => {
    if (event.target.value !== null) {
      try {
        const client = JSON.parse(event.target.value);
        await this.setState({
          ...this.state,
          client_witness_name2: client.childMeta_name,
          client_witness_gender2: client.childMeta_gender,
          client_witness_dob2: client.childMeta_dob,
          client_witness_doa2: client.childMeta_dateOfAdmission,
        });
      } catch (e) {
        alert("Error parsing data");
        console.log(e);
      }
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
        <div className='formComp'>
          {this.state.formSubmitted || this.state.formHasError ? (
            <React.Fragment>
              {this.state.formSubmitted && <FormSuccessAlert />}
              <FormAlert
                doShow={this.state.formHasError}
                toggleErrorAlert={this.toggleErrorAlert}
                type='danger'
                heading='Error Submitting form'
              >
                <p>{this.state.formErrorMessage}</p>
              </FormAlert>
            </React.Fragment>
          ) : (
            <React.Fragment />
          )}
          <div className='formTitleDiv'>
            <h2 className='formTitle'>Restraint Report</h2>
            <h5
              className='text-center'
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
          {this.state.loadingClients && this.state.loadingStaff ? (
            <div className='formLoadingDiv'>
              <div>
                <ClipLoader
                  className='formSpinner'
                  size={50}
                  color={"#ffc107"}
                />
              </div>

              <p>Loading...</p>
            </div>
          ) : (
            <div className='formFieldsMobile'>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>Child's Name</label>{" "}
                <Form.Control
                  as='select'
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
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>Child's Gender</label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.childMeta_gender}
                  id='childMeta_gender'
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Child's Date of Birth
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='childMeta_dob'
                  value={this.state.childMeta_dob}
                  className='form-control'
                  type='date'
                />{" "}
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Child's Date of Admission
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='childMeta_dateOfAdmission'
                  value={this.state.childMeta_dateOfAdmission}
                  className='form-control'
                  type='date'
                />{" "}
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Name of Care Staff Involved
                </label>{" "}
                <Form.Control
                  as='select'
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
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Gender of Care Staff Involved
                </label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.staff_involved_gender}
                  id='staff_involved_gender'
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Date and time of incident
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='time_of_incident'
                  value={this.state.time_of_incident}
                  className='form-control'
                  type='datetime-local'
                />{" "}
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Name of Staff Witness
                </label>{" "}
                <Form.Control
                  as='select'
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
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Gender of Staff Witness
                </label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.staff_witness_gender}
                  id='staff_witness_gender'
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Name of Client Witness (1)
                </label>{" "}
                <Form.Control
                  as='select'
                  defaultValue={null}
                  onChange={this.handleClientSelectWithness1}
                >
                  {[null, ...this.state.clients].map(
                    (client, idx) => (
                      <ClientOption key={`${idx}`} data={client} />
                    ),
                    []
                  )}
                </Form.Control>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  {" "}
                  Gender of Client Witness (1)
                </label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.client_witness_gender1}
                  id='client_witness_gender1'
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Client Witness Date of Birth (1)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='client_witness_dob1'
                  value={this.state.client_witness_dob1}
                  className='form-control'
                  type='date'
                />{" "}
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Client Witness Date of Admission (1)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='client_witness_doa1'
                  value={this.state.client_witness_doa1}
                  className='form-control'
                  type='date'
                />{" "}
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Name Client Witness (2)
                </label>{" "}
                <Form.Control
                  as='select'
                  defaultValue={null}
                  onChange={this.handleClientSelectWithness2}
                >
                  {[null, ...this.state.clients].map(
                    (client, idx) => (
                      <ClientOption key={`${idx}`} data={client} />
                    ),
                    []
                  )}
                </Form.Control>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  {" "}
                  Gender of Client Witness (2)
                </label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.client_witness_gender2}
                  id='client_witness_gender2'
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Client Witness Date of Birth (2)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='client_witness_dob2'
                  value={this.state.client_witness_dob2}
                  className='form-control'
                  type='date'
                />{" "}
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Client Witness Date of Admission (2)
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='client_witness_doa2'
                  value={this.state.client_witness_doa2}
                  className='form-control'
                  type='date'
                />{" "}
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Description of behavior necessitating Restraint.
                  <br />
                  Describe how client was at risk of harm to self or others.
                  Include all pertinent details and behavior leading up to the
                  incident. Be specific:
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='risk_explaination'
                  value={this.state.risk_explaination}
                  className='form-control'
                ></TextareaAutosize>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  {" "}
                  Alternative strategies or intervention attempted prior to EPR.
                  Client response to attempted interventions. Be specific.
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='risk_alternative_strategies'
                  value={this.state.risk_alternative_strategies}
                  className='form-control'
                ></TextareaAutosize>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Type of Restraint. Be specific.
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='type_of_restraint'
                  value={this.state.type_of_restraint}
                  className='form-control'
                ></TextareaAutosize>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  What strategies were used during Restraint to calm client? How
                  did you explain behaviors necessary for release? How often?
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='risk_stategies_used'
                  value={this.state.risk_stategies_used}
                  className='form-control'
                ></TextareaAutosize>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Results of incident, including Restraint. Examine client for
                  injuries.
                  <br />
                  Injuries from client behavior prior to Restraint (e.g., SIB,
                  physical aggression, Etc.), how they occurred, and treatment
                  provided
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='result_of_incident'
                  value={this.state.result_of_incident}
                  className='form-control'
                ></TextareaAutosize>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Injuries sustained during or as result of the Restraint, How
                  they occurred, and treatment provided
                  <br />
                  Client’s response to Restraint.
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='injuries'
                  value={this.state.injuries}
                  className='form-control'
                ></TextareaAutosize>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Action taken to help client return to normal activities
                  following release from the Restraint.
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='action_taken'
                  value={this.state.action_taken}
                  className='form-control'
                ></TextareaAutosize>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  In your opinion, were you able to prevent a more serious
                  incident? Explain.
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='able_to_prevent'
                  value={this.state.able_to_prevent}
                  className='form-control'
                ></TextareaAutosize>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Time restraint started
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='restraint_start_time'
                  value={this.state.restraint_start_time}
                  className='form-control'
                  type='datetime-local'
                />{" "}
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Time restraint ended
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='restraint_end_time'
                  value={this.state.restraint_end_time}
                  className='form-control'
                  type='datetime-local'
                />{" "}
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Name of individual you notified.
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='notification_made_to'
                  value={this.state.notification_made_to}
                  className='form-control'
                  type='text'
                />{" "}
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  {" "}
                  Time of Notification
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='notification_made_date_time'
                  value={this.state.notification_made_date_time}
                  className='form-control'
                  type='datetime-local'
                />{" "}
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Name of Interviewer
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='interviewer'
                  value={this.state.interviewer}
                  className='form-control'
                  type='text'
                />{" "}
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>Date of Interview</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='date_of_interview'
                  value={this.state.date_of_interview}
                  className='form-control'
                  type='datetime-local'
                />{" "}
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  What was your behavior?
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='client_behavior'
                  value={this.state.client_behavior}
                  className='form-control'
                ></TextareaAutosize>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  {" "}
                  Describe the Restraint?
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='client_restraint_description'
                  value={this.state.client_restraint_description}
                  className='form-control'
                ></TextareaAutosize>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  How did you respond to the Restraint
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='client_responce'
                  value={this.state.client_responce}
                  className='form-control'
                ></TextareaAutosize>
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  {" "}
                  Restraint took place for approved reason:
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='procedural_approved_reason'
                  value={this.state.procedural_approved_reason}
                  className='form-control'
                  type='text'
                />{" "}
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  {" "}
                  Restraint met Standards:
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='procedural_approved_standards'
                  value={this.state.procedural_approved_standards}
                  className='form-control'
                  type='text'
                />{" "}
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  {" "}
                  Any injury or claim of injury:
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='procedural_any_injuries'
                  value={this.state.procedural_any_injuries}
                  className='form-control'
                  type='text'
                />{" "}
              </div>

              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Comments. Corrective action, including training, needed
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='procedural_comments'
                  value={this.state.procedural_comments}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <FormError errorId={this.props.id + "-error"} />
              <div
                className='form-group logInInputField'
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <button
                  className='lightBtn'
                  onClick={() => {
                    this.validateForm(true);
                  }}
                >
                  Save
                </button>

                <button
                  className='darkBtn'
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
        <div className='formComp'>
          {this.state.formSubmitted || this.state.formHasError ? (
            <React.Fragment>
              {this.state.formSubmitted && <FormSavedAlert />}
              <FormAlert
                doShow={this.state.formHasError}
                toggleErrorAlert={this.toggleErrorAlert}
                type='danger'
                heading='Error Submitting form'
              >
                <p>{this.state.formErrorMessage}</p>
              </FormAlert>
            </React.Fragment>
          ) : (
            <React.Fragment />
          )}
          <div className='formTitleDivReport'>
            <h2 className='formTitle'>Restraint Report</h2>
          </div>

          <div className='formFieldsMobileReport'>
            {this.state.loadingClients && this.state.loadingStaff ? (
              <div className='formLoadingDiv'>
                <div>
                  <ClipLoader
                    className='formSpinner'
                    size={50}
                    color={"#ffc107"}
                  />
                </div>

                <p>Loading...</p>
              </div>
            ) : (
              <div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>Child's Name</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.childMeta_name}
                    id='childMeta_name'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>Child's Gender</label>{" "}
                  <Form.Control
                    as='select'
                    onChange={this.handleFieldInput}
                    value={this.state.childMeta_gender}
                    id='childMeta_gender'
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option value={""}>Choose</option>
                  </Form.Control>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Child's Date of Birth
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.childMeta_dob}
                    id='childMeta_dob'
                    className='form-control'
                    type='date'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Child's Date of Admission
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.childMeta_dateOfAdmission}
                    id='childMeta_dateOfAdmission'
                    className='form-control'
                    type='date'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Name of Care Staff Involved
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.staff_involved_name}
                    id='staff_involved_name'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Gender of Care Staff Involved
                  </label>{" "}
                  <Form.Control
                    as='select'
                    onChange={this.handleFieldInput}
                    value={this.state.staff_involved_gender}
                    id='staff_involved_gender'
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option value={""}>Choose</option>
                  </Form.Control>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Date and time of incident
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.time_of_incident}
                    id='time_of_incident'
                    className='form-control'
                    type='datetime-local'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Name of Staff Witness
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.staff_witness_name}
                    id='staff_witness_name'
                    className='form-control'
                    type='text'
                  />
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Gender of Staff Witness
                  </label>{" "}
                  <Form.Control
                    as='select'
                    onChange={this.handleFieldInput}
                    value={this.state.staff_witness_gender}
                    id='staff_witness_gender'
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option value={""}>Choose</option>
                  </Form.Control>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Name of Client Witness (1)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_name1}
                    id='client_witness_name1'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    {" "}
                    Gender of Client Witness (1)
                  </label>{" "}
                  <Form.Control
                    as='select'
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_gender1}
                    id='client_witness_gender1'
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option value={""}>Choose</option>
                  </Form.Control>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Client Witness Date of Birth (1)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_dob1}
                    id='client_witness_dob1'
                    className='form-control'
                    type='date'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Client Witness Date of Admission (1)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_doa1}
                    id='client_witness_doa1'
                    className='form-control'
                    type='date'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Name Client Witness (2)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_name2}
                    id='client_witness_name2'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    {" "}
                    Gender of Client Witness (2)
                  </label>{" "}
                  <Form.Control
                    as='select'
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_gender2}
                    id='client_witness_gender2'
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option value={""}>Choose</option>
                  </Form.Control>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Client Witness Date of Birth (2)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_dob2}
                    id='client_witness_dob2'
                    className='form-control'
                    type='date'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Client Witness Date of Admission (2)
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.client_witness_doa2}
                    id='client_witness_doa2'
                    className='form-control'
                    type='date'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Description of behavior necessitating Restraint. Describe
                    how client was at risk of harm to self or others. Include
                    all pertinent details and behavior leading up to the
                    incident. Be specific:
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.risk_explaination}
                    id='risk_explaination'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    {" "}
                    Alternative strategies or intervention attempted prior to
                    EPR. Client response to attempted interventions. Be
                    specific.
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.risk_alternative_strategies}
                    id='risk_alternative_strategies'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Type of Restraint. Be specific.
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.type_of_restraint}
                    id='type_of_restraint'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    What strategies were used during Restraint to calm client?
                    How did you explain behaviors necessary for release? How
                    often?
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.risk_stategies_used}
                    id='risk_stategies_used'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Results of incident, including Restraint. Examine client for
                    injuries.
                    <br />
                    Injuries from client behavior prior to Restraint (e.g., SIB,
                    physical aggression, Etc.), how they occurred, and treatment
                    provided
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.result_of_incident}
                    id='result_of_incident'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Injuries sustained during or as result of the Restraint, How
                    they occurred, and treatment provided
                    <br />
                    Client’s response to Restraint.
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.injuries}
                    id='injuries'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Action taken to help client return to normal activities
                    following release from the Restraint.
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.action_taken}
                    id='action_taken'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    In your opinion, were you able to prevent a more serious
                    incident? Explain.
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.able_to_prevent}
                    id='able_to_prevent'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Time restraint started
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.restraint_start_time}
                    id='restraint_start_time'
                    className='form-control'
                    type='datetime-local'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Time restraint ended
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.restraint_end_time}
                    id='restraint_end_time'
                    className='form-control'
                    type='datetime-local'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Name of individual you notified.
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.notification_made_to}
                    id='notification_made_to'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    {" "}
                    Time of Notification
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.notification_made_date_time}
                    id='notification_made_date_time'
                    className='form-control'
                    type='datetime-local'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Name of Interviewer
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.interviewer}
                    id='interviewer'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Date of Interview
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.date_of_interview}
                    id='date_of_interview'
                    className='form-control'
                    type='datetime-local'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    What was your behavior?
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.client_behavior}
                    id='client_behavior'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    {" "}
                    Describe the Restraint?
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.client_restraint_description}
                    id='client_restraint_description'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    How did you respond to the Restraint
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.client_responce}
                    id='client_responce'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    {" "}
                    Restraint took place for approved reason:
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.procedural_approved_reason}
                    id='procedural_approved_reason'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    {" "}
                    Restraint met Standards:
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.procedural_approved_standards}
                    id='procedural_approved_standards'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    {" "}
                    Any injury or claim of injury:
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.procedural_any_injuries}
                    id='procedural_any_injuries'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Comments. Corrective action, including training, needed
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.procedural_comments}
                    id='procedural_comments'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
              </div>
            )}
            <label className='control-label'>Signature</label>{" "}
            <div className='sigSection'>
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
                  penColor='black'
                  clearOnResize={false}
                  canvasProps={{
                    width: 600,
                    height: 200,
                    className: "sigCanvas",
                  }}
                  backgroundColor='#eeee'
                />
              </div>
            </div>
            {!this.props.formData.approved && (
              <>
                <FormError errorId={this.props.id + "-error"} />
                <div
                  className='form-group logInInputField'
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <button
                    className='lightBtn'
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

export default RestraintReport;
