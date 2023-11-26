import React from "react";
import "./MessageBoard.css";
import "../../App.css";
import { DoDeleteRecord } from "../../utils/DoDeleteRecord";
import { isAdminUser } from "../../utils/AdminReportingRoles";

const MessagePost = (props) => {
  const deleteMessge = () => {
    props.doRemoveMessage(props.messageObj._id);
  };

  return (
    <div className="MessagePost">
      <div className="MessagePostMeta">
        <div style={{ display: "flex" }}>
          <span className="mainFont MessagePostUser">
            {props.messageObj.firstName} {props.messageObj.lastName}
          </span>
          {isAdminUser(props.userObj) && (
            <button
              style={{ marginLeft: "auto" }}
              className="btn btn-light"
              onClick={() => {
                DoDeleteRecord(
                  "Are you sure you want to delete this message? This cannot be undone.",
                  `/api/discussionMessages/${props.messageObj._id}`,
                  deleteMessge
                );
              }}
            >
              <i className="fa fa-trash"></i>
            </button>
          )}
        </div>
        <i className="MessagePostTime">
          {new Date(props.messageObj.date).toLocaleString()}
        </i>
      </div>
      <div className="MessagePostTextDiv">
        <p>{props.children}</p>
      </div>
    </div>
  );
};

export default MessagePost;
