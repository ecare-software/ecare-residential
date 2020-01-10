import React, { Component } from "react";
import "./MessageBoard.css";
import DMBtn from "../NavBar/DMBtn";
import "../../App.css";


class MessagePost extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="MessagePost">
        <div className="MessagePostMeta">
          <span className="mainFont MessagePostUser">{this.props.messageObj.firstName} {this.props.messageObj.lastName}</span>
          <i className="MessagePostTime">{new Date(this.props.messageObj.date).toLocaleString()}<DMBtn toUser={this.props.messageObj.user} bgColor="maroon" fontSz="1em">send message</DMBtn></i>
        </div>
        <div className="MessagePostTextDiv">
            <p>{this.props.children}</p>
        </div>
      </div>
    );
  }
}

export default MessagePost;
