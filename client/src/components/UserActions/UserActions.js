import React, { Component } from "react";
import AddPostBtn from "./AddPostBtn";
import UploadFileBtn from "./UploadFileBtn";
import PostFormBtn from "./PostFormBtn";
import "./UserActions.css";

class UserActions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div id="UserActions">
        <div className="col-xs-4 actionBtnContainer">
          <UploadFileBtn />
        </div>
        <div className="col-xs-4 actionBtnContainer">
          <AddPostBtn />
        </div>
        <div className="col-xs-4 actionBtnContainer">
          <PostFormBtn />
        </div>
      </div>
    );
  }
}

export default UserActions;
