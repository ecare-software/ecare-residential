import React, { Component } from "react";
import "./ReportsContainer.css";

import { FromReports } from "./FormReports";
import { TrainingReports } from "./TrainingReports";

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
const adminReportingRoles = [
  "Admin",
  "Owner/CEO",
  "Executive/Director",
  "Administrator",
  "Case/Manager",
  "Supervisor",
];

class ReportsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForms: false,
      showTrainings: false,
    };
  }

  showFormReports = () => {
    this.setState({ ...this.state, showForms: true, showTrainings: false });
  };
  showTrainingReports = () => {
    this.setState({ ...this.state, showForms: false, showTrainings: true });
  };
  resetReports = () => {
    this.setState({ ...this.state, showForms: false, showTrainings: false });
  };

  render() {
    if (!this.state.showForms && !this.state.showTrainings) {
      return (
        <div style={{ marginTop: "50px" }}>
          <div className="row" style={{ margin: "0px 30px" }}>
            <div className="formTitleDiv" style={{ width: "100%" }}>
              <h2 className="formTitle">Reports{"  "}</h2>
              <hr />
              <h2 className="formTitle">
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  <button
                    className="btn btn-light extraInfoButton"
                    onClick={() => {
                      this.showFormReports();
                    }}
                  >
                    Form Reports
                  </button>
                </div>
              </h2>
              {adminReportingRoles.includes(this.props.userObj.jobTitle) && (
                <h2 className="formTitle">
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <button
                      className="btn btn-light extraInfoButton"
                      onClick={() => {
                        this.showTrainingReports();
                      }}
                    >
                      Internal Trainings
                    </button>
                  </div>
                </h2>
              )}
            </div>
          </div>
          <div className="reportBtnsMobile"></div>
        </div>
      );
    } else {
      if (this.state.showForms) {
        return (
          <div>
            <FromReports
              resetReports={() => {
                this.resetReports();
              }}
              userObj={this.props.userObj}
              allUsers={this.props.allUsers}
            />
          </div>
        );
      }
      if (this.state.showTrainings) {
        return (
          <div>
            <TrainingReports
              resetReports={() => {
                this.resetReports();
              }}
              userObj={this.props.userObj}
              allUsers={this.props.allUsers}
            />
          </div>
        );
      }
    }
  }
}

export default ReportsContainer;
