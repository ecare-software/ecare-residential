import React, { Component } from "react";
import "./UserActions.css";

class ReportBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <button id="ReportBtn">
        <span className="fa fa-list" />
      </button>
    );
  }
}
export default ReportBtn;
