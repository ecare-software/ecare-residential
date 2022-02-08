import React, { useState } from "react";
import postMessageModal from "../Modals/PostMessageModal";

import "./SlidingNav.css";
import "../../App.css";
import PostMessageModal from "../Modals/PostMessageModal";
import PickFormModal from "../Modals/PickFormModal";

const hideStyle = {
  display: "none",
};

const SlidingNav = ({ toggleDisplay, toggleSlidingDiv, userObj, logOut }) => {
  const [showModal, setModal] = useState(initialState);

  openModal = (modalName) => {
    setModal(modalName);
    toggleSlidingDiv();
  };

  sideDivThenShow = (name) => {
    toggleDisplay(name);
    toggleSlidingDiv();
  };

  closeModals = () => {
    setModal("");
  };

  return (
    <div id="slidingDiv" className="slidingDiv">
      <h4 id="slidingNavTitle">Hello, {userObj.firstName}</h4>
      <div className="navSection">
        <h5 className="navSectionTitle">User Actions</h5>
        <button
          className="navAction"
          onClick={openModal("PostMessageModal")}
          data-toggle="modal"
          data-target="#postMessageModal"
        >
          <span className="fa fa-pencil navG" />
          Post a Message
        </button>
        {/* <button  className="navAction" data-toggle="modal" data-target="#UploadFileModal">
            <span className="fa fa-upload navG" />Upload a File
          </button> */}
        <button className="navAction" onClick={openModal("PickFormModal")}>
          <span className="fa fa-file-upload navG" />
          Submit a Form
        </button>
        <button className="navAction" onClick={logOut}>
          <span
            style={{ transform: "rotate(180deg)" }}
            className="fa fa-sign-in navG"
          />
          Log out
        </button>
        <h5 className="navSectionTitle">Reporting</h5>
        <button className="navAction">
          <span className="fa fa-list navG" />
          View Reports
        </button>
        <button
          style={userObj.isAdmin ? {} : hideStyle}
          onClick={sideDivThenShow("Dashboard")}
          className="navAction"
        >
          <span className="fa fa-list navG" />
          View Dashboard
        </button>
        <h5
          className="navSectionTitle"
          style={userObj.isAdmin ? {} : hideStyle}
        >
          Administrative
        </h5>
        <button
          style={userObj.isAdmin ? {} : hideStyle}
          onClick={sideDivThenShow("User Management")}
          className="navAction"
        >
          <span className="fa fa-list navG" />
          User Management
        </button>
        <h5 className="navSectionTitle">Settings</h5>
        <button
          className="navAction"
          data-toggle="modal"
          data-target="#manageAccount"
        >
          <span className="fa fa-cogs navG" />
          Manage Profile
        </button>
      </div>
      {/* modals */}
      <PostMessageModal
        appendMessage={appendMessage}
        closeModals={closeModals}
        doShow={showModal === "PostMessageModal"}
      />
      <PickFormModal
        toggleDisplay={toggleDisplay}
        closeModals={closeModals}
        doShow={showModal === "PickFormModal"}
      />
    </div>
  );
};

export default SlidingNav;
