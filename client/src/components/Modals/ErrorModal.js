import React, { Component } from "react";

class ErrorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  closeModal = () =>{
    document.getElementsByClassName("modal-backdrop")[0].style.display = "none";
  }

  render() {
    return (
      <div
        className="modal fade"
        id="errorModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="errorModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={this.closeModal}>&times;</span>
              </button>
              <h4 style={{marginLeft:"10px"}} className="modal-title" id="errorModalLabel"> {this.props.title}</h4>
            </div>
            <div className="modal-body">

      <p>{this.props.message}</p>

            </div>
            <div className="modal-footer">
              <button
              onClick={this.closeModal}
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorModal;
