import React, { useState, useEffect, useRef } from 'react';
import FormError from '../FormMods/FormError';
import FormAlert from './FormAlert';
import '../../App.css';
import Axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import { Form } from 'react-bootstrap';
import ClientOption from '../../utils/ClientOption.util';
import SignatureCanvas from 'react-signature-canvas';
import { GetUserSig } from '../../utils/GetUserSig';
import { FormSuccessAlert } from '../../utils/FormSuccessAlert';
import { FormSavedAlert } from '../../utils/FormSavedAlert';
import TextareaAutosize from 'react-textarea-autosize';

var interval = 0; // used for autosaving
let initAutoSave = true;

const TestTreatmentPlan72 = ({ id, inputData, valuesSet, userObj }) => {
  const { firstName, lastName, homeId } = userObj;

  const [formData, setFormData] = useState({
    childMeta_name: '',
    childMeta_dob: '',
    childMeta_age: '',
    childMeta_ssn: '',
    childMeta_gender: '',
    childMeta_medicaidNumber: '',
    childMeta_county: '',
    childMeta_placeOfBirth: '',
    childMeta_ethnicity: '',
    childMeta_levelOfCare: '',

    childMeta_religion: '',

    childMeta_managingConservator: '',

    projectedDateForAchievingPermanency: '',

    legalStatus_PermancyGoal: '',

    fatherMeta_name: '',

    fatherMeta_address: '',

    fatherMeta_phoneNumber: '',

    motherMeta_name: '',

    motherMeta_address: '',

    motherMeta_phoneNumber: '',

    legalStatus: '',

    referringAgency_co: '',

    agentOfReferringAgency_co_name: '',

    agentOfReferringAgency_co_address: '',

    reactionToPlacement: '',

    interests: '',

    otherMeta1_name: '',

    otherMeta1_relationship: '',

    otherMeta1_address: '',

    otherMeta1_phoneNumber: '',

    otherMeta2_name: '',

    otherMeta2_relationship: '',

    otherMeta2_address: '',

    otherMeta2_phoneNumber: '',

    otherMeta3_name: '',

    otherMeta3_relationship: '',

    otherMeta3_address: '',

    otherMeta3_phoneNumber: '',

    otherMeta4_name: '',

    otherMeta4_relationship: '',

    otherMeta4_address: '',

    otherMeta4_phoneNumber: '',

    currentMedicalInformation: '',

    developmental_medicalHistory: '',

    drugAllergies: '',

    food1: '',

    allergies: '',

    chronicHealth: '',

    healthStrengths: '',

    healthNeeds: '',

    lastPhysicalExamination_date: '',

    lastPhysicalExamination_location: '',

    lastPhysicalExamination_monitoredBy: '',

    lastDentalExamination_date: '',

    lastDentalExamination_location: '',

    lastDentalExamination_monitoredBy: '',

    lastOpticalExamination_date: '',

    lastOpticalExamination_location: '',

    lastOpticalExamination_monitoredBy: '',

    currentMedications_dosages_targetedSymptoms1_medication: '',

    currentMedications_dosages_targetedSymptoms1_dosage_frequency: '',

    currentMedications_dosages_targetedSymptoms1_purpose: '',

    currentMedications_dosages_targetedSymptoms1_possibleSideEffects: '',

    currentMedications_dosages_targetedSymptoms1_monitoredBy: '',

    currentMedications_dosages_targetedSymptoms2_medication: '',

    currentMedications_dosages_targetedSymptoms2_dosage_frequency: '',

    currentMedications_dosages_targetedSymptoms2_purpose: '',

    currentMedications_dosages_targetedSymptoms2_possibleSideEffects: '',

    currentMedications_dosages_targetedSymptoms2_monitoredBy: '',

    currentMedications_dosages_targetedSymptoms3_medication: '',

    currentMedications_dosages_targetedSymptoms3_dosage_frequency: '',

    currentMedications_dosages_targetedSymptoms3_purpose: '',

    currentMedications_dosages_targetedSymptoms3_possibleSideEffects: '',

    currentMedications_dosages_targetedSymptoms3_monitoredBy: '',

    currentMedications_dosages_targetedSymptoms4_medication: '',

    currentMedications_dosages_targetedSymptoms4_dosage_frequency: '',

    currentMedications_dosages_targetedSymptoms4_purpose: '',

    currentMedications_dosages_targetedSymptoms4_possibleSideEffects: '',

    currentMedications_dosages_targetedSymptoms4_monitoredBy: '',

    currentMedications_dosages_targetedSymptoms5_medication: '',

    currentMedications_dosages_targetedSymptoms5_dosage_frequency: '',

    currentMedications_dosages_targetedSymptoms5_purpose: '',

    currentMedications_dosages_targetedSymptoms5_possibleSideEffects: '',

    currentMedications_dosages_targetedSymptoms5_monitoredBy: '',

    behavioralStrengths: '',

    behavioralNeeds: '',

    behavioralTreatmentServices: '',

    emotionalStrengths: '',

    emotionalNeeds: '',

    emotionalTreatmentServices: '',

    food2: '',

    eyeContact: '',

    physicalTouch: '',

    personalProperty: '',

    certainTopics: '',

    knownContraindicationsToTheUuseOfRestraint: '',

    de_escalatingTechniquesToAvoidRestraints_ebi: '',

    child_de_escalator: '',

    staff_de_escalator: '',

    therapist_de_escalator: '',

    childPreferred_de_escalation: '',

    interventionStrategies: '',

    supervisionStrategies: '',

    social_recreationalStrengths: '',

    social_recreationalNeeds: '',

    familyStrengths: '',

    familyNeeds: '',

    visitor1_name: '',

    visitor1_relationship: '',

    visitor1_frequency: '',

    visitor1_supervisedBy: '',

    visitor1_location: '',

    visitor1_length: '',

    visitor2_name: '',

    visitor2_relationship: '',

    visitor2_frequency: '',

    visitor2_supervisedBy: '',

    visitor2_location: '',

    visitor2_length: '',

    visitor3_name: '',

    visitor3_relationship: '',

    visitor3_frequency: '',

    visitor3_supervisedBy: '',

    visitor3_location: '',

    visitor3_length: '',

    visitor4_name: '',

    visitor4_relationship: '',

    visitor4_frequency: '',

    visitor4_supervisedBy: '',

    visitor4_location: '',

    visitor4_length: '',

    educational_vacationalStrengths: '',

    educational_vacationalNeeds: '',

    transitionalLiving: '',

    dischargePlanning: '',

    longRangeGoals: '',

    shortRangeGoals: '',

    administorSign: '',

    administorSignDate: '',

    treatmentDirectorSign: '',

    treatmentDirectorSignDate: '',

    createdBy: valuesSet === true ? '' : userObj.email,

    createdByName: valuesSet === true ? '' : firstName + ' ' + lastName,

    lastEditDate: null,

    homeId: valuesSet === true ? '' : homeId,

    formHasError: false,

    formSubmitted: false,

    formErrorMessage: '',

    loadingClients: true,

    loadingSig: true,

    clients: [],
    clientId: '',
  });

  const sigCanvas = useRef(null);

  const toggleSuccessAlert = () => {
    setFormData({
      ...formData,
      formSubmitted: !formData.formSubmitted,
      loadingClients: false,
    });
  };

  const toggleErrorAlert = () => {
    setFormData({
      ...formData,
      formHasError: !formData.formHasError,
      formErrorMessage: '',
    });
  };

  const handleFieldInput = (event) => {
    var stateObj = {};
    if (event.target.id.indexOf('.') > -1) {
      let level1Obj = event.target.id.split('.')[0];
      let level2Obj = event.target.id.split('.')[1];

      let nestedProperty = { ...formData[level1Obj] };
      nestedProperty[level2Obj] = event.target.value;
      stateObj[level1Obj] = nestedProperty;
    } else {
      stateObj[event.target.id] = event.target.value;
    }
    setFormData(stateObj);
  };

  const resetForm = () => {
    setFormData({
      childMeta_name: '',
      childMeta_dob: '',
      childMeta_age: '',
      childMeta_ssn: '',
      childMeta_gender: '',
      childMeta_medicaidNumber: '',
      childMeta_county: '',
      childMeta_placeOfBirth: '',
      childMeta_ethnicity: '',
      childMeta_levelOfCare: '',

      childMeta_religion: '',

      childMeta_managingConservator: '',

      projectedDateForAchievingPermanency: '',

      legalStatus_PermancyGoal: '',

      fatherMeta_name: '',

      fatherMeta_address: '',

      fatherMeta_phoneNumber: '',

      motherMeta_name: '',

      motherMeta_address: '',

      motherMeta_phoneNumber: '',

      legalStatus: '',

      referringAgency_co: '',

      agentOfReferringAgency_co_name: '',

      agentOfReferringAgency_co_address: '',

      reactionToPlacement: '',

      interests: '',

      otherMeta1_name: '',

      otherMeta1_relationship: '',

      otherMeta1_address: '',

      otherMeta1_phoneNumber: '',

      otherMeta2_name: '',

      otherMeta2_relationship: '',

      otherMeta2_address: '',

      otherMeta2_phoneNumber: '',

      otherMeta3_name: '',

      otherMeta3_relationship: '',

      otherMeta3_address: '',

      otherMeta3_phoneNumber: '',

      otherMeta4_name: '',

      otherMeta4_relationship: '',

      otherMeta4_address: '',

      otherMeta4_phoneNumber: '',

      currentMedicalInformation: '',

      developmental_medicalHistory: '',

      drugAllergies: '',

      food1: '',

      allergies: '',

      chronicHealth: '',

      healthStrengths: '',

      healthNeeds: '',

      lastPhysicalExamination_date: '',

      lastPhysicalExamination_location: '',

      lastPhysicalExamination_monitoredBy: '',

      lastDentalExamination_date: '',

      lastDentalExamination_location: '',

      lastDentalExamination_monitoredBy: '',

      lastOpticalExamination_date: '',

      lastOpticalExamination_location: '',

      lastOpticalExamination_monitoredBy: '',

      currentMedications_dosages_targetedSymptoms1_medication: '',

      currentMedications_dosages_targetedSymptoms1_dosage_frequency: '',

      currentMedications_dosages_targetedSymptoms1_purpose: '',

      currentMedications_dosages_targetedSymptoms1_possibleSideEffects: '',

      currentMedications_dosages_targetedSymptoms1_monitoredBy: '',

      currentMedications_dosages_targetedSymptoms2_medication: '',

      currentMedications_dosages_targetedSymptoms2_dosage_frequency: '',

      currentMedications_dosages_targetedSymptoms2_purpose: '',

      currentMedications_dosages_targetedSymptoms2_possibleSideEffects: '',

      currentMedications_dosages_targetedSymptoms2_monitoredBy: '',

      currentMedications_dosages_targetedSymptoms3_medication: '',

      currentMedications_dosages_targetedSymptoms3_dosage_frequency: '',

      currentMedications_dosages_targetedSymptoms3_purpose: '',

      currentMedications_dosages_targetedSymptoms3_possibleSideEffects: '',

      currentMedications_dosages_targetedSymptoms3_monitoredBy: '',

      currentMedications_dosages_targetedSymptoms4_medication: '',

      currentMedications_dosages_targetedSymptoms4_dosage_frequency: '',

      currentMedications_dosages_targetedSymptoms4_purpose: '',

      currentMedications_dosages_targetedSymptoms4_possibleSideEffects: '',

      currentMedications_dosages_targetedSymptoms4_monitoredBy: '',

      currentMedications_dosages_targetedSymptoms5_medication: '',

      currentMedications_dosages_targetedSymptoms5_dosage_frequency: '',

      currentMedications_dosages_targetedSymptoms5_purpose: '',

      currentMedications_dosages_targetedSymptoms5_possibleSideEffects: '',

      currentMedications_dosages_targetedSymptoms5_monitoredBy: '',

      behavioralStrengths: '',

      behavioralNeeds: '',

      behavioralTreatmentServices: '',

      emotionalStrengths: '',

      emotionalNeeds: '',

      emotionalTreatmentServices: '',

      food2: '',

      eyeContact: '',

      physicalTouch: '',

      personalProperty: '',

      certainTopics: '',

      knownContraindicationsToTheUuseOfRestraint: '',

      de_escalatingTechniquesToAvoidRestraints_ebi: '',

      child_de_escalator: '',

      staff_de_escalator: '',

      therapist_de_escalator: '',

      childPreferred_de_escalation: '',

      interventionStrategies: '',

      supervisionStrategies: '',

      social_recreationalStrengths: '',

      social_recreationalNeeds: '',

      familyStrengths: '',

      familyNeeds: '',

      visitor1_name: '',

      visitor1_relationship: '',

      visitor1_frequency: '',

      visitor1_supervisedBy: '',

      visitor1_location: '',

      visitor1_length: '',

      visitor2_name: '',

      visitor2_relationship: '',

      visitor2_frequency: '',

      visitor2_supervisedBy: '',

      visitor2_location: '',

      visitor2_length: '',

      visitor3_name: '',

      visitor3_relationship: '',

      visitor3_frequency: '',

      visitor3_supervisedBy: '',

      visitor3_location: '',

      visitor3_length: '',

      visitor4_name: '',

      visitor4_relationship: '',

      visitor4_frequency: '',

      visitor4_supervisedBy: '',

      visitor4_location: '',

      visitor4_length: '',

      educational_vacationalStrengths: '',

      educational_vacationalNeeds: '',

      transitionalLiving: '',

      dischargePlanning: '',

      longRangeGoals: '',

      shortRangeGoals: '',

      administorSign: '',

      administorSignDate: '',

      treatmentDirectorSign: '',

      treatmentDirectorSignDate: '',

      clientId: '',
    });
  };

  // switch intialAutoSave to true and clear interval when component is unmounted
  useEffect(() => {
    if (valuesSet) {
      setValues();
    } else {
      fetchClients();
      interval = setInterval(() => {
        autoSave();
      }, 7000);
    }

    return () => {
      console.log('clearing auto save interval');
      initAutoSave = false;
      clearInterval(interval);
    };
  }, []);

  const autoSave = () => {
    let currentState = JSON.parse(JSON.stringify(formData));
    delete currentState.clients;
    delete currentState.staff;
    console.log('autosaving');

    if (
      currentState.childMeta_name === '' ||
      currentState.childMeta_name.length === 0
    ) {
      return;
    }
    if (initAutoSave) {
      console.log('updating existing form');
      try {
        const { data } = Axios.put(
          `api/treatmentPlans72/${formData.homeId}/${formData._id}`,
          { ...currentState }
        );
        setFormData({
          ...formData,
          lastEditDate: data.lastEditDate,
        });
      } catch (e) {
        setFormData({
          formHasError: true,
          formErrorMessage: 'Error Submitting 72 Hour Treatment Plan',
          loadingClients: false,
        });
      }
    } else {
      console.log('creating new form');
      currentState.createdBy = userObj.email;
      currentState.createdByName = userObj.firstName + ' ' + userObj.lastName;

      Axios.post(`api/treatmentPlans72/`, currentState)
        .then((res) => {
          initAutoSave = true;

          setFormData({
            ...formData,
            _id: res.data._id,
          });
        })
        .catch((err) => {
          console.log(err);
          setFormData({
            formHasError: true,
            formErrorMessage: 'Error Submitting 72 Hour Treatment Plan',
            loadingClients: false,
          });
        });
    }
  };

  const submitForm = async (event) => {
    let currentState = JSON.parse(JSON.stringify(formData));
    delete currentState.clients;
    delete currentState.staff;
    initAutoSave = false;
    clearInterval(interval);
    console.log('submitting form');

    if (valuesSet || formData.id) {
      console.log('updating existing form');
      try {
        const { data } = await Axios.put(
          `api/treatmentPlans72/${formData.homeId}/${formData._id}`,
          { ...currentState }
        );

        setFormData({
          ...formData,
          ...data,
        });

        window.scrollTo(0, 0);

        toggleSuccessAlert();
      } catch (e) {
        console.log(e);
        setFormData({
          formHasError: true,
          formErrorMessage: 'Error Submitting 72 Hour Treatment Plan',
          loadingClients: false,
        });
      }
    } else {
      currentState.createdBy = userObj.email;
      currentState.createdByName = userObj.firstName + ' ' + userObj.lastName;

      Axios.post(`api/treatmentPlans72/`, currentState)
        .then((res) => {
          window.scrollTo(0, 0);

          toggleSuccessAlert();

          if (!valuesSet) {
            resetForm();
          }
        })
        .catch((err) => {
          console.log(err);
          setFormData({
            formHasError: true,
            formErrorMessage: 'Error Submitting 72 Hour Treatment Plan',
            loadingClients: false,
          });
        });
    }
  };

  const dateForDateTimeInputValue = () => {
    new Date(new Date(formData.createDate).getTime())
      .toISOString()
      .slice(0, 19);
  };

  const validateForm = async (save) => {
    setFormData({
      ...formData,
      loadingClients: true,
    });

    if (formData.createDate) {
      setFormData({
        formHasError: true,
        formErrorMessage: `Please complete the following field(s): Create Date`,
      });
      return;
    } else {
      setFormData({
        createData: new Date(formData.createDate),
      });
    }

    submitForm();
  };

  const setSignature = (userObj) => {
    if (userObj.signature && userObj.signature.length) {
      sigCanvas.fromData(userObj.signature);
    }
  };

  const setValues = async () => {
    const { data: createdUserData } = await GetUserSig(
      inputData.createdBy,
      homeId
    );

    setSignature(createdUserData);

    sigCanvas.off();

    setFormData({
      ...formData,
      ...inputData,
      loadingSig: false,
      loadingClients: false,
    });
  };

  const fetchClients = async () => {
    try {
      let { data: clients } = await Axios.get(`api/client/${homeId}`);

      clients = clients.filter((client) => {
        return !client.hasOwnProperty('active') || client.active === true;
      });

      setTimeout(() => {
        setFormData({
          ...formData,
          clients,
          loadingClients: !formData.loadingClients,
        });
      }, 2000);
    } catch (e) {
      console.log(e);
      alert('Error fetching clients');
    }
  };

  const handleClientSelect = async (event) => {};

  if (!valuesSet) {
    return (
      <div className='formComp'>
        {formData.formSubmitted || formData.formHasError ? (
          <React.Fragment>
            {formData.formSubmitted && <FormSuccessAlert />}
            <FormAlert
              doShow={formData.formHasError}
              toggleErrorAlert={toggleErrorAlert}
              type='danger'
              heading='Error Submitting form'
            >
              <p>{formData.formErrorMessage}</p>
            </FormAlert>
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
        <div className='formTitleDiv'>
          <h2 className='formTitle'>72 Hour Treatment Plan</h2>
          <h5
            className='text-center'
            style={{ color: 'rgb(119 119 119 / 93%)' }}
          >
            {formData.lastEditDate ? (
              <i>
                {' '}
                Last Saved:
                {`${new Date(formData.lastEditDate)
                  .toTimeString()
                  .replace(/\s.*/, '')} - ${new Date(
                  formData.lastEditDate
                ).toDateString()}`}
              </i>
            ) : (
              '-'
            )}
          </h5>
        </div>
        <div className='formFieldsMobile'>
          {formData.loadingClients ? (
            <div className='formLoadingDiv'>
              <div>
                <ClipLoader
                  className='formSpinner'
                  size={50}
                  color={'#ffc107'}
                />
              </div>

              <p>Loading...</p>
            </div>
          ) : (
            <div>
              <div className='form-group logInInputField'>
                <label className='control-label'>Create Date</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='createDate'
                  value={formData.createDate}
                  className='form-control'
                  type='datetime-local'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Child's Name</label>{' '}
                <Form.Control
                  as='select'
                  defaultValue={null}
                  onChange={handleClientSelect}
                >
                  {[null, ...formData.clients].map(
                    (client) => (
                      <ClientOption data={client} />
                    ),
                    []
                  )}
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Child's Date of Birth
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='childMeta_dob'
                  value={formData.childMeta_dob}
                  className='form-control'
                  type='date'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Child's Age</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='childMeta_age'
                  value={formData.childMeta_age}
                  className='form-control'
                  type='number'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Child's SSN</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='childMeta_ssn'
                  value={formData.childMeta_ssn}
                  className='form-control'
                  type='number'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Child's Gender</label>{' '}
                <Form.Control
                  as='select'
                  onChange={handleFieldInput}
                  value={formData.childMeta_gender}
                  id='childMeta_gender'
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option value={''}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Child's Medicaid Number
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='childMeta_medicaidNumber'
                  value={formData.childMeta_medicaidNumber}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Child's Birth County
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='childMeta_county'
                  value={formData.childMeta_county}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Child's Place of Birth (City, State)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='childMeta_placeOfBirth'
                  value={formData.childMeta_placeOfBirth}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Child's Ethnicity</label>{' '}
                <Form.Control
                  as='select'
                  onChange={handleFieldInput}
                  value={formData.childMeta_ethnicity}
                  id='childMeta_ethnicity'
                >
                  <option>Black</option>
                  <option>White</option>
                  <option>Hispanic</option>
                  <option>Asian</option>
                  <option>Pacific Islander</option>
                  <option>Native American</option>
                  <option>Other</option>
                  <option value={''}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Child's Level of Care
                </label>{' '}
                <Form.Control
                  as='select'
                  onChange={handleFieldInput}
                  value={formData.childMeta_levelOfCare}
                  id='childMeta_levelOfCare'
                >
                  <option>Basic</option>
                  <option>Moderate</option>
                  <option>Specialized</option>
                  <option>Intense</option>
                  <option>Intense-plus</option>
                  <option value={''}>Choose</option>
                </Form.Control>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Child's Religion</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='childMeta_religion'
                  value={formData.childMeta_religion}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <label className='control-label'>
                  Child's Managing Conservator
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='childMeta_managingConservator'
                  value={formData.childMeta_managingConservator}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <label className='control-label'>
                  Projected Date for Achieving Permanency
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='projectedDateForAchievingPermanency'
                  value={formData.projectedDateForAchievingPermanency}
                  className='form-control'
                  type='date'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <label className='control-label'>
                  Legal Status/Permanency Goal
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='legalStatus_PermancyGoal'
                  value={formData.legalStatus_PermancyGoal}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <label className='control-label'>Father's Name</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='fatherMeta_name'
                  value={formData.fatherMeta_name}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <label className='control-label'>Father's Address</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='fatherMeta_address'
                  value={formData.fatherMeta_address}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <label className='control-label'>Father's Phone Number</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='fatherMeta_phoneNumber'
                  value={formData.fatherMeta_phoneNumber}
                  className='form-control'
                  type='tel'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <label className='control-label'>Mother's Name</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='motherMeta_name'
                  value={formData.motherMeta_name}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <label className='control-label'>Mother's Address</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='motherMeta_address'
                  value={formData.motherMeta_address}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <label className='control-label'>Mother's Phone Number</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='motherMeta_phoneNumber'
                  value={formData.motherMeta_phoneNumber}
                  className='form-control'
                  type='tel'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <label className='control-label'>Legal Status</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='legalStatus'
                  value={formData.legalStatus}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <label className='control-label'>Referring Agency / Co</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='referringAgency_co'
                  value={formData.referringAgency_co}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <label className='control-label'>
                  Name of Agent of Referring Agency / Co
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='agentOfReferringAgency_co_name'
                  value={formData.agentOfReferringAgency_co_name}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Address of Agent of Referring Agency / Co
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='agentOfReferringAgency_co_address'
                  value={formData.agentOfReferringAgency_co_address}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <label className='control-label'>
                  Child's Reaction to Placement
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='reactionToPlacement'
                  value={formData.reactionToPlacement}
                  className='form-control'
                  type='text'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Child's Interests</label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='interests'
                  value={formData.interests}
                  className='form-control'
                  type='text'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                <h5>
                  Significant relationship to the child{' '}
                  <i>
                    (siblings, others relatives, CASA workers, and attorney)
                  </i>
                  :
                </h5>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Name of Significant Relation (1)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta1_name'
                  value={formData.otherMeta1_name}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Relationship of Significant Relation (1)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta1_relationship'
                  value={formData.otherMeta1_relationship}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Address of Significant Relation (1)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta1_address'
                  value={formData.otherMeta1_address}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Phone Number of Significant Relation (1)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta1_phoneNumber'
                  value={formData.otherMeta1_phoneNumber}
                  className='form-control'
                  type='number'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Name of Significant Relation (2)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta2_name'
                  value={formData.otherMeta2_name}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Relationship of Significant Relation (2)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta2_relationship'
                  value={formData.otherMeta2_relationship}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Address of Significant Relation (2)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta2_address'
                  value={formData.otherMeta2_address}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Phone Number of Significant Relation (2)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta2_phoneNumber'
                  value={formData.otherMeta2_phoneNumber}
                  className='form-control'
                  type='number'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Name of Significant Relation (3)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta3_name'
                  value={formData.otherMeta3_name}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Relationship of Significant Relation (3)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta3_relationship'
                  value={formData.otherMeta3_relationship}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Address of Significant Relation (3)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta3_address'
                  value={formData.otherMeta3_address}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Phone Number of Significant Relation (3)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta3_phoneNumber'
                  value={formData.otherMeta3_phoneNumber}
                  className='form-control'
                  type='number'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Name of Significant Relation (4)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta4_name'
                  value={formData.otherMeta4_name}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Relationship of Significant Relation (4)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta4_relationship'
                  value={formData.otherMeta4_relationship}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Address of Significant Relation (4)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta4_address'
                  value={formData.otherMeta4_address}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Phone Number of Significant Relation (4)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='otherMeta4_phoneNumber'
                  value={formData.otherMeta4_phoneNumber}
                  className='form-control'
                  type='number'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <h5>MEDICAL / DENTAL / DEVELOPMENTAL</h5>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Current Medical Information
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='currentMedicalInformation'
                  value={formData.currentMedicalInformation}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Developmental / Medical History
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='developmental_medicalHistory'
                  value={formData.developmental_medicalHistory}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Drug Allergies</label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='drugAllergies'
                  value={formData.drugAllergies}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Food Allergies</label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='foodAllergies'
                  value={formData.foodAllergies}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Allergies</label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='allergies'
                  value={formData.allergies}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Chronic Health</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='chronicHealth'
                  value={formData.chronicHealth}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Health Strengths</label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='healthStrengths'
                  value={formData.healthStrengths}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Health Needs</label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='healthNeeds'
                  value={formData.healthNeeds}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Last Physical Examination
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='lastPhysicalExamination_date'
                  value={formData.lastPhysicalExam}
                  className='form-control'
                  type='date'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Location of Last Physical Examination
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='lastPhysicalExamination_location'
                  value={formData.lastPhysicalExamination_location}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Who monitored the child's last physical examination?
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formData.lastPhysicalExamination_monitoredBy}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Last Dental Examination
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='lastDentalExamination_date'
                  value={formData.lastDentalExamination_date}
                  className='form-control'
                  type='date'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Location of the Last Dental Examination
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='lastDentalExamination_location'
                  value={formData.lastDentalExamination_location}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Who monitored the child's last dental examination?
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='lastDentalExamination_monitoredBy'
                  value={formData.lastDentalExamination_monitoredBy}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Last Optical Examination
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='lastOpticalExamination_date'
                  value={formData.lastOpticalExamination_date}
                  className='form-control'
                  type='date'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Location of the last optical examination
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='lastOpticalExamination_location'
                  value={formData.lastOpticalExamination_location}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Who monitored the last optical examination?
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='lastOpticalExamination_monitoredBy'
                  value={formData.lastOpticalExamination_monitoredBy}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                <h5>
                  CURRENT MEDICATIONS, DOSAGES AND TARGETED SYMPTOMS: NOTE:
                  refer to current Medical Logs for Possible Recent Medication
                  Alterations:
                </h5>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Medication (1)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms1_medication'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms1_medication
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Dosage / Frequency (1)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms1_dosage_frequency'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms1_dosage_frequency
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Purpose (1)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms1_purpose'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms1_purpose
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Possible side effects (1)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms1_possibleSideEffects'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms1_possibleSideEffects
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Monitored By (1)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms1_monitoredBy'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms1_monitoredBy
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Medication (2)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms2_medication'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms2_medication
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Dosage / Frequency (2)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms2_dosage_frequency'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms2_dosage_frequency
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Purpose (2)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms2_purpose'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms2_purpose
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Possible Side Effects (2)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms2_possibleSideEffects'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms2_possibleSideEffects
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Monitored By (2)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms2_monitoredBy'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms2_monitoredBy
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Medication (3)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms3_medication'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms3_medication
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Dosage Frequency (3)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms3_dosage_frequency'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms3_dosage_frequency
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Purpose (3)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms3_purpose'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms3_purpose
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Possible Side Effects (3)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms3_possibleSideEffects'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms3_possibleSideEffects
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Monitored By (3)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms3_monitoredBy'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms3_monitoredBy
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Medication (4)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms4_medication'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms4_medication
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Dosage Frequency (4)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms4_dosage_frequency'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms4_dosage_frequency
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Purpose (4)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms4_purpose'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms4_purpose
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Possible Side Effects (4)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms4_possibleSideEffects'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms4_possibleSideEffects
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Monitored By (4)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms4_monitoredBy'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms4_monitoredBy
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Medication (5)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms5_medication'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms5_medication
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Dosage Frequency (5)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms5_dosage_frequency'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms5_dosage_frequency
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Purpose (5)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms5_purpose'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms5_purpose
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Possible Side Effects (5)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms5_possibleSideEffects'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms5_possibleSideEffects
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Monitored By (5)</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='currentMedications_dosages_targetedSymptoms5_monitoredBy'
                  value={
                    formData.currentMedications_dosages_targetedSymptoms5_monitoredBy
                  }
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Behavioral Strengths
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='behavioralStrengths'
                  value={formData.behavioralStrengths}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Behavioral Needs</label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='behavioralNeeds'
                  value={formData.behavioralNeeds}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Behavioral Treatment Services
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='behavioralTreatmentServices'
                  value={formData.behavioralTreatmentServices}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Emotional Strengths
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='emotionalStrengths'
                  value={formData.emotionalStrengths}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Emotional Needs</label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='emotionalNeeds'
                  value={formData.emotionalNeeds}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Emotional Treatment Services
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='emotionalTreatmentServices'
                  value={formData.emotionalTreatmentServices}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                <h5>
                  ISSUES OR CONCERNS THAT COULD INCREASE ESCALATING BEHAVIORS:
                </h5>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Food</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='food2'
                  value={formData.food2}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Eye Contact</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='eyeContact'
                  value={formData.eyeContact}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Physical Touch</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='physicalTouch'
                  value={formData.physicalTouch}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Personal Property</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='personalProperty'
                  value={formData.personalProperty}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Certain Topics</label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='certainTopics'
                  value={formData.certainTopics}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Known contraindications to the use of restraint
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='knownContraindicationsToTheUuseOfRestraint'
                  value={formData.knownContraindicationsToTheUuseOfRestraint}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  De-escalating Techniques to avoid restraints (EBI)
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='de_escalatingTechniquesToAvoidRestraints_ebi'
                  value={formData.de_escalatingTechniquesToAvoidRestraints_ebi}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Child's De-escalation Technique:
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='child_de_escalator'
                  value={formData.child_de_escalator}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Staff Member's De-escalation Technique:
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='staff_de_escalator'
                  value={formData.staff_de_escalator}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Therapist's De-escalation Technique:
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='therapist_de_escalator'
                  value={formData.therapist_de_escalator}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Child's Preferred De-escalation
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='childPreferred_de_escalation'
                  value={formData.childPreferred_de_escalation}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Intervention Strategies
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='interventionStrategies'
                  value={formData.interventionStrategies}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Supervision Strategies
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='supervisionStrategies'
                  value={formData.supervisionStrategies}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Social Recreational Strengths
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='social_recreationalStrengths'
                  value={formData.social_recreationalStrengths}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Social Recreational Needs
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='social_recreationalNeeds'
                  value={formData.social_recreationalNeeds}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Family Strengths</label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='familyStrengths'
                  value={formData.familyStrengths}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Family Needs</label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='familyNeeds'
                  value={formData.familyNeeds}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Name of visitor (1)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor1_name'
                  value={formData.visitor1_name}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Relation of Visitor (1)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor1_relationship'
                  value={formData.visitor1_relationship}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Frequency of visitation (1)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor1_frequency'
                  value={formData.visitor1_frequency}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Who will visitor (1) be supervised by
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor1_supervisedBy'
                  value={formData.visitor1_supervisedBy}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Location of visitor (1)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor1_location'
                  value={formData.visitor1_location}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Visitation length of vistitor (1)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor1_length'
                  value={formData.visitor1_length}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Name of visitor (2)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor2_name'
                  value={formData.visitor2_name}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Relation of Visitor (2)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor2_relationship'
                  value={formData.visitor2_relationship}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Frequency of visitation (2)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor2_frequency'
                  value={formData.visitor2_frequency}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Who will visitor (2) be supervised by
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor2_supervisedBy'
                  value={formData.visitor2_supervisedBy}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Location of visitor (2)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor2_location'
                  value={formData.visitor2_location}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Visitation length of vistitor (2)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor2_length'
                  value={formData.visitor2_length}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Name of visitor (3)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor3_name'
                  value={formData.visitor3_name}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Relation of Visitor (3)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor3_relationship'
                  value={formData.visitor3_relationship}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Frequency of visitation (3)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor3_frequency'
                  value={formData.visitor3_frequency}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Who will visitor (3) be supervised by
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor3_supervisedBy'
                  value={formData.visitor3_supervisedBy}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Location of visitor (3)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor3_location'
                  value={formData.visitor3_location}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Visitation length of vistitor (3)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor3_length'
                  value={formData.visitor3_length}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Name of visitor (4)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor4_name'
                  value={formData.visitor4_name}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Relation of Visitor (4)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor4_relationship'
                  value={formData.visitor4_relationship}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Frequency of visitation (4)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor4_frequency'
                  value={formData.visitor4_frequency}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Who will visitor (4) be supervised by
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor4_supervisedBy'
                  value={formData.visitor4_supervisedBy}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Location of visitor (4)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor4_location'
                  value={formData.visitor4_location}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Visitation length of vistitor (4)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  id='visitor4_length'
                  value={formData.visitor4_length}
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Educational / Vacational Strengths
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='educational_vacationalStrengths'
                  value={formData.educational_vacationalStrengths}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Educational / Vacational Needs
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='educational_vacationalNeeds'
                  value={formData.educational_vacationalNeeds}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Transitional Living
                </label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='transitionalLiving'
                  value={formData.transitionalLiving}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Discharge Planning</label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='dischargePlanning'
                  value={formData.dischargePlanning}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Long Range Goals</label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='longRangeGoals'
                  value={formData.longRangeGoals}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Short Range Goals</label>{' '}
                <TextareaAutosize
                  onChange={handleFieldInput}
                  id='shortRangeGoals'
                  value={formData.shortRangeGoals}
                  className='form-control'
                ></TextareaAutosize>
              </div>
              <FormError errorId={id + '-error'} />
              <div
                className='form-group logInInputField'
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <button
                  className='lightBtn'
                  onClick={() => {
                    validateForm(true);
                  }}
                >
                  Save
                </button>

                <button
                  className='darkBtn'
                  onClick={() => {
                    validateForm(false);
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className='formComp'>
        {formData.formSubmitted || formData.formHasError ? (
          <React.Fragment>
            {formData.formSubmitted && <FormSavedAlert />}
            <FormAlert
              doShow={formData.formHasError}
              toggleErrorAlert={toggleErrorAlert}
              type='danger'
              heading='Error Submitting form'
            >
              <p>{formData.formErrorMessage}</p>
            </FormAlert>
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
        <div className='formTitleDivReport'>
          <h2 className='formTitle'>72 Hour Treatment Plan</h2>
        </div>
        {formData.loadingClients ? (
          <div className='formLoadingDiv'>
            <div>
              <ClipLoader className='formSpinner' size={50} color={'#ffc107'} />
            </div>

            <p>Loading...</p>
          </div>
        ) : (
          <div className='formFieldsMobileReport'>
            <div className='form-group logInInputField'>
              <label className='control-label'>Create Date</label>{' '}
              <input
                onChange={handleFieldInput}
                id='createDate'
                value={dateForDateTimeInputValue()}
                className='form-control'
                type='datetime-local'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Child's Name</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.childMeta_name}
                id='childMeta_name'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Child's Date of Birth
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.childMeta_dob}
                className='form-control'
                type='string'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Child's Age</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.childMeta_age}
                id='childMeta_age'
                className='form-control'
                type='number'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Child's SSN</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.childMeta_ssn}
                id='childMeta_ssn'
                className='form-control'
                type='number'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Child's Gender</label>{' '}
              <Form.Control
                as='select'
                onChange={handleFieldInput}
                value={formData.childMeta_gender}
                id='childMeta_gender'
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option value={''}>Choose</option>
              </Form.Control>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Child's Medicaid Number
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.childMeta_medicaidNumber}
                id='childMeta_medicaidNumber'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Child's Birth County</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.childMeta_county}
                id='childMeta_county'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Child's Place of Birth (City, State)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.childMeta_placeOfBirth}
                id='childMeta_placeOfBirth'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Child's Ethnicity</label>{' '}
              <Form.Control
                as='select'
                onChange={handleFieldInput}
                value={formData.childMeta_ethnicity}
                id='childMeta_ethnicity'
              >
                <option>Black</option>
                <option>White</option>
                <option>Hispanic</option>
                <option>Asian</option>
                <option>Pacific Islander</option>
                <option>Native American</option>
                <option>Other</option>
                <option value={''}>Choose</option>
              </Form.Control>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Child's Level of Care
              </label>{' '}
              <Form.Control
                as='select'
                onChange={handleFieldInput}
                value={formData.childMeta_levelOfCare}
                id='childMeta_levelOfCare'
              >
                <option>Basic</option>
                <option>Moderate</option>
                <option>Specialized</option>
                <option>Intense</option>
                <option>Intense-plus</option>
                <option value={''}>Choose</option>
              </Form.Control>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Child's Religion</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.childMeta_religion}
                id='childMeta_religion'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Child's Managing Conservator
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.childMeta_managingConservator}
                id='childMeta_managingConservator'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Projected Date For Achieving Permanency
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.projectedDateForAchievingPermanency}
                className='form-control'
                type='string'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Legal Status / Permancy Goal
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.legalStatus_PermancyGoal}
                id='legalStatus_PermancyGoal'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Father's Name</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.fatherMeta_name}
                id='fatherMeta_name'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Father's Address</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.fatherMeta_address}
                id='fatherMeta_address'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Father's Phone Number
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.fatherMeta_phoneNumber}
                id='fatherMeta_phoneNumber'
                className='form-control'
                type='number'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Mother's Name</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.motherMeta_name}
                id='motherMeta_name'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Mother's Address</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.motherMeta_address}
                id='motherMeta_address'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Mother Phone Number</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.motherMeta_phoneNumber}
                id='motherMeta_phoneNumber'
                className='form-control'
                type='number'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Legal Status</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.legalStatus}
                id='legalStatus'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Referring Agency / Co
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.referringAgency_co}
                id='referringAgency_co'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Name of Agent of Referring Agency / Co
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.agentOfReferringAgency_co_name}
                id='agentOfReferringAgency_co_name'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Address of Agent of Referring Agency / Co
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.agentOfReferringAgency_co_address}
                id='agentOfReferringAgency_co_address'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Child's Reaction to Placement
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.reactionToPlacement}
                id='reactionToPlacement'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Child's Interests</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.interests}
                id='interests'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              <h5>
                Significant relationship to the child{' '}
                <i>(siblings, others relatives, CASA workers, and attorney)</i>:
              </h5>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Name of Significant Relation (1)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta1_name}
                id='otherMeta1_name'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Relationship of Significant Relation (1)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta1_relationship}
                id='otherMeta1_relationship'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Adress of Significant Relation (1)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta1_address}
                id='otherMeta1_address'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Phone Number of Significant Relation (1)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta1_phoneNumber}
                id='otherMeta1_phoneNumber'
                className='form-control'
                type='number'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Name of Significant Relation (2)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta2_name}
                id='otherMeta2_name'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Relationship of Significant Relation (2)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta2_relationship}
                id='otherMeta2_relationship'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Address of Significant Relation (2)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta2_address}
                id='otherMeta2_address'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Phone Number of Significant Relation (1)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta2_phoneNumber}
                id='otherMeta2_phoneNumber'
                className='form-control'
                type='number'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Name of Significant Relation (3)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta3_name}
                id='otherMeta3_name'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Relationship of Significant Relation (3)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta3_relationship}
                id='otherMeta3_relationship'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Address of Significant Relation (3)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta3_address}
                id='otherMeta3_address'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Phone Number of Significant Relation (3)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta3_phoneNumber}
                id='otherMeta3_phoneNumber'
                className='form-control'
                type='number'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Name of Significant Relation (4)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta4_name}
                id='otherMeta4_name'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Relationship of Significant Relation (4)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta4_relationship}
                id='otherMeta4_relationship'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Address of Significant Relation (4)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta4_address}
                id='otherMeta4_address'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Phone Number of Significant Relation (1)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.otherMeta4_phoneNumber}
                id='otherMeta4_phoneNumber'
                className='form-control'
                type='number'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              <h5>MEDICAL / DENTAL / DEVELOPMENTAL</h5>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Current Medical Information
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.currentMedicalInformation}
                id='currentMedicalInformation'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Developmental / Medical History
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.developmental_medicalHistory}
                id='developmental_medicalHistory'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Drug Allergies</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.drugAllergies}
                id='drugAllergies'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Food Allergies</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.food1}
                id='food1'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Allergies</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.allergies}
                id='allergies'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Chronic Health</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.chronicHealth}
                id='chronicHealth'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Health Strengths</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.healthStrengths}
                id='healthStrengths'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Health Needs</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.healthNeeds}
                id='healthNeeds'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Last Physical Examination
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.lastPhysicalExamination_date}
                className='form-control'
                type='string'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Location of Last Physical Examination
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.lastPhysicalExamination_location}
                id='lastPhysicalExamination_location'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Who monitored the child's last physical examination?
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.lastPhysicalExamination_monitoredBy}
                id='lastPhysicalExamination_monitoredBy'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Last Dental Examination
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.lastDentalExamination_date}
                className='form-control'
                type='string'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Location of the Last Dental Examination
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.lastDentalExamination_location}
                id='lastDentalExamination_location'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Who monitored the child's last dental examination?
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.lastDentalExamination_monitoredBy}
                id='lastDentalExamination_monitoredBy'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Last Optical Examination
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.lastOpticalExamination_date}
                className='form-control'
                type='string'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Location of the last optical examination
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.lastOpticalExamination_location}
                id='lastOpticalExamination_location'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Who monitored the last optical examination?
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.lastOpticalExamination_monitoredBy}
                id='lastOpticalExamination_monitoredBy'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              <h5>
                CURRENT MEDICATIONS, DOSAGES AND TARGETED SYMPTOMS: NOTE: refer
                to current Medical Logs for Possible Recent Medication
                Alterations:
              </h5>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Medication (1)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms1_medication
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Dosage / Frequency (1)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms1_dosage_frequency
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Purpose (1)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms1_purpose
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Possible side effects (1)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms1_possibleSideEffects
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Monitored By (1)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms1_monitoredBy
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Medication (2)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms2_medication
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Dosage / Frequency (2)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms2_dosage_frequency
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Purpose (2)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms2_purpose
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Possible Side Effects (2)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms2_possibleSideEffects
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Monitored By (2)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms2_monitoredBy
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Medication (3)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms3_medication
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Dosage Frequency (3)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms3_dosage_frequency
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Purpose (3)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms3_purpose
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Possible Side Effects (3)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms3_possibleSideEffects
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Monitored By (3)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms3_monitoredBy
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Medication (4)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms4_medication
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Dosage Frequency (4)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms4_dosage_frequency
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Purpose (4)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms4_purpose
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Possible Side Effects (4)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms4_possibleSideEffects
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Monitored By (4)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms4_monitoredBy
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Medication (5)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms5_medication
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Dosage Frequency (5)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms5_dosage_frequency
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Purpose (5)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms5_purpose
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Possible Side Effects (5)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms5_possibleSideEffects
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Monitored By (5)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={
                  formData.currentMedications_dosages_targetedSymptoms5_monitoredBy
                }
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Behavioral Strengths</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.behavioralStrengths}
                id='behavioralStrengths'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Behavioral Needs</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.behavioralNeeds}
                id='behavioralNeeds'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Behavioral Treatment Services
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.behavioralTreatmentServices}
                id='behavioralTreatmentServices'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Emotional Strengths</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.emotionalStrengths}
                id='emotionalStrengths'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Emotional Needs</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.emotionalNeeds}
                id='emotionalNeeds'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Emotional Treatment Services
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.emotionalTreatmentServices}
                id='emotionalTreatmentServices'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              <h5>
                ISSUES OR CONCERNS THAT COULD INCREASE ESCALATING BEHAVIORS:
              </h5>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Food</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.food2}
                id='food2'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Eye Contact</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.eyeContact}
                id='eyeContact'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Physical Touch</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.physicalTouch}
                id='physicalTouch'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Personal Property</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.personalProperty}
                id='personalProperty'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Certain Topics</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.certainTopics}
                id='certainTopics'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Known contraindications to the use of restraint
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.knownContraindicationsToTheUuseOfRestraint}
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                De-escalating Techniques to avoid restraints (EBI)
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.de_escalatingTechniquesToAvoidRestraints_ebi}
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Child's De-escalation Technique:
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.child_de_escalator}
                id='child_de_escalator'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Staff Member's De-escalation Technique:
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.staff_de_escalator}
                id='staff_de_escalator'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Therapist's De-escalation Technique:
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.therapist_de_escalator}
                id='therapist_de_escalator'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Child's Preferred De-escalation
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.childPreferred_de_escalation}
                id='childPreferred_de_escalation'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Intervention Strategies
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.interventionStrategies}
                id='interventionStrategies'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Supervision Strategies
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.supervisionStrategies}
                id='supervisionStrategies'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Social Recreational Strengths
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.social_recreationalStrengths}
                id='social_recreationalStrengths'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Social Recreational Needs
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.social_recreationalNeeds}
                id='social_recreationalNeeds'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Family Strengths</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.familyStrengths}
                id='familyStrengths'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Family Needs</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.familyNeeds}
                id='familyNeeds'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Name of visitor (1)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor1_name}
                id='visitor1_name'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Relation of Visitor (1)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor1_relationship}
                id='visitor1_relationship'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Frequency of visitation (1)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor1_frequency}
                id='visitor1_frequency'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Who will visitor (1) be supervised by
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor1_supervisedBy}
                id='visitor1_supervisedBy'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Location of visitor (1)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor1_location}
                id='visitor1_location'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Visitation length of vistitor (1)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor1_length}
                id='visitor1_length'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Name of visitor (2)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor2_name}
                id='visitor2_name'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Relation of Visitor (2)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor2_relationship}
                id='visitor2_relationship'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Frequency of visitation (2)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor2_frequency}
                id='visitor2_frequency'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Who will visitor (2) be supervised by
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor2_supervisedBy}
                id='visitor2_supervisedBy'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Location of visitor (2)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor2_location}
                id='visitor2_location'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Visitation length of vistitor (2)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor2_length}
                id='visitor2_length'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Name of visitor (3)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor3_name}
                id='visitor3_name'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Relation of Visitor (3)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor3_relationship}
                id='visitor3_relationship'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Frequency of visitation (3)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor3_frequency}
                id='visitor3_frequency'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Who will visitor (3) be supervised by
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor3_supervisedBy}
                id='visitor3_supervisedBy'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Location of visitor (3)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor3_location}
                id='visitor3_location'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Visitation length of vistitor (3)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor3_length}
                id='visitor3_length'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Name of visitor (4)</label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor4_name}
                id='visitor4_name'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Relation of Visitor (4)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor4_relationship}
                id='visitor4_relationship'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Frequency of visitation (4)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor4_frequency}
                id='visitor4_frequency'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Who will visitor (4) be supervised by
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor4_supervisedBy}
                id='visitor4_supervisedBy'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Location of visitor (4)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor4_location}
                id='visitor4_location'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Visitation length of vistitor (4)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                value={formData.visitor4_length}
                id='visitor4_length'
                className='form-control'
                type='text'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Educational / Vacational Strengths
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.educational_vacationalStrengths}
                id='educational_vacationalStrengths'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Educational / Vacational Needs
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.educational_vacationalNeeds}
                id='educational_vacationalNeeds'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Transitional Living</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.transitionalLiving}
                id='transitionalLiving'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Discharge Planning</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.dischargePlanning}
                id='dischargePlanning'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Long Range Goals</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.longRangeGoals}
                id='longRangeGoals'
                className='form-control'
              ></TextareaAutosize>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Short Range Goals</label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                value={formData.shortRangeGoals}
                id='shortRangeGoals'
                className='form-control'
              ></TextareaAutosize>
            </div>
          </div>
        )}
        <label className='control-label'>Signature</label>{' '}
        <div className='sigSection'>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <SignatureCanvas
              ref={sigCanvas}
              style={{ border: 'solid' }}
              penColor='black'
              clearOnResize={false}
              canvasProps={{
                width: 300,
                height: 100,
                className: 'sigCanvas',
              }}
              backgroundColor='#eeee'
            />
          </div>
        </div>
        {!inputData.approved && (
          <>
            <FormError errorId={id + '-error'} />
            <div
              className='form-group logInInputField'
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <button
                className='lightBtn'
                onClick={() => {
                  validateForm(true);
                }}
              >
                Save
              </button>

              {/* <button
                  className="darkBtn"
                  onClick={() => {
                    validateForm(false);
                  }}
                >
                  Submit
                </button> */}
            </div>
          </>
        )}
      </div>
    );
  }
};

export default TestTreatmentPlan72;
