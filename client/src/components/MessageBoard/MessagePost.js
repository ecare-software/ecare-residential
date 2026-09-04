import React, { Component } from "react";
import "./MessageBoard.css";
import "../../App.css";
import { DoDeleteRecord } from "../../utils/DoDeleteRecord";
import { isAdminUser } from "../../utils/AdminReportingRoles";

class MessagePost extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  deleteMessge = () => {
    this.props.doRemoveMessage(this.props.messageObj._id);
  };

  isNew = () => {
    const { messageObj, userObj, lastViewedBefore } = this.props;
    if (!lastViewedBefore) return false;
    if (messageObj.id === userObj?._id) return false;
    return new Date(messageObj.date) > new Date(lastViewedBefore);
  };

  render() {
    return (
      <div className="MessagePost">
        <div className="MessagePostMeta">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="mainFont MessagePostUser">
              {this.props.messageObj.firstName} {this.props.messageObj.lastName}
            </span>
            {this.isNew() && (
              <span
                style={{
                  backgroundColor: "maroon",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "bold",
                  letterSpacing: "0.5px",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  marginLeft: "8px",
                }}
              >
                NEW
              </span>
            )}
            {isAdminUser(this.props.userObj) && (
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
            )}
          </div>
          <i className="MessagePostTime">
            {new Date(this.props.messageObj.date).toLocaleString()}
          </i>
        </div>
        <div className="MessagePostTextDiv">
          <p>{this.props.children}</p>
          {this.props.messageObj.image && (
            <img
              src={this.props.messageObj.image}
              alt="Attachment"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "9px",
                display: "block",
                marginTop: "8px",
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default MessagePost;
