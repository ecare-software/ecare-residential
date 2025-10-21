import React, {useState, useEffect} from "react";
import { Container, Form, Row } from "react-bootstrap";
import "../../App.css";
import ClientOption from "../../utils/ClientOption.util";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const DailyProgressTwo = () => {

const [formData, setFormData] = useState({
    createDate: "",
    clients: [],
    clientId: "",
    _id: "",
    lastEditDate: "",
    childSelected: false,
  });

  const userObj = cookies.get("userObj");

  useEffect(() => {
  const fetchClients = async () => {
    if (!userObj?.homeId) return;

    try {
      const { data } = await axios.get(
        `/api/client/${userObj.homeId}?active=true`
      );

      const activeClients = data.filter(
        (client) => !client.hasOwnProperty("active") || client.active === true
      );

      setFormData((prev) => ({
        ...prev,
        clients: activeClients,
      }));
    } catch (error) {
      console.error("Error fetching clients:", error);
      alert("Error loading clients");
    }
  };

  fetchClients();
}, [userObj?.homeId]); // depends only on homeId, not the full object


  const handleFieldInputDate = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value.concat(":00.000Z"),
    }));
  };

  const handleClientSelect = async (event) => {
    const value = event.target.value;

    if (value !== "null" && value !== null) {
      const client = JSON.parse(value);
      setFormData((prev) => ({
        ...prev,
        ...client,
        clientId: client._id,
        childSelected: true,
      }));
    }
  };

  return (
    <Container fluid className="formComp">
      {/* Title */}
      <div className="text-center mb-4">
        <h3 className="fw-bold mb-0">Saving Home RTC</h3>
        <h4 className="fw-semibold">Daily Progress Note</h4>
      </div>

      <div className="form-group logInInputField">
          <label className="control-label">
              Create Date
          </label>
          <input
            onChange={handleFieldInputDate}
            id="createDate"
            value={formData.createDate ? formData.createDate.slice(0, -8) : ""}
            className="form-control"
            type="datetime-local"
          />
        </div>

        <div className="form-group logInInputField">
          <label className="control-label">Child's Name</label>
          <Form.Control
            as="select"
            defaultValue={null}
            onChange={handleClientSelect}
          >
            {[null, ...formData.clients].map((client, index) => (
              <ClientOption key={index} data={client} />
            ))}
          </Form.Control>
        </div>

      <Form>
        <div className="d-flex flex-column align-items-center">
          {/* ---- STAFF INITIALS ---- */}
          <div className="d-flex justify-content-center gap-2 flex-nowrap mb-3">
            {/* LEFT SIDE */}
            <div
              className="d-flex flex-column fw-semibold"
              style={{
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                className="d-flex align-items-center justify-content-center text-center"
                style={{
                  backgroundColor: "#e9ecef",
                  height: "40px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                SHIFTS
              </div>

              {/* Subcategories */}
              {["Staff Initials:"].map((label, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-center text-center"
                  style={{
                    backgroundColor: "#f8f9fa",
                    height: "40px",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* RIGHT SIDE */}
            <div
              className="d-flex flex-column"
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Column Header Row */}
              <div
                className="d-flex justify-content-center align-items-center flex-nowrap"
                style={{
                  height: "40px",
                  backgroundColor: "#e9ecef",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {["1st", "2nd", "3rd", "Notes"].map((header, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center justify-content-center text-center"
                    style={{
                      width: "120px",
                      fontWeight: "600",
                    }}
                  >
                    {header}
                  </div>
                ))}
              </div>

              {/* Input row for Staff Initials */}
              <div
                className="d-flex justify-content-center align-items-center flex-nowrap"
                style={{
                  height: "40px",
                }}
              >
                {Array.from({ length: 4 }).map((_, colIndex) => (
                  <input
                    key={colIndex}
                    type="text"
                    style={{
                      width: "120px",
                      height: "100%",
                      border: "none",
                      borderRight: colIndex !== 3 ? "1px solid #ccc" : "none",
                      textAlign: "center",
                      outline: "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ---- LEVEL OF PRECAUTION ---- */}
          <div className="d-flex justify-content-center gap-2 flex-nowrap" style={{ marginTop: "20px" }}>
            {/* LEFT SIDE */}
            <div
              className="d-flex flex-column fw-semibold"
              style={{
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                className="d-flex align-items-center justify-content-center text-center"
                style={{
                  backgroundColor: "#e9ecef",
                  height: "40px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                SHIFTS
              </div>

              {/* Subcategories */}
              {["LEVEL OF PRECAUTION:", "Visual:", "Suicidal:", "Homicidal:", "1:1:", "AWOL:"].map((label, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-center text-center"
                  style={{
                    backgroundColor: "#f8f9fa",
                    height: "40px",
                    borderBottom: index !== 5 ? "1px solid #ccc" : "none",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* RIGHT SIDE */}
            <div
              className="d-flex flex-column"
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Column Header Row */}
              <div
                className="d-flex justify-content-center align-items-center flex-nowrap"
                style={{
                  height: "40px",
                  backgroundColor: "#e9ecef",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {["1st", "2nd", "3rd", "Notes"].map((header, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center justify-content-center text-center"
                    style={{
                      width: "120px",
                      fontWeight: "600",
                    }}
                  >
                    {header}
                  </div>
                ))}
              </div>

              {/* Input Rows for each subcategory (including the new Level of Precaution) */}
              {Array.from({ length: 6 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="d-flex justify-content-center align-items-center flex-nowrap"
                  style={{
                    borderBottom: rowIndex !== 5 ? "1px solid #ccc" : "none",
                    height: "40px",
                  }}
                >
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <input
                      key={colIndex}
                      type="text"
                      style={{
                        width: "120px",
                        height: "100%",
                        border: "none",
                        borderRight: colIndex !== 3 ? "1px solid #ccc" : "none",
                        textAlign: "center",
                        outline: "none",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ---- HYGIENE COMPLETED ---- */}
          <div className="d-flex justify-content-center gap-2 flex-nowrap" style={{ marginTop: "20px" }}>
            {/* LEFT SIDE */}
            <div
              className="d-flex flex-column fw-semibold"
              style={{
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                className="d-flex align-items-center justify-content-center text-center"
                style={{
                  backgroundColor: "#e9ecef",
                  height: "40px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                SHIFTS
              </div>

              {/* Subcategories */}
              {["HYGIENE COMPLETED:", "yes:", "Refused:", "Needed Assistance:"].map((label, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-center text-center"
                  style={{
                    backgroundColor: "#f8f9fa",
                    height: "40px",
                    borderBottom: index !== 3 ? "1px solid #ccc" : "none",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* RIGHT SIDE */}
            <div
              className="d-flex flex-column"
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Column Header Row */}
              <div
                className="d-flex justify-content-center align-items-center flex-nowrap"
                style={{
                  height: "40px",
                  backgroundColor: "#e9ecef",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {["1st", "2nd", "3rd", "Notes"].map((header, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center justify-content-center text-center"
                    style={{
                      width: "120px",
                      fontWeight: "600",
                    }}
                  >
                    {header}
                  </div>
                ))}
              </div>

              {/* Input Rows for each subcategory (including the new Level of Precaution) */}
              {Array.from({ length: 4 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="d-flex justify-content-center align-items-center flex-nowrap"
                  style={{
                    borderBottom: rowIndex !== 3 ? "1px solid #ccc" : "none",
                    height: "40px",
                  }}
                >
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <input
                      key={colIndex}
                      type="text"
                      style={{
                        width: "120px",
                        height: "100%",
                        border: "none",
                        borderRight: colIndex !== 3 ? "1px solid #ccc" : "none",
                        textAlign: "center",
                        outline: "none",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ---- DAILY CHORES COMPLETED ---- */}
          <div className="d-flex justify-content-center gap-2 flex-nowrap" style={{ marginTop: "20px" }}>
            {/* LEFT SIDE */}
            <div
              className="d-flex flex-column fw-semibold"
              style={{
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                className="d-flex align-items-center justify-content-center text-center"
                style={{
                  backgroundColor: "#e9ecef",
                  height: "40px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                SHIFTS
              </div>

              {/* Subcategories */}
              {["DAILY CHORES COMPLETED:", "yes:", "Needed Prompting:", "Refused:"].map((label, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-center text-center"
                  style={{
                    backgroundColor: "#f8f9fa",
                    height: "40px",
                    borderBottom: index !== 3 ? "1px solid #ccc" : "none",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* RIGHT SIDE */}
            <div
              className="d-flex flex-column"
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Column Header Row */}
              <div
                className="d-flex justify-content-center align-items-center flex-nowrap"
                style={{
                  height: "40px",
                  backgroundColor: "#e9ecef",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {["1st", "2nd", "3rd", "Notes"].map((header, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center justify-content-center text-center"
                    style={{
                      width: "120px",
                      fontWeight: "600",
                    }}
                  >
                    {header}
                  </div>
                ))}
              </div>

              {/* Input Rows for each subcategory (including the new Level of Precaution) */}
              {Array.from({ length: 4 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="d-flex justify-content-center align-items-center flex-nowrap"
                  style={{
                    borderBottom: rowIndex !== 3 ? "1px solid #ccc" : "none",
                    height: "40px",
                  }}
                >
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <input
                      key={colIndex}
                      type="text"
                      style={{
                        width: "120px",
                        height: "100%",
                        border: "none",
                        borderRight: colIndex !== 3 ? "1px solid #ccc" : "none",
                        textAlign: "center",
                        outline: "none",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ---- MEDICATION COMPLIANCE ---- */}
          <div className="d-flex justify-content-center gap-2 flex-nowrap" style={{ marginTop: "20px" }}>
            {/* LEFT SIDE */}
            <div
              className="d-flex flex-column fw-semibold"
              style={{
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                className="d-flex align-items-center justify-content-center text-center"
                style={{
                  backgroundColor: "#e9ecef",
                  height: "40px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                SHIFTS
              </div>

              {/* Subcategories */}
              {["MEDICATION COMPLIANCE:", "yes:", "Needed Prompting:", "Medication Teaching:"].map((label, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-center text-center"
                  style={{
                    backgroundColor: "#f8f9fa",
                    height: "40px",
                    borderBottom: index !== 3 ? "1px solid #ccc" : "none",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* RIGHT SIDE */}
            <div
              className="d-flex flex-column"
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Column Header Row */}
              <div
                className="d-flex justify-content-center align-items-center flex-nowrap"
                style={{
                  height: "40px",
                  backgroundColor: "#e9ecef",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {["1st", "2nd", "3rd", "Notes"].map((header, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center justify-content-center text-center"
                    style={{
                      width: "120px",
                      fontWeight: "600",
                    }}
                  >
                    {header}
                  </div>
                ))}
              </div>

              {/* Input Rows for each subcategory (including the new Level of Precaution) */}
              {Array.from({ length: 4 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="d-flex justify-content-center align-items-center flex-nowrap"
                  style={{
                    borderBottom: rowIndex !== 3 ? "1px solid #ccc" : "none",
                    height: "40px",
                  }}
                >
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <input
                      key={colIndex}
                      type="text"
                      style={{
                        width: "120px",
                        height: "100%",
                        border: "none",
                        borderRight: colIndex !== 3 ? "1px solid #ccc" : "none",
                        textAlign: "center",
                        outline: "none",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ---- DAILY INTAKE ---- */}
          <div className="d-flex justify-content-center gap-2 flex-nowrap" style={{ marginTop: "20px" }}>
            {/* LEFT SIDE (SHIFTS & MEALS) */}
            <div
              className="d-flex flex-column fw-semibold"
              style={{
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                className="d-flex align-items-center justify-content-center text-center"
                style={{
                  backgroundColor: "#e9ecef",
                  height: "40px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                SHIFTS
              </div>

              {/* Subcategories (meals + radio buttons) */}
              {["DAILY INTAKE", "Breakfast:", "Lunch:", "Dinner:"].map((meal, index) => {
                const showRadio = meal !== "DAILY INTAKE"; // ✅ only show radio for breakfast/lunch/dinner
                return (
                  <div
                    key={index}
                    className="d-flex flex-column align-items-center justify-content-center text-center"
                    style={{
                      backgroundColor: "#f8f9fa",
                      height: "90px",
                      borderBottom: index !== 3 ? "1px solid #ccc" : "none",
                      padding: "4px 2px",
                    }}
                  >
                    {/* Meal title */}
                    <div style={{ marginBottom: showRadio ? "4px" : "0px" }}>{meal}</div>

                    {/* Radio buttons inside same box */}
                    {showRadio && (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ gap: "12px", marginTop: "2px" }}
                      >
                        <label className="d-flex align-items-center gap-1">
                          <input type="radio" name={`${meal}-option`} value="yes" />
                          Yes
                        </label>
                        <label className="d-flex align-items-center gap-1">
                          <input type="radio" name={`${meal}-option`} value="refused" />
                          Refused
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RIGHT SIDE (INPUTS) */}
            <div
              className="d-flex flex-column"
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Column Header */}
              <div
                className="d-flex justify-content-center align-items-center flex-nowrap"
                style={{
                  height: "40px",
                  backgroundColor: "#e9ecef",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {["1st", "2nd", "3rd", "Notes"].map((header, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center justify-content-center text-center"
                    style={{
                      width: "120px",
                      fontWeight: "600",
                    }}
                  >
                    {header}
                  </div>
                ))}
              </div>

              {/* Input Rows for each meal */}
              {["DAILY INTAKE", "Breakfast", "Lunch", "Dinner"].map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="d-flex justify-content-center align-items-center flex-nowrap"
                  style={{
                    borderBottom: rowIndex !== 3 ? "1px solid #ccc" : "none",
                    height: "90px",
                  }}
                >
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <input
                      key={colIndex}
                      type="text"
                      style={{
                        width: "120px",
                        height: "100%",
                        border: "none",
                        borderRight: colIndex !== 3 ? "1px solid #ccc" : "none",
                        textAlign: "center",
                        outline: "none",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
         
          {/* ---- STAFF INTERVENTION ---- */}
          <div
            className="d-flex justify-content-center gap-2 flex-nowrap"
            style={{ marginTop: "20px" }}
          >
            {/* LEFT SIDE (TITLES + SUBTITLES) */}
            <div
              className="d-flex flex-column fw-semibold"
              style={{
                width: "260px", // fits long titles
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                className="d-flex align-items-center justify-content-center text-center"
                style={{
                  backgroundColor: "#e9ecef",
                  height: "35px", // reduced height
                  borderBottom: "1px solid #ccc",
                }}
              >
                SHIFTS
              </div>

              {/* Subcategories (titles only, no radios) */}
              {[
                "STAFF INTERVENTION:",
                "Supporting/Encouraging by giving positive feedback:",
                "Redirects for disrupting conversation in group or activity:",
              ].map((item, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center text-start"
                  style={{
                    backgroundColor: "#f8f9fa",
                    height: "75px", // reduced height
                    borderBottom: index !== 2 ? "1px solid #ccc" : "none",
                    padding: "4px 10px", // smaller padding
                    lineHeight: "1.2",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* RIGHT SIDE (INPUTS) */}
            <div
              className="d-flex flex-column"
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Column Header */}
              <div
                className="d-flex justify-content-center align-items-center flex-nowrap"
                style={{
                  height: "35px", // matches left header height
                  backgroundColor: "#e9ecef",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {["1st", "2nd", "3rd", "Notes"].map((header, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center justify-content-center text-center"
                    style={{
                      width: "120px",
                      fontWeight: "600",
                    }}
                  >
                    {header}
                  </div>
                ))}
              </div>

              {/* Input Rows for each subtitle */}
              {[...Array(3)].map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="d-flex justify-content-center align-items-center flex-nowrap"
                  style={{
                    borderBottom: rowIndex !== 2 ? "1px solid #ccc" : "none",
                    height: "75px", // same as subtitle height
                  }}
                >
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <input
                      key={colIndex}
                      type="text"
                      style={{
                        width: "120px",
                        height: "100%",
                        border: "none",
                        borderRight: colIndex !== 3 ? "1px solid #ccc" : "none",
                        textAlign: "center",
                        outline: "none",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ---- Resident Behavior Performance ---- */}
          <div
            className="d-flex justify-content-center gap-2 flex-nowrap"
            style={{ marginTop: "20px" }}
          >
            {/* LEFT SIDE (TITLES + SUBTITLES) */}
            <div
              className="d-flex flex-column fw-semibold"
              style={{
                width: "260px", // matches Staff Intervention width
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                className="d-flex align-items-center justify-content-center text-center"
                style={{
                  backgroundColor: "#e9ecef",
                  height: "35px",
                  borderBottom: "1px solid #ccc",
                  fontWeight: "700",
                  textAlign: "center",
                  padding: "0 6px",
                }}
              >
                SHIFTS
              </div>

              {/* Subtitles including first row as RESIDENT BEHAVIOR PERFORMANCE */}
              {[
                "RESIDENT BEHAVIOR PERFORMANCE:",
                "Receptive to information from staff & peers:",
                "Enthusiastic and helpful to others:",
                "Identifies potential solutions for problem solving:",
                "Participates well in group/activities:",
                "Follows instructions well:",
                "Destruction of property:",
                "Physical Aggression towards others:",
                "Temper Outburst",
                "Non-Compliance with program/house rules:",
                "Verbal Aggression towards peers:",
                "Verbal aggression tpwards staff:",
                "Sexual Misconduct:",
                "Limited Eye Contact:",
                "Refuse to Process with Staff:",
                "Inapopropiate Behavior Conversation:",
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
                "Agitates other:",
                "Sudden Mood Changes:",
                "Not Following Directions:",
                "Disruptive Behavior:"

              ].map((item, index, subtitles) => (
                <div
                  key={index}
                  className="d-flex align-items-center text-start"
                  style={{
                    backgroundColor: "#f8f9fa",
                    height: "75px", // matches Staff Intervention row height
                    borderBottom: index !== subtitles.length - 1 ? "1px solid #ccc" : "none",
                    padding: "4px 10px",
                    lineHeight: "1.2",
                    display: "flex",
                    alignItems: "center",
                    wordWrap: "break-word",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* RIGHT SIDE (INPUTS) */}
            <div
              className="d-flex flex-column"
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Column Header */}
              <div
                className="d-flex justify-content-center align-items-center flex-nowrap"
                style={{
                  height: "35px",
                  backgroundColor: "#e9ecef",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {["1st", "2nd", "3rd", "Notes"].map((header, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center justify-content-center text-center"
                    style={{
                      width: "120px",
                      fontWeight: "600",
                    }}
                  >
                    {header}
                  </div>
                ))}
              </div>

              {/* Input Rows */}
              {Array.from({ length: 30 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="d-flex justify-content-center align-items-center flex-nowrap"
                  style={{
                    borderBottom: rowIndex !== 29 ? "1px solid #ccc" : "none",
                    height: "75px",
                  }}
                >
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <input
                      key={colIndex}
                      type="text"
                      style={{
                        width: "120px",
                        height: "100%",
                        border: "none",
                        borderRight: colIndex !== 3 ? "1px solid #ccc" : "none",
                        textAlign: "center",
                        outline: "none",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ---- Recreational/Therapeutic Activity ---- */}
          <div
            className="d-flex justify-content-center gap-2 flex-nowrap"
            style={{ marginTop: "20px" }}
          >
            {/* LEFT SIDE (TITLES + SUBTITLES) */}
            <div
              className="d-flex flex-column fw-semibold"
              style={{
                width: "260px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                className="d-flex align-items-center justify-content-center text-center"
                style={{
                  backgroundColor: "#e9ecef",
                  height: "35px",
                  borderBottom: "1px solid #ccc",
                  fontWeight: "700",
                  textAlign: "center",
                  padding: "0 6px",
                }}
              >
                SHIFTS
              </div>

              {/* Subtitles */}
              {[
                "RECREATIONAL/THERAPEUTIC ACTIVITY:",
                "Activity Exercise with trainer/Interactive games:",
                "Participation:",
                "Peer Interaction",
                "Why is this activity therapeutic for this resident?",
                "Physical/Fitness Peer Interaction:"
              ].map((item, index, subtitles) => {
                const showParticipationRadio = item === "Participation:";
                const showPeerRadio = item === "Peer Interaction";

                return (
                  <div
                    key={index}
                    className="d-flex flex-column justify-content-center"
                    style={{
                      backgroundColor: "#f8f9fa",
                      height: "90px",
                      borderBottom: index !== subtitles.length - 1 ? "1px solid #ccc" : "none",
                      padding: "4px 10px",
                      lineHeight: "1.2",
                      display: "flex",
                      alignItems: "flex-start",
                      wordWrap: "break-word",
                    }}
                  >
                    {/* Subtitle text */}
                    <div style={{ marginBottom: showParticipationRadio || showPeerRadio ? "6px" : "0" }}>
                      {item}
                    </div>

                    {/* Radio buttons */}
                    {showParticipationRadio && (
                      <div className="d-flex" style={{ gap: "20px" }}>
                        {["Yes", "No", "Prompting"].map((option) => (
                          <label key={option} className="d-flex align-items-center gap-1">
                            <input type="radio" name="participation" value={option.toLowerCase()} />
                            {option}
                          </label>
                        ))}
                      </div>
                    )}
                    {showPeerRadio && (
                      <div className="d-flex" style={{ gap: "20px" }}>
                        {["Excellent", "Good", "Poor"].map((option) => (
                          <label key={option} className="d-flex align-items-center gap-1">
                            <input type="radio" name="peerInteraction" value={option.toLowerCase()} />
                            {option}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RIGHT SIDE (INPUTS) */}
            <div
              className="d-flex flex-column"
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Column Header */}
              <div
                className="d-flex justify-content-center align-items-center flex-nowrap"
                style={{
                  height: "35px",
                  backgroundColor: "#e9ecef",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {["1st", "2nd", "3rd", "Notes"].map((header, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center justify-content-center text-center"
                    style={{
                      width: "120px",
                      fontWeight: "600",
                    }}
                  >
                    {header}
                  </div>
                ))}
              </div>

              {/* Input Rows */}
              {Array.from({ length: 6 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="d-flex justify-content-center align-items-center flex-nowrap"
                  style={{
                    borderBottom: rowIndex !== 5 ? "1px solid #ccc" : "none",
                    height: "90px",
                  }}
                >
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <input
                      key={colIndex}
                      type="text"
                      style={{
                        width: "120px",
                        height: "100%",
                        border: "none",
                        borderRight: colIndex !== 3 ? "1px solid #ccc" : "none",
                        textAlign: "center",
                        outline: "none",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* ---- TIMELINE ---- */}
          <div className="d-flex justify-content-center gap-2 flex-nowrap" style={{ marginTop: "20px" }}>
            {/* LEFT SIDE (Time labels) */}
            <div
              className="d-flex flex-column fw-semibold"
              style={{
                width: "250px",
                border: "1px solid #ccc",
                borderRadius: "4px 0 0 0",
                overflow: "hidden",
              }}
            >
              {[
                "11:45PM", "12:00AM", "12:15AM", "12:30AM", "12:45AM",
                "1:00AM", "1:15AM", "1:30AM", "4:30AM", "4:45AM",
                "5:00AM", "5:15AM", "5:30AM", "5:45AM", "6:00AM", "6:15AM",
              ].map((label, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-center text-center"
                  style={{
                    backgroundColor: "#f8f9fa",
                    height: "40px",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* RIGHT SIDE (Inputs for timeline) */}
            <div
              className="d-flex flex-column"
              style={{
                border: "1px solid #ccc",
                borderRadius: "0 4px 0 0",
                overflow: "hidden",
                flex: 1,
              }}
            >
              {Array.from({ length: 16 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="d-flex justify-content-center align-items-center flex-nowrap"
                  style={{
                    borderBottom: "1px solid #ccc",
                    height: "40px",
                  }}
                >
                  {Array.from({ length: 3 }).map((_, colIndex) => (
                    <input
                      key={colIndex}
                      type="text"
                      style={{
                        width: "130px",
                        height: "100%",
                        border: "none",
                        borderRight: colIndex !== 2 ? "1px solid #ccc" : "none",
                        textAlign: "center",
                        outline: "none",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

         {/* ---- PARENT CONTAINER ---- */}
        <div className="d-flex flex-column align-items-center" style={{ marginTop: "20px" }}>

          {/* ---- SIGNATURE / INITIALS / TITLE FORM ---- */}
          <div
            className="d-flex justify-content-center"
            style={{
              border: "1px solid #ccc",
              borderRadius: "0 0 4px 4px",
              overflow: "hidden",
              width: "650px", // match timeline width
            }}
          >
            {["Signature", "Initials", "Title"].map((title, i) => (
              <div
                key={i}
                className="d-flex flex-column align-items-center"
                style={{
                  flex: 1,
                  borderRight: i !== 2 ? "1px solid #ccc" : "none",
                  backgroundColor: "#f8f9fa",
                }}
              >
                {/* Header */}
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    height: "40px",
                    fontWeight: "600",
                    width: "100%",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {title}
                </div>

                {/* 3 Vertical Inputs */}
                {Array.from({ length: 3 }).map((_, inputIndex) => (
                  <input
                    key={inputIndex}
                    type="text"
                    style={{
                      width: "90%",
                      height: "30px",
                      border: "1px solid #ccc",
                      textAlign: "center",
                      outline: "none",
                      marginTop: "5px",
                      marginBottom: "5px",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* ---- CLOTHING DESCRIPTION SECTION ---- */}
          <div
            className="d-flex flex-column"
            style={{
              marginTop: "20px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "15px",
              width: "650px", // match timeline & signature section
              backgroundColor: "#f8f9fa",
            }}
          >
            {/* Title */}
            <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "10px" }}>
              Detailed Description of Clothing for the day
            </div>

            {/* Shirt and Bottoms */}
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>
              Shirt and Bottoms style and color:
            </label>
            <input
              type="text"
              style={{
                width: "100%",
                height: "30px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "10px",
                padding: "5px",
                outline: "none",
              }}
            />

            {/* Shoes */}
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>
              Shoes style and color:
            </label>
            <input
              type="text"
              style={{
                width: "100%",
                height: "30px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "10px",
                padding: "5px",
                outline: "none",
              }}
            />

            {/* Other */}
            <label style={{ fontWeight: "500", marginBottom: "5px" }}>Other:</label>
            <input
              type="text"
              style={{
                width: "100%",
                height: "30px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "5px",
                outline: "none",
              }}
            />
          </div>
        </div>

        </div>
          <Row className="save-submit-row" style={{marginTop:'30px'}}>
            <div style={{ display: "flex", width: "46%" }}>
              <button
                className="lightBtn hide hide-on-print save-submit-btn"
                style={{ width: "100%" }}
              >
                Finish Later
              </button>
            </div>
            <div style={{ display: "flex", width: "46%" }}>
              <button
                className="darkBtn hide hide-on-print save-submit-btn"
                  style={{ width: "100%" }}
              >
                Submit
              </button>
            </div>
          </Row>
      </Form>
    </Container>
  );
};

export default DailyProgressTwo;