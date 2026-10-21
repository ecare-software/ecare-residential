import React, { Component } from "react";
import "./ReportsContainer.css";
import { isAdminUser } from "../../utils/AdminReportingRoles";
import { FormReports } from "./FormReports";
import { TrainingReports } from "./TrainingReports";
import { TrainingAttendance } from "./TrainingAttendance";

class ReportsContainer extends Component {
  constructor(props) {
    super(props);
    // initialFormName (optional): open straight into Form Reports with that
    // form type selected (e.g. the sign-in reminder's "Go to Reports").
    // Only used for the first Form Reports visit - going back to the
    // Reports menu clears it, so reopening Form Reports starts unselected.
    this.state = {
      showForms: !!props.initialFormName,
      showTrainings: false,
      showAttendance: false,
      initialFormName: props.initialFormName || "",
    };
  }

  showFormReports = () => {
    this.setState({ showForms: true, showTrainings: false, showAttendance: false });
  };

  showTrainingReports = () => {
    this.setState({ showForms: false, showTrainings: true, showAttendance: false });
  };

  showTrainingAttendance = () => {
    this.setState({ showForms: false, showTrainings: false, showAttendance: true });
  };

  resetReports = () => {
    this.setState({ showForms: false, showTrainings: false, showAttendance: false, initialFormName: "" });
  };

  render() {
    if (!this.state.showForms && !this.state.showTrainings && !this.state.showAttendance) {
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
              {isAdminUser(this.props.userObj) && (
                <>
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
                          this.showTrainingAttendance();
                        }}
                      >
                        Training Attendance
                      </button>
                    </div>
                  </h2>
                </>
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
            <FormReports
              resetReports={() => {
                this.resetReports();
              }}
              userObj={this.props.userObj}
              allUsers={this.props.allUsers}
              initialFormName={this.state.initialFormName}
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
      if (this.state.showAttendance) {
        return (
          <div>
            <TrainingAttendance
              resetReports={() => {
                this.resetReports();
              }}
              userObj={this.props.userObj}
            />
          </div>
        );
      }
    }
  }
}

export default ReportsContainer;
