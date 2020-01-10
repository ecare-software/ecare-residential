import React, { Component } from "react";
import FormError from "../FormMods/FormError";
import "../../App.css";
import Axios from "axios";

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
    Axios.post("/api/dailyProgressAndActivity", currentState);
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
        <div style={{ margin: "50px 100px 0px 100px" }}>
          <div style={{ margin: "75px 0px" }}>
            <h2>Daily Progress and Activity</h2>
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
            <label className="control-label">personal_hygiene</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="personal_hygiene"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">dressing</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="dressing"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">table_mannders</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="table_mannders"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">clothes_maintenace</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="clothes_maintenace"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">self_feeding</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="self_feeding"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">care_of_property</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="care_of_property"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              maintenace_of_personal_space
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="maintenace_of_personal_space"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">household_chorse</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="household_chorse"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">informal_counseling</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="informal_counseling"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">verbal_redirection</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="verbal_redirection"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">modeling</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="modeling"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">supervised_separation</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="supervised_separation"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              provider_feedback_to_client
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="provider_feedback_to_client"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">positive_reinforcement</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="positive_reinforcement"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">other</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="other"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">home_restrictions</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="home_restrictions"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              restricted_leisure_activity
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="restricted_leisure_activity"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">no_allowance</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="no_allowance"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">other2</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="other2"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">no_of_home_incidents</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="no_of_home_incidents"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              no_of_home_serious_incidents
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="no_of_home_serious_incidents"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">no_of_home_restraints</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="no_of_home_restraints"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">no_of_school_incidents</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="no_of_school_incidents"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              no_of_school_restraints
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="no_of_school_restraints"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">illness_injury</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="illness_injury"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">level_of_supervison</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="level_of_supervison"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              summary_of_daily_schedule
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="summary_of_daily_schedule"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              summary_of_behavior_at_school
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="summary_of_behavior_at_school"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              summary_of_behavior_at_home
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="summary_of_behavior_at_home"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              therapeutic_recreational
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="therapeutic_recreational"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">therapeutic_value</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="therapeutic_value"
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">phone_calls_or_visits</label>{" "}
            <input
              onChange={this.handleFieldInput}
              id="phone_calls_or_visits"
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
        <div style={{ margin: "50px 100px 0px 100px" }}>
          <div style={{ margin: "75px 0px" }}></div>
          <h2>Daily Progress and Activity</h2>
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
            <label className="control-label">personal_hygiene</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.personal_hygiene}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">dressing</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.dressing}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">table_mannders</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.table_mannders}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">clothes_maintenace</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.clothes_maintenace}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">self_feeding</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.self_feeding}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">care_of_property</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.care_of_property}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              maintenace_of_personal_space
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.maintenace_of_personal_space}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">household_chorse</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.household_chorse}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">informal_counseling</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.informal_counseling}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">verbal_redirection</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.verbal_redirection}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">modeling</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.modeling}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">supervised_separation</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.supervised_separation}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              provider_feedback_to_client
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.provider_feedback_to_client}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">positive_reinforcement</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.positive_reinforcement}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">other</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.other}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">home_restrictions</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.home_restrictions}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              restricted_leisure_activity
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.restricted_leisure_activity}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">no_allowance</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.no_allowance}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">other2</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.other2}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">no_of_home_incidents</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.no_of_home_incidents}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              no_of_home_serious_incidents
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.no_of_home_serious_incidents}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">no_of_home_restraints</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.no_of_home_restraints}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">no_of_school_incidents</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.no_of_school_incidents}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              no_of_school_restraints
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.no_of_school_restraints}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">illness_injury</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.illness_injury}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">level_of_supervison</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.level_of_supervison}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              summary_of_daily_schedule
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.summary_of_daily_schedule}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              summary_of_behavior_at_school
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.summary_of_behavior_at_school}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              summary_of_behavior_at_home
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.summary_of_behavior_at_home}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">
              therapeutic_recreational
            </label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.therapeutic_recreational}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">therapeutic_value</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.therapeutic_value}
              disabled={this.props.userObj.isAdmin ? false : true}
              className="form-control"
              type="text"
            />{" "}
          </div>
          <div className="form-group logInInputField">
            {" "}
            <label className="control-label">phone_calls_or_visits</label>{" "}
            <input
              onChange={this.handleFieldInput}
              value={this.props.formData.phone_calls_or_visits}
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

export default DailyProgressAndActivity;
