import React, { Component } from "react";
import "./Header.css";
import "../../App.css";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.scrollToMainBody = this.scrollToMainBody.bind(this);
  }

  scrollToMainBody() {
    alert("in dev");
    // this.props.logIn();
  }

  openLogInModal = () => {
    // alert("open log in modal");
    
  }

  render() {
    return (
      <div className="headerImg">
        <div className="headerTextContainer">
          <h1 className="headerMainText">Residential Care System</h1>
          <p className="headerSubText">
            Health care system of today and tomorrow.
          </p>
          <button
            style={{ marginTop: "10px" }}
            onClick={this.scrollToMainBody}
            className="btn  lightBtn"
          >
            Learn More
          </button>
          <button
          id="logEventInBtn"
            style={{ marginTop: "10px" }}
            data-toggle="modal" data-target="#logInModal"
            className="btn darkBtn"
          >
            Log In
          </button>
        </div>
        {/* <button
          style={{ marginTop: "10px" }}
          className="btn darkBtn"
          data-toggle="modal"
          data-target="#requestDemoModal"
          id="headerDemoBtn"
        >
          Request a Demo
        </button> */}
        
        
      </div>
    );
  }
}

export default Header;
