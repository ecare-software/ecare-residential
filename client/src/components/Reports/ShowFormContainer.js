import React, { Component, useState, useEffect } from "react";
import TreatmentPlan72 from "../Forms/TreatmentPlan72";
import IncidentReport from "../Forms/IncidentReport";
import DailyProgress from "../Forms/DailyProgressAndActivity";
import RestraintReport from "../Forms/RestraintReport";
import IllnessInjury from "../Forms/IllnessInjury";
import AdmissionAssessment from "../Forms/AdmissionAssessment";
import BodyCheck from "../Forms/BodyCheck";
import { Form, Col } from "react-bootstrap";
import Axios from "axios";

const MetaDetails = ({ formData, isAdminRole, route, userObj }) => {
  const [isApproved, setIsApproved] = useState(
    formData.approved ? formData.approved : false
  );

  const [approvedByText, setApprovedByText] = useState(
    formData.approved === true
      ? `${formData.approvedBy}, ${new Date(
          formData.approvedByDate
        ).toLocaleString()}`
      : ""
  );
  const setApprovedLabel = (approved) => {
    if (approved) {
      return `Approved by ${approvedByText}`;
    } else {
      if (isAdminRole) {
        return "Approve form submission";
      } else {
        return "Form not yet approved";
      }
    }
  };

  const updateFormApproval = async () => {
    console.log(formData._id);
    let isApprovedPostData = !isApproved;
    await setIsApproved(isApprovedPostData);
    try {
      await Axios.put(`/api/${route}/${formData.homeId}/${formData._id}`, {
        approved: isApprovedPostData,
        approvedBy: userObj.email,
        approvedByName: `${userObj.firstName} ${userObj.lastName}`,
        approvedByDate: new Date(),
      });
      setApprovedByText(
        `${userObj.firstName} ${
          userObj.lastName
        } ${new Date().toLocaleString()}`
      );
    } catch (e) {
      //go back
      alert("Error update form state");
      setApprovedByText("");
      setIsApproved(!isApproved);
    }
  };

  return (
    <div style={{ margin: "0px 20px 40px 20px" }}>
      <div>
        <h6 className="font-italic font-weight-light">{formData._id}</h6>
      </div>
      <div className="d-flex align-items-center">
        <h6 style={{ fontWeight: 400, marginRight: 5 }}>Updated</h6>{" "}
        <h6 style={{ fontWeight: 300 }}>
          {` ${formData.createdByName}, ${
            formData.lastEditDate
              ? new Date(formData.lastEditDate).toLocaleString()
              : ""
          }`}
        </h6>
      </div>
      <div>
        <div>
          <Form.Row>
            <Col xs="auto">
              <Form.Check
                type="checkbox"
                id="autoSizingCheck"
                className="mb-2 d-flex align-items-center"
                label={setApprovedLabel(isApproved)}
                disabled={!isAdminRole}
                checked={isApproved}
                onClick={updateFormApproval}
              />
            </Col>
          </Form.Row>
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            window.print();
          }}
          className="btn btn-light"
        >
          Print <i className="fas fa-print"></i>
        </button>
      </div>
    </div>
  );
};
class ShowFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  displayComponent = (name) => {
    let comp = {};
    let route = "";

    if (name === "72 Hour Treatment Plan") {
      comp = (
        <TreatmentPlan72
          valuesSet="true"
          userObj={this.props.userObj}
          formData={this.props.formData}
        />
      );
      route = "treatmentPlans72";
    } else if (name === "Incident Report") {
      comp = (
        <IncidentReport
          valuesSet="true"
          userObj={this.props.userObj}
          formData={this.props.formData}
        />
      );
      route = "incidentReport";
    } else if (name === "Daily Activity") {
      comp = (
        <DailyProgress
          valuesSet="true"
          userObj={this.props.userObj}
          formData={this.props.formData}
        />
      );
      route = "dailyProgressAndActivity";
    } else if (name === "Illness Injury") {
      comp = (
        <IllnessInjury
          valuesSet="true"
          userObj={this.props.userObj}
          formData={this.props.formData}
        />
      );

      route = "illnessInjury";
    } else if (name === "Admission Assessment") {
      comp = (
        <AdmissionAssessment
          valuesSet="true"
          userObj={this.props.userObj}
          formData={this.props.formData}
        />
      );

      route = "admissionAssessment";
    } else if (name === "Health Body Check") {
      comp = (
        <BodyCheck
          valuesSet="true"
          userObj={this.props.userObj}
          formData={this.props.formData}
        />
      );

      route = "bodyCheck";
    } else if (name === "Restraint Report") {
      comp = (
        <RestraintReport
          valuesSet="true"
          userObj={this.props.userObj}
          formData={this.props.formData}
        />
      );
      route = "restraintReport";
    } else {
      comp = (
        <div>
          <h1>404 - Form Not Found</h1>
        </div>
      );
    }
    return Reflect.ownKeys(this.props.formData).length > 0 ? (
      <>
        <MetaDetails
          formData={this.props.formData}
          isAdminRole={this.props.isAdminRole}
          route={route}
          userObj={this.props.userObj}
        />
        {comp}
      </>
    ) : (
      <></>
    );
  };

  render() {
    return this.displayComponent(this.props.form.name);
  }
}
export default ShowFormContainer;
