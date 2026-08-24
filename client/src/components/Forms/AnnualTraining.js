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
`;

const SmallColRightTitle = styled.div`
  width: 200px;
  text-align: center;
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

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const API_URL = `${API_BASE}/api/annualTraining`;

const fetchTrainingModal = async (homeId) => {
  return await Axios.get(`/api/annualTrainingMod/${homeId}`);
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

class AnnualTraining extends Component {
  constructor(props) {
    super(props);
    this.state = {
      T1: "",
      T2: "",
      T3: "",
      T4: "",
      T5: "",
      T6: "",
      T7: "",
      T8: "",
      T9: "",
      T10: "",
      T11: "",
      T12: "",
      T13: "",
      T14: "",
      T15: "",
      T16: "",
      T17: "",
      T18: "",
      T19: "",
      T20: "",
      T21: "",
      T22: "",
      T23: "",
      T24: "",
      T25: "",
      T26: "",
      T27: "",
      T28: "",
      T29: "",
      T30: "",
      T31: "",
      T32: "",

      // Expiration date fields
      T1Expiration: "",
      T2Expiration: "",
      T3Expiration: "",
      T4Expiration: "",
      T5Expiration: "",
      T6Expiration: "",
      T7Expiration: "",
      T8Expiration: "",
      T9Expiration: "",
      T10Expiration: "",
      T11Expiration: "",
      T12Expiration: "",
      T13Expiration: "",
      T14Expiration: "",
      T15Expiration: "",
      T16Expiration: "",
      T17Expiration: "",
      T18Expiration: "",
      T19Expiration: "",
      T20Expiration: "",
      T21Expiration: "",
      T22Expiration: "",
      T23Expiration: "",
      T24Expiration: "",
      T25Expiration: "",
      T26Expiration: "",
      T27Expiration: "",
      T28Expiration: "",
      T29Expiration: "",
      T30Expiration: "",
      T31Expiration: "",
      T32Expiration: "",

      // Track which expiration dates are being edited
      editingExpiration: {},

      // Certificate uploads storage (local preview)
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

      noModal: false,
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

  // Handler for certificate uploads - now uploads to server
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

    // Upload to server if we have a training ID
    if (this.state._id) {
      try {
        await this.uploadCertificateToServer(key, file);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload certificate");
        // Remove from local state on error
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

  submit = () => {
    // Clone state but exclude uploadedCertificates with File objects
    let currentState = JSON.parse(JSON.stringify(this.state));
    
    // Remove uploadedCertificates from submission (Files can't be JSON stringified)
    delete currentState.uploadedCertificates;
    delete currentState.editingExpiration;
    
    if (this.state.doUpdate) {
      Axios.put(`/api/annualTraining/${this.state._id}`, currentState)
        .then((res) => {
          console.log("training updated");
        })
        .catch((e) => {
          this.setState({
            formHasError: true,
            formErrorMessage: "Error Updating",
          });
        });
    } else {
      Axios.post("/api/annualTraining", currentState)
        .then((res) => {
          let { data } = res;
          this.setState({ ...data, doUpdate: true });
        })
        .catch((e) => {
          this.setState({
            formHasError: true,
            formErrorMessage: "Error Updating",
          });
        });
    }
  };

  setValues = () => {
    const { uploadedCertificates, editingExpiration, ...formValues } = this.props.formData;
    
    // Load certificates from database
    const certs = {};
    for (let i = 1; i <= 32; i++) {
      const certField = `T${i}Certificate`;
      if (this.props.formData[certField]) {
        certs[`T${i}`] = {
          ...this.props.formData[certField],
          _isLocal: false,
        };
      }
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
      console.log(data);
      if (data.length === 0) {
        this.setState({ ...this.state, noModal: true });
      } else {
        this.setState({ ...this.state, modal: data[0] });
        const rows = getEditRowsModal(data[0]);
        const hours = getHours(rows);
        this.setState({
          ...this.state,
          modal: data[0],
          hours,
          isLoading: false,
        });
      }
    } catch (e) {
      this.setState({ ...this.state, isLoading: false, error: true });
      alert("Error");
      console.log(e);
    }
  };

  getSubmission = async () => {
    try {
      await this.getModal();
      if (this.props.valuesSet) {
        this.setValues();
      } else {
        let { data } = await Axios.get(
          `/api/annualTraining/${this.props.userObj.homeId}/${this.props.userObj.email}`
        );
        if (data.length !== 0) {
          // Load certificates from database
          const certs = {};
          for (let i = 1; i <= 32; i++) {
            const certField = `T${i}Certificate`;
            if (data[0][certField]) {
              certs[`T${i}`] = {
                ...data[0][certField],
                _isLocal: false,
              };
            }
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

  // Helper function to render a training row
  renderTrainingRow = (num) => {
    const key = `T${num}`;
    const expirationKey = `${key}Expiration`;
    const isEditingExpiration = this.state.editingExpiration[expirationKey];
    const hasExpirationDate = this.state[expirationKey];
    const certificate = this.state.uploadedCertificates[key];

    return (
      <div className="form-group logInInputField d-flex" key={key}>
        <SmallCol className="control-label">
          {this.state.modal?.[`${key}Hours`]}
        </SmallCol>
        <div className="col text-center">
          <label className="control-label">
            {this.state.modal?.[`${key}Title`]}
          </label>
        </div>
        <div className="col text-center">
          <label className="control-label">
            {this.state.modal?.[`${key}Presenter`]}
          </label>
        </div>
        <SmallColRight>
          {this.state[key] ? (
            <div>
              <p>{`Completed ${new Date(
                this.state[key]
              ).toLocaleString()}`}</p>
              {!this.props.valuesSet && (
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    this.clearFieldInput(key);
                  }}
                >
                  Clear Completion
                </a>
              )}
            </div>
          ) : (
            <Form.Check
              type="checkbox"
              id={key}
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
            <span>{hasExpirationDate || "—"}</span>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
              {!hasExpirationDate || isEditingExpiration ? (
                <>
                  <input
                    type="date"
                    id={expirationKey}
                    value={this.state[expirationKey]}
                    onChange={this.handleExpirationChange}
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
                      onClick={() => this.disableExpirationEdit(expirationKey)}
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
                  <span style={{ fontWeight: "bold" }}>{this.state[expirationKey]}</span>
                  <button
                    type="button"
                    onClick={() => this.enableExpirationEdit(expirationKey)}
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
            <span>{certificate ? certificate.fileName : "No Certificate"}</span>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
              {!certificate ? (
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => this.handleCertificateUpload(e, key)}
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
                      onClick={() => this.removeCertificate(key)}
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
  };

  render() {
    return (
      <div className="formComp">
        <div className="formTitleDiv">
          <h2 className="formTitle">
            {this.state.modal?.displayName || "Annual Training"}
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
              <div className="col text-center">
                <label className="control-label">Training Topics</label>
              </div>
              <div className="col text-center">
                <label className="control-label">Presenter</label>
              </div>
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

            {/* Render all 32 training rows dynamically */}
            {Array.from({ length: 32 }, (_, i) => this.renderTrainingRow(i + 1))}

            <div className="form-group logInInputField d-flex border-top">
              <SmallCol className="control-label">
                <label>
                  {this.state.hours === "NaN" || isNaN(this.state.hours)
                    ? "∞"
                    : this.state.hours}
                </label>
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">Total Hours</label>
              </div>
              <SmallCol />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default AnnualTraining;