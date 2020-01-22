import React, { Component } from "react";
import "../../App.css";
import Axios from "axios";
import FormError from "../FormMods/FormError";
import FormSuccess from "../FormMods/FormSuccess";

class CreateNewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      middleName: "",
      lastName: "",
      jobTitle: "",
      homeId: this.props.userObj.homeId,
      email: "",
      password: "",
      password2: ""
    };
  }

  handleFieldInput = event => {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  };

  flushFields = () => {
    Object.keys(this.state).forEach(key => {
      if (key !== "homeId") {
        document.getElementById(key).value = "";
      }
    });
  };

  submit = isNew => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    var staticThis = this;
    console.log(currentState);
    Axios({
      method: "post",
      url: "/api/users/",
      data: currentState
    })
      .then(function(response) {
        document.getElementById(staticThis.props.id + "-success").innerText =
          "User " + currentState.email + " successfully created";
        document.getElementById(
          staticThis.props.id + "-success"
        ).style.display = "block";
        staticThis.flushFields();
        setTimeout(function() {
          document.getElementById(
            staticThis.props.id + "-success"
          ).style.display = "none";
        }, 3000);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  };

  validateForm = () => {
    var validForm = true;
    let staticThis = this;
    let simpleState = JSON.parse(JSON.stringify(this.state));

    console.log(simpleState);

    document.getElementById(staticThis.props.id + "-error").style.display =
      "none";

    Object.keys(simpleState).forEach(function(k) {
      let value = simpleState[k];
      if (value === "" || value.includes(" ")) {
        if (k !== "middleName") {
          validForm = false;
        }
      }
    });

    if (validForm) {
      if (simpleState.password !== simpleState.password2) {
        document.getElementById(staticThis.props.id + "-error").innerText =
          "Passwords do not match";
        document.getElementById(staticThis.props.id + "-error").style.display =
          "block";
      } else {
        Axios({
          method: "get",
          url: "/api/users/" + this.state.email
        })
          .then(function(response) {
            // handle success
            if (response.data.length === 0) {
              staticThis.submit(true);
            } else {
              document.getElementById(
                staticThis.props.id + "-error"
              ).innerText = "Email address already in use";
              document.getElementById(
                staticThis.props.id + "-error"
              ).style.display = "block";
            }
          })
          .catch(function(error) {
            // handle error
            // document.getElementById("error").innerText = "catch";
            // document.getElementById("error").style.display = "block";
            staticThis.submit(true);
          });
      }
    } else {
      document.getElementById(staticThis.props.id + "-error").innerText =
        "Invalid form submittion";
      document.getElementById(staticThis.props.id + "-error").style.display =
        "block";
    }
  };

  render() {

      return (
        <div className="managementElement" id="createNewUserContainer">
          <h4
            className="defaultLabel pointer"
            onClick={this.props.toggleShow.bind({}, "Create New User")}
          >
            Create New User <span style={{"fontSize":"15px"}} className={this.props.doShow? "fa fa-chevron-down":"fa fa-chevron-right"}></span>
          </h4>

          <div className={this.props.doShow ? "formFields" : "hide"} >
            <div className="form-group logInInputField">
              <label className="control-label">First Name</label>
              <input
                onChange={this.handleFieldInput}
                id="firstName"
                className="form-control"
                type="text"
              />
            </div>
            <div className="form-group logInInputField">
              <label className="control-label">Middle Name</label>
              <input
                onChange={this.handleFieldInput}
                id="middleName"
                className="form-control"
                type="text"
              />
            </div>
            <div className="form-group logInInputField">
              <label className="control-label">Last Name</label>
              <input
                onChange={this.handleFieldInput}
                id="lastName"
                className="form-control"
                type="text"
              />
            </div>
            <div className="form-group logInInputField">
              <label className="control-label">Job Title</label>
              <select
                className="form-control"
                onChange={this.handleFieldInput}
                id="jobTitle"
              >
                <option value="">Choose...</option>
                <option value="Owner/CEO">Owner/CEO</option>
                <option value="Executive/Director">Executive Director</option>
                <option value="Administrator">Administrator</option>
                <option value="Case-Manager">Case Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Direct-Care-Staff">Direct Care Staff</option>
              </select>
            </div>
            <div className="form-group logInInputField">
              <label className="control-label">Home ID</label>
              <input
                value={this.props.userObj.homeId}
                id="homeId"
                className="form-control"
                type="text"
                disabled
              />
            </div>
            <div className="form-group logInInputField">
              <label className="control-label">Email</label>
              <input
                onChange={this.handleFieldInput}
                id="email"
                className="form-control"
                type="text"
              />
            </div>
            <div className="form-group logInInputField">
              <label className="control-label">Temporary Password</label>
              <input
                onChange={this.handleFieldInput}
                id="password"
                className="form-control"
                type="text"
              />
            </div>
            <div className="form-group logInInputField">
              <label className="control-label">Re-Enter Password</label>
              <input
                onChange={this.handleFieldInput}
                id="password2"
                className="form-control"
                type="text"
              />
            </div>
            <FormError errorId={this.props.id + "-error"}></FormError>
            <FormSuccess successId={this.props.id + "-success"}></FormSuccess>
            <div
              className="form-group logInInputField"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <button onClick={this.validateForm} className="darkBtn">
                Submit
              </button>
            </div>
          </div>
        </div>
      );
    
  }
}

export default CreateNewUser;
