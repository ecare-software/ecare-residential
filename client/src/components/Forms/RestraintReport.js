import React, { Component } from 'react';
import FormError from '../FormMods/FormError';
import FormAlert from '../Forms/FormAlert';
import '../../App.css';
import Axios from 'axios';
import { Form } from 'react-bootstrap';
import ClipLoader from 'react-spinners/ClipLoader';
import ClientOption from '../../utils/ClientOption.util';
import SignatureCanvas from 'react-signature-canvas';
import { GetUserSig } from '../../utils/GetUserSig';
import { FormSuccessAlert } from '../../utils/FormSuccessAlert';
import { FormSavedAlert } from '../../utils/FormSavedAlert';
import TextareaAutosize from 'react-textarea-autosize';
import StaffOption from '../../utils/StaffOption.util';
const RestraintReport = (props) => {
  const [autoSaveInterval, setAutoSaveInterval] = React.useState(0); // used for autosaving
  const [initAutoSave, setInitAutoSave] = React.useState(false);
  const [formInputs, setFormInputs] = React.useState({
    childMeta_name: '',
    childMeta_gender: '',
    childMeta_dob: '',
    childMeta_dateOfAdmission: '',
    staff_involved_name: '',
    staff_involved_gender: '',
    time_of_incident: '',
    staff_witness_name: '',
    staff_witness_gender: '',

    client_witness_name1: '',

    client_witness_gender1: '',

    client_witness_dob1: '',

    client_witness_doa1: '',

    client_witness_name2: '',

    client_witness_gender2: '',

    client_witness_dob2: '',

    client_witness_doa2: '',

    risk_explaination: '',

    risk_alternative_strategies: '',

    type_of_restraint: '',

    risk_stategies_used: '',

    result_of_incident: '',

    injuries: '',

    action_taken: '',

    able_to_prevent: '',

    restraint_start_time: '',

    restraint_end_time: '',

    notification_made_to: '',

    notification_made_date_time: '',

    interviewer: '',

    date_of_interview: '',

    client_behavior: '',

    client_restraint_description: '',

    client_responce: '',

    procedural_approved_reason: '',

    procedural_approved_standards: '',

    procedural_any_injuries: '',

    procedural_comments: '',

    createdBy: props.valuesSet === true ? '' : props.userObj.email,

    createdByName:
      props.valuesSet === true
        ? ''
        : props.userObj.firstName + ' ' + props.userObj.lastName,

    lastEditDate: null,

    homeId: props.valuesSet === true ? '' : props.userObj.homeId,

    formHasError: false,

    formSubmitted: false,

    formErrorMessage: '',

    loadingClients: true,

    loadingStaff: true,

    loadingSig: true,

    clients: [],
    staff: [],
    clientId: '',
    createDate: new Date().toISOString(),
  });

  const sigCanvas = React.useRef(null);

  const toggleSuccessAlert = () => {
    setFormInputs({
      formSubmitted: !formInputs.formSubmitted,
      loadingClients: false,
    });
  };

  const toggleErrorAlert = () => {
    setFormInputs({
      formHasError: !formInputs.formHasError,
      formErrorMessage: '',
    });
  };

  const handleFieldInput = (event) => {
    var stateObj = {};
    if (event.target.id.indexOf('.') > -1) {
      let level1Obj = event.target.id.split('.')[0];
      let level2Obj = event.target.id.split('.')[1];

      let nestedProperty = { ...formInputs[level1Obj] };
      nestedProperty[level2Obj] = event.target.value;
      stateObj[level1Obj] = nestedProperty;
    } else {
      stateObj[event.target.id] = event.target.value;
    }
    setFormInputs(stateObj);
  };

  const resetForm = () => {
    setFormInputs({
      childMeta_name: '',
      childMeta_gender: '',
      childMeta_dob: '',
      childMeta_dateOfAdmission: '',
      staff_involved_name: '',
      staff_involved_gender: '',
      time_of_incident: '',
      staff_witness_name: '',
      staff_witness_gender: '',

      client_witness_name1: '',

      client_witness_gender1: '',

      client_witness_dob1: '',

      client_witness_doa1: '',

      client_witness_name2: '',

      client_witness_gender2: '',

      client_witness_dob2: '',

      client_witness_doa2: '',

      risk_explaination: '',

      risk_alternative_strategies: '',

      type_of_restraint: '',

      risk_stategies_used: '',

      result_of_incident: '',

      injuries: '',

      action_taken: '',

      able_to_prevent: '',

      restraint_start_time: '',

      restraint_end_time: '',

      notification_made_to: '',

      notification_made_date_time: '',

      interviewer: '',

      date_of_interview: '',

      client_behavior: '',

      client_restraint_description: '',

      client_responce: '',

      procedural_approved_reason: '',

      procedural_approved_standards: '',

      procedural_any_injuries: '',

      procedural_comments: '',
      clientId: '',
      createDate: new Date().toISOString(),
    });
  };

  // auto save
  const autoSave = async () => {
    let currentState = JSON.parse(JSON.stringify(formInputs));
    delete currentState.clients;
    delete currentState.staff;
    console.log('auto saving');
    if (
      currentState.childMeta_name === '' ||
      currentState.childMeta_name.length === 0
    ) {
      return;
    }
    if (initAutoSave) {
      console.log('updating existing form');
      try {
        const { data } = await Axios.put(
          `/api/restraintReport/${formInputs.homeId}/${formInputs._id}`,
          {
            ...currentState,
          }
        );
        setFormInputs({
          ...formInputs,
          lastEditDate: data.lastEditDate,
        });
      } catch (e) {
        console.log(e);
        setFormInputs({
          formHasError: true,
          formErrorMessage: 'Error Submitting Restraint Report',
          loadingClients: false,
        });
      }
    } else {
      console.log('creating');
      currentState.createdBy = props.userObj.email;
      currentState.createdByName =
        props.userObj.firstName + ' ' + props.userObj.lastName;

      Axios.post('/api/restraintReport', currentState)
        .then((res) => {
          setInitAutoSave(true);

          setFormInputs({
            ...formInputs,
            _id: res.data._id,
          });
        })
        .catch((e) => {
          console.log(e);
          setFormInputs({
            formHasError: true,
            formErrorMessage: 'Error Submitting Restraint Report',
            loadingClients: false,
          });
        });
    }
  };

  const submit = async () => {
    let currentState = JSON.parse(JSON.stringify(formInputs));
    delete currentState.clients;
    delete currentState.staff;
    setInitAutoSave(false);
    clearInterval(autoSaveInterval);
    if (props.valuesSet || formInputs._id) {
      try {
        const { data } = await Axios.put(
          `/api/restraintReport/${formInputs.homeId}/${formInputs._id}`,
          {
            ...currentState,
          }
        );

        setFormInputs({ ...formInputs, ...data });
        window.scrollTo(0, 0);
        toggleSuccessAlert();
        // setTimeout(() => {
        //   this.toggleSuccessAlert();
        // }, 2000);
      } catch (e) {
        console.log(e);
        setFormInputs({
          formHasError: true,
          formErrorMessage: 'Error Submitting Restraint Report',
          loadingClients: false,
        });
      }
    } else {
      currentState.createdBy = props.userObj.email;
      currentState.createdByName =
        props.userObj.firstName + ' ' + props.userObj.lastName;

      Axios.post('/api/restraintReport', currentState)
        .then((res) => {
          window.scrollTo(0, 0);
          toggleSuccessAlert();
          if (!props.valuesSet) {
            resetForm();
          }
        })
        .catch((e) => {
          console.log(e);
          setFormInputs({
            formHasError: true,
            formErrorMessage: 'Error Submitting Restraint Report',
            loadingClients: false,
          });
        });
    }
  };

  const validateForm = async (save) => {
    setFormInputs({
      ...formInputs,
      loadingClients: true,
    });

    if (!formInputs.createDate) {
      setFormInputs({
        formHasError: true,
        formErrorMessage: `Please complete the following field(s): Create Date`,
      });
      return;
    } else {
      setFormInputs({
        ...formInputs,
        createDate: new Date(formInputs.createDate),
      });
    }

    submit();
  };

  const dateForDateTimeInputValue = () =>
    new Date(new Date(formInputs.createDate).getTime())
      .toISOString()
      .slice(0, 19);

  const setSignature = (userObj) => {
    if (userObj.signature && userObj.signature.length) {
      sigCanvas.fromData(userObj.signature);
    }
  };

  React.useEffect(() => {
    async function fetchDataAndSetInterval() {
      if (props.valuesSet) {
        setValues();
      } else {
        await getClients();
        await getStaff();
        setAutoSaveInterval(
          setInterval(() => {
            autoSave();
          }, 7000)
        );
      }
    }

    fetchDataAndSetInterval();

    return () => {
      console.log('clearing auto save interval');
      setInitAutoSave(false);
      clearInterval(autoSaveInterval);
    };
  }, [
    props.valuesSet,
    autoSave,
    setValues,
    getClients,
    getStaff,
    autoSaveInterval,
  ]);

  const setValues = async () => {
    const { data: createdUserData } = await GetUserSig(
      props.formData.createdBy,
      props.userObj.homeId
    );
    setSignature(createdUserData);
    sigCanvas.off();
    setFormInputs({
      ...formInputs,
      ...props.formData,
      loadingSig: false,
      loadingClients: false,
    });
  };

  const getClients = async () => {
    try {
      let { data: clients } = await Axios.get(
        `/api/client/${props.userObj.homeId}`
      );

      clients = clients.filter((client) => {
        return !client.hasOwnProperty('active') || client.active === true;
      });

      setTimeout(() => {
        setFormInputs({
          ...formInputs,
          clients,
          loadingClients: false,
        });
      }, 2000);
    } catch (e) {
      console.log(e);
      alert('Error loading clients');
    }
  };

  const getStaff = async () => {
    try {
      let { data: staff } = await Axios.get(
        `/api/users/${props.userObj.homeId}`
      );

      staff = staff.filter((staff) => {
        return !staff.hasOwnProperty('active') || staff.active === true;
      });

      setTimeout(() => {
        setFormInputs({
          ...formInputs,
          staff,
          loadingStaff: false,
        });
      }, 2000);
    } catch (e) {
      console.log(e);
      alert('Error loading staff');
    }
  };

  const handleClientSelect = async (event) => {
    if (event.target.value !== null) {
      const client = JSON.parse(event.target.value);
      const clonedState = { ...formInputs };
      const id = clonedState._id;
      const lastEditDate = clonedState.lastEditDate;
      Object.keys(client).forEach((key) => {
        if (!key.includes('create') && clonedState.hasOwnProperty(key)) {
          clonedState[key] = client[key];
        }
      });
      await setFormInputs({
        ...clonedState,
        clientId: client._id,
        _id: id,
        lastEditDate,
      });
    }
  };

  const handleClientSelectWithness1 = async (event) => {
    if (event.target.value !== null) {
      try {
        const client = JSON.parse(event.target.value);
        await setFormInputs({
          ...formInputs,
          client_witness_name1: client.childMeta_name,
          client_witness_gender1: client.childMeta_gender,
          client_witness_dob1: client.childMeta_dob,
          client_witness_doa1: client.childMeta_dateOfAdmission,
        });
      } catch (e) {
        alert('Error parsing data');
        console.log(e);
      }
    }
  };

  const handleClientSelectWithness2 = async (event) => {
    if (event.target.value !== null) {
      try {
        const client = JSON.parse(event.target.value);
        await setFormInputs({
          ...formInputs,
          client_witness_name2: client.childMeta_name,
          client_witness_gender2: client.childMeta_gender,
          client_witness_dob2: client.childMeta_dob,
          client_witness_doa2: client.childMeta_dateOfAdmission,
        });
      } catch (e) {
        alert('Error parsing data');
        console.log(e);
      }
    }
  };

  const handleStaffSelect = async (val, stateValToSet) => {
    if (val !== null) {
      try {
        let staff = JSON.parse(val);
        staff = `${staff.firstName} ${staff.lastName}`;

        await setFormInputs({ ...formInputs, ...{ [stateValToSet]: staff } });
      } catch (e) {
        alert('Error parsing staff user data');
      }
    }
  };

  if (!props.valuesSet) {
    return (
      <div className='formComp'>
        {formInputs.formSubmitted || formInputs.formHasError ? (
          <React.Fragment>
            {formInputs.formSubmitted && <FormSuccessAlert />}
            <FormAlert
              doShow={formInputs.formHasError}
              toggleErrorAlert={toggleErrorAlert}
              type='danger'
              heading='Error Submitting form'
            >
              <p>{formInputs.formErrorMessage}</p>
            </FormAlert>
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
        <div className='formTitleDiv'>
          <h2 className='formTitle'>Restraint Report</h2>
          <h5
            className='text-center'
            style={{ color: 'rgb(119 119 119 / 93%)' }}
          >
            {formInputs.lastEditDate ? (
              <i>
                {' '}
                Last Saved:
                {`${new Date(formInputs.lastEditDate)
                  .toTimeString()
                  .replace(/\s.*/, '')} - ${new Date(
                  formInputs.lastEditDate
                ).toDateString()}`}
              </i>
            ) : (
              '-'
            )}
          </h5>
        </div>
        {formInputs.loadingClients && formInputs.loadingStaff ? (
          <div className='formLoadingDiv'>
            <div>
              <ClipLoader className='formSpinner' size={50} color={'#ffc107'} />
            </div>

            <p>Loading...</p>
          </div>
        ) : (
          <div className='formFieldsMobile'>
            <div className='form-group logInInputField'>
              <label className='control-label'>Create Date</label>{' '}
              <input
                onChange={handleFieldInput}
                id='createDate'
                value={formInputs.createDate}
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
                {[null, ...formInputs.clients].map(
                  (client) => (
                    <ClientOption data={client} />
                  ),
                  []
                )}
              </Form.Control>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Child's Gender</label>{' '}
              <Form.Control
                as='select'
                onChange={handleFieldInput}
                value={formInputs.childMeta_gender}
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
                Child's Date of Birth
              </label>{' '}
              <input
                onChange={handleFieldInput}
                id='childMeta_dob'
                value={formInputs.childMeta_dob}
                className='form-control'
                type='date'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Child's Date of Admission
              </label>{' '}
              <input
                onChange={handleFieldInput}
                id='childMeta_dateOfAdmission'
                value={formInputs.childMeta_dateOfAdmission}
                className='form-control'
                type='date'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Name of Care Staff Involved
              </label>{' '}
              <Form.Control
                as='select'
                defaultValue={null}
                onChange={(e) => {
                  handleStaffSelect(e.target.value, 'staff_involved_name');
                }}
              >
                {[null, ...formInputs.staff].map(
                  (staff) => (
                    <StaffOption data={staff} />
                  ),
                  []
                )}
              </Form.Control>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Gender of Care Staff Involved
              </label>{' '}
              <Form.Control
                as='select'
                onChange={handleFieldInput}
                value={formInputs.staff_involved_gender}
                id='staff_involved_gender'
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
                Date and time of incident
              </label>{' '}
              <input
                onChange={handleFieldInput}
                id='time_of_incident'
                value={formInputs.time_of_incident}
                className='form-control'
                type='datetime-local'
              />{' '}
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Name of Staff Witness
              </label>{' '}
              <Form.Control
                as='select'
                defaultValue={null}
                onChange={(e) => {
                  this.handleStaffSelect(e.target.value, 'staff_witness_name');
                }}
              >
                {[null, ...formInputs.staff].map(
                  (staff) => (
                    <StaffOption data={staff} />
                  ),
                  []
                )}
              </Form.Control>
            </div>
            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Gender of Staff Witness
              </label>{' '}
              <Form.Control
                as='select'
                onChange={handleFieldInput}
                value={formInputs.staff_witness_gender}
                id='staff_witness_gender'
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
                Name of Client Witness (1)
              </label>{' '}
              <Form.Control
                as='select'
                defaultValue={null}
                onChange={handleClientSelectWithness1}
              >
                {[null, ...formInputs.clients].map(
                  (client, idx) => (
                    <ClientOption key={`${idx}`} data={client} />
                  ),
                  []
                )}
              </Form.Control>
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                {' '}
                Gender of Client Witness (1)
              </label>{' '}
              <Form.Control
                as='select'
                onChange={handleFieldInput}
                value={formInputs.client_witness_gender1}
                id='client_witness_gender1'
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
                Client Witness Date of Birth (1)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                id='client_witness_dob1'
                value={formInputs.client_witness_dob1}
                className='form-control'
                type='date'
              />{' '}
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Client Witness Date of Admission (1)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                id='client_witness_doa1'
                value={formInputs.client_witness_doa1}
                className='form-control'
                type='date'
              />{' '}
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Name Client Witness (2)
              </label>{' '}
              <Form.Control
                as='select'
                defaultValue={null}
                onChange={handleClientSelectWithness2}
              >
                {[null, ...formInputs.clients].map(
                  (client, idx) => (
                    <ClientOption key={`${idx}`} data={client} />
                  ),
                  []
                )}
              </Form.Control>
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                {' '}
                Gender of Client Witness (2)
              </label>{' '}
              <Form.Control
                as='select'
                onChange={handleFieldInput}
                value={formInputs.client_witness_gender2}
                id='client_witness_gender2'
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
                Client Witness Date of Birth (2)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                id='client_witness_dob2'
                value={formInputs.client_witness_dob2}
                className='form-control'
                type='date'
              />{' '}
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Client Witness Date of Admission (2)
              </label>{' '}
              <input
                onChange={handleFieldInput}
                id='client_witness_doa2'
                value={formInputs.client_witness_doa2}
                className='form-control'
                type='date'
              />{' '}
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Description of behavior necessitating Restraint.
                <br />
                Describe how client was at risk of harm to self or others.
                Include all pertinent details and behavior leading up to the
                incident. Be specific:
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                id='risk_explaination'
                value={formInputs.risk_explaination}
                className='form-control'
              ></TextareaAutosize>
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                {' '}
                Alternative strategies or intervention attempted prior to EPR.
                Client response to attempted interventions. Be specific.
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                id='risk_alternative_strategies'
                value={formInputs.risk_alternative_strategies}
                className='form-control'
              ></TextareaAutosize>
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Type of Restraint. Be specific.
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                id='type_of_restraint'
                value={formInputs.type_of_restraint}
                className='form-control'
              ></TextareaAutosize>
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                What strategies were used during Restraint to calm client? How
                did you explain behaviors necessary for release? How often?
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                id='risk_stategies_used'
                value={formInputs.risk_stategies_used}
                className='form-control'
              ></TextareaAutosize>
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Results of incident, including Restraint. Examine client for
                injuries.
                <br />
                Injuries from client behavior prior to Restraint (e.g., SIB,
                physical aggression, Etc.), how they occurred, and treatment
                provided
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                id='result_of_incident'
                value={formInputs.result_of_incident}
                className='form-control'
              ></TextareaAutosize>
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Injuries sustained during or as result of the Restraint, How
                they occurred, and treatment provided
                <br />
                Client’s response to Restraint.
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                id='injuries'
                value={formInputs.injuries}
                className='form-control'
              ></TextareaAutosize>
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Action taken to help client return to normal activities
                following release from the Restraint.
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                id='action_taken'
                value={formInputs.action_taken}
                className='form-control'
              ></TextareaAutosize>
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                In your opinion, were you able to prevent a more serious
                incident? Explain.
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                id='able_to_prevent'
                value={formInputs.able_to_prevent}
                className='form-control'
              ></TextareaAutosize>
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Time restraint started
              </label>{' '}
              <input
                onChange={handleFieldInput}
                id='restraint_start_time'
                value={formInputs.restraint_start_time}
                className='form-control'
                type='datetime-local'
              />{' '}
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Time restraint ended</label>{' '}
              <input
                onChange={handleFieldInput}
                id='restraint_end_time'
                value={formInputs.restraint_end_time}
                className='form-control'
                type='datetime-local'
              />{' '}
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Name of individual you notified.
              </label>{' '}
              <input
                onChange={handleFieldInput}
                id='notification_made_to'
                value={formInputs.notification_made_to}
                className='form-control'
                type='text'
              />{' '}
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                {' '}
                Time of Notification
              </label>{' '}
              <input
                onChange={handleFieldInput}
                id='notification_made_date_time'
                value={formInputs.notification_made_date_time}
                className='form-control'
                type='datetime-local'
              />{' '}
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Name of Interviewer</label>{' '}
              <input
                onChange={handleFieldInput}
                id='interviewer'
                value={formInputs.interviewer}
                className='form-control'
                type='text'
              />{' '}
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>Date of Interview</label>{' '}
              <input
                onChange={handleFieldInput}
                id='date_of_interview'
                value={formInputs.date_of_interview}
                className='form-control'
                type='datetime-local'
              />{' '}
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                What was your behavior?
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                id='client_behavior'
                value={formInputs.client_behavior}
                className='form-control'
              ></TextareaAutosize>
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                {' '}
                Describe the Restraint?
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                id='client_restraint_description'
                value={formInputs.client_restraint_description}
                className='form-control'
              ></TextareaAutosize>
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                How did you respond to the Restraint
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                id='client_responce'
                value={formInputs.client_responce}
                className='form-control'
              ></TextareaAutosize>
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                {' '}
                Restraint took place for approved reason:
              </label>{' '}
              <input
                onChange={handleFieldInput}
                id='procedural_approved_reason'
                value={formInputs.procedural_approved_reason}
                className='form-control'
                type='text'
              />{' '}
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                {' '}
                Restraint met Standards:
              </label>{' '}
              <input
                onChange={handleFieldInput}
                id='procedural_approved_standards'
                value={formInputs.procedural_approved_standards}
                className='form-control'
                type='text'
              />{' '}
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                {' '}
                Any injury or claim of injury:
              </label>{' '}
              <input
                onChange={handleFieldInput}
                id='procedural_any_injuries'
                value={formInputs.procedural_any_injuries}
                className='form-control'
                type='text'
              />{' '}
            </div>

            <div className='form-group logInInputField'>
              {' '}
              <label className='control-label'>
                Comments. Corrective action, including training, needed
              </label>{' '}
              <TextareaAutosize
                onChange={handleFieldInput}
                id='procedural_comments'
                value={formInputs.procedural_comments}
                className='form-control'
              ></TextareaAutosize>
            </div>
            <FormError errorId={props.id + '-error'} />
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
    );
  } else {
    return (
      <div className='formComp'>
        {formInputs.formSubmitted || formInputs.formHasError ? (
          <React.Fragment>
            {formInputs.formSubmitted && <FormSavedAlert />}
            <FormAlert
              doShow={formInputs.formHasError}
              toggleErrorAlert={toggleErrorAlert}
              type='danger'
              heading='Error Submitting form'
            >
              <p>{formInputs.formErrorMessage}</p>
            </FormAlert>
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
        <div className='formTitleDivReport'>
          <h2 className='formTitle'>Restraint Report</h2>
        </div>

        <div className='formFieldsMobileReport'>
          {formInputs.loadingClients && formInputs.loadingStaff ? (
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
                  value={formInputs.childMeta_name}
                  id='childMeta_name'
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Child's Gender</label>{' '}
                <Form.Control
                  as='select'
                  onChange={handleFieldInput}
                  value={formInputs.childMeta_gender}
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
                  Child's Date of Birth
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.childMeta_dob}
                  id='childMeta_dob'
                  className='form-control'
                  type='date'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Child's Date of Admission
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.childMeta_dateOfAdmission}
                  id='childMeta_dateOfAdmission'
                  className='form-control'
                  type='date'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Name of Care Staff Involved
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.staff_involved_name}
                  id='staff_involved_name'
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Gender of Care Staff Involved
                </label>{' '}
                <Form.Control
                  as='select'
                  onChange={handleFieldInput}
                  value={formInputs.staff_involved_gender}
                  id='staff_involved_gender'
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
                  Date and time of incident
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.time_of_incident}
                  id='time_of_incident'
                  className='form-control'
                  type='datetime-local'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Name of Staff Witness
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.staff_witness_name}
                  id='staff_witness_name'
                  className='form-control'
                  type='text'
                />
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Gender of Staff Witness
                </label>{' '}
                <Form.Control
                  as='select'
                  onChange={handleFieldInput}
                  value={formInputs.staff_witness_gender}
                  id='staff_witness_gender'
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
                  Name of Client Witness (1)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.client_witness_name1}
                  id='client_witness_name1'
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  {' '}
                  Gender of Client Witness (1)
                </label>{' '}
                <Form.Control
                  as='select'
                  onChange={handleFieldInput}
                  value={formInputs.client_witness_gender1}
                  id='client_witness_gender1'
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
                  Client Witness Date of Birth (1)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.client_witness_dob1}
                  id='client_witness_dob1'
                  className='form-control'
                  type='date'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Client Witness Date of Admission (1)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.client_witness_doa1}
                  id='client_witness_doa1'
                  className='form-control'
                  type='date'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Name Client Witness (2)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.client_witness_name2}
                  id='client_witness_name2'
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  {' '}
                  Gender of Client Witness (2)
                </label>{' '}
                <Form.Control
                  as='select'
                  onChange={handleFieldInput}
                  value={formInputs.client_witness_gender2}
                  id='client_witness_gender2'
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
                  Client Witness Date of Birth (2)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.client_witness_dob2}
                  id='client_witness_dob2'
                  className='form-control'
                  type='date'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Client Witness Date of Admission (2)
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.client_witness_doa2}
                  id='client_witness_doa2'
                  className='form-control'
                  type='date'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Description of behavior necessitating Restraint. Describe how
                  client was at risk of harm to self or others. Include all
                  pertinent details and behavior leading up to the incident. Be
                  specific:
                </label>{' '}
                <div className='hide-on-print'>
                  <TextareaAutosize
                    onChange={handleFieldInput}
                    value={formInputs.risk_explaination}
                    id='risk_explaination'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <p className='hide-on-non-print'>
                  {formInputs.risk_explaination}
                </p>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  {' '}
                  Alternative strategies or intervention attempted prior to EPR.
                  Client response to attempted interventions. Be specific.
                </label>{' '}
                <div className='hide-on-print'>
                  <TextareaAutosize
                    onChange={handleFieldInput}
                    value={formInputs.risk_alternative_strategies}
                    id='risk_alternative_strategies'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <p className='hide-on-non-print'>
                  {formInputs.risk_alternative_strategies}
                </p>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Type of Restraint. Be specific.
                </label>{' '}
                <div className='hide-on-print'>
                  <TextareaAutosize
                    onChange={handleFieldInput}
                    value={formInputs.type_of_restraint}
                    id='type_of_restraint'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <p className='hide-on-non-print'>
                  {formInputs.type_of_restraint}
                </p>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  What strategies were used during Restraint to calm client? How
                  did you explain behaviors necessary for release? How often?
                </label>
                <div className='hide-on-print'>
                  <TextareaAutosize
                    onChange={handleFieldInput}
                    value={formInputs.risk_stategies_used}
                    id='risk_stategies_used'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <p className='hide-on-non-print'>
                  {formInputs.risk_stategies_used}
                </p>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Results of incident, including Restraint. Examine client for
                  injuries.
                  <br />
                  Injuries from client behavior prior to Restraint (e.g., SIB,
                  physical aggression, Etc.), how they occurred, and treatment
                  provided
                </label>{' '}
                <div className='hide-on-print'>
                  <TextareaAutosize
                    onChange={handleFieldInput}
                    value={formInputs.result_of_incident}
                    id='result_of_incident'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <p className='hide-on-non-print'>
                  {formInputs.result_of_incident}
                </p>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Injuries sustained during or as result of the Restraint, How
                  they occurred, and treatment provided
                  <br />
                  Client’s response to Restraint.
                </label>{' '}
                <div className='hide-on-print'>
                  <TextareaAutosize
                    onChange={handleFieldInput}
                    value={formInputs.injuries}
                    id='injuries'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <p className='hide-on-non-print'>{formInputs.action_taken}</p>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Action taken to help client return to normal activities
                  following release from the Restraint.
                </label>{' '}
                <div className='hide-on-print'>
                  <TextareaAutosize
                    onChange={handleFieldInput}
                    value={formInputs.action_taken}
                    id='action_taken'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <p className='hide-on-non-print'>{formInputs.action_taken}</p>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  In your opinion, were you able to prevent a more serious
                  incident? Explain.
                </label>{' '}
                <div className='hide-on-print'>
                  <TextareaAutosize
                    onChange={handleFieldInput}
                    value={formInputs.able_to_prevent}
                    id='able_to_prevent'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <p className='hide-on-non-print'>
                  {formInputs.able_to_prevent}
                </p>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Time restraint started
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.restraint_start_time}
                  id='restraint_start_time'
                  className='form-control'
                  type='datetime-local'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Time restraint ended
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.restraint_end_time}
                  id='restraint_end_time'
                  className='form-control'
                  type='datetime-local'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Name of individual you notified.
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.notification_made_to}
                  id='notification_made_to'
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  {' '}
                  Time of Notification
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.notification_made_date_time}
                  id='notification_made_date_time'
                  className='form-control'
                  type='datetime-local'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Name of Interviewer
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.interviewer}
                  id='interviewer'
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>Date of Interview</label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.date_of_interview}
                  id='date_of_interview'
                  className='form-control'
                  type='datetime-local'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  What was your behavior?
                </label>{' '}
                <div className='hide-on-print'>
                  <TextareaAutosize
                    onChange={handleFieldInput}
                    value={formInputs.client_behavior}
                    id='client_behavior'
                    className='form-control'
                  ></TextareaAutosize>
                </div>{' '}
                <p className='hide-on-non-print'>
                  {formInputs.client_behavior}
                </p>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  {' '}
                  Describe the Restraint?
                </label>{' '}
                <div className='hide-on-print'>
                  <TextareaAutosize
                    onChange={handleFieldInput}
                    value={formInputs.client_restraint_description}
                    id='client_restraint_description'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <p className='hide-on-non-print'>
                  {formInputs.client_restraint_description}
                </p>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  How did you respond to the Restraint
                </label>{' '}
                <div className='hide-on-print'>
                  <TextareaAutosize
                    onChange={handleFieldInput}
                    value={formInputs.client_responce}
                    id='client_responce'
                    className='form-control'
                  ></TextareaAutosize>
                </div>{' '}
                <p className='hide-on-non-print'>
                  {formInputs.client_responce}
                </p>
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  {' '}
                  Restraint took place for approved reason:
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.procedural_approved_reason}
                  id='procedural_approved_reason'
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  {' '}
                  Restraint met Standards:
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.procedural_approved_standards}
                  id='procedural_approved_standards'
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  {' '}
                  Any injury or claim of injury:
                </label>{' '}
                <input
                  onChange={handleFieldInput}
                  value={formInputs.procedural_any_injuries}
                  id='procedural_any_injuries'
                  className='form-control'
                  type='text'
                />{' '}
              </div>
              <div className='form-group logInInputField'>
                {' '}
                <label className='control-label'>
                  Comments. Corrective action, including training, needed
                </label>
                <div className='hide-on-print'>
                  <TextareaAutosize
                    onChange={handleFieldInput}
                    value={formInputs.procedural_comments}
                    id='procedural_comments'
                    className='form-control'
                  ></TextareaAutosize>
                </div>
                <p className='hide-on-non-print'>
                  {formInputs.procedural_comments}
                </p>
              </div>
            </div>
          )}
          <label className='control-label'>Signature</label>{' '}
          <div className='sigSection'>
            <div
              style={{
                width: '100%',
                display: 'flex',
                maxHeight: '170',
                justifyContent: 'center',
              }}
            >
              <SignatureCanvas
                ref={sigCanvas}
                style={{ border: 'solid' }}
                penColor='black'
                clearOnResize={false}
                canvasProps={{
                  width: 600,
                  height: 200,
                  className: 'sigCanvas',
                }}
                backgroundColor='#eeee'
              />
            </div>
          </div>
          {!props.formData.approved && (
            <>
              <FormError errorId={props.id + '-error'} />
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
                    this.validateForm(false);
                  }}
                >
                  Submit
                </button> */}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
};

export default RestraintReport;
