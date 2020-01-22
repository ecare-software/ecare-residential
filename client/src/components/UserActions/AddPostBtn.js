import React, { Component } from "react";
import "./UserActions.css";

class AddPostBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <button id="addPostBtn" data-toggle="modal"
      data-target="#postMessageModal">
        <span className="fa fa-pencil" />
      </button>
    );
  }
}
export default AddPostBtn;
