import React, { Component } from "react";
import Axios from "axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import cookie from "react-cookies";
//components
import Header from "./components/Header/Header";
import LogInContiner from "./components/LogInContainer/LogInContainer";
// import Testimonial from "./components/Testimonial/Testimonial.js";
import TreatmentPlan72 from "./components/Forms/TreatmentPlan72";
import IncidentReport from "./components/Forms/IncidentReport";
import RestraintReport from "./components/Forms/RestraintReport";
import DailyProgress from "./components/Forms/DailyProgressAndActivity";
import MessageBoard from "./components/MessageBoard/MessageBoard";
import Reports from "./components/Reports/ReportsContainer";
import UserManagement from "./components/UserManagement/UserManagement";
import BSNavBar from "./components/NavBar/bsNavBar";
import DirectMessageBoard from "./components/DirectMessageBoard/DirectMessageBoard";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";
import ModalFooter from "react-bootstrap/ModalFooter";
import FormAlert from "./components/Forms/FormAlert";
// import UserActions from "./components/UserActions/UserActions";
import ManageAccountContainer from "./components/ManageAccount/ManageAccountContainer";
//modals

//styles
import "./App.css";
import Fade from "react-reveal/Fade";
//modals

//const classes
const hideStyle = {
  display: "none"
};

const navNotSelected = {
  color: "#8000008a",
  padding: "0px 10px",
  fontFamily: "'Google Sans Display', Arial, Helvetica, sans-serif"
};

const navSelected = {
  backgroundColor: "rgb(128, 0, 0)",
  color: "white",
  borderRadius: "9px",
  padding: "0px 10px",
  fontFamily: "'Google Sans Display', Arial, Helvetica, sans-serif"
};

class App extends Component {
  state = {
    loggedIn: false,
    userObj: {
      // email: "demarcuskennedy95@gmail.com",
      // firstName: "DeMarcus",
      // homeId: "home-1234",
      // isAdmin: true,
      // jobTitle: "Admin",
      // lastLogIn: "2019-08-26T03:22:28.424Z",
      // lastName: "Kennedy",
      // newUser: true,
      // password: "xyz123",
      // __v: 0,
      // _id: "5d63507799ac0b1494149479"
    },
    messagesInitLoad: false,
    allUsersSet: false,
    errorModalMeta: {
      title: "",
      message: ""
    },
    doDisplay: "Dashboard",
    discussionMessages: [],
    allUsers: [],
    showLearnMore: false,
    name: "",
    emailTo: "",
    emailSent: false,
    blockCompUpdates:false
  };

  getMyMessages = () => {};

  componentDidMount = () => {
    console.log(cookie.load("appState"));
    let fromCookieState = cookie.load("appState");
    if (fromCookieState !== undefined) {
      this.setState({
        userObj: fromCookieState.userObj,
        loggedIn: fromCookieState.loggedIn
      });
    }
  };

  componentDidUpdate = () => {
    if (!this.state.allUsersSet && !this.state.blockCompUpdates) {
      this.getAllUsers();
    }

    if (!this.state.messagesInitLoad && !this.state.blockCompUpdates) {
      this.loadMessage();
    }
  };

