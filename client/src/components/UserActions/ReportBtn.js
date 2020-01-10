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
        <span className="glyphicon glyphicon-list-alt" />
      </button>
    );
  }
}
export default ReportBtn;
