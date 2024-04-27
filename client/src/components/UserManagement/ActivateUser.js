import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

export default function ActivateUser({ id, fetchData }) {
  const [showActivation, setShowActivation] = useState(false);

  const handleClose = () => setShowActivation(false);
  const handleShow = () => setShowActivation(true);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  // Success Dialog State
  const [showSuccess, setShowSuccess] = useState(false);

  // Error Dialog State
  const [showError, setShowError] = useState(false);

  const activateUser = async (id) => {
    try {
      const { data } = await axios(`/api/users/${id}`, {
        method: "PUT",
        data: {
          isActive: true,
        },
      });

      setData(data);
      setIsLoading(false);

      // Hide Modal on Submission
      setShowActivation(false);

      // Success Alert Popup
      setShowSuccess(true);

      fetchData(data);
    } catch (e) {
      setIsLoading(false);

      // Hides Modal on submission
      setShowActivation(false);

      // Error Alert Popup
      setShowError(true);
      console.error(e);
    }
  };

  const activateUserModal = (
    <Modal show={showActivation} backdrop="static" onHide={handleClose}>
      <Modal.Header closeButton style={{ backgroundColor: "#fff" }}>
        <Modal.Title style={{ backgroundColor: "#fff" }}>
          Activate User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#fff" }}>
        Are you sure you want to activate this user?
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#fff" }}>
        <Button variant="outline-dark" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="success"
          onClick={() => activateUser(id)}
        >
          Activate
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const successAlert = (
    <Modal
      show={showSuccess}
      onHide={() => {
        setShowSuccess(false);
        handleClose();
      }}
      backdrop="static"
    >
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#00E676" }}
      >{"Success!"}</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#fff" }}>
        {"User was successfully activated"}
      </Modal.Body>
    </Modal>
  );

  const errorAlert = (
    <Modal
      show={showError}
      onHide={() => {
        setShowError(false);
        handleClose();
      }}
      backdrop="static"
    >
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#FF1744" }}
      >{"Error!"}</Modal.Header>
      <Modal.Body style={{ backgroundColor: "#fff" }}>
        {"There was an error activating the user."}
      </Modal.Body>
    </Modal>
  );

  return (
    <>
      <button className="btn btn-link extraInfoButton" onClick={handleShow}>
        {"Activate"}
      </button>
      {activateUserModal}
      {successAlert}
      {errorAlert}
    </>
  );
}
