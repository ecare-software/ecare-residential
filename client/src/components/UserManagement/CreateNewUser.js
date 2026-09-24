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
      password2: "",
    };
  }

  handleFieldInput = (event) => {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  };

  flushFields = () => {
    Object.keys(this.state).forEach((key) => {
      if (key !== "homeId") {
        document.getElementById(key).value = "";
      }
    });
    // Clearing only the inputs left the previous user's values in state,
    // so the next submit could silently reuse e.g. their job title.
    this.setState({
      firstName: "",
      middleName: "",
      lastName: "",
      jobTitle: "",
      email: "",
      password: "",
      password2: "",
    });
  };

  submit = (isNew, validatedState) => {
    let currentState = validatedState || JSON.parse(JSON.stringify(this.state));
    var staticThis = this;
    Axios({
      method: "post",
      url: "/api/users/",
      data: currentState,
    })
      .then(function (response) {
        document.getElementById(staticThis.props.id + "-success").innerText =
          "User " + currentState.email + " successfully created";
        document.getElementById(
          staticThis.props.id + "-success"
        ).style.display = "block";
        staticThis.flushFields();
        setTimeout(function () {
          document.getElementById(
            staticThis.props.id + "-success"
          ).style.display = "none";
        }, 3000);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  // Returns an error message naming the first problem found, or null.
  // Leading/trailing whitespace is trimmed first (autofill and mobile
  // autocomplete often add a trailing space). Names may contain spaces
  // (e.g. "Mary Ann", "De La Cruz"); email and password may not, since
  // login matches them exactly.
  getValidationError = (simpleState) => {
    const required = {
      firstName: "First Name",
      lastName: "Last Name",
      jobTitle: "Job Title",
      homeId: "Home ID",
      email: "Email",
      password: "Temporary Password",
      password2: "Re-Enter Password",
    };
    for (const key of Object.keys(required)) {
      if (!simpleState[key]) return `${required[key]} is required`;
    }
    if (/\s/.test(simpleState.email) || !/^[^@]+@[^@]+\.[^@]+$/.test(simpleState.email)) {
      return "Email must be a valid email address with no spaces";
    }
    if (/\s/.test(simpleState.password)) {
      return "Password cannot contain spaces";
    }
    return null;
  };

  validateForm = () => {
    let staticThis = this;
    let simpleState = JSON.parse(JSON.stringify(this.state));
    Object.keys(simpleState).forEach((k) => {
      if (typeof simpleState[k] === "string") simpleState[k] = simpleState[k].trim();
    });
    // submit() is handed simpleState directly (setState may not have
    // flushed by then); this just keeps state in sync with what's posted.
    this.setState(simpleState);

    document.getElementById(staticThis.props.id + "-error").style.display =
      "none";

    const validationError = this.getValidationError(simpleState);

    if (!validationError) {
      if (simpleState.password !== simpleState.password2) {
        document.getElementById(staticThis.props.id + "-error").innerText =
          "Passwords do not match";
        document.getElementById(staticThis.props.id + "-error").style.display =
          "block";
      } else {
        Axios({
          method: "get",
          url: "/api/users/" + simpleState.email,
        })
          .then(function (response) {
            // handle success
            if (response.data.length === 0) {
              staticThis.submit(true, simpleState);
            } else {
              document.getElementById(
                staticThis.props.id + "-error"
              ).innerText = "Email address already in use";
              document.getElementById(
                staticThis.props.id + "-error"
              ).style.display = "block";
            }
          })
          .catch(function (error) {
            // handle error
            staticThis.submit(true, simpleState);
          });
      }
    } else {
      document.getElementById(staticThis.props.id + "-error").innerText =
        validationError;
      document.getElementById(staticThis.props.id + "-error").style.display =
        "block";
    }
  };

  render() {
    return (
      <div className='managementElement' id='createNewUserContainer'>
        <h4
          className='defaultLabel pointer'
          onClick={this.props.toggleShow.bind({}, "Create New User")}
        >
          Create New User{" "}
          <span
            style={{ fontSize: "15px" }}
            className={
              this.props.doShow ? "fa fa-chevron-down" : "fa fa-chevron-right"
            }
          ></span>
        </h4>

        <div className={this.props.doShow ? "formFields" : "hideIt"}>
          <div className='form-group logInInputField'>
            <label className='control-label'>First Name</label>
            <input
              onChange={this.handleFieldInput}
              id='firstName'
              className='form-control'
              type='text'
            />
          </div>
          <div className='form-group logInInputField'>
            <label className='control-label'>Middle Name</label>
            <input
              onChange={this.handleFieldInput}
              id='middleName'
              className='form-control'
              type='text'
            />
          </div>
          <div className='form-group logInInputField'>
            <label className='control-label'>Last Name</label>
            <input
              onChange={this.handleFieldInput}
              id='lastName'
              className='form-control'
              type='text'
            />
          </div>
          <div className='form-group logInInputField'>
            <label className='control-label'>Job Title</label>
            <select
              className='form-control'
              onChange={this.handleFieldInput}
              id='jobTitle'
            >
              <option value=''>Choose...</option>
              <option value='Owner/CEO'>Owner/CEO</option>
              <option value='Executive/Director'>Executive Director</option>
              <option value='Administrator'>Administrator</option>
              <option value='Supervisor'>Supervisor</option>
              <option value='Administrative/Assistant'>Administrative Assistant</option>
              <option value='Lead/Staff'>Lead Staff</option>
              <option value='Medical/Coordinator'>Medical Coordinator</option>
              <option value='Therapist'>Therapist</option>
              <option value='Case/Manager'>Case Manager</option>
              <option value='Direct/Care/Staff'>Direct Care Staff</option>
              <option value='Awake/Night/Staff'>Awake Night Staff</option>
              <option value='Volunteer/Staff'>Volunteer Staff</option>
            </select>
          </div>
          <div className='form-group logInInputField'>
            <label className='control-label'>Home ID</label>
            <input
              value={this.props.userObj.homeId}
              id='homeId'
              className='form-control'
              type='text'
              disabled
            />
          </div>
          <div className='form-group logInInputField'>
            <label className='control-label'>Email</label>
            <input
              onChange={this.handleFieldInput}
              id='email'
              className='form-control'
              type='text'
            />
          </div>
          <div className='form-group logInInputField'>
            <label className='control-label'>Temporary Password</label>
            <input
              onChange={this.handleFieldInput}
              id='password'
              className='form-control'
              type='text'
            />
          </div>
          <div className='form-group logInInputField'>
            <label className='control-label'>Re-Enter Password</label>
            <input
              onChange={this.handleFieldInput}
              id='password2'
              className='form-control'
              type='text'
            />
          </div>
          <FormError errorId={this.props.id + "-error"}></FormError>
          <FormSuccess successId={this.props.id + "-success"}></FormSuccess>
          <div
            className='form-group logInInputField'
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button onClick={this.validateForm} className='darkBtn'>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateNewUser;
