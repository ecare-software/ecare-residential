import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Table, Modal, Tab, Nav } from "react-bootstrap";
import "../../App.css";
import UpdateUser from "./UpdateUser";
import DeactivateUser from "./DeactivateUser";
import ActivateUser from "./ActivateUser";
import axios from "axios";
import { isAdminUser } from "../../utils/AdminReportingRoles";

const ManageUsers = ({ userObj, toggleShow, doShow, getAllUsers }) => {
  const [resetting, setResetting] = useState(-1);
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await axios("/api/users/" + userObj.homeId, {
        method: "GET",
      });
      getAllUsers();
      const sortedData = data.sort((a, b) => a.index - b.index); // Sort by index
      setUsers(sortedData);
      setActiveUsers(sortedData.filter((user) => user.isActive));
      setInactiveUsers(sortedData.filter((user) => !user.isActive));
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      alert("error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openNewPassword = (user) => {
    if (resetting === user._id) {
      setResetting(null);
    } else {
      setResetting(user._id);
    }
    setNewPassword("");
    setNewPassword2("");
  };

  const toggleCreatedPassword = async () => {
    setNewPassword("");
    setNewPassword2("");
    setResetting(-1);
  };

  const handleFieldInput = (event) => {
    const isReenter = event.target.id.split("-")[0];

    if (isReenter === "reenterpassword") {
      setNewPassword2(event.target.value);
    } else {
      setNewPassword(event.target.value);
    }
  };

  const saveNewPassword = async (id, index) => {
    if (/^\s+$/.test(newPassword)) {
      alert("Password is not valid");
      return;
    }

    if (newPassword !== newPassword2) {
      alert("Passwords do not match");
      return;
    }

    try {
      const { data } = await Axios({
        method: "put",
        url: "/api/users/" + id,
        data: {
          password: newPassword,
          newUser: false,
        },
      });
      if (id === userObj._id) {
        console.log("is logged in user");
      }
      alert("password has been reset");
      toggleCreatedPassword();
    } catch (e) {
      alert("Error updating password");
      console.log(e);
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
                <Tab.Pane eventKey="active-users" style={{backgroundColor: "white"}}>
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
                      {activeUsers.map((item, index) => (
                        <tr key={index + "-" + "user"}>
                          {/* {console.log('index of tr:', item, '  ', index)} */}
                          <td style={{ width: 5 }}>
                            <UpdateUser
                              id={item._id}
                              fetchData={() => fetchData()}
                              item={item}
                            />
                          </td>
                          <td style={{ width: 5 }}>
                            {item.isActive ? (
                              <DeactivateUser
                                id={item._id}
                                fetchData={() => fetchData()}
                                getAllUsers={() => getAllUsers()}
                              />
                            ) : (
                              <ActivateUser
                                getAllUsers={() => getAllUsers()}
                                id={item._id}
                                fetchData={() => fetchData()}
                              />
                            )}
                          </td>
                          <td>
                            {item.firstName}, {item.lastName}
                          </td>
                          <td style={{ width: "auto" }}>
                            {item.email}
                            <br />
                            {item.jobTitle}
                          </td>
                          <td style={{ width: 5 }}>
                            <button
                              className="btn btn-light extraInfoButton"
                              onClick={() => {
                                setShowPasswordModal(true);
                                openNewPassword(item);
                              }}
                            >
                              Reset Password
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>
                <Tab.Pane eventKey="inactive-users"  style={{ backgroundColor: "white" }}>
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
                      {inactiveUsers.map((item, index) => (
                        <tr key={index + "-" + "user"}>
                          <td style={{ width: 5 }}>
                            <UpdateUser
                              id={item._id}
                              fetchData={() => fetchData()}
                              item={item}
                            />
                          </td>
                          <td style={{ width: 5 }}>
                            {item.isActive ? (
                              <DeactivateUser
                                id={item._id}
                                fetchData={fetchData}
                              />
                            ) : (
                              <ActivateUser
                                id={item._id}
                                fetchData={fetchData}
                              />
                            )}
                          </td>
                          <td>
                            {item.firstName}, {item.lastName}
                          </td>
                          <td style={{ width: "auto" }}>
                            {item.email}
                            <br />
                            {item.jobTitle}
                          </td>
                          <td style={{ width: 5 }}>
                            <button
                              className="btn btn-light extraInfoButton"
                              onClick={() => {
                                setShowPasswordModal(true);
                                openNewPassword(item);
                              }}
                            >
                              Reset Password
                            </button>
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

      {/* Update Password Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      >
        <Modal.Header closeButton style={{ backgroundColor: "#fff" }}>
          <Modal.Title style={{ backgroundColor: "#fff" }}>
          Reset Password for {users.find(user => user._id === resetting)?.firstName}{" "}
      {users.find(user => user._id === resetting)?.lastName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#fff" }}>
          <div className={resetting !== null ? "flexNewPassword row" : "hideIt"}>
            <div className="form-group" style={{ margin: "5px" }}>
              <label className="control-label">New Password</label>
              <input
                onChange={handleFieldInput}
                className="form-control"
                id={"password-" + resetting}
                type="password"
                value={newPassword} 
                autoComplete="new-password" // Prevent autofill
              />
            </div>
            <div className="form-group" style={{ margin: "5px" }}>
              <label className="control-label">Re-enter New Password</label>
              <input
                onChange={handleFieldInput}
                id={"reenterpassword-" + resetting}
                className="form-control"
                type="password"
                value={newPassword2} // Set value to newPassword2 state
                autoComplete="new-password" // Prevent autofill
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#fff" }}>
          <button
             onClick={() => saveNewPassword(resetting)}
            className="btn btn-default"
          >
            Save
          </button>
          <button
            onClick={() => setShowPasswordModal(false, setResetting(null))}
            className="btn btn-default"
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageUsers;
