import React, { Component } from "react";
import TreatmentPlan72 from "../Forms/TreatmentPlan72";
import IncidentReport from "../Forms/IncidentReport";
import DailyProgress from "../Forms/DailyProgressAndActivity";
import RestraintReport from "../Forms/RestraintReport";

class ShowFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    if (this.props.form.name === "72 Hour Treatment Plan") {
      return (
        <TreatmentPlan72
          valuesSet="true"
          userObj={this.props.userObj}
          formData={this.props.formData}
        />
      );
    } else if (this.props.form.name === "Incident Report") {
      return (
        <IncidentReport
          valuesSet="true"
          userObj={this.props.userObj}
          formData={this.props.formData}
        />
      );
    } else if (this.props.form.name === "Daily Activity") {
      return (
        <DailyProgress
          valuesSet="true"
          userObj={this.props.userObj}
          formData={this.props.formData}
        />
      );
    } else if (this.props.form.name === "Restraint Report") {
      return (
        <RestraintReport
          valuesSet="true"
          userObj={this.props.userObj}
          formData={this.props.formData}
        />
      );
    } else {
      return (
        <div>
          <h1>404 - Form Not Found</h1>
        </div>
      );
    }
  }
}
export default ShowFormContainer;
