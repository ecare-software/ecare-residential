import React, { Component } from "react";
import Axios from "axios";

import "../../App.css";

const headerRow = {
  fontWeight: 400,
};

class ManageUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetting: -1,
      newPassword: "",
      newPassword2: "",
    };
  }

  openNewPassword = (index) => {
    let resettingCurrent = this.state.resetting;
    if (resettingCurrent === index) {
      this.setState({ resetting: -1, newPassword: "", newPassword2: "" });
      return;
    }
    this.setState({ resetting: index, newPassword: "", newPassword2: "" });
  };

  toggleCreatedPassword = async () => {
    await this.setState({ newPassword: "", newPassword2: "" });
    await this.setState({ resetting: -1 });
  };

  handleFieldInput = (event) => {
    var isReenter = event.target.id.split("-")[0];

    if (isReenter === "reenterpassword") {
      this.setState({ newPassword2: event.target.value });
    } else {
      this.setState({ newPassword: event.target.value });
    }
  };

  saveNewPassword = async (id, index) => {
    if (/^\s+$/.test(this.state.newPassword)) {
      alert("Password is not valid");
      return;
    }

    if (this.state.newPassword !== this.state.newPassword2) {
      alert("Passwords do no match1");
      return;
    }
    try {
      const { data } = await Axios({
        method: "put",
        url: "/api/users/" + id,
        data: {
          password: this.state.newPassword,
          newUser: false,
        },
      });
      if (id === this.props.userObj._id) {
        console.log("is logged in user");
        await this.props.updateUserData(data);
      }
      alert("password has been reset");
      this.toggleCreatedPassword();
    } catch (e) {
      alert("Error updating password");
      console.log(e);
    }
  };

  render() {
    if (this.props.allUsers) {
      return (
        <div className="managementElement" id="manageUsersContainer">
          <h4
            className="defaultLabel pointer"
            onClick={this.props.toggleShow.bind({}, "Manage User")}
          >
            Manage Users{" "}
            <span
              style={{ fontSize: "15px" }}
              className={
                this.props.doShow ? "fa fa-chevron-down" : "fa fa-chevron-right"
              }
            ></span>
          </h4>
          <div className={this.props.doShow ? "formFields" : "hideIt"}>
            {this.props.allUsers.map((item, index) => (
              <div key={index + "-" + "user"} style={{ margin: "50px 0px" }}>
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "50%" }}>
                        <p>
                          {item.firstName}, {item.lastName}
                          {" - "}
                          <span
                            onClick={this.openNewPassword.bind("", index)}
                            style={{ cursor: "pointer", color: "maroon" }}
                          >
                            Reset Password
                          </span>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  className={
                    this.state.resetting === index
                      ? "flexNewPassword row"
                      : "hideIt"
                  }
                >
                  <div className="form-group" style={{ margin: "5px" }}>
                    <label className="control-label">New Password</label>
                    <input
                      onChange={this.handleFieldInput}
                      className="form-control"
                      id={"password-" + index}
                      type="text"
                    />
                  </div>
                  <div className="form-group" style={{ margin: "5px" }}>
                    <label className="control-label">
                      Re-enter New Password
                    </label>
                    <input
                      onChange={this.handleFieldInput}
                      id={"reenterpassword-" + index}
                      className="form-control"
                      type="text"
                    />
                  </div>
                  <div
                    className="form-group"
                    style={{
                      display: "flex",
                      flexDirection: "column-reverse",

                      margin: "5px",
                    }}
                  >
                    <button
                      onClick={this.saveNewPassword.bind("", item._id, index)}
                      className="btn btn-default"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <table
                  style={{
                    fontWeight: "200",
                    width: "-webkit-fill-available",
                  }}
                >
                  <tbody>
                    <tr>
                      <td>
                        <span style={headerRow}>Last Logged In</span>
                        <span>
                          {" "}
                          - {new Date(item.lastLogIn).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span style={headerRow}>Role</span>
                        <span> - {item.jobTitle}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span style={headerRow}>Email</span> -{" "}
                        <span>{item.email}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default ManageUsers;
