import React, { Component } from "react";
import LogInContiner from "../LogInContainer/LogInContainer";
import Modal from "react-bootstrap/Modal";
import FormAlert from "../Forms/FormAlert";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";
import ModalFooter from "react-bootstrap/ModalFooter";
import Axios from "axios";
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Button,
  ButtonToolbar,
} from "react-bootstrap";

const navBarStyleNotLoggedIn = {
  backgroundColor: "transparent",
  color: "white",
};

const navBarStyleLoggedIn = {
  backgroundColor: "maroon",
  color: "white",
  webkitBoxShadow: "0px 2px 7px -1px rgba(0, 0, 0, 0.75)",
  mozBoxShadow: "0px 2px 7px -1px rgba(0, 0, 0, 0.75)",
  boxShadow: "0px 2px 7px -1px rgba(0, 0, 0, 0.75)",
};

const navBrandStyle = {
  color: "white",
  fontWeight: "200",
};

const navBrandStyleNotLoggedIn = {
  color: "white",
  fontWeight: "300",
  paddingLeft: "20px",
  margin: "0px -5px",
  textShadow: "1px 1px 2px #000000",
};

const navItemStyle = {
  color: "white",
  paddingLeft: "5px",
  paddingRight: "5px",
};
const navItemStyleBig = {
  color: "black",
  paddingLeft: "20px",
  paddingRight: "20px",
  margin: "5px 5px",
  borderRadius: "9px",
  fontWeight: "500",
  border: "solid .5px white",
};

const navItemStyleBigFill = {
  color: "black",
  paddingLeft: "20px",
  paddingRight: "20px",
  margin: "5px 5px",
  borderRadius: "9px",
  fontWeight: "400",
  border: "solid .5px white",
};

