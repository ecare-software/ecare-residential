import React, { Component } from "react";
import "../../App.css";
import "./DirectMessageBoard.css";
import DMBtn from "../NavBar/DMBtn";

const DirectMessage = ({ messageObj, children }) => {
  return (
    <div className="MessagePost">
      <div className="MessagePostMeta">
        <span className="mainFont MessagePostUser">
          {messageObj.fromObj.firstName} {messageObj.fromObj.lastName}
        </span>
        <i className="MessagePostTime">
          {new Date(messageObj.date).toLocaleString()}
        </i>
      </div>
      <div className="MessagePostTextDiv">
        <p>{children}</p>
      </div>
    </div>
  );
};

export default DirectMessage;
