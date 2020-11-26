import React, { Component } from "react";
import MessagePost from "./MessagePost";
import PostMessageModal from "../Modals/PostMessageModal";
import "./MessageBoard.css";
import "../../App.css";

class MessageBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: "",
      messageText: "",
    };
  }

  openModal = (modalName) => {
    this.setState({ showModal: modalName });
  };

  closeModals = () => {
    this.setState({ showModal: "" });
  };

  callAppendMessage = () => {
    if (
      this.state.messageText.length > 0 &&
      /^\s+/.test(this.state.messageText) === false
    ) {
      this.props.appendMessage(this.state.messageText);
      this.setState({ messageText: "" });
    }
  };

  handleFieldInput = (event) => {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  };

  render() {
    if (this.props.messages) {
      return (
        <div style={{ marginTop: "60px" }}>
          <div className="messageBoardTitleDiv">
            <div style={{ width: "100%", display: "flex", margin: "10px 0px" }}>
              <textarea
                id="messageText"
                value={this.state.messageText}
                onChange={this.handleFieldInput}
                cols="1"
                style={{
                  height: "100px",
                  flex: "1",
                  borderColor: "#ccc",
                  margin: "0px 5px",
                  resize: "none",
                  borderWidth: ".5px",
                  borderRadius: "9px",
                }}
                placeholder="Let the everyone know what's going on or simply say hello! Information here will be display for all users to see"
              ></textarea>
              <button
                onClick={this.callAppendMessage}
                className="btn btn-light"
                style={{ margin: "0px 5px", width: "75px" }}
              >
                Post
              </button>
            </div>
            <div style={{ margin: "0px 5px" }}>
              {/* <button className="btn btn-light" style={{ marginRight: "10px" }}>
                Upload a File
              </button> */}
              <button
                className="btn btn-light"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  document.querySelector(".Direct-Message-nav").click();
                  this.props.toggleDisplay("Direct Message");
                }}
              >
                Direct Message
              </button>
            </div>
          </div>
          {this.props.messages.length === 0 ? (
            <p className="text-center mt-5">
              Looks like there aren't any discussion posts at the moment
            </p>
          ) : (
            <div id="messageBoard">
              {this.props.messages.map((item, index) => (
                <MessagePost messageObj={item}>{item.message}</MessagePost>
              ))}
            </div>
          )}
          {/* modals */}
          <PostMessageModal
            appendMessage={this.props.appendMessage}
            closeModals={this.closeModals}
            doShow={this.state.showModal === "PostMessageModal"}
          />
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default MessageBoard;
