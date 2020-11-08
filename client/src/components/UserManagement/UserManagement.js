import React, { Component } from "react";
import "../../App.css";
import Axios from "axios";
import "./UserManagement.css";
import CreateNewUser from "./CreateNewUser";
import ManageUsers from "./ManageUsers";

class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateNewUser: false,
      showManageUsers: false,
    };
  }

  toggleShow = (compName) => {
    // console.log(compName);
    switch (compName) {
      case "Create New User":
        this.setState({ showCreateNewUser: !this.state.showCreateNewUser });
        break;
      default:
        this.setState({ showManageUsers: !this.state.showManageUsers });
        break;
    }
  };
  render() {
    return (
      <div className="formCompNoBg">
        <div className="formTitleDiv">
          <h2 className="formTitle">User Management</h2>
        </div>
        <div className="formFieldsMobile">
          <ManageUsers
            id="manageUsers"
            allUsers={this.props.allUsers}
            toggleShow={this.toggleShow}
            doShow={this.state.showManageUsers}
            userObj={this.props.userObj}
          />
          <CreateNewUser
            id="createUser"
            toggleShow={this.toggleShow}
            doShow={this.state.showCreateNewUser}
            userObj={this.props.userObj}
          />
        </div>
      </div>
    );
  }
}

export default UserManagement;
