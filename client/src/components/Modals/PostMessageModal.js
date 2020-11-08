import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";

class PostMessageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };

    this.origenalState = {
      message: "",
    };
  }

  resetState = () => {
    this.setState(this.origenalState);
    Object.keys(this.state).forEach(
      (k) => (document.getElementById(k).value = "")
    );
  };

  handleFieldInput = (event) => {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  };

  submitRequest = () => {
    if (!/^\s+$/.test(this.state.message)) {
      this.props.appendMessage(this.state.message);
      this.resetState();
      this.props.closeModals();
    } else {
      // console.log(this.state);
      alert("you did not select a demo method");
    }
  };

  render() {
    return (
      <Modal show={this.props.doShow} onHide={!this.props.doShow}>
        <ModalHeader>
          <h5 className="modal-title" id="postMessageModalLabel">
            Messages are seen by everyone within the application ?
          </h5>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <div className="">
              <div className="textArea">
                <textarea
                  onChange={this.handleFieldInput}
                  id="message"
                  className="textAreaSmall"
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="modelBtn btn btn-default"
            variant="secondary"
            onClick={this.props.closeModals}
          >
            Close
          </button>
          <button
            type="button"
            onClick={this.submitRequest}
            className="darkBtnSimple modelBtn"
          >
            Submit
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default PostMessageModal;
