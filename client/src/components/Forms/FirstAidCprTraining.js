import React, { Component } from "react";
import "../../App.css";
import Axios from "axios";
import { Form } from "react-bootstrap";
import styled from "styled-components";
import ClipLoader from "react-spinners/ClipLoader";

const SmallCol = styled.div`
  width: 100px;
  text-align: center;
`;

const SmallColRight = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  text-align: center;
  margin-right: 20px;
`;

const SmallColRightTitle = styled.div`
  width: 200px;
  text-align: center;
  margin-right: 20px;
`;

const ExpirationCol = styled.div`
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-right: 20px;
`;

const ExpirationColTitle = styled.div`
  width: 150px;
  text-align: center;
  margin-right: 20px;
`;

const CertificateCol = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const CertificateColTitle = styled.div`
  width: 200px;
  text-align: center;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  margin: 20px 0;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  padding: 4px 12px;
  margin-left: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #c82333;
  }
`;

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const API_URL = `${API_BASE}/api/firstAidCprTraining`;

const fetchTrainingModal = async (homeId) => {
  return await Axios.get(`/api/firstAidCprTrainingMod/${homeId}`);
};

const getHours = (rows) => {
  return Reflect.ownKeys(rows).reduce((acc, cur) => {
    try {
      acc = acc + parseFloat(rows[cur].hours);
    } catch (e) {
      console.log("error row is not populated");
      acc = acc + 0;
    }
    return acc;
  }, 0);
};

const getEditRowsModal = (obj) => {
  const reducedObj = { ...obj };
  delete reducedObj.createdBy;
  delete reducedObj.createdByName;
  delete reducedObj.lastEditDate;
  delete reducedObj.formType;
  delete reducedObj.homeId;
  delete reducedObj.createDate;
  delete reducedObj._id;
  delete reducedObj.displayName;
  delete reducedObj.__v;

  return Reflect.ownKeys(reducedObj).reduce((acc, cur) => {
    const idx = cur.match(/\d+/g)[0];
    if (!acc.hasOwnProperty(`T${idx}`)) {
      acc[`T${idx}`] = {
        title: "",
        hours: "",
        presenter: "",
      };
    }

    if (cur.includes("Presenter")) {
      acc[`T${idx}`].presenter = reducedObj[cur];
    } else if (cur.includes("Title")) {
      acc[`T${idx}`].title = reducedObj[cur];
    } else {
      acc[`T${idx}`].hours = reducedObj[cur];
    }

    return acc;
  }, {});
};

class FirstAidCprTraining extends Component {
  constructor(props) {
    super(props);
    this.state = {
      T1: "",
      T1Expiration: "",

      // Custom training entries
      customEntries: [],

      // Track which expiration dates are being edited
      editingExpiration: {},
      editingCustomExpiration: {},

      // Certificate uploads storage
      uploadedCertificates: {},

      createdBy: this.props.valuesSet === true ? "" : this.props.userObj.email,

      createdByName:
        this.props.valuesSet === true
          ? ""
          : this.props.userObj.firstName + " " + this.props.userObj.lastName,

      lastEditDate: new Date(),

      homeId: this.props.valuesSet === true ? "" : this.props.userObj.homeId,

      doUpdate: false,

      modal: null,

      hours: 0,

      isLoading: true,
    };
  }

  handleFieldInput = async (event) => {
    const id = event.target.id;
    const cloneState = { ...this.state };
    cloneState[id] = new Date();
    await this.setState({ ...cloneState });
    this.submit();
  };

  clearFieldInput = async (id) => {
    const cloneState = { ...this.state };
    cloneState[id] = "";
    await this.setState({ ...cloneState });
    this.submit();
  };

  // Handler for expiration date changes
  handleExpirationChange = async (event) => {
    const id = event.target.id;
    const value = event.target.value;
    await this.setState({ [id]: value });
    this.submit();
  };

  // Enable editing for a specific expiration date
  enableExpirationEdit = (key) => {
    this.setState({
      editingExpiration: {
        ...this.state.editingExpiration,
        [key]: true,
      },
    });
  };

  // Disable editing for a specific expiration date (save)
  disableExpirationEdit = (key) => {
    this.setState({
      editingExpiration: {
        ...this.state.editingExpiration,
        [key]: false,
      },
    });
  };

  // Enable editing for a custom entry's expiration date
  enableCustomExpirationEdit = (id) => {
    this.setState({
      editingCustomExpiration: {
        ...this.state.editingCustomExpiration,
        [id]: true,
      },
    });
  };

  // Disable editing for a custom entry's expiration date (save)
  disableCustomExpirationEdit = (id) => {
    this.setState({
      editingCustomExpiration: {
        ...this.state.editingCustomExpiration,
        [id]: false,
      },
    });
  };

  // Handler for certificate uploads - uploads to server
  handleCertificateUpload = async (event, key) => {
    const file = event.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const uploaded = { ...this.state.uploadedCertificates };
    uploaded[key] = {
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      rawFile: file,
      _isLocal: true,
    };
    this.setState({ uploadedCertificates: uploaded });

    // If no training ID exists, create the record first
    if (!this.state._id) {
      console.log("No training record exists yet. Creating record first...");
      try {
        const response = await Axios.post("/api/firstAidCprTraining", {
          ...this.state,
          uploadedCertificates: undefined,
          editingExpiration: undefined,
          editingCustomExpiration: undefined,
        });
        
        await this.setState({ ...response.data, doUpdate: true });
        console.log("Training record created with ID:", response.data._id);
        
        await this.uploadCertificateToServer(key, file);
      } catch (error) {
        console.error("Failed to create training record:", error);
        alert("Failed to create training record before uploading certificate");
        const updated = { ...this.state.uploadedCertificates };
        delete updated[key];
        this.setState({ uploadedCertificates: updated });
      }
    } else {
      try {
        await this.uploadCertificateToServer(key, file);
      } catch (error) {
        console.error("Upload failed:", error);
        alert(`Failed to upload certificate: ${error.response?.data?.error || error.message}`);
        const updated = { ...this.state.uploadedCertificates };
        delete updated[key];
        this.setState({ uploadedCertificates: updated });
      }
    }
  };

  // Upload certificate to server
  uploadCertificateToServer = async (fieldName, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await Axios.post(
      `${API_URL}/upload/${this.state._id}/${fieldName}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Update local state with server response
    const uploaded = { ...this.state.uploadedCertificates };
    uploaded[fieldName] = {
      ...response.data.file,
      _isLocal: false,
    };
    this.setState({ uploadedCertificates: uploaded });

    return response.data.file;
  };

  // Remove certificate
  removeCertificate = async (key) => {
    const certificate = this.state.uploadedCertificates[key];
    
    // If it's a server file, delete from server
    if (certificate && !certificate._isLocal && this.state._id) {
      try {
        await Axios.delete(`${API_URL}/certificate/${this.state._id}/${key}`);
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete certificate");
        return;
      }
    }

    // Remove from local state
    const uploaded = { ...this.state.uploadedCertificates };
    delete uploaded[key];
    this.setState({ uploadedCertificates: uploaded });
  };

  // Handler for custom entry certificate uploads
  handleCustomCertificateUpload = async (event, entryId) => {
    const file = event.target.files[0];
    if (!file) return;

    // Update the custom entry with the certificate
    const updatedEntries = this.state.customEntries.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          certificate: {
            fileName: file.name,
            fileUrl: URL.createObjectURL(file),
            rawFile: file,
            _isLocal: true,
          },
        };
      }
      return entry;
    });

    this.setState({ customEntries: updatedEntries });

    // If we have a training ID, upload to server
    if (this.state._id) {
      try {
        await this.uploadCustomCertificateToServer(entryId, file);
      } catch (error) {
        console.error("Upload failed:", error);
        alert(`Failed to upload certificate: ${error.response?.data?.error || error.message}`);
        // Revert on error
        const revertedEntries = this.state.customEntries.map((entry) => {
          if (entry.id === entryId) {
            const { certificate, ...rest } = entry;
            return rest;
          }
          return entry;
        });
        this.setState({ customEntries: revertedEntries });
      }
    } else {
      // Create record first
      try {
        const response = await Axios.post("/api/firstAidCprTraining", {
          ...this.state,
          uploadedCertificates: undefined,
          editingExpiration: undefined,
          editingCustomExpiration: undefined,
        });
        
        await this.setState({ ...response.data, doUpdate: true });
        await this.uploadCustomCertificateToServer(entryId, file);
      } catch (error) {
        console.error("Failed to create training record:", error);
        alert("Failed to create training record before uploading certificate");
      }
    }
  };

  // Upload custom entry certificate to server
  uploadCustomCertificateToServer = async (entryId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await Axios.post(
      `${API_URL}/uploadCustom/${this.state._id}/${entryId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Update local state with server response
    const updatedEntries = this.state.customEntries.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          certificate: {
            ...response.data.file,
            _isLocal: false,
          },
        };
      }
      return entry;
    });

    this.setState({ customEntries: updatedEntries });

    return response.data.file;
  };

  // Remove custom entry certificate
  removeCustomCertificate = async (entryId) => {
    const entry = this.state.customEntries.find((e) => e.id === entryId);
    const certificate = entry?.certificate;

    // If it's a server file, delete from server
    if (certificate && !certificate._isLocal && this.state._id) {
      try {
        await Axios.delete(`${API_URL}/certificateCustom/${this.state._id}/${entryId}`);
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete certificate");
        return;
      }
    }

    // Remove from local state
    const updatedEntries = this.state.customEntries.map((e) => {
      if (e.id === entryId) {
        const { certificate, ...rest } = e;
        return rest;
      }
      return e;
    });

    this.setState({ customEntries: updatedEntries });
  };

  // Add new custom training entry
  addCustomEntry = () => {
    const newEntry = {
      id: Date.now(),
      hours: "",
      title: "",
      presenter: "",
      completed: null,
      expiration: "",
      certificate: null,
    };

    this.setState({
      customEntries: [...this.state.customEntries, newEntry],
    });
  };

  // Update custom entry field
  updateCustomEntry = (id, field, value) => {
    const updatedEntries = this.state.customEntries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );

    this.setState({ customEntries: updatedEntries }, () => {
      this.submit();
    });
  };

  // Mark custom entry as completed
  markCustomEntryComplete = (id) => {
    const updatedEntries = this.state.customEntries.map((entry) =>
      entry.id === id ? { ...entry, completed: new Date() } : entry
    );

    this.setState({ customEntries: updatedEntries }, () => {
      this.submit();
    });
  };

  // Clear custom entry completion
  clearCustomEntryCompletion = (id) => {
    const updatedEntries = this.state.customEntries.map((entry) =>
      entry.id === id ? { ...entry, completed: null } : entry
    );

    this.setState({ customEntries: updatedEntries }, () => {
      this.submit();
    });
  };

  // Delete custom entry
  deleteCustomEntry = async (id) => {
    // If there's a certificate, delete it first
    const entry = this.state.customEntries.find((e) => e.id === id);
    if (entry?.certificate) {
      await this.removeCustomCertificate(id);
    }

    const updatedEntries = this.state.customEntries.filter(
      (entry) => entry.id !== id
    );

    this.setState({ customEntries: updatedEntries }, () => {
      this.submit();
    });
  };

  // Calculate total hours including custom entries
  getTotalHours = () => {
    const baseHours = this.state.hours || 0;
    const customHours = this.state.customEntries.reduce((total, entry) => {
      return total + (parseFloat(entry.hours) || 0);
    }, 0);
    return baseHours + customHours;
  };

  submit = () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    // Remove non-serializable fields
    delete currentState.editingExpiration;
    delete currentState.editingCustomExpiration;
    delete currentState.uploadedCertificates;
    
    // Clean up custom entries - remove File objects
    if (currentState.customEntries) {
      currentState.customEntries = currentState.customEntries.map(entry => {
        if (entry.certificate && entry.certificate.rawFile) {
          const { rawFile, ...certWithoutFile } = entry.certificate;
          return { ...entry, certificate: certWithoutFile };
        }
        return entry;
      });
    }
    
    if (this.state.doUpdate) {
      Axios.put(`/api/firstAidCprTraining/${this.state._id}`, currentState)
        .then((res) => {
          console.log("training updated");
        })
        .catch((e) => {
          console.error("Error updating:", e);
          this.setState({
            formHasError: true,
            formErrorMessage: "Error Updating",
          });
        });
    } else {
      Axios.post("/api/firstAidCprTraining", currentState)
        .then((res) => {
          let { data } = res;
          this.setState({ ...data, doUpdate: true });
        })
        .catch((e) => {
          console.error("Error creating:", e);
          this.setState({
            formHasError: true,
            formErrorMessage: "Error Creating",
          });
        });
    }
  };

  setValues = () => {
    const { editingExpiration, editingCustomExpiration, uploadedCertificates, ...formValues } = this.props.formData;
    
    // Load T1 certificate from database
    const certs = {};
    if (this.props.formData.T1Certificate) {
      certs.T1 = {
        ...this.props.formData.T1Certificate,
        _isLocal: false,
      };
    }
    
    this.setState({ 
      ...this.state, 
      ...formValues,
      uploadedCertificates: certs,
    });
  };

  getModal = async () => {
    try {
      this.setState({ ...this.state, isLoading: true });
      const { data } = await fetchTrainingModal(this.props.userObj.homeId);
      this.setState({ ...this.state, modal: data[0] });
      const rows = getEditRowsModal(data[0]);
      const hours = getHours(rows);
      this.setState({ ...this.state, modal: data[0], hours, isLoading: false });
    } catch (e) {
      alert("Error");
      console.log(e);
      this.setState({ ...this.state, isLoading: false });
    }
  };

  getSubmission = async () => {
    try {
      await this.getModal();
      if (this.props.valuesSet) {
        this.setValues();
      } else {
        let { data } = await Axios.get(
          `/api/firstAidCprTraining/${this.props.userObj.homeId}/${this.props.userObj.email}`
        );
        if (data.length !== 0) {
          // Load T1 certificate from database
          const certs = {};
          if (data[0].T1Certificate) {
            certs.T1 = {
              ...data[0].T1Certificate,
              _isLocal: false,
            };
          }
          
          this.setState({ 
            ...data[0], 
            doUpdate: true, 
            isLoading: false,
            uploadedCertificates: certs,
          });
        }
        this.setState({ ...this.state, isLoading: false });
      }
    } catch (e) {
      alert(e);
    }
  };

  componentDidMount() {
    this.getSubmission();
  }

  render() {
    const totalHours = this.getTotalHours();
    const isEditingT1Expiration = this.state.editingExpiration["T1Expiration"];
    const hasT1ExpirationDate = this.state.T1Expiration;
    const t1Certificate = this.state.uploadedCertificates?.T1;

    console.log("=== FirstAidCprTraining Render ===");
    console.log("valuesSet:", this.props.valuesSet);
    console.log("customEntries:", this.state.customEntries);
    console.log("isLoading:", this.state.isLoading);

    return (
      <div className="formComp">
        <div className="formTitleDiv">
          <h2 className="formTitle">
            {this.state.modal?.displayName || "First Aid / CPR Training"}
          </h2>
        </div>
        {this.state.isLoading ? (
          <div className="formLoadingDiv">
            <div>
              <ClipLoader className="formSpinner" size={50} color={"#ffc107"} />
            </div>

            <p>Loading...</p>
          </div>
        ) : (
          <div className="formFieldsMobile">
            <div className="form-group logInInputField d-flex border-bottom">
              <SmallCol className="control-label">
                <label>Hours</label>
              </SmallCol>
              <SmallColRightTitle>
                <label>Completion</label>
              </SmallColRightTitle>
              <ExpirationColTitle>
                <label className="control-label">Expiration Date</label>
              </ExpirationColTitle>
              <CertificateColTitle>
                <label className="control-label">Certificate</label>
              </CertificateColTitle>
            </div>

            {/* Original T1 Entry */}
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal?.T1Hours}
              </SmallCol>
              <SmallColRight>
                {this.state.T1 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T1
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T1");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T1"
                    disabled={this.props.valuesSet}
                    className="mb-2 d-flex align-items-center"
                    label={
                      this.props.valuesSet
                        ? "Not Completed"
                        : "Mark as completed"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </SmallColRight>
              <ExpirationCol>
                {this.props.valuesSet ? (
                  <span>{hasT1ExpirationDate || "—"}</span>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                    {!hasT1ExpirationDate || isEditingT1Expiration ? (
                      <>
                        <input
                          type="date"
                          id="T1Expiration"
                          value={this.state.T1Expiration}
                          onChange={this.handleExpirationChange}
                          style={{
                            padding: "4px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            width: "100%",
                          }}
                        />
                        {hasT1ExpirationDate && isEditingT1Expiration && (
                          <button
                            type="button"
                            onClick={() => this.disableExpirationEdit("T1Expiration")}
                            style={{
                              padding: "4px 8px",
                              fontSize: "12px",
                              borderRadius: "4px",
                              border: "1px solid #28a745",
                              backgroundColor: "#28a745",
                              color: "white",
                              cursor: "pointer",
                            }}
                          >
                            Save
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <span style={{ fontWeight: "bold" }}>{this.state.T1Expiration}</span>
                        <button
                          type="button"
                          onClick={() => this.enableExpirationEdit("T1Expiration")}
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            borderRadius: "4px",
                            border: "1px solid #007bff",
                            backgroundColor: "#007bff",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                )}
              </ExpirationCol>
              <CertificateCol>
                {this.props.valuesSet ? (
                  t1Certificate ? (
                    <a
                      href={t1Certificate._isLocal ? t1Certificate.fileUrl : `${API_BASE}${t1Certificate.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "12px", color: "#007bff" }}
                    >
                      View Certificate
                    </a>
                  ) : (
                    <span>—</span>
                  )
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                    {!t1Certificate ? (
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={(e) => this.handleCertificateUpload(e, "T1")}
                        style={{
                          padding: "4px",
                          fontSize: "12px",
                        }}
                      />
                    ) : (
                      <>
                        <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                          {t1Certificate.fileName}
                        </div>
                        <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                          <a
                            href={t1Certificate._isLocal ? t1Certificate.fileUrl : `${API_BASE}${t1Certificate.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              padding: "4px 8px",
                              fontSize: "12px",
                              borderRadius: "4px",
                              border: "1px solid #007bff",
                              backgroundColor: "#007bff",
                              color: "white",
                              textDecoration: "none",
                              display: "inline-block",
                            }}
                          >
                            View
                          </a>
                          <button
                            type="button"
                            onClick={() => this.removeCertificate("T1")}
                            style={{
                              padding: "4px 8px",
                              fontSize: "12px",
                              borderRadius: "4px",
                              border: "1px solid #dc3545",
                              backgroundColor: "#dc3545",
                              color: "white",
                              cursor: "pointer",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CertificateCol>
            </div>

            {/* Custom Entries */}
            {this.state.customEntries.map((entry) => {
              const hasRequiredData = entry.hours;
              const isEditingExpiration = this.state.editingCustomExpiration[entry.id];
              const hasExpirationDate = entry.expiration;
              const certificate = entry.certificate;

              return (
                <div
                  key={entry.id}
                  className="form-group logInInputField d-flex"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <SmallCol className="control-label">
                    {this.props.valuesSet ? (
                      <span>{entry.hours}</span>
                    ) : (
                      <input
                        type="number"
                        step="0.5"
                        value={entry.hours}
                        onChange={(e) =>
                          this.updateCustomEntry(entry.id, "hours", e.target.value)
                        }
                        style={{
                          width: "80px",
                          padding: "4px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                        placeholder="Hours"
                      />
                    )}
                  </SmallCol>
                  <SmallColRight>
                    {entry.completed ? (
                      <div>
                        <p>{`Completed ${new Date(
                          entry.completed
                        ).toLocaleString()}`}</p>
                        {!this.props.valuesSet && (
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.clearCustomEntryCompletion(entry.id)}
                          >
                            Clear Completion
                          </a>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {hasRequiredData && !this.props.valuesSet ? (
                          <Form.Check
                            type="checkbox"
                            className="mb-2 d-flex align-items-center"
                            label="Mark as completed"
                            onChange={() => this.markCustomEntryComplete(entry.id)}
                          />
                        ) : this.props.valuesSet ? (
                          <span>Not Completed</span>
                        ) : (
                          <span style={{ color: "#6c757d", fontSize: "14px" }}>
                            Enter hours to mark complete
                          </span>
                        )}
                        {!this.props.valuesSet && (
                          <DeleteButton
                            onClick={() => this.deleteCustomEntry(entry.id)}
                          >
                            Delete
                          </DeleteButton>
                        )}
                      </div>
                    )}
                  </SmallColRight>
                  <ExpirationCol>
                    {this.props.valuesSet ? (
                      <span>{hasExpirationDate || "—"}</span>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                        {!hasExpirationDate || isEditingExpiration ? (
                          <>
                            <input
                              type="date"
                              value={entry.expiration}
                              onChange={(e) =>
                                this.updateCustomEntry(entry.id, "expiration", e.target.value)
                              }
                              style={{
                                padding: "4px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                width: "100%",
                              }}
                            />
                            {hasExpirationDate && isEditingExpiration && (
                              <button
                                type="button"
                                onClick={() => this.disableCustomExpirationEdit(entry.id)}
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "12px",
                                  borderRadius: "4px",
                                  border: "1px solid #28a745",
                                  backgroundColor: "#28a745",
                                  color: "white",
                                  cursor: "pointer",
                                }}
                              >
                                Save
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <span style={{ fontWeight: "bold" }}>{entry.expiration}</span>
                            <button
                              type="button"
                              onClick={() => this.enableCustomExpirationEdit(entry.id)}
                              style={{
                                padding: "4px 8px",
                                fontSize: "12px",
                                borderRadius: "4px",
                                border: "1px solid #007bff",
                                backgroundColor: "#007bff",
                                color: "white",
                                cursor: "pointer",
                              }}
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </ExpirationCol>
                  <CertificateCol>
                    {this.props.valuesSet ? (
                      certificate ? (
                        <a
                          href={certificate._isLocal ? certificate.fileUrl : `${API_BASE}${certificate.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: "12px", color: "#007bff" }}
                        >
                          View Certificate
                        </a>
                      ) : (
                        <span>—</span>
                      )
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                        {!certificate ? (
                          <input
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={(e) => this.handleCustomCertificateUpload(e, entry.id)}
                            style={{
                              padding: "4px",
                              fontSize: "12px",
                            }}
                          />
                        ) : (
                          <>
                            <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                              {certificate.fileName}
                            </div>
                            <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                              <a
                                href={certificate._isLocal ? certificate.fileUrl : `${API_BASE}${certificate.fileUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "12px",
                                  borderRadius: "4px",
                                  border: "1px solid #007bff",
                                  backgroundColor: "#007bff",
                                  color: "white",
                                  textDecoration: "none",
                                  display: "inline-block",
                                }}
                              >
                                View
                              </a>
                              <button
                                type="button"
                                onClick={() => this.removeCustomCertificate(entry.id)}
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "12px",
                                  borderRadius: "4px",
                                  border: "1px solid #dc3545",
                                  backgroundColor: "#dc3545",
                                  color: "white",
                                  cursor: "pointer",
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </CertificateCol>
                </div>
              );
            })}

            {/* Add Entry Button */}
            {!this.props.valuesSet && (
              <div style={{ textAlign: "center", margin: "20px 0" }}>
                <AddButton onClick={this.addCustomEntry}>
                  + Add New Training
                </AddButton>
              </div>
            )}

            <div className="form-group logInInputField d-flex border-top">
              <SmallCol className="control-label">
                <label>{isNaN(totalHours) ? "∞" : totalHours}</label>
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">Total Hours</label>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default FirstAidCprTraining;
