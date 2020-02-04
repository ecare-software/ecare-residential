import React, { Component } from "react";

import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Button,
  ButtonToolbar
} from "react-bootstrap";

const navBarStyle = {
  backgroundColor: "maroon",
  color: "white"
};

const navBrandStyle = {
  color: "white",
  fontWeight: "400"
};

const navItemStyle = {
  color: "white"
};

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { firstName } = this.props.userObj;
    return (
      <Navbar fixed="top" collapseOnSelect expand="lg" style={navBarStyle}>
        <Navbar.Brand style={navBrandStyle} href="#home">
          e-Care Residential
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          <Nav.Link eventKey="link-1" style={navItemStyle} onClick={this.props.toggleDisplay.bind({}, "Dashboard")}>Dashboard</Nav.Link>
            <NavDropdown
              style={navItemStyle}
              variant="success"
              color="white"
              title="Submit a Form"
              id="collasible-nav-dropdown"
            >
              <NavDropdown.Item eventKey="link-2" onClick={this.props.toggleDisplay.bind({}, "TreatmentPlan72")}>72 Hour Treatment Plan</NavDropdown.Item>
              <NavDropdown.Item eventKey="link-3" onClick={this.props.toggleDisplay.bind({}, "IncidentReport")}>Incident Report</NavDropdown.Item>
              <NavDropdown.Item eventKey="link-4" onClick={this.props.toggleDisplay.bind({}, "DailyProgress")}>Daily Progress</NavDropdown.Item>
              <NavDropdown.Item eventKey="link-5" onClick={this.props.toggleDisplay.bind({}, "restraintReport")}>Restraint Report</NavDropdown.Item>
              {/* <NavDropdown.Divider /> */}
            </NavDropdown>
            <Nav.Link eventKey="link-6" onClick={this.props.toggleDisplay.bind({},"User Management")} style={navItemStyle}>User Management</Nav.Link>
            {/* <Nav.Link eventKey="link-7" onClick={this.props.toggleDisplay.bind({}, "Reports")} style={navItemStyle}>Reports</Nav.Link> */}
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
                <Nav.Link eventKey="link-8" >Manage Profile</Nav.Link>
              </NavDropdown>
              <Nav.Link eventKey="link-9" style={navItemStyle} onClick={this.props.logOut} >
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
