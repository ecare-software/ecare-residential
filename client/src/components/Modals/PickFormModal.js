import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";

class PickFormModal extends Component {
  constructor(props) {
    super(props);
  }

  selectForm = formType => {
    this.props.closeModals();
    this.props.toggleDisplay(formType);
  };

  render() {
    return (
      <Modal show={this.props.doShow} onHide={!this.props.doShow}>
        <ModalHeader>
          <h5 className="modal-title" id="PickFormModal">
            Select a form to submit
          </h5>
        </ModalHeader>
        <ModalBody>
          <div className="">
            <div>
              <button
                className="btn btn-default"
                onClick={this.selectForm.bind("", "TreatmentPlan72")}
              >
                72 Hour Treatment Plan
              </button>
              <br/>
              <button
                className="btn btn-default"
                onClick={this.selectForm.bind("", "IncidentReport")}
              >
                Incident Report
              </button>
              <br/>
              <button
                className="btn btn-default"
                onClick={this.selectForm.bind("", "DailyProgress")}
              >
                Daily Progress
              </button>
              <br/>
              <button
                className="btn btn-default"
                onClick={this.selectForm.bind("", "restraintReport")}
              >
                Restraint Report
              </button>
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

PickFormModal.propTypes = {};

export default PickFormModal;
