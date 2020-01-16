import React, { Component } from "react";

class PostMessageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };

    this.origenalState = {
        message: ""
      };

  }

  resetState = ()=>{
    this.setState(this.origenalState);
    Object.keys(this.state).forEach((k)=>document.getElementById(k).value="")
  }

  handleFieldInput = (event)=> {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  }

  submitRequest =() => {
    if (!(/^\s+$/).test(this.state.message)) {
      console.log(this.state.message);
      document.getElementById("closePostMessageModal").click();
      this.props.appendMessage(this.state.message);
      this.resetState();
    } else {
      console.log(this.state);
      alert("you did not select a demo method");
    }
  }

  render() {
    return (
      <div
        className="modal fade"
        id="postMessageModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="postMessageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="postMessageModalLabel">
                Messages are seen by everyone within the application ?
              </h5>
            
            </div>
            <div className="modal-body">
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
            </div>
            <div className="modal-footer">
              <button
                id="closePostMessageModal"
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

export default PostMessageModal;
