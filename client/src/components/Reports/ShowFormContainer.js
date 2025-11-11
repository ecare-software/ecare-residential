import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
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
import AwakeNightStaffSignoff from "../Forms/AwakeNightStaffSignoff";
import { Form, Col } from "react-bootstrap";
import Axios from "axios";
import { FormCountContext } from "../../context";
import { GetUserSig } from "../../utils/GetUserSig";
import SignatureCanvas from "react-signature-canvas";
import { FetchHomeData } from "../../utils/FetchHomeData";
import { DoDeleteRecord } from "../../utils/DoDeleteRecord";
import NightMonitoring from "../Forms/NightMonitoring";
import ClipLoader from "react-spinners/ClipLoader";
import DailyProgressTwo from "../Forms/DailyProgressTwo";
import "../../App.css";

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

  const [isSavingSigCanvasAdmin, setIsSavingSigCanvasAdmin] = useState(false);

  const [isSavingSigCanvasNurse, setIsSavingSigCanvasNurse] = useState(false);

  const [isSavingSigCanvasAdminAlt1, setIsSavingSigCanvasAdminAlt1] =
    useState(false);

  const [homeData, setHomeData] = useState("");

  const doGetHomeInfo = async (isMounted) => {
    try {
      const { data } = await FetchHomeData(formData.homeId);
      if (isMounted.current) {
        setHomeData(data[0]);
      }
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

    // Only update state if component is still mounted
    if (!isMounted.current) return;

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

  // Create a ref to track if component is mounted
  const isMounted = useRef(true);

  useEffect(() => {
    if (formData.homeId) doGetHomeInfo(isMounted);

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  const doSetSigs = (type, sig) => {
    // Only proceed if component is still mounted
    if (!isMounted.current) return;

    try {
      if (type === "nurse" && sigCanvasNurse) {
        sigCanvasNurse.fromData(sig);
      } else if (type === "alt1" && sigCanvasAdminAlt1) {
        sigCanvasAdminAlt1.fromData(sig);
      } else if (sigCanvasAdmin) {
        sigCanvasAdmin.fromData(sig);
      }
    } catch (e) {
      console.log(`Error setting signature for ${type}:`, e);
    }
  };

  const doSetSigsInit = () => {
    // Only proceed if component is still mounted
    if (!isMounted.current) return;

    if (sigCanvasNurse) {
      sigCanvasNurse.off();
      if (formData.approvedNurseSig) {
        try {
          sigCanvasNurse.fromData(formData.approvedNurseSig);
        } catch (e) {
          console.log("Error setting nurse signature:", e);
        }
      }
    }
    if (sigCanvasAdminAlt1) {
      sigCanvasAdminAlt1.off();
      if (formData.approved_alt1) {
        try {
          sigCanvasAdminAlt1.fromData(formData.approvedSig_alt1);
        } catch (e) {
          console.log("Error setting admin alt1 signature:", e);
        }
      }
    }
    if (sigCanvasAdmin) {
      sigCanvasAdmin.off();
      if (formData.approvedSig) {
        try {
          sigCanvasAdmin.fromData(formData.approvedSig);
        } catch (e) {
          console.log("Error setting admin signature:", e);
        }
      }
    }
  };

  const getPostObjectData = async (type) => {
    // Only proceed if component is still mounted
    if (!isMounted.current) {
      return { success: false, body: null };
    }

    let doFetchSig;
    let signature = null;
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

        // Check if component is still mounted before showing alert
        if (!isMounted.current) {
          return { success: false, body: null };
        }

        if (
          !createdUserData.signature ||
          Array.isArray(createdUserData.signature) === false ||
          !createdUserData.signature.length > 0
        ) {
          alert(
            `User signature required to update a form. Create a new signature under 'Manage Profile'.`
          );
          return {
            success: false,
            body: null,
          };
        }
        signature = createdUserData.signature;
      } catch (e) {
        // Only show alert if component is still mounted
        if (isMounted.current) {
          alert("Error update form state");
        }
        return { success: false, body: null };
      }
    }

    // Check if component is still mounted before updating state
    if (!isMounted.current) {
      return { success: false, body: null };
    }

    if (type === "nurse") {
      const copy = !isApprovedByNurse;
      if (isMounted.current) {
        setIsApprovedByNurse(!isApprovedByNurse);
      }
      return {
        success: true,
        body: {
          approvedNurse: copy,
          approvedByNurse: userObj.email,
          approvedByNameNurse: `${userObj.firstName} ${userObj.lastName}`,
          approvedByDateNurse: new Date(),
          approvedNurseSig: copy ? signature : [],
        },
      };
    } else if (type === "alt1") {
      const copy = !isApprovedByAlt1;
      if (isMounted.current) {
        setIsApprovedByAlt1(!isApprovedByAlt1);
      }
      return {
        success: true,
        body: {
          approved_alt1: copy,
          approvedBy_alt1: userObj.email,
          approvedByName_alt1: `${userObj.firstName} ${userObj.lastName}`,
          approvedByDate_alt1: new Date(),
          approvedSig_alt1: copy ? signature : [],
        },
      };
    } else {
      const copy = !isApproved;
      if (isMounted.current) {
        setIsApproved(!isApproved);
      }
      return {
        success: true,
        body: {
          approved: copy,
          approvedBy: userObj.email,
          approvedByName: `${userObj.firstName} ${userObj.lastName}`,
          approvedByDate: new Date(),
          approvedSig: copy ? signature : [],
        },
      };
    }
  };

  const updateFormApproval = async (type = "base") => {
    // Only proceed if component is still mounted
    if (!isMounted.current) return;

    const { body: postData, success } = await getPostObjectData(type);
    if (!success) {
      return;
    }
    try {
      // Only update state if component is still mounted
      if (isMounted.current) {
        if (type === "nurse") {
          setIsSavingSigCanvasNurse(true);
        } else if (type === "alt1") {
          setIsSavingSigCanvasAdminAlt1(true);
        } else {
          setIsSavingSigCanvasAdmin(true);
        }
      }

      await Axios.put(
        `/api/${route}/${formData.homeId}/${formData._id}`,
        postData
      );

      // Only update state if component is still mounted
      if (isMounted.current) {
        if (type === "nurse") {
          setApprovedByNurseText(`${userObj.firstName} ${userObj.lastName} `);
          doSetSigs(type, postData.approvedNurseSig);
          setIsSavingSigCanvasNurse(false);
        } else if (type === "alt1") {
          setApprovedByAlt1Text(`${userObj.firstName} ${userObj.lastName} `);
          doSetSigs(type, postData.approvedSig_alt1);
          setIsSavingSigCanvasAdminAlt1(false);
        } else {
          setApprovedByText(`${userObj.firstName} ${userObj.lastName}`);
          doSetSigs(type, postData.approvedSig);
          setIsSavingSigCanvasAdmin(false);
        }
      }
    } catch (e) {
      //go back
      console.log(e);
      if (isMounted.current) {
        alert("Error update form state");
        setApprovedByText("");
        setIsApproved(!isApproved);
      }
    }

    try {
      if (isMounted.current) {
        await formContext.updateCount();
      }
    } catch (e) {
      console.log(`error updating form approval count - ${e}`);
    }
  };

  const doDelete = async () => {
    DoDeleteRecord(
      "Are you sure you want to delete this message? This cannot be undone.",
      `/api/${route}/${formData.homeId}/${formData._id}`,
      () => {
        document.getElementById("form-reports-back-btn").click();
      }
    );
  };

  return (
    <div className="meta-details-content">
      <div className="d-flex align-items-center hide-on-print">
        <h6 style={{ fontWeight: 400, marginRight: 5 }}>Form Id</h6>{" "}
        <h6 style={{ fontWeight: 300 }}>{formData._id}</h6>
      </div>
      <div className="d-flex align-items-center hide-on-print">
        <h6 style={{ fontWeight: 400, marginRight: 5 }}>Last Updated</h6>{" "}
        <h6 style={{ fontWeight: 300 }}>
          {` ${formData.createdByName}, ${formData.lastEditDate
            ? `${new Date(formData.lastEditDate).toLocaleDateString()}`
            : ""
            }`}
        </h6>
      </div>
      <div className="d-flex align-items-center hide-on-print">
        <h6 style={{ fontWeight: 400, marginRight: 5 }}>Created</h6>{" "}
        <h6 style={{ fontWeight: 300 }}>
          {` ${formData.createdByName}, ${formData.createdByName
            ? `${new Date(formData.createDate).toLocaleDateString()}`
            : ""
            }`}
        </h6>
      </div>
      <div>
        <div className="hide-on-print">
          <button
            onClick={() => {
              doPrint();
            }}
            className="mr-3 btn btn-light hide-on-print"
          >
            Print <i className="fas fa-print"></i>
          </button>
          {isAdminRole && (
            <button
              onClick={() => {
                doDelete();
              }}
              className="btn btn-light hide-on-print"
            >
              Delete Form <i className="fas fa-trash"></i>
            </button>
          )}
        </div>
        <div>
          {/* print home information at top of form */}
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
      <div>
        <Form.Row>
          <Col xs="auto">
            <Form.Check
              type="checkbox"
              id="baseBtn"
              style={{ color: isApproved ? "green" : "red" }}
              className="d-flex align-items-center hide-on-print"
              label={setApprovedLabel(isApproved, "Admin 1")}
              disabled={!isAdminRole}
              checked={isApproved}
              onClick={() => {
                updateFormApproval();
              }}
            />
          </Col>
        </Form.Row>
        {isSavingSigCanvasAdmin && (
          <div
            className=""
            style={{
              height: "200px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div>
              <ClipLoader className="formSpinner" size={50} color={"#ffc107"} />
            </div>

            <p>Updating...</p>
          </div>
        )}
        <Form.Row style={{ pageBreakAfter: "avoid" }}>
          <Col xs="auto" style={{ pageBreakAfter: "avoid" }}>
            <div id='sigCanvasDiv'
              style={{
                display: !isSavingSigCanvasAdmin && isApproved ? "block" : "none",
                pageBreakAfter: "avoid"
              }}
            >
              {isApproved && (
                <SignatureCanvas
                  ref={(ref) => {
                    if (ref) setSigCanvasAdmin(ref);
                  }}
                  style={{ border: "solid" }}
                  penColor="black"
                  clearOnResize={false}
                  canvasProps={{
                    width: 300,
                    height: 100,
                    className: "sigCanvasAdmin",
                  }}
                  backgroundColor="#eeee"
                />
              )}
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
                  className="mb-2 d-flex align-items-center hide-on-print"
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
            {isSavingSigCanvasNurse && (
              <div
                className=""
                style={{
                  height: "200px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>
                  <ClipLoader
                    className="formSpinner"
                    size={50}
                    color={"#ffc107"}
                  />
                </div>

                <p>Updating...</p>
              </div>
            )}
            <Form.Row>
              <Col xs="auto">
                <div
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    display:
                      !isSavingSigCanvasNurse && isApprovedByNurse
                        ? "flex"
                        : "none",
                  }}
                >
                  {isApprovedByNurse && (
                    <SignatureCanvas
                      ref={(ref) => {
                        if (ref) setSigCanvasNurse(ref);
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 300,
                        height: 100,
                        className: "setSigCanvasNurse",
                      }}
                      backgroundColor="#eeee"
                    />
                  )}
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
                  className="mb-2 d-flex align-items-center hide-on-print"
                  label={setApprovedLabelAlt(isApprovedByAlt1, "Admin 2")}
                  disabled={!isAdminRole}
                  checked={isApprovedByAlt1}
                  onClick={() => {
                    updateFormApproval("alt1");
                  }}
                />
              </Col>
            </Form.Row>
            {isSavingSigCanvasAdminAlt1 && (
              <div
                className=""
                style={{
                  height: "200px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>
                  <ClipLoader
                    className="formSpinner"
                    size={50}
                    color={"#ffc107"}
                  />
                </div>

                <p>Updating...</p>
              </div>
            )}
            <Form.Row>
              <Col xs="auto">
                <div
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    display:
                      !isSavingSigCanvasAdminAlt1 && isApprovedByAlt1
                        ? "flex"
                        : "none",
                  }}
                >
                  {isApprovedByAlt1 && (
                    <SignatureCanvas
                      ref={(ref) => {
                        if (ref) setSigCanvasAdminAlt1(ref);
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 300,
                        height: 100,
                        className: "setSigCanvasAlt1",
                      }}
                      backgroundColor="#eeee"
                    />
                  )}
                </div>
              </Col>
            </Form.Row>
          </>
        )}
      </div>
    </div>
  );
};

// called for each form individually during printing
const ShowFormContainer = ({ formData, userObj, isAdminRole, form }) => {
  console.log("Incoming formData:", formData);
  console.log("Incoming form:", form);
  console.log("formData keys:", Reflect.ownKeys(formData));
  const [updatedFormData, setFormData] = useState({});
  const [route, setRoute] = useState("");

  useEffect(() => {
    if (
      Reflect.ownKeys(formData).length > 0 &&
      Reflect.ownKeys(updatedFormData).length === 0
    ) {
      doSetRoute(form.name);
      setFormData(formData);
      console.log("Updated formData set:", formData);
      console.log("Route set to:", form.name);
    }
  });


  const doSetRoute = (name) => {
    let droute = "";
    if (name === "72 Hour Treatment Plan") {
      droute = "treatmentPlans72";
    } else if (name === "Incident Report") {
      droute = "incidentReport";
    } else if (name === "Serious Incident Report") {
      droute = "seriousIncidentReport";
    } else if (name === "Daily Activity") {
      droute = "dailyProgressAndActivity";
    } else if (name === "Illness Injury") {
      droute = "illnessInjury";
    } else if (name === "Admission Assessment") {
      droute = "admissionAssessment";
    } else if (name === "Health Body Check") {
      droute = "bodyCheck";
    } else if (name === "Restraint Report") {
      droute = "restraintReport";
    } else if (name === "Orientation Training") {
      droute = "orientationTraining";
    } else if (name === "Pre Service Training") {
      droute = "preServiceTraining";
    } else if (name === "Awake Night Staff Signoff") {
      droute = "awakeNightStaffSignoff";
    } else if (name === "Night Monitoring") {
      droute = "nightMonitoring";
    } else if (name === "Daily Progress Note Two") {
      droute = "dailyProgressNoteTwo";
    }

    setRoute(droute);
    console.log(`doSetRoute: name="${name}", route="${droute}"`);
  };

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

  const displayComponent = (name) => {
    console.log("Display component for name:", name);
    console.log("updatedFormData keys:", Reflect.ownKeys(updatedFormData));

    // Only proceed if we have form data
    if (Reflect.ownKeys(updatedFormData).length === 0) {
      return <></>;
    }

    // Return the appropriate component based on form name
    if (name === "72 Hour Treatment Plan") {
      return (
        <TreatmentPlan72
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    }

    if (name === "Daily Progress Note Two") {
      return (
        <DailyProgressTwo
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    }

    if (name === "Incident Report") {
      return (
        <IncidentReport
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    }

    if (name === "Serious Incident Report") {
      return (
        <SeriousIncidentReport
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    }

    if (name === "Daily Activity") {
      return (
        <DailyProgress
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    }

    if (name === "Illness Injury") {
      return (
        <IllnessInjury
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    }

    if (name === "Admission Assessment") {
      return (
        <AdmissionAssessment
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    }

    if (name === "Health Body Check") {
      return (
        <BodyCheck
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    }

    if (name === "Restraint Report") {
      return (
        <RestraintReport
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    }

    if (name === "Orientation Training") {
      return (
        <OrientationTraining
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    }

    if (name === "Pre Service Training") {
      return (
        <PreServiceTraining
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    }

    if (name === "Awake Night Staff Signoff") {
      return (
        <AwakeNightStaffSignoff
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    }

    if (name === "Night Monitoring") {
      return (
        <NightMonitoring
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    }

    // Default case - form not found
    return (
      <div>
        <h1>404 - Form Not Found</h1>
      </div>
    );
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
      {displayComponent(form.name ? form.name : form.formType)}
    </>
  );
};

const OtherShowFormContainer = ({ formData, userObj, isAdminRole, form }) => {
  const [updatedFormData, setFormData] = useState({});

  const [route, setRoute] = useState("");

  useEffect(() => {
    if (
      Reflect.ownKeys(formData).length > 0 &&
      Reflect.ownKeys(updatedFormData).length === 0
    ) {
      doSetRoute(form.name);
      setFormData(formData);
    }
  });

  const doSetRoute = (name) => {
    // Implementation omitted for brevity
    let droute = "";
    setRoute(droute);
  };

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

  const displayComponent = (name) => {
    // Always return null to avoid rendering issues
    let comp;
    if (name === "Daily Progress Note Two") {
      comp = (
        <DailyProgressTwo
          valuesSet="true"
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
      return comp
    } else
      return null;
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
      {displayComponent(form.name ? form.name : form.formType)}
    </>
  );
};

export default ShowFormContainer;