import React, { useState, useContext, useEffect } from 'react';
import TreatmentPlan72 from '../Forms/TreatmentPlan72';
import IncidentReport from '../Forms/IncidentReport';
import SeriousIncidentReport from '../Forms/SeriousIncidentReport';
import DailyProgress from '../Forms/DailyProgressAndActivity';
import RestraintReport from '../Forms/RestraintReport';
import IllnessInjury from '../Forms/IllnessInjury';
import AdmissionAssessment from '../Forms/AdmissionAssessment';
import OrientationTraining from '../Forms/OrientationTraining';
import PreServiceTraining from '../Forms/PreServiceTraining';
import BodyCheck from '../Forms/BodyCheck';
import AwakeNightStaffSignoff from '../Forms/AwakeNightStaffSignoff';
import { Form, Col } from 'react-bootstrap';
import Axios from 'axios';
import { FormCountContext } from '../../context';
import { GetUserSig } from '../../utils/GetUserSig';
import SignatureCanvas from 'react-signature-canvas';
import { FetchHomeData } from '../../utils/FetchHomeData';
import { DoDeleteRecord } from '../../utils/DoDeleteRecord';
import NightMonitoring from '../Forms/NightMonitoring';
import ClipLoader from 'react-spinners/ClipLoader';

const needsNurseSig = ['Health Body Check', 'Illness Injury'];

