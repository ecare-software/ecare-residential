import React, { Component } from "react";
import Axios from "axios";
import FormListContainer from "../Forms/FormListContainer";
import SearchContainerTraining from "./SearchContainerTraining";
import ShowFormContainer from "./ShowFormContainer";
import { Collapse } from "react-bootstrap";

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
export class TrainingReports extends Component {
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

  setSelectedForm = (formIndex) => {
    if (formIndex > -1) {
      var formSubmitters = this.state.forms[formIndex].forms
        .map((forms) => {
          return forms.createdByName;
        })
        .filter(onlyUnique);
      setTimeout(() => {
        this.setState({ selectedForm: this.state.forms[formIndex] });
        // console.log(this.state);
      });
    } else {
      setTimeout(() => {
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

  flushFormStateData = () => {
    this.setState({
      selectedForm: {},
      forms: [],
      selectedUserForm: {},
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

  getTrainings = () => {
    this.flushFormStateData();

    var formRequests = [
      Axios.get("/api/orientationTraining/" + this.props.userObj.homeId),
      Axios.get("/api/preServiceTraining/" + this.props.userObj.homeId),
    ];

    Axios.all(formRequests).then((results) => {
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
      Axios.get("/api/orientationTraining/" + this.props.userObj.homeId),
      Axios.get("/api/preServiceTraining/" + this.props.userObj.homeId),
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

    var lastEditDate =
      searchObj.lastEditDate === "" ? "none" : searchObj.lastEditDate;

    var submittedByA =
      searchObj.submittedByA.length === 0
        ? "none"
        : searchObj.submittedByA.join(",");
    var formRequests = [];

    if (searchObj.submittedForms.length > 0) {
      searchObj.submittedForms.forEach((formName) => {
        if (formName === "Orientation Training") {
          formRequests.push(
            Axios.get(
              "/api/orientationTraining/" +
                this.props.userObj.homeId +
                "/" +
                submittedByA +
                "/" +
                lastEditDate
            )
          );
        }
        if (formName === "Pre Service Training") {
          formRequests.push(
            Axios.get(
              "/api/preServiceTraining/" +
                this.props.userObj.homeId +
                "/" +
                submittedByA +
                "/" +
                lastEditDate
            )
          );
        }
      });
    } else {
      //push all
      formRequests.push(
        Axios.get(
          "/api/orientationTraining/" +
            this.props.userObj.homeId +
            "/" +
            submittedByA +
            "/" +
            lastEditDate
        ),
        Axios.get(
          "/api/preServiceTraining/" +
            this.props.userObj.homeId +
            "/" +
            submittedByA +
            "/" +
            lastEditDate
        )
      );
    }
    Axios.all(formRequests).then((results) => {
      this.setFormsData(results);
      this.setState({ doReset: false });
    });
  };

  componentDidMount() {
    this.getTrainings();
    let allUsers = [...this.props.allUsers];
    allUsers.unshift({
      firstName: "Any",
      lastName: "Any",
      email: "Any",
    });
    this.setState({ ...this.state, allUsers });
  }

  toggleFilters = () => {
    this.setState({ doShowFilters: !this.state.doShowFilters });
  };

  render() {
    return (
      <div style={{ marginTop: "50px" }}>
        <div className="row" style={{ margin: "0px 30px" }}>
          <div className="formTitleDiv" style={{ width: "100%" }}>
            <h2 className="formTitle">
              Internal Training
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
                  onClick={this.props.resetReports}
                  className="btn btn-link"
                >
                  <span className="fa fa-undo"></span> Show all Reports
                </button>
                {Reflect.ownKeys(this.state.selectedUserForm).length === 0 && (
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
                )}
                {this.state.doShowFilters && (
                  <button
                    className="btn btn-link"
                    onClick={this.runSearchClick}
                  >
                    <span className="fa fa-play"></span> Run Search
                  </button>
                )}
                {Reflect.ownKeys(this.state.selectedUserForm).length > 0 && (
                  <button
                    onClick={this.selectedUserFormToggle.bind(
                      "",
                      this.state.searchObj
                    )}
                    className="btn btn-link"
                  >
                    <span className="fa fa-undo"></span> Show All Training
                    Reports
                  </button>
                )}
              </div>
            </h2>
          </div>
        </div>
        <div className="reportBtnsMobile"></div>
        <Collapse in={this.state.doShowFilters === true} timeout={10000}>
          <div className="row" style={{ padding: "10px 0px" }}>
            <SearchContainerTraining
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
  }
}
