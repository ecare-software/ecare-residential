import React, { Component } from "react";
import "./Header.css";
import "../../App.css";
import LogInContiner from "../LogInContainer/LogInContainer";
import Carousel from "react-bootstrap/Carousel";
import ReactDOM from "react-dom";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";
import ModalFooter from "react-bootstrap/ModalFooter";

const imageStyle = {
  // height: "80vh"
};

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
      <div>
        {/* <div className="headerImg"> */}
        <Modal show={this.state.showLogIn} onHide={!this.state.showLogIn}>
          <LogInContiner
            logIn={this.props.logIn}
            pos={{ position: "absolute", top: "50%" }}
          />
          <button
            className="btn btn-default"
            style={{ position: "fixed" }}
            variant="secondary"
            onClick={this.closeLogInModal}
          >
            x
          </button>
        </Modal>
        {/* </div> */}
        <Carousel controls={false} indicators={true} interval={5000} fade={true} pauseOnHover={false}>
          <Carousel.Item>
            <img
              className="d-block w-100 headerImg"
              src={require("../../images/child4.jpeg")}
              style={imageStyle}
              alt="First slide"
            />
            {/* <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption> */}
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 headerImg"
              style={imageStyle}
              src={require("../../images/child1.jpeg")}
              alt="Two slide"
            />

            {/* <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption> */}
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 headerImg"
              src={require("../../images/child2.jpeg")}
              style={imageStyle}
              alt="Third slide"
            />

            {/* <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption> */}
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 headerImg"
              src={require("../../images/child3.jpeg")}
              style={imageStyle}
              alt="Fourth slide"
            />

            {/* <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption> */}
          </Carousel.Item>
        </Carousel>
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
      </div>
    );
  }
}

export default Header;
