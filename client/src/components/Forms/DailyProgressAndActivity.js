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
/*
  missing from form
    "Restricted field Trip"

*/

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
    this.setState({ formSubmitted: !this.state.formSubmitted });
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
    });
  };

  submit = async () => {
    let currentState = JSON.parse(JSON.stringify(this.state));

    if (this.props.valuesSet) {
      try {
        await Axios.put(
          `/api/dailyProgressAndActivity/${this.state.homeId}/${this.props.formData._id}`,
          {
            ...this.state,
          }
        );
        window.scrollTo(0, 0);
        this.toggleSuccessAlert();
      } catch (e) {
        this.setState({
          formHasError: true,
          formErrorMessage:
            "Error Submitting Daily Progress and Activity Report",
        });
      }
    } else {
      Axios.post("/api/dailyProgressAndActivity", currentState)
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
            formErrorMessage:
              "Error Submitting Daily Progress and Activity Report",
          });
        });
    }
  };

  validateForm = () => {
    var keysToExclude = ["formHasError", "formSubmitted", "formErrorMessage"];

    //resubmit fields
    keysToExclude = [
      ...keysToExclude,
      "__v",
      "approved",
      "approvedBy",
      "approvedByDate",
      "approvedByName",
      "clientId",
      "loadingClients",
    ];

    var isValid = true;
    var errorFields = [];

    Object.keys(this.state).forEach((key) => {
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

    if (!isValid) {
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
      setTimeout(() => {
        this.setState({
          ...this.state,
          clients,
          loadingClients: !this.state.loadingClients,
        });
      }, 2000);
      console.log(clients);
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
            <h2 className="formTitle">Daily Progress and Activity</h2>
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
              <div className="form-group">
                <h5>
                  Daily living / Development skills :{" "}
                  <i>
                    G - Good; A - Adequate; P - Poor; NS - Needs Supervision; PA
                    - Physical Assistance; NA - Not Applicable
                  </i>
                </h5>
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
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Care of Property</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="care_of_property"
                  value={this.state.care_of_property}
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
                  id="maintenace_of_personal_space"
                  value={this.state.maintenace_of_personal_space}
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Household Chores</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="household_chorse"
                  value={this.state.household_chorse}
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group">
                <h5>
                  Techniques used to encourage positive change :{" "}
                  <i>Y - Yes (if applicable)</i>
                </h5>
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
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Verbal Redirection</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="verbal_redirection"
                  value={this.state.verbal_redirection}
                  className="form-control"
                  type="text"
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
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Other (Specify)</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="other"
                  value={this.state.other}
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group">
                <h5>
                  Consequences : <i>Y - Yes (if applicable)</i>
                </h5>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Home Restrictions</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="home_restrictions"
                  value={this.state.home_restrictions}
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
                  id="restricted_leisure_activity"
                  value={this.state.restricted_leisure_activity}
                  className="form-control"
                  type="text"
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
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Other (Specify)</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="other2"
                  value={this.state.other2}
                  className="form-control"
                  type="text"
                />{" "}
              </div>
              <div className="form-group">
                <h5>Behavior Summary</h5>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Number of Home Incidents
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id="no_of_home_incidents"
                  value={this.state.no_of_home_incidents}
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
                  id="no_of_home_serious_incidents"
                  value={this.state.no_of_home_serious_incidents}
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
                  id="no_of_home_restraints"
                  value={this.state.no_of_home_restraints}
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
                  id="no_of_school_incidents"
                  value={this.state.no_of_school_incidents}
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
                  id="no_of_school_restraints"
                  value={this.state.no_of_school_restraints}
                  className="form-control"
                  type="text"
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
                />{" "}
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Summary of Daily Schedule
                </label>{" "}
                <textarea
                  onChange={this.handleFieldInput}
                  id="summary_of_daily_schedule"
                  value={this.state.summary_of_daily_schedule}
                  className="form-control"
                ></textarea>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Summary of Behavior at School
                </label>{" "}
                <textarea
                  onChange={this.handleFieldInput}
                  id="summary_of_behavior_at_school"
                  value={this.state.summary_of_behavior_at_school}
                  className="form-control"
                ></textarea>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Summary of Behavior at Home
                </label>{" "}
                <textarea
                  onChange={this.handleFieldInput}
                  id="summary_of_behavior_at_home"
                  value={this.state.summary_of_behavior_at_home}
                  className="form-control"
                ></textarea>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Therapeutic / Recreational
                </label>{" "}
                <textarea
                  onChange={this.handleFieldInput}
                  id="therapeutic_recreational"
                  value={this.state.therapeutic_recreational}
                  className="form-control"
                ></textarea>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">Therapeutic Value</label>{" "}
                <textarea
                  onChange={this.handleFieldInput}
                  id="therapeutic_value"
                  value={this.state.therapeutic_value}
                  className="form-control"
                ></textarea>
              </div>
              <div className="form-group logInInputField">
                {" "}
                <label className="control-label">
                  Phone Calls / Visits
                </label>{" "}
                <textarea
                  onChange={this.handleFieldInput}
                  id="phone_calls_or_visits"
                  value={this.state.phone_calls_or_visits}
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
          )}
        </div>
      );
    } else {
      return (
        <div className="formComp">
          {this.state.formSubmitted || this.state.formHasError ? (
            <React.Fragment>
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
              <div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">Child's Name</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.childMeta_name}
                    id="childMeta_name"
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group">
                  <h5>
                    Daily living/development skills :{" "}
                    <i>
                      G - Good; A - Adequate; P - Poor; NS - Needs Supervision;
                      PA - Physical Assistance; NA - Not Applicable
                    </i>
                  </h5>
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
                  <label className="control-label">Table Manners</label>{" "}
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
                  <label className="control-label">Care of Property</label>{" "}
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
                  <label className="control-label">Household Chores</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.household_chorse}
                    id="household_chorse"
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group">
                  <h5>
                    Techniques used to encourage positive change :{" "}
                    <i>Y - Yes (if applicable)</i>
                  </h5>
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
                  <label className="control-label">Other (Specify)</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.other}
                    id="other"
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group">
                  <h5>
                    Consequences : <i>Y - Yes (if applicable)</i>
                  </h5>
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
                  <label className="control-label">Other (Specify)</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.other2}
                    id="other2"
                    className="form-control"
                    type="text"
                  />{" "}
                </div>
                <div className="form-group">
                  <h5>Behavior Summary</h5>
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
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.illness_injury}
                    id="illness_injury"
                    className="form-control"
                    type="text"
                  />{" "}
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
                    Summary of Daily Schedule
                  </label>{" "}
                  <textarea
                    onChange={this.handleFieldInput}
                    value={this.state.summary_of_daily_schedule}
                    id="summary_of_daily_schedule"
                    className="form-control"
                  ></textarea>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Summary of Behavior at School
                  </label>{" "}
                  <textarea
                    onChange={this.handleFieldInput}
                    value={this.state.summary_of_behavior_at_school}
                    id="summary_of_behavior_at_school"
                    className="form-control"
                  ></textarea>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Summary of Behavior at Home
                  </label>{" "}
                  <textarea
                    onChange={this.handleFieldInput}
                    value={this.state.summary_of_behavior_at_home}
                    id="summary_of_behavior_at_home"
                    className="form-control"
                  ></textarea>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Therapeutic / Recreational
                  </label>{" "}
                  <textarea
                    onChange={this.handleFieldInput}
                    value={this.state.therapeutic_recreational}
                    id="therapeutic_recreational"
                    className="form-control"
                  ></textarea>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Therapeutic Value
                  </label>{" "}
                  <textarea
                    onChange={this.handleFieldInput}
                    value={this.state.therapeutic_value}
                    id="therapeutic_value"
                    className="form-control"
                  ></textarea>
                </div>
                <div className="form-group logInInputField">
                  {" "}
                  <label className="control-label">
                    Phone Calls / Visits
                  </label>{" "}
                  <textarea
                    onChange={this.handleFieldInput}
                    value={this.state.phone_calls_or_visits}
                    id="phone_calls_or_visits"
                    className="form-control"
                  ></textarea>
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
                  style={{ textAlign: "right" }}
                >
                  <button className="darkBtn" onClick={this.validateForm}>
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
  }
}

export default DailyProgressAndActivity;
