import React, { Component } from "react";
import MessagePost from "./MessagePost";
import "./MessageBoard.css";
import "../../App.css";

class MessageBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    if(this.props.messages){

    
    return (
      <div id="messageBoard">
        {
          this.props.messages.map((item,index)=>(

<MessagePost
          messageObj={item}
        >
          {item.message}
        </MessagePost>

          ))
        }
      </div>
    );
    }else{
      return (<div>hey</div>)
    }
  }
}

export default MessageBoard;
