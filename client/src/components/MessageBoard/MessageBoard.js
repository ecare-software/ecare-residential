import React, { Component } from "react";
import MessagePost from "./MessagePost";
import PostMessageModal from "../Modals/PostMessageModal";
import "./MessageBoard.css";
import "../../App.css";

class MessageBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal:""
    };
  }

  openModal = (modalName) =>{
    this.setState({showModal:modalName});
  }

  closeModals = () =>{
    this.setState({showModal:""})
  }

  render() {
    if (this.props.messages) {
      return (
        <div style={{marginTop:"60px"}}>
          <button onClick={this.openModal.bind('','PostMessageModal')} className="btn btn-light">
            Post Message{"  "}
            <span className="fa fa-pencil"></span>{" "}
          </button>
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
