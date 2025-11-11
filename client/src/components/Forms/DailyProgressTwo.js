import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Container, Form } from "react-bootstrap";
import "../../App.css";
import ClientOption from "../../utils/ClientOption.util";
import axios from "axios";
import Cookies from "universal-cookie";
import SignatureCanvas from "react-signature-canvas";
import { GetUserSig } from "../../utils/GetUserSig";
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

const DailyProgressTwo = ({ valuesSet, formData: propFormData, userObj: propUserObj, doUpdateFormDates }) => {
  // Main component for Daily Progress Note Two

  // Use a ref to track if the form has been saved
  const formSavedRef = useRef(false);

  const initialFormData = {
    createDate: "",
    clients: [],
    clientId: "",
    _id: "",
    lastEditDate: "",
    childSelected: false,
    approved: false,
    childMeta_name: "",
    createdByName: userObj
      ? `${userObj.firstName} ${userObj.lastName}`
      : "",
    status: "IN_PROGRESS",
  };

  // Initialize with propFormData if available, ensuring child data is properly set
  const getInitialState = () => {
    if (propFormData) {
      console.log("Initializing with propFormData:", propFormData);
      return {
        ...initialFormData,
        ...propFormData,
        childSelected: true,
        childMeta_name: propFormData.childMeta_name || (propFormData.child && propFormData.child.name) || ""
      };
    }
    return initialFormData;
  };

  const [formData, setFormData] = useState(getInitialState);

  const [shiftSummary, setShiftSummary] = useState({ shift1: "", shift2: "", shift3: "" });
  const [clothingDescription, setClothingDescription] = useState({ shirtBottoms: "", shoes: "", other: "" });
  const [initials, setInitials] = useState(["", "", ""]);
  const [titles, setTitles] = useState(["", "", ""]);
  const [selectedShifts, setSelectedShifts] = useState(["", "", ""]);
  const [showSignature, setShowSignature] = useState([false, false, false]);

  const effectiveUserObj = propUserObj || userObj;

  // Determine current shift based on the number of valid signatures
  const determineCurrentShift = () => {
    if (!propFormData || !propFormData.signatureSection || !propFormData.signatureSection.signatures) {
      return "shift1"; // New form, no signatures
    }

    // Count valid signatures (data URLs with sufficient length)
    const validSignatures = propFormData.signatureSection.signatures.filter(
      sig => typeof sig === 'string' && sig.startsWith('data:image/') && sig.length > 100
    );

    const signatureCount = validSignatures.length;

    if (signatureCount === 0) return "shift1"; // No signatures - AM shift
    if (signatureCount === 1) return "shift2"; // One signature - PM shift
    return "shift3"; // Two or more signatures - NOC shift
  };

  // Use the determined shift instead of user's shift
  const currentShift = determineCurrentShift();

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

  useEffect(() => {
    const fetchClients = async () => {
      if (!userObj?.homeId && !propUserObj?.homeId) return;
      try {
        const homeId = propUserObj?.homeId || userObj?.homeId;
        const { data } = await axios.get(`/api/client/${homeId}?active=true`);
        const activeClients = data.filter(
          (client) => !client.hasOwnProperty("active") || client.active === true
        );
        setFormData((prev) => ({ ...prev, clients: activeClients }));
      } catch (error) {
        alert("Error loading clients");
      }
    };

    fetchClients();
  }, [userObj?.homeId, propUserObj?.homeId]);

  // Debug log for props and state
  useEffect(() => {
    // Skip this effect if the form has been saved
    if (formSavedRef.current) {
      return;
    }

    if (valuesSet && propFormData) {
      // Set form data when propFormData changes
      setFormData(prev => {

        // Create a client object for the dropdown
        let clientSelectedValue = "";
        if (propFormData.child) {
          const clientObj = {
            _id: propFormData.child.childId,
            childMeta_name: propFormData.childMeta_name || propFormData.child.name
          };
          clientSelectedValue = JSON.stringify(clientObj);
        }

        return {
          ...prev,
          ...propFormData,
          childSelected: true,
          clientSelectedValue
        };
      });

      // Update other state values as needed
      if (propFormData.shiftSummary) {
        setShiftSummary(propFormData.shiftSummary);
      }

      if (propFormData.clothingDescription) {
        setClothingDescription(propFormData.clothingDescription);
      }

      // Populate checkbox states from propFormData
      if (propFormData.levelOfPrecaution) {
        const newChecked = initCheckState(labels.levelOfPrecaution.slice(1));

        // Handle if levelOfPrecaution is a string
        if (typeof propFormData.levelOfPrecaution === 'string') {
          // Initialize an empty object structure
          propFormData.levelOfPrecaution = {
            visuals: { shift1: false, shift2: false, shift3: false },
            suicidal: { shift1: false, shift2: false, shift3: false },
            homicidal: { shift1: false, shift2: false, shift3: false },
            oneToOne: { shift1: false, shift2: false, shift3: false },
            awol: { shift1: false, shift2: false, shift3: false }
          };
        }

        // Map the data to the checkboxes
        if (propFormData.levelOfPrecaution.visuals) {
          newChecked[0][0] = propFormData.levelOfPrecaution.visuals.shift1 || false;
          newChecked[0][1] = propFormData.levelOfPrecaution.visuals.shift2 || false;
          newChecked[0][2] = propFormData.levelOfPrecaution.visuals.shift3 || false;
        }

        if (propFormData.levelOfPrecaution.suicidal) {
          newChecked[1][0] = propFormData.levelOfPrecaution.suicidal.shift1 || false;
          newChecked[1][1] = propFormData.levelOfPrecaution.suicidal.shift2 || false;
          newChecked[1][2] = propFormData.levelOfPrecaution.suicidal.shift3 || false;
        }

        if (propFormData.levelOfPrecaution.homicidal) {
          newChecked[2][0] = propFormData.levelOfPrecaution.homicidal.shift1 || false;
          newChecked[2][1] = propFormData.levelOfPrecaution.homicidal.shift2 || false;
          newChecked[2][2] = propFormData.levelOfPrecaution.homicidal.shift3 || false;
        }

        if (propFormData.levelOfPrecaution.oneToOne) {
          newChecked[3][0] = propFormData.levelOfPrecaution.oneToOne.shift1 || false;
          newChecked[3][1] = propFormData.levelOfPrecaution.oneToOne.shift2 || false;
          newChecked[3][2] = propFormData.levelOfPrecaution.oneToOne.shift3 || false;
        }

        if (propFormData.levelOfPrecaution.awol) {
          newChecked[4][0] = propFormData.levelOfPrecaution.awol.shift1 || false;
          newChecked[4][1] = propFormData.levelOfPrecaution.awol.shift2 || false;
          newChecked[4][2] = propFormData.levelOfPrecaution.awol.shift3 || false;
        }

        setChecked(newChecked);
      }

      // Populate hygiene checkboxes
      if (propFormData.hygieneCompleted) {
        const newHygieneChecked = initCheckState(labels.hygiene.slice(1));

        if (propFormData.hygieneCompleted.yes) {
          newHygieneChecked[0][0] = propFormData.hygieneCompleted.yes.shift1 || false;
          newHygieneChecked[0][1] = propFormData.hygieneCompleted.yes.shift2 || false;
          newHygieneChecked[0][2] = propFormData.hygieneCompleted.yes.shift3 || false;
        }

        if (propFormData.hygieneCompleted.refused) {
          newHygieneChecked[1][0] = propFormData.hygieneCompleted.refused.shift1 || false;
          newHygieneChecked[1][1] = propFormData.hygieneCompleted.refused.shift2 || false;
          newHygieneChecked[1][2] = propFormData.hygieneCompleted.refused.shift3 || false;
        }

        if (propFormData.hygieneCompleted.needAssistance) {
          newHygieneChecked[2][0] = propFormData.hygieneCompleted.needAssistance.shift1 || false;
          newHygieneChecked[2][1] = propFormData.hygieneCompleted.needAssistance.shift2 || false;
          newHygieneChecked[2][2] = propFormData.hygieneCompleted.needAssistance.shift3 || false;
        }

        setHygieneChecked(newHygieneChecked);
      }

      // Populate daily chores checkboxes
      if (propFormData.dailyChoresCompleted) {
        const newDailyChoresChecked = initCheckState(labels.dailyChores.slice(1));

        if (propFormData.dailyChoresCompleted.yes) {
          newDailyChoresChecked[0][0] = propFormData.dailyChoresCompleted.yes.shift1 || false;
          newDailyChoresChecked[0][1] = propFormData.dailyChoresCompleted.yes.shift2 || false;
          newDailyChoresChecked[0][2] = propFormData.dailyChoresCompleted.yes.shift3 || false;
        }

        if (propFormData.dailyChoresCompleted.neededPrompting) {
          newDailyChoresChecked[1][0] = propFormData.dailyChoresCompleted.neededPrompting.shift1 || false;
          newDailyChoresChecked[1][1] = propFormData.dailyChoresCompleted.neededPrompting.shift2 || false;
          newDailyChoresChecked[1][2] = propFormData.dailyChoresCompleted.neededPrompting.shift3 || false;
        }

        if (propFormData.dailyChoresCompleted.refused) {
          newDailyChoresChecked[2][0] = propFormData.dailyChoresCompleted.refused.shift1 || false;
          newDailyChoresChecked[2][1] = propFormData.dailyChoresCompleted.refused.shift2 || false;
          newDailyChoresChecked[2][2] = propFormData.dailyChoresCompleted.refused.shift3 || false;
        }

        setDailyChoresChecked(newDailyChoresChecked);
      }

      // Populate medication compliance checkboxes
      if (propFormData.medicationCompliance) {
        const newMedicationChecked = initCheckState(labels.medicationCompliance.slice(1));

        if (propFormData.medicationCompliance.yes) {
          newMedicationChecked[0][0] = propFormData.medicationCompliance.yes.shift1 || false;
          newMedicationChecked[0][1] = propFormData.medicationCompliance.yes.shift2 || false;
          newMedicationChecked[0][2] = propFormData.medicationCompliance.yes.shift3 || false;
        }

        if (propFormData.medicationCompliance.neededPrompting) {
          newMedicationChecked[1][0] = propFormData.medicationCompliance.neededPrompting.shift1 || false;
          newMedicationChecked[1][1] = propFormData.medicationCompliance.neededPrompting.shift2 || false;
          newMedicationChecked[1][2] = propFormData.medicationCompliance.neededPrompting.shift3 || false;
        }

        if (propFormData.medicationCompliance.medicationTraining) {
          newMedicationChecked[2][0] = propFormData.medicationCompliance.medicationTraining.shift1 || false;
          newMedicationChecked[2][1] = propFormData.medicationCompliance.medicationTraining.shift2 || false;
          newMedicationChecked[2][2] = propFormData.medicationCompliance.medicationTraining.shift3 || false;
        }

        setMedicationChecked(newMedicationChecked);
      }

      // Populate daily intake
      if (propFormData.dailyIntake) {
        const newDailyIntake = labels.dailyIntake.slice(1).map(() => Array(3).fill(""));

        if (propFormData.dailyIntake.breakfast) {
          newDailyIntake[0][0] = propFormData.dailyIntake.breakfast.shift1 || "";
          newDailyIntake[0][1] = propFormData.dailyIntake.breakfast.shift2 || "";
          newDailyIntake[0][2] = propFormData.dailyIntake.breakfast.shift3 || "";
        }

        if (propFormData.dailyIntake.lunch) {
          newDailyIntake[1][0] = propFormData.dailyIntake.lunch.shift1 || "";
          newDailyIntake[1][1] = propFormData.dailyIntake.lunch.shift2 || "";
          newDailyIntake[1][2] = propFormData.dailyIntake.lunch.shift3 || "";
        }

        if (propFormData.dailyIntake.dinner) {
          newDailyIntake[2][0] = propFormData.dailyIntake.dinner.shift1 || "";
          newDailyIntake[2][1] = propFormData.dailyIntake.dinner.shift2 || "";
          newDailyIntake[2][2] = propFormData.dailyIntake.dinner.shift3 || "";
        }

        setDailyIntake(newDailyIntake);
      }

      // Populate staff intervention checkboxes
      if (propFormData.staffIntervention) {
        const newStaffInterventionChecked = initCheckState(labels.staffIntervention.slice(1));

        if (propFormData.staffIntervention.supportingEncouragingPositiveFeedback) {
          newStaffInterventionChecked[0][0] = propFormData.staffIntervention.supportingEncouragingPositiveFeedback.shift1 || false;
          newStaffInterventionChecked[0][1] = propFormData.staffIntervention.supportingEncouragingPositiveFeedback.shift2 || false;
          newStaffInterventionChecked[0][2] = propFormData.staffIntervention.supportingEncouragingPositiveFeedback.shift3 || false;
        }

        if (propFormData.staffIntervention.redirectsDisruptingConversation) {
          newStaffInterventionChecked[1][0] = propFormData.staffIntervention.redirectsDisruptingConversation.shift1 || false;
          newStaffInterventionChecked[1][1] = propFormData.staffIntervention.redirectsDisruptingConversation.shift2 || false;
          newStaffInterventionChecked[1][2] = propFormData.staffIntervention.redirectsDisruptingConversation.shift3 || false;
        }

        setStaffInterventionChecked(newStaffInterventionChecked);
      }

      // Populate resident behavior checkboxes
      if (propFormData.residentBehaviorPerformance) {
        const newResidentChecked = initCheckState(labels.residentBehavior.slice(1));

        // Map each field to the corresponding checkbox
        const fieldMapping = {
          receptiveToInformationFromStaffAndPeers: 0,
          enthusiasticAndHelpFulToOthers: 1,
          IdentifiesPotentialSoultionsForProblemSolving: 2,
          participatesWellInGroupActivities: 3,
          followsInstructionsWell: 4,
          destructionOfProperty: 5,
          physicalAggressionTowardsOthers: 6,
          temperOutburst: 7,
          NoncomplianceWithProgramHouseRules: 8,
          verbalAggressionTowardsPeers: 9,
          verbalAggressionTwoardsStaff: 10,
          sexualMisconduct: 11,
          limitedEyeContact: 12,
          refuseToProcessWithStaff: 13,
          InappropiateBehaviorConversation: 14,
          selfInjuriousBehavior: 15,
          isolation: 16,
          bulliesMeanToOthers: 17,
          peerInteractionIssues: 18,
          cursingAndProfanity: 19,
          actsFearful: 20,
          demandingForAttention: 21,
          liesAndManipulation: 22,
          passiveAggressive: 23,
          stealing: 24,
          agitatesOthers: 25,
          suddenMoodChanges: 26,
          notFollowingDirections: 27,
          disruptiveBehavior: 28
        };

        // Loop through each field in the mapping
        Object.entries(fieldMapping).forEach(([field, index]) => {
          if (propFormData.residentBehaviorPerformance[field]) {
            newResidentChecked[index][0] = propFormData.residentBehaviorPerformance[field].shift1 || false;
            newResidentChecked[index][1] = propFormData.residentBehaviorPerformance[field].shift2 || false;
            newResidentChecked[index][2] = propFormData.residentBehaviorPerformance[field].shift3 || false;
          }
        });

        setResidentChecked(newResidentChecked);
      }

      // Populate recreational/therapeutic activity checkboxes and radios
      if (propFormData.recTherapeuticActivity) {

        // Set checkboxes
        const newRecChecked = initCheckState(labels.recTherapeutic.slice(1));

        if (propFormData.recTherapeuticActivity.activityExerciseTrainer) {
          newRecChecked[0][0] = propFormData.recTherapeuticActivity.activityExerciseTrainer.shift1 || false;
          newRecChecked[0][1] = propFormData.recTherapeuticActivity.activityExerciseTrainer.shift2 || false;
          newRecChecked[0][2] = propFormData.recTherapeuticActivity.activityExerciseTrainer.shift3 || false;
        }

        if (propFormData.recTherapeuticActivity.whyTherapeutic) {
          newRecChecked[3][0] = propFormData.recTherapeuticActivity.whyTherapeutic.shift1 || false;
          newRecChecked[3][1] = propFormData.recTherapeuticActivity.whyTherapeutic.shift2 || false;
          newRecChecked[3][2] = propFormData.recTherapeuticActivity.whyTherapeutic.shift3 || false;
        }

        if (propFormData.recTherapeuticActivity.physicalFitnessPeer) {
          newRecChecked[4][0] = propFormData.recTherapeuticActivity.physicalFitnessPeer.shift1 || false;
          newRecChecked[4][1] = propFormData.recTherapeuticActivity.physicalFitnessPeer.shift2 || false;
          newRecChecked[4][2] = propFormData.recTherapeuticActivity.physicalFitnessPeer.shift3 || false;
        }

        setRecChecked(newRecChecked);

        // Set radio buttons
        const newRecActivityRadios = [
          ["", "", ""],
          ["", "", ""]
        ];

        if (propFormData.recTherapeuticActivity.participation) {
          newRecActivityRadios[0][0] = propFormData.recTherapeuticActivity.participation.shift1 || "";
          newRecActivityRadios[0][1] = propFormData.recTherapeuticActivity.participation.shift2 || "";
          newRecActivityRadios[0][2] = propFormData.recTherapeuticActivity.participation.shift3 || "";
        }

        if (propFormData.recTherapeuticActivity.peerInteraction) {
          newRecActivityRadios[1][0] = propFormData.recTherapeuticActivity.peerInteraction.shift1 || "";
          newRecActivityRadios[1][1] = propFormData.recTherapeuticActivity.peerInteraction.shift2 || "";
          newRecActivityRadios[1][2] = propFormData.recTherapeuticActivity.peerInteraction.shift3 || "";
        }

        setRecActivityRadios(newRecActivityRadios);
      }

      // Populate timeline
      if (propFormData.timeline && Array.isArray(propFormData.timeline)) {
        const newTimeline = labels.timeTable.map(() => Array(3).fill(""));

        propFormData.timeline.forEach((entry, index) => {
          if (index < newTimeline.length) {
            newTimeline[index][0] = entry.shift1 || "";
            newTimeline[index][1] = entry.shift2 || "";
            newTimeline[index][2] = entry.shift3 || "";
          }
        });

        setTimeline(newTimeline);
      }
    }
  }, [valuesSet, propFormData]);

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

  const initCheckState = (rows) => {
    if (!rows || !Array.isArray(rows)) {
      return [];
    }
    return rows.map(() => Array(3).fill(false));
  };
  const toggleCheck = (setFn) => (rowIndex, colIndex) =>
    setFn((prev) => {
      const updated = [...prev];
      updated[rowIndex][colIndex] = !updated[rowIndex][colIndex];
      return updated;
    });


  // Initialize state with safe defaults
  const [checked, setChecked] = useState(() => {
    try {
      return initCheckState(labels.levelOfPrecaution.slice(1));
    } catch (e) {
      return [];
    }
  });

  const [hygieneChecked, setHygieneChecked] = useState(() => {
    try {
      return initCheckState(labels.hygiene.slice(1));
    } catch (e) {
      return [];
    }
  });

  const [dailyChoresChecked, setDailyChoresChecked] = useState(() => {
    try {
      return initCheckState(labels.dailyChores.slice(1));
    } catch (e) {
      return [];
    }
  });

  const [medicationChecked, setMedicationChecked] = useState(() => {
    try {
      return initCheckState(labels.medicationCompliance.slice(1));
    } catch (e) {
      return [];
    }
  });

  const [residentChecked, setResidentChecked] = useState(() => {
    try {
      return initCheckState(labels.residentBehavior.slice(1));
    } catch (e) {
      return [];
    }
  });

  const [recChecked, setRecChecked] = useState(() => {
    try {
      return initCheckState(labels.recTherapeutic.slice(1));
    } catch (e) {
      return [];
    }
  });

  const [staffInterventionChecked, setStaffInterventionChecked] = useState(() => {
    try {
      return initCheckState(labels.staffIntervention.slice(1));
    } catch (e) {
      return [];
    }
  });

  const [timeline, setTimeline] = useState(() => {
    try {
      if (!labels.timeTable || !Array.isArray(labels.timeTable)) {
        return [];
      }
      return labels.timeTable.map(() => Array(3).fill(""));
    } catch (e) {
      return [];
    }
  });

  const [dailyIntake, setDailyIntake] = useState(() => {
    try {
      if (!labels.dailyIntake || !Array.isArray(labels.dailyIntake)) {
        return [];
      }
      return labels.dailyIntake.slice(1).map(() => Array(3).fill(""));
    } catch (e) {
      return [];
    }
  });
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

  // Helper function to check if an individual signature is valid
  const isSignatureValid = (idx) => {
    // Check if we have a saved signature in propFormData
    const hasSavedSignature = propFormData?.signatureSection?.signatures?.[idx] &&
      typeof propFormData.signatureSection.signatures[idx] === 'string' &&
      propFormData.signatureSection.signatures[idx].startsWith('data:image/') &&
      propFormData.signatureSection.signatures[idx].length > 100;

    // If we have a saved signature, consider it valid regardless of canvas state
    if (hasSavedSignature) {
      return true;
    }

    // Otherwise check all conditions for a new signature
    return sigRefs.current[idx] &&
      !sigRefs.current[idx].isEmpty() &&
      initials[idx] &&
      titles[idx] &&
      selectedShifts[idx];
  };

  // Helper function to check if all required signatures are valid
  // For submission, we only need the first two signatures (AM and PM)
  const areAllSignaturesValid = () => {
    return [0, 1].every(idx => isSignatureValid(idx));
  };

  // ----- SAVE / SUBMIT -----
  const handleSave = async (action) => {
    try {
      // Validate all signatures are present if submitting

      if (action === "submit" && !areAllSignaturesValid()) {
        alert("Both AM and PM signatures must be completed before submission.");
        return;
      }

      let reportId = formData._id;
      const effectiveHomeId = propUserObj?.homeId || userObj?.homeId;

      // REMOVED: No longer trying to fetch latest draft at all
      // This completely eliminates the API call that was causing issues

      // If we don't have a reportId, always create a new form
      // This applies to both "submit" and "draft" actions
      if (!reportId) {
        console.log("No reportId found, creating new form");
        reportId = undefined; // Explicitly set to undefined to create new form
      }

      const safeEnum = (val) => (val === "" ? undefined : val);

      // Helper function to remove _id fields from objects
      const removeIds = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;

        const newObj = Array.isArray(obj) ? [...obj] : { ...obj };

        if (newObj._id) {
          delete newObj._id;
        }

        Object.keys(newObj).forEach(key => {
          if (typeof newObj[key] === 'object' && newObj[key] !== null) {
            newObj[key] = removeIds(newObj[key]);
          }
        });

        return newObj;
      };

      // Ensure we have valid child data - simplified version
      if (!formData.child || !formData.child.childId) {
        if (formData.clientId) {
          formData.child = {
            childId: formData.clientId,
            name: formData.childMeta_name || "Unknown Child"
          };
        } else {
          alert("Please select a client before saving.");
          return;
        }
      }

      // Ensure childMeta_name is set
      if (!formData.childMeta_name && formData.child && formData.child.name) {
        formData.childMeta_name = formData.child.name;
      }

      const payload = {
        homeId: effectiveHomeId,
        child: formData.child,
        childMeta_name: formData.childMeta_name || (formData.child && formData.child.name) || "",
        approved: formData.approved,
        shiftSummary: removeIds(shiftSummary),
        clothingDescription: removeIds(clothingDescription),
        signatureSection: {
          signatures: sigRefs.current.map((sig) => {
            if (!sig) return "";
            try {
              // First try toDataURL directly if it exists
              if (typeof sig.toDataURL === 'function') {
                return sig.toDataURL();
              }

              // Then try getTrimmedCanvas
              if (typeof sig.getTrimmedCanvas === 'function' && sig.getTrimmedCanvas()) {
                return sig.getTrimmedCanvas().toDataURL();
              }

              // Finally try getCanvas as last resort
              if (typeof sig.getCanvas === 'function' && sig.getCanvas()) {
                return sig.getCanvas().toDataURL();
              }

              // If none of the methods work, return empty string
              return "";
            } catch (error) {
              console.error("Error getting signature canvas data:", error);
              return "";
            }
          }),
          initials,
          titles,
          selectedShifts: selectedShifts || ["", "", ""],
        },
        recTherapeuticActivity: removeIds({
          ...mapStaffInitials(initials),
          ...mapRecTherapeuticActivity({
            radiosArr: recActivityRadios,
            checkmarksData: {
              arr: recChecked,
              labels: labels.recTherapeutic.slice(1),
            },
          }),
        }),
        levelOfPrecaution: removeIds({
          ...mapStaffInitials(initials),
          ...mapLevelOfPrecaution(checked),
        }),

        // Debug levelOfPrecaution mapping
        _debug_levelOfPrecaution_before: checked,
        _debug_levelOfPrecaution_after: mapLevelOfPrecaution(checked),
        hygieneCompleted: removeIds({
          ...mapStaffInitials(initials),
          ...mapHygieneCompleted(hygieneChecked),
        }),
        dailyChoresCompleted: removeIds({
          ...mapStaffInitials(initials),
          ...mapDailyChoresCompleted(dailyChoresChecked),
        }),
        medicationCompliance: removeIds({
          ...mapStaffInitials(initials),
          ...mapMedicationCompliance(medicationChecked),
        }),
        dailyIntake: removeIds({
          ...mapStaffInitials(initials),
          ...mapDailyIntake(dailyIntake),
        }),
        staffIntervention: removeIds({
          ...mapStaffInitials(initials),
          ...mapStaffIntervention(staffInterventionChecked),
        }),
        residentBehaviorPerformance: removeIds({
          ...mapStaffInitials(initials),
          ...mapResidentBehaviorPerformance(residentChecked),
        }),
        timeline: removeIds(Array.isArray(labels.timeTable) && Array.isArray(timeline) ?
          mapTimeline(labels.timeTable, timeline) : []),
        submitted: action === "submit",

        formType: "Daily Progress Note Two",
        createdBy: effectiveUserObj?.email || "unknown",
        createdByName: effectiveUserObj ? `${effectiveUserObj.firstName} ${effectiveUserObj.lastName}` : "",
        status: action === "submit" ? "COMPLETED" : "IN_PROGRESS",
        lastEditDate: new Date().toISOString(),
      };

      // Prepare to save the form data

      if (reportId) {
        // Update existing report
        const { data: updatedReport } = await axios.put(
          `/api/dailyProgressNoteTwo/${effectiveHomeId}/${reportId}`,
          payload
        );

        // Update form data with the response
        setFormData(prev => ({ ...prev, ...updatedReport }));

        // Explicitly preserve all form state to prevent fields from being cleared
        // This ensures the form fields remain populated after saving

        // Preserve simple state variables
        if (updatedReport.shiftSummary) {
          setShiftSummary(updatedReport.shiftSummary);
        }

        if (updatedReport.clothingDescription) {
          setClothingDescription(updatedReport.clothingDescription);
        }

        // Preserve checkbox states - we'll use the current state since the server response
        // doesn't include the checkbox states in the same format
        // This prevents the form from being cleared after saving

        // If doUpdateFormDates is provided (from ShowFormContainer), call it
        if (doUpdateFormDates) {
          doUpdateFormDates(updatedReport.createDate);
        }
      } else {
        // Create new report
        const { data: newReport } = await axios.post(
          "/api/dailyProgressNoteTwo",
          { ...payload, clientId: formData.clientId }
        );

        // Store the new _id so future saves update this report
        setFormData((prev) => ({ ...prev, _id: newReport._id }));

        // Explicitly preserve all form state to prevent fields from being cleared
        // This ensures the form fields remain populated after saving

        // Preserve simple state variables
        if (newReport.shiftSummary) {
          setShiftSummary(newReport.shiftSummary);
        }

        if (newReport.clothingDescription) {
          setClothingDescription(newReport.clothingDescription);
        }

        // We don't need to preserve checkbox states for new reports as they're already set
      }

      // Mark the form as saved to prevent fields from being reset
      formSavedRef.current = true;

      // Show success message
      alert(action === "submit" ? "Form submitted successfully! Status set to COMPLETED." : "Draft saved successfully!");

      // Return true to indicate success
      return true;
    } catch (err) {
      console.log(err)
      alert("Error saving form.");
      return false;
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
            {valuesSet ? (
              <input
                type="text"
                value={formData.childMeta_name || (formData.child && formData.child.name) || ""}
                className="form-control"
                disabled
                style={{ height: "43px", boxSizing: "border-box" }}
              />
            ) : (
              <Form.Control
                as="select"
                value={formData.clientSelectedValue || ""}
                onChange={handleClientSelect}
                style={{ height: "43px", boxSizing: "border-box" }}
              >
                <option value="">Select Child</option>
                {Array.isArray(formData.clients) ? formData.clients.map((client, index) => (
                  <ClientOption key={index} data={client} />
                )) : null}
              </Form.Control>
            )}
          </div>
        </div>

        {/* Main Form Sections */}
        <Form className="d-flex flex-column align-items-center">
          {[
            // Remove the title prop to prevent it from being passed to ShiftTable
            { labels: labels.levelOfPrecaution, checkState: checked, toggleFn: toggleLevelOfPrecaution },
            { labels: labels.hygiene, checkState: hygieneChecked, toggleFn: toggleHygieneCheck },
            { labels: labels.dailyChores, checkState: dailyChoresChecked, toggleFn: toggleDailyChoresCheck },
            { labels: labels.medicationCompliance, checkState: medicationChecked, toggleFn: toggleMedicationCheck },
            { labels: labels.dailyIntake, checkState: dailyIntake, isRadio: true, options: dailyIntakeOptions, onRadioChange: handleDailyIntakeChange },
            { labels: labels.staffIntervention, checkState: staffInterventionChecked, toggleFn: toggleStaffInterventionCheck },
            { labels: labels.residentBehavior, checkState: residentChecked, toggleFn: toggleResidentCheck },
            { labels: labels.recTherapeutic, checkState: recChecked, toggleFn: toggleRecCheck, onRadioChange: handleRecActivityChange },
            { labels: labels.timeTable, checkState: [], toggleFn: null, isRadio: false, }, // New Section
          ].map((section, idx) => (
            <div key={idx} className="d-flex justify-content-center" style={{ width: "100%" }}>
              <div style={{ width: "650px" }}>
                <ShiftTable {...section} onRadioChange={section.onRadioChange} recActivityRadios={recActivityRadios} setRecActivityRadios={setRecActivityRadios} timeline={timeline} setTimeline={setTimeline} />
              </div>
            </div>
          ))}

          <ShiftSummary shiftSummary={shiftSummary} setShiftSummary={setShiftSummary} />
          <ClothingDescription clothingDescription={clothingDescription} setClothingDescription={setClothingDescription} />
          <SignatureSection
            sigRefs={sigRefs}
            initials={initials}
            setInitials={setInitials}
            titles={titles}
            setTitles={setTitles}
            selectedShifts={selectedShifts}
            setSelectedShifts={setSelectedShifts}
            showSignature={showSignature}
            setShowSignature={setShowSignature}
            formData={formData}
            setFormData={setFormData}
            valuesSet={valuesSet}
            propFormData={propFormData}
            isSignatureValid={isSignatureValid}
            areAllSignaturesValid={areAllSignaturesValid}
            effectiveUserObj={effectiveUserObj}
            currentShift={currentShift}
          />

          <div className="d-flex justify-content-between" style={{ marginTop: "30px", width: "650px" }}>
            <button
              type="button"
              className="lightBtn"
              style={{ width: "48%" }}
              onClick={() => handleSave("draft")}
              disabled={currentShift === "shift3"}
              title={currentShift === "shift3" ? "Cannot save as draft in NOC shift" : "Save form to finish later"}
            >
              Finish Later
            </button>
            <button
              type="button"
              className="darkBtn"
              style={{ width: "48%" }}
              onClick={() => handleSave("submit")}
              // disabled={!areAllSignaturesValid()}
              title={
                !areAllSignaturesValid()
                  ? "Both AM and PM signatures must be completed before submission"
                  : "Submit form"
              }
            >
              Submit
            </button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

// ---- ShiftTable ----
const ShiftTable = ({ labels, checkState, toggleFn, isRadio = false, options = [], onRadioChange, recActivityRadios, setRecActivityRadios, timeline, setTimeline }) => {
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
      {Array.isArray(labels) ? labels.map((label, rowIndex) => {
        const rowHeight = rowHeights[rowIndex] || 43;
        let inputType = "checkmark";

        // ---- Determine input type ----
        if (labels[0] === "9:00PM") {
          // Time Table section
          inputType = "text";
        }
        else if (rowIndex === 0) {
          // Header rows should be plain text, not input fields
          inputType = "header";
        } else if (labels[0] === "RECREATIONAL/THERAPEUTIC ACTIVITY:") {
          // Recreational/Therapeutic Activity section
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

              if (inputType === "header") {
                // For header rows, render empty cells for all columns
                // This prevents the section title from appearing in the "1st" column
                return (
                  <div
                    key={colIndex}
                    style={{
                      ...sharedStyle,
                      backgroundColor: "#e9ecef",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Intentionally left empty */}
                  </div>
                );
              } else if (inputType === "text") {
                if (labels[0] === "9:00PM") {
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
                if (labels[0] === "DAILY INTAKE") {
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
                if (labels[0] === "RECREATIONAL/THERAPEUTIC ACTIVITY:") {
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
      }) : null}
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
      {clothingDescription && typeof clothingDescription === 'object' ?
        Object.keys(clothingDescription)
          // Filter out _id field to prevent it from showing in the UI
          .filter(key => key !== '_id')
          .map((key) => (
            <div key={key} style={{ marginBottom: "10px" }}>
              <label style={{ fontWeight: "500", marginBottom: "5px" }}>{key.replace(/([A-Z])/g, " $1").toLocaleLowerCase()}</label>
              <input type="text" className="form-control" value={clothingDescription ? clothingDescription[key] || "" : ""} onChange={(e) => {
                const val = e?.target?.value || "";
                setClothingDescription((prev) => ({ ...(prev || {}), [key]: val }));
              }} />
            </div>
          )) : null}
    </div>
  </div>
);

// ---- SignatureSection ----
const SignatureSection = ({
  sigRefs,
  initials,
  setInitials,
  titles,
  setTitles,
  selectedShifts,
  setSelectedShifts,
  showSignature,
  setShowSignature,
  formData,
  setFormData,
  valuesSet,
  propFormData,
  isSignatureValid,
  areAllSignaturesValid,
  effectiveUserObj,
  currentShift
}) => {
  // Use the currentShift prop passed from parent component

  // Log component props on mount

  // Component initialization
  useEffect(() => {
    // Initialize component
  }, []);

  // Map shift names to their corresponding indices
  const shiftMap = {
    "shift1": 0, // AM shift
    "shift2": 1, // PM shift
    "shift3": 2  // NOC shift
  };

  // Get current user's shift index
  const currentShiftIndex = shiftMap[currentShift] || 0;

  // Check for user signature availability
  useEffect(() => {
    // Signature validation happens silently
  }, []);

  // Function to fetch user signature from API
  const fetchUserSignature = async (idx) => {
    if (!effectiveUserObj || !effectiveUserObj.email || !effectiveUserObj.homeId) {
      return false;
    }

    try {
      const { data: userData } = await GetUserSig(effectiveUserObj.email, effectiveUserObj.homeId);

      if (userData && userData.signature && sigRefs.current[idx]) {
        return new Promise((resolve) => {
          // Set a small timeout to ensure the canvas is fully rendered
          setTimeout(() => {
            try {
              if (typeof userData.signature === 'string' && userData.signature.startsWith('data:')) {
                sigRefs.current[idx].fromDataURL(userData.signature);
              } else {
                sigRefs.current[idx].fromData(userData.signature);
              }

              // Check if signature is empty after loading
              const isEmpty = sigRefs.current[idx].isEmpty();
              resolve(!isEmpty);
            } catch (error) {
              resolve(false);
            }
          }, 200);
        });
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  // Function to toggle signature dropdown
  const toggleSignature = async (idx) => {
    const newShowSignature = [...showSignature];
    newShowSignature[idx] = !newShowSignature[idx];
    setShowSignature(newShowSignature);

    // Update selectedShifts when toggling signature
    const newSelectedShifts = [...selectedShifts];
    if (newShowSignature[idx]) {
      // Set the shift value based on index
      newSelectedShifts[idx] = idx === 0 ? "AM" : idx === 1 ? "PM" : "NOC";

      // Always set the title immediately when showing signature
      if (effectiveUserObj?.jobTitle) {
        const newTitles = [...titles];
        newTitles[idx] = effectiveUserObj?.jobTitle;
        setTitles(newTitles);
      }
    } else {
      // Clear the shift value if hiding signature
      newSelectedShifts[idx] = "";
    }
    setSelectedShifts(newSelectedShifts);

    // If showing signature, try to load it
    if (newShowSignature[idx] && sigRefs.current[idx]) {
      // Set initials from user's name if available
      if (effectiveUserObj && effectiveUserObj.firstName && effectiveUserObj.lastName) {
        const newInitials = [...initials];
        if (!newInitials[idx]) {
          newInitials[idx] = effectiveUserObj.firstName.charAt(0) + effectiveUserObj.lastName.charAt(0);
          setInitials(newInitials);
        }
      }

      // Always set the title from effectiveUserObj?.jobTitle if available
      if (effectiveUserObj?.jobTitle) {
        const newTitles = [...titles];
        newTitles[idx] = effectiveUserObj?.jobTitle;
        setTitles(newTitles);
      }
    }
  };

  // Function to clear signature
  const clearSignature = (idx) => {
    if (sigRefs.current[idx]) {
      sigRefs.current[idx].clear();
    }

    // Clear initials and title for this signature
    const newInitials = [...initials];
    newInitials[idx] = "";
    setInitials(newInitials);

    const newTitles = [...titles];
    newTitles[idx] = "";
    setTitles(newTitles);

    // Reset shift selection
    const newSelectedShifts = [...selectedShifts];
    newSelectedShifts[idx] = "";
    setSelectedShifts(newSelectedShifts);

    // Hide signature canvas
    const newShowSignature = [...showSignature];
    newShowSignature[idx] = false;
    setShowSignature(newShowSignature);
  };

  // Load user signature when component mounts or effectiveUserObj changes - with fixed dependencies
  useEffect(() => {
    // Only run this effect if effectiveUserObj exists and there's at least one visible signature
    if (!effectiveUserObj || !showSignature.some(isShown => isShown)) return;

    // Use a single timeout to prevent performance issues
    const timer = setTimeout(() => {
      // For each visible signature dropdown, try to load the user's signature
      showSignature.forEach((isShown, idx) => {
        if (isShown && effectiveUserObj && sigRefs.current[idx]) {
          // Set the title from effectiveUserObj?.jobTitle if available
          if (effectiveUserObj?.jobTitle) {
            const newTitles = [...titles];
            newTitles[idx] = effectiveUserObj?.jobTitle;
            setTitles(newTitles);
          }

          // Try loading from effectiveUserObj signature if available
          if (effectiveUserObj.signature && typeof effectiveUserObj.signature === 'string') {
            try {
              if (effectiveUserObj.signature.startsWith('data:')) {
                sigRefs.current[idx].fromDataURL(effectiveUserObj.signature);
              } else {
                sigRefs.current[idx].fromData(effectiveUserObj.signature);
              }
            } catch (error) {
              // Silently handle signature loading errors
            }
          }
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [effectiveUserObj, showSignature, titles]); // Added titles to dependencies

  // Ref to track if we've already updated signature values
  const updatedRef = useRef(false);

  // Load saved signatures from form data
  useEffect(() => {
    // Skip if no form data or signature section
    if (!valuesSet || !propFormData || !propFormData.signatureSection) return;

    // Skip if we've already updated
    if (updatedRef.current) return;

    const { signatures, selectedShifts: savedShifts, initials: savedInitials, titles: savedTitles } = propFormData.signatureSection;

    // Handle signature visibility updates
    if (signatures && Array.isArray(signatures)) {
      const newShowSignature = [...showSignature];
      let showSignatureUpdated = false;

      signatures.forEach((sig, idx) => {
        if (sig && !newShowSignature[idx]) {
          newShowSignature[idx] = true;
          showSignatureUpdated = true;
        }
      });

      if (showSignatureUpdated) {
        setShowSignature(newShowSignature);
      }
    }

    // Load saved shift selections
    if (savedShifts && Array.isArray(savedShifts)) {
      setSelectedShifts(savedShifts);
    }

    // Load saved initials
    if (savedInitials && Array.isArray(savedInitials)) {
      setInitials(savedInitials);
    }

    // Load saved titles
    if (savedTitles && Array.isArray(savedTitles)) {
      setTitles(savedTitles);
    }

    // Load saved signatures
    if (signatures && Array.isArray(signatures)) {
      const timer = setTimeout(() => {
        signatures.forEach((sig, idx) => {
          if (sig && typeof sig === 'string' && sig.startsWith('data:') && sigRefs.current[idx]) {
            try {
              sigRefs.current[idx].fromDataURL(sig);
            } catch (error) {
              // Silently handle signature loading errors
            }
          }
        });
        // Mark as updated to prevent infinite loop
        updatedRef.current = true;
      }, 300);

      return () => clearTimeout(timer);
    }

    // Mark as updated to prevent infinite loop
    updatedRef.current = true;
  }, [valuesSet, propFormData]); // Remove dependencies that cause loops

  // Shift labels
  const shiftLabels = ["1st", "2nd", "3rd"];

  // Debug form status - removed to prevent excessive logging
  return (
    <div className="d-flex justify-content-center" style={{ width: "100%" }}>
      <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "15px", width: "650px", backgroundColor: "#f8f9fa", marginTop: "20px" }}>
        <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "10px", textAlign: "center" }}>
          Signature {formData.status === "COMPLETED" ? "(Form Completed)" : ""}
          {currentShift === "shift3" && formData.status !== "COMPLETED" && (
            <div style={{ fontSize: "14px", color: areAllSignaturesValid ? "green" : "red", marginTop: "5px" }}>
              {areAllSignaturesValid
                ? "✓ AM and PM signatures complete - ready for submission"
                : "⚠️ Both AM and PM signatures required before submission"}
            </div>
          )}
        </div>
        {shiftLabels.map((shiftLabel, idx) => (
          <div key={idx} className="mb-4">
            <div className="d-flex align-items-center mb-2" style={{ gap: "10px" }}>
              <div className="form-check">
                {/* Debug info - removed to prevent excessive logging */}
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`shift-${idx}`}
                  checked={showSignature[idx]}
                  onChange={() => toggleSignature(idx)}
                  disabled={
                    // Only disable if this specific shift has a valid signature (data URL)
                    (propFormData?.signatureSection?.signatures &&
                      propFormData.signatureSection.signatures[idx] &&
                      typeof propFormData.signatureSection.signatures[idx] === 'string' &&
                      propFormData.signatureSection.signatures[idx].startsWith('data:image/') &&
                      propFormData.signatureSection.signatures[idx].length > 100) ||
                    // Or if the entire form is completed
                    formData.status === "COMPLETED"
                  }
                />
                <label className="form-check-label" htmlFor={`shift-${idx}`}>
                  {shiftLabel} Shift
                  {currentShift === "shift3" && formData.status !== "COMPLETED" && (
                    <span style={{
                      marginLeft: "5px",
                      color: isSignatureValid && isSignatureValid(idx) ? "green" : "red",
                      fontSize: "12px"
                    }}>
                      {typeof isSignatureValid === 'function' ? (isSignatureValid(idx) ? "✓" : "⚠️") : "⚠️"}
                    </span>
                  )}
                </label>
              </div>
              {showSignature[idx] && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => clearSignature(idx)}
                  style={{ marginLeft: "auto" }}
                  disabled={
                    // Only disable if this specific shift has a valid signature (data URL)
                    (propFormData?.signatureSection?.signatures &&
                      propFormData.signatureSection.signatures[idx] &&
                      typeof propFormData.signatureSection.signatures[idx] === 'string' &&
                      propFormData.signatureSection.signatures[idx].startsWith('data:image/') &&
                      propFormData.signatureSection.signatures[idx].length > 100) ||
                    // Or if the entire form is completed
                    formData.status === "COMPLETED"
                  }
                >
                  Clear
                </button>
              )}
            </div>

            {showSignature[idx] && (
              <div className="signature-dropdown" style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "20px",
                backgroundColor: "#fff",
                marginBottom: "15px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}>
                <div className="d-flex flex-column" style={{ marginBottom: "15px", width: "100%" }}>
                  <div className="d-flex flex-column" style={{ gap: "15px", marginBottom: "15px", width: "100%" }}>
                    <div style={{ flexShrink: 0, width: "100%" }}>
                      <div>
                        {/* Signature canvas is disabled when form is completed or signature exists */}
                        {showSignature[idx] && (
                          <div className="signature-canvas-wrapper">
                            <SignatureCanvas
                              penColor="black"
                              canvasProps={{
                                width: 300,
                                height: 100,
                                className: "sigCanvas",
                                style: {
                                  border: "1px solid #ccc",
                                  width: "100%",
                                  maxWidth: "300px",
                                  height: "100px",
                                  backgroundColor: "#f9f9f9",
                                  borderRadius: "4px",
                                  opacity: (formData.status === "COMPLETED" ||
                                    (propFormData?.signatureSection?.signatures &&
                                      propFormData.signatureSection.signatures[idx] &&
                                      typeof propFormData.signatureSection.signatures[idx] === 'string' &&
                                      propFormData.signatureSection.signatures[idx].startsWith('data:image/') &&
                                      propFormData.signatureSection.signatures[idx].length > 100)) ? "0.7" : "1"
                                }
                              }}
                              ref={(el) => {
                                sigRefs.current[idx] = el;
                                // Disable signature canvas if form is completed or this specific signature is already set
                                if (el && (
                                  formData.status === "COMPLETED" ||
                                  (propFormData?.signatureSection?.signatures &&
                                    propFormData.signatureSection.signatures[idx] &&
                                    typeof propFormData.signatureSection.signatures[idx] === 'string' &&
                                    propFormData.signatureSection.signatures[idx].startsWith('data:image/') &&
                                    propFormData.signatureSection.signatures[idx].length > 100)
                                )) {
                                  el.off();
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: "10px", width: "100%" }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        style={{ width: "100%" }}
                        title="Set your signature from your user profile"
                        onClick={async () => {
                          // Directly fetch user signature from API
                          if (effectiveUserObj && effectiveUserObj.email && sigRefs.current[idx]) {
                            await fetchUserSignature(idx);
                          }

                          // Set initials and always set title
                          if (effectiveUserObj) {
                            // Set initials if empty
                            if (!initials[idx] && effectiveUserObj.firstName && effectiveUserObj.lastName) {
                              const newInitials = [...initials];
                              newInitials[idx] = effectiveUserObj.firstName.charAt(0) + effectiveUserObj.lastName.charAt(0);
                              setInitials(newInitials);
                            }

                            // Always set title from effectiveUserObj?.jobTitle
                            if (effectiveUserObj?.jobTitle) {
                              const newTitles = [...titles];
                              newTitles[idx] = effectiveUserObj?.jobTitle;
                              setTitles(newTitles);
                            }
                          }
                        }}
                        disabled={
                          // Only disable if this specific shift has a valid signature (data URL)
                          (propFormData?.signatureSection?.signatures &&
                            propFormData.signatureSection.signatures[idx] &&
                            typeof propFormData.signatureSection.signatures[idx] === 'string' &&
                            propFormData.signatureSection.signatures[idx].startsWith('data:image/') &&
                            propFormData.signatureSection.signatures[idx].length > 100) ||
                          // Or if the entire form is completed
                          formData.status === "COMPLETED"
                        }
                      >
                        Set Signature
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
                    {effectiveUserObj && effectiveUserObj.signature ? "Signature available" : "No signature available"}
                    <div style={{ marginTop: "5px" }}>
                      <span style={{ fontStyle: "italic" }}>
                        "Set Signature" loads your signature from your profile.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center" style={{ gap: "15px", marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="Initials"
                    value={Array.isArray(initials) ? initials[idx] : ""}
                    onChange={(e) => {
                      const val = e?.target?.value || "";
                      setInitials((prev) => {
                        const arr = Array.isArray(prev) ? [...prev] : ["", "", ""];
                        arr[idx] = val;
                        return arr;
                      });
                    }}
                    className="form-control"
                    style={{ flexGrow: 1 }}
                    disabled={
                      // Disable if this specific shift has a valid signature (data URL)
                      (propFormData?.signatureSection?.signatures &&
                        propFormData.signatureSection.signatures[idx] &&
                        typeof propFormData.signatureSection.signatures[idx] === 'string' &&
                        propFormData.signatureSection.signatures[idx].startsWith('data:image/') &&
                        propFormData.signatureSection.signatures[idx].length > 100) ||
                      // Or if the entire form is completed
                      formData.status === "COMPLETED"
                    }
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={Array.isArray(titles) ? titles[idx] : ""}
                    readOnly={true}
                    className="form-control"
                    style={{ flexGrow: 1, backgroundColor: "#f9f9f9" }}
                    disabled={formData.status === "COMPLETED"}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyProgressTwo;