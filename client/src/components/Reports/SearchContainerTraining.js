import React, { Component } from "react";

class SearchContainerTraining extends Component {
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

  toggleSubmittedBy = (event) => {
    if (event.target.value === "Any") {
      this.setState({ submittedByA: [] });
    } else {
      this.setState({ submittedByA: [event.target.value] });
    }
    setTimeout(() => {
      // console.log(this.state)
      this.callRunSearch(this.state);
    });
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
    console.log(formName);
    this.setState({ submittedForms: submittedForms });
    setTimeout(() => {
      // console.log(this.state)
      this.callRunSearch(this.state);
    });
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
    // this.callRunSearch();
    setTimeout(() => {
      // console.log(this.state)
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

  render() {
    return (
      <div
        style={{
          width: "100%",
        }}
      >
        {/* basic filters */}
        <div className="row filterSection">
          <div className="col-md-12">
            <h4 style={{ color: "maroon" }}>Basic Filters</h4>
            <p style={{ margin: "10px 10px 5px 5px", fontWeight: "900" }}>
              {" "}
              Training
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
            {/* {<div style={{ display: "flex", margin: "0px 5px" }}>
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
            </div>} */}
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

export default SearchContainerTraining;