const adminReportingRoles = [
  "Admin",
  "Owner/CEO",
  "Executive/Director",
  "Administrator",
  "Case/Manager",
  "Supervisor",
];

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state = {
      showLogIn: false,
      showLearnMore: false,
      emailTobs: "",
      namebs: "",
      emailSent: false,
    };
  }

  openLogInModal = () => {
    // console.log(document.getElementById("logInModal"));
    this.setState({ showLogIn: true });
  };

  closeLogInModal = () => {
    this.setState({ showLogIn: false });
  };

  scrollDown = () => {
    window.scrollTo(0, 500);
  };

  handleFieldInput = (event) => {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  };

  sendEmail = () => {
    var thisHook = this;
    if (this.state.emailTobs === "") {
      return;
    }
    Axios.post(`/api/email/${this.state.emailTobs}/${this.state.namebs}`)
      .then(function (response) {
        thisHook.setState({
          namebs: "",
          emailTobs: "",
          emailSent: true,
          showLearnMore: false,
        });
        setTimeout(() => {
          thisHook.setState({ emailSent: false, namebs: "", emailTobs: "" });
        }, 4000);
      })
      .catch(function (error) {
        alert("error sending email");
        console.log(error);
      });
  };

  toggleLearnMore = () => {
    this.setState({ showLearnMore: !this.state.showLearnMore });
  };

  toggleActive = () => {};

  render() {
    const { firstName } = this.props.userObj;
    if (!this.props.isLoggedIn) {
      return (
        <React.Fragment>
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
          <Modal show={this.state.showLogIn} onHide={!this.state.showLogIn}>
            <LogInContiner
              logIn={this.props.logIn}
              pos={{ position: "fixed", top: "100%", top: "20vh" }}
            />
            <button
              className="btn btn-default mobileAdj"
              style={{ position: "fixed", left: "28px", top: "20vh" }}
              variant="secondary"
              onClick={this.closeLogInModal}
            >
              x
            </button>
          </Modal>
          <Modal
            style={{ marginTop: "100px" }}
            show={this.state.showLearnMore}
            onHide={this.toggleLearnMore}
          >
            <ModalHeader
              closeButton
              style={{
                color: "maroon",
                textAlign: "center",
                borderColor: "maroon",
              }}
            >
              <h5>Learn more about our services</h5>
            </ModalHeader>
            <ModalBody>
              <div className="form-group">
                <p>
                  Complete the form below to get a personalized email describing
                  the services offered.
                </p>
                <input
                  id="namebs"
                  onChange={this.handleFieldInput}
                  value={this.state.name}
                  style={{ width: "100%", margin: "15px 0px" }}
                  className="form-control"
                  placeholder="Name / Organization"
                />
                <input
                  id="emailTobs"
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
          <Navbar
            fixed="top"
            variant="dark"
            collapseOnSelect
            expand="lg"
            style={navBarStyleNotLoggedIn}
          >
            <Navbar.Brand style={navBrandStyleNotLoggedIn}>
              e-Care Residential
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav defaultActiveKey="link-1" className="mr-auto"></Nav>
              <Nav className="ml-auto">
                <React.Fragment>
                  <Nav.Link
                    eventKey="link-1"
                    style={navItemStyleBig}
                    className="nav-link-not-logged-in"
                    onClick={this.openLogInModal}
                  >
                    Log In
                  </Nav.Link>
                  <Nav.Link
                    eventKey="link-3"
                    style={navItemStyleBigFill}
                    className="nav-link-not-logged-in-fill"
                    onClick={this.toggleLearnMore}
                  >
                    Learn More
                  </Nav.Link>
                </React.Fragment>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </React.Fragment>
      );
    }
    return (
      <Navbar
        fixed="top"
        variant="dark"
        collapseOnSelect
        expand="lg"
        style={navBarStyleLoggedIn}
      >
        <Navbar.Brand style={navBrandStyle}>e-Care Residential</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav defaultActiveKey="link-1" className="mr-auto">
            <Nav.Link
              eventKey="link-1"
              style={navItemStyle}
              onClick={() => {
                document
                  .querySelector(".Submit-a-Form-nav > a")
                  .classList.remove("active");
                document
                  .querySelector(".Manage-Account-nav > a")
                  .classList.remove("active");
                this.props.toggleDisplay("Dashboard");
              }}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              eventKey="link-44"
              id="Direct-Message-nav"
              className="Direct-Message-nav"
              style={navItemStyle}
              onClick={() => {
                document
                  .querySelector(".Submit-a-Form-nav > a")
                  .classList.remove("active");
                document
                  .querySelector(".Manage-Account-nav > a")
                  .classList.remove("active");
                this.props.toggleDisplay("Direct Message");
              }}
            >
              Messages
            </Nav.Link>
            {/* <Nav.Link
              eventKey="link-88"
              style={navItemStyle}
              onClick={() => {
                document
                  .querySelector(".Submit-a-Form-nav > a")
                  .classList.remove("active");
                document
                  .querySelector(".Manage-Account-nav > a")
                  .classList.remove("active");
                this.props.toggleDisplay("Documents");
              }}
            >
              Documents
            </Nav.Link> */}
            <NavDropdown
              style={navItemStyle}
              variant="success"
              color="white"
              title="Submit a Form"
              id="collasible-nav-dropdown"
              className="Submit-a-Form-nav"
            >
              {adminReportingRoles.includes(this.props.userObj.jobTitle) ? (
                <NavDropdown.Item
                  eventKey="link-2"
                  onClick={() => {
                    document
                      .querySelector(".Submit-a-Form-nav > a")
                      .classList.add("active");
                    document
                      .querySelector(".Manage-Account-nav > a")
                      .classList.remove("active");
                    this.props.toggleDisplay("TreatmentPlan72");
                  }}
                >
                  72 Hour Treatment Plan
                </NavDropdown.Item>
              ) : (
                <React.Fragment />
              )}
              <NavDropdown.Item
                eventKey="link-3"
                onClick={() => {
                  document
                    .querySelector(".Submit-a-Form-nav > a")
                    .classList.add("active");
                  document
                    .querySelector(".Manage-Account-nav > a")
                    .classList.remove("active");
                  this.props.toggleDisplay("IncidentReport");
                }}
              >
                Incident Report
              </NavDropdown.Item>
              <NavDropdown.Item
                eventKey="link-4"
                onClick={() => {
                  document
                    .querySelector(".Submit-a-Form-nav > a")
                    .classList.add("active");
                  document
                    .querySelector(".Manage-Account-nav > a")
                    .classList.remove("active");
                  this.props.toggleDisplay("DailyProgress");
                }}
              >
                Daily Progress
              </NavDropdown.Item>
              <NavDropdown.Item
                eventKey="link-5"
                onClick={() => {
                  document
                    .querySelector(".Submit-a-Form-nav > a")
                    .classList.add("active");
                  document
                    .querySelector(".Manage-Account-nav > a")
                    .classList.remove("active");
                  this.props.toggleDisplay("restraintReport");
                }}
              >
                Restraint Report
              </NavDropdown.Item>
              {/* <NavDropdown.Divider /> */}
            </NavDropdown>
            {adminReportingRoles.includes(this.props.userObj.jobTitle) ? (
              <Nav.Link
                eventKey="link-7"
                onClick={() => {
                  document
                    .querySelector(".Submit-a-Form-nav > a")
                    .classList.remove("active");
                  document
                    .querySelector(".Manage-Account-nav > a")
                    .classList.remove("active");
                  this.props.toggleDisplay("User Management");
                }}
                style={navItemStyle}
              >
                User Management
              </Nav.Link>
            ) : null}
            {/* {adminReportingRoles.includes(this.props.userObj.jobTitle) ? ( */}
            <Nav.Link
              eventKey="link-8"
              onClick={() => {
                document
                  .querySelector(".Submit-a-Form-nav > a")
                  .classList.remove("active");
                document
                  .querySelector(".Manage-Account-nav > a")
                  .classList.remove("active");
                this.props.toggleDisplay("Reports");
              }}
              style={navItemStyle}
            >
              Reports
            </Nav.Link>
            {/* ) : (
              <React.Fragment></React.Fragment>
            )} */}
          </Nav>
          <Nav className="ml-auto">
            <NavDropdown
              style={navItemStyle}
              variant="success"
              color="white"
              title={firstName}
              id="collasible-nav-dropdown2"
              className="Manage-Account-nav"
            >
              <NavDropdown.Item
                onClick={() => {
                  document
                    .querySelector(".Submit-a-Form-nav > a")
                    .classList.remove("active");
                  document
                    .querySelector(".nav-link")
                    .classList.remove("active");
                  document
                    .querySelector(".Manage-Account-nav > a")
                    .classList.add("active");
                  this.props.toggleDisplay("Manage Account");
                }}
                eventKey="link-11"
              >
                Manage Profile
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              eventKey="link-9"
              style={navItemStyle}
              onClick={this.props.logOut}
            >
              Log out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
