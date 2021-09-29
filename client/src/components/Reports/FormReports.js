import React, { Component } from "react";
import Axios from "axios";
import FormListContainer from "../Forms/FormListContainer";
import SearchContainer from "./SearchContainer";
import ShowFormContainer from "./ShowFormContainer";
import { Collapse } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { isAdminUser } from "../../utils/AdminReportingRoles";

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const getFilterText = (searchObj) => {
  const filterA = Reflect.ownKeys(searchObj).reduce((acc, key) => {
    if (
      (searchObj[key] && searchObj[key].length > 0) ||
      typeof searchObj[key] === "boolean"
    ) {
      switch (key) {
        case "doaAfter":
          acc.unshift(`Date of admission After ${searchObj[key]}`);
          return acc;
        case "doaBefore":
          searchObj["doaAfter"]
            ? acc.unshift(` and Before ${searchObj[key]}`)
            : acc.unshift(`Date of admission Before ${searchObj[key]}`);
          return acc;
        case "dobAfter":
          acc.unshift(`Date of birth After ${searchObj[key]}`);
          return acc;
        case "dobBefore":
          searchObj["dobAfter"]
            ? acc.unshift(` and Before ${searchObj[key]}`)
            : acc.unshift(`Date of birth Before ${searchObj[key]}`);
          return;
        case "ethnicityA":
          acc.unshift(`Ethnicity - ${searchObj[key].join(", ")}`);
          return acc;
        case "submittedAfter":
          acc.unshift(`Submitted After - ${searchObj[key]}`);
          return acc;
        case "submittedBefore":
          searchObj["submittedAfter"]
            ? acc.unshift(` and Before ${searchObj[key]}`)
            : acc.unshift(`Submitted Before - ${searchObj[key]}`);
          return acc;
        case "submittedByA":
          acc.unshift(`Submitted By - ${searchObj[key].join(", ")}`);
          return acc;
        case "submittedForms":
          acc.unshift(`Forms - ${searchObj[key].join(", ")}`);
          return acc;
        case "searchString":
          acc.unshift(`Client Name - ${searchObj[key]}`);
          return acc;
        case "approved":
          searchObj[key] !== "null"
            ? searchObj[key] === true || searchObj[key] === "true"
              ? acc.unshift(`Approved Forms`)
              : acc.unshift(`Not Approved Forms`)
            : acc.unshift(`Both Approved and Non-Approved Forms`);
          return acc;
        default:
          return acc;
      }
    } else {
      return acc;
    }
  }, []);
  return filterA.length > 0 ? filterA : ["No filters selected"];
};

