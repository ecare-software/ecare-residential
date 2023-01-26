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
          `/api/dailyProgressAndActivity/${this.state.homeId}/${this.state._id}`,
          {
            ...currentState,
          }
        );

        this.setState({ ...this.state, ...data });
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
      console.log("creating");
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/dailyProgressAndActivity", currentState)
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
            formErrorMessage:
              "Error Submitting Daily Progress and Activity Report",
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
          `/api/dailyProgressAndActivity/${this.state.homeId}/${this.state._id}`,
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
    this.setState({
      ...this.state,
      loadingClients: true,
    });
    // if (!save) {
    //   const { data: createdUserData } = await GetUserSig(
    //     this.props.userObj.email,
    //     this.props.userObj.homeId
    //   );

    //   if (
    //     !createdUserData.signature ||
    //     Array.isArray(createdUserData.signature) === false ||
    //     !createdUserData.signature.length > 0
    //   ) {
    //     this.setState({
    //       ...this.state,
    //       formHasError: true,
    //       formErrorMessage: `User signature required to submit a form. Create a new signature under 'Manage Profile'.`,
    //       loadingClients: false,
    //     });
    //     return;
    //   }
    // }

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
            <h2 className='formTitle'>Daily Progress and Activity</h2>
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
          {this.state.loadingClients ? (
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
              <div className='form-group'>
                <h5>
                  Daily living / Development skills :{" "}
                  <i>
                    G - Good; A - Adequate; P - Poor; NS - Needs Supervision; PA
                    - Physical Assistance; NA - Not Applicable
                  </i>
                </h5>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Personal Hygiene wk
                </label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.personal_hygiene}
                  id='personal_hygiene'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>Dressing</label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.dressing}
                  id='dressing'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>Table Manners</label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.table_mannders}
                  id='table_mannders'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Clothes Maintenance
                </label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.clothes_maintenace}
                  id='clothes_maintenace'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>Self Feeding</label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.self_feeding}
                  id='self_feeding'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>Care of Property</label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.care_of_property}
                  id='care_of_property'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Maintenance of Personal Space
                </label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.maintenace_of_personal_space}
                  id='maintenace_of_personal_space'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>Household Chores</label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.household_chorse}
                  id='household_chorse'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group'>
                <h5>
                  Techniques used to encourage positive change :{" "}
                  <i>Y - Yes (if applicable)</i>
                </h5>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Informal Counseling
                </label>{" "}
                <div className="d-flex mt-6 "
                      style={{ flexWrap: "wrap",
                      rowGap: "10px",
                      columnGap: "2em" }}>
                  {/* <div className="radio"> */}
                    <label htmlFor="informalCounselYes">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="informalCounselYes"
                        value="Yes"
                      />
                      Yes
                    </label>
                  {/* </div> */}
                  {/* <div className="radio"> */}
                    <label htmlFor="informalCounselNA">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="informalCounselNA"
                        value="NA"
                      />
                      NA
                    </label>
                </div>{" "}
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>Verbal Redirection</label>{" "}
                <div className="d-flex mt-6 "
                      style={{ flexWrap: "wrap",
                      rowGap: "10px",
                      columnGap: "2em" }}>
                      <label htmlFor="verbal_redirectionYes">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="verbal_redirectionYes"
                        value="Yes"
                      />
                      Yes
                    </label>
                    <label htmlFor="verbal_redirectionNA">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="verbal_redirectionNA"
                        value="NA"
                      />
                      NA
                    </label>
                </div>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>Modeling</label>{" "}
                <div className="d-flex mt-6 "
                      style={{ flexWrap: "wrap",
                      rowGap: "10px",
                      columnGap: "2em" }}>
                      <label htmlFor="modelingYes">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="modelingYes"
                        value="Yes"
                      />
                      Yes
                    </label>
                    <label htmlFor="modelingNA">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="modelingNA"
                        value="NA"
                      />
                      NA
                    </label>
                </div>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Supervised Separation
                </label>{" "}
                <div className="d-flex mt-6 "
                     style={{ flexWrap: "wrap",
                     rowGap: "10px",
                     columnGap: "2em" }}>
                      <label htmlFor="supervised_separationYes">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="supervised_separationYes"
                        value="Yes"
                      />
                      Yes
                    </label>
                    <label htmlFor="supervised_separationNA">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="supervised_separationNA"
                        value="NA"
                      />
                      NA
                    </label>
                </div>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Provider Feedback to Client
                </label>{" "}
                <div className="d-flex mt-6 "
                      style={{ flexWrap: "wrap",
                      rowGap: "10px",
                      columnGap: "2em" }}>
                      <label htmlFor="provider_feedback_to_clientYes">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="provider_feedback_to_clientYes"
                        value="Yes"
                      />
                      Yes
                    </label>
                    <label htmlFor="provider_feedback_to_clientNA">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="provider_feedback_to_clientNA"
                        value="NA"
                      />
                      NA
                    </label>
                </div>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Positive Reinforcement
                </label>{" "}
                <div className="d-flex mt-6 "
                      style={{ flexWrap: "wrap",
                      rowGap: "10px",
                      columnGap: "2em" }}>
                      <label htmlFor="positive_reinforcementYes">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="positive_reinforcementYes"
                        value="Yes"
                      />
                      Yes
                    </label>
                    <label htmlFor="positive_reinforcementNA">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="positive_reinforcementNA"
                        value="NA"
                      />
                      NA
                    </label>
                </div>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>Other (Specify)</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='other'
                  value={this.state.other}
                  className='form-control'
                  type='text'
                />{" "}
              </div>
              <div className='form-group'>
                <h5>
                  Consequences : <i>Y - Yes (if applicable)</i>
                </h5>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>Home Restrictions</label>{" "}
                <div className="d-flex mt-6 "
                      style={{ flexWrap: "wrap",
                      rowGap: "10px",
                      columnGap: "2em" }}>
                      <label htmlFor="home_restrictionsYes">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="home_restrictionsYes"
                        value="Yes"
                      />
                      Yes
                    </label>
                    <label htmlFor="home_restrictionsNA">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="home_restrictionsNA"
                        value="NA"
                      />
                      NA
                    </label>
                </div>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Restricted Leisure Activity
                </label>{" "}
                <div className="d-flex mt-6 "
                      style={{ flexWrap: "wrap",
                      rowGap: "10px",
                      columnGap: "2em" }}>
                      <label htmlFor="restricted_leisure_activityYes">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="restricted_leisure_activityYes"
                        value="Yes"
                      />
                      Yes
                    </label>
                    <label htmlFor="restricted_leisure_activityNA">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="restricted_leisure_activityNA"
                        value="NA"
                      />
                      NA
                    </label>
                </div>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>No Allowance</label>{" "}
                <div className="d-flex mt-6 "
                      style={{ flexWrap: "wrap",
                      rowGap: "10px",
                      columnGap: "2em" }}>
                      <label htmlFor="no_allowanceYes">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="no_allowanceYes"
                        value="Yes"
                      />
                      Yes
                    </label>
                    <label htmlFor="no_allowanceNA">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="no_allowanceNA"
                        value="NA"
                      />
                      NA
                    </label>
                </div>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>Other (Specify)</label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='other2'
                  value={this.state.other2}
                  className='form-control'
                  type='text'
                />{" "}
              </div>
              <div className='form-group'>
                <h5>Behavior Summary</h5>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Number of Home Incidents
                </label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.no_of_home_incidents}
                  id='no_of_home_incidents'
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10+</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Number of Home Serious Incidents
                </label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.no_of_home_serious_incidents}
                  id='no_of_home_serious_incidents'
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10+</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Number of Home Restraints
                </label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.no_of_home_restraints}
                  id='no_of_home_restraints'
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10+</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Number of School Incidents
                </label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.no_of_school_incidents}
                  id='no_of_school_incidents'
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10+</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Number of School Restraints
                </label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.no_of_school_restraints}
                  id='no_of_school_restraints'
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10+</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Illnesses / Injuries
                </label>{" "}
                <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.illness_injury}
                  id='illness_injury'
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10+</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Level of Supervison
                </label>{" "}
                <input
                  onChange={this.handleFieldInput}
                  id='level_of_supervison'
                  value={this.state.level_of_supervison}
                  className='form-control'
                  type='text'
                />{" "}
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Summary of Daily Schedule
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='summary_of_daily_schedule'
                  value={this.state.summary_of_daily_schedule}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Summary of Behavior at School
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='summary_of_behavior_at_school'
                  value={this.state.summary_of_behavior_at_school}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Summary of Behavior at Home
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='summary_of_behavior_at_home'
                  value={this.state.summary_of_behavior_at_home}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Therapeutic / Recreational
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='therapeutic_recreational'
                  value={this.state.therapeutic_recreational}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>Therapeutic Value</label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='therapeutic_value'
                  value={this.state.therapeutic_value}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {" "}
                <label className='control-label'>
                  Phone Calls / Visits
                </label>{" "}
                <TextareaAutosize
                  onChange={this.handleFieldInput}
                  id='phone_calls_or_visits'
                  value={this.state.phone_calls_or_visits}
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
            <h2 className='formTitle'>Daily Progress and Activity</h2>
          </div>

          <div className='formFieldsMobileReport'>
            {this.state.loadingClients ? (
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
                <div className='form-group'>
                  <h5>
                    Daily living/development skills :{" "}
                    <i>
                      G - Good; A - Adequate; P - Poor; NS - Needs Supervision;
                      PA - Physical Assistance; NA - Not Applicable
                    </i>
                  </h5>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Personal Hygiene wk
                  </label>{" "}
                  <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.personal_hygiene}
                  id='personal_hygiene'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>Dressing</label>{" "}
                  <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.dressing}
                  id='dressing'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>Table Manners</label>{" "}
                  <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.table_mannders}
                  id='table_mannders'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Clothes Maintenance
                  </label>{" "}
                  <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.clothes_maintenace}
                  id='clothes_maintenace'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>Self Feeding</label>{" "}
                  <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.self_feeding}
                  id='self_feeding'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>Care of Property</label>{" "}
                  <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.care_of_property}
                  id='care_of_property'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Maintenance of Personal Space
                  </label>{" "}
                  <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.maintenace_of_personal_space}
                  id='maintenace_of_personal_space'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>Household Chores</label>{" "}
                  <Form.Control
                  as='select'
                  onChange={this.handleFieldInput}
                  value={this.state.household_chorse}
                  id='household_chorse'
                >
                  <option>G - Good</option>
                  <option>A - Adequate</option>
                  <option>P - Poor</option>
                  <option>NS - Needs Supervision</option>
                  <option>PA - Physical Assistance</option>
                  <option>NA - Not Applicable</option>
                  <option value={""}>Choose</option>
                </Form.Control>
                </div>
                <div className='form-group'>
                  <h5>
                    Techniques used to encourage positive change :{" "}
                    <i>Y - Yes (if applicable)</i>
                  </h5>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label' htmlFor='radios' >
                    Informal Counseling
                  </label>{" "}
                <div className="">
                  <div className="radio">
                    <label htmlFor="informalCounselYes">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="informalCounselYes"
                        value="Yes"
                      />
                      Yes
                    </label>
                  </div>
                  <div className="radio">
                    <label htmlFor="informalCounselNA">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="informalCounselNA"
                        value="NA"
                      />
                      NA
                    </label>
                  </div>
                </div>
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.informal_counseling}
                    id='informal_counseling'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Verbal Redirection
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.verbal_redirection}
                    id='verbal_redirection'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>Modeling</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.modeling}
                    id='modeling'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Supervised Separation
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.supervised_separation}
                    id='supervised_separation'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Provider Feedback to Client
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.provider_feedback_to_client}
                    id='provider_feedback_to_client'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Positive Reinforcement
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.positive_reinforcement}
                    id='positive_reinforcement'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>Other (Specify)</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.other}
                    id='other'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group'>
                  <h5>
                    Consequences : <i>Y - Yes (if applicable)</i>
                  </h5>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Home Restrictions
                  </label>{" "}
                  <div className="d-flex mt-6 "
                      style={{ flexWrap: "wrap",
                      rowGap: "10px",
                      columnGap: "2em" }}>
                      <label htmlFor="home_restrictionsYes">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="home_restrictionsYes"
                        value="Yes"
                      />
                      Yes
                    </label>
                    <label htmlFor="home_restrictionsNA">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="home_restrictionsNA"
                        value="NA"
                      />
                      NA
                    </label>
                </div>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Restricted Leisure Activity
                  </label>{" "}
                  <div className="d-flex mt-6 "
                      style={{ flexWrap: "wrap",
                      rowGap: "10px",
                      columnGap: "2em" }}>
                      <label htmlFor="restricted_leisure_activityYes">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="restricted_leisure_activityYes"
                        value="Yes"
                      />
                      Yes
                    </label>
                    <label htmlFor="restricted_leisure_activityNA">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="restricted_leisure_activityNA"
                        value="NA"
                      />
                      NA
                    </label>
                </div>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>No Allowance</label>{" "}
                  <div className="d-flex mt-6 "
                      style={{ flexWrap: "wrap",
                      rowGap: "10px",
                      columnGap: "2em" }}>
                      <label htmlFor="no_allowanceYes">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="no_allowanceYes"
                        value="Yes"
                      />
                      Yes
                    </label>
                    <label htmlFor="no_allowanceNA">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="no_allowanceNA"
                        value="NA"
                      />
                      NA
                    </label>
                </div>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>Other (Specify)</label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.other2}
                    id='other2'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group'>
                  <h5>Behavior Summary</h5>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Number of Home Incidents
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.no_of_home_incidents}
                    id='no_of_home_incidents'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Number of Home Serious Incidents
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.no_of_home_serious_incidents}
                    id='no_of_home_serious_incidents'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Number of Home Restraints
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.no_of_home_restraints}
                    id='no_of_home_restraints'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Number of School Incidents
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.no_of_school_incidents}
                    id='no_of_school_incidents'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Number of School Restraints
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.no_of_school_restraints}
                    id='no_of_school_restraints'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Illnesses / Injuries
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.illness_injury}
                    id='illness_injury'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Level of Supervison
                  </label>{" "}
                  <input
                    onChange={this.handleFieldInput}
                    value={this.state.level_of_supervison}
                    id='level_of_supervison'
                    className='form-control'
                    type='text'
                  />{" "}
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Summary of Daily Schedule
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.summary_of_daily_schedule}
                    id='summary_of_daily_schedule'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Summary of Behavior at School
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.summary_of_behavior_at_school}
                    id='summary_of_behavior_at_school'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Summary of Behavior at Home
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.summary_of_behavior_at_home}
                    id='summary_of_behavior_at_home'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Therapeutic / Recreational
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.therapeutic_recreational}
                    id='therapeutic_recreational'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Therapeutic Value
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.therapeutic_value}
                    id='therapeutic_value'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <div className='form-group logInInputField'>
                  {" "}
                  <label className='control-label'>
                    Phone Calls / Visits
                  </label>{" "}
                  <TextareaAutosize
                    onChange={this.handleFieldInput}
                    value={this.state.phone_calls_or_visits}
                    id='phone_calls_or_visits'
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

export default DailyProgressAndActivity;
