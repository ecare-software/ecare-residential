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
import TextareaAutosize from "react-textarea-autosize";
import { Container, Row, Col } from "react-bootstrap";
var interval = 0; // used for autosaving
let initAutoSave = false;
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
      lastEditDate: null,
      homeId: this.props.valuesSet === true ? "" : this.props.userObj.homeId,
      formHasError: false,
      formSubmitted: false,
      formErrorMessage: "",
      loadingClients: true,
      loadingSig: true,
      clients: [],
      clientId: "",
      createDate: new Date().toISOString(),
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
      createDate: new Date().toISOString(),
      status: "IN PROGRESS",
      childSelected: false,
    });
  };

  // auto save
  autoSave = async () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    delete currentState.clients;
    delete currentState.staff;
    console.log("auto saving");
    if (
      currentState.childMeta_name === "" ||
      currentState.childMeta_name.length === 0
    ) {
      return;
    }
    if (initAutoSave) {
      console.log("updating existing form");
      try {
        const { data } = await Axios.put(
          `/api/illnessInjury/${this.state.homeId}/${this.state._id}`,
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
          formErrorMessage: "Error Submitting Illness Injury",
          loadingClients: false,
        });
      }
    } else {
      console.log("creating");
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/illnessInjury", currentState)
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
            formErrorMessage: "Error Submitting Illness Injury",
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
          `/api/illnessInjury/${this.state.homeId}/${this.state._id}`,
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
          formErrorMessage: "Error Submitting Illness Injury",
          loadingClients: false,
        });
      }
    } else {
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/illnessInjury", currentState)
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

    if (!this.state.createDate) {
      this.setState({
        formHasError: true,
        formErrorMessage: `Please complete the following field(s): Create Date`,
      });
      return;
    } else {
      this.setState({
        ...this.state,
        createDate: new Date(this.state.createDate),
      });
    }

    this.submit(save);
  };

  componentWillUnmount() {
    console.log("clearing auto save interval");
    initAutoSave = false;
    clearInterval(interval);
  }
  setSignature = (userObj) => {
    if (userObj.signature && userObj.signature.length) {
      this.sigCanvas.fromData(userObj.signature);
    }
  };

  dateForDateTimeInputValue = () =>
    new Date(new Date(this.state.createDate).getTime())
      .toISOString()
      .slice(0, 19);

  createDateTimeStamp = () =>
    new Date(new Date(this.state.createDate).getTime()).toLocaleString(
      "en-us",
      { timeZone: "CST" }
    );

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
            <h2 className="formTitle">Illness and Injury Report</h2>
            <p>{this.createDateTimeStamp()}</p>
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
                <label className="control-label hide-on-print">
                  Create Date
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="createDate"
                  value={this.state.createDate}
                  className="form-control hide-on-print"
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
                      disabled={this.state.childSelected ? false : true}
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
                      disabled={this.state.childSelected ? false : true}
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
                      disabled={this.state.childSelected ? false : true}
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
                      disabled={this.state.childSelected ? false : true}
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
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                </Col>
                <Col md={4} className="print-column">
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Initial Reading
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="tempInitialReading"
                      value={this.state.tempInitialReading}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
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
                      disabled={this.state.childSelected ? false : true}
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
                      disabled={this.state.childSelected ? false : true}
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
                      disabled={this.state.childSelected ? false : true}
                      type="text"
                    />{" "}
                  </div>
                </Col>
                <Col md={4} className="print-column">
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
                      disabled={this.state.childSelected ? false : true}
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
                      disabled={this.state.childSelected ? false : true}
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
                      disabled={this.state.childSelected ? false : true}
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
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                </Col>
              </Row>

              <FormError errorId={this.props.id + "-error"} />

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
              <Container className="print-container">
                <div className="form-group logInInputField">
                  <label className="control-label hide-on-print">
                    Create Date
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    id="createDate"
                    value={this.dateForDateTimeInputValue()}
                    className="form-control hide-on-print"
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
                <Row>
                  <Col md={4} className="print-column">
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
                  </Col>
                  <Col md={4} className="print-column">
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Initial Reading
                      </label>{" "}
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
                  </Col>
                  <Col md={4} className="print-column">
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
                  </Col>
                </Row>
              </Container>
            )}

            <div className="sigSection"
              style={{ display: this.state.status === 'IN PROGRESS' ? 'none' : 'block' }}
            >
              <label className="control-label">Signature</label>{" "}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  maxHeight: "170",
                  paddingBottom: "20px",
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
                <Row style={{ display: "flex", justifyContent: "space-between", paddingRight: "0px", marginLeft: "1px", marginRight: "1px" }}>
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

export default IllnessInjury;