  loadMessage = () => {
    let curthis = this;
    Axios.get("/api/discussionMessages")
      .then(function(response) {
        curthis.setState({
          discussionMessages: response.data,
          messagesInitLoad: true
        });
        console.log(curthis.state.discussionMessages);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  appendMessage = message => {
    let curthis = this;
    let newMessage = {
      message: message,
      firstName: this.state.userObj.firstName,
      middleName: this.state.userObj.middleName,
      lastName: this.state.userObj.lastName,
      id: this.state.userObj._id,
      date: new Date().toISOString()
    };

    Axios.post("/api/discussionMessages", newMessage)
      .then(function(response) {
        curthis.state.discussionMessages.unshift(newMessage);
        let discussionMessagesTmp = curthis.state.discussionMessages;
        curthis.setState({ discussionMessages: discussionMessagesTmp });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  showErrorModal = (title, message) => {
    this.setState({ message: message });
    this.setState({ title: title });
  };

  getAllUsers = () => {
    Axios.get("/api/users/" + this.state.userObj.homeId).then(allUsers => {
      this.setState({ allUsers: allUsers.data, allUsersSet: true });
    });
  };

  logOut = () => {
    this.setState({ loggedIn: false });
    this.setState({ userObj: {} });
    this.setState({ doDisplay: "Dashboard" });
    cookie.remove("appState");
    window.scrollTo(0, 0);
  };

  scrollTop = () => {
    window.scrollTo(0, 0);
  };

  toggleLogIn = userObj => {
    window.scrollTo(0, 0);
    let message = "";
    let title = "";
    if (userObj.newUser) {
      message =
        "You need to reset your password. Click the Manage Profile button to do so.";
      title = "Welcome to RCS, Heres some information";
    }
    this.setState({
      userObj: userObj,
      loggedIn: true,
      message,
      title
    });
    console.log("setCookie here");
    cookie.remove("appState");
    console.log(this.state);
    let cookieToSet = JSON.parse(JSON.stringify(this.state));
    cookieToSet.discussionMessages = [];
    cookieToSet.allUsers = [];
    cookie.save("appState", cookieToSet);
  };

  toggleDisplay = display => {
    window.scrollTo(0, 0);
    this.setState({ doDisplay: display });
  };

  handleFieldInput = event => {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  };

  toggleLearnMore = () =>{
    this.setState({showLearnMore:!this.state.showLearnMore,blockCompUpdates:!this.state.blockCompUpdates});
  }

  sendEmail = () => {
    var thisHook = this;
    if (this.state.emailTo === "") {
      return;
    }
    thisHook.setState({blockCompUpdates:true});
    Axios.post(`/api/email/${this.state.emailTo}/${this.state.name}`)
      .then(function(response) {
        thisHook.setState({
          name: "",
          emailTo: "",
          emailSent: true,
          showLearnMore: false
        });
        setTimeout(() => {
          thisHook.setState({ emailSent: false});
          setTimeout(() => {
            thisHook.setState({blockCompUpdates:false });
          }, 4000);
        }, 4000);
      })
      .catch(function(error) {
        alert("error sending email");
        console.log(error);
      });
  };

  render() {
    if (this.state.loggedIn) {
      return (
        <div className="App container" id="mainContainer">
          <BSNavBar
            logOut={this.logOut}
            toggleDisplay={this.toggleDisplay}
            isLoggedIn={this.state.loggedIn}
            userObj={this.state.userObj}
          ></BSNavBar>
          {this.state.doDisplay !== "Reports" ? (
            <div id="desktopView" className="row">
              <div className="col-sm-3">
                <DisplayExtra
                  name={this.state.doDisplay}
                  userObj={this.state.userObj}
                  scrollTop={this.scrollTop}
                  toggleDisplay={this.toggleDisplay}
                />
              </div>
              <div className="col-sm-9" id="actionSection">
                <div>
                  <ToggleScreen
                    name={this.state.doDisplay}
                    appState={this.state}
                    appendMessage={this.appendMessage}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div id="desktopView" className="row">
              <div
                className="col-md-12"
                style={
                  this.state.doDisplay === "Reports"
                    ? { marginBottom: "150px 0px" }
                    : hideStyle
                }
              >
                <Reports userObj={this.state.userObj} />
              </div>
            </div>
          )}
          {/* <UserActions/> */}
        </div>
      );
    } else {
      return (
        <div className="App">
          <BSNavBar
            logOut={this.logOut}
            logIn={this.toggleLogIn}
            toggleDisplay={this.toggleDisplay}
            isLoggedIn={this.state.loggedIn}
            userObj={this.state.userObj}
          ></BSNavBar>
          <Header logIn={this.toggleLogIn} />
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
          {/* <LogInContiner id="desktopLogin" logIn={this.toggleLogIn} /> */}
          {/* Body Start */}
          <div className="container-fluid" id="greetingContainer">
            <div className="row" id="greetingRow">
              <div className="col-sm-7" id="greetingColRight">
                <div id="greetingRowRight">
                  <div id="greetingRowRightHeaderContainer">
                    <h1 id="greetingRowRightHeader">
                      Who we are and <br /> what we do
                    </h1>
                  </div>

                  <div id="greetingRowRightPContainer">
                    <p id="greetingRowRightP">
                      Health care, health-care, or healthcare is the maintenance
                      or improvement of health via the prevention, diagnosis,
                      and treatment of disease, illness, injury, and other
                      physical and mental impairments in people. Health care is
                      delivered by health professionals in allied health fields.
                    </p>
                  </div>
                  <div id="greetingRowRightBtnContainer">
                    <button onClick={this.toggleLearnMore} className="btn darkBtn">Request a Demo</button>
                  </div>
                </div>
              </div>
              <div className="col-sm-5" id="iPhoneContainer">
                <Fade bottom>
                  <div id="homeiPhone" />
                </Fade>
              </div>
            </div>
          </div>
          <Modal show={this.state.showLearnMore} onHide={this.toggleLearnMore}>
            <ModalHeader
              closeButton
              style={{
                color: "maroon",
                borderColor:"maroon",
                textAlign: "center"
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
                  id="name"
                  onChange={this.handleFieldInput}
                  value={this.state.name}
                  style={{ width: "100%", margin: "15px 0px" }}
                  className="form-control"
                  placeholder="Name / Organization"
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
                    color: "white"
                  }}
                  onClick={this.sendEmail}
                  className="btn"
                >
                  Submit
                </button>
              </div>
            </ModalBody>
          </Modal>
        </div>
      );
    }
  }
}

function ToggleScreen({ name, appState, appendMessage }) {
  if (name === "Dashboard") {
    return (
      <div>
        <MessageBoard
          messages={appState.discussionMessages}
          appendMessage={appendMessage}
        />
      </div>
    );
  }

  if (name === "User Management") {
    return (
      <div>
        <UserManagement
          userObj={appState.userObj}
          allUsers={appState.allUsers}
        />
      </div>
    );
  }

  if (name === "TreatmentPlan72") {
    return (
      <div>
        <TreatmentPlan72
          valuesSet={false}
          userObj={appState.userObj}
          id="treatment"
        />
      </div>
    );
  }

  if (name === "IncidentReport") {
    return (
      <div>
        <IncidentReport
          valuesSet={false}
          userObj={appState.userObj}
          id="incident"
        />
      </div>
    );
  }

  if (name === "DailyProgress") {
    return (
      <div>
        <DailyProgress
          valuesSet={false}
          userObj={appState.userObj}
          id="dailyProgress"
        />
      </div>
    );
  }

  if (name === "restraintReport") {
    return (
      <div>
        <RestraintReport
          valuesSet={false}
          userObj={appState.userObj}
          id="restraintReport"
        />
      </div>
    );
  }

  if (name === "Manage Account") {
    return (
      <div>
        <ManageAccountContainer userObj={appState.userObj} />
      </div>
    );
  }

  if (name === "Direct Message") {
    return (
      <div>
        <DirectMessageBoard
          userObj={appState.userObj}
          messages={appState.discussionMessages}
        />
      </div>
    );
  }
}

function DisplayExtra({ name, userObj, scrollTop, toggleDisplay }) {
  if (name === "TreatmentPlan72") {
    return (
      <div id="extraInfo">
        <div className="extraInfoNavDiv">
          <h5 className="extraInfoNavTitle">Treatment Plan 72</h5>
          <p className="extraInfoNavSubTitle">
            This is what the must be filled out when a child is first admitted
            to the facility.
          </p>
          <p className="extraInfoNavSubTitle">
            Required fields include, Child Name, Child DOA, Child Date of Birth,
            and thing like that.
          </p>
        </div>
      </div>
    );
  }

  if (name === "restraintReport") {
    return (
      <div id="extraInfo">
        <div className="extraInfoNavDiv">
          <h5 className="extraInfoNavTitle">Restraint Report</h5>
          <p className="extraInfoNavSubTitle">
            If a child had to be restrained, file this form, notationg what
            happened to cause this action.
          </p>
        </div>
      </div>
    );
  }

  if (name === "DailyProgress") {
    return (
      <div id="extraInfo">
        <div className="extraInfoNavDiv">
          <h5 className="extraInfoNavTitle">Daily Progress</h5>
          <p className="extraInfoNavSubTitle">
            This explains what the child has done today or what the child will
            do today.
          </p>
        </div>
      </div>
    );
  }

  if (name === "IncidentReport") {
    return (
      <div id="extraInfo">
        <div className="extraInfoNavDiv">
          <h5 className="extraInfoNavTitle">Incident Report</h5>
          <p className="extraInfoNavSubTitle">
            When an incident happens, this must be filled out in order to keep
            track of what exactly happend.
          </p>
        </div>
      </div>
    );
  }

  if (name === "Dashboard") {
    return (
      <div id="extraInfo">
        <div id="">
          <h4 className="extraInfoMainTitle">
            {userObj.firstName + " " + userObj.lastName}
          </h4>
          <h6 className="extraInfoSubTitle">{userObj.jobTitle}</h6>
        </div>
        <div className="extraInfoNavDiv">
          <h5 className="extraInfoNavTitle">Dashboard</h5>
          <p className="extraInfoNavSubTitle">
            <i>
              This is the first screen users will see when they log in. I feel
              this is alright for now.
            </i>
          </p>
        </div>
        <div className="extraInfoButtonDiv">
          <button onClick={scrollTop} className="btn btn-light extraInfoButton">
            Write Dashboard Message
          </button>
          <button onClick={scrollTop} className="btn btn-light extraInfoButton">
            Upload Document 
          </button>
          {/* <button  className="btn btn-light extraInfoButton">
            Upload a File
          </button> */}
          {/* <button className="btn btn-light extraInfoButton">
            Direct Messages
          </button> */}
          <button
            onClick={toggleDisplay.bind("", "Manage Account")}
            className="btn btn-light extraInfoButton"
          >
            Account Settings
          </button>
        </div>
      </div>
    );
  }

  if (name === "Manage Account") {
    return (
      <div id="extraInfo">
        <div className="extraInfoNavDiv">
          <h5 className="extraInfoNavTitle" style={{ color: "maroon" }}>
            Manage User Information
          </h5>
          <p className="extraInfoNavSubTitle">
            Allows users to view account information and update their password.
          </p>
        </div>
      </div>
    );
  }

  if (name === "Direct Message") {
    return (
      <div id="extraInfo">
        <div className="extraInfoNavDiv">
          <h5 className="extraInfoNavTitle" style={{ color: "maroon" }}>
            Direct Messages
          </h5>
          <p className="extraInfoNavSubTitle">This is me sending a DM</p>
          <div>
            <div style={{ width: "100%", display: "flex", margin: "10px 0px" }}>
              <p
                className="extraInfoNavSubTitle"
                style={{
                  width: "30px",
                  marginTop: "2px"
                }}
              >
                To:
              </p>
              <select
                style={{
                  flex: "1",
                  height: "30px"
                }}
              >
                <option disabled selected>
                  Choose...
                </option>
                <option>Some person</option>
                <option>Anotha one</option>
              </select>
            </div>
            <div style={{ width: "100%", display: "flex", margin: "10px 0px" }}>
              <textarea
                id="messageText"
                // xvalue={this.state.messageText}
                // xonChange={this.handleFieldInput}
                cols="1"
                style={{
                  height: "40px",
                  flex: "1",
                  borderColor: "#eee",
                  margin: "0px 5px",
                  resize: "none",
                  borderRight: "none",
                  borderTop: "none",
                  borderLeft: "none"
                }}
                placeholder="Whats on your mind ?"
              ></textarea>
              <button
                // xonClick={this.callAppendMessage}
                className="btn btn-light"
                style={{ margin: "0px 5px", width: "40px" }}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (name === "User Management") {
    return (
      <div id="extraInfo">
        <div className="extraInfoNavDiv">
          <h5 className="extraInfoNavTitle" style={{ color: "maroon" }}>
            User Management
          </h5>
          <p className="extraInfoNavSubTitle">
            Allows Admin users the ability to view information about their home
            as well create new and modify exiting staff members.
          </p>
        </div>
      </div>
    );
  } else {
    return <React.Fragment />;
  }
}

export default App;
