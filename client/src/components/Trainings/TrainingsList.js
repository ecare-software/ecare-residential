import React, { useState } from "react";
import { useAsync, IfRejected, IfPending, IfFulfilled } from "react-async";
import "../../App.css";
import Axios from "axios";
import { Col } from "react-bootstrap";
import { TRAINING_MOD_TYPES } from "../../utils/TrainingModTypes";

const fetchTrainingMods = async (homeId) => {
  const promises = TRAINING_MOD_TYPES.map((type) =>
    Axios.get(`/api/${type.apiPath}/${homeId}`)
  );

  const data = await Promise.allSettled(promises);

  return TRAINING_MOD_TYPES.map((type, idx) => {
    const result = data[idx];
    const existing =
      result.status === "fulfilled" ? result.value.data[0] : undefined;

    return (
      existing || {
        formType: type.formType,
        homeId,
      }
    );
  });
};

const fetchTrainingsInit = async ({ homeId }) => {
  return await fetchTrainingMods(homeId);
};

const TrainingsList = ({ userObj, toggleDisplay }) => {
  const [trainings, setTrainings] = useState([]);

  const getTrainings = useAsync({
    promiseFn: fetchTrainingsInit,
    homeId: userObj.homeId,
    onResolve: (data) => {
      setTrainings(data);
    },
  });

  return (
    <div className='formCompNoBg'>
      <div className='formTitleDiv'>
        <h2 className='formTitle'>Trainings</h2>
      </div>
      <IfRejected state={getTrainings}>
        <p>Error</p>
      </IfRejected>
      <IfPending state={getTrainings}>
        <p>Loading...</p>
      </IfPending>
      <IfFulfilled state={getTrainings}>
        <div className='formFieldsMobile'>
          <div className='form-group logInInputField d-flex mt-3 border-bottom'>
            <Col className='control-label'></Col>
            <Col className='control-label'>
              <label>Name</label>
            </Col>
          </div>
          {trainings &&
            trainings.map((training) => (
              <div
                key={training.formType}
                className='form-group logInInputField d-flex mt-3'
              >
                <Col className='control-label'>
                  <button
                    className='btn btn-light extraInfoButton'
                    onClick={() => {
                      toggleDisplay(training.formType);
                    }}
                  >
                    Open
                  </button>
                </Col>
                <Col className='control-label'>
                  <label>{training?.displayName || training?.formType}</label>
                </Col>
              </div>
            ))}
        </div>
      </IfFulfilled>
    </div>
  );
};

export default TrainingsList;
