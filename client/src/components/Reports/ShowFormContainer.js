import React, { Component, useState, useContext, useEffect } from "react";
import TreatmentPlan72 from "../Forms/TreatmentPlan72";
import IncidentReport from "../Forms/IncidentReport";
import SeriousIncidentReport from "../Forms/SeriousIncidentReport";
import DailyProgress from "../Forms/DailyProgressAndActivity";
import RestraintReport from "../Forms/RestraintReport";
import IllnessInjury from "../Forms/IllnessInjury";
import AdmissionAssessment from "../Forms/AdmissionAssessment";
import OrientationTraining from "../Forms/OrientationTraining";
import PreServiceTraining from "../Forms/PreServiceTraining";
import BodyCheck from "../Forms/BodyCheck";
import { Form, Col } from "react-bootstrap";
import Axios from "axios";
import { FormCountContext } from "../../context";
import { GetUserSig } from "../../utils/GetUserSig";
import SignatureCanvas from "react-signature-canvas";
import { FetchHomeData } from "../../utils/FetchHomeData";

const needsNurseSig = [
  "Health Body Check",
  "Serious Incident Report",
  "Incident Report",
];

const needsAlt1Sig = ["Serious Incident Report", "Incident Report"];

const MetaDetails = ({ formData, isAdminRole, route, userObj }) => {
  const [isApproved, setIsApproved] = useState(
    formData.approved ? formData.approved : false
  );

  const [sigInit, setSigInit] = useState(false);

  const [isApprovedByNurse, setIsApprovedByNurse] = useState(
    formData.approvedNurse ? formData.approvedNurse : false
  );

  const [isApprovedByAlt1, setIsApprovedByAlt1] = useState(
    formData.approved_alt1 ? formData.approved_alt1 : false
  );

  const formContext = useContext(FormCountContext);

  const [approvedByText, setApprovedByText] = useState(
    formData.approved === true ? `${formData.approvedByName}` : ""
  );

  const [approvedByNurseText, setApprovedByNurseText] = useState(
    formData.approvedNurse === true ? `${formData.approvedByNameNurse}` : ""
  );

  const [approvedByAlt1Text, setApprovedByAlt1Text] = useState(
    formData.approved_alt1 === true ? `${formData.approvedByName_alt1}` : ""
  );

  const [sigCanvasAdmin, setSigCanvasAdmin] = useState(null);

  const [sigCanvasNurse, setSigCanvasNurse] = useState(null);

  const [sigCanvasAdminAlt1, setSigCanvasAdminAlt1] = useState(null);

  const [homeData, setHomeData] = useState("");

  const doGetHomeInfo = async () => {
    try {
      const { data } = await FetchHomeData(formData.homeId);
      await setHomeData(data[0]);
    } catch (e) {
      console.log("Error fetching home info");
    }
  };

  const doPrint = async () => {
    window.print();
  };

  const setApprovedLabel = (approved, label) => {
    if (approved) {
      return `Approved by ${label} ${approvedByText}`;
    } else {
      if (isAdminRole) {
        return `Needs ${label} Approval`;
      } else {
        return `Form not yet approved by ${label}`;
      }
    }
  };

  const setApprovedLabelAlt = (approved, label) => {
    if (approved) {
      return `Approved by ${label} ${approvedByAlt1Text}`;
    } else {
      if (isAdminRole) {
        return `Needs ${label} Approval`;
      } else {
        return `Form not yet approved by ${label}`;
      }
    }
  };

  const setApprovedLabelNurse = (approved, label) => {
    if (approved) {
      return `Approved by ${label} ${approvedByNurseText}`;
    } else {
      if (isAdminRole) {
        return `Needs ${label} Approval`;
      } else {
        return `Form not yet approved by ${label}`;
      }
    }
  };

  useEffect(() => {
    if (!sigInit) {
      doSetSigsInit();
    }

    if (
      needsNurseSig.includes(formData.formType) ||
      needsAlt1Sig.includes(formData.formType)
    ) {
      if (
        needsAlt1Sig.includes(formData.formType) &&
        !needsNurseSig.includes(formData.formType)
      ) {
        if (sigCanvasNurse && sigCanvasAdminAlt1) {
          setSigInit(true);
        }
      } else if (
        !needsAlt1Sig.includes(formData.formType) &&
        needsNurseSig.includes(formData.formType)
      ) {
        if (sigCanvasNurse && sigCanvasAdmin) {
          setSigInit(true);
        }
      } else {
        if (sigCanvasNurse && sigCanvasAdmin && sigCanvasAdminAlt1) {
          setSigInit(true);
        }
      }
    } else if (needsAlt1Sig.includes(formData.formType)) {
      if (sigCanvasNurse && sigCanvasAdmin) {
        setSigInit(true);
      }
    } else {
      if (sigCanvasAdmin) {
        setSigInit(true);
      }
    }
  }, [isApproved, isApprovedByNurse, sigCanvasNurse, sigCanvasAdmin]);

  useEffect(() => {
    if (formData.homeId) doGetHomeInfo();
  }, []);

  const doSetSigs = (type, sig) => {
    if (type === "nurse") {
      sigCanvasNurse.fromData(sig);
    } else if (type === "alt1") {
      sigCanvasAdminAlt1.fromData(sig);
    } else {
      sigCanvasAdmin.fromData(sig);
    }
  };

  const doSetSigsInit = () => {
    if (formData.approvedNurseSig && sigCanvasNurse) {
      sigCanvasNurse.fromData(formData.approvedNurseSig);
    }
    if (formData.approved_alt1 && sigCanvasAdminAlt1) {
      sigCanvasAdminAlt1.fromData(formData.approvedSig_alt1);
    }
    if (formData.approvedSig && sigCanvasAdmin) {
      sigCanvasAdmin.fromData(formData.approvedSig);
    }
  };

  const getPostObjectData = async (type) => {
    let doFetchSig;
    let signiture = null;
    if (type === "nurse") {
      doFetchSig = !isApprovedByNurse === true;
    } else if (type === "alt1") {
      doFetchSig = !isApprovedByAlt1 === true;
    } else {
      doFetchSig = !isApproved === true;
    }
    if (doFetchSig) {
      try {
        const { data: createdUserData } = await GetUserSig(
          userObj.email,
          userObj.homeId
        );

        if (
          !createdUserData.signature ||
          Array.isArray(createdUserData.signature) === false ||
          !createdUserData.signature.length > 0
        ) {
          alert(
            `User signiture required to update a form. Create a new signiture under 'Manage Profile'.`
          );
          return {
            success: false,
            body: null,
          };
        }
        signiture = createdUserData.signature;
      } catch (e) {
        alert("Error update form state");
      }
    }

    if (type === "nurse") {
      const copy = !isApprovedByNurse;
      await setIsApprovedByNurse(!isApprovedByNurse);
      return {
        success: true,
        body: {
          approvedNurse: copy,
          approvedByNurse: userObj.email,
          approvedByNameNurse: `${userObj.firstName} ${userObj.lastName}`,
          approvedByDateNurse: new Date(),
          approvedNurseSig: copy ? signiture : [],
        },
      };
    } else if (type === "alt1") {
      const copy = !isApprovedByAlt1;
      await setIsApprovedByAlt1(!isApprovedByAlt1);
      return {
        success: true,
        body: {
          approved_alt1: copy,
          approvedBy_alt1: userObj.email,
          approvedByName_alt1: `${userObj.firstName} ${userObj.lastName}`,
          approvedByDate_alt1: new Date(),
          approvedSig_alt1: copy ? signiture : [],
        },
      };
    } else {
      const copy = !isApproved;
      await setIsApproved(!isApproved);
      return {
        success: true,
        body: {
          approved: copy,
          approvedBy: userObj.email,
          approvedByName: `${userObj.firstName} ${userObj.lastName}`,
          approvedByDate: new Date(),
          approvedSig: copy ? signiture : [],
        },
      };
    }
  };

  const updateFormApproval = async (type = "base") => {
    const { body: postData, success } = await getPostObjectData(type);
    if (!success) {
      return;
    }

    try {
      await Axios.put(
        `/api/${route}/${formData.homeId}/${formData._id}`,
        postData
      );
      if (type === "nurse") {
        setApprovedByNurseText(`${userObj.firstName} ${userObj.lastName} `);
        doSetSigs(type, postData.approvedNurseSig);
      } else if (type === "alt1") {
        setApprovedByAlt1Text(`${userObj.firstName} ${userObj.lastName} `);
        doSetSigs(type, postData.approvedSig_alt1);
      } else {
        setApprovedByText(`${userObj.firstName} ${userObj.lastName}`);
        doSetSigs(type, postData.approvedSig);
      }
    } catch (e) {
      //go back
      console.log(e);
      alert("Error update form state");
      setApprovedByText("");
      setIsApproved(!isApproved);
    }

    try {
      await formContext.updateCount();
    } catch (e) {
      console.log(`error updating form approval count - ${e}`);
    }
  };

  return (
    <div style={{ margin: "0px 20px 40px 20px" }}>
      <div>
        <h6 className="font-italic font-weight-light">{formData._id}</h6>
      </div>
      <div className="d-flex align-items-center">
        <h6 style={{ fontWeight: 400, marginRight: 5 }}>Last updated</h6>{" "}
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
                id="baseBtn"
                style={{ color: isApproved ? "green" : "red" }}
                className="mb-2 d-flex align-items-center"
                label={setApprovedLabel(isApproved, "Admin 1")}
                disabled={!isAdminRole}
                checked={isApproved}
                onClick={() => {
                  updateFormApproval();
                }}
              />
            </Col>
          </Form.Row>
          <Form.Row>
            <Col xs="auto">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <SignatureCanvas
                  ref={(ref) => {
                    setSigCanvasAdmin(ref);
                  }}
                  style={{ border: "solid" }}
                  penColor="black"
                  clearOnResize={false}
                  canvasProps={{
                    width: 600,
                    height: 200,
                    className: "sigCanvasAdmin",
                  }}
                  backgroundColor="#eeee"
                />
              </div>
            </Col>
          </Form.Row>
          {needsNurseSig.includes(formData.formType) && (
            <>
              <Form.Row>
                <Col xs="auto">
                  <Form.Check
                    type="checkbox"
                    id="nurseBtn"
                    style={{ color: isApprovedByNurse ? "green" : "red" }}
                    className="mb-2 d-flex align-items-center"
                    label={setApprovedLabelNurse(
                      isApprovedByNurse,
                      "Nurse or Designee"
                    )}
                    disabled={!isAdminRole}
                    checked={isApprovedByNurse}
                    onClick={() => {
                      updateFormApproval("nurse");
                    }}
                  />
                </Col>
              </Form.Row>
              <Form.Row>
                <Col xs="auto">
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        setSigCanvasNurse(ref);
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 200,
                        className: "setSigCanvasNurse",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
                </Col>
              </Form.Row>
            </>
          )}
          {needsAlt1Sig.includes(formData.formType) && (
            <>
              <Form.Row>
                <Col xs="auto">
                  <Form.Check
                    type="checkbox"
                    id="alt1Btn"
                    style={{ color: isApprovedByAlt1 ? "green" : "red" }}
                    className="mb-2 d-flex align-items-center"
                    label={setApprovedLabelAlt(isApprovedByAlt1, "Admin 2")}
                    disabled={!isAdminRole}
                    checked={isApprovedByAlt1}
                    onClick={() => {
                      updateFormApproval("alt1");
                    }}
                  />
                </Col>
              </Form.Row>
              <Form.Row>
                <Col xs="auto">
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        setSigCanvasAdminAlt1(ref);
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 200,
                        className: "setSigCanvasAlt1",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
                </Col>
              </Form.Row>
            </>
          )}
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            doPrint();
          }}
          className="btn btn-light"
        >
          Print <i className="fas fa-print"></i>
        </button>
        {homeData && (
          <div>
            <h3 className="text-center">
              {homeData.name && `RTC - ${homeData.name}`}
            </h3>
            {homeData.address && (
              <h4 className="text-center">
                {`${homeData.address?.street}, ${homeData.address?.city}, ${homeData.address?.state} ${homeData.address?.zip}`}
              </h4>
            )}
            <h4 className="text-center">
              {homeData.phone && `${homeData.phone}`}
            </h4>
          </div>
        )}
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
    } else if (name === "Serious Incident Report") {
      comp = (
        <SeriousIncidentReport
          valuesSet="true"
          userObj={this.props.userObj}
          formData={this.props.formData}
        />
      );
      route = "seriousIncidentReport";
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
    } else if (name === "Orientation Training") {
      comp = (
        <OrientationTraining
          valuesSet="true"
          userObj={this.props.userObj}
          formData={this.props.formData}
        />
      );
      route = "orientationTraining";
    } else if (name === "Pre Service Training") {
      comp = (
        <PreServiceTraining
          valuesSet="true"
          userObj={this.props.userObj}
          formData={this.props.formData}
        />
      );
      route = "preServiceTraining";
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
