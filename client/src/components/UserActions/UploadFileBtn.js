import React, { Component } from "react";
import "./UserActions.css";

class UploadFileBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <button
        data-toggle="modal"
        data-target="#UploadFileModal"
        id="uploadFileBtn"
      >
        <span className="fa fa-external-link-square" />
      </button>
    );
  }
}
export default UploadFileBtn;
