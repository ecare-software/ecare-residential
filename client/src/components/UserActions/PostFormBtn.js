import React, { Component } from "react";
import "./UserActions.css";

class PostFormBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <button id="PostFormBtn">
        <span className="glyphicon glyphicon-paste" />
      </button>
    );
  }
}
export default PostFormBtn;