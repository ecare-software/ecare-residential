import React, { Component } from "react";
import "./Navbar.css";
import "../../App.css";

class UserBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  

  render() {
    return (
      <button onClick={this.props.toggleSlidingDiv} id="userBtn">
        <span className="fa fa-bars">
        </span>
      </button>
    );
  }
}

export default UserBtn;
