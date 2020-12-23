import React, { Component } from "react";
import Document from "./Document";
import ListGroup from "react-bootstrap/ListGroup";
import "./Documents.css";
import Axios from "axios";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";

class Documents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      showUploadModal: false,
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

  uploadImage = (e, method, user, fileName) => {
    let imageObj = {};
    if (method === "multer") {
      let imageFormObj = new FormData();
      imageFormObj.append("imageName", fileName.replace(/\s+/g, "_"));
      imageFormObj.append("imageData", e.target.files[0]);
      imageFormObj.append("homeId", user.homeId);
      imageFormObj.append("email", user.email);
      // stores a readable instance of // the image being uploaded using multer
      // this.setState({ multerImage: URL.createObjectURL(e.target.files[0]) });

      Axios.post(`api/uploadDocument/uploadmulter`, imageFormObj)
        // Axios.post(`/upload`, imageFormObj)
        .then((data) => {
          if (data.data.success) {
            console.log(data.data);
            this.setState({ ...this.state, showUploadModal: false });
            this.getDocuments();
            // alert("Image has been successfully uploaded using multer");
            // this.setDefaultImage("multer");
          }
        })
        .catch((err) => {
          alert("Error while uploading image using multer");
          console.log(err);
          this.setState({ ...this.state, showUploadModal: false });
          // this.setDefaultImage("multer");
        });
    }
  };

  getDocuments = async () => {
    try {
      const imagesReq = await Axios.get(
        `/api/uploadDocument/${this.props.userObj.homeId}`
      );
      console.log(imagesReq.data);
      this.setState({ ...this.state, documents: imagesReq.data });
    } catch (e) {
      alert("Error fetching images");
    }
  };

  componentDidMount() {
    this.getDocuments();
  }

  download = (id) => {
    const selectedFile = this.state.documents.filter((doc, idx) => {
      return doc._id === id;
    });
    function _arrayBufferToBase64(buffer) {
      var binary = "";
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }
    console.log(selectedFile[0]);
    const base64Flag = `data:${selectedFile[0].img.contentType};base64,`;
    const url =
      base64Flag + _arrayBufferToBase64(selectedFile[0].img.data.data);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", selectedFile[0].imageName);
    document.body.appendChild(link);
    link.click();
    // alert(id);
  };

  render() {
    return (
      <div>
        <div className="formTitleDiv">
          <h2 className="formTitle">Documents</h2>
          <div className="documentBtns">
            <hr />
            <button className="btn btn-link">
              <span className="fa fa-plus"></span>{" "}
              <span
                htmlFor="uploadBtnLeft"
                onClick={() => {
                  this.setState({ ...this.state, showUploadModal: true });
                }}
              >
                Upload Document
              </span>
            </button>
          </div>
        </div>
        <div>
          <label
            className="btn btn-light extraInfoButton"
            htmlFor="uploadBtnLeft"
            onClick={() => {
              this.setState({ ...this.state, showUploadModal: true });
            }}
          >
            Upload New Document
          </label>
          <Modal
            show={this.state.showUploadModal}
            onHide={() => {
              this.setState({ ...this.state, showUploadModal: false });
            }}
          >
            <div style={{ backgroundColor: "white" }}>
              <ModalHeader
                closeButton
                style={{
                  color: "maroon",
                  borderColor: "maroon",
                  textAlign: "center",
                }}
              >
                <h5>Upload New Document</h5>
              </ModalHeader>
              <ModalBody>
                <div className="form-group">
                  <label>File Name</label>
                  <input
                    id="fileName"
                    style={{ width: "100%", margin: "15px 0px" }}
                    className="form-control"
                    placeholder="Name / Organization"
                  />
                  <input
                    type="file"
                    id="fileBtn"
                    onChange={(e) => {
                      this.uploadImage(
                        e,
                        "multer",
                        this.props.userObj,
                        document.getElementById("fileName").value
                      );
                    }}
                  />
                </div>
              </ModalBody>
            </div>
          </Modal>
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
