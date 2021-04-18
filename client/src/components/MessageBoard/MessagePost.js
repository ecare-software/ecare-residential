import React, { Component } from "react";
import "./MessageBoard.css";
import "../../App.css";
import { DoDeleteRecord } from "../../utils/DoDeleteRecord";

class MessagePost extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  deleteMessge = () => {
    this.props.doRemoveMessage(this.props.messageObj._id);
  };

  render() {
    return (
      <div className="MessagePost">
        <div className="MessagePostMeta">
          <div style={{ display: "flex" }}>
            <span className="mainFont MessagePostUser">
              {this.props.messageObj.firstName} {this.props.messageObj.lastName}
            </span>
            <button
              style={{ marginLeft: "auto" }}
              className="btn btn-light"
              onClick={() => {
                DoDeleteRecord(
                  "Are you sure you want to delete this message? This cannot be undone.",
                  `/api/discussionMessages/${this.props.messageObj._id}`,
                  this.deleteMessge
                );
              }}
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
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

export default MessagePost;
