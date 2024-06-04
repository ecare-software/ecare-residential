import React, { useRef, useState } from "react";
import axios from "axios";
import { Modal, Form, Button } from "react-bootstrap";

export default function UpdateUser({ fetchData, id, item }) {
  // Form Modal state
  const [showUpdate, setShowUpdate] = useState();
  const [isEnabled, setIsEnabled] = useState();

  // Show and Hide Form Modal
  const handleClose = () => setShowUpdate(false);
  const handleShow = () => setShowUpdate(true);

  const [userInfo, setUserInfo] = useState({
    firstName: item.firstName,
    middleName: item.middleName,
    lastName: item.lastName,
    jobTitle: item.jobTitle,
    email: item.email,
  });

  const handleChange = (event) => {
    setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
  };

  const inputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleEnable = () => {
    setIsEnabled(true);
  };

  const [isLoading, setIsLoading] = useState();
  const [data, setData] = useState([]);

  // Success Dialog State
  const [showSuccess, setShowSuccess] = useState(false);

  // Error Dialog State
  const [showError, setShowError] = useState(false);

  // UPDATE
  const updateUserInfo = async (id) => {
    try {
      const { data } = await axios(`/api/users/${id}`, {
        method: "PUT",
        data: {
          firstName: userInfo.firstName,
          middleName: userInfo.middleName,
          lastName: userInfo.lastName,
          jobTitle: userInfo.jobTitle,
          email: userInfo.email,
        },
      });
      setData(data);
      setIsLoading(false);

      // Hides Modal on submission
      setShowUpdate(false);

      // Success Alert Popup
      setShowSuccess(true);

      setIsEnabled(false);

      // Table state update on submit
      fetchData(data);
    } catch (e) {
      setIsLoading(false);

      // Hides Modal on submission
      setShowUpdate(false);

      // Error Alert Popup
      setShowError(true);
    }
  };

  const updateUserModal = (
    <Modal show={showUpdate} backdrop="static" onHide={handleClose}>
      <Modal.Header closeButton style={{ backgroundColor: "#fff" }}>
        <Modal.Title style={{ backgroundColor: "#fff" }}>
          Update {item.firstName} {item.lastName} Info
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#fff" }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              ref={inputRef}
              type="text"
              name="firstName"
              placeholder="First Name"
              autoFocus
              onChange={handleChange}
              defaultValue={item.firstName}
              onKeyDown={handleEnable}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Middle Name</Form.Label>
            <Form.Control
              ref={inputRef}
              type="text"
              name="middleName"
              placeholder="Middle Name"
              autoFocus
              onChange={handleChange}
              defaultValue={item.middleName}
              onKeyDown={handleEnable}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              ref={inputRef}
              type="text"
              name="lastName"
              placeholder="Last Name"
              autoFocus
              onChange={handleChange}
              defaultValue={item.lastName}
              onKeyDown={handleEnable}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Job Title</Form.Label>
            <Form.Control
              ref={inputRef}
              as={"select"}
              name="jobTitle"
              placeholder="Job Title"
              autoFocus
              onChange={handleChange}
              defaultValue={item.jobTitle}
              onKeyDown={handleEnable}
            >
              <option value=''>Choose...</option>
              <option value='Owner/CEO'>Owner/CEO</option>
              <option value='Executive/Director'>Executive Director</option>
              <option value='Administrator'>Administrator</option>
              <option value='Supervisor'>Supervisor</option>
              <option value='Administrative/Assistant'>Administrative Assistant</option>
              <option value='Lead/Staff'>Lead Staff</option>
              <option value='Medical/Coordinator'>Medical Coordinator</option>
              <option value='Therapist'>Therapist</option>
              <option value='Case/Manager'>Case Manager</option>
              <option value='Direct/Care/Staff'>Direct Care Staff</option>
              <option value='Awake/Night/Staff'>Awake Night Staff</option>
              <option value='Volunteer/Staff'>Volunteer Staff</option>

            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Email</Form.Label>
            <Form.Control
              ref={inputRef}
              type="text"
              name="email"
              placeholder="Email"
              autoFocus
              onChange={handleChange}
              defaultValue={item.email}
              onKeyDown={handleEnable}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#fff" }}>
        <Button variant="outline-dark" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="dark"
          onClick={() => updateUserInfo(id)}
          disabled={!isEnabled}
        >
          Update
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
        {"User was successfully updated."}
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
        {"There was an error updating the user."}
      </Modal.Body>
    </Modal>
  );

  return (
    <>
      <button className="btn btn-light extraInfoButton" onClick={handleShow}>
        {"Update"}
      </button>
      {updateUserModal}
      {successAlert}
      {errorAlert}
    </>
  );
}
