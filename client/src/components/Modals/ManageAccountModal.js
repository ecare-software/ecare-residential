import React, { Component } from "react";
import "../../App.css";
import "../LogInContainer/LogInContainer.css";
import FormError from "../FormMods/FormError";
import FormSuccess from "../FormMods/FormSuccess";
import Axios from "axios";

class ManageAccountModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      password2: "",
    };
  }

  submit = () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    var staticThis = this;
    delete currentState.password2;

    Axios({
      method: "put",
      url: "/api/users/" + this.props.userObj._id,
      data: {
        password: this.state.password,
        newUser: false,
      },
    })
      .then(function (response) {
        document.getElementById(staticThis.props.id + "-success").innerText =
          "Password Updated";
        document.getElementById(
          staticThis.props.id + "-success"
        ).style.display = "block";
        document.getElementById("password").value = "";
        document.getElementById("password2").value = "";
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

  handleFieldInput = (event) => {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  };

  validateForm = () => {
    var validForm = true;
    let staticThis = this;
    let simpleState = JSON.parse(JSON.stringify(this.state));
    document.getElementById(staticThis.props.id + "-error").style.display =
      "none";
    Object.keys(simpleState).forEach(function (k) {
      let value = simpleState[k];
      if (value === "" || value.includes(" ")) {
        console.log(k);
        validForm = false;
      }
    });
    if (validForm) {
      if (simpleState.password !== simpleState.password2) {
        document.getElementById(staticThis.props.id + "-error").innerText =
          "Passwords do not match";
        document.getElementById(staticThis.props.id + "-error").style.display =
          "block";
      } else {
        this.submit();
      }
    } else {
      document.getElementById(staticThis.props.id + "-error").innerText =
        "Invalid form submission";
      document.getElementById(staticThis.props.id + "-error").style.display =
        "block";
    }
  };

  render() {
    return (
      <div
        className="modal fade"
        id="manageAccount"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="manageAccountLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <h4
                style={{ marginLeft: "10px" }}
                className="modal-title"
                id="manageAccountLabel"
              >
                Manage Account
              </h4>
            </div>
            <div className="modal-body">
              {/* sec 1 */}
              <div>
                <h4 className="defaultLabel">User Info</h4>
                <div style={{ margin: "50px 0px" }}>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td style={{ width: "30%" }}>
                          <p>
                            {this.props.userObj.firstName},{" "}
                            {this.props.userObj.lastName}
                          </p>
                        </td>
                        <td>
                          {/* <p style={{ cursor:"pointer",color: "maroon" }}>
                          Reset Password
                        </p> */}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table style={{ fontWeight: "200", margin: "10px" }}>
                    <tbody>
                      <tr>
                        <td style={{ width: "40%" }}>Last Logged In</td>
                        <td>
                          <span>{this.props.userObj.lastLogIn}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "40%" }}>Role</td>
                        <td>
                          <span>{this.props.userObj.jobTitle}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "40%" }}>Email</td>
                        <td>
                          <span>{this.props.userObj.email}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="formFields">
                  <h4 className="defaultSubLabel formFieldsTitle">
                    Change Password
                  </h4>
                  <div className="form-group logInInputField">
                    <label className="control-label">Enter New Password</label>
                    <input
                      onChange={this.handleFieldInput}
                      id="password"
                      className="form-control"
                      type="password"
                    />
                  </div>
                  <div className="form-group logInInputField">
                    <label className="control-label">
                      Re-enter New Password
                    </label>
                    <input
                      onChange={this.handleFieldInput}
                      id="password2"
                      className="form-control"
                      type="password"
                    />
                  </div>
                  <FormError errorId={this.props.id + "-error"}></FormError>
                  <FormSuccess
                    successId={this.props.id + "-success"}
                  ></FormSuccess>
                  <div
                    className="form-group logInInputField"
                    style={{ display: "flex", flexDirection: "row-reverse" }}
                  >
                    <button onClick={this.validateForm} className="darkBtn">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageAccountModal;