const needsAlt1Sig = ['Illness Injury'];

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
    formData.approved === true ? `${formData.approvedByName}` : ''
  );

  const [approvedByNurseText, setApprovedByNurseText] = useState(
    formData.approvedNurse === true ? `${formData.approvedByNameNurse}` : ''
  );

  const [approvedByAlt1Text, setApprovedByAlt1Text] = useState(
    formData.approved_alt1 === true ? `${formData.approvedByName_alt1}` : ''
  );

  const [sigCanvasAdmin, setSigCanvasAdmin] = useState(null);

  const [sigCanvasNurse, setSigCanvasNurse] = useState(null);

  const [sigCanvasAdminAlt1, setSigCanvasAdminAlt1] = useState(null);

  const [isSavingSigCanvasAdmin, setIsSavingSigCanvasAdmin] = useState(false);

  const [isSavingSigCanvasNurse, setIsSavingSigCanvasNurse] = useState(false);

  const [isSavingSigCanvasAdminAlt1, setIsSavingSigCanvasAdminAlt1] =
    useState(false);

  const [homeData, setHomeData] = useState('');

  const doGetHomeInfo = async () => {
    try {
      const { data } = await FetchHomeData(formData.homeId);
      await setHomeData(data[0]);
    } catch (e) {
      console.log('Error fetching home info');
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
    if (type === 'nurse') {
      sigCanvasNurse.fromData(sig);
    } else if (type === 'alt1') {
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
    let signature = null;
    if (type === 'nurse') {
      doFetchSig = !isApprovedByNurse === true;
    } else if (type === 'alt1') {
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
            `User signature required to update a form. Create a new signature under 'Manage Profile'.`
          );
          return {
            success: false,
            body: null,
          };
        }
        signature = createdUserData.signature;
      } catch (e) {
        alert('Error update form state');
      }
    }

    if (type === 'nurse') {
      const copy = !isApprovedByNurse;
      await setIsApprovedByNurse(!isApprovedByNurse);
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
    } else if (type === 'alt1') {
      const copy = !isApprovedByAlt1;
      await setIsApprovedByAlt1(!isApprovedByAlt1);
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
      await setIsApproved(!isApproved);
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

  const updateFormApproval = async (type = 'base') => {
    const { body: postData, success } = await getPostObjectData(type);
    if (!success) {
      return;
    }
    try {
      if (type === 'nurse') {
        setIsSavingSigCanvasNurse(true);
      } else if (type === 'alt1') {
        setIsSavingSigCanvasAdminAlt1(true);
      } else {
        setIsSavingSigCanvasAdmin(true);
      }
      await Axios.put(
        `/api/${route}/${formData.homeId}/${formData._id}`,
        postData
      );
      if (type === 'nurse') {
        setApprovedByNurseText(`${userObj.firstName} ${userObj.lastName} `);
        doSetSigs(type, postData.approvedNurseSig);
        setIsSavingSigCanvasNurse(false);
      } else if (type === 'alt1') {
        setApprovedByAlt1Text(`${userObj.firstName} ${userObj.lastName} `);
        doSetSigs(type, postData.approvedSig_alt1);
        setIsSavingSigCanvasAdminAlt1(false);
      } else {
        setApprovedByText(`${userObj.firstName} ${userObj.lastName}`);
        doSetSigs(type, postData.approvedSig);
        setIsSavingSigCanvasAdmin(false);
      }
    } catch (e) {
      //go back
      console.log(e);
      alert('Error update form state');
      setApprovedByText('');
      setIsApproved(!isApproved);
    }

    try {
      await formContext.updateCount();
    } catch (e) {
      console.log(`error updating form approval count - ${e}`);
    }
  };

  const doDelete = async () => {
    DoDeleteRecord(
      'Are you sure you want to delete this message? This cannot be undone.',
      `/api/${route}/${formData.homeId}/${formData._id}`,
      () => {
        document.getElementById('form-reports-back-btn').click();
      }
    );
  };

  return (
    <div className="meta-details-content">
      <div className='d-flex align-items-center hide-on-print'>
        <h6 style={{ fontWeight: 400, marginRight: 5 }}>Form Id</h6>{' '}
        <h6 style={{ fontWeight: 300 }}>{formData._id}</h6>
      </div>
      <div className='d-flex align-items-center hide-on-print'>
        <h6 style={{ fontWeight: 400, marginRight: 5 }}>Last Updated</h6>{' '}
        <h6 style={{ fontWeight: 300 }}>
          {` ${formData.createdByName}, ${
            formData.lastEditDate
              ? `${new Date(formData.lastEditDate).toLocaleDateString()}`
              : ''
          }`}
        </h6>
      </div>
      <div className='d-flex align-items-center hide-on-print'>
        <h6 style={{ fontWeight: 400, marginRight: 5 }}>Created Date</h6>{' '}
        <h6 style={{ fontWeight: 300 }}>
          {` ${formData.createdByName}, ${
            formData.createdByName
              ? `${new Date(formData.createDate).toLocaleDateString()}`
              : ''
          }`}
        </h6>
      </div>
      <div>
        <button
          onClick={() => {
            doPrint();
          }}
          className='mr-3 btn btn-light hide-on-print'
        >
          Print <i className='fas fa-print'></i>
        </button>
        {isAdminRole && (
          <button
            onClick={() => {
              doDelete();
            }}
            className='btn btn-light hide-on-print'
          >
            Delete Form <i className='fas fa-trash'></i>
          </button>
        )}
        {homeData && (
          <div>
            <h3 className='text-center'>
              {homeData.name && `RTC - ${homeData.name}`}
            </h3>
            {homeData.address && (
              <h4 className='text-center'>
                {`${homeData.address?.street}, ${homeData.address?.city}, ${homeData.address?.state} ${homeData.address?.zip}`}
              </h4>
            )}
            <h4 className='text-center'>
              {homeData.phone && `${homeData.phone}`}
            </h4>
          </div>
        )}
      </div> 
      <div>
          <Form.Row>
            <Col xs='auto'>
              <Form.Check
                type='checkbox'
                id='baseBtn'
                style={{ color: isApproved ? "green" : "red" }}
                className='d-flex align-items-center'
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
              className=''
              style={{
                height: '200px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <div>
                <ClipLoader
                  className='formSpinner'
                  size={50}
                  color={'#ffc107'}
                />
              </div>

              <p>Updating...</p>
            </div>
          )}
          <Form.Row>
            <Col xs='auto'>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  maxHeight: '170',
                  justifyContent: 'center',
                  visibility:
                    !isSavingSigCanvasAdmin && isApproved
                      ? 'visible'
                      : 'hidden',
                }}
              >
                <SignatureCanvas
                  ref={(ref) => {
                    setSigCanvasAdmin(ref);
                  }}
                  style={{ border: 'solid' }}
                  penColor='black'
                  clearOnResize={false}
                  canvasProps={{
                    width: 600,
                    height: 200,
                    className: 'sigCanvasAdmin',
                  }}
                  backgroundColor='#eeee'
                />
              </div>
            </Col>
          </Form.Row>
          {needsNurseSig.includes(formData.formType) && (
            <>
              <Form.Row>
                <Col xs='auto'>
                  <Form.Check
                    type='checkbox'
                    id='nurseBtn'
                    style={{ color: isApprovedByNurse ? 'green' : 'red' }}
                    className='mb-2 d-flex align-items-center'
                    label={setApprovedLabelNurse(
                      isApprovedByNurse,
                      'Nurse or Designee'
                    )}
                    disabled={!isAdminRole}
                    checked={isApprovedByNurse}
                    onClick={() => {
                      updateFormApproval('nurse');
                    }}
                  />
                </Col>
              </Form.Row>
              {isSavingSigCanvasNurse && (
                <div
                  className=''
                  style={{
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <ClipLoader
                      className='formSpinner'
                      size={50}
                      color={'#ffc107'}
                    />
                  </div>

                  <p>Updating...</p>
                </div>
              )}
              <Form.Row>
                <Col xs='auto'>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      visibility:
                        !isSavingSigCanvasNurse && isApprovedByNurse
                          ? 'visible'
                          : 'hidden',
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        setSigCanvasNurse(ref);
                      }}
                      style={{ border: 'solid' }}
                      penColor='black'
                      clearOnResize={false}
                      canvasProps={{
                        width: 300,
                        height: 100,
                        className: 'setSigCanvasNurse',
                      }}
                      backgroundColor='#eeee'
                    />
                  </div>
                </Col>
              </Form.Row>
            </>
          )}
          {needsAlt1Sig.includes(formData.formType) && (
            <>
              <Form.Row>
                <Col xs='auto'>
                  <Form.Check
                    type='checkbox'
                    id='alt1Btn'
                    style={{ color: isApprovedByAlt1 ? 'green' : 'red' }}
                    className='mb-2 d-flex align-items-center'
                    label={setApprovedLabelAlt(isApprovedByAlt1, 'Admin 2')}
                    disabled={!isAdminRole}
                    checked={isApprovedByAlt1}
                    onClick={() => {
                      updateFormApproval('alt1');
                    }}
                  />
                </Col>
              </Form.Row>
              {isSavingSigCanvasAdminAlt1 && (
                <div
                  className=''
                  style={{
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <ClipLoader
                      className='formSpinner'
                      size={50}
                      color={'#ffc107'}
                    />
                  </div>

                  <p>Updating...</p>
                </div>
              )}
              <Form.Row>
                <Col xs='auto'>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      visibility:
                        !isSavingSigCanvasAdminAlt1 && isApprovedByAlt1
                          ? 'visible'
                          : 'hidden',
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        setSigCanvasAdminAlt1(ref);
                      }}
                      style={{ border: 'solid' }}
                      penColor='black'
                      clearOnResize={false}
                      canvasProps={{
                        width: 300,
                        height: 100,
                        className: 'setSigCanvasAlt1',
                      }}
                      backgroundColor='#eeee'
                    />
                  </div>
                </Col>
              </Form.Row>
            </>
          )}
      </div>
    </div>
  );
};

