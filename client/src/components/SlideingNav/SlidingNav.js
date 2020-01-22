import React, { Component } from "react";
import postMessageModal from "../Modals/PostMessageModal";

import "./SlidingNav.css";
import "../../App.css";
import PostMessageModal from "../Modals/PostMessageModal";
import PickFormModal from "../Modals/PickFormModal";

const hideStyle = {
  display:"none"
}

class SlidingNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal:""
    };
  }

  openModal = (modalName) =>{
    this.setState({showModal:modalName});
    this.props.toggleSlidingDiv();
  }

  sideDivThenShow = name =>{

    this.props.toggleDisplay(name);
    this.props.toggleSlidingDiv();
  }

  closeModals = () =>{
    this.setState({showModal:""})
  }

  render() {
    return (
      <div id="slidingDiv" className="slidingDiv">
        <h4 id="slidingNavTitle">Hello, {this.props.userObj.firstName}</h4>
        <div className="navSection">
          <h5 className="navSectionTitle">User Actions</h5>
          <button  className="navAction" onClick={this.openModal.bind('','PostMessageModal')} data-toggle="modal" data-target="#postMessageModal">
            <span className="fa fa-pencil navG" />Post a Message
          </button>
          {/* <button  className="navAction" data-toggle="modal" data-target="#UploadFileModal">
            <span className="fa fa-upload navG" />Upload a File
          </button> */}
          <button  className="navAction" onClick={this.openModal.bind('','PickFormModal')}>
            <span className="fa fa-file-upload navG"/>Submit a Form
          </button>
          <button  className="navAction" onClick={this.props.logOut}>
            <span style={{transform: "rotate(180deg)"}} className="fa fa-sign-in navG"/>Log out
          </button>
          <h5 className="navSectionTitle">Reporting</h5>
          <button className="navAction">
            <span className="fa fa-list navG"/>View Reports
          </button>
          <button style={this.props.userObj.isAdmin ? {} : hideStyle } onClick={this.sideDivThenShow.bind({},"Dashboard")} className="navAction">
            <span className="fa fa-list navG"/>View Dashboard
          </button>
          <h5 className="navSectionTitle"  style={this.props.userObj.isAdmin ? {} : hideStyle } >Administrative</h5>
          <button style={this.props.userObj.isAdmin ? {} : hideStyle } onClick={this.sideDivThenShow.bind({},"User Management")} className="navAction">
            <span className="fa fa-list navG"/>User Management
          </button>
          <h5 className="navSectionTitle">Settings</h5>
          <button  className="navAction" data-toggle="modal" data-target="#manageAccount">
            <span className="fa fa-cogs navG"/>Manage Profile
          </button>
        </div>
        {/* modals */}
        <PostMessageModal appendMessage={this.props.appendMessage} closeModals={this.closeModals} doShow={this.state.showModal==="PostMessageModal"} />
        <PickFormModal toggleDisplay={this.props.toggleDisplay} closeModals={this.closeModals} doShow={this.state.showModal==="PickFormModal"}/>
      </div>
    );
  }
}

export default SlidingNav;
