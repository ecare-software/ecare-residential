import React, { useState, useEffect } from "react";
import DirectMessage from "./DirectMessage";
import DirectMessageGroup from "./DirectMessageGroup";
import "./DirectMessageBoard.css";
import "../../App.css";

const DirectMessageBoard = ({ messagesInit, userObj, allUsers }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState(messagesInit);

  useEffect(() => {
    setMessages(messagesInit);
  }, messagesInit);

  const DisplayGroupUserName = () => {
    const selectedEmail = selectedUser.user;
    const selectedUserObj = allUsers.filter((user) => {
      return user.email === selectedEmail;
    });
    return selectedUserObj.length > 0
      ? `${selectedUserObj[0].firstName} ${selectedUserObj[0].lastName}`
      : "";
  };

  const doDelete = (id) => {
    let updatedMessages = messages.filter((messageObj) => {
      return messageObj._id !== id;
    });
    setMessages(updatedMessages);
    const selectedUserMessages = updatedMessages.filter((message) => {
      return (
        message.fromID === selectedUser.user ||
        message.toID === selectedUser.user
      );
    });

    if (selectedUserMessages.length === 0) setSelectedUser(null);
  };
  const FromUsersList = () => {
    const fromObj = messages.reduce((acc, cur) => {
      if (cur.fromID !== userObj.email) {
        if (acc.length == 0) {
          acc.push({
            user: cur.fromObj.email,
            messages: [cur],
          });
        } else {
          if (
            acc
              .map((messageObj) => {
                return messageObj.user;
              })
              .includes(cur.fromObj.email)
          ) {
            let toReplaceIdx = -1;
            const toUpdate = acc.filter((messageObj, idx) => {
              toReplaceIdx = idx;
              return messageObj.user === cur.fromObj.email;
            });
            acc[toReplaceIdx].messages.push(cur);
          } else {
            acc.push({
              user: cur.fromObj.email,
              messages: [cur],
            });
          }
        }
      } else {
        if (acc.length == 0) {
          acc.push({
            user: cur.toObj.email,
            messages: [cur],
          });
        } else {
          if (
            acc
              .map((messageObj) => {
                return messageObj.user;
              })
              .includes(cur.toObj.email)
          ) {
            acc.forEach((messageObj, idx) => {
              if (messageObj.user === cur.toObj.email) {
                acc[idx].messages.push(cur);
              }
              return messageObj.user === cur.toObj.email;
            });
          } else {
            acc.push({
              user: cur.toObj.email,
              messages: [cur],
            });
          }
        }
      }
      return acc;
    }, []);
    return fromObj;
  };

  if (selectedUser) {
    return (
      <div className="formCompNoBg">
        <div className="formFieldsMobile">
          <div className="formTitleDiv">
            <h2 className="formTitle">Direct Messages</h2>
          </div>
          <h5 className="MessagePostUser">
            <span
              className="btn btn-light"
              onClick={() => {
                setSelectedUser(null);
              }}
              style={{ cursor: "pointer" }}
            >
              All Messages
            </span>
            {" > "}
            <DisplayGroupUserName />
          </h5>
          <div id="messageBoard">
            <div
              style={{
                maxHeight: "60vh",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
            >
              {messages.length > 0 &&
                messages
                  .filter((message) => {
                    return (
                      message.fromID === selectedUser.user ||
                      message.toID === selectedUser.user
                    );
                  })
                  .map((item, index) => (
                    <DirectMessage
                      doDelete={doDelete}
                      messageObj={item}
                      key={index}
                    >
                      {item.message}
                    </DirectMessage>
                  ))}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="formCompNoBg">
        <div className="formFieldsMobile">
          <div className="formTitleDiv">
            <h2 className="formTitle">Direct Messages</h2>
          </div>
          {FromUsersList().map((obj, idx) => (
            <DirectMessageGroup
              dmData={obj}
              setSelectedUser={setSelectedUser}
              allUsers={allUsers}
            />
          ))}
        </div>
      </div>
    );
  }
};

export default DirectMessageBoard;
