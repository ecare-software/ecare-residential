import React, { Component } from "react";
import UserBtn from "./UserBtn";
import DMBtn from "./DMBtn";
import "./Navbar.css";
import "../../App.css";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
        <div id="NavbarContainer">

            <div className="hideOnDesktop" style={{width:"13%"}}>
                <UserBtn/>
            </div>
            <div className="hideOnDesktop" id="pageTitleContainer">
                <span className="mainFont" id="navTitle">{this.props.doDisplay}</span>
            </div>
            <div className="hideOnDesktop" style={{width:"13%",textAlign:"right"}}>

<DMBtn bgColor="white" />
            </div>
        </div>
    );
  }
}

export default Navbar;