export class FromReports extends Component {
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
      searchObj: {
        approved: false,
        searchString: "",
        submittedAfter: "",
        submittedBefore: "",
        dobAfter: "",
        dobBefore: "",
        doaAfter: "",
        doaBefore: "",
        ethnicityA: [],
        submittedByA: [],
        submittedForms: [],
      },
      formNames: [],
      formNamesReady: false,
      doReset: false,
      doShowFilters: false,
      allUsers: [],
      showForms: false,
      showTrainings: false,
      isLoading: true,
    };
  }

  setSelectedForm = (formIndex) => {
    if (formIndex > -1) {
      this.state.forms[formIndex].forms
        .map((forms) => {
          return forms.createdByName;
        })
        .filter(onlyUnique);
      setTimeout(() => {
        this.setState({ selectedForm: this.state.forms[formIndex] });
      });
    } else {
      setTimeout(() => {
        this.setState({ selectedForm: [] });
        this.setState({ selectedUserForm: {} });
      });
    }
  };

  toggleApprovedFilter = () => {
    const { approved } = this.state.searchObj;
    this.setState({
      searchObj: { ...this.state.searchObj, approved: !approved },
    });
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
    setTimeout(() => {});
  };

  flushFormStateData = () => {
    this.setState({
      selectedForm: {},
      forms: [],
      selectedUserForm: {},
      chartsReady: false,
      searchString: "",
      doReset: true,
      isLoading: true,
      doShowFilters: false,
    });
  };

  setFormsData = (results) => {
    var data = results.map((res) => res.data);
    if (!isAdminUser(this.props.userObj)) {
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
            formNames: [
              "Admission Assessment",
              "Health Body Check",
              "Daily Activity",
              "Illness Injury",
              "Restraint Report",
              "Incident Report",
              "Serious Incident Report",
              "72 Hour Treatment Plan",
            ],
          });
          this.setState({ formNamesReady: true });
        }
        this.setState({ forms: startFormsState });
        this.setState({ barChartData: startBarChartData });
        this.setState({ chartsReady: true });
        this.setState({ isLoading: false });
      }
    });
  };

  getForms = () => {
    this.flushFormStateData();
    var formRequests = [
      Axios.get(
        "/api/dailyProgressAndActivity/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
      Axios.get(
        "/api/incidentReport/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
      Axios.get(
        "/api/seriousIncidentReport/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
      Axios.get(
        "/api/restraintReport/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
      Axios.get(
        "/api/treatmentPlans72/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
      Axios.get(
        "/api/illnessInjury/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
      Axios.get(
        "/api/admissionAssessment/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
      Axios.get(
        "/api/bodyCheck/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
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
        ...this.state,
        doShowFilters: false,
        isLoading: true,
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
      isLoading: true,
    });

    var formRequests = [
      Axios.get(
        "/api/dailyProgressAndActivity/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
      Axios.get(
        "/api/incidentReport/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
      Axios.get(
        "/api/seriousIncidentReport/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
      Axios.get(
        "/api/restraintReport/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
      Axios.get(
        "/api/treatmentPlans72/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
      Axios.get(
        "/api/illnessInjury/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
      Axios.get(
        "/api/admissionAssessment/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
      Axios.get(
        "/api/bodyCheck/" +
          this.props.userObj.homeId +
          "/none/none/none/none/none/none/none/none/none/false"
      ),
    ];

    Axios.all(formRequests).then((results) => {
      this.setFormsData(results);
      this.setState({ doReset: false });
    });

    return;
  };

  runSearchClick = () => {
    document.getElementById("searchBtn").click();
  };

  runSearch = (searchObj) => {
    this.flushFormStateData();
    this.setState({ searchObj: searchObj });

    var approved = searchObj.approved;
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
                submittedByA +
                "/" +
                approved
            )
          );
        }

        if (formName === "Health Body Check") {
          formRequests.push(
            Axios.get(
              "/api/bodyCheck/" +
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
                submittedByA +
                "/" +
                approved
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
                submittedByA +
                "/" +
                approved
            )
          );
        }

        if (formName === "Serious Incident Report") {
          formRequests.push(
            Axios.get(
              "/api/seriousIncidentReport/" +
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
                submittedByA +
                "/" +
                approved
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
                submittedByA +
                "/" +
                approved
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
                submittedByA +
                "/" +
                approved
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
                submittedByA +
                "/" +
                approved
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
                submittedByA +
                "/" +
                approved
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
            submittedByA +
            "/" +
            approved
        ),
        Axios.get(
          "/api/bodyCheck/" +
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
            submittedByA +
            "/" +
            approved
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
            submittedByA +
            "/" +
            approved
        ),
        Axios.get(
          "/api/seriousIncidentReport/" +
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
            submittedByA +
            "/" +
            approved
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
            submittedByA +
            "/" +
            approved
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
            submittedByA +
            "/" +
            approved
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
            submittedByA +
            "/" +
            approved
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
            submittedByA +
            "/" +
            approved
        )
      );
    }
    Axios.all(formRequests).then((results) => {
      this.setFormsData(results);
      this.setState({ doReset: false });
    });
  };

  componentDidMount() {
    this.getForms();
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
        <div className="row hide-on-print" style={{ margin: "0px 30px" }}>
          <div className="formTitleDiv" style={{ width: "100%" }}>
            <h2 className="formTitle">
              Form Reports{"  "}
              <br />
              <hr />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                {Reflect.ownKeys(this.state.selectedUserForm).length === 0 && (
                  <button
                    onClick={this.props.resetReports}
                    className="btn btn-link"
                  >
                    <span className="fa fa-backspace"></span> Show all Reports
                  </button>
                )}
                {Reflect.ownKeys(this.state.selectedUserForm).length === 0 && (
                  <button className="btn btn-link" onClick={this.toggleFilters}>
                    {this.state.doShowFilters ? (
                      <span>
                        <span className="fa fa-undo"></span> Hide Filters
                      </span>
                    ) : (
                      <span>
                        <span className="fa fa-filter"></span> Show Filters
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
                    <span className="fa fa-backspace"></span> Back
                  </button>
                )}
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
              doShowSubmittedBy={isAdminUser(this.props.userObj)}
              userObj={this.props.userObj}
            />
          </div>
        </Collapse>
        {this.state.doShowFilters === false && (
          <div className="row hide-on-print" style={{ padding: "10px 50px" }}>
            <div className="col-md-12">
              <p className="mainFont MessagePostUser">
                <span className="fa fa-filter"></span> Filters
              </p>
            </div>
            <div className="col-md-12">
              {getFilterText(this.state.searchObj).map((filter) => (
                <p>
                  <i>{filter}</i>
                </p>
              ))}
            </div>
          </div>
        )}
        {this.state.isLoading ? (
          <div className="formLoadingDiv">
            <div>
              <ClipLoader className="formSpinner" size={50} color={"#ffc107"} />
            </div>

            <p>Loading...</p>
          </div>
        ) : this.state.doShowFilters === false && !this.state.isLoading ? (
          <div className="row" style={{ paddingBottom: "100px" }}>
            <div style={{ marginTop: "20px" }} className="col-md-12">
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
                    isAdminRole={isAdminUser(this.props.userObj)}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="formLoadingDiv">
            <div>
              <ClipLoader className="formSpinner" size={50} color={"#ffc107"} />
            </div>

            <p>Loading...</p>
          </div>
        )}
      </div>
    );
  }
}
