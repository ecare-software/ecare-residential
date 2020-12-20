import React, { Component } from "react";
import Document from "./Document";
import ListGroup from "react-bootstrap/ListGroup";
import "./Documents.css";
import Axios from "axios";

class Documents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [
        {
          _id: "5fcad1a133bf8d02a864ce0c",
          imageName: "multer-image-1607127457977_1607127457990",
          imageData: "uploads/Screen_Shot_2020-12-04_at_4.37.31_PM.png",
          homeId: "home-1234",
          email: "demarcuskennedy95@gmail.com",
          uploadDate: "2020-12-05T00:17:37.990Z",
          __v: 0,
        },
      ],
    };
  }

  getUserName = (email) => {
    const selectedUser = this.props.allUsers.filter((userObj) => {
      return userObj.email === email;
    });

    return selectedUser
      ? `${selectedUser[0].firstName} ${selectedUser[0].lastName}`
      : "";
  };

  getDocuments = async () => {
    try {
      const imagesReq = await Axios.get(
        `/api/uploadDocument/${this.props.userObj.homeId}`
      );
      this.setState({ ...this.state, documents: imagesReq.data });
    } catch (e) {
      alert("Error fetching images");
    }
  };

  componentDidMount() {
    this.getDocuments();
  }

  download = (id) => {
    alert(id);
  };

  render() {
    return (
      <div>
        <div className="formTitleDiv">
          <h2 className="formTitle">Documents</h2>
          <div className="documentBtns">
            <hr />
            <button className="btn btn-link">
              <span className="fa fa-plus"></span> Upload Document
            </button>
          </div>
        </div>
        <div className="documentsListContainer">
          <ListGroup>
            {this.state.documents &&
              this.state.documents.map((doc) => (
                <Document
                  data={doc}
                  id={doc._id}
                  key={doc._id}
                  download={this.download}
                  getUserName={this.getUserName}
                />
              ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}

export default Documents;
