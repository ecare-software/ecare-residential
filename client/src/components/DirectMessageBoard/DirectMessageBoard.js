import React, { Component } from "react";
import DirectMessage from "./DirectMessage";
import "./DirectMessageBoard.css";
import "../../App.css";

class DirectMessageBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: "",
      messageText: ""
    };
  }

  openModal = modalName => {
    this.setState({ showModal: modalName });
  };

  closeModals = () => {
    this.setState({ showModal: "" });
  };

  callAppendMessage = () => {
    this.props.appendMessage(this.state.messageText);
    this.setState({ messageText: "" });
  };

  handleFieldInput = event => {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  };

  render() {
    if (this.props.messages) {
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
            <div id="messageBoard">
              {this.props.messages.map((item, index) => (
                <DirectMessage messageObj={item}>{item.message}</DirectMessage>
                // <li>{item.message}</li>
              ))}
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
      return <div></div>;
    }
  }
}

export default DirectMessageBoard;
