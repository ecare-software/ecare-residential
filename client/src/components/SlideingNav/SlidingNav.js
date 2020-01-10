import React, { Component } from "react";
import "./SlidingNav.css";
import "../../App.css";

const hideStyle = {
  display:"none"
}

class SlidingNav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div id="slidingDiv" className="slidingDiv">
        <h4 id="slidingNavTitle">Hello, {this.props.userObj.firstName}</h4>
        <div className="navSection">
          <h5 className="navSectionTitle">User Actions</h5>
          <button  className="navAction" data-toggle="modal" data-target="#postMessageModal">
            <span className="glyphicon glyphicon-pencil navG" />Post a Message
          </button>
          <button  className="navAction" data-toggle="modal" data-target="#UploadFileModal">
            <span className="glyphicon glyphicon-open navG" />Upload a File
          </button>
          <button  className="navAction">
            <span className="glyphicon glyphicon glyphicon-paste navG"/>Submit a Form
          </button>
          <button  className="navAction" onClick={this.props.logOut}>
            <span style={{transform: "rotate(180deg)"}} className="glyphicon glyphicon-log-in navG"/>Log out
          </button>
          <h5 className="navSectionTitle">Reporting</h5>
          <button className="navAction">
            <span className="glyphicon glyphicon-list-alt navG"/>View Reports
          </button>
          <button style={this.props.userObj.isAdmin ? {} : hideStyle } onClick={this.props.toggleDisplay.bind({},"Dashboard")} className="navAction">
            <span className="glyphicon glyphicon-list-alt navG"/>View Dashboard
          </button>
          <h5 className="navSectionTitle"  style={this.props.userObj.isAdmin ? {} : hideStyle } >Administrative</h5>
          <button style={this.props.userObj.isAdmin ? {} : hideStyle } onClick={this.props.toggleDisplay.bind({},"User Management")} className="navAction">
            <span className="glyphicon glyphicon-list-alt navG"/>User Management
          </button>
          <h5 className="navSectionTitle">Settings</h5>
          <button  className="navAction" data-toggle="modal" data-target="#manageAccount">
            <span className="glyphicon glyphicon glyphicon-cog navG"/>Manage Profile
          </button>
        </div>
      </div>
    );
  }
}

export default SlidingNav;
