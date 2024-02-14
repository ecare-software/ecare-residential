import React, { Component } from "react";
import ClientOption from "../../utils/ClientOption.util";
import Axios from "axios";
import { Form } from "react-bootstrap";

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      submittedForms: [],
      submittedByA: [],
      submittedBefore: "",
      submittedAfter: "",
      dobBefore: "",
      dobAfter: "",
      doaBefore: "",
      doaAfter: "",
      ethnicityA: [],
      approved: false,
      clients: [],
      loadingClients: true,
    };
    this.ethnicities = [
      {
        name: "Black / African American",
        value: "Black_-_African_American",
      },
      {
        name: "White / Caucasian",
        value: "White_-_Caucasian",
      },
      {
        name: "Hispanic / Latino",
        value: "Hispanic_-_Latino",
      },
      {
        name: "Asian / Pacific Islander",
        value: "Asian_-_Pacific_Islander",
      },
      {
        name: "Other",
        value: "Other",
      },
    ];
  }

  getClients = async () => {
    try {
      let { data: clients } = await Axios.get(
        `/api/client/${this.props.userObj.homeId}?active=true`
      );
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

  handleClientSelect = async (event) => {
    try {
      await this.setState({
        ...this.state,
        searchString: JSON.parse(event.target.value).childMeta_name,
      });
    } catch (e) {
      await this.setState({
        ...this.state,
        searchString: "",
      });
    }
  };

  toggleSubmittedBy = async (event) => {
    if (event.target.value === "Any") {
      await this.setState({ submittedByA: [] });
    } else {
      await this.setState({ submittedByA: [event.target.value] });
    }

    this.callRunSearch(this.state);
  };

  toggleApproval = (event) => {
    this.setState({ approved: event.target.value });
  };

  handleFieldInput = (event) => {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  };

  toggleBtnFormRunSearch = (formName) => {
    var submittedForms = this.state.submittedForms;
    var foundIndex = submittedForms.indexOf(formName);
    if (foundIndex > -1) {
      submittedForms.splice(foundIndex, 1);
    } else {
      submittedForms.push(formName);
    }
    this.setState({ submittedForms: submittedForms });
  };

  toggleBtnEthnicityRunSearch = (eth) => {
    var ethnicityA = this.state.ethnicityA;
    var foundIndex = ethnicityA.indexOf(eth);
    if (foundIndex > -1) {
      ethnicityA.splice(foundIndex, 1);
    } else {
      ethnicityA.push(eth);
    }
    this.setState({ ethnicityA: ethnicityA });
    setTimeout(() => {
      this.callRunSearch(this.state);
    });
  };

  callRunSearch = () => {
    this.props.runSearch(this.state);
  };

  checkForEnterKey = (e) => {
    if (e.keyCode === 13) {
      this.callRunSearch();
    }
  };

  componentDidMount() {
    this.getClients();
  }

  render() {
    return (
      <div
        style={{
          width: "100%",
        }}
      >
        {/* search bar */}
        <div className="row filterSection">
          <div className="col-md-12">
            <div
              className="form-group"
              style={{ height: "50px", display: "flex" }}
            >
              <div
                className="form-group logInInputField"
                style={{ width: "100%" }}
              >
                {" "}
                <label className="control-label">Child's Name</label>{" "}
                <Form.Control
                  as="select"
                  defaultValue={null}
                  onChange={this.handleClientSelect}
                  style={{ width: "100%" }}
                >
                  {[null, ...this.state.clients].map(
                    (client) => (
                      <ClientOption data={client} nullName="All" />
                    ),
                    []
                  )}
                </Form.Control>
              </div>
              <button
                className="btn btn-link"
                style={{ width: "40px", boxShadow: "none", marginTop: 30 }}
                onClick={this.callRunSearch}
                id="searchBtn"
              >
                <span className="fa fa-search"></span>
              </button>
            </div>
          </div>
        </div>
        {/* basic filters */}
        <div className="row filterSection">
          <div className="col-md-12">
            <h4 style={{ color: "maroon" }}>Basic Filters</h4>
            <div className="form-group" style={{ margin: "0px 5px" }}>
              <label style={{ margin: "5px" }}>Approval</label>
              <select
                defaultValue="Any"
                onChange={this.toggleApproval.bind("")}
                className="form-control"
                style={{ width: "100%" }}
                defaultValue={this.state.approved}
              >
                <option value={true}>Approved</option>
                <option value={false}>Needs Approval</option>
                <option value={"null"}>All</option>
              </select>
            </div>
            <p style={{ margin: "10px 10px 5px 5px", fontWeight: "900" }}>
              {" "}
              Forms
            </p>
            <div
              className="form-group"
              style={{ margin: "0px 5px", display: "flex", flexWrap: "wrap" }}
            >
              {this.props.formNames.map((item, index) => (
                <div style={{ margin: "5px" }} key={index}>
                  <input
                    onChange={this.toggleBtnFormRunSearch.bind("", item)}
                    id={"formBtn-" + index}
                    type="checkbox"
                  />
                  <label htmlFor={"formBtn-" + index} style={{ margin: "5px" }}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
            {this.props.doShowSubmittedBy ? (
              <div className="form-group" style={{ margin: "0px 5px" }}>
                <label style={{ margin: "5px" }}>Submitted By</label>
                <select
                  defaultValue="Any"
                  onChange={this.toggleSubmittedBy.bind("")}
                  className="form-control"
                  style={{ width: "100%" }}
                >
                  {this.props.allUsers.length === 0
                    ? []
                    : this.props.allUsers.map((user, userIndex) => (
                        <option
                          key={"user-" + userIndex}
                          id={"user-" + userIndex}
                          value={user.email}
                        >
                          {user.firstName === "Any"
                            ? "Any"
                            : user.firstName + " " + user.lastName}
                        </option>
                      ))}
                </select>
              </div>
            ) : (
              <></>
            )}
            <div style={{ display: "flex", margin: "0px 5px" }}>
              <div
                className="form-group"
                style={{ margin: "0px 0px", width: "50%" }}
              >
                <label style={{ margin: "5px" }}>After</label>
                <input
                  type="date"
                  className="form-control"
                  id="submittedAfter"
                  onChange={this.handleFieldInput}
                  style={{ width: "100%" }}
                />
              </div>
              <div
                className="form-group"
                style={{ margin: "0px 0px", width: "50%" }}
              >
                <label style={{ margin: "5px" }}>Before</label>
                <input
                  type="date"
                  className="form-control"
                  id="submittedBefore"
                  onChange={this.handleFieldInput}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Child filters */}
        <div className="row filterSection">
          <div className="col-md-12">
            <h4 style={{ color: "maroon" }}>Child Filters</h4>
            <p style={{ margin: "10px 10px 5px 5px", fontWeight: "900" }}>
              {" "}
              Date of Birth
            </p>
            <div style={{ display: "flex", margin: "0px 5px" }}>
              <div
                className="form-group"
                style={{ margin: "0px 0px", width: "50%" }}
              >
                <label style={{ margin: "5px" }}>After</label>
                <input
                  type="date"
                  id="dobAfter"
                  onChange={this.handleFieldInput}
                  className="form-control"
                  style={{ width: "100%" }}
                />
              </div>
              <div
                className="form-group"
                style={{ margin: "0px 0px", width: "50%" }}
              >
                <label style={{ margin: "5px" }}>Before</label>
                <input
                  type="date"
                  id="dobBefore"
                  onChange={this.handleFieldInput}
                  className="form-control"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <p style={{ margin: "10px 10px 5px 5px", fontWeight: "900" }}>
              {" "}
              Date of Admission
            </p>
            <div style={{ display: "flex", margin: "0px 5px" }}>
              <div
                className="form-group"
                style={{ margin: "0px 0px", width: "50%" }}
              >
                <label style={{ margin: "5px" }}>After</label>
                <input
                  type="date"
                  id="doaAfter"
                  onChange={this.handleFieldInput}
                  className="form-control"
                  style={{ width: "100%" }}
                />
              </div>
              <div
                className="form-group"
                style={{ margin: "0px 0px", width: "50%" }}
              >
                <label style={{ margin: "5px" }}>Before</label>
                <input
                  type="date"
                  id="doaBefore"
                  onChange={this.handleFieldInput}
                  className="form-control"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            {/* <p style={{ margin: "10px 10px 5px 5px", fontWeight: "900" }}>
              Ethnicity
            </p>
            <div
              className="form-group"
              style={{ margin: "0px 5px", display: "flex", flexWrap: "wrap" }}
            >
              {this.ethnicities.map((eth, ethKey) => (
                <div key={ethKey}>
                  <input
                    id={"ethBtn-" + ethKey}
                    onChange={this.toggleBtnEthnicityRunSearch.bind(
                      "",
                      eth.value
                    )}
                    type="checkbox"
                  />
                  <label htmlFor={"ethBtn-" + ethKey} style={{ margin: "5px" }}>
                    {eth.name}
                  </label>
                </div>
              ))}
            </div> */}
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

export default SearchContainer;
