import React, { Component } from "react";

class UploadFileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      demoMethod: "",
      file: "",
    };

    this.origenalState = {
      demoMethod: "",
    };

    this.toggleDemoMethod = this.toggleDemoMethod.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
    this.handleFieldInput = this.handleFieldInput.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  resetState() {
    this.setState(this.origenalState);
    // Object.keys(this.state).forEach((k)=>console.log(document.getElementById(k)))
  }

  handleFieldInput(event) {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  }

  toggleDemoMethod(event) {
    this.setState({
      demoMethod: event.target.value,
    });
  }

  submitRequest() {
    if (this.state.demoMethod !== "") {
      // console.log(this.state);
      alert("submit");
      document.getElementById("closeUploadFileModal").click();
      this.resetState();
    } else {
      // console.log(this.state);
      alert("you did not select a demo method");
    }
  }

  render() {
    return (
      <div
        className="modal fade"
        id="UploadFileModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="UploadFileModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="UploadFileModalLabel">
                Upload File
              </h5>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="control-label" htmlFor="radios">
                  File Type
                </label>
                <div className="">
                  <div className="radio">
                    <label htmlFor="Type1">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="Type1"
                        value="Type1"
                      />
                      Type 1
                    </label>
                  </div>
                  <div className="radio">
                    <label htmlFor="Type2">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="Type2"
                        value="Type2"
                      />
                      Type 2
                    </label>
                  </div>

                  <label>Upload File</label>
                  <div
                    style={{
                      border: ".5px solid #eee",
                      borderRadius: "4px",
                      marginLeft: "-5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      id="file"
                      style={{ width: "100%" }}
                      type="file"
                      onChange={this.handleFieldInput}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                id="closeUploadFileModal"
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

export default UploadFileModal;
