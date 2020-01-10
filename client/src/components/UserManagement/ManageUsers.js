import React, { Component } from "react";
import Axios from "axios";
// import FormError from "../FormMods/FormError";
// import FormSuccess from "../FormMods/FormSuccess";
import "../../App.css";

class ManageUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetting: -1,
      newPassword: "",
      newPassword2: ""
    };
  }

  // componentWillReceiveProps = () =>{
  //   console.log(this.props)
  // }

  openNewPassword = index => {
    let resettingCurrent = this.state.resetting;
    if (resettingCurrent === index) {
      this.setState({ resetting: -1, newPassword: "", newPassword2: "" });
      return;
    }
    this.setState({ resetting: index, newPassword: "", newPassword2: "" });
  };

  handleFieldInput = (event) => {
    var stateObj = {};
    var isReenter = event.target.id.split("-")[0];

    if (isReenter === "reenterpassword") {
      this.setState({ newPassword2: event.target.value });
    } else {
      this.setState({ newPassword: event.target.value });
    }

    console.log(isReenter);
  }

  saveNewPassword = id => {
    console.log(this.state);
    console.log(id);
    if((/^\s+$/).test(this.state.newPassword)){
      alert("Password is not valid")
      return;
    }

    if(this.state.newPassword!==this.state.newPassword2){
      alert("Passwords do no match1")
      return;
    }

    Axios({
      method: "put",
      url: "/api/users/" + id,
      data: {
        password: this.state.newPassword,
        newUser: false
      }
    })
      .then(function(response) {
alert("password reset")
      })
  };

  render() {
    if (this.props.allUsers) {
      return (
        <div className="managementElement" id="manageUsersContainer">
          <h4
            className="defaultLabel pointer"
            onClick={this.props.toggleShow.bind({}, "Manage User")}
          >
            Manage Users
            <span
              style={{ fontSize: "15px" }}
              className={
                this.props.doShow
                  ? "glyphicon glyphicon-chevron-down"
                  : "glyphicon glyphicon-chevron-right"
              }
            ></span>
          </h4>
          <div className={this.props.doShow ? "formFields" : "hide"}>
            {this.props.allUsers.map((item, index) => (
              <div key={index + "-" + "user"} style={{ margin: "50px 0px" }}>
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "30%" }}>
                        <p>
                          {item.firstName}, {item.lastName}
                        </p>
                      </td>
                      <td>
                        <p
                          onClick={this.openNewPassword.bind("", index)}
                          style={{ cursor: "pointer", color: "maroon" }}
                        >
                          Reset Password
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  className={
                    this.state.resetting === index
                      ? "flexNewPassword"
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

                      margin: "5px"
                    }}
                  >
                    <button onClick={this.saveNewPassword.bind('',item._id)} className="btn btn-default">Save</button>
                  </div>
                </div>
                <table style={{ fontWeight: "200", margin: "10px" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "40%" }}>Last Logged In</td>
                      <td>
                        <span>{item.lastLogIn}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "40%" }}>Role</td>
                      <td>
                        <span>{item.jobTitle}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "40%" }}>Email</td>
                      <td>
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
