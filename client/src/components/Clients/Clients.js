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

/**
 * Renders the Clients component.
 * @param {Object} props - The component props.
 * @param {boolean} props.showClientForm - Flag indicating whether to show the client form.
 * @param {Object} props.userObj - The user object.
 * @param {function} props.doToggleClientDisplay - Function to toggle the client display.
 * @returns {JSX.Element} The rendered Clients component.
 */
const Clients = ({ showClientForm, userObj, doToggleClientDisplay }) => {
  const [showClients, setShowClients] = useState(showClientForm);
  const [isClientSelected, setIsClientSelected] = useState(false);
  const [isInit, setIsInit] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [showActive, setShowActive] = useState(true);

  /**
   * Fetches all clients and updates the state.
   */
  const getAllClients = useAsync({
    promiseFn: fetchAllClientsInit,
    homeId: userObj.homeId,
    deferFn: fetchAllClients,
    onResolve: (data) => {
      const d = filterClients(data.data);
      setClients(d);
    },
  });

  /**
   * Filters the clients based on the showActive flag.
   * @param {Array} data - The array of clients.
   * @returns {Array} The filtered array of clients.
   */
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

  /**
   * Deletes a client and updates the state.
   */
  const deleteClient = useAsync({
    deferFn: doDeleteClient,
    onResolve: (data) => {
      getAllClients.run([userObj.homeId]);
    },
  });

  /**
   * Sets the selected client and updates the state.
   * @param {Object} value - The selected client.
   */
  const setClient = (value) => {
    setIsClientSelected(true);
    doToggleClientDisplay(false);
    setSelectedClient(value);
  };

  /**
   * Deletes a client and updates the state.
   * @param {Object} value - The client to delete.
   * @param {boolean} active - Flag indicating whether the client is active.
   */
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

  /**
   * Toggles the client filter and updates the state.
   * @param {boolean} value - Flag indicating whether to show active clients.
   */
  const toggleClientFilter = async (value) => {
    if (value !== showActive) {
      await setShowActive(value);
    }
  };

  useEffect(() => {
    if (showClientForm) {
      setIsClientSelected(false);
    }
    setShowClients(showClientForm);
    if (showClientForm && !isInit) {
      getAllClients.run([userObj.homeId]);
    }
    setIsInit(false);
  }, [showClientForm, getAllClients, isInit, userObj.homeId]);

  useEffect(() => {
    if (!isInit) {
      getAllClients.run([userObj.homeId]);
    }
  }, [showActive, getAllClients, isInit, userObj.homeId]);

  if (showClients) {
    return (
      <div className="formCompNoBg">
        <div className="formTitleDiv">
          <h2 className="formTitle">Clients</h2>
        </div>
        {/* ... */}
      </div>
    );
  } else {
    return (
      <div className="formCompNoBg">
        <div className="formTitleDiv">
          <h2 className="formTitle">Clients</h2>
        </div>
        {/* ... */}
      </div>
    );
  }
};

export default Clients;
