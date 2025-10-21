import React from "react";
import LogInContiner from "../LogInContainer/LogInContainer";
import Modal from "react-bootstrap/Modal";
import FormAlert from "../Forms/FormAlert";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import Axios from "axios";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { isAdminUser } from "../../utils/AdminReportingRoles";
import { FormCountContext } from "../../context";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const navBarStyleNotLoggedIn = {
  backgroundColor: "maroon",
  color: "white",
};

const navBarStyleLoggedIn = {
  backgroundColor: "maroon",
  color: "white",
  webkitboxshadow: "0px 2px 7px -1px rgba(0, 0, 0, 0.75)",
  MozBoxShadow: "0px 2px 7px -1px rgba(0, 0, 0, 0.75)",
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
  // textShadow: "1px 1px 2px #000000",
};

const navItemStyle = {
  color: "white",
  paddingLeft: "5px",
  paddingRight: "5px",
};
const navItemStyleBig = {
  color: "white",
  paddingLeft: "20px",
  paddingRight: "20px",
  margin: "5px 5px",
  borderRadius: "12px",
  fontWeight: "600",
  border: "solid 1px white",
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

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state = {
      showLogIn: false,
      showLearnMore: false,
      emailTobs: "",
      namebs: "",
      organizationbs: "",
      emailSent: false,
      unreadMessageCount: 0
    };
  }

  openLogInModal = () => {
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
    Axios.post(
      `/api/email/${this.state.emailTobs}/${this.state.namebs}/${this.state.organizationbs ? this.state.organizationbs : "null"
      }`
    )
      .then(function (response) {
        thisHook.setState({
          namebs: "",
          emailTobs: "",
          organizationbs: "",
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

  toggleLearnMore = () => {
    this.setState({ showLearnMore: !this.state.showLearnMore });
  };

  showNoticeIcon = () => {
    let messageCountCookies = cookies.get(`messageCount-${this.props.appState.userObj.email}`);
    if (messageCountCookies) {
      if (this.props.appState.messages.length !== messageCountCookies) {
        // Return the count of unread messages
        return this.props.appState.messages.length - messageCountCookies;
      } else {
        return 0;
      }
    } else {
      const current = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(current.getFullYear() + 1);
      cookies.set(`messageCount-${this.props.appState.userObj.email}`, JSON.stringify(this.props.appState.messages.length), {
        expires: nextYear,
      });
      return 0;
    }
  }

  render() {
    let formContext = this.context;
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
          <Modal show={this.state.showLogIn}>
            <LogInContiner
              logIn={this.props.logIn}
              pos={{ position: "relati", top: "100%", top: "20vh" }}
              close={this.closeLogInModal}
            />
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
                  id="namebs"
                  onChange={this.handleFieldInput}
                  value={this.state.name}
                  style={{ width: "100%", margin: "15px 0px" }}
                  className="form-control"
                  placeholder="Name"
                />
                <input
                  id="organizationbs"
                  onChange={this.handleFieldInput}
                  value={this.state.organizationbs}
                  style={{ width: "100%", margin: "15px 0px" }}
                  className="form-control"
                  placeholder="Organization"
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
                    id='loginNavBtn'
                    eventKey="link-1"
                    style={navItemStyleBig}
                    className="nav-link-not-logged-in"
                    onClick={this.openLogInModal}
                  >
                    Log In
                  </Nav.Link>
                  {/* <Nav.Link
                    eventKey="link-3"
                    style={navItemStyleBigFill}
                    className="nav-link-not-logged-in-fill"
                    onClick={this.toggleLearnMore}
                  >
                    Learn More
                  </Nav.Link> */}
                </React.Fragment>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </React.Fragment>
      );
    }
    return (
      <FormCountContext.Consumer>
        {({ formConext, handleChange }) => (
          <Navbar
            fixed="top"
            variant="dark"
            collapseOnSelect
            expand="lg"
            style={navBarStyleLoggedIn}
          >
            <Navbar.Brand style={navBrandStyle}>
              e-Care Residential
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav defaultActiveKey="link-1" className="mr-auto">
                <Nav.Link
                  eventKey="link-1"
                  id="DashboardTab"
                  style={navItemStyle}
                  onClick={() => {
                    document
                      .querySelector(".Submit-a-Form-nav > a")
                      .classList.remove("active");
                    document
                      .querySelector(".Training-nav > a")
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
                      .querySelector(".Training-nav > a")
                      .classList.remove("active");
                    document
                      .querySelector(".Manage-Account-nav > a")
                      .classList.remove("active");
                    this.props.toggleDisplay("Direct Message");
                  }}
                >
                  Messages {this.showNoticeIcon() > 0 && <span
                    style={{
                      backgroundColor: "white",
                      borderRadius: "9px",
                      color: "#5e0000",
                      padding: "5px 10px",
                      margin: "0px 5px",
                    }}
                  >
                    {this.showNoticeIcon()}
                  </span>}
                </Nav.Link>
                <Nav.Link
                  eventKey="link-88"
                  style={navItemStyle}
                  onClick={() => {
                    document
                      .querySelector(".Submit-a-Form-nav > a")
                      .classList.remove("active");
                    document
                      .querySelector(".Training-nav > a")
                      .classList.remove("active");
                    document
                      .querySelector(".Manage-Account-nav > a")
                      .classList.remove("active");
                    this.props.toggleDisplay("Documents");
                  }}
                >
                  Documents
                </Nav.Link>
                <NavDropdown
                  style={navItemStyle}
                  variant="success"
                  color="white"
                  title="Forms"
                  id="collasible-nav-dropdown"
                  className="Submit-a-Form-nav"
                >
                  {isAdminUser(this.props.userObj) ? (
                    <NavDropdown.Item
                      eventKey="link-83"
                      onClick={() => {
                        document
                          .querySelector(".Submit-a-Form-nav > a")
                          .classList.add("active");
                        document
                          .querySelector(".Manage-Account-nav > a")
                          .classList.remove("active");
                        document
                          .querySelector(".Training-nav > a")
                          .classList.remove("active");
                        this.props.toggleDisplay("admissionAssessment");
                      }}
                    >
                      Admission Assessment
                    </NavDropdown.Item>
                  ) : (
                    <React.Fragment />
                  )}
                  {isAdminUser(this.props.userObj) ? (
                    <NavDropdown.Item
                      eventKey="link-2"
                      onClick={() => {
                        document
                          .querySelector(".Submit-a-Form-nav > a")
                          .classList.add("active");
                        document
                          .querySelector(".Manage-Account-nav > a")
                          .classList.remove("active");
                        document
                          .querySelector(".Training-nav > a")
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
                      document
                        .querySelector(".Training-nav > a")
                        .classList.remove("active");
                      this.props.toggleDisplay("IncidentReport");
                    }}
                  >
                    Incident Report
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    eventKey="link-3433"
                    onClick={() => {
                      document
                        .querySelector(".Submit-a-Form-nav > a")
                        .classList.add("active");
                      document
                        .querySelector(".Manage-Account-nav > a")
                        .classList.remove("active");
                      document
                        .querySelector(".Training-nav > a")
                        .classList.remove("active");
                      this.props.toggleDisplay("SeriousIncidentReport");
                    }}
                  >
                    Serious Incident Report
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
                      document
                        .querySelector(".Training-nav > a")
                        .classList.remove("active");
                      this.props.toggleDisplay("DailyProgress");
                    }}
                  >
                    Daily Progress
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    eventKey="link-942"
                    onClick={() => {
                      document
                        .querySelector(".Submit-a-Form-nav > a")
                        .classList.add("active");
                      document
                        .querySelector(".Manage-Account-nav > a")
                        .classList.remove("active");
                      document
                        .querySelector(".Training-nav > a")
                        .classList.remove("active");
                      this.props.toggleDisplay("DailyProgressTwo")
                    }}
                  >
                    Daily Progress Note Two
                  </NavDropdown.Item>  

                  <NavDropdown.Item
                    eventKey="link-24"
                    onClick={() => {
                      document
                        .querySelector(".Submit-a-Form-nav > a")
                        .classList.add("active");
                      document
                        .querySelector(".Manage-Account-nav > a")
                        .classList.remove("active");
                      document
                        .querySelector(".Training-nav > a")
                        .classList.remove("active");
                      this.props.toggleDisplay("bodyCheck");
                    }}
                  >
                    Health Body Check
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
                      document
                        .querySelector(".Training-nav > a")
                        .classList.remove("active");
                      this.props.toggleDisplay("restraintReport");
                    }}
                  >
                    Restraint Report
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    eventKey="link-882"
                    onClick={() => {
                      document
                        .querySelector(".Submit-a-Form-nav > a")
                        .classList.add("active");
                      document
                        .querySelector(".Manage-Account-nav > a")
                        .classList.remove("active");
                      document
                        .querySelector(".Training-nav > a")
                        .classList.remove("active");
                      this.props.toggleDisplay("IllnessInjury");
                    }}
                  >
                    Illness Injury
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    eventKey="link-812"
                    onClick={() => {
                      document
                        .querySelector(".Submit-a-Form-nav > a")
                        .classList.add("active");
                      document
                        .querySelector(".Manage-Account-nav > a")
                        .classList.remove("active");
                      document
                        .querySelector(".Training-nav > a")
                        .classList.remove("active");
                      this.props.toggleDisplay("AwakeNightStaffSignoff");
                    }}
                  >
                    Awake Night Staff Signoff
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    eventKey="link-8112"
                    onClick={() => {
                      document
                        .querySelector(".Submit-a-Form-nav > a")
                        .classList.add("active");
                      document
                        .querySelector(".Manage-Account-nav > a")
                        .classList.remove("active");
                      document
                        .querySelector(".Training-nav > a")
                        .classList.remove("active");
                      this.props.toggleDisplay("Night Monitoring");
                    }}
                  >
                    Awake Night Monitoring
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  style={navItemStyle}
                  variant="success"
                  color="white"
                  title="Training"
                  id="collasible-nav-dropdown"
                  className="Training-nav"
                >
                  <NavDropdown.Item
                    eventKey="link-7375"
                    onClick={() => {
                      document
                        .querySelector(".Training-nav > a")
                        .classList.add("active");
                      document
                        .querySelector(".Submit-a-Form-nav > a")
                        .classList.remove("active");
                      document
                        .querySelector(".Manage-Account-nav > a")
                        .classList.remove("active");
                      this.props.toggleDisplay("Annual Training");
                    }}
                  >
                    Annual Ongoing
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    eventKey="link-777"
                    onClick={() => {
                      document
                        .querySelector(".Training-nav > a")
                        .classList.add("active");
                      document
                        .querySelector(".Submit-a-Form-nav > a")
                        .classList.remove("active");
                      document
                        .querySelector(".Manage-Account-nav > a")
                        .classList.remove("active");
                      this.props.toggleDisplay("Orientation Training");
                    }}
                  >
                    Orientation
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    eventKey="link-2747"
                    onClick={() => {
                      document
                        .querySelector(".Training-nav > a")
                        .classList.add("active");
                      document
                        .querySelector(".Submit-a-Form-nav > a")
                        .classList.remove("active");
                      document
                        .querySelector(".Manage-Account-nav > a")
                        .classList.remove("active");
                      this.props.toggleDisplay("First aid CPR Training");
                    }}
                  >
                    First aid / CPR
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    eventKey="link-787"
                    onClick={() => {
                      document
                        .querySelector(".Training-nav > a")
                        .classList.add("active");
                      document
                        .querySelector(".Submit-a-Form-nav > a")
                        .classList.remove("active");
                      document
                        .querySelector(".Manage-Account-nav > a")
                        .classList.remove("active");
                      this.props.toggleDisplay("Pre Service Training");
                    }}
                  >
                    Pre-Service
                  </NavDropdown.Item>
                </NavDropdown>

                {isAdminUser(this.props.userObj) ? (
                  <Nav.Link
                    eventKey="link-7"
                    onClick={() => {
                      document
                        .querySelector(".Submit-a-Form-nav > a")
                        .classList.remove("active");
                      document
                        .querySelector(".Training-nav > a")
                        .classList.remove("active");
                      document
                        .querySelector(".Manage-Account-nav > a")
                        .classList.remove("active");
                      document
                        .querySelector(".Training-nav > a")
                        .classList.remove("active");
                      this.props.toggleDisplay("User Management");
                    }}
                    style={navItemStyle}
                  >
                    User Management
                  </Nav.Link>
                ) : null}
                <Nav.Link
                  eventKey="link-8"
                  id="ReportsTab"
                  onClick={() => {
                    document
                      .querySelector(".Submit-a-Form-nav > a")
                      .classList.remove("active");
                    document
                      .querySelector(".Training-nav > a")
                      .classList.remove("active");
                    document
                      .querySelector(".Manage-Account-nav > a")
                      .classList.remove("active");
                    this.props.toggleDisplay("Reports");
                  }}
                  style={navItemStyle}
                >
                  Reports{" "}
                  {this.props.appState.nonApprovedFormCountSet && (
                    <span
                      style={{
                        backgroundColor: "white",
                        borderRadius: "9px",
                        color: "#5e0000",
                        padding: "5px 10px",
                        margin: "0px 5px",
                      }}
                    >
                      {formContext.count}
                    </span>
                  )}
                </Nav.Link>
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
                        .querySelector(".Training-nav > a")
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
                  {isAdminUser(this.props.userObj) && (
                    <NavDropdown.Item
                      onClick={() => {
                        document
                          .querySelector(".Submit-a-Form-nav > a")
                          .classList.remove("active");
                        document
                          .querySelector(".Training-nav > a")
                          .classList.remove("active");
                        document
                          .querySelector(".nav-link")
                          .classList.remove("active");
                        document
                          .querySelector(".Manage-Account-nav > a")
                          .classList.add("active");
                        this.props.toggleDisplay("Clients");
                      }}
                      eventKey="link-1882"
                    >
                      Manage Clients
                    </NavDropdown.Item>
                  )}
                  {isAdminUser(this.props.userObj) && (
                    <NavDropdown.Item
                      onClick={() => {
                        document
                          .querySelector(".Submit-a-Form-nav > a")
                          .classList.remove("active");
                        document
                          .querySelector(".Training-nav > a")
                          .classList.remove("active");
                        document
                          .querySelector(".nav-link")
                          .classList.remove("active");
                        document
                          .querySelector(".Manage-Account-nav > a")
                          .classList.add("active");
                        this.props.toggleDisplay("manTraining");
                      }}
                      eventKey="link-1885"
                    >
                      Training Management
                    </NavDropdown.Item>
                  )}
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
        )}
      </FormCountContext.Consumer>
    );
  }
}

NavBar.contextType = FormCountContext;

export default NavBar;
