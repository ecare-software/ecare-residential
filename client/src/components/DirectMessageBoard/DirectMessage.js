import React from "react";
import "../../App.css";
import "./DirectMessageBoard.css";
import { DoDeleteRecord } from "../../utils/DoDeleteRecord";

const DirectMessage = ({ messageObj, children, doDelete }) => {
  return (
    <div className="MessagePost">
      <div className="MessagePostMeta">
        <div className="d-flex">
          <span className="mainFont MessagePostUser">
            {messageObj.fromObj.firstName} {messageObj.fromObj.lastName}
          </span>
          <div className="ml-auto">
            <button
              style={{ marginLeft: "auto" }}
              className="btn btn-light"
              onClick={() => {
                DoDeleteRecord(
                  "Are you sure you want to delete this message? This cannot be undone.",
                  `/api/directMessages/${messageObj._id}`,
                  () => {
                    doDelete(messageObj._id);
                  }
                );
              }}
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        </div>
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
