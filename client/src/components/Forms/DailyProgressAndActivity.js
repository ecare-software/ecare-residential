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
import { Container, Row, Col } from "react-bootstrap";
import { FetchHomeData } from "../../utils/FetchHomeData";


/*
  missing from form
    "Restricted field Trip"

*/
var interval = 0; // used for autosaving
let initAutoSave = false;
class DailyProgressAndActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childMeta_name: "",
      personal_hygiene: "",
      dressing: "",
      table_mannders: "",
      clothes_maintenace: "",
      self_feeding: "",
      care_of_property: "",
      maintenace_of_personal_space: "",
      household_chorse: "",
      informal_counseling: "",
      verbal_redirection: "",
      modeling: "",
      supervised_separation: "",
      provider_feedback_to_client: "",
      positive_reinforcement: "",
      other: "",
      home_restrictions: "",
      restricted_leisure_activity: "",
      no_allowance: "",
      other2: "",
      no_of_home_incidents: "",
      no_of_home_serious_incidents: "",
      no_of_home_restraints: "",
      no_of_school_incidents: "",
      no_of_school_restraints: "",
      illness_injury: "",
      level_of_supervison: "",
      summary_of_daily_schedule: "",
      summary_of_behavior_at_school: "",
      summary_of_behavior_at_home: "",
      therapeutic_recreational: "",
      therapeutic_value: "",
      phone_calls_or_visits: "",
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
      createDate: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
      status: "IN PROGRESS",
      childSelected: false,
      signature1: "",
      signature2: "",
      twoSignaturesRequired: false,
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

  handleFieldInputDate = (event) => {
    var stateObj = {};
    if (event.target.id.indexOf(".") > -1) {
      let level1Obj = event.target.id.split(".")[0];
      let level2Obj = event.target.id.split(".")[1];

      let nestedProperty = { ...this.state[level1Obj] };
      nestedProperty[level2Obj] = event.target.value;
      stateObj[level1Obj] = nestedProperty;
    } else {
      stateObj[event.target.id] = event.target.value.concat(':00.000Z');
    }
    this.setState(stateObj);
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

  doGetHomeInfo = async () => {
    try {
      const { data } = await FetchHomeData(this.props.userObj.homeId);
      console.log('doGetHomeInfo', data[0])
      if (data[0].homeId === 'home-3' || this.props.userObj.homeId === 'home-1234') this.state.twoSignaturesRequired = true;
      return (data)
    } catch (e) {
      console.log("Error fetching home info");
      // }
    };
  }

  resetForm = () => {
    this.setState({
      childMeta_name: "",
      personal_hygiene: "",
      dressing: "",
      table_mannders: "",
      clothes_maintenace: "",
      self_feeding: "",
      care_of_property: "",
      maintenace_of_personal_space: "",
      household_chorse: "",
      informal_counseling: "",
      verbal_redirection: "",
      modeling: "",
      supervised_separation: "",
      provider_feedback_to_client: "",
      positive_reinforcement: "",
      other: "",
      home_restrictions: "",
      restricted_leisure_activity: "",
      no_allowance: "",
      other2: "",
      no_of_home_incidents: "",
      no_of_home_serious_incidents: "",
      no_of_home_restraints: "",
      no_of_school_incidents: "",
      no_of_school_restraints: "",
      illness_injury: "",
      level_of_supervison: "",
      summary_of_daily_schedule: "",
      summary_of_behavior_at_school: "",
      summary_of_behavior_at_home: "",
      therapeutic_recreational: "",
      therapeutic_value: "",
      phone_calls_or_visits: "",
      clientId: "",
      createDate: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
      status: "IN PROGRESS",
      childSelected: false,
    });
  };

  // auto save
  autoSave = async () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    delete currentState.clients;
    delete currentState.staff;

    if (
      currentState.childMeta_name === "" ||
      currentState.childMeta_name.length === 0
    ) {
      return;
    }

    if (initAutoSave) {
      console.log("autosaving existing form");
      try {
        const { data } = await Axios.put(
          `/api/dailyProgressAndActivity/${this.state.homeId}/${this.state._id}`,
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
          formErrorMessage:
            "Error Submitting Daily Progress and Activity Report",
          loadingClients: false,
        });
      }
    } else {
      console.log("autosaving new form");
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/dailyProgressAndActivity", { ...currentState })
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
            formErrorMessage:
              "Error Submitting Daily Progress and Activity Report",
            loadingClients: false,
          });
        });
    }
  };

  submit = async (save) => {
    console.log('test test', this.state.signature1 !== "")
    if (this.state.twoSignaturesRequired && this.props.valuesSet && this.state.signature1 !== "" && this.state.signature2 !== "" && !save) {
      this.state.status = 'COMPLETED'
    }
    else if (this.state.twoSignaturesRequired === false) {
      if (!save) this.state.status = "COMPLETED";
    }
    let currentState = JSON.parse(JSON.stringify(this.state));
    delete currentState.clients;
    delete currentState.staff;
    initAutoSave = false;
    clearInterval(interval);
    if (this.props.valuesSet || this.state._id) {
      try {
        const { data } = await Axios.put(
          `/api/dailyProgressAndActivity/${this.state.homeId}/${this.state._id}`,
          {
            ...currentState,
          }
        );

        this.setState({ ...this.state, ...data });
        window.scrollTo(0, 0);
        this.toggleSuccessAlert();
      } catch (e) {
        console.log(e);
        this.setState({
          formHasError: true,
          formErrorMessage:
            "Error Submitting Daily Progress and Activity Report",
          loadingClients: false,
        });
      }
    } else {
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/dailyProgressAndActivity", currentState)
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
            formErrorMessage:
              "Error Submitting Daily Progress and Activity Report",
            loadingClients: false,
          });
        });
    }
  };

  validateForm = async (save) => {
    console.log('save', save)
    if (this.state.signature1 === "" && !save) {
      const { data: createdUserData } =
          await GetUserSig(
            this.props.userObj.email,
            this.props.userObj.homeId
          );
        console.log('sig1 test AGAIN', createdUserData)
        this.setState({
          ...this.state,
          signature1: createdUserData.signature,
        })
    }
    console.log("TESTTTTTT", this.state.twoSignaturesRequired && this.state.signature1 !== "" && !save && this.props.valuesSet)
    if (this.state.twoSignaturesRequired && this.state.signature1 !== "" && !save) {
      if (this.props.valuesSet) {
        const { data: createdUserData } =
          await GetUserSig(
            this.props.userObj.email,
            this.props.userObj.homeId
          );
        console.log('sig2 test', createdUserData)
        this.sigCanvas2.fromData(createdUserData.signature);
        this.setState({
          ...this.state,
          signature2: createdUserData.signature,
        })
      }
    }

    this.setState({
      ...this.state,
      loadingClients: true,
    });

    this.submit(save);
  };

  setSignature = (userObj) => {
    console.log('sig2 info', typeof this.state.signature2)
    // if (userObj.signature && userObj.signature.length) {
    //   console.log('set sig1', userObj.signature)
    // console.log('sig1 from canvas', this.sigCanvas1.toData())
  this.sigCanvas1.fromData(userObj.signature);
      //  this.setState({
      //   ...this.state,
      //    signature1: userObj.signature,
      //  })
    //   console.log('test sig 1', this.state.signature1)
    // }
    console.log('work', this.props.formData.status === "COMPLETED")
    // if (this.state.twoSignaturesRequired && this.state.signature2 !== "") {
      if (this.state.twoSignaturesRequired && this.props.formData.status === "COMPLETED") {
      // if (!this.props.formData.signature2 === undefined || this.props.formData.signature2.length !== 0) {
        this.sigCanvas2.fromData(this.props.formData.signature2)
        console.log('sigcanvas2.toData()', this.sigCanvas2.toData())
        console.log('sigcanvas2', this.sigCanvas2)
      // }
    }

    console.log('sigcanvas1.toData()', this.sigCanvas1.toData())
    console.log('sigcanvas1', this.sigCanvas1)
    // this.setState({
    //   signature1: this.sigCanvas1.toData(),
    // })
    
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
    // console.log('sig1 from canvas', this.sigCanvas1.toData())
    console.log('merp')
    this.sigCanvas1.off();
    if (this.state.twoSignaturesRequired = true) this.sigCanvas2.off();
    this.setState({
      ...this.state,
      ...this.props.formData,
      loadingSig: false,
      loadingClients: false,
      signature1: createdUserData.signature,
    });
    console.log('createdUserData', createdUserData)
    console.log('state', this.state)
    console.log('props', this.props.formData)
    console.log('sig1 in setValues on load', this.state.signature1 !== "")
    console.log('sig2 in setValues on load', this.state.signature2 !== "")
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
    console.log('typeof', typeof this.state.signature1)
    console.log('value of sig1', this.state.signature1.valueOf())
    console.log('sig1 empty string', this.state.signature1 === "")
    console.log('sig1 is string', typeof this.state.signature1 === "string")
    if (this.props.valuesSet) {
      this.setValues();
      console.log('set values')
    } else {
      console.log('dont set values')
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
    this.doGetHomeInfo();
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
            <h2 className="formTitle">Daily Progress and Activity</h2>
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
                <label className="control-label">
                  Create Date
                </label>{" "}
                <input
                  onChange={this.handleFieldInputDate}
                  id="createDate"
                  value={this.state.createDate.slice(0, -8)}
                  className="form-control"
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
                  <div className="form-group input-header">
                    <h6>
                      Daily living / Development skills :{" "}
                      <i>
                        G - Good; A - Adequate; P - Poor; NS - Needs
                        Supervision; PA - Physical Assistance; NA - Not
                        Applicable
                      </i>
                    </h6>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Personal Hygiene wk
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="personal_hygiene"
                      value={this.state.personal_hygiene}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Dressing</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="dressing"
                      value={this.state.dressing}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Table Manners</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="table_mannders"
                      value={this.state.table_mannders}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Clothes Maintenance
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="clothes_maintenace"
                      value={this.state.clothes_maintenace}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Self Feeding</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="self_feeding"
                      value={this.state.self_feeding}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Care of Property
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="care_of_property"
                      value={this.state.care_of_property}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Maintenance of Personal Space
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="maintenace_of_personal_space"
                      value={this.state.maintenace_of_personal_space}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Household Chores
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="household_chorse"
                      value={this.state.household_chorse}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                </Col>

                <Col md={4} className="print-column">
                  <div className="form-group input-header">
                    <h6>
                      Techniques used to encourage positive change :{" "}
                      <i>Y - Yes (if applicable)</i>
                    </h6>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Informal Counseling
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="informal_counseling"
                      value={this.state.informal_counseling}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Verbal Redirection
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="verbal_redirection"
                      value={this.state.verbal_redirection}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">Modeling</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="modeling"
                      value={this.state.modeling}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Supervised Separation
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="supervised_separation"
                      value={this.state.supervised_separation}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Provider Feedback to Client
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="provider_feedback_to_client"
                      value={this.state.provider_feedback_to_client}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Positive Reinforcement
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="positive_reinforcement"
                      value={this.state.positive_reinforcement}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Other (Specify)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="other"
                      value={this.state.other}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group input-header">
                    <h6>
                      Consequences : <i>Y - Yes (if applicable)</i>
                    </h6>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Home Restrictions
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="home_restrictions"
                      value={this.state.home_restrictions}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Restricted Leisure Activity
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="restricted_leisure_activity"
                      value={this.state.restricted_leisure_activity}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">No Allowance</label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="no_allowance"
                      value={this.state.no_allowance}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Other (Specify)
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="other2"
                      value={this.state.other2}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                </Col>

                <Col md={4} className="print-column">
                  <div className="form-group logInInputField">
                    <div className="form-group input-header">
                      <h6>Behavior Summary</h6>
                    </div>{" "}
                    <label className="control-label">
                      Number of Home Incidents
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="no_of_home_incidents"
                      value={this.state.no_of_home_incidents}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Number of Home Serious Incidents
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="no_of_home_serious_incidents"
                      value={this.state.no_of_home_serious_incidents}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Number of Home Restraints
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="no_of_home_restraints"
                      value={this.state.no_of_home_restraints}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Number of School Incidents
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="no_of_school_incidents"
                      value={this.state.no_of_school_incidents}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Number of School Restraints
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="no_of_school_restraints"
                      value={this.state.no_of_school_restraints}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Illnesses / Injuries
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="illness_injury"
                      value={this.state.illness_injury}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Level of Supervison
                    </label>{" "}
                    <input
                      onChange={this.handleFieldInput}
                      id="level_of_supervison"
                      value={this.state.level_of_supervison}
                      className="form-control"
                      type="text"
                      disabled={this.state.childSelected ? false : true}
                    />{" "}
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Therapeutic / Recreational
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="therapeutic_recreational"
                      value={this.state.therapeutic_recreational}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Therapeutic Value
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="therapeutic_value"
                      value={this.state.therapeutic_value}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Phone Calls / Visits
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="phone_calls_or_visits"
                      value={this.state.phone_calls_or_visits}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <FormError errorId={this.props.id + "-error"} />
                  <div
                    className="form-group logInInputField"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  ></div>
                </Col>
              </Row>
              <Row>
                <Col md={12} className="print-column">
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Summary of Behavior at School
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="summary_of_behavior_at_school"
                      value={this.state.summary_of_behavior_at_school}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Summary of Behavior at Home
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="summary_of_behavior_at_home"
                      value={this.state.summary_of_behavior_at_home}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                  <div className="form-group logInInputField">
                    {" "}
                    <label className="control-label">
                      Summary of Daily Schedule
                    </label>{" "}
                    <TextareaAutosize
                      onChange={this.handleFieldInput}
                      id="summary_of_daily_schedule"
                      value={this.state.summary_of_daily_schedule}
                      className="form-control"
                      disabled={this.state.childSelected ? false : true}
                    ></TextareaAutosize>
                  </div>
                </Col>
              </Row>


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
            <h2 className="formTitle">Daily Progress and Activity</h2>
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
                <Row>
                  <Col md={12} className="print-column">
                    <div className="form-group logInInputField">
                      <label className="control-label">
                        Create Date
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInputDate}
                        id="createDate"
                        value={this.state.createDate !== null ? this.state.createDate.slice(0, -8) : ""}
                        className="form-control"
                        type="datetime-local"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Child's Name</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.childMeta_name}
                        id="childMeta_name"
                        className="form-control"
                        type="text"
                        disabled
                      />{" "}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={4} className="print-column">
                    <div className="form-group input-header">
                      <h6>
                        Daily living/development skills :{" "}
                        <i>
                          G - Good; A - Adequate; P - Poor; NS - Needs
                          Supervision; PA - Physical Assistance; NA - Not
                          Applicable
                        </i>
                      </h6>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Personal Hygiene wk
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.personal_hygiene}
                        id="personal_hygiene"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Dressing</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.dressing}
                        id="dressing"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Table Manners
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.table_mannders}
                        id="table_mannders"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Clothes Maintenance
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.clothes_maintenace}
                        id="clothes_maintenace"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Self Feeding</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.self_feeding}
                        id="self_feeding"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Care of Property
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.care_of_property}
                        id="care_of_property"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Maintenance of Personal Space
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.maintenace_of_personal_space}
                        id="maintenace_of_personal_space"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Household Chores
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.household_chorse}
                        id="household_chorse"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                  </Col>

                  <Col md={4} className="print-column">
                    <div className="form-group input-header">
                      <h6>
                        Techniques used to encourage positive change :{" "}
                        <i>Y - Yes (if applicable)</i>
                      </h6>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Informal Counseling
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.informal_counseling}
                        id="informal_counseling"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Verbal Redirection
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.verbal_redirection}
                        id="verbal_redirection"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">Modeling</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.modeling}
                        id="modeling"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Supervised Separation
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.supervised_separation}
                        id="supervised_separation"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Provider Feedback to Client
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.provider_feedback_to_client}
                        id="provider_feedback_to_client"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Positive Reinforcement
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.positive_reinforcement}
                        id="positive_reinforcement"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Other (Specify)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.other}
                        id="other"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group input-header">
                      <h6>
                        Consequences : <i>Y - Yes (if applicable)</i>
                      </h6>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Home Restrictions
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.home_restrictions}
                        id="home_restrictions"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Restricted Leisure Activity
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.restricted_leisure_activity}
                        id="restricted_leisure_activity"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">No Allowance</label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.no_allowance}
                        id="no_allowance"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Other (Specify)
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.other2}
                        id="other2"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                  </Col>

                  <Col md={4} className="print-column">
                    <div className="form-group input-header">
                      <h6>Behavior Summary</h6>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Number of Home Incidents
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.no_of_home_incidents}
                        id="no_of_home_incidents"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Number of Home Serious Incidents
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.no_of_home_serious_incidents}
                        id="no_of_home_serious_incidents"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Number of Home Restraints
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.no_of_home_restraints}
                        id="no_of_home_restraints"
                        className="form-control"
                        type="text"

                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Number of School Incidents
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.no_of_school_incidents}
                        id="no_of_school_incidents"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Number of School Restraints
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.no_of_school_restraints}
                        id="no_of_school_restraints"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Illnesses / Injuries
                      </label>{" "}
                      <div className="hide-on-print">
                        <TextareaAutosize
                          onChange={this.handleFieldInput}
                          value={this.state.illness_injury}
                          id="illness_injury"
                          className="form-control"
                        ></TextareaAutosize>
                      </div>
                      <p className="hide-on-non-print">
                        {this.state.illness_injury}
                      </p>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Level of Supervison
                      </label>{" "}
                      <input
                        onChange={this.handleFieldInput}
                        value={this.state.level_of_supervison}
                        id="level_of_supervison"
                        className="form-control"
                        type="text"
                      />{" "}
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Therapeutic / Recreational
                      </label>{" "}
                      <div className="hide-on-print">
                        <TextareaAutosize
                          onChange={this.handleFieldInput}
                          value={this.state.therapeutic_recreational}
                          id="therapeutic_recreational"
                          className="form-control"
                        ></TextareaAutosize>
                      </div>
                      <p className="hide-on-non-print">
                        {this.state.therapeutic_recreational}
                      </p>
                    </div>
                    <div className="form-group logInInputField">
                      <label className="control-label">Therapeutic Value</label>{" "}
                      <div className="hide-on-print">
                        <TextareaAutosize
                          onChange={this.handleFieldInput}
                          value={this.state.therapeutic_value}
                          id="therapeutic_value"
                          className="form-control"
                        ></TextareaAutosize>
                      </div>
                      <p className="hide-on-non-print">
                        {this.state.therapeutic_value}
                      </p>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Phone Calls / Visits
                      </label>{" "}
                      <div className="hide-on-print">
                        <TextareaAutosize
                          onChange={this.handleFieldInput}
                          value={this.state.phone_calls_or_visits}
                          id="phone_calls_or_visits"
                          className="form-control"
                        ></TextareaAutosize>
                      </div>
                      <p className="hide-on-non-print">
                        {this.state.phone_calls_or_visits}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row id='summary_of_daily_schedule-row'>
                  <Col md={12} className="print-column">
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Summary of Behavior at School
                      </label>{" "}
                      <div className="hide-on-print">
                        <TextareaAutosize
                          onChange={this.handleFieldInput}
                          value={this.state.summary_of_behavior_at_school}
                          id="summary_of_behavior_at_school"
                          className="form-control"
                        ></TextareaAutosize>
                      </div>
                      <p className="hide-on-non-print">
                        {this.state.summary_of_behavior_at_school}
                      </p>
                    </div>
                    <div className="form-group logInInputField">
                      {" "}
                      <label className="control-label">
                        Summary of Behavior at Home
                      </label>{" "}
                      <div className="hide-on-print">
                        <TextareaAutosize
                          onChange={this.handleFieldInput}
                          value={this.state.summary_of_behavior_at_home}
                          id="summary_of_behavior_at_home"
                          className="form-control"
                        ></TextareaAutosize>
                      </div>
                      <p className="hide-on-non-print">
                        {this.state.summary_of_behavior_at_home}
                      </p>
                    </div>
                    <div className="form-group logInInputField" >
                      {" "}
                      <label className="control-label">
                        Summary of Daily Schedule
                      </label>{" "}
                      <div className="hide-on-print">
                        <TextareaAutosize
                          onChange={this.handleFieldInput}
                          value={this.state.summary_of_daily_schedule}
                          id="summary_of_daily_schedule"
                          className="form-control"
                        ></TextareaAutosize>
                      </div>
                      <p className="hide-on-non-print">
                        {this.state.summary_of_daily_schedule}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Container>
            )}

            <div className="sigSection"
            // style={{ display: this.state.status === 'IN PROGRESS' && (this.state.twoSignaturesRequired === false || this.state.signature1.length === 0) ? 'block' : 'none' }}
            // style={{ display: this.state.status === 'IN PROGRESS' ? 'none' : 'block' }}
            >
              
              <div id='sigCanvasDiv'
              // style={{ display: 
              //   (this.state.status === 'IN PROGRESS' && this.state.twoSignaturesRequired === false) 
              //   || 
              //   (this.state.twoSignaturesRequired && (this.props.formData.signature1 === undefined)) 
              //     ? 'none' : 'block' }}
              >
                <label className="control-label">Signature #1</label>{" "}
                <div id='sigCanvasDiv'>
                <SignatureCanvas
                  ref={(ref) => {
                    this.sigCanvas1 = ref;
                  }}
                  style={{ border: "solid" }}
                  penColor="black"
                  clearOnResize={false}
                  canvasProps={{
                    width: 300,
                    height: 100,
                    className: "sigCanvas1",
                  }}
                  backgroundColor="#eeee"
                />
              </div>
              </div>
              
              <div id='sigCanvasDiv'
              // style={{ display: 
              //   this.state.twoSignaturesRequired === true && this.state.status === 'COMPLETED' 
              //   ? 'block' : 'none'}}
              >
                <label className="control-label">Signature #2</label>{" "}
                <div id='sigCanvasDiv'>
                <SignatureCanvas
                  ref={(ref) => {
                    this.sigCanvas2 = ref;
                  }}
                  style={{ border: "solid" }}
                  penColor="black"
                  clearOnResize={false}
                  canvasProps={{
                    width: 300,
                    height: 100,
                    className: "sigCanvas2",
                  }}
                  backgroundColor="#eeee"
                />
              </div>
              </div>
            </div>
            {!this.props.formData.approved && (
              <>
                <FormError errorId={this.props.id + "-error"} />
                <Row className="save-submit-row">
                  <div style={{ display: "flex", width: "46%" }}>
                    <button
                      className="lightBtn hide hide-on-print save-submit-btn"
                      style={{
                        width: "100%",
                        // display: this.state.status === 'COMPLETED' ? "none" : "block",
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

export default DailyProgressAndActivity;
