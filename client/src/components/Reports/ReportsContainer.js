import React, { Component } from "react";
import FormListContainer from "../Forms/FormListContainer";
import ReportBarChart from "./ReportBarChart";
import ReportPieChart from "./ReportPieChart";
import SearchContainer from "./SearchContainer";
import ShowFormContainer from "./ShowFormContainer";
import { Collapse } from "react-bootstrap";
import Axios from "axios";

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
    };
  }

  setSelectedForm = (formIndex) => {
    if (formIndex > -1) {
      var formSubmitters = this.state.forms[formIndex].forms
        .map((forms) => {
          return forms.createdByName;
        })
        .filter(onlyUnique);
      let tempPieChartDataArray = [];
      formSubmitters.forEach((submitter) => {
        tempPieChartDataArray.push({
          name: submitter,
          value: this.state.forms[formIndex].forms.filter((forms) => {
            return forms.createdByName === submitter;
          }).length,
        });
      });
      setTimeout(() => {
        this.setState({ pieChartData: tempPieChartDataArray });
        this.setState({ chartType: "Pie" });
        this.setState({ selectedForm: this.state.forms[formIndex] });
        // console.log(this.state);
      });
    } else {
      setTimeout(() => {
        this.setState({ chartType: "Bar" });
        this.setState({ selectedForm: [] });
        this.setState({ selectedUserForm: {} });
        // console.log(this.state);
      });
    }
  };

  setSelectedUser = (userIndex) => {
    if (userIndex > -1) {
      if (this.state.selectedForm.forms.length) {
        this.setState({
          selectedUserForm: this.state.selectedForm.forms[userIndex],
        });
      }
      this.setState({ chartsReady: false });
    } else {
      this.setState({ selectedUserForm: {} });
      this.setState({ chartsReady: true });
    }
    setTimeout(() => {
      // console.log(this.state);
    });
  };

  returnChart = () => {
    if (this.state.chartType === "Bar") {
      return this.returnBarChart();
    }

    if (this.state.chartType === "Pie") {
      return this.returnPieChart();
    }
  };

  returnBarChart = () => {
    return <ReportBarChart data={this.state.barChartData} />;
  };

  returnPieChart = () => {
    return <ReportPieChart data={this.state.pieChartData} />;
  };

  flushFormStateData = () => {
    this.setState({
      selectedForm: {},
      forms: [],
      selectedUserForm: {},
      chartType: "Bar",
      barChartData: [],
      pieChartData: [],
      chartsReady: false,
      searchString: "",
      doReset: true,
    });
  };

  setFormsData = (results) => {
    var data = results.map((res) => res.data);
    if (!this.state.adminReportingRoles.includes(this.props.userObj.jobTitle)) {
      data = data.reduce((acc, cur) => {
        const formHasUserArray = cur.filter((formType) => {
          return formType.createdBy === this.props.userObj.email;
        });
        if (formHasUserArray.length > 0) {
          acc.push(formHasUserArray);
        }
        return acc;
      }, []);
    }
    var promiseCount = data.length;
    var count = 0;
    var startFormsState = this.state.forms;
    var startBarChartData = this.state.barChartData;
    data.forEach((formData) => {
      if (formData.length > 0) {
        //add to form state
        let nestedFormObj = {
          name: formData[0].formType,
          forms: formData,
        };
        startFormsState.push(nestedFormObj);

        // add to barChartData state
        startBarChartData.push({
          name: formData[0].formType,
          submittions: formData.length,
        });
      }
      count++;
      if (count === promiseCount) {
        if (!this.state.formNamesReady) {
          this.setState({
            formNames: startFormsState.map((forms) => {
              return forms.name;
            }),
          });
          this.setState({ formNamesReady: true });
        }
        this.setState({ forms: startFormsState });
        this.setState({ barChartData: startBarChartData });
        this.setState({ chartsReady: true });
      }
    });
  };

  getForms = () => {
    this.flushFormStateData();
    var formRequests = [
      Axios.get("/api/dailyProgressAndActivity/" + this.props.userObj.homeId),
      Axios.get("/api/incidentReport/" + this.props.userObj.homeId),
      Axios.get("/api/restraintReport/" + this.props.userObj.homeId),
      Axios.get("/api/treatmentPlans72/" + this.props.userObj.homeId),
      Axios.get("/api/illnessInjury/" + this.props.userObj.homeId),
      Axios.get("/api/admissionAssessment/" + this.props.userObj.homeId),
    ];

    Axios.all(formRequests).then((results) => {
      console.log(results);
      this.setFormsData(results);
      this.setState({ doReset: false });
    });

    return;
  };

  selectedUserFormToggle = (searchObj) => {
    if (Object.keys(searchObj).length > 0) {
      this.setState({
        doShowFilters: false,
      });
      this.runSearch(searchObj);
      return;
    }
    this.setState({
      selectedForm: {},
      forms: [],
      selectedUserForm: {},
      chartType: "Bar",
      barChartData: [],
      pieChartData: [],
      chartsReady: false,
      searchString: "",
      doReset: true,
      doShowFilters: false,
    });

    var formRequests = [
      Axios.get("/api/dailyProgressAndActivity/" + this.props.userObj.homeId),
      Axios.get("/api/incidentReport/" + this.props.userObj.homeId),
      Axios.get("/api/restraintReport/" + this.props.userObj.homeId),
      Axios.get("/api/treatmentPlans72/" + this.props.userObj.homeId),
      Axios.get("/api/illnessInjury/" + this.props.userObj.homeId),
      Axios.get("/api/admissionAssessment/" + this.props.userObj.homeId),
    ];

    Axios.all(formRequests).then((results) => {
      this.setFormsData(results);
      this.setState({ doReset: false });
    });

    return;
    // this.getForms();
    // this.setState({ selectedUserForm: {} });
  };

  runSearchClick = () => {
    this.setState({ doShowFilters: false });
    document.getElementById("searchBtn").click();
  };

  runSearch = (searchObj) => {
    this.flushFormStateData();
    this.setState({ searchObj: searchObj });
    var searchString =
      searchObj.searchString.length === 0 || /^\s+/.test(searchObj.searchString)
        ? "none"
        : searchObj.searchString; //search string
    var submittedAfter =
      searchObj.submittedAfter === "" ? "none" : searchObj.submittedAfter;
    var submittedBefore =
      searchObj.submittedBefore === "" ? "none" : searchObj.submittedBefore;
    var dobAfter = searchObj.dobAfter === "" ? "none" : searchObj.dobAfter;
    var dobBefore = searchObj.dobBefore === "" ? "none" : searchObj.dobBefore;
    var doaAfter = searchObj.doaAfter === "" ? "none" : searchObj.doaAfter;
    var doaBefore = searchObj.doaBefore === "" ? "none" : searchObj.doaBefore;
    var ethnicityA =
      searchObj.ethnicityA.length === 0
        ? "none"
        : searchObj.ethnicityA.join(",");
    var submittedByA =
      searchObj.submittedByA.length === 0
        ? "none"
        : searchObj.submittedByA.join(",");
    var formRequests = [];

    console.log(searchObj.submittedForms);

    if (searchObj.submittedForms.length > 0) {
      searchObj.submittedForms.forEach((formName) => {
        if (formName === "Daily Activity") {
          formRequests.push(
            Axios.get(
              "/api/dailyProgressAndActivity/" +
                this.props.userObj.homeId +
                "/" +
                searchString +
                "/" +
                submittedAfter +
                "/" +
                submittedBefore +
                "/" +
                dobAfter +
                "/" +
                dobBefore +
                "/" +
                doaAfter +
                "/" +
                doaBefore +
                "/" +
                ethnicityA +
                "/" +
                submittedByA
            )
          );
        }

        if (formName === "Incident Report") {
          formRequests.push(
            Axios.get(
              "/api/incidentReport/" +
                this.props.userObj.homeId +
                "/" +
                searchString +
                "/" +
                submittedAfter +
                "/" +
                submittedBefore +
                "/" +
                dobAfter +
                "/" +
                dobBefore +
                "/" +
                doaAfter +
                "/" +
                doaBefore +
                "/" +
                ethnicityA +
                "/" +
                submittedByA
            )
          );
        }

        if (formName === "Restraint Report") {
          formRequests.push(
            Axios.get(
              "/api/restraintReport/" +
                this.props.userObj.homeId +
                "/" +
                searchString +
                "/" +
                submittedAfter +
                "/" +
                submittedBefore +
                "/" +
                dobAfter +
                "/" +
                dobBefore +
                "/" +
                doaAfter +
                "/" +
                doaBefore +
                "/" +
                ethnicityA +
                "/" +
                submittedByA
            )
          );
        }

        if (formName === "72 Hour Treatment Plan") {
          formRequests.push(
            Axios.get(
              "/api/treatmentPlans72/" +
                this.props.userObj.homeId +
                "/" +
                searchString +
                "/" +
                submittedAfter +
                "/" +
                submittedBefore +
                "/" +
                dobAfter +
                "/" +
                dobBefore +
                "/" +
                doaAfter +
                "/" +
                doaBefore +
                "/" +
                ethnicityA +
                "/" +
                submittedByA
            )
          );
        }
        if (formName === "Illness Injury") {
          formRequests.push(
            Axios.get(
              "/api/illnessInjury/" +
                this.props.userObj.homeId +
                "/" +
                searchString +
                "/" +
                submittedAfter +
                "/" +
                submittedBefore +
                "/" +
                dobAfter +
                "/" +
                dobBefore +
                "/" +
                doaAfter +
                "/" +
                doaBefore +
                "/" +
                ethnicityA +
                "/" +
                submittedByA
            )
          );
        }
        if (formName === "Admission Assessment") {
          formRequests.push(
            Axios.get(
              "/api/admissionAssessment/" +
                this.props.userObj.homeId +
                "/" +
                searchString +
                "/" +
                submittedAfter +
                "/" +
                submittedBefore +
                "/" +
                dobAfter +
                "/" +
                dobBefore +
                "/" +
                doaAfter +
                "/" +
                doaBefore +
                "/" +
                ethnicityA +
                "/" +
                submittedByA
            )
          );
        }
      });
    } else {
      //push all
      formRequests.push(
        Axios.get(
          "/api/dailyProgressAndActivity/" +
            this.props.userObj.homeId +
            "/" +
            searchString +
            "/" +
            submittedAfter +
            "/" +
            submittedBefore +
            "/" +
            dobAfter +
            "/" +
            dobBefore +
            "/" +
            doaAfter +
            "/" +
            doaBefore +
            "/" +
            ethnicityA +
            "/" +
            submittedByA
        ),
        Axios.get(
          "/api/incidentReport/" +
            this.props.userObj.homeId +
            "/" +
            searchString +
            "/" +
            submittedAfter +
            "/" +
            submittedBefore +
            "/" +
            dobAfter +
            "/" +
            dobBefore +
            "/" +
            doaAfter +
            "/" +
            doaBefore +
            "/" +
            ethnicityA +
            "/" +
            submittedByA
        ),
        Axios.get(
          "/api/admissionAssessment/" +
            this.props.userObj.homeId +
            "/" +
            searchString +
            "/" +
            submittedAfter +
            "/" +
            submittedBefore +
            "/" +
            dobAfter +
            "/" +
            dobBefore +
            "/" +
            doaAfter +
            "/" +
            doaBefore +
            "/" +
            ethnicityA +
            "/" +
            submittedByA
        ),
        Axios.get(
          "/api/restraintReport/" +
            this.props.userObj.homeId +
            "/" +
            searchString +
            "/" +
            submittedAfter +
            "/" +
            submittedBefore +
            "/" +
            dobAfter +
            "/" +
            dobBefore +
            "/" +
            doaAfter +
            "/" +
            doaBefore +
            "/" +
            ethnicityA +
            "/" +
            submittedByA
        ),
        Axios.get(
          "/api/treatmentPlans72/" +
            this.props.userObj.homeId +
            "/" +
            searchString +
            "/" +
            submittedAfter +
            "/" +
            submittedBefore +
            "/" +
            dobAfter +
            "/" +
            dobBefore +
            "/" +
            doaAfter +
            "/" +
            doaBefore +
            "/" +
            ethnicityA +
            "/" +
            submittedByA
        ),

        Axios.get(
          "/api/illnessInjury/" +
            this.props.userObj.homeId +
            "/" +
            searchString +
            "/" +
            submittedAfter +
            "/" +
            submittedBefore +
            "/" +
            dobAfter +
            "/" +
            dobBefore +
            "/" +
            doaAfter +
            "/" +
            doaBefore +
            "/" +
            ethnicityA +
            "/" +
            submittedByA
        )
      );
    }
    Axios.all(formRequests).then((results) => {
      this.setFormsData(results);
      this.setState({ doReset: false });
    });
    // + "/"+"some"

    // .then(response => {
    //   console.log(response);
    // })
    // .catch(e => {
    //   console.log(e);
    // })
  };

  // getAllUsers = () => {
  //   Axios.get(`/api/users/${this.props.userObj.homeId}`).then((allUsers) => {
  //     allUsers.data.unshift({
  //       firstName: "Any",
  //       lastName: "Any",
  //       email: "Any",
  //     });
  //     this.setState({ allUsers: allUsers.data });
  //   });
  // };

  componentDidMount() {
    this.getForms();
    let allUsers = [...this.props.allUsers];
    allUsers.unshift({
      firstName: "Any",
      lastName: "Any",
      email: "Any",
    });
    this.setState({ ...this.state, allUsers });
    // if (this.state.adminReportingRoles.includes(this.props.userObj.jobTitle)) {
    //   this.getAllUsers();
    // }
  }

  toggleFilters = () => {
    this.setState({ doShowFilters: !this.state.doShowFilters });
  };

  render() {
    return (
      <div style={{ marginTop: "50px" }}>
        {/* Title */}
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
                <button className="btn btn-link" onClick={this.toggleFilters}>
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
                <button className="btn btn-link" onClick={this.runSearchClick}>
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
  }
}

export default ReportsContainer;
