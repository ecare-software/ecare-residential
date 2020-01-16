import React, { Component } from "react";
import "./LogInContainer.css";
import Fade from "react-reveal/Fade";
import "../../App.css";
import Axios from "axios";
import FormError from "../FormMods/FormError";


class LogInContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      password2: "",
      title: "",
      signUp: false
    };

    this.handleFieldInput = this.handleFieldInput.bind(this);
    this.submit = this.submit.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.toggleSignUp = this.toggleSignUp.bind(this);
  }

  toggleSignUp() {
    this.setState({ signUp: !this.state.signUp });
  }

  handleFieldInput(event) {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  }

  submit(isNew) {


    let currentState = JSON.parse(JSON.stringify(this.state));
    var staticThis = this;

    if (isNew) {
      delete currentState.signUp;
      Axios({
        method: "post",
        url: "/api/users/",
        data: currentState
      })
        .then(function(response) {
          staticThis.props.logIn(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      Axios({
        method: "get",
        url: "/api/users/" + this.state.email + "/" + this.state.password
      })
        .then(function(response) {
          // handle success
          if (response.data.length === 0) {
            // alert("hey");
            document.getElementById(staticThis.props.id+"-error").innerText = "Invalid email or password";
            document.getElementById(staticThis.props.id+"-error").style.display = "block";
          } else {

            staticThis.props.logIn(response.data[0]);
          }
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    }
  }

  validateForm() {
    var validForm = true;
    let staticThis = this;
    let simpleState = JSON.parse(JSON.stringify(this.state));
    delete simpleState.signUp;

    if (!this.state.signUp) {
      delete simpleState.firstName;
      delete simpleState.lastName;
      delete simpleState.middleName;
      delete simpleState.password2;
      delete simpleState.title;
    }else{
      delete simpleState.middleName;
      delete simpleState.title;
    }

    Object.keys(simpleState).forEach(function(k) {
      let value = simpleState[k];
      if (value === "" || value.includes(" ")) {
        console.log(k)
        validForm = false;
      }
    });
    if (validForm) {
      if (!this.state.signUp) {
        this.submit(false);
      } else {
        if (simpleState.password !== simpleState.password2) {
          document.getElementById(staticThis.props.id+"-error").innerText = "Passwords do not match";
          document.getElementById(staticThis.props.id+"-error").style.display = "block";
        } else {
          alert("")
          Axios({
            method: "get",
            url: "/api/users/" + this.state.email
          })
            .then(function(response) {
              // handle success
              if (response.data.length === 0) {
                staticThis.submit(true);
              } else {
                document.getElementById(staticThis.props.id+"-error").innerText = "Email address already in use";
                document.getElementById(staticThis.props.id+"-error").style.display = "block";
              }
            })
            .catch(function(error) {
              // handle error
              document.getElementById("error").innerText = "catch";
              document.getElementById("error").style.display = "block";
            });
        }
      }
    } else {
      document.getElementById(staticThis.props.id+"-error").innerText = "Invalid form submittion";
      document.getElementById(staticThis.props.id+"-error").style.display = "block";
    }
  }

  render() {
      return (

          <div
            id={this.props.id}
            style={this.props.pos}
            className="logInContainer"
          >
            <div className="logInInputFields">
              <div className="form-group logInInputField">
                <label className="control-label">username</label>
                <input
                  onChange={this.handleFieldInput}
                  id="email"
                  className="form-control"
                  type="text"
                />
              </div>
              <div className="form-group logInInputField">
                <label className="control-label">Password</label>
                <input
                  onChange={this.handleFieldInput}
                  id="password"
                  className="form-control"
                  type="password"
                />
              </div>
              
              <FormError errorId={this.props.id+'-error'}></FormError>
              <div className="form-group logInInputField">
                <button
                  onClick={this.validateForm}
                  className="btn darkBtnSimple pull-right"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>

      );
    
  }
}

export default LogInContainer;
