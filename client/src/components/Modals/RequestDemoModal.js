import React, { Component } from "react";

class RequestDemoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      demoMethod: "",
      webinarDate: "",
      demoMessage: "",
    };

    this.origenalState = {
      demoMethod: "",
      webinarDate: "",
      demoMessage: "",
    };

    this.toggleDemoMethod = this.toggleDemoMethod.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
    this.toggleWebinarDate = this.toggleWebinarDate.bind(this);
    this.handleFieldInput = this.handleFieldInput.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  resetState() {
    this.setState(this.origenalState);
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
  toggleWebinarDate(event) {
    this.setState({
      webinarDate: event.target.value,
    });
  }

  submitRequest() {
    if (this.state.demoMethod !== "") {
      if (this.state.demoMethod === "Webinar") {
        if (this.state.webinarDate !== "") {
          // console.log(this.state);
          alert("submit");
          document.getElementById("closeRequestDemoModal").click();
          this.resetState();
        } else {
          // console.log(this.state);
          alert("you did not select a webinar date");
        }
      } else {
        // console.log(this.state);
        alert("submit");
        document.getElementById("closeRequestDemoModal").click();
        this.resetState();
      }
    } else {
      // console.log(this.state);
      alert("you did not select a demo method");
    }
  }

  render() {
    return (
      <div
        className="modal fade"
        id="requestDemoModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="requestDemoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="requestDemoModalLabel">
                Demo Options
              </h5>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="control-label" htmlFor="radios">
                  Demo Method
                </label>
                <div className="">
                  <div className="radio">
                    <label htmlFor="Webinar">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="Webinar"
                        value="Webinar"
                      />
                      Webinar
                    </label>
                  </div>
                  <div
                    className={
                      this.state.demoMethod !== "Webinar"
                        ? "hideIt"
                        : "showWebinarDetail"
                    }
                  >
                    <label>Wednesday</label>
                    <div className="radio">
                      <label htmlFor="Wednesday11:00am">
                        <input
                          onClick={this.toggleWebinarDate}
                          type="radio"
                          name="radio"
                          id="Wednesday11:00am"
                          value="Wednesday 11:00am"
                        />
                        11:00 am
                      </label>
                    </div>
                    <div className="radio">
                      <label htmlFor="Wednesday1:00pm">
                        <input
                          onClick={this.toggleWebinarDate}
                          type="radio"
                          name="radio"
                          id="Wednesday1:00pm"
                          value="Wednesday 1:00pm"
                        />
                        1:00 pm
                      </label>
                    </div>
                    <label>Friday</label>
                    <div className="radio">
                      <label htmlFor="Friday11:00am">
                        <input
                          onClick={this.toggleWebinarDate}
                          type="radio"
                          name="radio"
                          id="Friday11:00am"
                          value="Friday 11:00am"
                        />
                        11:00 am
                      </label>
                    </div>
                    <div className="radio">
                      <label htmlFor="Friday1:00pm">
                        <input
                          onClick={this.toggleWebinarDate}
                          type="radio"
                          name="radio"
                          id="Friday1:00pm"
                          value="Friday 1:00pm"
                        />
                        1:00 pm
                      </label>
                    </div>
                  </div>
                  <div className="radio">
                    <label htmlFor="Office">
                      <input
                        onClick={this.toggleDemoMethod}
                        type="radio"
                        name="radios"
                        id="Office"
                        value="Office"
                      />
                      Office Visit
                    </label>
                  </div>

                  <div className="textArea">
                    <label>Message</label>
                    <textarea
                      onChange={this.handleFieldInput}
                      id="demoMessage"
                      className="textAreaSmall"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                id="closeRequestDemoModal"
                type="button"
                className="darkBtnSimple modelBtn"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={this.submitRequest}
                className="lightBtnSimple modelBtn"
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

export default RequestDemoModal;
