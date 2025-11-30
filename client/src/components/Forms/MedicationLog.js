import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import "../../App.css";
import Cookies from "universal-cookie";
import { GetUserSig } from "../../utils/GetUserSig";
import ReactSignatureCanvas from "react-signature-canvas";
import axios from "axios";

const cookies = new Cookies();

const MedicationLog = ({ effectiveUserObj: propEffectiveUserObj, secondaryUserObj, formData }) => {
  const cookieUser = cookies.get("userObj");
  const effectiveUserObj = propEffectiveUserObj || cookieUser || null;
  const [currentFormId, setCurrentFormId] = useState(formData?._id || null);
  const [caregiverNames, setCaregiverNames] = useState(["", ""]);

  const [clients, setClients] = useState([]);
  const [selectedChild, setSelectedChild] = useState({ id: "", name: "" });

  const [unit, setUnit] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [allergiesOrContraindications, setAllergiesOrContraindications] = useState("");
  const [childRefusal, setChildRefusal] = useState("");
  const [prescriberName, setPrescriberName] = useState("");
  const [prescriberPhone, setPrescriberPhone] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacyPhone, setPharmacyPhone] = useState("");

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const today = new Date().toISOString().split("T")[0];

  const makeEmptyEntries = () => days.map((d) => ({ day: d, time: "", initials: "", amountRemaining: "" }));
  const makeSingleLogTable = () => ({ tableNumber: 1, entries: makeEmptyEntries() });

  const [medications, setMedications] = useState([]); // NEW

  const [signatures, setSignatures] = useState(["", ""]);
  const [initials, setInitials] = useState(["", ""]);
  const [titles, setTitles] = useState(["", ""]);
  const [sigDates, setSigDates] = useState([today, today]);
  const sigRefs = useRef([null, null]);

  const [expanded, setExpanded] = useState({}); 

  useEffect(() => {
    const fetchClients = async () => {
      const homeId = effectiveUserObj?.homeId;
      if (!homeId) return;

      try {
        const { data } = await axios.get(`/api/client/${homeId}?active=true`);
        const activeClients = Array.isArray(data) ? data.filter(c => c.active !== false) : [];
        setClients(activeClients);
      } catch (err) {
        console.error("Error fetching clients:", err);
        alert("Failed to load children list.");
      }
    };

    fetchClients();
  }, [effectiveUserObj?.homeId]);

  useEffect(() => {
    if (!formData) return;

    const formatDate = (d) => {
      if (!d) return today;
      const dt = new Date(d);
      if (isNaN(dt)) return today;
      return dt.toISOString().split("T")[0];
    };

    setUnit(formData.unit || "");
    setMonthYear(formData.monthYear || "");
    setAllergiesOrContraindications(formData.allergiesOrContraindications || "");
    setChildRefusal(formData.childRefusal || "");
    setPrescriberName(formData.prescriberName || "");
    setPrescriberPhone(formData.prescriberPhone || "");
    setPharmacyName(formData.pharmacyName || "");
    setPharmacyPhone(formData.pharmacyPhone || "");
    setSignatures(formData.caregivers?.map(c => c.signature) || ["", ""]);
    setInitials(formData.caregivers?.map(c => c.initials) || ["", ""]);
    setTitles(formData.caregivers?.map(c => c.title) || ["", ""]);
    setSigDates(formData.caregivers?.map(c => formatDate(c.date)) || [today, today]);
    setCaregiverNames(formData.caregivers?.map(c => c.name || "") || ["", ""]);

    if (Array.isArray(formData.medications) && formData.medications.length > 0) {
      const meds = formData.medications.map((m, i) => ({
        id: m.id || `${m.name || "med"}-${i}-${Date.now()}`,
        name: m.name || "",
        strength: m.strength || "",
        dosage: m.dosage || "",
        frequency: m.frequency || "",
        otherFrequency: m.otherFrequency || "",
        reasonPrescribed: m.reasonPrescribed || "",
        prnReasonDetails: m.prnReasonDetails || "",
        logTable: m.logTable || makeSingleLogTable()
      }));
      setMedications(meds);
      const exp = {};
      meds.forEach(m => { exp[m.id] = true; });
      setExpanded(exp);
      return;
    }

    const oldMedNameArr = formData.medicationName || [];
    if (Array.isArray(oldMedNameArr) && oldMedNameArr.length > 0) {
      const meds = oldMedNameArr.map((nm, idx) => ({
        id: `${nm}-${idx}-${Date.now()}`,
        name: nm,
        strength: formData.strength || "",
        dosage: formData.dosage || "",
        frequency: formData.frequency || "",
        otherFrequency: formData.otherFrequency || "",
        reasonPrescribed: formData.reasonPrescribed || "",
        prnReasonDetails: formData.prnReasonDetails || "",
        logTable: (formData.logTables && formData.logTables[idx]) ? formData.logTables[idx] : makeSingleLogTable()
      }));
      setMedications(meds);
      const exp = {};
      meds.forEach(m => { exp[m.id] = true; });
      setExpanded(exp);
    }
  }, [formData]);

  useEffect(() => {
    if (!formData || clients.length === 0) return;

    const matchedChild = clients.find(c => c._id === formData.child?.childId);
    if (matchedChild) {
      setSelectedChild({
        id: matchedChild._id,
        name: matchedChild.childMeta_name || `${matchedChild.child_firstName || ""} ${matchedChild.child_lastName || ""}`.trim(),
      });
    }
  }, [formData, clients]);

  useEffect(() => {
    signatures.forEach((sig, i) => {
      const ref = sigRefs.current[i];
      if (!ref) return;

      try {
        ref.clear();
        if (Array.isArray(sig) && sig.length > 0) {
          ref.fromData(sig);
        } else if (typeof sig === "string" && sig.startsWith("data:")) {
          ref.fromDataURL(sig);
        }
      } catch (err) {
      }
    });
  }, [signatures]);

  const fetchUserSignatureRaw = async (user) => {
    if (!user) return null;
    try {
      const res = user.email && user.homeId
        ? await GetUserSig(user.email, user.homeId)
        : user._id
          ? await GetUserSig(user._id)
          : null;
      return res?.data?.signature || null;
    } catch (err) {
      console.error("Error fetching signature:", err);
      return null;
    }
  };

  const loggedInUserMatchesSlot = (slotIndex) => {
    const logged = effectiveUserObj;
    if (!logged) return false;

    if (!signatures[slotIndex]) return true;

    const caregiver = formData?.caregivers?.[slotIndex];
    if (caregiver && caregiver.name) {
      const loggedName = `${logged.firstName} ${logged.lastName}`.trim();
      return caregiver.name === loggedName;
    }

    return false;
  };

  const handleSetSignature = async (idx) => {
    if (!effectiveUserObj || !loggedInUserMatchesSlot(idx)) return;

    const sig = await fetchUserSignatureRaw(effectiveUserObj);
    if (!sig) return;

    const ref = sigRefs.current[idx];
    if (ref) {
      ref.clear();
      if (Array.isArray(sig)) ref.fromData(sig);
      else if (typeof sig === "string") ref.fromDataURL(sig);
    }

    setSignatures(prev => { const next = [...prev]; next[idx] = sig; return next; });
    setInitials(prev => { const next = [...prev]; next[idx] = `${effectiveUserObj.firstName?.[0] || ""}${effectiveUserObj.lastName?.[0] || ""}`; return next; });
    setTitles(prev => { const next = [...prev]; next[idx] = effectiveUserObj.jobTitle || ""; return next; });
    setSigDates(prev => { const next = [...prev]; next[idx] = today; return next; });
    setCaregiverNames(prev => {
      const updated = [...prev];
      updated[idx] = `${effectiveUserObj.firstName} ${effectiveUserObj.lastName}`.trim();
      return updated;
    });
  };

  const handleClearSignature = (idx) => {
    const ref = sigRefs.current[idx];
    if (ref && typeof ref.clear === "function") ref.clear();

    setSignatures(prev => { const next = [...prev]; next[idx] = ""; return next; });
    setInitials(prev => { const next = [...prev]; next[idx] = ""; return next; });
    setTitles(prev => { const next = [...prev]; next[idx] = ""; return next; });
    setSigDates(prev => { const next = [...prev]; next[idx] = today; return next; });
    setCaregiverNames(prev => {
      const updated = [...prev];
      updated[idx] = "";
      return updated;
    });
  };

  const medicationOptions = [
    "Ritalin", "Concerta", "Metadate", "Focalin",
    "Adderall", "Adderall XR", "Vyvanse", "Dexedrine",
    "Atomoxetine (Strattera)",
    "Guanfacine ER (Intuniv)",
    "Clonidine ER (Kapvay)",
    "Fluoxetine (Prozac)",
    "Sertraline (Zoloft)",
    "Escitalopram (Lexapro)",
    "Fluvoxamine (Luvox – often for OCD)",
    "Venlafaxine (Effexor)",
    "Duloxetine (Cymbalta)",
    "Risperidone (Risperdal)",
    "Aripiprazole (Abilify)",
    "Quetiapine (Seroquel)",
    "Olanzapine (Zyprexa)",
    "Lithium",
    "Valproate / Divalproex (Depakote)",
    "Lamotrigine (Lamictal)",
    "Carbamazepine (Tegretol)",
    "Buspirone (Buspar)",
    "Hydroxyzine (Vistaril/Atarax)",
    "Melatonin",
    "Clonidine",
    "Trazodone",
    "Bupropion (Wellbutrin)",
    "Alpha agonists (clonidine/guanfacine)",
    "Medications for tic disorders/Tourette’s",
  ];

  const addMedicationByName = (name) => {
    if (!name) return;
    if (medications.some(m => m.name === name)) return;
    const newMed = {
      id: `${name}-${Date.now()}`,
      name,
      strength: "",
      dosage: "",
      frequency: "",
      otherFrequency: "",
      reasonPrescribed: "",
      prnReasonDetails: "",
      logTable: makeSingleLogTable()
    };
    setMedications(prev => {
      const next = [...prev, newMed];
      setExpanded(prevExp => ({ ...prevExp, [newMed.id]: true }));
      return next;
    });
  };

  const removeMedicationById = (id) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    setExpanded(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const updateMedicationField = (medIndex, field, value) => {
    setMedications(prev => {
      const next = [...prev];
      next[medIndex] = { ...next[medIndex], [field]: value };
      return next;
    });
  };

  const handleMedLogChange = (medIndex, entryIndex, field, value) => {
    setMedications(prev => {
      const next = [...prev];
      const med = { ...next[medIndex] };
      const log = { ...med.logTable };
      const entries = log.entries.map((en, ei) => ei === entryIndex ? { ...en, [field]: value } : en);
      log.entries = entries;
      med.logTable = log;
      next[medIndex] = med;
      return next;
    });
  };

  const buildPayload = async (status = "IN_PROGRESS") => {
    const capturedCaregivers = [0, 1].map(i => {
      const ref = sigRefs.current[i];
      let sig = signatures[i];
      try {
        if (ref && typeof ref.isEmpty === "function" && !ref.isEmpty()) { sig = ref.toDataURL(); }
      } catch (err) { /* ignore */ }

      let name = caregiverNames[i] || formData?.caregivers?.[i]?.name || "";

      return {
        name,
        signature: sig,
        date: sigDates[i] || today,
        initials: initials[i],
        title: titles[i],
      };
    });

    const childData = { childId: selectedChild.id || "", name: selectedChild.name || "" };

    return {
      createDate: new Date(),
      homeId: effectiveUserObj?.homeId || null,
      child: childData,
      childMeta_name: selectedChild.name || "",
      unit,
      monthYear,
      allergiesOrContraindications,
      childRefusal,
      prescriberName,
      prescriberPhone,
      pharmacyName,
      pharmacyPhone,
      medications,
      caregivers: capturedCaregivers,
      formType: "Medication Log",
      createdBy: effectiveUserObj?.email || "unknown",
      createdByName: `${effectiveUserObj?.firstName || ""} ${effectiveUserObj?.lastName || ""}`.trim(),
      approved: false,
      status,
      lastEditDate: new Date(),
    };
  };

  const handleFinishLater = async () => {
    try {
      const payload = await buildPayload("IN_PROGRESS");

      if (currentFormId) {
        await axios.put(`/api/medication/${currentFormId}`, payload);
      } else {
        const { data } = await axios.post("/api/medication", payload);
        const newId = data?._id || data?.savedLog?._id;
        if (newId) setCurrentFormId(newId);
      }

      alert("Saved draft successfully.");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save draft.");
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = await buildPayload("COMPLETED");

      if (currentFormId) {
        await axios.put(`/api/medication/${currentFormId}`, payload);
      } else {
        const { data } = await axios.post("/api/medication", payload);
        const newId = data?._id || data?.savedLog?._id;
        if (newId) setCurrentFormId(newId);
      }

      alert("Form completed successfully.");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit form.");
    }
  };

  const getCaregiverDisplayName = (user) => {
    return `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  };

  return (
    <Container className="formComp">
      <Title>General Residential Operation (GRO)</Title>
      <Subtitle>Medication Log</Subtitle>
      <DescriptionBox>
        <Description>
          Standard 748.3151 - One Log per medication or supplement is required.
          <br />
          <br />
          ** A cumulative record of all prescriptions administered,
          non-prescription medications, or supplements for children under 5
          must be kept together in the child's record and updated within 2
          hours of medication administration.
        </Description>
      </DescriptionBox>

      <FormSection>
        <FormRow>
          <Label>Child Name:</Label>
          <Select
            value={selectedChild.id}
            onChange={(e) => {
              const child = clients.find(c => c._id === e.target.value);
              setSelectedChild({
                id: child?._id || "",
                name: child?.childMeta_name || `${child?.child_firstName || ""} ${child?.child_lastName || ""}`.trim()
              });
            }}
          >
            <option value="">Select a child</option>
            {clients.map(client => {
              const displayName = client.childMeta_name || `${client.child_firstName || ""} ${client.child_lastName || ""}`;
              return <option key={client._id} value={client._id}>{displayName}</option>;
            })}
          </Select>
        </FormRow>

        <FormRow>
          <Label>Unit:</Label>
          <Input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} />
        </FormRow>

        <FormRow>
          <Label>Date (Month & Year):</Label>
          <Input type="month" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} />
        </FormRow>

        <FormRow>
          <Label>Drug or Supplement Allergies or Contraindications:</Label>
          <Input type="text" value={allergiesOrContraindications} onChange={(e) => setAllergiesOrContraindications(e.target.value)} />
        </FormRow>

        <FormRow>
          <Label>Child's Refusal (List * in the time box as applicable):</Label>
          <Input type="text" value={childRefusal} onChange={(e) => setChildRefusal(e.target.value)} />
        </FormRow>

        <FormRow>
          <Label>Prescriber Name (if applicable):</Label>
          <Input type="text" value={prescriberName} onChange={(e) => setPrescriberName(e.target.value)} />
        </FormRow>

        <FormRow>
          <Label>Prescriber Area Code and Phone No.:</Label>
          <Input type="text" value={prescriberPhone} onChange={(e) => setPrescriberPhone(e.target.value)} />
        </FormRow>

        <FormRow>
          <Label>Pharmacy (if applicable):</Label>
          <Input type="text" value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} />
        </FormRow>

        <FormRow>
          <Label>Pharmacy Area Code and Phone No.:</Label>
          <Input type="text" placeholder="e.g. (123) 456-7890" value={pharmacyPhone} onChange={(e) => setPharmacyPhone(e.target.value)} />
        </FormRow>

        <FormRow>
          <Label>Name of Medication or Supplement:</Label>

          <MultiSelectContainer>
            <SelectedValues>
              {medications.length === 0 && (
                <Placeholder>Select medications...</Placeholder>
              )}

              {medications.map((med) => (
                <Tag key={med.id}>
                  {med.name || "—"}
                  <RemoveTag onClick={() => removeMedicationById(med.id)}>×</RemoveTag>
                </Tag>
              ))}
            </SelectedValues>

            <Select
              onChange={(e) => {
                const value = e.target.value;
                if (!value) return;
                addMedicationByName(value);
                // reset select to placeholder
                e.target.value = "";
              }}
            >
              <option value="">Select medication</option>
              {medicationOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </Select>
          </MultiSelectContainer>
        </FormRow>

        {medications.map((med, medIndex) => (
          <MedicationCard key={med.id}>
            <MedHeader onClick={() => setExpanded(prev => ({ ...prev, [med.id]: !prev[med.id] }))}>
              <h4>{med.name || `Medication ${medIndex + 1}`}</h4>
              <Toggle>{expanded[med.id] ? "▾" : "▸"}</Toggle>
            </MedHeader>

            {expanded[med.id] && (
              <MedBody>
                <FormRow>
                  <Label>Strength:</Label>
                  <Input type="text" value={med.strength} onChange={(e) => updateMedicationField(medIndex, "strength", e.target.value)} />
                </FormRow>

                <FormRow>
                  <Label>Dosage:</Label>
                  <Input type="text" value={med.dosage} onChange={(e) => updateMedicationField(medIndex, "dosage", e.target.value)} />
                </FormRow>

                <FormRow>
                  <Label>Frequency:</Label>
                  <RadioGroup>
                    {["Daily", "Twice Daily", "Three Times Daily", "PRN (as Needed)"].map((option) => (
                      <RadioLabel key={option}>
                        <RadioInput
                          type="radio"
                          name={`frequency-${med.id}`}
                          value={option}
                          checked={med.frequency === option}
                          onChange={(e) => updateMedicationField(medIndex, "frequency", e.target.value)}
                        />
                        {option}
                      </RadioLabel>
                    ))}
                    <RadioLabel>
                      <RadioInput
                        type="radio"
                        name={`frequency-${med.id}`}
                        value="Other"
                        checked={med.frequency === "Other"}
                        onChange={(e) => updateMedicationField(medIndex, "frequency", e.target.value)}
                      />
                      Other:
                      {med.frequency === "Other" && (
                        <OtherInput
                          type="text"
                          placeholder="Specify..."
                          value={med.otherFrequency || ""}
                          onChange={(e) => updateMedicationField(medIndex, "otherFrequency", e.target.value)}
                        />
                      )}
                    </RadioLabel>
                  </RadioGroup>
                </FormRow>

                <FormRow>
                  <Label>Reason for Prescribed Medication:</Label>
                  <TextArea rows="3" placeholder="Enter reason here..." value={med.reasonPrescribed || ""} onChange={(e) => updateMedicationField(medIndex, "reasonPrescribed", e.target.value)} />
                </FormRow>

                <FormRow>
                  <Label>Reason(s) for PRN and Nonprescription Medication including specific symptoms, conditions or injury of the child:</Label>
                  <TextArea rows="4" placeholder="Enter details here..." value={med.prnReasonDetails || ""} onChange={(e) => updateMedicationField(medIndex, "prnReasonDetails", e.target.value)} />
                </FormRow>

                <LogSection>
                  <LogTable>
                    <thead>
                      <tr>
                        <th>Date</th>
                        {med.logTable.entries.map((entry) => (
                          <th key={`day-${med.id}-${entry.day}`}>{entry.day}</th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>Time</td>
                        {med.logTable.entries.map((entry, entryIndex) => (
                          <td key={`time-${med.id}-${entry.day}`}>
                            <SmallInput
                              type="text"
                              value={entry.time}
                              onChange={(e) => handleMedLogChange(medIndex, entryIndex, "time", e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>

                      <tr>
                        <td>Initials</td>
                        {med.logTable.entries.map((entry, entryIndex) => (
                          <td key={`init-${med.id}-${entry.day}`}>
                            <SmallInput
                              type="text"
                              value={entry.initials}
                              onChange={(e) => handleMedLogChange(medIndex, entryIndex, "initials", e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>

                      <tr>
                        <td>Amount Remaining</td>
                        {med.logTable.entries.map((entry, entryIndex) => (
                          <td key={`amt-${med.id}-${entry.day}`}>
                            <SmallInput
                              type="text"
                              value={entry.amountRemaining}
                              onChange={(e) => handleMedLogChange(medIndex, entryIndex, "amountRemaining", e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </LogTable>
                </LogSection>

                <div style={{ marginTop: 8 }}>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeMedicationById(med.id)}>
                    Remove Medication
                  </button>
                </div>
              </MedBody>
            )}
          </MedicationCard>
        ))}

        <Section>
          <h4>Caregiver Information</h4>
            {[effectiveUserObj, secondaryUserObj].map((user, i) => {
              const formName = formData?.caregivers?.[i]?.name || "";
              const localName = caregiverNames[i] || "";
              const fallbackName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "";

              const displayName = formName || localName || fallbackName;

              const sigExists = !!(
                signatures[i] &&
                (
                  (typeof signatures[i] === "string" && signatures[i].startsWith("data:")) ||
                  (Array.isArray(signatures[i]) && signatures[i].length > 0)
                )
              );

            const canSet = loggedInUserMatchesSlot(i);

            return (
              <CaregiverRow key={i}>
                <label>Printed Name of Caregiver:</label>
                <input type="text" value={displayName} readOnly />

                <label>Signature of Caregiver:</label>
                <div>
                  <ReactSignatureCanvas
                    ref={(el) => sigRefs.current[i] = el}
                    penColor="black"
                    canvasProps={{
                      width: 300,
                      height: 80,
                      className: "sigCanvas",
                      style: { border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#fff" },
                    }}
                  />
                  <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleSetSignature(i)}
                      disabled={!canSet || sigExists}
                      title={!canSet
                        ? "You cannot set this caregiver's signature"
                        : sigExists
                          ? "Signature already set"
                          : "Set signature from your profile"}
                    >
                      Set Signature
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleClearSignature(i)}
                      disabled={!sigExists}
                      title={!sigExists ? "No signature to clear" : "Clear signature"}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <label>Date:</label>
                <input type="date" value={sigDates[i] || today} readOnly />

                <label>Initials:</label>
                <input
                  type="text"
                  value={initials[i] || (user?.firstName && user?.lastName ? `${user.firstName[0]}${user.lastName[0]}` : "")}
                  readOnly
                />

                <label>Title:</label>
                <input type="text" value={titles[i] || user?.jobTitle || ""} readOnly style={{ backgroundColor: "#f9f9f9" }} />
              </CaregiverRow>
            );
          })}
        </Section>
        <div className="d-flex justify-content-between" style={{ marginTop: "30px", width: "650px" }}>
          <button type="button" className="lightBtn" style={{ width: "48%" }} onClick={handleFinishLater}>Finish Later</button>
          <button type="button" className="darkBtn" style={{ width: "48%" }} onClick={handleSubmit}>Submit</button>
        </div>
      </FormSection>
    </Container>
  );
};

export default MedicationLog;

const Container = styled.div`
  max-width: 900px;
  padding: 30px;
  font-family: "Arial", sans-serif;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 10px;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 20px;
  color: #444;
`;

const DescriptionBox = styled.div`
  border: 2px solid #ccc;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 40px;
  background-color: #f9f9f9;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
  text-align: center;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 8px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: normal;
`;

const RadioInput = styled.input`
  accent-color: #007bff;
`;

const OtherInput = styled.input`
  margin-left: 8px;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 70px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const LogSection = styled.div`
  margin-top: 40px;
  overflow-x: auto;
`;

const LogTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 0.85rem;
  margin-bottom: 40px;

  th,
  td {
    border: 1px solid #ccc;
    padding: 3px;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  td:first-child {
    width: 120px;
    font-weight: bold;
    background-color: #fafafa;
  }
`;

const SmallInput = styled.input`
  width: 35px;
  padding: 3px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 0.8rem;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const CaregiverRow = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 0.5rem 1rem;
  margin-top: 1rem;

  input {
    padding: 4px;
  }
`;

const Section = styled.div`
  margin-top: 1.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const MultiSelectContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const SelectedValues = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 40px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
`;

const Tag = styled.div`
  background: #e1eaff;
  padding: 4px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
`;

const RemoveTag = styled.span`
  margin-left: 8px;
  cursor: pointer;
  font-weight: bold;
`;

const Placeholder = styled.span`
  color: #aaa;
`;
const MedicationCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
`;

const MedHeader = styled.div`
  display:flex;
  justify-content: space-between;
  align-items:center;
  padding: 8px 12px;
  background:#f3f6fb;
  cursor: pointer;
`;

const Toggle = styled.div`
  font-size: 18px;
`;

const MedBody = styled.div`
  padding: 12px;
  background: #fff;
`;