const ShowFormContainer = ({ formData, userObj, isAdminRole, form }) => {
  const [updatedFormData, setFormData] = useState({});

  const [route, setRoute] = useState('');

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
    let droute = '';
    if (name === '72 Hour Treatment Plan') {
      droute = 'treatmentPlans72';
    } else if (name === 'Incident Report') {
      droute = 'incidentReport';
    } else if (name === 'Serious Incident Report') {
      droute = 'seriousIncidentReport';
    } else if (name === 'Daily Activity') {
      droute = 'dailyProgressAndActivity';
    } else if (name === 'Illness Injury') {
      droute = 'illnessInjury';
    } else if (name === 'Admission Assessment') {
      droute = 'admissionAssessment';
    } else if (name === 'Health Body Check') {
      droute = 'bodyCheck';
    } else if (name === 'Restraint Report') {
      droute = 'restraintReport';
    } else if (name === 'Orientation Training') {
      droute = 'orientationTraining';
    } else if (name === 'Pre Service Training') {
      droute = 'preServiceTraining';
    } else if (name === 'Awake Night Staff Signoff') {
      droute = 'awakeNightStaffSignoff';
    } else if (name === 'Night Monitoring') {
      droute = 'nightMonitoring';
    }

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
    let comp = {};

    if (name === '72 Hour Treatment Plan') {
      comp = (
        <TreatmentPlan72
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Incident Report') {
      comp = (
        <IncidentReport
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Serious Incident Report') {
      comp = (
        <SeriousIncidentReport
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Daily Activity') {
      comp = (
        <DailyProgress
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Illness Injury') {
      comp = (
        <IllnessInjury
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Admission Assessment') {
      comp = (
        <AdmissionAssessment
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Health Body Check') {
      comp = (
        <BodyCheck
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Restraint Report') {
      comp = (
        <RestraintReport
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Orientation Training') {
      comp = (
        <OrientationTraining
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Pre Service Training') {
      comp = (
        <PreServiceTraining
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Awake Night Staff Signoff') {
      comp = (
        <AwakeNightStaffSignoff
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Night Monitoring') {
      comp = (
        <NightMonitoring
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else {
      comp = (
        <div>
          <h1>404 - Form Not Found</h1>
        </div>
      );
    }
    return Reflect.ownKeys(updatedFormData).length > 0 ? (
      <div>{comp}</div>
    ) : (
      <></>
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

  const [route, setRoute] = useState('');

  // ...

  useEffect(() => {
    if (
      Reflect.ownKeys(formData).length > 0 &&
      Reflect.ownKeys(updatedFormData).length === 0
    ) {
      doSetRoute(form.name);
      setFormData(formData);
    }
  });

  // ...

  const doSetRoute = (name) => {
    // ...make
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
    let comp = {};

    if (name === '72 Hour Treatment Plan') {
      comp = (
        <TreatmentPlan72
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
        // <TestTreatmentPlan72
        //   valuesSet='true'
        //   userObj={userObj}
        //   formData={updatedFormData}
        //   doUpdateFormDates={doUpdateFormDates}
        // />
      );
    } else if (name === 'Incident Report') {
      comp = (
        <IncidentReport
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Serious Incident Report') {
      comp = (
        <SeriousIncidentReport
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Daily Activity') {
      comp = (
        <DailyProgress
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Illness Injury') {
      comp = (
        <IllnessInjury
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Admission Assessment') {
      comp = (
        <AdmissionAssessment
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Health Body Check') {
      comp = (
        <BodyCheck
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Restraint Report') {
      comp = (
        <RestraintReport
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Orientation Training') {
      comp = (
        <OrientationTraining
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Pre Service Training') {
      comp = (
        <PreServiceTraining
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Awake Night Staff Signoff') {
      comp = (
        <AwakeNightStaffSignoff
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else if (name === 'Night Monitoring') {
      comp = (
        <NightMonitoring
          valuesSet='true'
          userObj={userObj}
          formData={updatedFormData}
          doUpdateFormDates={doUpdateFormDates}
        />
      );
    } else {
      comp = (
        <div>
          <h1>404 - Form Not Found</h1>
        </div>
      );
    }
    return Reflect.ownKeys(updatedFormData).length > 0 ? (
      <div style={{ pageBreakAfter: 'always' }}>{comp}</div>
    ) : (
      <></>
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

export default ShowFormContainer;
