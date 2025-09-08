import React, { useState, useEffect } from "react";
import DirectMessage from "./DirectMessage";
import DirectMessageGroup from "./DirectMessageGroup";
import "./DirectMessageBoard.css";
import "../../App.css";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const DirectMessageBoard = ({ messagesInit, userObj, allUsers, setDMs }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState(messagesInit);

  useEffect(() => {
    setMessages(messagesInit);
  }, [messagesInit]);

  // Update cookie when component mounts to clear notification icon
  useEffect(() => {
    if (messagesInit && messagesInit.length > 0) {
      const current = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(current.getFullYear() + 1);

      // Update the cookie with the current message count
      cookies.set(`messageCount-${userObj.email}`, JSON.stringify(messagesInit.length), {
        expires: nextYear,
      });
    }
  }, [messagesInit]);

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
    setDMs(updatedMessages);
    const selectedUserMessages = updatedMessages.filter((message) => {
      return (
        message.fromID === selectedUser.user ||
        message.toID === selectedUser.user
      );
    });

    if (selectedUserMessages.length === 0) setSelectedUser(null);
  };
  const FromUsersList = () => {
    // First, sort messages by date (newest first)
    const sortedMessages = [...messages].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

    const fromObj = sortedMessages.reduce((acc, cur) => {
      // Determine the other user in the conversation
      const otherUser = cur.fromID !== userObj.email ? cur.fromObj.email : cur.toObj.email;

      // Find if we already have a group for this user
      const existingGroupIndex = acc.findIndex(group => group.user === otherUser);

      if (existingGroupIndex === -1) {
        // Create a new group if one doesn't exist
        acc.push({
          user: otherUser,
          messages: [cur],
        });
      } else {
        // Add to existing group
        acc[existingGroupIndex].messages.push(cur);

        // Re-sort messages in this group by date (newest first)
        acc[existingGroupIndex].messages.sort((a, b) =>
          new Date(b.date) - new Date(a.date)
        );
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
              key={`dm-${idx}`}
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
