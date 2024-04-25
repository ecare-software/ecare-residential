import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

export default function DeactivateUser({ id, fetchData }) {
  const [showDeactivation, setShowDeactivation] = useState(false);

  const handleClose = () => setShowDeactivation(false);
  const handleShow = () => setShowDeactivation(true);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  // Success Dialog State
  const [showSuccess, setShowSuccess] = useState(false);

  // Error Dialog State
  const [showError, setShowError] = useState(false);

  const deactivateUser = async (id) => {
    try {
      const { data } = await axios(`/api/users/${id}`, {
        method: "PUT",
        data: {
          isActive: false,
        },
      });

      setData(data);
      setIsLoading(false);

      // Hide Modal on Submission
      setShowDeactivation(false);

      // Success Alert Popup
      setShowSuccess(true);
    } catch (e) {
      setIsLoading(false);

      // Hides Modal on submission
      setShowDeactivation(false);

      // Error Alert Popup
      setShowError(true);
      console.error(e);
    }
  };

  // Table state update on submit
  useEffect(() => {
    fetchData(data);
  }, [data]);

  const deactivateUserModal = (
    <Modal show={showDeactivation} backdrop="static" onHide={handleClose}>
      <Modal.Header closeButton style={{ backgroundColor: "#fff" }}>
        <Modal.Title style={{ backgroundColor: "#fff" }}>
          Deactivate User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#fff" }}>
        Are you sure you want to deactivate this user?
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#fff" }}>
        <Button variant="outline-dark" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="danger"
          onClick={() => deactivateUser(id)}
        >
          Deactivate
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
      <Modal.Header closeButton style={{ backgroundColor: "#00E676" }}>
        {"Success!"}
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#fff" }}>
        {"User was successfully Deactivated."}
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
      <Modal.Header closeButton style={{ backgroundColor: "#FF1744" }}>
        {"Error!"}
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#fff" }}>
        {"There was an error deactivating the user."}
      </Modal.Body>
    </Modal>
  );

  return (
    <>
      <button className="btn btn-link extraInfoButton" onClick={handleShow}>
        {"Deactivate"}
      </button>
      {deactivateUserModal}
      {successAlert}
      {errorAlert}
    </>
  );
}
