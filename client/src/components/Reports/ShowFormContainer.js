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

const needsNurseSig = ["Health Body Check", "Illness Injury"];

const needsAlt1Sig = ["Illness Injury"];

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
    if (sigCanvasNurse) {
      sigCanvasNurse.off();
      if (formData.approvedNurseSig) {
        sigCanvasNurse.fromData(formData.approvedNurseSig);
      }
    }
    if (sigCanvasAdminAlt1) {
      sigCanvasAdminAlt1.off();
      if (formData.approved_alt1) {
        sigCanvasAdminAlt1.fromData(formData.approvedSig_alt1);
      }
    }
    if (sigCanvasAdmin) {
      sigCanvasAdmin.off();
      if (formData.approvedSig) {
        sigCanvasAdmin.fromData(formData.approvedSig);
      }
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
      <div className="d-flex align-items-center hide-on-print">
        <h6 style={{ fontWeight: 400, marginRight: 5 }}>Form Id</h6>{" "}
        <h6 style={{ fontWeight: 300 }}>{formData._id}</h6>
      </div>
      <div className="d-flex align-items-center hide-on-print">
        <h6 style={{ fontWeight: 400, marginRight: 5 }}>Last Updated</h6>{" "}
        <h6 style={{ fontWeight: 300 }}>
          {` ${formData.createdByName}, ${
            formData.lastEditDate
              ? `${
                  new Date(formData.lastEditDate).getUTCMonth() + 1
                }/${new Date(formData.lastEditDate).getUTCDate()}/${new Date(
                  formData.lastEditDate
                ).getFullYear()}`
              : ""
          }`}
        </h6>
      </div>
      <div className="d-flex align-items-center">
        <h6 style={{ fontWeight: 400, marginRight: 5 }}>Created Date</h6>{" "}
        <h6 style={{ fontWeight: 300 }}>
          {` ${formData.createdByName}, ${
            formData.lastEditDate
              ? `${new Date(formData.createDate).getUTCMonth() + 1}/${new Date(
                  formData.createDate
                ).getUTCDate()}/${new Date(formData.createDate).getFullYear()}`
              : ""
          }`}
        </h6>
      </div>
      <div className="hide-on-non-print" style={{ width: "500px" }}>
        <h6 style={{ fontWeight: 400, marginRight: 5 }}>
          Date Printed{" "}
          <span style={{ fontWeight: 300 }}>
            {new Date().toLocaleString().split(",")[0]}
          </span>
        </h6>{" "}
      </div>
      <div className="hide-on-non-print">
        <h6 style={{ fontWeight: 400, marginRight: 5 }}>
          Printed By{" "}
          <span style={{ fontWeight: 300 }}>
            {`${userObj.firstName} ${userObj.lastName}`}
          </span>
        </h6>{" "}
      </div>
      <div>
        <button
          onClick={() => {
            doPrint();
          }}
          className="btn btn-light hide-on-print"
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
    </div>
  );
};
const ShowFormContainer = ({ formData, userObj, isAdminRole, form }) => {
  const [updatedFormData, setFormData] = useState({});

  useEffect(() => {
    if (
      Reflect.ownKeys(formData).length > 0 &&
      Reflect.ownKeys(updatedFormData).length === 0
    ) {
      setFormData(formData);
    }
  });

  const doUpdateFormDates = async (createDate) => {
    const update = {
      ...updatedFormData,
      lastEditDate: new Date(),
    };

    if (createDate) {
      update.createDate = createDate;
    }
    await setFormData({
      ...updatedFormData,
      ...update,
    });

    formData = updatedFormData;
  };

  let route = "";
  const displayComponent = (name) => {
    let comp = {};

    if (name === "72 Hour Treatment Plan") {
      comp = (
        <TreatmentPlan72
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
      route = "treatmentPlans72";
    } else if (name === "Incident Report") {
      comp = (
        <IncidentReport
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
      route = "incidentReport";
    } else if (name === "Serious Incident Report") {
      comp = (
        <SeriousIncidentReport
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
      route = "seriousIncidentReport";
    } else if (name === "Daily Activity") {
      comp = (
        <DailyProgress
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
      route = "dailyProgressAndActivity";
    } else if (name === "Illness Injury") {
      comp = (
        <IllnessInjury
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );

      route = "illnessInjury";
    } else if (name === "Admission Assessment") {
      comp = (
        <AdmissionAssessment
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );

      route = "admissionAssessment";
    } else if (name === "Health Body Check") {
      comp = (
        <BodyCheck
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );

      route = "bodyCheck";
    } else if (name === "Restraint Report") {
      comp = (
        <RestraintReport
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
      route = "restraintReport";
    } else if (name === "Orientation Training") {
      comp = (
        <OrientationTraining
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
      route = "orientationTraining";
    } else if (name === "Pre Service Training") {
      comp = (
        <PreServiceTraining
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
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
    return Reflect.ownKeys(updatedFormData).length > 0 ? <>{comp}</> : <></>;
  };

  return (
    <>
      {Reflect.ownKeys(updatedFormData).length > 0 && (
        <MetaDetails
          formData={updatedFormData}
          isAdminRole={isAdminRole}
          route={route}
          userObj={userObj}
        />
      )}
      {displayComponent(form.name)}
    </>
  );
};
export default ShowFormContainer;
