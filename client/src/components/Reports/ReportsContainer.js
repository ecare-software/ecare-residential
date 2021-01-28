import React, { Component } from "react";
import ReportBarChart from "./ReportBarChart";
import ReportPieChart from "./ReportPieChart";
import Axios from "axios";
import { FromReports } from "./FormReports";
import { TrainingReports } from "./TrainingReports";

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
class ReportsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedForm: {},
      forms: [],
      selectedUserForm: {},
      chartType: "Bar",
      barChartData: [],
      pieChartData: [],
      chartsReady: false,
      searchObj: "",
      formNames: [],
      formNamesReady: false,
      adminReportingRoles: [
        "Admin",
        "Owner/CEO",
        "Executive/Director",
        "Administrator",
        "Case/Manager",
        "Supervisor",
      ],
      doReset: false,
      doShowFilters: false,
      allUsers: [],
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
        <div>
          <button
            onClick={() => {
              this.showFormReports();
            }}
          >
            formReports
          </button>
          <button
            onClick={() => {
              this.showTrainingReports();
            }}
          >
            trainings
          </button>
        </div>
      );
    } else {
      if (this.state.showForms) {
        return (
          <div>
            <button
              onClick={() => {
                this.resetReports();
              }}
            >
              Back
            </button>
            <FromReports
              userObj={this.props.userObj}
              allUsers={this.props.allUsers}
            />
          </div>
        );
      }
      if (this.state.showTrainings) {
        return (
          <div>
            <button
              onClick={() => {
                this.resetReports();
              }}
            >
              Back
            </button>
            <TrainingReports />
          </div>
        );
      }
    }
  }
}

/*

  return (
          <div style={{ marginTop: "50px" }}>
            <div className="row" style={{ margin: "0px 30px" }}>
              <div className="formTitleDiv" style={{ width: "100%" }}>
                <h2 className="formTitle">
                  Reports{"  "}
                  <br />
                  <hr />
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <button
                      className="btn btn-link"
                      onClick={this.toggleFilters}
                    >
                      {this.state.doShowFilters ? (
                        <span>
                          <span className="fa fa-minus"></span> Hide Filters
                        </span>
                      ) : (
                        <span>
                          <span className="fa fa-plus"></span> Show Filters
                        </span>
                      )}
                    </button>
                    <button
                      className="btn btn-link"
                      onClick={this.runSearchClick}
                    >
                      <span className="fa fa-play"></span> Run Search
                    </button>
                    <button
                      onClick={this.selectedUserFormToggle.bind(
                        "",
                        this.state.searchObj
                      )}
                      className="btn btn-link"
                    >
                      <span className="fa fa-undo"></span> Refresh List
                    </button>
                  </div>
                </h2>
              </div>
            </div>
            <div className="reportBtnsMobile"></div>
            <Collapse in={this.state.doShowFilters === true} timeout={10000}>
              <div className="row" style={{ padding: "10px 0px" }}>
                <SearchContainer
                  allUsers={this.state.allUsers}
                  runSearch={this.runSearch}
                  formNames={this.state.formNames}
                  doShowSubmittedBy={this.state.adminReportingRoles.includes(
                    this.props.userObj.jobTitle
                  )}
                />
              </div>
            </Collapse>
            {this.state.doShowFilters === false ? (
              <div className="row" style={{ paddingBottom: "100px" }}>
                <div style={{ marginTop: "75px" }} className="col-md-12">
                  <div
                    className={
                      Object.keys(this.state.selectedUserForm).length > 0
                        ? "hideIt"
                        : ""
                    }
                  >
                    <FormListContainer
                      doReset={this.state.doReset}
                      setSelectedForm={this.setSelectedForm}
                      setSelectedUser={this.setSelectedUser}
                      formObjs={this.state.forms}
                    />
                  </div>
                  <div
                    className={
                      Object.keys(this.state.selectedUserForm).length === 0
                        ? "hideIt"
                        : ""
                    }
                  >
                    <div>
                      <ShowFormContainer
                        valuesSet="true"
                        userObj={this.props.userObj}
                        formData={this.state.selectedUserForm}
                        form={
                          this.state.selectedForm.hasOwnProperty("name")
                            ? this.state.selectedForm
                            : { name: "hey", forms: [] }
                        }
                        isAdminRole={this.state.adminReportingRoles.includes(
                          this.props.userObj.jobTitle
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <React.Fragment />
            )}
          </div>
        );
        */

export default ReportsContainer;
