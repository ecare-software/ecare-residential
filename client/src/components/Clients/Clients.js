import React, { Component, useState, useEffect } from "react";
import { useAsync, IfRejected, IfPending, IfFulfilled } from "react-async";
import "../../App.css";
import "../LogInContainer/LogInContainer.css";
import Axios from "axios";
import FaceSheet from "../Forms/FaceSheet";
import styled from "styled-components";
import { Col } from "react-bootstrap";

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

const fetchAllClientsInit = async ({ homeId }) => {
  return await Axios.get(`/api/client/${homeId}`);
};

const fetchAllClients = async ([homeId]) => {
  return await Axios.get(`/api/client/${homeId}`);
};

const Clients = ({ showClientForm, userObj, doToggleClientDisplay }) => {
  const [showClients, setShowClients] = useState(showClientForm);
  const [isClientSelected, setIsClientSelected] = useState(false);
  const [isInit, setIsInit] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    setShowClients(showClientForm);
    if (showClientForm && !isInit) {
      getAllClients.run([userObj.homeId]);
      //   setIsClientSelected(false);
      //   setSelectedClient(null);
    }
    setIsInit(false);
  }, [showClientForm]);

  const getAllClients = useAsync({
    promiseFn: fetchAllClientsInit,
    homeId: userObj.homeId,
    deferFn: fetchAllClients,
    onResolve: (data) => {
      setClients(data.data);
    },
  });

  const setClient = (value) => {
    setIsClientSelected(true);
    setSelectedClient(value);
    doToggleClientDisplay(false);
  };

  if (showClients) {
    return (
      <div className="formCompNoBg">
        <div className="formTitleDiv">
          <h2 className="formTitle">Clients</h2>
        </div>
        <div className="formFieldsMobile">
          <div>
            <h4>{clients.length} Clients</h4>
          </div>
          <div className="form-group logInInputField d-flex mt-3 border-bottom">
            <Col className="control-label"></Col>
            <Col className="control-label">
              <label>Name</label>
            </Col>
            <Col>
              <label className="control-label">Date of Admission</label>
            </Col>
          </div>
          {clients.map((client) => (
            <div className="form-group logInInputField d-flex mt-3">
              <Col className="control-label">
                <button
                  className="btn btn-light extraInfoButton"
                  onClick={() => {
                    setClient(client);
                  }}
                >
                  Edit
                </button>
              </Col>
              <Col className="control-label">
                <label>{client.childMeta_name}</label>
              </Col>
              <Col>
                <label className="control-label">{client.childMeta_doa}</label>
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
          <h2 className="formTitle">Clients</h2>
        </div>
        <IfRejected state={getAllClients}>
          <p>Error</p>
        </IfRejected>
        <IfPending state={getAllClients}>
          <p>Loading...</p>
        </IfPending>
        <IfFulfilled state={getAllClients}>
          <FaceSheet
            valuesSet={isClientSelected}
            userObj={userObj}
            id="facesheet"
            formData={selectedClient}
          />
        </IfFulfilled>
      </div>
    );
  }
};

export default Clients;
