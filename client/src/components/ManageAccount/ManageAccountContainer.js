import React, { Component } from "react";
import "../../App.css";
import "../LogInContainer/LogInContainer.css";
import FormError from "../FormMods/FormError";
import FormSuccess from "../FormMods/FormSuccess";
import Axios from "axios";
import SignatureCanvas from "react-signature-canvas";
import ClipLoader from "react-spinners/ClipLoader";
import Cookies from "universal-cookie";
const cookies = new Cookies();

class ManageAccountContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      password2: "",
      isLoading: true,
    };
  }

  submit = async () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    var staticThis = this;
    delete currentState.password2;
    try {
      const { data } = await Axios({
        method: "put",
        url: "/api/users/" + this.props.userObj._id,
        data: {
          password: this.state.password,
          newUser: false,
        },
      });

      await this.props.updateUserData(data);
      document.getElementById(staticThis.props.id + "-success").innerText =
        "Password Updated";
      document.getElementById(staticThis.props.id + "-success").style.display =
        "block";
      document.getElementById("password").value = "";
      document.getElementById("password2").value = "";
      setTimeout(function () {
        document.getElementById(
          staticThis.props.id + "-success"
        ).style.display = "none";
      }, 3000);
    } catch (e) {
      alert("An error has occured");
      console.log(e);
    }
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
    delete simpleState.isLoading;

    Object.keys(simpleState).forEach(function (k) {
      let value = simpleState[k];
      if (value === "" || value.includes(" ")) {
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

  submitSig = async () => {
    try {
      const { data: newUserData } = await Axios({
        method: "put",
        url: "/api/users/sig/" + this.props.userObj._id,
        data: {
          signature: this.sigCanvas.toData(),
        },
      });

      await this.props.updateUserData(newUserData, true);

      document.getElementById(this.props.id + "-sig-success").innerText =
        "Signature Updated";
      document.getElementById(this.props.id + "-sig-success").style.display =
        "block";

      setTimeout(() => {
        document.getElementById(this.props.id + "-sig-success").style.display =
          "none";
      }, 3000);
    } catch (e) {
      // handle error
      console.log(e);
      alert(e);
    }
  };

  validateSig = () => {
    if (!this.sigCanvas.toData().length) {
      alert("Please Provide a signature before updating");
    } else {
      this.submitSig();
    }
  };

  setSignature = (userObj) => {
    if (userObj.signature && userObj.signature.length) {
      this.sigCanvas.fromData(userObj.signature);
    }
  };

  getUserSign = async (userObj) => {
    try {
      const { data } = await Axios({
        method: "get",
        url: `/api/users/user/${userObj._id}`,
      });
      this.setSignature(data);
      this.setState({ ...this.state, isLoading: false });
    } catch (e) {
      alert(e);
      console.log(e);
    }
  };

  componentDidMount() {
    this.getUserSign(this.props.userObj);
  }

  render() {
    return (
      <div className="formCompNoBg">
        <div className="formTitleDiv">
          <h2 className="formTitle">Manage Account</h2>
        </div>
        <div className="formFieldsMobile">
          <div className="modal-body">
            {/* sec 1 */}
            <div>
              <h4 className="defaultLabel">User Info</h4>
              <div style={{ margin: "50px 0px" }}>
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "100%" }}>
                        <p>
                          {this.props.userObj.firstName}{" "}
                          {this.props.userObj.lastName}
                        </p>
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
                <table style={{ fontWeight: "200", margin: "10px" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "50%" }}>Last Logged In</td>
                      <td>
                        <span>{this.props.userObj.lastLogIn}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "50%" }}>Role</td>
                      <td>
                        <span>{this.props.userObj.jobTitle}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "50%" }}>Email</td>
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
                  <label className="control-label">Re-enter New Password</label>
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
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    marginTop: 50,
                  }}
                >
                  <button
                    onClick={this.validateForm}
                    className="btn btn-light extraInfoButton"
                  >
                    Update
                  </button>
                </div>
                {this.state.isLoading && (
                  <div className="formLoadingDiv">
                    <div>
                      <ClipLoader
                        className="formSpinner"
                        size={50}
                        color={"#ffc107"}
                      />
                    </div>

                    <p>Loading...</p>
                  </div>
                )}

                <div
                  style={{
                    visibility: `${
                      this.state.isLoading ? "hidden" : "visible"
                    }`,
                  }}
                >
                  <h4 className="defaultSubLabel formFieldsTitle">Signature</h4>
                  <FormError errorId={this.props.id + "-sig-error"}></FormError>
                  <FormSuccess
                    successId={this.props.id + "-sig-success"}
                  ></FormSuccess>
                  <div className="sigSection">
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <SignatureCanvas
                        ref={(ref) => {
                          this.sigCanvas = ref;
                        }}
                        style={{ border: "solid" }}
                        penColor="black"
                        clearOnResize={false}
                        canvasProps={{
                          width: 600,
                          height: 200,
                          className: "sigCanvas",
                        }}
                        backgroundColor="#eeee"
                      />
                    </div>
                    <div
                      className="form-group logInInputField"
                      style={{
                        display: "flex",
                        flexDirection: "row-reverse",
                        marginTop: 50,
                      }}
                    >
                      <button
                        onClick={this.validateSig}
                        className="btn btn-light extraInfoButton"
                      >
                        Update
                      </button>
                      <button
                        style={{ marginRight: 20 }}
                        onClick={() => {
                          this.sigCanvas.clear();
                        }}
                        className="btn "
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageAccountContainer;
