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

  toggleSlidingDiv = () => {
    // if (this.state.isOpen) {
    //   document.getElementsByClassName("slidingDiv")[1].style.left = "-66%";
    // } else {
    //   document.getElementsByClassName("slidingDiv")[1].style.left = "0%";
    // }
    // this.setState({isOpen:!this.state.isOpen})
    if(document.getElementsByClassName("slidingDiv")[1].style.left === "0%"){
      document.getElementsByClassName("slidingDiv")[1].style.left = "-66%";
    }else{
      document.getElementsByClassName("slidingDiv")[1].style.left = "0%"
    }
  };

  render() {
    return (
      <button onClick={this.toggleSlidingDiv} id="userBtn">
        <span className="glyphicon glyphicon-menu-hamburger" />
      </button>
    );
  }
}

export default UserBtn;
