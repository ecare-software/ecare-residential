import React, { Component } from "react";
import "./Header.css";
import "../../App.css";
import LogInContiner from "../LogInContainer/LogInContainer";
import ReactDOM from "react-dom";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";
import ModalFooter from "react-bootstrap/ModalFooter";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { showLogIn: false };
    this.scrollToMainBody = this.scrollToMainBody.bind(this);
  }

  scrollToMainBody() {}

  openLogInModal = () => {
    // console.log(document.getElementById("logInModal"));
    this.setState({ showLogIn: true });
  };

  closeLogInModal = () => {
    this.setState({ showLogIn: false });
  };

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
            data-toggle="modal"
            data-target="#logInModal"
            className="btn darkBtn"
            onClick={this.openLogInModal}
          >
            Log In
          </button>
        </div>
        <Modal show={this.state.showLogIn} onHide={!this.state.showLogIn}>
          <LogInContiner
            logIn={this.props.logIn}
            pos={{ position: "absolute", top: "50%" }}
          />
          <button className="btn btn-default" style={{position: "fixed"}} variant="secondary" onClick={this.closeLogInModal}>
            x
          </button>
        </Modal>
      </div>
    );
  }
}

export default Header;
