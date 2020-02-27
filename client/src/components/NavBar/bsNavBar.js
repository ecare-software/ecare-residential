import React, { Component } from "react";
import LogInContiner from "../LogInContainer/LogInContainer";
import Modal from "react-bootstrap/Modal";
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Button,
  ButtonToolbar
} from "react-bootstrap";

const navBarStyleNotLoggedIn = {
  backgroundColor: "transparent",
  color: "white"
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
  fontWeight: "200"
};

const navBrandStyleNotLoggedIn = {
  color: "white",
  fontWeight: "300",
  paddingLeft: "20px",
  margin:"0px -5px"
};

const navItemStyle = {
  color: "white",
  paddingLeft: "5px",
  paddingRight: "5px"
};
const navItemStyleBig = {
  color: "black",
  paddingLeft: "20px",
  paddingRight: "20px",
  margin:"5px 5px",
  borderRadius:"9px",
  fontWeight:"500",
  border:"solid .5px white"
};

const navItemStyleBigFill = {
  color: "black",
  paddingLeft: "20px",
  paddingRight: "20px",
  margin:"5px 5px",
  borderRadius:"9px",
  fontWeight:"400",
  border:"solid .5px white"
};

const adminReportingRoles = [
  "Admin",
  "Owner_-_CEO",
  "Executive_Director",
  "Administrator",
  "Case_Manager",
  "Supervisor"
];

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state = { showLogIn: false };
  }

  openLogInModal = () => {
    // console.log(document.getElementById("logInModal"));
    this.setState({ showLogIn: true });
  };

  closeLogInModal = () => {
    this.setState({ showLogIn: false });
  };

  render() {
    const { firstName } = this.props.userObj;
    if(!this.props.isLoggedIn){
      return (
        <React.Fragment>
        <Modal show={this.state.showLogIn} onHide={!this.state.showLogIn}>
          <LogInContiner
            logIn={this.props.logIn}
            pos={{ position: "fixed", top: "100%",top:"200px" }}
          />
          <button
            className="btn btn-default"
            style={{ position: "fixed",left:"28px",top:"201px" }}
            variant="secondary"
            onClick={this.closeLogInModal}
          >
            x
          </button>
        </Modal>
        <Navbar fixed="top" variant="dark" collapseOnSelect expand="lg" style={navBarStyleNotLoggedIn}>
          <Navbar.Brand style={navBrandStyleNotLoggedIn}>
            e-Care Residential
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav defaultActiveKey="link-1" className="mr-auto">
            </Nav>
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
                  eventKey="link-2"
                  style={navItemStyleBig}
                  className="nav-link-not-logged-in"
                >
                  Sign Up
                </Nav.Link>
                <Nav.Link
                  eventKey="link-3"
                  style={navItemStyleBigFill}
                  className="nav-link-not-logged-in-fill"
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
      <Navbar fixed="top" variant="dark" collapseOnSelect expand="lg" style={navBarStyleLoggedIn}>
        <Navbar.Brand style={navBrandStyle}>
          e-Care Residential
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav defaultActiveKey="link-1" className="mr-auto">
            <Nav.Link
              eventKey="link-1"
              style={navItemStyle}
              onClick={this.props.toggleDisplay.bind({}, "Dashboard")}
            >
              Dashboard
            </Nav.Link>
            <NavDropdown
              style={navItemStyle}
              variant="success"
              color="white"
              title="Submit a Form"
              id="collasible-nav-dropdown"
            >
              {adminReportingRoles.includes(this.props.userObj.jobTitle) ? (
                <NavDropdown.Item
                  eventKey="link-2"
                  onClick={this.props.toggleDisplay.bind({}, "TreatmentPlan72")}
                >
                  72 Hour Treatment Plan
                </NavDropdown.Item>
              ) : (
                <React.Fragment />
              )}
              <NavDropdown.Item
                eventKey="link-3"
                onClick={this.props.toggleDisplay.bind({}, "IncidentReport")}
              >
                Incident Report
              </NavDropdown.Item>
              <NavDropdown.Item
                eventKey="link-4"
                onClick={this.props.toggleDisplay.bind({}, "DailyProgress")}
              >
                Daily Progress
              </NavDropdown.Item>
              <NavDropdown.Item
                eventKey="link-5"
                onClick={this.props.toggleDisplay.bind({}, "restraintReport")}
              >
                Restraint Report
              </NavDropdown.Item>
              {/* <NavDropdown.Divider /> */}
            </NavDropdown>
            <Nav.Link
                eventKey="link-6"
                onClick={this.props.toggleDisplay.bind({}, "Direct Message")}
                style={navItemStyle}
              >
                Direct Message
              </Nav.Link>
            <Nav.Link
              eventKey="link-7"
              onClick={this.props.toggleDisplay.bind({}, "User Management")}
              style={navItemStyle}
            >
              User Management
            </Nav.Link>
            {adminReportingRoles.includes(this.props.userObj.jobTitle) ? (
              <Nav.Link
                eventKey="link-8"
                onClick={this.props.toggleDisplay.bind({}, "Reports")}
                style={navItemStyle}
              >
                Reports
              </Nav.Link>
            ) : (
              <React.Fragment></React.Fragment>
            )}
          </Nav>
          <Nav className="ml-auto">
            <React.Fragment>
              <NavDropdown
                style={navItemStyle}
                variant="success"
                color="white"
                title={firstName}
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item onClick={this.props.toggleDisplay.bind({}, "Manage Account")}  eventKey="link-8">Manage Profile</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link
                eventKey="link-9"
                style={navItemStyle}
                onClick={this.props.logOut}
              >
                Log out
              </Nav.Link>
            </React.Fragment>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
