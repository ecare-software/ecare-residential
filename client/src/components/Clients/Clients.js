import React, { useState, useEffect, useMemo } from "react";
import { useAsync, IfRejected, IfPending, IfFulfilled } from "react-async";
import "../../App.css";
import "../LogInContainer/LogInContainer.css";
import Axios from "axios";
import FaceSheet from "../Forms/FaceSheet";
import FosterChecklist from "./FosterChecklist";
import { Col } from "react-bootstrap";

// The list only needs names/admission dates; full records (with base64
// photos) are fetched one at a time when a client is opened.
const fetchAllClientsInit = async ({ homeId }) => {
  return await Axios.get(`/api/client/${homeId}?summary=true`);
};

const doDeleteClient = async ([homeId, clientId, active]) => {
  return await Axios.put(`/api/client/${homeId}/${clientId}`, {
    active,
  });
};

const fetchAllClients = async ([homeId]) => {
  return await Axios.get(`/api/client/${homeId}?summary=true`);
};

const Clients = ({ showClientForm, userObj, doToggleClientDisplay }) => {
  const [showClients, setShowClients] = useState(showClientForm);
  const [selectedView, setSelectedView] = useState("facesheet");
  const [isClientSelected, setIsClientSelected] = useState(false);
  const [isInit, setIsInit] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [showActive, setShowActive] = useState(true);
  const [isLoadingClient, setIsLoadingClient] = useState(false);
  const [clientLoadError, setClientLoadError] = useState(null);

  useEffect(() => {
    if (showClientForm) {
      setIsClientSelected(false);
      setSelectedClient(null);
      setSelectedView("facesheet");
      setClientLoadError(null);
    }

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

  // The server always returns every client for the home regardless of
  // active status, so switching tabs only needs to re-filter data already
  // in memory - refetching here would leave the previous tab's list on
  // screen until the round-trip finished.
  const visibleClients = useMemo(() => {
    if (showActive === true) {
      return clients.filter((client) => {
        return !client.hasOwnProperty("active") || client.active === true;
      });
    } else {
      return clients.filter((client) => {
        return client.active === false;
      });
    }
  }, [clients, showActive]);

  const deleteClient = useAsync({
    deferFn: doDeleteClient,
    onResolve: (data) => {
      getAllClients.run([userObj.homeId]);
    },
  });

  const setClient = async (value, view) => {
    setIsClientSelected(true);
    doToggleClientDisplay(false);
    setSelectedView(view);
    setSelectedClient(null);
    setClientLoadError(null);
    setIsLoadingClient(true);
    try {
      const { data } = await Axios.get(
        `/api/client/${value._id}/${userObj.homeId}/`
      );
      setSelectedClient(data);
    } catch (e) {
      // Don't fall back to the summary record: opening the Face Sheet with
      // only a few fields filled in and then saving would blank out the
      // rest of the real record.
      setClientLoadError(
        e.response?.data?.message || "Error loading this client"
      );
    } finally {
      setIsLoadingClient(false);
    }
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

  // Fixed column widths (out of 12), shared by the header and every row so
  // they line up - equal-width Cols let the wide Actions buttons push the
  // row's other cells out of alignment with the header.
  const colWidths = showActive
    ? { actions: 5, name: 4, admission: 3 }
    : { actions: 5, name: 3, admission: 2, discharge: 2 };

  if (showClients) {
    return (
      <div className="formCompNoBg">
        <div className="formTitleDiv">
          <h2 className="formTitle">Clients</h2>
        </div>
        <div className="formFieldsMobile">
          <div style={{ height: "25px" }}>
            <IfPending state={getAllClients}>
              <h4>Loading...</h4>
            </IfPending>
            <IfFulfilled state={getAllClients}>
              <h4>
                {visibleClients.length} {showActive ? "Active" : "Inactive"} Clients
              </h4>
            </IfFulfilled>
          </div>
          <div
            className="form-group logInInputField d-flex mt-3 justify-content-center"
            style={{ alignItems: "center" }}
          >
            <h5 style={{ margin: "0px 10px" }}>Filter</h5>
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
          </div>
          <div className="form-group logInInputField d-flex mt-3 border-bottom">
            <Col xs={colWidths.actions} className="control-label">
               <label style={{ fontWeight: "bold" }}>Actions</label>
            </Col>
            <Col xs={colWidths.name} className="control-label">
              <label>Name</label>
            </Col>
            <Col xs={colWidths.admission}>
              <label className="control-label">Date of Admission</label>
            </Col>
            {!showActive && (
              <Col xs={colWidths.discharge}>
                <label className="control-label">Discharge Date</label>
              </Col>
            )}
          </div>
          {visibleClients.map((client) => (
            <div className="form-group logInInputField d-flex mt-3" key={client._id}>
              <Col
                xs={colWidths.actions}
                className="control-label d-flex"
                style={{ flexWrap: "wrap" }}
              >
                <button
                  className="btn btn-light extraInfoButton"
                  onClick={() => {
                    setClient(client, "facesheet");
                  }}
                >
                  Open
                </button>
                <button
                  className="btn btn-light extraInfoButton ml-2"
                  onClick={() => {
                    setClient(client, "checklist");
                  }}
                >
                  Checklist
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
              <Col xs={colWidths.name} className="control-label">
                <label>{client.childMeta_name}</label>
              </Col>
              <Col xs={colWidths.admission}>
                <label className="control-label">
                  {client.childMeta_dateOfAdmission}
                </label>
              </Col>
              {!showActive && (
                <Col xs={colWidths.discharge}>
                  <label className="control-label">
                    {client.childMeta_dischargeDate}
                  </label>
                </Col>
              )}
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
        {isLoadingClient && <p>Loading...</p>}
        {clientLoadError && <p>{clientLoadError}</p>}
        <IfFulfilled state={getAllClients}>
          {!isLoadingClient && !clientLoadError && (
          <>
            {selectedView === "facesheet" && (
              <FaceSheet
                valuesSet={isClientSelected}
                userObj={userObj}
                id="facesheet"
                formData={selectedClient}
              />
            )}

            {selectedView === "checklist" && (
              <FosterChecklist
                valuesSet={isClientSelected}
                userObj={userObj}
                formData={selectedClient}
              />
            )}
          </>
          )}
        </IfFulfilled>
      </div>
    );
  }
};

export default Clients;
