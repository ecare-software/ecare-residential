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
      showManageUsers: false
    };
  }

  toggleShow = compName => {
    console.log(compName);
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
      <div style={{ margin: "50px 20px 0px 20px" }}>
        <div style={{ margin: "75px 0px" }}>
          <h2>View and manage users within your home.</h2>
        </div>
        <ManageUsers id="manageUsers" allUsers={this.props.allUsers} toggleShow={this.toggleShow} doShow={this.state.showManageUsers} userObj={this.props.userObj}  />
        <CreateNewUser id="createUser" toggleShow={this.toggleShow} doShow={this.state.showCreateNewUser} userObj={this.props.userObj} />
      </div>
    );
  }
}

export default UserManagement;
