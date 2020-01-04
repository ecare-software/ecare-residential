import React, { Component } from "react";
import Axios from "axios";
//components
import Header from "./components/Header/Header";
//styles
import "./App.css";
import Fade from "react-reveal/Fade";
//modals
//apis

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
    discussionMessages: []
  };

  componentDidUpdate = () => {
    if (this.state.userObj.isAdmin && !this.state.allUsersSet) {
      this.getAllUsers();
      console.log("test");
    }

    // if(!this.state.messagesInitLoad){
    //   this.loadMessage();
    // }
  };

  // loadMessage = () => {
  //   let curthis = this;
  //   Axios.get("/api/discussionMessages")
  //   .then(function(response) {
  //     curthis.setState({discussionMessages:response.data,messagesInitLoad:true});
  //     console.log(curthis.state.discussionMessages);
  //   })
  //   .catch(function(error) {
  //     console.log(error);
  //   });
  // };

  // appendMessage = message => {
  //   let curthis = this;
  //   let newMessage = {
  //     message: message,
  //     firstName: this.state.userObj.firstName,
  //     middleName: this.state.userObj.middleName,
  //     lastName: this.state.userObj.lastName,
  //     id: this.state.userObj._id,
  //     date: new Date().toISOString()
  //   };

  //   Axios.post("/api/discussionMessages", newMessage)
  //     .then(function(response) {
  //       curthis.state.discussionMessages.unshift(newMessage);
  //       let discussionMessagesTmp = curthis.state.discussionMessages;
  //       curthis.setState({discussionMessages:discussionMessagesTmp});
  //     })
  //     .catch(function(error) {
  //       console.log(error);
  //     });
  // };

  // showErrorModal = (title, message) => {
  //   this.setState({ message: message });
  //   this.setState({ title: title });
  //   document.getElementById("errorModalBtn").click();
  // };

  getAllUsers = () => {
    Axios.get("/api/users/" + this.state.userObj.homeId).then(allUsers => {
      this.setState({ allUsers: allUsers.data, allUsersSet: true });
    });
  };

  logOut = () => {
    this.setState({ loggedIn: false });
    this.setState({ userObj: {} });
    this.setState({ doDisplay: "Dashboard" });
  };

  toggleLogIn = userObj => {
    //   console.log(userObj);
    //   this.setState({ userObj: userObj });
    //   this.setState({ loggedIn: !this.state.loggedIn });
    //   //close logged in modal backdrop
    //   console.log(this.state.loggedIn);
    //   if (this.state.loggedIn === true) {
    //     // document.getElementsByClassName("modal-backdrop")[0].remove();
    //     document.body.classList.remove("modal-open");
    //   }
    //   // show error modal to reset password
    //   if (userObj.newUser) {
    //     this.showErrorModal(
    //       "Welcome to RCS, Heres some information",
    //       "You need to reset your password. Click the Manage Profile button to do so."
    //     );
    //   }
  };

  // toggleDisplay = display => {
  //   if (document.getElementsByClassName("slidingDiv")[1].style.left === "0%") {
  //     document.getElementsByClassName("slidingDiv")[1].style.left = "-66%";
  //   } else {
  //     document.getElementsByClassName("slidingDiv")[1].style.left = "0%";
  //   }
  //   this.setState({ doDisplay: display });
  // };

  render() {
    if (this.state.loggedIn) {
      return (
        <div className="App">
          <div>Im logged in</div>
        </div>
      );
    } else {
      return (
        <div className="App">
          <Header logIn={this.toggleLogIn} />
        </div>
      );
    }
  }
}

export default App;
