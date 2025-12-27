import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Modal, Tab, Nav, Form, Button, Alert } from "react-bootstrap";
import "../../App.css";
import UpdateUser from "./UpdateUser";
import DeactivateUser from "./DeactivateUser";
// import ActivateUser from "./ActivateUser";
import DeleteUser from "./DeleteUser";
import { isAdminUser } from "../../utils/AdminReportingRoles";

const ManageUsers = ({ userObj, toggleShow, doShow, getAllUsers }) => {
  // User state
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Password reset state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Fetch users data
  const fetchData = async () => {
    try {
      const { data } = await axios.get(`/api/users/${userObj.homeId}`);
      getAllUsers();
      const sortedData = data.sort((a, b) => a.index - b.index); // Sort by index
      setUsers(sortedData);
      setActiveUsers(sortedData.filter((user) => user.isActive));
      setInactiveUsers(sortedData.filter((user) => !user.isActive));
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error("Error fetching users:", e);
      alert("Error fetching data. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open password reset modal for a specific user
  const openPasswordResetModal = (user) => {
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess(false);
    setShowPasswordModal(true);
  };

  // Close password reset modal and reset state
  const closePasswordResetModal = () => {
    setShowPasswordModal(false);
    setSelectedUser(null);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess(false);
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    setPasswordError("");
    if (e.target.name === "newPassword") {
      setNewPassword(e.target.value);
    } else {
      setConfirmPassword(e.target.value);
    }
  };

  // Validate password
  const validatePassword = () => {
    // Reset previous errors
    setPasswordError("");

    // Check if password is empty or just whitespace
    if (!newPassword || newPassword.trim() === "") {
      setPasswordError("Password cannot be empty");
      return false;
    }

    // Check if password is too short (minimum 6 characters)
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    return true;
  };

  // Save new password
  const saveNewPassword = async () => {
    // Validate password before submission
    if (!validatePassword()) {
      return;
    }

    setIsResetting(true);

    try {
      await axios.put(`/api/users/${selectedUser._id}`, {
        password: newPassword,
        newUser: false,
      });

      // Show success message
      setPasswordSuccess(true);
      setIsResetting(false);

      // Close modal after 2 seconds
      setTimeout(() => {
        closePasswordResetModal();
      }, 2000);

    } catch (e) {
      console.error("Error resetting password:", e);
      setPasswordError("Error updating password. Please try again.");
      setIsResetting(false);
    }
  };

  return (
    <>
      <div className="managementElement" id="manageUsersContainer">
        <h4
          className="defaultLabel pointer"
          onClick={toggleShow.bind({}, "Manage User")}
        >
          Manage Users{" "}
          <span
            style={{ fontSize: "15px" }}
            className={doShow ? "fa fa-chevron-down" : "fa fa-chevron-right"}
          ></span>
        </h4>
        <div className={doShow ? "formFields" : "hideIt"}>
          {isAdminUser(userObj) ? (
            <Tab.Container defaultActiveKey="active-users">
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="active-users">Active</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="inactive-users">Inactive</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="active-users" style={{ backgroundColor: "white" }}>
                  <Table>
                    <thead>
                      <tr>
                        <th style={{ width: 5 }}></th>
                        <th style={{ width: 5 }}></th>
                        <th style={{ width: 5 }}>Name</th>
                        <th style={{ width: "auto" }}>Email/Role</th>
                        <th style={{ width: 5 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeUsers.length === 0 && (
                        <tr>
                          <td colSpan="6">
                            No active users available at this time.
                          </td>
                        </tr>
                      )}
                      {activeUsers.map((user) => (
                        <tr key={`active-${user._id}`}>
                          <td style={{ width: 5 }}>
                            <UpdateUser
                              id={user._id}
                              fetchData={fetchData}
                              item={user}
                            />
                          </td>
                          <td style={{ width: 5 }}>
                            <DeactivateUser
                              id={user._id}
                              fetchData={fetchData}
                              getAllUsers={getAllUsers}
                            />
                          </td>
                          <td>
                            {user.firstName}, {user.lastName}
                          </td>
                          <td style={{ width: "auto" }}>
                            {user.email}
                            <br />
                            {user.jobTitle}
                          </td>
                          <td style={{ width: 5 }}>
                            <Button
                              variant="light"
                              className="extraInfoButton"
                              onClick={() => openPasswordResetModal(user)}
                            >
                              Reset Password
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>
                <Tab.Pane eventKey="inactive-users" style={{ backgroundColor: "white" }}>
                  <Table>
                    <thead>
                      <tr>
                        <th style={{ width: 5 }}></th>
                        <th style={{ width: 5 }}></th>
                        <th style={{ width: 5 }}>Name</th>
                        <th style={{ width: "auto" }}>Email/Role</th>
                        <th style={{ width: 5 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {inactiveUsers.length === 0 && (
                        <tr>
                          <td colSpan="6">
                            No inactive users available at this time.
                          </td>
                        </tr>
                      )}
                      {inactiveUsers.map((user) => (
                        <tr key={`inactive-${user._id}`}>
                          <td style={{ width: 5 }}>
                            <UpdateUser
                              id={user._id}
                              fetchData={fetchData}
                              item={user}
                            />
                          </td>
                          {/* <td style={{ width: 5 }}>
                            <ActivateUser
                              id={user._id}
                              fetchData={fetchData}
                              getAllUsers={getAllUsers}
                            />
                          </td> */}
                          <td style={{width:5}}>
                            <DeleteUser
                              id={user._id}
                              fetchData={fetchData}
                              getAllUsers={getAllUsers}
                            />
                          </td>
                          <td>
                            {user.firstName}, {user.lastName}
                          </td>
                          <td style={{ width: "auto" }}>
                            {user.email}
                            <br />
                            {user.jobTitle}
                          </td>
                          <td style={{ width: 5 }}>
                            <Button
                              variant="light"
                              className="extraInfoButton"
                              onClick={() => openPasswordResetModal(user)}
                            >
                              Reset Password
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          ) : (
            <h5 className="defaultLabel pointer">
              You do not have admin privileges.
            </h5>
          )}
        </div>
      </div>

      {/* Password Reset Modal */}
      <Modal
        show={showPasswordModal}
        onHide={closePasswordResetModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton style={{ backgroundColor: "#fff" }}>
          <Modal.Title style={{ backgroundColor: "#fff" }}>
            {selectedUser && `Reset Password for ${selectedUser.firstName} ${selectedUser.lastName}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#fff" }}>
          {passwordSuccess ? (
            <Alert variant="success">
              Password has been successfully reset!
            </Alert>
          ) : (
            <Form>
              {passwordError && (
                <Alert variant="danger">{passwordError}</Alert>
              )}
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
                <Form.Text className="text-muted">
                  Password must be at least 6 characters long.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#fff" }}>
          {!passwordSuccess && (
            <>
              <Button variant="secondary" onClick={closePasswordResetModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={saveNewPassword}
                disabled={isResetting}
              >
                {isResetting ? "Resetting..." : "Reset Password"}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageUsers;
