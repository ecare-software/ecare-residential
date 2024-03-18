import React, { Component } from "react";
import FormError from "../FormMods/FormError";
import FormAlert from "../Forms/FormAlert";
import "../../App.css";
import Axios from "axios";
import { Form } from "react-bootstrap";
import ClientOption from "../../utils/ClientOption.util";
import ClipLoader from "react-spinners/ClipLoader";
import SignatureCanvas from "react-signature-canvas";
import { GetUserSig } from "../../utils/GetUserSig";
import { FormSuccessAlert } from "../../utils/FormSuccessAlert";
import { FormSavedAlert } from "../../utils/FormSavedAlert";
import { isAdminUser } from "../../utils/AdminReportingRoles";
import TextareaAutosize from "react-textarea-autosize";
import { Container, Row, Col } from "react-bootstrap";
/*
  missing from form
    "incident"

  to change
    remove time_of_incident - i change dateOfIncident to a date time picker

    seperation should probably be a date
*/

var interval = 0; // used for autosaving
let initAutoSave = false;
class BodyCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childMeta_name: "",
      childMeta_gender: "",
      injury: "",
      amPm: "",
      examiner_name: "",
      examiner_title: "",
      examin_date: "",
      nurse_designee_name: "",
      nurse_designee_title: "",
      nurse_designee_date: "",

      head: -1,
      face: -1,

      left_ear: -1,
      right_ear: -1,

      left_eye: -1,
      right_eye: -1,

      nose: -1,

      mouth: -1,

      chin: -1,

      neck: -1,

      left_shoulder: -1,
      right_shoulder: -1,

      left_arm: -1,
      right_arm: -1,

      left_hand: -1,
      right_hand: -1,

      chest: -1,
      back: -1,
      stomach: -1,

      left_hip: -1,
      right_hip: -1,

      left_leg: -1,
      right_leg: -1,

      left_knee: -1,
      right_knee: -1,

      left_ankle: -1,
      right_ankle: -1,

      left_foot: -1,
      right_foot: -1,

      details: null,

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

      clientId: "",

      loadingClients: true,

      loadingSig: true,

      clients: [],
      createDate: new Date().toISOString(),
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
      injury: "",
      amPm: "",
      examiner_name: "",
      examiner_title: "",
      examin_date: "",
      nurse_designee_name: "",
      nurse_designee_title: "",
      nurse_designee_date: "",

      head: -1,
      face: -1,

      left_ear: -1,
      right_ear: -1,

      left_eye: -1,
      right_eye: -1,

      nose: -1,

      mouth: -1,

      chin: -1,

      neck: -1,

      left_shoulder: -1,
      right_shoulder: -1,

      left_arm: -1,
      right_arm: -1,

      left_hand: -1,
      right_hand: -1,

      chest: -1,
      back: -1,
      stomach: -1,

      left_hip: -1,
      right_hip: -1,

      left_leg: -1,
      right_leg: -1,

      left_knee: -1,
      right_knee: -1,

      left_ankle: -1,
      right_ankle: -1,

      left_foot: -1,
      right_foot: -1,

      details: null,
      clientId: "",
      createDate: new Date().toISOString(),
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
          `/api/bodyCheck/${this.state.homeId}/${this.state._id}`,
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
          formErrorMessage: "Error Submitting Health Body Check Form",
          loadingClients: false,
        });
      }
    } else {
      console.log("creating");
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/bodyCheck", currentState)
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
            formErrorMessage: "Error Submitting Health Body Check Form",
            loadingClients: false,
          });
        });
    }
  };

  submit = async () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    delete currentState.clients;
    delete currentState.staff;
    initAutoSave = false;
    clearInterval(interval);
    if (this.props.valuesSet || this.state._id) {
      try {
        const { data } = await Axios.put(
          `/api/bodyCheck/${this.state.homeId}/${this.state._id}`,
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
          formErrorMessage: "Error Submitting Health Body Check Form",
          loadingClients: false,
        });
      }
    } else {
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/bodyCheck", currentState)
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
            formErrorMessage: "Error Submitting Health Body Check Form",
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

  dateForDateTimeInputValue = () =>
    new Date(new Date(this.state.createDate).getTime())
      .toISOString()
      .slice(0, 19);

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
            <h2 className="formTitle">Health Body Check</h2>
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
              <Row>
                <Col>
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
                </Col>

                <Col>
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
                </Col>

                <Col>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Does the child have an injury?
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="injury"
                      value={this.state.injury}
                      className="form-control"
                      type="text"
                    />{" "}
                  </div>
                </Col>
              </Row>

              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">AM / PM</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="amPm"
                  value={this.state.amPm}
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <Row>
                <Col md={4} className="print-column">
                  <div className="form-group logInInputField">
                    <h6>
                      Write the number code corresponding to the type of mark on
                      the area of the child’s body the mark appears.
                      <i>
                        1=Bruise 2=Abrasion 3=Scratch(es) 4=Scar 5=Scab 6=Rash
                        7=Cut(s) 8=Sore 9=Birth Mark 10=Insect Bite(s)
                      </i>
                      :
                    </h6>
                  </div>

                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      head
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.head}
                      id="head"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      face
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.face}
                      id="face"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      left ear
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.left_ear}
                      id="left_ear"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      right ear
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.right_ear}
                      id="right_ear"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      left eye
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.left_eye}
                      id="left_eye"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      right eye
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.right_eye}
                      id="right_eye"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      nose
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.nose}
                      id="nose"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      mouth
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.mouth}
                      id="mouth"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      chin
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.chin}
                      id="chin"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      neck
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.neck}
                      id="neck"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      left shoulder
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.left_shoulder}
                      id="left_shoulder"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                </Col>
                <Col md={4} className="print-column">
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      right shoulder
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.right_shoulder}
                      id="right_shoulder"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      left arm
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.left_arm}
                      id="left_arm"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      right arm
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.right_arm}
                      id="right_arm"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      left hand
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.left_hand}
                      id="left_hand"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      right hand
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.right_hand}
                      id="right_hand"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      chest
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.chest}
                      id="chest"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      back
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.back}
                      id="back"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      stomach
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.stomach}
                      id="stomach"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      left hip
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.left_hip}
                      id="left_hip"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      right hip
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.right_hip}
                      id="right_hip"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      left leg
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.left_leg}
                      id="left_leg"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      right leg
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.right_leg}
                      id="right_leg"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                </Col>
                <Col md={4} className="print-column">
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      left knee
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.left_knee}
                      id="left_knee"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      right knee
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.right_knee}
                      id="right_knee"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      left ankle
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.left_ankle}
                      id="left_ankle"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      right ankle
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.right_ankle}
                      id="right_ankle"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      left foot
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.left_foot}
                      id="left_foot"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label text-capitalize">
                      right foot
                    </label>{" "}
                    <Form.Control
                      as="select"
                      onChange={this.handleFieldInput}
                      value={this.state.right_foot}
                      id="right_foot"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>Other</option>
                      <option value={-1}>N/A</option>
                    </Form.Control>
                  </div>

                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Additional Details
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="details"
                      value={this.state.details}
                      className="form-control"
                    ></TextareaAutosize>
                  </div>

                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Examiner Name</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="examiner_name"
                      value={this.state.examiner_name}
                      className="form-control"
                      type="text"
                    />{" "}
                  </div>

                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Examiner Title</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="examiner_title"
                      value={this.state.examiner_title}
                      className="form-control"
                      type="text"
                    />{" "}
                  </div>

                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Date Examiner Checked Body
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="examin_date"
                      value={this.state.examin_date}
                      className="form-control"
                      type="datetime-local"
                    />{" "}
                  </div>

                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Nurse or Designee Name
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="nurse_designee_name"
                      value={this.state.nurse_designee_name}
                      className="form-control"
                      type="text"
                    />{" "}
                  </div>

                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Nurse or Designee Title
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="nurse_designee_title"
                      value={this.state.nurse_designee_title}
                      className="form-control"
                      type="text"
                    />{" "}
                  </div>

                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Date Nurse or Designee Checked Body
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="nurse_designee_date"
                      value={this.state.nurse_designee_date}
                      className="form-control"
                      type="datetime-local"
                    />{" "}
                  </div>
                </Col>

                <FormError errorId={this.props.id + "-error"} />
                <div
                  className="form-group logInInputField"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <button
                    className="lightBtn hide-on-print"
                    onClick={() => {
                      this.validateForm(true);
                    }}
                  >
                    Save
                  </button>

                  <button
                    className="darkBtn hide-on-print"
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
            <h2 className="formTitle">Health Body Check</h2>
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
                <Row>
                  <Col>
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
                  </Col>
                  <Col>
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
                  </Col>

                  <Col>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Does the child have an injury?
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="injury"
                        value={this.state.injury}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                  </Col>

                  <Col>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">AM / PM</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="amPm"
                        value={this.state.amPm}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <div className="form-group logInInputField">
                    <h6>
                      Write the number code corresponding to the type of mark on
                      the area of the child’s body the mark appears.
                      <br />
                      <br />
                      <i>
                        1=Bruise 2=Abrasion 3=Scratch(es) 4=Scar 5=Scab 6=Rash
                        7=Cut(s) 8=Sore 9=Birth Mark 10=Insect Bite(s)
                      </i>
                      :
                    </h6>
                  </div>
                  <Col md={4} className="print-column">
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        head
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.head}
                        id="head"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        face
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.face}
                        id="face"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        left ear
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.left_ear}
                        id="left_ear"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        right ear
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.right_ear}
                        id="right_ear"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        left eye
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.left_eye}
                        id="left_eye"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        right eye
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.right_eye}
                        id="right_eye"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        nose
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.nose}
                        id="nose"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        mouth
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.mouth}
                        id="mouth"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        chin
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.chin}
                        id="chin"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        neck
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.neck}
                        id="neck"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        left shoulder
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.left_shoulder}
                        id="left_shoulder"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        right shoulder
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.right_shoulder}
                        id="right_shoulder"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                  </Col>
                  <Col md={4} className="print-column">
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        left arm
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.left_arm}
                        id="left_arm"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        right arm
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.right_arm}
                        id="right_arm"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        left hand
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.left_hand}
                        id="left_hand"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        right hand
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.right_hand}
                        id="right_hand"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        chest
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.chest}
                        id="chest"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        back
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.back}
                        id="back"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        stomach
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.stomach}
                        id="stomach"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        left hip
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.left_hip}
                        id="left_hip"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        right hip
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.right_hip}
                        id="right_hip"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        left leg
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.left_leg}
                        id="left_leg"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        right leg
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.right_leg}
                        id="right_leg"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        left knee
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.left_knee}
                        id="left_knee"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                  </Col>
                  <Col md={4} className="print-column">
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        right knee
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.right_knee}
                        id="right_knee"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        left ankle
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.left_ankle}
                        id="left_ankle"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        right ankle
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.right_ankle}
                        id="right_ankle"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        left foot
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.left_foot}
                        id="left_foot"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label text-capitalize">
                        right foot
                      </label>{" "}
                      <Form.Control
                        as="select"
                        onChange={this.handleFieldInput}
                        value={this.state.right_foot}
                        id="right_foot"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>Other</option>
                        <option value={-1}>N/A</option>
                      </Form.Control>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Additional Details
                      </label>{" "}
                      <TextareaAutosize
                        onChange={this.handleFieldInput}
                        id="details"
                        value={this.state.details}
                        className="form-control"
                      ></TextareaAutosize>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Examiner Name
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="examiner_name"
                        value={this.state.examiner_name}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Examiner Title
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="examiner_title"
                        value={this.state.examiner_title}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Date Examiner Checked Body
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="examin_date"
                        value={this.state.examin_date}
                        className="form-control"
                        type="datetime-local"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Nurse or Designee Name
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="nurse_designee_name"
                        value={this.state.nurse_designee_name}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Nurse or Designee Title
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="nurse_designee_title"
                        value={this.state.nurse_designee_title}
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Date Nurse or Designee Checked Body
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        id="nurse_designee_date"
                        value={this.state.nurse_designee_date}
                        className="form-control"
                        type="datetime-local"
                      />{" "}
                    </div>
                  </Col>
                </Row>
              </Container>
            )}
            <label className="control-label">Signature</label>{" "}
            <div className="sigSection">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  maxHeight: "170",
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
                <div
                  className="form-group logInInputField"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <button
                    className="lightBtn hide-on-print"
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

export default BodyCheck;
