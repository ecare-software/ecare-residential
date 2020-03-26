import React, { Component } from "react";
import Document from "./Document";
import ListGroup from "react-bootstrap/ListGroup";
import "./Documents.css";

class Documents extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getDocuments = () => {};

  render() {
    return (
      <div>
        <div className="formTitleDiv">
          <h2 className="formTitle">Documents</h2>
          <div
            className="documentBtns"
          >
              <hr />
            <button className="btn btn-link">
              <span className="fa fa-plus"></span> Upload Document
            </button>
          </div>
        </div>
        <div className="documentsListContainer">
          <ListGroup>
            <Document />
            <Document />
          </ListGroup>
        </div>
      </div>
    );
  }
}

export default Documents;
