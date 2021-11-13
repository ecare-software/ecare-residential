import React, { useState } from "react";
import "../../App.css";
import "./DirectMessageBoard.css";

const DirectMessageGroup = ({ dmData, setSelectedUser, allUsers }) => {
  const DisplayGroupUserName = () => {
    const selectedUser = allUsers.filter((user) => {
      return user.email === dmData.user;
    })[0];
    return selectedUser
      ? `${selectedUser.firstName} ${selectedUser.lastName}`
      : "";
  };

  return (
    <div
      className="MessagePost"
      onClick={() => {
        setSelectedUser(dmData);
      }}
      style={{ cursor: "pointer" }}
    >
      <div className="MessagePostMeta">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <span className="mainFont MessagePostUser" style={{ flex: 1 }}>
            <DisplayGroupUserName />
          </span>
          <p className="MessagePostTime">
            {new Date(
              dmData.messages[dmData.messages.length - 1].date
            ).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="MessagePostTextDiv">
        <p>{dmData.messages[0].messages}</p>
      </div>
    </div>
  );
};

export default DirectMessageGroup;
