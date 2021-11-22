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

const doDeleteClient = async ([homeId, clientId, active]) => {
  return await Axios.put(`/api/client/${homeId}/${clientId}`, {
    active,
  });
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
  const [showActive, setShowActive] = useState(true);

  useEffect(() => {
    if (showClientForm) {
      setIsClientSelected(false);
    }
    setShowClients(showClientForm);
    if (showClientForm && !isInit) {
      getAllClients.run([userObj.homeId]);
    }
    setIsInit(false);
  }, [showClientForm]);

  useEffect(() => {
    if (!isInit) {
      getAllClients.run([userObj.homeId]);
    }
  }, [showActive]);

  const getAllClients = useAsync({
    promiseFn: fetchAllClientsInit,
    homeId: userObj.homeId,
    deferFn: fetchAllClients,
    onResolve: (data) => {
      const d = filterClients(data.data);
      setClients(d);
    },
  });

  const filterClients = (data) => {
    if (showActive === true) {
      return data.filter((client) => {
        return !client.hasOwnProperty("active") || client.active === true;
      });
    } else {
      return data.filter((client) => {
        return client.active === false;
      });
    }
  };

  const deleteClient = useAsync({
    deferFn: doDeleteClient,
    onResolve: (data) => {
      getAllClients.run([userObj.homeId]);
    },
  });

  const setClient = (value) => {
    setIsClientSelected(true);
    doToggleClientDisplay(false);
    setSelectedClient(value);
  };

  const deleteClientCall = async (value, active) => {
    if (
      window.confirm(
        `Are you sure you want to ${
          active ? "activate" : "deactivate"
        } this client?`
      )
    ) {
      await deleteClient.run(userObj.homeId, value._id, active);
      doToggleClientDisplay(true);
    }
  };

  const toggleClientFilter = async (value) => {
    if (value !== showActive) {
      await setShowActive(value);
    }
  };

  if (showClients) {
    return (
      <div className="formCompNoBg">
        <div className="formTitleDiv">
          <h2 className="formTitle">Clients</h2>
        </div>
        <div className="formFieldsMobile">
          <div style={{ height: "25px" }}>
            <IfPending>
              <h4>Loading...</h4>
            </IfPending>
            <IfFulfilled state={getAllClients}>
              <h4>
                {clients.length} {showActive ? "Active" : "Inactive"} Clients
              </h4>
            </IfFulfilled>
          </div>
          <div
            className="form-group logInInputField d-flex mt-3 justify-content-center"
            style={{ alignItems: "center" }}
          >
            <h5 style={{ margin: "0px 10px" }}>Filter</h5>
            {/* <div className="mt-3"> */}
            <button
              onClick={() => {
                toggleClientFilter(true);
              }}
              className={`btn ${showActive ? "btn-light" : ""} extraInfoButton`}
            >
              Active
            </button>
            <button
              onClick={() => {
                toggleClientFilter(false);
              }}
              className={`btn ${
                showActive ? "" : "btn-light"
              } extraInfoButton `}
            >
              Inactive
            </button>
            {/* </div> */}
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
                    deleteClientCall(client, !showActive);
                  }}
                >
                  <span
                    style={{
                      textDecoration: "none",
                      color: "#444",
                      cursor: "pointer",
                    }}
                  >
                    {showActive ? "Deactivate" : "Activate"}
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
