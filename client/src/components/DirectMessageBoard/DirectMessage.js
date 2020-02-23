import React, { Component } from "react";
import "../../App.css";
import "./DirectMessageBoard.css";
import DMBtn from "../NavBar/DMBtn";

class DirectMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="MessagePost">
        <div className="MessagePostMeta">
          <span className="mainFont MessagePostUser">
            {this.props.messageObj.firstName} {this.props.messageObj.lastName}
          </span>
          <i className="MessagePostTime">
            {new Date(this.props.messageObj.date).toLocaleString()}
          </i>
        </div>
        <div className="MessagePostTextDiv">
          <p>{this.props.children}</p>
        </div>
      </div>
    );
  }
}

export default DirectMessage;
