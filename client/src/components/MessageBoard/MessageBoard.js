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
      messageText:""
    };
  }

  openModal = modalName => {
    this.setState({ showModal: modalName });
  };

  closeModals = () => {
    this.setState({ showModal: "" });
  };

  callAppendMessage = () =>{
    this.props.appendMessage(this.state.messageText);
    this.setState({messageText:""});
  }

  handleFieldInput = event => {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  };

  render() {
    if (this.props.messages) {
      return (
        <div style={{ marginTop: "60px" }}>
          <div className="messageBoardTitleDiv">
            <div style={{width:"100%",display:"flex",margin:"10px 0px"}}>
              <textarea id="messageText" value={this.state.messageText} onChange={this.handleFieldInput} cols="1" style={{height:"40px",flex:"1",borderColor:"#eee",margin:"0px 5px",resize:"none", borderRight:"none",borderTop:"none",borderLeft:"none"}} placeholder="Whats on your mind ?"></textarea>
              <button onClick={this.callAppendMessage} className="btn btn-light" style={{margin:"0px 5px",width:"75px"}}>Post</button>
            </div>
            <div style={{margin:"0px 5px"}}>
            <button className='btn btn-light' style={{marginRight:"10px"}}>Upload a File</button>
            <button className='btn btn-light' style={{marginRight:"10px"}}>Direct Message</button>
            </div>
          </div>
          <div id="messageBoard">
            {this.props.messages.map((item, index) => (
              <MessagePost messageObj={item}>{item.message}</MessagePost>
            ))}
          </div>
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
