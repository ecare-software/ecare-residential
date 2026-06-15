import React, { useState, useEffect } from "react";
import axios from "axios";

function FosterChecklist({ formData }) {
  const [checklist, setChecklist] = useState({
    courtOrders: false,
    courtSummaries: false,
    birthCertificate: false,
    socialSecurityCard: false,

    levelOfCareAuthorization: false,
    ocokPlacementSummary: false,
    placementAuthorization: false,
    cpsRights: false,
    havenPlacementDocuments: false,
    childHandBookAgreement: false,
    preferredDeEscalation: false,
    personalPropertyInventory: false,
    horchAdmissionRequest: false,

    commonApplication: false,
    childSexualHistory: false,
    certificationReceipt: false,
    admissionTreatmentPlan: false,
    admissionAssessment: false,
    singleChildPlan: false,
    initialServicePlan: false,
    standardReviews: false,
    therapeuticReviews: false,
    servicePlanReview: false,
    familyServicePlan: false,
    eciSpeechTherapy: false,
    permanencyPlanning: false,
    ocokDisruptionNotice: false,
    dischargePlan: false,

    childAdolescent: false,
    psychologicalPsychiatric: false,
    medicalDental: false,
    monthlyTherapyNotes: false,
    mentalHospitalization: false,
    monthlyPsychotropicMedicationLog: false,

    medicalProfessionals: false,
    medicalConsenter: false,
    medicaidCard: false,
    healthcareProvider: false,
    immunizationReports: false,
    tbResults: false,
    medicationTreatmentConsent: false,
    monthlyMedicationLog: false,
    intakeMedication: false,

    schoolInformation: false,
    designationEducation: false,
    schoolEnrollment: false,
    reportCards: false,
    progressReports: false,
    admissonReview: false,
    specialEd: false,
    testingResults: false,
    schoolIncidentReports: false,
    schoolWithdrawlForm: false,
    previousSchoolInformation: false,

    incidentReports: false,
    seriousIncidentReport: false,
    youthStaff: false, 
    triggeredReviews: false,
    unauthorizedAbsence: false,
    absenceTriggered: false,
    shiftLogs:false,
    clothingAllowance: false, 
    clothingInventory: false,

    monthlyContactNotes: false,
    childContactNotes: false,
    safetyPlans: false,

    releaseObtain: false,
    childRequestForm: false,
    youthForTomorrow: false,
  });

  const [checklistId, setChecklistId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
  // const API_URL = "/api/fosterChecklist";
  const API_URL = `${API_BASE}/api/fosterChecklist`;

  // Store uploaded files
  const [uploadedFiles, setUploadedFiles] = useState({
    courtOrders: null,
    courtSummaries: null,
    admissionTreatmentPlan: null,
    monthlyTherapyNotes: {},
    childAdolescent: {},
    psychologicalPsychiatric: {},
  });

  useEffect(() => {
    if (!formData?._id) return;

    const fetchChecklist = async () => {
      console.log("🔵 formData._id being used:", formData?._id);
      console.log("🔵 Request URL:", `${API_URL}/child/${formData?._id}`);
      try {
        const res = await axios.get(`${API_URL}/child/${formData._id}`);

        if (res.data) {
          console.log("🟢 Checklist response:", res.data);
          console.log("🟢 Returned checklist childId:", res.data.childId);
          setChecklistId(res.data._id);
          setChecklist((prev) => ({
            ...prev,
            ...(res.data.checklist || {}),
          }));

          const formattedRecurringUploads = {};

          Object.entries(res.data.recurringUploads || {}).forEach(
            ([fieldName, groups]) => {

              formattedRecurringUploads[fieldName] = {};

              groups.forEach((group) => {
                formattedRecurringUploads[fieldName][group.label] =
                  group.files;
              });
            }
          );

          setUploadedFiles({
            // single uploads
            ...(res.data.uploadedFiles || {}),

            // recurring uploads
            ...formattedRecurringUploads,
          });
          setIsEditing(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchChecklist();
  }, [formData?._id]);

  const getCurrentDateLabel = () => {
  return new Date().toLocaleDateString("default", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

  const handleRecurringUpload = (event, fieldName) => {
    const file = event.target.files[0];
    if (!file) return;

    const label = getCurrentDateLabel();

    const tempFileObj = {
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      mimeType: file.type,
      _isLocal: true,
      rawFile: file,
    };

    setUploadedFiles((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        [label]: prev[fieldName]?.[label]
          ? [...prev[fieldName][label], tempFileObj]
          : [tempFileObj],
      },
    }));

    // ✅ AUTO CHECK CHECKBOX
    setChecklist((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const getCurrentMonth = () => {
    return new Date().toLocaleString("default" , {
      month: "long",
      year:"numeric",
    });
  };

  const handleMonthlyUpload = (event, fieldName) => {
    const file = event.target.files[0];
    if (!file) return;

    const month = getCurrentMonth();

    const tempFileObj = {
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      mimeType: file.type,
      _isLocal: true,
      rawFile: file,
    };

    setUploadedFiles((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        [month]: prev[fieldName]?.[month]
          ? [...prev[fieldName][month], tempFileObj]
          : [tempFileObj],
      },
    }));

    // ✅ AUTO CHECK CHECKBOX
    setChecklist((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  // Modal state
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    setChecklist((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleFileUpload = (event, fieldName) => {
    const file = event.target.files[0];
    if (!file) return;

    const tempFileObj = {
      fileName: file.name,
      fileUrl: URL.createObjectURL(file), // temporary preview
      mimeType: file.type,
      _isLocal: true, // helps us know it's not uploaded yet
      rawFile: file,   // keep actual file for upload
    };

    setUploadedFiles((prev) => ({
      ...prev,
      [fieldName]: [tempFileObj],
    }));

    // ✅ AUTO CHECK CHECKBOX
    setChecklist((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const handleSubmit = async () => {
    try {
      let id = checklistId;

      // 1. CREATE if no checklist exists
      if (!isEditing) {
        const createResponse = await axios.post(API_URL, {
          childId: formData?._id,
          childName: formData?.childMeta_name,
          PlacementDate: formData?.childMeta_dateOfAdmission,
          checklist,
        });

        id = createResponse.data._id;
        setChecklistId(id);
        setIsEditing(true);
      }

      // 2. Upload files (ONLY if they exist)
      const courtOrdersFile = await uploadSingleFile(
        uploadedFiles.courtOrders,
        "courtOrders",
        id
      );

      const courtSummariesFile = await uploadSingleFile(
        uploadedFiles.courtSummaries,
        "courtSummaries",
        id
      );

      const admissionPlanFile = await uploadSingleFile(
        uploadedFiles.admissionTreatmentPlan,
        "admissionTreatmentPlan",
        id
      );

      // 3. Upload recurring
      await uploadRecurringFiles(uploadedFiles.monthlyTherapyNotes, "monthlyTherapyNotes", id);
      await uploadRecurringFiles(uploadedFiles.childAdolescent, "childAdolescent", id);
      await uploadRecurringFiles(uploadedFiles.psychologicalPsychiatric, "psychologicalPsychiatric", id);

      // 4. OPTIONAL (important): update checklist with file references
      await axios.put(`${API_URL}/${id}`, {
        childId: formData?._id,
        childName: formData?.childMeta_name,
        PlacementDate: formData?.childMeta_dateOfAdmission,
        checklist,
        uploadedFiles: {
          courtOrders: courtOrdersFile,
          courtSummaries: courtSummariesFile,
          admissionTreatmentPlan: admissionPlanFile,
        },
      });

      alert("Checklist saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving checklist");
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedFile(null);
    setShowModal(false);
  };

  const handleViewFile = (file) => {
    if (!file) return;

    console.log("🟣 CLICKED FILE OBJECT:", file);

    console.log("🟡 RAW fileUrl:", file?.fileUrl);

    const url = file.fileUrl;

    if (!url) {
      console.error("Missing fileUrl:", file);
      return;
    }

    // LOCAL FILE (before submit)
    if (file._isLocal) {
      setSelectedFile(url);
      setShowModal(true);
      return;
    }

    // const fullUrl = url.startsWith("http")
    //   ? url
    //   : `http://localhost:3001${url}`;

    const fullUrl = url.startsWith("http")
      ? url
      : `${API_BASE}${url}`;

      console.log("🟢 FINAL URL OPENED:", fullUrl);

    setSelectedFile(fullUrl);
    setShowModal(true);
  };


  const uploadSingleFile = async (files, fieldName, checklistId) => {
    if (!files?.length) return null;

    const fileObj = files[0];

    // already uploaded
    if (!fileObj._isLocal) return fileObj;

    const formDataObj = new FormData();
    formDataObj.append("file", fileObj.rawFile);

    const response = await axios.post(
      `${API_URL}/upload/${checklistId}/${fieldName}`,
      formDataObj,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data.uploadedFiles[fieldName][0];
  };

  const uploadRecurringFiles = async (groupedFiles, fieldName, checklistId) => {
    if (!groupedFiles) return;

    for (const [label, files] of Object.entries(groupedFiles)) {
      for (const fileObj of files) {

        if (!fileObj._isLocal) continue;

        const formDataObj = new FormData();
        formDataObj.append("file", fileObj.rawFile);
        formDataObj.append("label", label);

        await axios.post(
          `${API_URL}/recurring-upload/${checklistId}/${fieldName}`,
          formDataObj,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
    }
  };

  return (
    <div
      className="formCompNoBg"
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2
          style={{
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Foster Child File Checklist
        </h2>

        {/* Child Info */}
        <div
          style={{
            display: "flex",
            flexDirection:"column",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <strong>Foster Child:</strong>{" "}
            {formData?.childMeta_name || "________________"}
          </div>

          <div>
            <strong>Placement Date:</strong>{" "}
            {formData?.childMeta_dateOfAdmission || "________________"}
          </div>
        </div>
      </div>

      {/* Section 1 */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h4
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Section 1: Legal Record
        </h4>

        {/* Checklist Items */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="courtOrders"
              checked={checklist.courtOrders}
              onChange={handleCheckboxChange}
            />
            Court Order(s)
          </label>

          <div style={{ marginLeft: "30px" }}>
            <input
              type="file"
              onChange={(e) => handleFileUpload(e, "courtOrders")}
            />

            {uploadedFiles.courtOrders?.[0] && (
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "15px",
                }}
              >
                <span style={{fontWeight:"bold"}}>
                  {uploadedFiles.courtOrders[0].fileName ||
                    uploadedFiles.courtOrders[0].name}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleViewFile(uploadedFiles.courtOrders[0])
                  }
                >
                  View
                </button>
              </div>
            )}
          </div>
       
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="courtSummaries"
              checked={checklist.courtSummaries}
              onChange={handleCheckboxChange}
            />
            Court Summaries [Status Report to the Court (Form 2070).
            Permanency Review Report to the Court (Form 2088b)]
          </label>

          <div style={{ marginLeft: "30px" }}>
            <input
              type="file"
              onChange={(e) =>
                handleFileUpload(e, "courtSummaries")
              }
            />

            {uploadedFiles.courtSummaries?.[0] && (
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "15px",
                }}
              >
                <span style={{fontWeight:"bold"}}>
                  {uploadedFiles.courtSummaries[0].fileName ||
                  uploadedFiles.courtSummaries[0].name}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleViewFile(uploadedFiles.courtSummaries[0])
                  }
                >
                  View
                </button>
              </div>
            )}
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="birthCertificate"
              checked={checklist.birthCertificate}
              onChange={handleCheckboxChange}
            />
            Birth Certificate
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="socialSecurityCard"
              checked={checklist.socialSecurityCard}
              onChange={handleCheckboxChange}
            />
            Social Security Card
          </label>
        </div>
      </div>
      {/* Section 2 */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "25px",
        }}
      >
        <h4
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Section 2: Eligibility/Placement Information
        </h4>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="levelOfCareAuthorization"
              checked={checklist.levelOfCareAuthorization}
              onChange={handleCheckboxChange}
            />
            Level of Care (LOC) Authorization
          </label>

          {/* OCOK Placement Documents */}
          <div
            style={{
              fontWeight: "bold",
              textDecoration: "underline",
              marginTop: "10px",
            }}
          >
            OCOK Placement Documents
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="ocokPlacementSummary"
              checked={checklist.ocokPlacementSummary}
              onChange={handleCheckboxChange}
            />
            OCOK Placement Summary
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="placementAuthorization"
              checked={checklist.placementAuthorization}
              onChange={handleCheckboxChange}
              style={{ marginTop: "5px" }}
            />
            Placement Authorization: Foster Care/Residential - DFPS Form
            K-910-2085FC
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="cpsRights"
              checked={checklist.cpsRights}
              onChange={handleCheckboxChange}
              style={{ marginTop: "5px" }}
            />
            CPS Rights of Children and Youth in Foster Care - DFPS Form
            K-908-2530
          </label>

          {/* Haven of Rest Care Placement Documents */}
          <div
            style={{
              fontWeight: "bold",
              textDecoration: "underline",
              marginTop: "15px",
            }}
          >
            Haven of Rest Care Placement Documents
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="havenPlacementDocuments"
              checked={checklist.havenPlacementDocuments}
              onChange={handleCheckboxChange}
              style={{ marginTop: "5px" }}
            />
            Haven of Rest Care Home Placement Documents + Placement Medical
            Consent Authorization
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="childHandBookAgreement"
              checked={checklist.childHandBookAgreement}
              onChange={handleCheckboxChange}
              style={{ marginTop: "5px" }}
            />
            Child Handbook Agreement + Children's Rights/Behavior Intervention
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="preferredDeEscalation"
              checked={checklist.preferredDeEscalation}
              onChange={handleCheckboxChange}
            />
            Preferred De-escalation Technique
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="personalPropertyInventory"
              checked={checklist.personalPropertyInventory}
              onChange={handleCheckboxChange}
            />
            Personal Property Inventory Report
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="horchAdmissionRequest"
              checked={checklist.horchAdmissionRequest}
              onChange={handleCheckboxChange}
            />
            HORCH Child Admission Record Document Request Form
          </label>
        </div>
      </div>
      {/* Section 3 */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "25px",
        }}
      >
        <h4
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Section 3: Intake/Service Plan Information
        </h4>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="commonApplication"
              checked={checklist.commonApplication}
              onChange={handleCheckboxChange}
            />
            Common Application (2087/2087ex)
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="childSexualHistory"
              checked={checklist.childSexualHistory}
              onChange={handleCheckboxChange}
              style={{ marginTop: "5px" }}
            />
            Form K-908-2279, Child Sexual History Report (Attachment A)
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="certificationReceipt"
              checked={checklist.certificationReceipt}
              onChange={handleCheckboxChange}
              style={{ marginTop: "5px" }}
            />
            Form K-908-2279b, Certification of Receipt of CSA Information
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="admissionTreatmentPlan"
              checked={checklist.admissionTreatmentPlan}
              onChange={handleCheckboxChange}
            />
            72 Hour Admission Assessment/Treatment Plan
          </label>

           <div style={{ marginLeft: "30px" }}>
            <input
              type="file"
              onChange={(e) => handleFileUpload(e, "admissionTreatmentPlan")}
            />

            {uploadedFiles.admissionTreatmentPlan?.[0] && (
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "15px",
                }}
              >
                <span style={{fontWeight:"bold"}}>
                  {uploadedFiles.admissionTreatmentPlan[0].fileName ||
                    uploadedFiles.admissionTreatmentPlan[0].name}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleViewFile(uploadedFiles.admissionTreatmentPlan[0])
                  }
                >
                  View
                </button>
              </div>
            )}
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="admissionAssessment"
              checked={checklist.admissionAssessment}
              onChange={handleCheckboxChange}
            />
            Admission/Diagnostic/Intake Assessment
          </label>

          {/* Main Parent Checkbox */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            <input
              type="checkbox"
              name="singleChildPlan"
              checked={checklist.singleChildPlan}
              onChange={handleCheckboxChange}
              style={{ marginTop: "5px" }}
            />
            DFPS Form K-908-3300I Single Child's Plan of Service
          </label>

          {/* Sub Checklist Items */}
          <div
            style={{
              marginLeft: "30px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "5px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="initialServicePlan"
                checked={checklist.initialServicePlan}
                onChange={handleCheckboxChange}
                style={{ marginTop: "5px" }}
              />
              Initial Service Plan (within 30 days of placement)
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="standardReviews"
                checked={checklist.standardReviews}
                onChange={handleCheckboxChange}
                style={{ marginTop: "5px" }}
              />
              Standard (Basic & Moderate) Reviews - (after initial: 1st:
              90-days; 2nd: 90-days; Others: every 180-days)
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="therapeuticReviews"
                checked={checklist.therapeuticReviews}
                onChange={handleCheckboxChange}
                style={{ marginTop: "5px" }}
              />
              Therapeutic (Specialized and Intense, PHBC or EC) Reviews -
              (every 90-days after initial)
            </label>
          </div>

          {/* Back to normal checklist */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            <input
              type="checkbox"
              name="servicePlanReview"
              checked={checklist.servicePlanReview}
              onChange={handleCheckboxChange}
            />
            Service Plan Review
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="familyServicePlan"
              checked={checklist.familyServicePlan}
              onChange={handleCheckboxChange}
              style={{ marginTop: "5px" }}
            />
            Family Service Plan / IMPACT Child Service Plan
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="eciSpeechTherapy"
              checked={checklist.eciSpeechTherapy}
              onChange={handleCheckboxChange}
            />
            ECI/Speech Therapy Notes/Other Services
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="permanencyPlanning"
              checked={checklist.permanencyPlanning}
              onChange={handleCheckboxChange}
              style={{ marginTop: "5px" }}
            />
            Permanency Planning Conferences / Circle of Support /
            Preparation for Adult Living
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="ocokDisruptionNotice"
              checked={checklist.ocokDisruptionNotice}
              onChange={handleCheckboxChange}
              style={{ marginTop: "5px" }}
            />
            OCOK Residential Child Care Disruption-Discharge Notice
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="dischargePlan"
              checked={checklist.dischargePlan}
              onChange={handleCheckboxChange}
            />
            Discharge Plan
          </label>
        </div>
      </div>
      {/* Section 4 */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "25px",
        }}
      >
        <h4
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Section 4: Psychological/Psychiatric Information
        </h4>

        {/* Checklist Items */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="childAdolescent"
              checked={checklist.childAdolescent}
              onChange={handleCheckboxChange}
            />
            Child and Adolescent Needs and Strengths (CANS) Assessment
          </label>

          <div
            style={{
              marginLeft: "30px",
              marginTop: "10px",
            }}
          >
            <input
              type="file"
              onChange={(e) =>
                handleRecurringUpload(e, "childAdolescent")
              }
            />

            <div style={{ marginTop: "20px" }}>
              {Object.entries(
                uploadedFiles.childAdolescent || {}
              ).map(([date, files]) => (
                <div
                  key={date}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <h5>{date}</h5>

                  {files.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{fontWeight:"bold"}}>{file.fileName || file.name}</span>

                      <button
                        type="button"
                        onClick={() => handleViewFile(file)}
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            name="psychologicalPsychiatric"
            checked={checklist.psychologicalPsychiatric}
            onChange={handleCheckboxChange}
          />
          Psychological/Psychiatric Evaluation/Assessment
        </label>

        <div
          style={{
            marginLeft: "30px",
            marginTop: "10px",
          }}
        >
          <input
            type="file"
            onChange={(e) =>
              handleRecurringUpload(
                e,
                "psychologicalPsychiatric"
              )
            }
          />

          <div style={{ marginTop: "20px" }}>
            {Object.entries(
              uploadedFiles.psychologicalPsychiatric || {}
            ).map(([date, files]) => (
              <div
                key={date}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "15px",
                }}
              >
                <h5>{date}</h5>

                {files.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{fontWeight:"bold"}}>{file.fileName || file.name}</span>

                    <button
                      type="button"
                      onClick={() => handleViewFile(file)}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="medicalDental"
              checked={checklist.medicalDental}
              onChange={handleCheckboxChange}
            />
            Medical, Dental, Vision, Hearing, or Behavioral Health Appointment - DFPS Form K-905-2403
            + attached printout directly from health care providers: + Psychological/Psychiatric Monthly Reports 
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="monthlyTherapyNotes"
              checked={checklist.monthlyTherapyNotes}
              onChange={handleCheckboxChange}
            />
            Monthly Therapy Notes
          </label>

          <div
            style={{
              marginLeft: "30px",
              marginTop: "10px",
            }}
          >
            {/* Upload */}
            <input
              type="file"
              onChange={(e) =>
                handleMonthlyUpload(e, "monthlyTherapyNotes")
              }
            />

            {/* Previous Months */}
            <div style={{ marginTop: "20px" }}>
              {Object.entries(
                uploadedFiles.monthlyTherapyNotes || {}
              ).map(([month, files]) => (
                <div
                  key={month}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <h5>{month}</h5>

                  {files.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <span style={{fontWeight:"bold"}}>{file.fileName || file.name}</span>

                      <button
                        type="button"
                        onClick={() => handleViewFile(file)}
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="monthlyPsychotropicMedicationLog"
              checked={checklist.monthlyPsychotropicMedicationLog}
              onChange={handleCheckboxChange}
            />
            Monthly Psychotropic Medication Log
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="mentalHospitalization"
              checked={checklist.mentalHospitalization}
              onChange={handleCheckboxChange}
            />
            Mental Health/Psychiatric Hospitalization 
          </label>
        </div>
      </div>
      {/* Section 5 */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "25px",
        }}
      >
        <h4
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Section 5: Medical/Dental/Vision Information
        </h4>

        {/* Checklist Items */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="medicalProfessionals"
              checked={checklist.medicalProfessionals}
              onChange={handleCheckboxChange}
            />
            Medical Professional(s) Information Form
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="medicalConsenter"
              checked={checklist.medicalConsenter}
              onChange={handleCheckboxChange}
            />
            Attachment B - Designation of Medical Consenter - DFPS Form 
            K-910-2085B
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="medicaidCard"
              checked={checklist.medicaidCard}
              onChange={handleCheckboxChange}
            />
            Medicaid Card 
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="healthcareProvider"
              checked={checklist.healthcareProvider}
              onChange={handleCheckboxChange}
            />
            Medical, Dental, Vision, Hearing, or Behavioral Health Appointment - DFPS 
            Form K-905-2403 + attached printout directly from health care providers:
            + Medical Service (emergency room, scheduled apt.) 
            + Eye Examination Report(s) - Annual 
            + Dental Examination Report(s) - Bi-Annually 
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="immunizationReports"
              checked={checklist.immunizationReports}
              onChange={handleCheckboxChange}
            />
            Immunization Report(s)
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="tbResults"
              checked={checklist.tbResults}
              onChange={handleCheckboxChange}
            />
            TB Test Result(s)
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="medicationTreatmentConsent"
              checked={checklist.medicationTreatmentConsent}
              onChange={handleCheckboxChange}
            />
            DFPS Form 4526 Psychotropic Medication Treatment Consent 
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="monthlyMedicationLog"
              checked={checklist.monthlyMedicationLog}
              onChange={handleCheckboxChange}
            />
            Monthly Medication Log 
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="intakeMedication"
              checked={checklist.intakeMedication}
              onChange={handleCheckboxChange}
            />
            Intake Medication(s) List / Medication Schedule
          </label>
        </div>
      </div>

      {/* Section 6 */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "25px",
        }}
      >
        <h4
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Section 6: Education information  
        </h4>

        {/* Checklist Items */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="schoolInformation"
              checked={checklist.schoolInformation}
              onChange={handleCheckboxChange}
            />
            School Information Form
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="designationEducation"
              checked={checklist.designationEducation}
              onChange={handleCheckboxChange}
            />
            Designation of Education Descision-Maker - DFPS FORM K-908-2085-E
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="schoolEnrollment"
              checked={checklist.schoolEnrollment }
              onChange={handleCheckboxChange}
            />
            School Enrollment/Register Form 
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="reportCards"
              checked={checklist.reportCards}
              onChange={handleCheckboxChange}
            />
            Report Card(s)
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="progressReports"
              checked={checklist.progressReports}
              onChange={handleCheckboxChange}
            />
            Progress Reports
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="admissonReview"
              checked={checklist.admissonReview}
              onChange={handleCheckboxChange}
            />
            Admisson Review & Dismissal (ARD) info. 
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="specialEd"
              checked={checklist.specialEd}
              onChange={handleCheckboxChange}
            />
            Education Reports (Including Sepacial Ed)
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="testingResults"
              checked={checklist.testingResults}
              onChange={handleCheckboxChange}
            />
            Education Testing Results 
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="schoolIncidentReports"
              checked={checklist.schoolIncidentReports}
              onChange={handleCheckboxChange}
            />
            School Incident Reports
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="schoolWithdrawlForm"
              checked={checklist.schoolWithdrawlForm}
              onChange={handleCheckboxChange}
            />
            School Withdrawl Form(s)
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="previousSchoolInformation"
              checked={checklist.previousSchoolInformation}
              onChange={handleCheckboxChange}
            />
            Previous School Information 
          </label>
        </div>
      </div>

      {/* Section 7 */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "25px",
        }}
      >
        <h4
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Section 7: Staff Documentation   
        </h4>

        {/* Checklist Items */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="incidentReports"
              checked={checklist.incidentReports}
              onChange={handleCheckboxChange}
            />
            Incident Reports 
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="seriousIncidentReport"
              checked={checklist.seriousIncidentReport}
              onChange={handleCheckboxChange}
            />
            OCOK Serious Incident Reports (Serious)
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="youthStaff"
              checked={checklist.youthStaff}
              onChange={handleCheckboxChange}
            />
            HORCH EBI restraint Form + Youth and Staff Debriefing  
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="triggeredReviews"
              checked={checklist.triggeredReviews}
              onChange={handleCheckboxChange}
            />
            Emergency Behavior Intervention (EBI) Triggered Review(s)
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="unauthorizedAbsence"
              checked={checklist.unauthorizedAbsence}
              onChange={handleCheckboxChange}
            />
            HORCH Unauthorized Absence Debriefing Form(s)
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="absenceTriggered"
              checked={checklist.absenceTriggered}
              onChange={handleCheckboxChange}
            />
            HORCH Unauthorized Absence Triggered Review(s)
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="shiftLogs"
              checked={checklist.shiftLogs}
              onChange={handleCheckboxChange}
            />
            Shift Logs
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="clothingAllowance"
              checked={checklist.clothingAllowance}
              onChange={handleCheckboxChange}
            />
            Monthly Clothing/Allowance Form
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="clothingInventory"
              checked={checklist.clothingInventory}
              onChange={handleCheckboxChange}
            />
            Quaterly Clothing Inventory Updates 
          </label>
        </div>
      </div>

       {/* Section 8 */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "25px",
        }}
      >
        <h4
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Section 8: PLSP/Case Management Documentation   
        </h4>

        {/* Checklist Items */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="monthlyContactNotes"
              checked={checklist.monthlyContactNotes}
              onChange={handleCheckboxChange}
            />
            Monthly Contact Notes  
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="childContactNotes"
              checked={checklist.childContactNotes}
              onChange={handleCheckboxChange}
            />
            Child File Contact Notes
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="safetyPlans"
              checked={checklist.safetyPlans}
              onChange={handleCheckboxChange}
            />
            Supervision Plans/Safety Plans
          </label>
        </div>
      </div>

      {/* Section 9 */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "25px",
        }}
      >
        <h4
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Section 9: Miscellaneous/Correspondences 
        </h4>

        {/* Checklist Items */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="releaseObtain"
              checked={checklist.releaseObtain}
              onChange={handleCheckboxChange}
            />
            HORCH Authorization to Release or Obtain Child Information  
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="childRequestForm"
              checked={checklist.childRequestForm}
              onChange={handleCheckboxChange}
            />
            HORCH Child Record Monthly Document Request Form 
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="youthForTomorrow"
              checked={checklist.youthForTomorrow}
              onChange={handleCheckboxChange}
            />
            OCOK/Youth-for-Tomorrow Correspondences
          </label>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginTop: "30px",
          marginBottom: "20px",
        }}
      >
        {/* <button
          className="lightBtn"
          // onClick={() => {
          //   console.log("Update clicked");
          // }}
          onClick={handleUpdate}
        >
          Update
        </button> */}

        <button
          className="darkBtn"
          // onClick={() => {
          //   console.log("Submit clicked");
          // }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "80%",
              height: "80%",
              background: "#fff",
              borderRadius: "10px",
              padding: "20px",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              X
            </button>

            {/* File Viewer */}
            <iframe
              src={selectedFile}
              title="Document Viewer"
              width="100%"
              height="100%"
              style={{
                border: "none",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FosterChecklist;