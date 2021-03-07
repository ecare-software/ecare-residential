import React, { Component } from "react";

class SendMessageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      to: this.props.toUser,
      message: "",
    };

    this.origenalState = {
      message: "",
    };

    this.submitRequest = this.submitRequest.bind(this);
    this.handleFieldInput = this.handleFieldInput.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  resetState() {
    this.setState(this.origenalState);
    Object.keys(this.state).forEach(
      (k) => (document.getElementById(k).value = "")
    );
  }

  handleFieldInput(event) {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  }

  submitRequest() {
    if (this.state.message !== "") {
      alert("submit");
      document.getElementById("closeSendMessageModal").click();
      this.resetState();
    } else {
      alert("you did not select a demo method");
    }
  }

  render() {
    return (
      <div
        className="modal fade"
        id="sendMessageModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="sendMessageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="sendMessageModalLabel">
                Send Message
              </h5>
            </div>
            <div className="modal-body">
              <div>
                <div className="form-group" style={{ display: "flex" }}>
                  <p>{this.props.toUser}</p>
                  <label className="control-label">To:</label>
                  <input
                    id="to"
                    onChange={this.handleFieldInput}
                    style={{ paddingLeft: "10px", marginLeft: "15px" }}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <div className="textArea">
                    <textarea
                      onChange={this.handleFieldInput}
                      id="message"
                      className="textAreaSmall"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                id="closeSendMessageModal"
                type="button"
                className="modelBtn btn btn-default"
                data-dismiss="modal"
                onClick={this.resetState}
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SendMessageModal;
