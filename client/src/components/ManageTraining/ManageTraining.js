import React, { Component, useState, useEffect } from "react";
import { useAsync, IfRejected, IfPending, IfFulfilled } from "react-async";
import "../../App.css";
import "../LogInContainer/LogInContainer.css";
import Axios from "axios";
import FaceSheet from "../Forms/FaceSheet";
import styled from "styled-components";
import { Col } from "react-bootstrap";
import TrainingMod from "../Forms/TrainingMod";

const SmallCol = styled.div`
  width: 100px;
  text-align: center;
`;

const SmallColRight = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  text-align: center;
`;

const SmallColRightTitle = styled.div`
  width: 200px;
  text-align: center;
`;

const formModsApis = [
  "orientationTrainingMod",
  "preServiceTrainingMod",
  "firstAidCprTrainingMod",
  "annualTrainingMod",
];

const fetchTrainingMods = async (homeId) => {
  let promises = [];

  formModsApis.forEach((pathname) => {
    promises.push(Axios.get(`/api/${pathname}/${homeId}`));
  });

  const data = await Promise.allSettled(promises);

  const settledModels = data
    .filter((promObj) => {
      return promObj.status === "fulfilled";
    })
    .map((promObj) => {
      return promObj.value.data[0];
    });

  return settledModels;
};

const fetchAllTrainingsInit = async ({ homeId }) => {
  return await fetchTrainingMods(homeId);
};

const fetchAllTrainings = async ([homeId]) => {
  return await fetchTrainingMods(homeId);
};

const ManageTraining = ({
  showTrainingsForm,
  userObj,
  doToggleTrainingDisplay,
}) => {
  const [showTrainings, setShowTrainings] = useState(showTrainingsForm);
  const [isInit, setIsInit] = useState(true);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    setShowTrainings(showTrainingsForm);
    if (showTrainingsForm && !isInit) {
      getAllTrainings.run([userObj.homeId]);
    }
    setIsInit(false);
  }, [showTrainingsForm]);

  const getAllTrainings = useAsync({
    promiseFn: fetchAllTrainingsInit,
    homeId: userObj.homeId,
    deferFn: fetchAllTrainings,
    onResolve: (data) => {
      setTrainings(data);
    },
  });

  const setTraining = (value) => {
    setSelectedTraining(value);
    doToggleTrainingDisplay(false);
  };

  if (showTrainings) {
    return (
      <div className="formCompNoBg">
        <div className="formTitleDiv">
          <h2 className="formTitle">Trainings</h2>
        </div>
        <div className="formFieldsMobile">
          <div className="form-group logInInputField d-flex mt-3 border-bottom">
            <Col className="control-label"></Col>
            <Col className="control-label">
              <label>Name</label>
            </Col>
          </div>
          {trainings.map((training) => (
            <div className="form-group logInInputField d-flex mt-3">
              <Col className="control-label">
                <button
                  className="btn btn-light extraInfoButton"
                  onClick={() => {
                    setTraining(training);
                  }}
                >
                  Edit
                </button>
              </Col>
              <Col className="control-label">
                <label>{training.formType}</label>
              </Col>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="formCompNoBg">
        <div className="formTitleDiv">
          <h2 className="formTitle">Trainings</h2>
        </div>
        <IfRejected state={getAllTrainings}>
          <p>Error</p>
        </IfRejected>
        <IfPending state={getAllTrainings}>
          <p>Loading...</p>
        </IfPending>
        <IfFulfilled state={getAllTrainings}>
          <TrainingMod
            doToggleTrainingDisplay={doToggleTrainingDisplay}
            data={selectedTraining}
          />
        </IfFulfilled>
      </div>
    );
  }
};

export default ManageTraining;
