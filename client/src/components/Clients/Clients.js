import React, { useState, useEffect } from "react";
import { useAsync, IfRejected, IfPending, IfFulfilled } from "react-async";
import "../../App.css";
import "../LogInContainer/LogInContainer.css";
import Axios from "axios";
import FaceSheet from "../Forms/FaceSheet";
import { Col } from "react-bootstrap";

const fetchAllClientsInit = async ({ homeId }) => {
  return await Axios.get(`/api/client/${homeId}`);
};

const doDeleteClient = async ([homeId, clientId]) => {
  return await Axios.delete(`/api/client/${homeId}/${clientId}`);
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

  const deleteClient = useAsync({
    deferFn: doDeleteClient,
    onResolve: (data) => {
      getAllClients.run([userObj.homeId]);
    },
  });

  const setClient = (value) => {
    setIsClientSelected(true);
    setSelectedClient(value);
    doToggleClientDisplay(false);
  };

  const deleteClientCall = async (value) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      await deleteClient.run(userObj.homeId, value._id);
      doToggleClientDisplay(true);
    }
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
              <Col className="control-label d-flex">
                <button
                  className="btn btn-light extraInfoButton"
                  onClick={() => {
                    setClient(client);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-link extraInfoButton"
                  onClick={() => {
                    deleteClientCall(client);
                  }}
                >
                  <span
                    style={{
                      textDecoration: "none",
                      color: "#444",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </span>
                </button>
              </Col>
              <Col className="control-label">
                <label>{client.childMeta_name}</label>
              </Col>
              <Col>
                <label className="control-label">
                  {client.childMeta_dateOfAdmission}
                </label>
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
