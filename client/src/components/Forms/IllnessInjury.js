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

class IllnessInjury extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childMeta_name: "",
      dateTimeOccur: "",
      illnessInjury: "",
      initialResponse: "",
      tempTaken: "",
      tempMethodTaken: "",
      tempInitialReading: "",
      supervisorNotified: "",
      notifiedAt: "",
      notifiedBy: "",
      adminFollowUp: "",
      lastMedicationGiven: "",
      otherActionsTreatment: "",
      treatmentAuthBy: "",

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
      dateTimeOccur: "",
      illnessInjury: "",
      initialResponse: "",
      tempTaken: "",
      tempMethodTaken: "",
      tempInitialReading: "",
      supervisorNotified: "",
      notifiedAt: "",
      notifiedBy: "",
      adminFollowUp: "",
      lastMedicationGiven: "",
      otherActionsTreatment: "",
      treatmentAuthBy: "",
      clientId: "",
    });
  };

  submit = async () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    delete currentState.clients;
    if (this.props.valuesSet) {
      try {
        await Axios.put(
          `/api/illnessInjury/${this.state.homeId}/${this.props.formData._id}`,
          {
            ...currentState,
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
          formErrorMessage: "Error Submitting Illness Injury",
          loadingClients: false,
        });
      }
    } else {
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;
      console.log(currentState);

      Axios.post("/api/illnessInjury", currentState)
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
            formErrorMessage: "Error Submitting Illness Injury",
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
      "tempMethodTaken",
      "tempInitialReading",
      "adminFollowUp",
      "lastMedicationGiven",
      "otherActionsTreatment",
      "treatmentAuthBy",
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
            <h2 className="formTitle">Illness and Injury Report</h2>
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
                <label className="control-label">
                  Date and time of illness and/or injury
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="dateTimeOccur"
                  value={this.state.dateTimeOccur}
                  className="form-control"
                  type="datetime-local"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Nature of illness and/or injury
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id="illnessInjury"
                  value={this.state.illnessInjury}
                  className="form-control"
                ></TextareaAutosize>
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Initial response action taken
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id="initialResponse"
                  value={this.state.initialResponse}
                  className="form-control"
                ></TextareaAutosize>
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Temperature Taken?</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="tempTaken"
                  value={this.state.tempTaken}
                  className="form-control"
                  type="text"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Method</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="tempMethodTaken"
                  value={this.state.tempMethodTaken}
                  className="form-control"
                  type="text"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Initial Reading</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="tempInitialReading"
                  value={this.state.tempInitialReading}
                  className="form-control"
                  type="text"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Notification to Supervisor{" "}
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="supervisorNotified"
                  value={this.state.supervisorNotified}
                  className="form-control"
                  type="text"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Supervisor notified at
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="notifiedAt"
                  value={this.state.notifiedAt}
                  className="form-control"
                  type="datetime-local"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Supervisor notified by
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="notifiedBy"
                  value={this.state.notifiedBy}
                  className="form-control"
                  type="text"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Follow-up by administrator
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="adminFollowUp"
                  value={this.state.adminFollowUp}
                  className="form-control"
                  type="text"
                />{" "}
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Last medication and time given to prior onset
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id="lastMedicationGiven"
                  value={this.state.lastMedicationGiven}
                  className="form-control"
                ></TextareaAutosize>
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Other actions or treatment taken
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id="otherActionsTreatment"
                  value={this.state.otherActionsTreatment}
                  className="form-control"
                ></TextareaAutosize>
              </div>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Treatment (including medications) authorized by
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id="treatmentAuthBy"
                  value={this.state.treatmentAuthBy}
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
            <h2 className="formTitle">Illness and Injury Report</h2>
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
              <div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Child's Name</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="childMeta_name"
                    value={this.state.childMeta_name}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Date and time of illness and/or injury
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="dateTimeOccur"
                    value={this.state.dateTimeOccur}
                    className="form-control"
                    type="datetime-local"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Nature of illness and/or injury
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="illnessInjury"
                    value={this.state.illnessInjury}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Initial response action taken
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="initialResponse"
                    value={this.state.initialResponse}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Temperature Taken?
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="tempTaken"
                    value={this.state.tempTaken}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Method</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="tempMethodTaken"
                    value={this.state.tempMethodTaken}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Initial Reading</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="tempInitialReading"
                    value={this.state.tempInitialReading}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Notification to Supervisor{" "}
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="supervisorNotified"
                    value={this.state.supervisorNotified}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Supervisor notified at
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="notifiedAt"
                    value={this.state.notifiedAt}
                    className="form-control"
                    type="datetime-local"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Supervisor notified by
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="notifiedBy"
                    value={this.state.notifiedBy}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Follow-up by administrator
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="adminFollowUp"
                    value={this.state.adminFollowUp}
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Last medication and time given to prior onset
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="lastMedicationGiven"
                    value={this.state.lastMedicationGiven}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Other actions or treatment taken
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="otherActionsTreatment"
                    value={this.state.otherActionsTreatment}
                    className="form-control"
                  ></TextareaAutosize>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Treatment (including medications) authorized by
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    id="treatmentAuthBy"
                    value={this.state.treatmentAuthBy}
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

export default IllnessInjury;
