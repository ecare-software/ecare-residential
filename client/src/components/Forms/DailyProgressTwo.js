import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Container, Form } from "react-bootstrap";
import "../../App.css";
import ClientOption from "../../utils/ClientOption.util";
import axios from "axios";
import Cookies from "universal-cookie";
import ReactSignatureCanvas from "react-signature-canvas";
import { 
    mapDailyIntake, 
    mapRecTherapeuticActivity,  
    mapLevelOfPrecaution,
    mapHygieneCompleted,
    mapDailyChoresCompleted,
    mapMedicationCompliance,
    mapStaffIntervention,
    mapResidentBehaviorPerformance,
    mapStaffInitials,
    mapTimeline
} from "../../utils/formDataMapper";

const cookies = new Cookies();
const BOX_WIDTH = 120;
const userObj = cookies.get("userObj");

const DailyProgressTwo = () => {
  const [formData, setFormData] = useState({
    createDate: "",
    clients: [],
    clientId: "",
    _id: "",
    lastEditDate: "",
    childSelected: false,
    approved: false,               // ✅ add this
    childMeta_name: "",            // ✅ add this
    createdByName: userObj
      ? `${userObj.firstName} ${userObj.lastName}` // ✅ add this
      : "",   
    status: "IN_PROGRESS",
  });

  const [shiftSummary, setShiftSummary] = useState({ shift1: "", shift2: "", shift3: "" });
  const [clothingDescription, setClothingDescription] = useState({ shirtBottoms: "", shoes: "", other: "" });
  const [initials, setInitials] = useState(["", "", ""]);
  const [titles, setTitles] = useState(["", "", ""]);

  // const userObj = cookies.get("userObj");
  const currentShift = userObj?.shift || "shift1";

  useEffect(() => {
    const fetchClients = async () => {
      if (!userObj?.homeId) return;
      try {
        const { data } = await axios.get(`/api/client/${userObj.homeId}?active=true`);
        const activeClients = data.filter(
          (client) => !client.hasOwnProperty("active") || client.active === true
        );
        setFormData((prev) => ({ ...prev, clients: activeClients }));
      } catch (error) {
        console.error("Error fetching clients:", error);
        alert("Error loading clients");
      }
    };
    fetchClients();
  }, []);

  const handleFieldInputDate = (event) => {
    const value = event?.target?.value || "";
    const id = event?.target?.id;
    if (id) setFormData((prev) => ({ ...prev, [id]: value ? `${value}:00.000Z` : "" }));
  };

  const handleClientSelect = (event) => {
    const value = event.target.value;
    if (value) {
      const client = JSON.parse(value);
      setFormData(prev => ({
        ...prev,
        clientId: client._id,
        child: { childId: client._id, name: client.childMeta_name },
        childSelected: true,
        clientSelectedValue: value,
        childMeta_name: client.childMeta_name,  // ✅ add this
      }));

      // fetchLatestReportForClient(client._id);
    } else {
      setFormData(prev => ({
        ...prev,
        clientId: "",
        child: null,
        childSelected: false,
        clientSelectedValue: "",
      }));
    }
  };

  const initCheckState = (rows) => rows.map(() => Array(3).fill(false));
  const toggleCheck = (setFn) => (rowIndex, colIndex) =>
    setFn((prev) => {
      const updated = [...prev];
      updated[rowIndex][colIndex] = !updated[rowIndex][colIndex];
      return updated;
    });

  const labels = {
    levelOfPrecaution: ["LEVEL OF PRECAUTION:", "Visual:", "Suicidal:", "Homicidal:", "1:1:", "AWOL:"],
    hygiene: ["HYGIENE COMPLETED:", "Yes:", "Refused:", "Needed Assistance:"],
    dailyChores: ["DAILY CHORES COMPLETED:", "Yes:", "Needed Prompting:", "Refused:"],
    medicationCompliance: ["MEDICATION COMPLIANCE:", "Yes:", "Needed Prompting:", "Medication Teaching:"],
    dailyIntake: ["DAILY INTAKE", "Breakfast", "Lunch", "Dinner"],
    staffIntervention: [
      "STAFF INTERVENTION:",
      "Supporting/Encouraging by giving positive feedback:",
      "Redirects for disrupting conversation in group or activity:",
    ],
    residentBehavior: [
      "RESIDENT BEHAVIOR PERFORMANCE:",
      "Receptive to information from staff & peers:",
      "Enthusiastic and helpful to others:",
      "Identifies potential solutions for problem solving:",
      "Participates well in group/activities:",
      "Follows instructions well:",
      "Destruction of property:",
      "Physical Aggression towards others:",
      "Temper Outburst:",
      "Non-Compliance with program/house rules:",
      "Verbal Aggression towards peers:",
      "Verbal aggression towards staff:",
      "Sexual Misconduct:",
      "Limited Eye Contact:",
      "Refuse to Process with Staff:",
      "Inappropriate Behavior Conversation:",
      "Self-injurious behavior:",
      "Isolation:",
      "Bullies/Mean to others:",
      "Peer Interaction Issues:",
      "Cursing/Profanity:",
      "Acts Fearful:",
      "Demanding for Attention:",
      "Lies/Manipulation:",
      "Passive Aggressive:",
      "Stealing:",
      "Agitates others:",
      "Sudden Mood Changes:",
      "Not Following Directions:",
      "Disruptive Behavior:",
    ],
    recTherapeutic: [
      "RECREATIONAL/THERAPEUTIC ACTIVITY:",
      "Activity Exercise with trainer/Interactive games:",
      "Participation:",
      "Peer Interaction:",
      "Why is this activity therapeutic for this resident?",
      "Physical/Fitness Peer Interaction:",
    ],
    timeTable: [
      "9:00PM",
      "9:15PM:",
      "9:30PM:",
      "9:45PM:",
      "10:00PM",
      "10:15PM",
      "10:30PM",
      "10:45PM",
      "11:00PM",
      "11:15PM",
      "11:30PM",
      "11:45PM",
      "12:00AM",
      "12:15AM",
      "12:30AM",
      "12:45AM",
      "1:00AM",
      "1:15AM",
      "1:30AM",
      "1:45AM",
      "2:00AM",
      "2:15AM",
      "2:30AM",
      "2:45AM",
      "3:00AM",
      "3:15AM",
      "3:30AM",
      "3:45AM",
      "4:00AM",
      "4:15AM",
      "4:30AM",
      "4:45AM",
      "5:00AM",
      "5:15AM",
      "5:30AM",
      "5:45AM",
      "6:00AM",
      "6:15AM"
    ]
  };

  const [checked, setChecked] = useState(initCheckState(labels.levelOfPrecaution.slice(1)));
  const [hygieneChecked, setHygieneChecked] = useState(initCheckState(labels.hygiene.slice(1)));
  const [dailyChoresChecked, setDailyChoresChecked] = useState(initCheckState(labels.dailyChores.slice(1)));
  const [medicationChecked, setMedicationChecked] = useState(initCheckState(labels.medicationCompliance.slice(1)));
  const [residentChecked, setResidentChecked] = useState(initCheckState(labels.residentBehavior.slice(1)));
  const [recChecked, setRecChecked] = useState(initCheckState(labels.recTherapeutic.slice(1)));
  const [staffInterventionChecked, setStaffInterventionChecked] = useState(initCheckState(labels.staffIntervention.slice(1)));

  const [timeline, setTimeline] = useState(
    labels.timeTable.map(() => Array(3).fill("")) // 2D array: row x shift
  );

  const [dailyIntake, setDailyIntake] = useState(
    labels.dailyIntake.slice(1).map(() => Array(3).fill(""))
  );
  const dailyIntakeOptions = ["Yes", "Refused"];
  const handleDailyIntakeChange = (rowIndex, colIndex, value) => {
    setDailyIntake((prev) => {
      const updated = [...prev];
      updated[rowIndex][colIndex] = value || "";
      return updated;
    });
  };

  const [recActivityRadios, setRecActivityRadios] = useState([
    ["", "", ""], 
    ["", "", ""]  
  ]);

  const handleRecActivityChange = (rowKey, colIndex, value) => {
    setRecActivityRadios((prev) => {
      const updated = [...prev];
      updated[rowKey][colIndex] = value; 
      return updated;
    });
  };

  const toggleLevelOfPrecaution = toggleCheck(setChecked);
  const toggleHygieneCheck = toggleCheck(setHygieneChecked);
  const toggleDailyChoresCheck = toggleCheck(setDailyChoresChecked);
  const toggleMedicationCheck = toggleCheck(setMedicationChecked);
  const toggleResidentCheck = toggleCheck(setResidentChecked);
  const toggleRecCheck = toggleCheck(setRecChecked);
  const toggleStaffInterventionCheck = toggleCheck(setStaffInterventionChecked);

  const sigRefs = useRef([null, null, null]);

  // ----- SAVE / SUBMIT -----
  const handleSave = async (action) => {
  try {
    let reportId = formData._id;

    // Try to fetch latest draft if no reportId exists
    if (!reportId && formData.clientId) {
      try {
        const { data: latestDraft } = await axios.get(
          `/api/dailyProgressNoteTwo/latest/${formData.clientId}`
        );
        if (latestDraft) reportId = latestDraft._id;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // No draft exists yet — that's fine, will create a new one
          reportId = undefined;
        } else {
          console.error("Error fetching latest draft:", err);
          alert("Error fetching latest draft");
          return; // stop saving if other errors occur
        }
      }
    }

    const safeEnum = (val) => (val === "" ? undefined : val);

    const payload = {
      homeId: userObj?.homeId,
      child: formData.child,
      childMeta_name: formData.childMeta_name,  // ✅ add this
      approved: formData.approved, 
      shiftSummary,
      clothingDescription,
      signatureSection: {
        signatures: sigRefs.current.map((sig) =>
          sig ? sig.getTrimmedCanvas().toDataURL() : ""
        ),
        initials,
        titles,
      },
      recTherapeuticActivity: {
        ...mapStaffInitials(initials),
        ...mapRecTherapeuticActivity({
          radiosArr: recActivityRadios,
          checkmarksData: {
            arr: recChecked,
            labels: labels.recTherapeutic.slice(1),
          },
        }),
      },
      levelOfPrecaution: {
        ...mapStaffInitials(initials),
        ...mapLevelOfPrecaution(checked),
      },
      hygieneCompleted: {
        ...mapStaffInitials(initials),
        ...mapHygieneCompleted(hygieneChecked),
      },
      dailyChoresCompleted: {
        ...mapStaffInitials(initials),
        ...mapDailyChoresCompleted(dailyChoresChecked),
      },
      medicationCompliance: {
        ...mapStaffInitials(initials),
        ...mapMedicationCompliance(medicationChecked),
      },
      dailyIntake: {
        ...mapStaffInitials(initials),
        ...mapDailyIntake(dailyIntake),
      },
      staffIntervention: {
        ...mapStaffInitials(initials),
        ...mapStaffIntervention(staffInterventionChecked),
      },
      residentBehaviorPerformance: {
        ...mapStaffInitials(initials),
        ...mapResidentBehaviorPerformance(residentChecked),
      },
      timeline: mapTimeline(labels.timeTable, timeline),
      submitted: currentShift === "shift3" && action === "submit",

       // 🔹 ADD THESE TWO
      formType: "Daily Progress Note Two",
      createdBy: userObj?.email || "unknown", // or userObj.email/id depending on your auth
      createdByName: userObj ? `${userObj.firstName} ${userObj.lastName}` : "",
      status: formData.status,
      lastEditDate: new Date().toISOString(),
    };

    if (reportId) {
      // Update existing report
      await axios.put(`/api/dailyProgressNoteTwo/${reportId}`, payload);
    } else {
      // Create new report
      const { data: newReport } = await axios.post(
        "/api/dailyProgressNoteTwo",
        { ...payload, clientId: formData.clientId }
      );
      // Store the new _id so future saves update this report
      setFormData((prev) => ({ ...prev, _id: newReport._id }));
    }

    alert(action === "submit" ? "Form submitted successfully!" : "Draft saved successfully!");
  } catch (err) {
    console.error("Error saving form:", err);
    alert("Error saving form. Check console for details.");
  }
};


  return (
    <Container fluid className="formComp d-flex justify-content-center" style={{ minHeight: "100vh", padding: "40px 0" }}>
      <div style={{ width: "100%", maxWidth: "1000px" }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold mb-0">Saving Home RTC</h3>
          <h4 className="fw-semibold">Daily Progress Note</h4>
        </div>

        {/* Date/Time */}
        <div className="form-group logInInputField d-flex justify-content-center">
          <div style={{ width: "650px" }}>
            <label className="control-label">Create Date</label>
            <input
              onChange={handleFieldInputDate}
              id="createDate"
              value={formData.createDate ? formData.createDate.slice(0, -8) : ""}
              className="form-control"
              type="datetime-local"
              style={{ height: "43px", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Child Selector */}
        <div className="form-group logInInputField d-flex justify-content-center">
          <div style={{ width: "650px" }}>
            <label className="control-label">Child's Name</label>
            <Form.Control
              as="select"
              value={formData.clientSelectedValue || ""} 
              onChange={handleClientSelect}
              style={{ height: "43px", boxSizing: "border-box" }}
            >
              <option value="">Select Child</option>
              {formData.clients.map((client, index) => (
                <ClientOption key={index} data={client} />
              ))}
            </Form.Control>
          </div>
        </div>

        {/* Main Form Sections */}
        <Form className="d-flex flex-column align-items-center">
          {[
            { title: "Level of Precaution", labels: labels.levelOfPrecaution, checkState: checked, toggleFn: toggleLevelOfPrecaution },
            { title: "Hygiene Completed", labels: labels.hygiene, checkState: hygieneChecked, toggleFn: toggleHygieneCheck },
            { title: "Daily Chores Completed", labels: labels.dailyChores, checkState: dailyChoresChecked, toggleFn: toggleDailyChoresCheck },
            { title: "Medication Compliance", labels: labels.medicationCompliance, checkState: medicationChecked, toggleFn: toggleMedicationCheck },
            { title: "Daily Intake", labels: labels.dailyIntake, checkState: dailyIntake, isRadio: true, options: dailyIntakeOptions, onRadioChange: handleDailyIntakeChange },
            { title: "Staff Intervention", labels: labels.staffIntervention, checkState: staffInterventionChecked, toggleFn: toggleStaffInterventionCheck },
            { title: "Resident Behavior Performance", labels: labels.residentBehavior, checkState: residentChecked, toggleFn: toggleResidentCheck },
            { title: "Recreational/Therapeutic Activity", labels: labels.recTherapeutic, checkState: recChecked, toggleFn: toggleRecCheck,onRadioChange: handleRecActivityChange },
            { title: "Time Table", labels: labels.timeTable, checkState: initCheckState(labels.timeTable.slice(1)), toggleFn: null, isRadio: false, }, // New Section
          ].map((section, idx) => (
            <div key={idx} className="d-flex justify-content-center" style={{ width: "100%" }}>
              <div style={{ width: "650px" }}>
                <ShiftTable {...section} sectionTitle={section.title} onRadioChange={section.onRadioChange} recActivityRadios={recActivityRadios} setRecActivityRadios={setRecActivityRadios} timeline={timeline} setTimeline={setTimeline} />
              </div>
            </div>
          ))}

          <ShiftSummary shiftSummary={shiftSummary} setShiftSummary={setShiftSummary} />
          <ClothingDescription clothingDescription={clothingDescription} setClothingDescription={setClothingDescription} />
          <SignatureSection sigRefs={sigRefs} initials={initials} setInitials={setInitials} titles={titles} setTitles={setTitles} />

          <div className="d-flex justify-content-between" style={{ marginTop: "30px", width: "650px" }}>
            <button type="button" className="lightBtn" style={{ width: "48%" }} onClick={() => handleSave("draft")} disabled={currentShift === "shift3"}>
              Finish Later
            </button>
            <button type="button" className="darkBtn" style={{ width: "48%" }} onClick={() => handleSave("submitted")} disabled={currentShift !== "shift3"}>
              Submit
            </button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

// ---- ShiftTable ----
const ShiftTable = ({ labels, checkState, toggleFn, isRadio = false, options = [], onRadioChange, sectionTitle, recActivityRadios, setRecActivityRadios, timeline, setTimeline}) => {
  const rowRefs = useRef([]);
  const [rowHeights, setRowHeights] = useState([]);

  useLayoutEffect(() => {
    if (rowRefs.current.length) {
      const heights = rowRefs.current.map((row) => (row ? row.getBoundingClientRect().height : 43));
      setRowHeights(heights);
    }
  }, []);

  const recCheckmarkLabels = [
    "Activity Exercise with trainer/Interactive games:",
    "Why is this activity therapeutic for this resident?",
    "Physical/Fitness Peer Interaction:",
  ];

  return (
    <div style={{ marginTop: "20px", width: "100%" }}>
      {/* Header */}
      <div className="d-flex">
        <div
          style={{
            width: "260px",
            minHeight: "43px",
            textAlign: "center",
            fontWeight: "600",
            lineHeight: "1.2",
            border: "1px solid #ccc",
            backgroundColor: "#e9ecef",
            boxSizing: "border-box",
            padding: "5px",
            wordBreak: "break-word",
          }}
        >
          SHIFTS
        </div>
        {["1st", "2nd", "3rd"].map((shift, i) => (
          <div
            key={i}
            style={{
              width: BOX_WIDTH,
              minHeight: "43px",
              textAlign: "center",
              fontWeight: "600",
              lineHeight: "1.2",
              border: "1px solid #ccc",
              backgroundColor: "#e9ecef",
              boxSizing: "border-box",
              padding: "5px",
            }}
          >
            {shift}
          </div>
        ))}
      </div>

      {/* Rows */}
      {labels.map((label, rowIndex) => {
        const rowHeight = rowHeights[rowIndex] || 43;
        let inputType = "checkmark";

        // ---- Determine input type ----
        if(sectionTitle === "Time Table") {
          inputType = "text";
        }
        else if (rowIndex === 0) {
          inputType = "text";
        } else if (sectionTitle === "Recreational/Therapeutic Activity") {
          if (["Participation:", "Peer Interaction:"].includes(label)) {
            inputType = "radio";
          } else if (recCheckmarkLabels.includes(label)) {
            inputType = "checkmark";
          }
        } else if (isRadio) {
          inputType = "radio";
        }

        return (
          <div key={rowIndex} className="d-flex" ref={(el) => (rowRefs.current[rowIndex] = el)}>
            {/* Label */}
            <div
              style={{
                width: "260px",
                minHeight: rowHeight,
                padding: "5px 10px",
                fontWeight: "600",
                border: "1px solid #ccc",
                backgroundColor: "#f8f9fa",
                display: "flex",
                alignItems: "center",
                wordBreak: "break-word",
              }}
            >
              {label}
            </div>

            {/* Cells */}
            {Array.from({ length: 3 }).map((_, colIndex) => {
              const sharedStyle = {
                width: BOX_WIDTH,
                height: rowHeight,
                padding: "5px 8px",
                border: "1px solid #ccc",
                textAlign: "center",
                boxSizing: "border-box",
              };

              if (inputType === "text") {
                if (sectionTitle === "Time Table") {
                  return (
                    <input
                      key={colIndex}
                      type="text"
                      style={sharedStyle}
                      value={timeline[rowIndex]?.[colIndex] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTimeline((prev) => {
                          const updated = [...prev];
                          updated[rowIndex] = [...(updated[rowIndex] || [])];
                          updated[rowIndex][colIndex] = val;
                          return updated;
                        });
                      }}
                    />
                  );
                }
                return <input key={colIndex} type="text" style={sharedStyle} />;
              }

              if (inputType === "radio") {
                // For Daily Intake
                if (sectionTitle === "Daily Intake") {
                  const intakeRowIndex = rowIndex - 1; // subtract 1 because first row is header
                  return (
                    <select
                      key={colIndex}
                      value={checkState[intakeRowIndex]?.[colIndex] || ""}
                      onChange={(e) => onRadioChange(intakeRowIndex, colIndex, e.target.value)}
                      style={{ ...sharedStyle, backgroundColor: "#fff" }}
                    >
                      <option value="">Select</option>
                      {options.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  );
                }

                // For Recreational Activity (Participation/Peer Interaction)
                const radioOptions =
                  label === "Participation:" ? ["Yes", "No", "Prompting"]
                  : label === "Peer Interaction:" ? ["Excellent", "Good", "Poor"]
                  : options;

                let valueArray, setterFn;
                if (sectionTitle === "Recreational/Therapeutic Activity") {
                  if (label === "Participation:") {
                    valueArray = recActivityRadios[0];
                    setterFn = (colIndex, val) => {
                      setRecActivityRadios((prev) => {
                        const updated = [...prev];
                        updated[0][colIndex] = val;
                        return updated;
                      });
                    };
                  } else if (label === "Peer Interaction:") {
                    valueArray = recActivityRadios[1];
                    setterFn = (colIndex, val) => {
                      setRecActivityRadios((prev) => {
                        const updated = [...prev];
                        updated[1][colIndex] = val;
                        return updated;
                      });
                    };
                  }
                }

                return (
                  <select
                    key={colIndex}
                    value={valueArray?.[colIndex] || ""}
                    onChange={(e) => setterFn && setterFn(colIndex, e.target.value)}
                    style={{ ...sharedStyle, backgroundColor: "#fff" }}
                  >
                    <option value="">Select</option>
                    {radioOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                );
              }

              // Default checkmark
              const isChecked = checkState[rowIndex - 1]?.[colIndex] || false;
              return (
                <div
                  key={colIndex}
                  onClick={() => toggleFn && toggleFn(rowIndex - 1, colIndex)}
                  style={{
                    ...sharedStyle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: toggleFn ? "pointer" : "default",
                    backgroundColor: isChecked ? "#d4edda" : "#fff",
                    fontSize: "18px",
                  }}
                >
                  {isChecked ? "✔️" : ""}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// ---- ShiftSummary ----
const ShiftSummary = ({ shiftSummary, setShiftSummary }) => {
  const shiftKeys = { "1st": "shift1", "2nd": "shift2", "3rd": "shift3" };
  return (
    <div className="d-flex justify-content-center" style={{ width: "100%" }}>
      <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "15px", width: "650px", backgroundColor: "#f8f9fa", marginTop: "20px" }}>
        <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "10px", textAlign: "center" }}>Shift Summary</div>
        {["1st", "2nd", "3rd"].map((shift) => (
          <div key={shift} style={{ marginBottom: "10px" }}>
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>{shift} Shift:</label>
            <input type="text" className="form-control" value={shiftSummary ? shiftSummary[shiftKeys[shift]] || "" : ""} onChange={(e) => {
              const val = e?.target?.value || "";
              setShiftSummary((prev) => ({ ...(prev || { shift1: "", shift2: "", shift3: "" }), [shiftKeys[shift]]: val }));
            }} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ---- ClothingDescription ----
const ClothingDescription = ({ clothingDescription, setClothingDescription }) => (
  <div className="d-flex justify-content-center" style={{ width: "100%" }}>
    <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "15px", width: "650px", backgroundColor: "#f8f9fa", marginTop: "20px" }}>
      <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "10px", textAlign: "center" }}>Clothing Description</div>
      {Object.keys(clothingDescription || {}).map((key) => (
        <div key={key} style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: "500", marginBottom: "5px" }}>{key.replace(/([A-Z])/g, " $1")}</label>
          <input type="text" className="form-control" value={clothingDescription ? clothingDescription[key] || "" : ""} onChange={(e) => {
            const val = e?.target?.value || "";
            setClothingDescription((prev) => ({ ...(prev || {}), [key]: val }));
          }} />
        </div>
      ))}
    </div>
  </div>
);

// ---- SignatureSection ----
const SignatureSection = ({ sigRefs, initials, setInitials, titles, setTitles }) => (
  <div className="d-flex justify-content-center" style={{ width: "100%" }}>
    <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "15px", width: "650px", backgroundColor: "#f8f9fa", marginTop: "20px" }}>
      <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "10px", textAlign: "center" }}>Signatures</div>
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="d-flex align-items-center mb-2" style={{ gap: "10px" }}>
          <div style={{ flexShrink: 0 }}>
            <ReactSignatureCanvas
              penColor="black"
              canvasProps={{ width: 180, height: 50, className: "sigCanvas", style: { border: "1px solid #ccc" } }}
              ref={(el) => (sigRefs.current[idx] = el)}
            />
          </div>
          <input type="text" placeholder="Initials" value={Array.isArray(initials) ? initials[idx] : ""} onChange={(e) => {
            const val = e?.target?.value || "";
            setInitials((prev) => { const arr = Array.isArray(prev) ? [...prev] : ["", "", ""]; arr[idx] = val; return arr; });
          }} className="form-control" style={{ flexGrow: 1 }} />
          <input type="text" placeholder="Title" value={Array.isArray(titles) ? titles[idx] : ""} onChange={(e) => {
            const val = e?.target?.value || "";
            setTitles((prev) => { const arr = Array.isArray(prev) ? [...prev] : ["", "", ""]; arr[idx] = val; return arr; });
          }} className="form-control" style={{ flexGrow: 1 }} />
        </div>
      ))}
    </div>
  </div>
);

export default DailyProgressTwo;