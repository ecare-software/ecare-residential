import React, { Component } from "react";
import "./Header.css";
import "../../App.css";
import Axios from "axios";
import LogInContiner from "../LogInContainer/LogInContainer";
import Carousel from "react-bootstrap/Carousel";
import Modal from "react-bootstrap/Modal";
import FormAlert from "../Forms/FormAlert";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";

const imageStyle = {
  // height: "80vh"
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogIn: false,
      emailTo: "",
      name: "",
      organization: "",
      emailSent: false,
      showLearnMore: false,
    };
    this.scrollToMainBody = this.scrollToMainBody.bind(this);
  }

  scrollToMainBody() {}

  openLogInModal = () => {
    this.setState({ showLogIn: true });
  };

  closeLogInModal = () => {
    this.setState({ showLogIn: false });
  };

  handleFieldInput = (event) => {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  };

  toggleLearnMore = () => {
    this.setState({ showLearnMore: !this.state.showLearnMore });
  };

  sendEmail = () => {
    var thisHook = this;
    if (this.state.emailTo === "") {
      return;
    }
    Axios.post(
      `/api/email/${this.state.emailTo}/${this.state.name}/${
        this.state.organization ? this.state.organization : "null"
      }`
    )
      .then(function (response) {
        thisHook.setState({
          name: "",
          organization: "",
          emailTo: "",
          emailSent: true,
          showLearnMore: false,
        });
        setTimeout(() => {
          thisHook.setState({ emailSent: false });
        }, 4000);
      })
      .catch(function (error) {
        alert("error sending email");
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <Modal show={this.state.showLearnMore} onHide={this.toggleLearnMore}>
          <ModalHeader
            closeButton
            style={{
              color: "maroon",
              textAlign: "center",
              borderColor: "maroon",
              backgroundColor: "white",
            }}
          >
            <h5>Learn more about our services</h5>
          </ModalHeader>
          <ModalBody style={{ backgroundColor: "white" }}>
            <div className="form-group">
              <p>
                Complete the form below to get a personalized email describing
                the services offered.
              </p>
              <input
                id="name"
                onChange={this.handleFieldInput}
                value={this.state.name}
                style={{ width: "100%", margin: "15px 0px" }}
                className="form-control"
                placeholder="Name"
              />
              <input
                id="organization"
                onChange={this.handleFieldInput}
                value={this.state.organization}
                style={{ width: "100%", margin: "15px 0px" }}
                className="form-control"
                placeholder="Organization"
              />
              <input
                id="emailTo"
                onChange={this.handleFieldInput}
                value={this.state.emailTo}
                style={{ width: "100%", margin: "15px 0px" }}
                className="form-control"
                placeholder="youremail@example.com"
              />
              <button
                style={{
                  margin: "5px 0px",
                  float: "right",
                  backgroundColor: "maroon",
                  color: "white",
                }}
                onClick={this.sendEmail}
                className="btn"
              >
                Submit
              </button>
            </div>
          </ModalBody>
        </Modal>
        <Modal show={this.state.showLogIn} onHide={!this.state.showLogIn}>
          <LogInContiner
            logIn={this.props.logIn}
            pos={{ position: "absolute", top: "20vh !important" }}
          />
          <button
            className="btn btn-default mobileAdj"
            style={{ position: "fixed" }}
            variant="secondary"
            onClick={this.closeLogInModal}
          >
            this isnt an ex
          </button>
        </Modal>

        <Carousel
          controls={false}
          indicators={true}
          interval={5000}
          fade={true}
          pauseOnHover={false}
        >
          <Carousel.Item>
            <img
              className="d-block w-100 headerImg"
              src={require("../../images/child4.jpeg")}
              style={imageStyle}
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 headerImg"
              style={imageStyle}
              src={require("../../images/child1.jpeg")}
              alt="Two slide"
            />
          </Carousel.Item>
        </Carousel>
        <div className="headerTextContainer">
          {this.state.emailSent ? (
            <React.Fragment>
              <FormAlert
                doShow={this.state.emailSent}
                type="success"
                heading={`Thank you, We shall email you shortly`}
              ></FormAlert>
            </React.Fragment>
          ) : (
            <React.Fragment />
          )}
          <h1 className="headerMainText">Residential Care System</h1>
          <p className="headerSubText">
            Health care system of today <br />
            and tomorrow.
          </p>
          <div className="desktopLearnMore" style={{ marginRight: "200px" }}>
            {/* <input
              id="name"
              onChange={this.handleFieldInput}
              value={this.state.name}
              style={{ width: "100%", margin: "5px 10px", float: "right" }}
              className="form-control"
              placeholder="Name / Organization"
            />
            <input
              id="emailTo"
              onChange={this.handleFieldInput}
              value={this.state.emailTo}
              style={{ width: "100%", margin: "5px 10px", float: "right" }}
              className="form-control"
              placeholder="youremail@example.com"
            /> */}
            <button
              style={{ marginTop: "10px", float: "right", marginRight: "10px" }}
              onClick={this.toggleLearnMore}
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
          <div className="mobileLearnMore" style={{}}>
            <button
              style={{ marginTop: "10px", fontWeight: 200 }}
              onClick={this.toggleLearnMore}
              className="btn  lightBtn"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
