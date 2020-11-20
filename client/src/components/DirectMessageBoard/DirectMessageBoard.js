import React, { useState, useEffect } from "react";
import DirectMessage from "./DirectMessage";
import DirectMessageGroup from "./DirectMessageGroup";
import "./DirectMessageBoard.css";
import "../../App.css";

const DirectMessageBoard = ({ messages, userObj, allUsers }) => {
  const [showModal, setShowModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {});
  // useEffect(())

  const DisplayGroupUserName = () => {
    const selectedEmail = selectedUser.user;
    const selectedUserObj = allUsers.filter((user) => {
      return user.email === selectedEmail;
    });
    return selectedUserObj.length > 0
      ? `${selectedUserObj[0].firstName} ${selectedUserObj[0].lastName}`
      : "";
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
            // acc[cur.fromObj.email].messages.push(cur);
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
    // console.log(fromObj);
    return fromObj;
  };

  if (selectedUser) {
    return (
      <div className="formCompNoBg">
        {/* <div className="formTitleDiv">
            <h2 className="formTitle">
              Direct Messages
              <div>
                <br />
                <hr />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-evenly"
                  }}
                >
                  <button className="btn btn-link">
                    <span className="fa fa-pencil"></span> Post a message
                  </button>
                </div>
              </div>
            </h2>
          </div> */}
        <div className="formFieldsMobile">
          <div className="formTitleDiv">
            <h2 className="formTitle">
              Direct Messages
              {/* <div>
                <br />
                <hr />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  <button className="btn btn-link">
                    <span className="fa fa-pencil"></span> Post a message
                  </button>
                </div>
              </div> */}
            </h2>
          </div>
          {/* <div className="messageBoardTitleDiv">
                <div style={{width:"100%",display:"flex",margin:"10px 0px"}}>
                  <textarea id="messageText" value={this.state.messageText} onChange={this.handleFieldInput} cols="1" style={{height:"40px",flex:"1",borderColor:"#eee",margin:"0px 5px",resize:"none", borderRight:"none",borderTop:"none",borderLeft:"none"}} placeholder="Whats on your mind ?"></textarea>
                  <button onClick={this.callAppendMessage} className="btn btn-light" style={{margin:"0px 5px",width:"75px"}}>Post</button>
                </div>
                <div style={{margin:"0px 5px"}}>
                <button className='btn btn-light' style={{marginRight:"10px"}}>Upload a File</button>
                <button className='btn btn-light' style={{marginRight:"10px"}}>Direct Message</button>
                </div>
              </div> */}
          <h5 className="MessagePostUser">
            <span
              onClick={() => {
                setSelectedUser(null);
              }}
              style={{ cursor: "pointer" }}
            >
              All Messages
            </span>
            {" > "}
            <DisplayGroupUserName />
            {/* {`${messages[0].fromObj.firstName} ${messages[0].fromObj.lastName}`} */}
          </h5>
          <div id="messageBoard">
            <div
              style={{
                maxHeight: "60vh",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
            >
              {messages.length > 0
                ? messages
                    .filter((message) => {
                      return (
                        message.fromID === selectedUser.user ||
                        message.toID === selectedUser.user
                      );
                    })
                    .map((item, index) => (
                      <DirectMessage messageObj={item} key={index}>
                        {item.message}
                      </DirectMessage>
                      // <li>{item.message}</li>
                    ))
                : null}
            </div>
          </div>
        </div>
        {/* modals */}
        {/* <PostMessageModal
                appendMessage={this.props.appendMessage}
                closeModals={this.closeModals}
                doShow={this.state.showModal === "PostMessageModal"}
              /> */}
      </div>
    );
  } else {
    return (
      <div className="formCompNoBg">
        <div className="formFieldsMobile">
          <div className="formTitleDiv">
            <h2 className="formTitle">
              Direct Messages
              {/* <div>
                <br />
                <hr />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  <button className="btn btn-link">
                    <span className="fa fa-pencil"></span> Post a message
                  </button>
                </div>
              </div> */}
            </h2>
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
