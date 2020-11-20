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
import Documents from "./components/Documents/Documents";
// import UserActions from "./components/UserActions/UserActions";
import ManageAccountContainer from "./components/ManageAccount/ManageAccountContainer";
//modals

//styles
import "./App.css";
import Fade from "react-reveal/Fade";
//modals

//const classes
const hideStyle = {
  display: "none",
};

const navNotSelected = {
  color: "#8000008a",
  padding: "0px 10px",
  fontFamily: "'Google Sans Display', Arial, Helvetica, sans-serif",
};

const navSelected = {
  backgroundColor: "rgb(128, 0, 0)",
  color: "white",
  borderRadius: "9px",
  padding: "0px 10px",
  fontFamily: "'Google Sans Display', Arial, Helvetica, sans-serif",
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
      // _id: "5d63507799ac0b1494149479",
    },
    messagesInitLoad: false,
    allUsersSet: false,
    errorModalMeta: {
      title: "",
      message: "",
    },
    doDisplay: "Dashboard",
    discussionMessages: [],
    allUsers: [
      // {
      //   email: "demarcuskennedy95@gmail.com",
      //   firstName: "DeMarcus",
      //   homeId: "home-1234",
      //   isAdmin: true,
      //   jobTitle: "Admin",
      //   lastLogIn: "2019-08-26T03:22:28.424Z",
      //   lastName: "Kennedy",
      //   newUser: true,
      //   password: "xyz123",
      //   __v: 0,
      //   _id: "5d63507799ac0b1494149479",
      // },
    ],
    showLearnMore: false,
    name: "",
    emailTo: "",
    emailSent: false,
    dmTo: null,
    blockCompUpdates: false,
    toUserSelected: null,
    dmMessage: "",
    messages: [
      // {
      //   _id: "5fa4702f61d127037b7a2062",
      //   toObj: {
      //     lastLogIn: "2020-11-05T21:28:31.095Z",
      //     isAdmin: true,
      //     newUser: false,
      //     _id: "5d63507799ac0b1494149479",
      //     firstName: "DeMarcus",
      //     lastName: "Kennedy",
      //     email: "demarcuskennedy95@gmail.com",
      //     password: "1234",
      //     homeId: "home-1234",
      //     jobTitle: "Admin",
      //     __v: 0,
      //   },
      //   fromObj: {
      //     lastLogIn: "2020-11-05T21:35:35.417Z",
      //     isAdmin: false,
      //     newUser: false,
      //     _id: "5d728d6a430b9f8536ac3381",
      //     firstName: "Yanira",
      //     middleName: "1",
      //     lastName: "Durant",
      //     email: "ya",
      //     password: "11",
      //     homeId: "home-1234",
      //     jobTitle: "Owner/CEO",
      //     __v: 0,
      //   },
      //   toID: "demarcuskennedy95@gmail.com",
      //   fromID: "ya",
      //   message: "Hello there",
      //   date: "2020-11-05T21:35:43.400Z",
      //   __v: 0,
      // },
      // {
      //   _id: "5fa4747d18291707ad592ad8",
      //   toObj: {
      //     lastLogIn: "2020-11-05T21:35:58.665Z",
      //     isAdmin: true,
      //     newUser: false,
      //     _id: "5d63507799ac0b1494149479",
      //     firstName: "DeMarcus",
      //     lastName: "Kennedy",
      //     email: "demarcuskennedy95@gmail.com",
      //     password: "1234",
      //     homeId: "home-1234",
      //     jobTitle: "Admin",
      //     __v: 0,
      //   },
      //   fromObj: {
      //     lastLogIn: "2020-11-05T21:53:51.942Z",
      //     isAdmin: false,
      //     newUser: false,
      //     _id: "5d728d6a430b9f8536ac3381",
      //     firstName: "Yanira",
      //     middleName: "1",
      //     lastName: "Durant",
      //     email: "ya",
      //     password: "11",
      //     homeId: "home-1234",
      //     jobTitle: "Owner/CEO",
      //     __v: 0,
      //   },
      //   toID: "demarcuskennedy95@gmail.com",
      //   fromID: "ya",
      //   message: "Whats good whats gooooooooood",
      //   date: "2020-11-05T21:54:05.916Z",
      //   __v: 0,
      // },
      // {
      //   _id: "5fa4749f18291707ad592ad9",
      //   toObj: {
      //     lastLogIn: "2020-11-05T21:35:58.665Z",
      //     isAdmin: true,
      //     newUser: false,
      //     _id: "5d63507799ac0b1494149479",
      //     firstName: "DeMarcus",
      //     lastName: "Kennedy",
      //     email: "demarcuskennedy95@gmail.com",
      //     password: "1234",
      //     homeId: "home-1234",
      //     jobTitle: "Admin",
      //     __v: 0,
      //   },
      //   fromObj: {
      //     lastLogIn: "2020-11-05T21:53:51.942Z",
      //     isAdmin: false,
      //     newUser: false,
      //     _id: "5d728d6a430b9f8536ac3381",
      //     firstName: "Yanira",
      //     middleName: "1",
      //     lastName: "Durant",
      //     email: "ya",
      //     password: "11",
      //     homeId: "home-1234",
      //     jobTitle: "Owner/CEO",
      //     __v: 0,
      //   },
      //   toID: "demarcuskennedy95@gmail.com",
      //   fromID: "ya",
      //   message: "Another test",
      //   date: "2020-11-05T21:54:39.807Z",
      //   __v: 0,
      // },
      // {
      //   _id: "5fa474ad18291707ad592ada",
      //   toObj: {
      //     lastLogIn: "2020-11-05T21:35:58.665Z",
      //     isAdmin: true,
      //     newUser: false,
      //     _id: "5d63507799ac0b1494149479",
      //     firstName: "DeMarcus",
      //     lastName: "Kennedy",
      //     email: "demarcuskennedy95@gmail.com",
      //     password: "1234",
      //     homeId: "home-1234",
      //     jobTitle: "Admin",
      //     __v: 0,
      //   },
      //   fromObj: {
      //     lastLogIn: "2020-11-05T21:53:51.942Z",
      //     isAdmin: false,
      //     newUser: false,
      //     _id: "5d728d6a430b9f8536ac3381",
      //     firstName: "Yanira",
      //     middleName: "1",
      //     lastName: "Durant",
      //     email: "ya",
      //     password: "11",
      //     homeId: "home-1234",
      //     jobTitle: "Owner/CEO",
      //     __v: 0,
      //   },
      //   toID: "demarcuskennedy95@gmail.com",
      //   fromID: "ya",
      //   message: "last test",
      //   date: "2020-11-05T21:54:53.715Z",
      //   __v: 0,
      // },
    ],
  };

  getMyMessages = () => {
    Axios.get("/api/directMessages/" + this.state.userObj.email).then(
      (messages) => {
        this.setState({ messages: messages.data });
      }
    );
  };

  setDmToUser = async (id) => {
    const selectedUser = this.state.allUsers.filter((user) => {
      return user._id === id;
    });

    // console.log(selectedUser);

    await this.setState({
      ...this.state,
      dmTo: selectedUser.length > 0 ? selectedUser[0] : null,
    });

    // console.log(this.state);
  };

  componentDidMount = async () => {
    console.log(cookie.load("appState"));
    let fromCookieState = cookie.load("appState");
    if (fromCookieState !== undefined) {
      await this.setState({
        userObj: fromCookieState.userObj,
        loggedIn: fromCookieState.loggedIn,
      });
    }
    await this.getMyMessages();
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
      .then(function (response) {
        curthis.setState({
          discussionMessages: response.data,
          messagesInitLoad: true,
        });
        // console.log(curthis.state.discussionMessages);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  appendMessage = (message) => {
    let curthis = this;
    let newMessage = {
      message: message,
      firstName: this.state.userObj.firstName,
      middleName: this.state.userObj.middleName,
      lastName: this.state.userObj.lastName,
      id: this.state.userObj._id,
      date: new Date().toISOString(),
    };

    Axios.post("/api/discussionMessages", newMessage)
      .then(function (response) {
        curthis.state.discussionMessages.unshift(newMessage);
        let discussionMessagesTmp = curthis.state.discussionMessages;
        curthis.setState({ discussionMessages: discussionMessagesTmp });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  showErrorModal = (title, message) => {
    this.setState({ message: message });
    this.setState({ title: title });
  };

  getAllUsers = () => {
    Axios.get("/api/users/" + this.state.userObj.homeId).then((allUsers) => {
      this.setState({ allUsers: allUsers.data, allUsersSet: true });
    });
  };

  logOut = () => {
    this.setState({
      ...this.state,
      loggedIn: false,
      userObj: {},
      doDisplay: "Dashboard",
      allUsersSet: false,
      blockCompUpdates: false,
    });
    cookie.remove("appState");
    window.scrollTo(0, 0);
  };

  scrollTop = () => {
    window.scrollTo(0, 0);
  };

  toggleLogIn = async (userObj) => {
    window.scrollTo(0, 0);
    let message = "";
    let title = "";
    if (userObj.newUser) {
      message =
        "You need to reset your password. Click the Manage Profile button to do so.";
      title = "Welcome to RCS, Heres some information";
    }
    await this.setState({
      userObj: userObj,
      loggedIn: true,
      message,
      title,
    });
    this.getMyMessages();
    this.getAllUsers();
    console.log("setCookie here");
    cookie.remove("appState");
    // console.log(this.state);
    let cookieToSet = JSON.parse(JSON.stringify(this.state));
    cookieToSet.discussionMessages = [];
    cookieToSet.allUsers = [];
    cookie.save("appState", cookieToSet);
  };

  toggleDisplay = (display) => {
    window.scrollTo(0, 0);
    this.setState({ doDisplay: display });
  };

  handleFieldInput = (event) => {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  };

  toggleLearnMore = () => {
    this.setState({
      showLearnMore: !this.state.showLearnMore,
      blockCompUpdates: !this.state.blockCompUpdates,
    });
  };

  sendEmail = () => {
    var thisHook = this;
    if (this.state.emailTo === "") {
      return;
    }
    thisHook.setState({ blockCompUpdates: true });
    Axios.post(`/api/email/${this.state.emailTo}/${this.state.name}`)
      .then(function (response) {
        thisHook.setState({
          name: "",
          emailTo: "",
          emailSent: true,
          showLearnMore: false,
        });
        setTimeout(() => {
          thisHook.setState({ emailSent: false });
          setTimeout(() => {
            thisHook.setState({ blockCompUpdates: false });
          }, 4000);
        }, 4000);
      })
      .catch(function (error) {
        alert("error sending email");
        console.log(error);
      });
  };

  sendDM = async () => {
    if (
      this.state.dmTo !== "" ||
      (this.state.dmTo !== null && this.state.dmMessage)
    ) {
      await Axios.post(`/api/directMessages`, {
        toObj: this.state.dmTo,
        fromObj: this.state.userObj,
        toID: this.state.dmTo.email,
        fromID: this.state.userObj.email,
        message: this.state.dmMessage,
        date: new Date(),
      });

      Axios.get("/api/directMessages/" + this.state.userObj.email).then(
        (messages) => {
          this.setState({
            ...this.state,
            dmMessage: "",
            messages: messages.data,
          });
        }
      );
    }
  };

  setDmMessage = (message) => {
    this.setState({ ...this.state, dmMessage: message });
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
                  appState={this.state}
                  setDmToUser={this.setDmToUser}
                  sendDM={this.sendDM}
                  dmMessage={this.state.dmMessage}
                  setDmMessage={this.setDmMessage}
                />
              </div>
              <div className="col-sm-9" id="actionSection">
                <div>
                  <ToggleScreen
                    name={this.state.doDisplay}
                    appState={this.state}
                    appendMessage={this.appendMessage}
                    toggleDisplay={this.toggleDisplay}
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
                    <button
                      onClick={this.toggleLearnMore}
                      className="btn darkBtn"
                    >
                      Request a Demo
                    </button>
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
                borderColor: "maroon",
                textAlign: "center",
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
        </div>
      );
    }
  }
}

function ToggleScreen({ name, appState, appendMessage, toggleDisplay }) {
  if (name === "Dashboard") {
    return (
      <div>
        <MessageBoard
          messages={appState.discussionMessages}
          appendMessage={appendMessage}
          toggleDisplay={toggleDisplay}
        />
      </div>
    );
  }

  if (name === "Documents") {
    return (
      <div>
        <Documents />
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
          messages={appState.messages}
          allUsers={appState.allUsers}
        />
      </div>
    );
  }
}

function DisplayExtra({
  name,
  userObj,
  scrollTop,
  appState,
  setDmToUser,
  sendDM,
  dmMessage,
  setDmMessage,
  toggleDisplay,
}) {
  if (name === "TreatmentPlan72") {
    return (
      <div id="extraInfo">
        <div className="extraInfoNavDiv">
          {/* <h5 className="extraInfoNavTitle">Treatment Plan 72</h5> */}
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

  if (name === "Documents") {
    return (
      <div id="extraInfo">
        {/* <div id="">
          <h4 className="extraInfoMainTitle">
            Documents
          </h4>
          <h6 className="extraInfoSubTitle">{userObj.jobTitle}</h6>
        </div> */}
        <div className="extraInfoNavDiv">
          {/* <h5 className="extraInfoNavTitle">Documents</h5> */}
          <p className="extraInfoNavSubTitle">
            <i>This is where you upload documents for everyone to see</i>
          </p>
        </div>
        <div className="extraInfoButtonDiv">
          {/* <button onClick={scrollTop} className="btn btn-light extraInfoButton">
            Upload Document 
          </button> */}
          <button className="btn btn-light extraInfoButton">
            Upload New File
          </button>
          {/* <button className="btn btn-light extraInfoButton">
            Direct Messages
          </button> */}
          {/* <button
            onClick={toggleDisplay.bind("", "Manage Account")}
            className="btn btn-light extraInfoButton"
          >
            Account Settings
          </button> */}
        </div>
      </div>
    );
  }

  if (name === "restraintReport") {
    return (
      <div id="extraInfo">
        <div className="extraInfoNavDiv">
          {/* <h5 className="extraInfoNavTitle">Restraint Report</h5> */}
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
          {/* <h5 className="extraInfoNavTitle">Daily Progress</h5> */}
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
          {/* <h5 className="extraInfoNavTitle">Incident Report</h5> */}
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
          {/* <h5 className="extraInfoNavTitle">Dashboard</h5> */}
          <p className="extraInfoNavSubTitle">
            <i>
              This is the first screen users will see when they log in. I feel
              this is alright for now.
            </i>
          </p>
        </div>
        <div className="extraInfoButtonDiv">
          <button
            onClick={() => {
              document.getElementById("messageText").focus();
              scrollTop();
            }}
            className="btn btn-light extraInfoButton"
          >
            Write Dashboard Message
          </button>
          <button
            onClick={() => {
              document.querySelector(".Direct-Message-nav").click();
              toggleDisplay("Direct Message");
            }}
            className="btn btn-light extraInfoButton"
          >
            Direct Messages
          </button>
          {/* <button className="btn btn-light extraInfoButton">
            Upload a File
          </button> */}
          {/* <button className="btn btn-light extraInfoButton">
            Direct Messages
          </button> */}
          {/* <button
            onClick={toggleDisplay.bind("", "Manage Account")}
            className="btn btn-light extraInfoButton"
          >
            Account Settings
          </button> */}
        </div>
      </div>
    );
  }

  if (name === "Manage Account") {
    return (
      <div id="extraInfo">
        <div className="extraInfoNavDiv">
          {/* <h5 className="extraInfoNavTitle" style={{ color: "maroon" }}>
            Manage User Information
          </h5> */}
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
          {/* <h5 className="extraInfoNavTitle" style={{ color: "maroon" }}>
            Direct Messages
          </h5> */}
          <p className="extraInfoNavSubTitle">
            Select a users and type your message
          </p>
          <div>
            <div style={{ width: "100%", display: "flex", margin: "10px 0px" }}>
              <p
                className="extraInfoNavSubTitle"
                style={{
                  width: "30px",
                  marginTop: "2px",
                }}
              >
                To:
              </p>
              <select
                style={{
                  flex: "1",
                  height: "30px",
                }}
                onChange={(e) => {
                  // console.log(e.target.value);
                  setDmToUser(e.target.value);
                }}
                defaultValue={appState.dmTo ? appState.dmTo : null}
              >
                <option selected value={null}>
                  Choose...
                </option>
                {appState.allUsers
                  .filter((user) => {
                    return user._id !== userObj._id;
                  })
                  .map((user) => {
                    return (
                      <option
                        key={user._id}
                        value={user._id}
                      >{`${user.firstName} ${user.lastName}`}</option>
                    );
                  })}
              </select>
            </div>
            <div style={{ width: "100%", margin: "10px 0px" }}>
              <textarea
                id="messageText"
                value={dmMessage}
                onChange={(e) => {
                  setDmMessage(e.target.value);
                }}
                cols="1"
                style={{
                  height: "150px",
                  width: "100%",
                  flex: "1",
                  borderColor: "#eee",
                  margin: "0px 5px",
                  resize: "none",
                  borderRight: "none",
                  borderTop: "none",
                  borderLeft: "none",
                }}
                placeholder="Type your message here.."
              ></textarea>
              <button
                onClick={() => {
                  sendDM();
                }}
                className="btn btn-light"
                style={{ margin: "0px 5px", width: "100%" }}
              >
                Send <i className="fas fa-paper-plane"></i>
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
          {/* <h5 className="extraInfoNavTitle" style={{ color: "maroon" }}>
            User Management
          </h5> */}
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
