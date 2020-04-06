import React, { Component } from "react";
import Document from "./Document";
import ListGroup from "react-bootstrap/ListGroup";
import "./Documents.css";

class Documents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents:[{
        id:1,
        title:"Review of Lunches",
        uploadDate:new Date().toISOString()
      }]
    };
  }

  getDocuments = () => {};

  download = (id) => {
    alert(id)
  };

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
            {this.state.documents.map((doc)=>(
              <Document title={doc.title} id={doc.id} key={doc.id} download={this.download} />
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}

export default Documents;
