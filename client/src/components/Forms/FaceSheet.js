import React, { Component } from "react";
import FormError from "../FormMods/FormError";
import FormAlert from "../Forms/FormAlert";
import FormActionButtons from "../Common/FormActionButtons";
import { Form, Col } from "react-bootstrap";
import "../../App.css";
import Axios from "axios";
import { canEditFaceSheet } from "../../utils/FaceSheetEditRoles";

class FaceSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childMeta_photo: "",
      childMeta_name: "",
      childMeta_gender: "",
      childMeta_dob: "",
      childMeta_age: "",
      childMeta_religion: "",
      childMeta_ethnicity: "",
      childMeta_dateOfAdmission: "",
      childMeta_dischargeDate: "",
      childMeta_typeOfStay: "",
      childMeta_medicaidNumber: "",
      childMeta_cpsNumber: "",
      childMeta_ssn: "",
      childMeta_caseWorker: "",
      childMeta_caseWorkerPONumber: "",
      childMeta_referralAgency: "",
      childMeta_referralDate: "",
      childMeta_levelOfCare: "",
      childMeta_levelOfCareOther: "",
      childMeta_region: "",
      childMeta_county: "",
      childMeta_streetAddress: "",
      childMeta_state: "",
      childMeta_city: "",
      childMeta_zipcode: "",
      childMeta_placeOfBirth_streetAddress: "",
      childMeta_placeOfBirth_state: "",
      childMeta_placeOfBirth_city: "",
      childMeta_placeOfBirth_zipcode: "",
      food1: "",
      noFoodAllergies: false,
      drugAllergies: "",
      noDrugAllergies: false,
      allergies: "",
      noKnownAllergies: false,
      chronicHealthConditions: "",

      createdBy: this.props.valuesSet === true ? "" : this.props.userObj.email,

      createdByName:
        this.props.valuesSet === true
          ? ""
          : this.props.userObj.firstName + " " + this.props.userObj.lastName,

      lastEditDate: new Date(),

      homeId: this.props.valuesSet === true ? "" : this.props.userObj.homeId,

      formHasError: false,

      formSubmitted: false,

      formErrorMessage: "",
    };
  }

  toggleSuccessAlert = () => {
    this.setState({ formSubmitted: !this.state.formSubmitted });
  };

  toggleErrorAlert = () => {
    this.setState({
      formHasError: !this.state.formHasError,
      formErrorMessage: "",
    });
  };

  handleFieldInput = (event) => {
    var stateObj = {};
    if (event.target.id.indexOf(".") > -1) {
      let level1Obj = event.target.id.split(".")[0];
      let level2Obj = event.target.id.split(".")[1];

      let nestedProperty = { ...this.state[level1Obj] };
      nestedProperty[level2Obj] = event.target.value;
      stateObj[level1Obj] = nestedProperty;
    } else {
      stateObj[event.target.id] = event.target.value;
    }
    this.setState(stateObj);
  };

  handleNoAllergiesToggle = (event) => {
    const { id, checked } = event.target;
    const textFieldByCheckboxId = {
      noFoodAllergies: "food1",
      noDrugAllergies: "drugAllergies",
      noKnownAllergies: "allergies",
    };
    this.setState({
      [id]: checked,
      ...(checked ? { [textFieldByCheckboxId[id]]: "" } : {}),
    });
  };

  resetForm = () => {
    this.setState({
      childMeta_photo: "",
      childMeta_name: "",
      childMeta_gender: "",
      childMeta_dob: "",
      childMeta_age: "",
      childMeta_religion: "",
      childMeta_ethnicity: "",
      childMeta_dateOfAdmission: "",
      childMeta_dischargeDate: "",
      childMeta_typeOfStay: "",
      childMeta_medicaidNumber: "",
      childMeta_cpsNumber: "",
      childMeta_ssn: "",
      childMeta_caseWorker: "",
      childMeta_caseWorkerPONumber: "",
      childMeta_referralAgency: "",
      childMeta_referralDate: "",
      childMeta_levelOfCare: "",
      childMeta_levelOfCareOther: "",
      childMeta_region: "",
      childMeta_county: "",
      childMeta_streetAddress: "",
      childMeta_state: "",
      childMeta_city: "",
      childMeta_zipcode: "",
      childMeta_placeOfBirth_streetAddress: "",
      childMeta_placeOfBirth_state: "",
      childMeta_placeOfBirth_city: "",
      childMeta_placeOfBirth_zipcode: "",
      food1: "",
      noFoodAllergies: false,
      drugAllergies: "",
      noDrugAllergies: false,
      allergies: "",
      noKnownAllergies: false,
      chronicHealthConditions: "",
    });
  };

  submit = () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    // identifies who is making the request, so the backend can verify
    // Face Sheet edit permission (see routes/api/client.js)
    currentState.actingUserEmail = this.props.userObj?.email;
    if (this.props.valuesSet) {
      Axios.put(
        `/api/client/${this.state.homeId}/${this.state._id}`,
        currentState
      )
        .then((res) => {
          window.scrollTo(0, 0);
          this.toggleSuccessAlert();
          setTimeout(this.toggleSuccessAlert, 3000);
        })
        .catch((e) => {
          this.setState({
            formHasError: true,
            formErrorMessage:
              e.response?.data?.message || "Error Submitting Face Sheet",
          });
        });
    } else {
      Axios.post("/api/client", currentState)
        .then((res) => {
          window.scrollTo(0, 0);
          this.toggleSuccessAlert();
          setTimeout(this.toggleSuccessAlert, 3000);
          this.resetForm();
        })
        .catch((e) => {
          this.setState({
            formHasError: true,
            formErrorMessage:
              e.response?.data?.message || "Error Submitting Face Sheet",
          });
        });
    }
  };

  validateForm = () => {
    const requiredFields = [
      { key: "childMeta_name", label: "Child's Name" },
      { key: "childMeta_dob", label: "Date of Birth" },
      { key: "childMeta_dateOfAdmission", label: "Date of Admission" },
      { key: "childMeta_caseWorker", label: "Case Worker Name" },
    ];

    const errorFields = requiredFields
      .filter(
        ({ key }) =>
          !this.state[key] || /^\s+$/.test(this.state[key])
      )
      .map(({ label }) => label);

    // allergy fields: satisfied by either the "none known" checkbox or free text
    if (!this.state.noFoodAllergies && !this.state.food1.trim()) {
      errorFields.push(
        "Food Allergies (enter allergies or check 'No known food allergies')"
      );
    }
    if (!this.state.noDrugAllergies && !this.state.drugAllergies.trim()) {
      errorFields.push(
        "Medicine Allergies (enter allergies or check 'No known drug allergies')"
      );
    }
    if (!this.state.noKnownAllergies && !this.state.allergies.trim()) {
      errorFields.push(
        "Other Allergies (enter allergies or check 'No known allergies')"
      );
    }

    if (errorFields.length > 0) {
      this.setState({
        formHasError: true,
        formErrorMessage: `Please complete the following field(s): ${errorFields.join(
          "\n"
        )}`,
      });
      return;
    }

    this.submit();
  };

  setValues = () => {
    this.setState({ ...this.state, ...this.props.formData });
  };

  componentDidMount() {
    if (this.props.valuesSet) {
      this.setValues();
    }
  }

  handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({childMeta_photo: reader.result});
    };
    reader.readAsDataURL(file);
  };

  handlePrint = () => {
    window.print();
  };

  handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this face sheet? This cannot be undone.")) {
      Axios.delete(
        `/api/client/${this.state.homeId}/${this.state._id}?actingUserEmail=${encodeURIComponent(
          this.props.userObj?.email || ""
        )}`
      )
        .then(() => {
          alert("Face sheet deleted successfully");
          // Navigate back or refresh the list
          window.location.reload();
        })
        .catch((e) => {
          console.error(e);
          alert(e.response?.data?.message || "Error deleting face sheet");
        });
    }
  };

  render() {
    const canEdit = canEditFaceSheet(this.props.userObj);
    if (!this.props.valuesSet) {
      return (
        <div className="formComp">
          {this.state.formSubmitted || this.state.formHasError ? (
            <React.Fragment>
              <FormAlert
                doShow={this.state.formSubmitted}
                type="success"
                heading="Thank you for your submission!"
              ></FormAlert>
              <FormAlert
                doShow={this.state.formHasError}
                toggleErrorAlert={this.toggleErrorAlert}
                type="danger"
                heading="Error Submitting form"
              >
                <p>{this.state.formErrorMessage}</p>
              </FormAlert>
            </React.Fragment>
          ) : (
            <React.Fragment />
          )}
          <div className="formTitleDiv">
            <h2 className="formTitle">Face Sheet</h2>
          </div>
          <div className="formFieldsMobile">
            {!canEdit && (
              <p style={{ color: "maroon", fontStyle: "italic" }}>
                Your role does not have permission to edit the Face Sheet.
                Viewing in read-only mode.
              </p>
            )}
            <fieldset
              disabled={!canEdit}
              style={{ border: "none", margin: 0, padding: 0 }}
            >
            <div className="form-group logInInputField" style={{display:"flex", flexDirection:"column"}}>
              <label className="control-label">Upload Child Photo</label>
               <button
                  type="button"
                  onClick={() => document.getElementById("childPhotoUpload").click()}
                  style={{
                    padding: "10px 15px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: "#f8f8f8",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Choose File
                </button>

                <input
                  type="file"
                  accept="image/*"
                  id="childPhotoUpload"
                  onChange={this.handlePhotoUpload}
                  style={{ display: "none" }}
                />
            </div>
            {this.state.childMeta_photo && (
              <div style={{marginBottom:"15px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:'center'}}>
                <img
                  src={this.state.childMeta_photo}
                  alt="Child"
                  style={{
                    width:"150px",
                    height:"150px",
                    objectFit:"cover",
                    borderRadius:"10px",
                    border:"1px solid #ccc",
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    this.setState({childMeta_photo: ""});
                    document.getElementById("childPhotoUpload").value = null
                  }}
                  style={{
                    marginTop:"10px",
                    padding:"5px 10px",
                    borderRadius:"6px",
                    border:"1px solid #ccc",
                    backgroundColor:"#f8f8f8",
                    cursor:"pointer",
                    fontSize:"12px"
                  }}
                >
                  Remove Photo
                </button>
              </div>
            )}
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Name <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_name"
                value={this.state.childMeta_name}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Gender</label>{" "}
              <Form.Control
                as="select"
                onChange={this.handleFieldInput}
                value={this.state.childMeta_gender}
                id="childMeta_gender"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option value={""}>Choose</option>
              </Form.Control>
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Date of Birth <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_dob"
                value={this.state.childMeta_dob}
                className="form-control"
                type="date"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Age</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_age"
                value={this.state.childMeta_age}
                className="form-control"
                type="number"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Religion</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_religion"
                value={this.state.childMeta_religion}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Ethnicity</label>{" "}
              <Form.Control
                as="select"
                onChange={this.handleFieldInput}
                value={this.state.childMeta_ethnicity}
                id="childMeta_ethnicity"
              >
                <option>Black</option>
                <option>White</option>
                <option>Hispanic</option>
                <option>Asian</option>
                <option>Pacific Islander</option>
                <option>Native American</option>
                <option>Other</option>
                <option value={""}>Choose</option>
              </Form.Control>
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Date of Admission <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_dateOfAdmission"
                value={this.state.childMeta_dateOfAdmission}
                className="form-control"
                type="date"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Discharge Date</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_dischargeDate"
                value={this.state.childMeta_dischargeDate}
                className="form-control"
                type="date"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Type of Stay</label>{" "}
              <Form.Control
                as="select"
                onChange={this.handleFieldInput}
                value={this.state.childMeta_typeOfStay}
                id="childMeta_typeOfStay"
              >
                <option>Emergency</option>
                <option>24 hour</option>
                <option>14 days</option>
                <option>30 days</option>
                <option value={""}>Choose</option>
              </Form.Control>
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Medicaid Number</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_medicaidNumber"
                value={this.state.childMeta_medicaidNumber}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">CPS Number</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_cpsNumber"
                value={this.state.childMeta_cpsNumber}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">SSN</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_ssn"
                value={this.state.childMeta_ssn}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Case Worker Name <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_caseWorker"
                value={this.state.childMeta_caseWorker}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Case Worker / PO Phone Number
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_caseWorkerPONumber"
                value={this.state.childMeta_caseWorkerPONumber}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Referral Entity / Agency</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_referralAgency"
                value={this.state.childMeta_referralAgency}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Referral Date</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_referralDate"
                value={this.state.childMeta_referralDate}
                className="form-control"
                type="date"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Level of Care</label>{" "}
              <Form.Control
                as="select"
                onChange={this.handleFieldInput}
                value={this.state.childMeta_levelOfCare}
                id="childMeta_levelOfCare"
              >
                <option>Basic</option>
                <option>Moderate</option>
                <option>Specialized</option>
                <option>Intense</option>
                <option>Intense-plus</option>
                <option>Other</option>
                <option value={""}>Choose</option>
              </Form.Control>
              {this.state.childMeta_levelOfCare === "Other" && (
                <input
                  onChange={this.handleFieldInput}
                  id="childMeta_levelOfCareOther"
                  value={this.state.childMeta_levelOfCareOther}
                  className="form-control mt-2"
                  type="text"
                  placeholder="Please specify level of care"
                />
              )}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Region</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_region"
                value={this.state.childMeta_region}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">County</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_county"
                value={this.state.childMeta_county}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Street Address</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_streetAddress"
                value={this.state.childMeta_streetAddress}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">State</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_state"
                value={this.state.childMeta_state}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">City</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_city"
                value={this.state.childMeta_city}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Zip Code</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_zipcode"
                value={this.state.childMeta_zipcode}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Place of Birth - Street Address
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_placeOfBirth_streetAddress"
                value={this.state.childMeta_placeOfBirth_streetAddress}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Place of Birth - State
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_placeOfBirth_state"
                value={this.state.childMeta_placeOfBirth_state}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Place of Birth - City
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_placeOfBirth_city"
                value={this.state.childMeta_placeOfBirth_city}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Place of Birth - Zip Code
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_placeOfBirth_zipcode"
                value={this.state.childMeta_placeOfBirth_zipcode}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Food Allergies <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <textarea
                onChange={this.handleFieldInput}
                id="food1"
                value={this.state.food1}
                className="form-control"
                type="text"
                disabled={this.state.noFoodAllergies}
              ></textarea>
              <Form.Check
                type="checkbox"
                id="noFoodAllergies"
                label="No known food allergies"
                checked={this.state.noFoodAllergies}
                onChange={this.handleNoAllergiesToggle}
                className="mt-1 d-flex align-items-center"
              />
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Medicine Allergies <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <textarea
                onChange={this.handleFieldInput}
                id="drugAllergies"
                value={this.state.drugAllergies}
                className="form-control"
                type="text"
                disabled={this.state.noDrugAllergies}
              ></textarea>
              <Form.Check
                type="checkbox"
                id="noDrugAllergies"
                label="No known drug allergies"
                checked={this.state.noDrugAllergies}
                onChange={this.handleNoAllergiesToggle}
                className="mt-1 d-flex align-items-center"
              />
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Other Allergies <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <textarea
                onChange={this.handleFieldInput}
                id="allergies"
                value={this.state.allergies}
                className="form-control"
                type="text"
                disabled={this.state.noKnownAllergies}
              ></textarea>
              <Form.Check
                type="checkbox"
                id="noKnownAllergies"
                label="No known allergies"
                checked={this.state.noKnownAllergies}
                onChange={this.handleNoAllergiesToggle}
                className="mt-1 d-flex align-items-center"
              />
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Chronic Conditions</label>{" "}
              <textarea
                onChange={this.handleFieldInput}
                id="chronicHealthConditions"
                value={this.state.chronicHealthConditions}
                className="form-control"
                type="text"
              ></textarea>
            </div>

            <FormError errorId={this.props.id + "-error"} />
            <div
              className="form-group logInInputField"
              style={{ textAlign: "right" }}
            >
              <button className="darkBtn" onClick={this.validateForm}>
                Submit
              </button>
            </div>
            </fieldset>
          </div>
        </div>
      );
    } else {
      return (
        <div className="formComp">
          {this.state.formSubmitted || this.state.formHasError ? (
            <React.Fragment>
              <FormAlert
                doShow={this.state.formSubmitted}
                type="success"
                heading="Thank you for your submission!"
              ></FormAlert>
              <FormAlert
                doShow={this.state.formHasError}
                toggleErrorAlert={this.toggleErrorAlert}
                type="danger"
                heading="Error Submitting form"
              >
                <p>{this.state.formErrorMessage}</p>
              </FormAlert>
            </React.Fragment>
          ) : (
            <React.Fragment />
          )}
          
          {/* FormActionButtons with 15px padding - hidden in print */}
          <div style={{ padding: "15px" }} className="no-print">
            <FormActionButtons
              onPrint={this.handlePrint}
              onDelete={this.handleDelete}
              showDelete={this.props.userObj?.role === "admin"}
            />
          </div>

          <div className="formTitleDivReport">
            <h2 className="formTitle">Face Sheet</h2>
          </div>
          <div className="formFieldsMobileReport">
            {!canEdit && (
              <p style={{ color: "maroon", fontStyle: "italic" }}>
                Your role does not have permission to edit the Face Sheet.
                Viewing in read-only mode.
              </p>
            )}
            <fieldset
              disabled={!canEdit}
              style={{ border: "none", margin: 0, padding: 0 }}
            >
            <div className="form-group logInInputField" style={{ display: "flex", flexDirection: "column", }}>
              <label className="control-label">Upload Child Photo</label>
              <button
                type="button"
                onClick={() => document.getElementById("childPhotoUpload").click()}
                style={{
                    padding: "10px 15px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: "#f8f8f8",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
              >
                {this.state.childMeta_photo ? "Change Photo" : "Upload Photo"}
              </button>
              <input
                type="file"
                accept="image/*"
                id="childPhotoUpload"
                onChange={this.handlePhotoUpload}
                style={{ display: "none" }}
              />
              {this.state.childMeta_photo && (
                <div style={{ marginTop: "10px", textAlign: "center", display:"flex", flexDirection:"column", alignItems:'center' }}>
                  <img
                    src={this.state.childMeta_photo}
                    alt="Child"
                    style={{
                      width:"150px",
                      height:"150px",
                      objectFit:"cover",
                      borderRadius:"10px",
                      border:"1px solid #ccc",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      this.setState({childMeta_photo: ""});
                      document.getElementById("childPhotoUpload").value = null
                    }}
                    style={{
                      marginTop:"10px",
                      padding:"5px 10px",
                      borderRadius:"6px",
                      border:"1px solid #ccc",
                      backgroundColor:"#f8f8f8",
                      cursor:"pointer",
                      fontSize:"12px"
                    }}
                  >
                    Remove Photo
                  </button>
                </div>
              )}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Name <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_name"
                value={this.state.childMeta_name}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Gender</label>{" "}
              <Form.Control
                as="select"
                onChange={this.handleFieldInput}
                value={this.state.childMeta_gender}
                id="childMeta_gender"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option value={""}>Choose</option>
              </Form.Control>
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Date of Birth <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_dob"
                value={this.state.childMeta_dob}
                className="form-control"
                type="date"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Age</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_age"
                value={this.state.childMeta_age}
                className="form-control"
                type="number"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Religion</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_religion"
                value={this.state.childMeta_religion}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Ethnicity</label>{" "}
              <Form.Control
                as="select"
                onChange={this.handleFieldInput}
                value={this.state.childMeta_ethnicity}
                id="childMeta_ethnicity"
              >
                <option>Black</option>
                <option>White</option>
                <option>Hispanic</option>
                <option>Asian</option>
                <option>Pacific Islander</option>
                <option>Native American</option>
                <option>Other</option>
                <option value={""}>Choose</option>
              </Form.Control>
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Date of Admission <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_dateOfAdmission"
                value={this.state.childMeta_dateOfAdmission}
                className="form-control"
                type="date"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Discharge Date</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_dischargeDate"
                value={this.state.childMeta_dischargeDate}
                className="form-control"
                type="date"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Type of Stay</label>{" "}
              <Form.Control
                as="select"
                onChange={this.handleFieldInput}
                value={this.state.childMeta_typeOfStay}
                id="childMeta_typeOfStay"
              >
                <option>Emergency</option>
                <option>24 hour</option>
                <option>14 days</option>
                <option>30 days</option>
                <option value={""}>Choose</option>
              </Form.Control>
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Medicaid Number</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_medicaidNumber"
                value={this.state.childMeta_medicaidNumber}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">CPS Number</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_cpsNumber"
                value={this.state.childMeta_cpsNumber}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">SSN</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_ssn"
                value={this.state.childMeta_ssn}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Case Worker Name <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_caseWorker"
                value={this.state.childMeta_caseWorker}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Case Worker / PO Phone Number
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_caseWorkerPONumber"
                value={this.state.childMeta_caseWorkerPONumber}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Referral Entity / Agency</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_referralAgency"
                value={this.state.childMeta_referralAgency}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Referral Date</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_referralDate"
                value={this.state.childMeta_referralDate}
                className="form-control"
                type="date"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Level of Care</label>{" "}
              <Form.Control
                as="select"
                onChange={this.handleFieldInput}
                value={this.state.childMeta_levelOfCare}
                id="childMeta_levelOfCare"
              >
                <option>Basic</option>
                <option>Moderate</option>
                <option>Specialized</option>
                <option>Intense</option>
                <option>Intense-plus</option>
                <option>Other</option>
                <option value={""}>Choose</option>
              </Form.Control>
              {this.state.childMeta_levelOfCare === "Other" && (
                <input
                  onChange={this.handleFieldInput}
                  id="childMeta_levelOfCareOther"
                  value={this.state.childMeta_levelOfCareOther}
                  className="form-control mt-2"
                  type="text"
                  placeholder="Please specify level of care"
                />
              )}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Region</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_region"
                value={this.state.childMeta_region}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">County</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_county"
                value={this.state.childMeta_county}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Street Address</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_streetAddress"
                value={this.state.childMeta_streetAddress}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">State</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_state"
                value={this.state.childMeta_state}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">City</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_city"
                value={this.state.childMeta_city}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Zip Code</label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_zipcode"
                value={this.state.childMeta_zipcode}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Place of Birth - Street Address
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_placeOfBirth_streetAddress"
                value={this.state.childMeta_placeOfBirth_streetAddress}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Place of Birth - State
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_placeOfBirth_state"
                value={this.state.childMeta_placeOfBirth_state}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Place of Birth - City
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_placeOfBirth_city"
                value={this.state.childMeta_placeOfBirth_city}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Place of Birth - Zip Code
              </label>{" "}
              <input
                onChange={this.handleFieldInput}
                id="childMeta_placeOfBirth_zipcode"
                value={this.state.childMeta_placeOfBirth_zipcode}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Food Allergies <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <textarea
                onChange={this.handleFieldInput}
                id="food1"
                value={this.state.food1}
                className="form-control"
                type="text"
                disabled={this.state.noFoodAllergies}
              ></textarea>
              <Form.Check
                type="checkbox"
                id="noFoodAllergies"
                label="No known food allergies"
                checked={this.state.noFoodAllergies}
                onChange={this.handleNoAllergiesToggle}
                className="mt-1 d-flex align-items-center"
              />
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Medicine Allergies <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <textarea
                onChange={this.handleFieldInput}
                id="drugAllergies"
                value={this.state.drugAllergies}
                className="form-control"
                type="text"
                disabled={this.state.noDrugAllergies}
              ></textarea>
              <Form.Check
                type="checkbox"
                id="noDrugAllergies"
                label="No known drug allergies"
                checked={this.state.noDrugAllergies}
                onChange={this.handleNoAllergiesToggle}
                className="mt-1 d-flex align-items-center"
              />
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Other Allergies <span style={{ color: "red" }}>*</span>
              </label>{" "}
              <textarea
                onChange={this.handleFieldInput}
                id="allergies"
                value={this.state.allergies}
                className="form-control"
                type="text"
                disabled={this.state.noKnownAllergies}
              ></textarea>
              <Form.Check
                type="checkbox"
                id="noKnownAllergies"
                label="No known allergies"
                checked={this.state.noKnownAllergies}
                onChange={this.handleNoAllergiesToggle}
                className="mt-1 d-flex align-items-center"
              />
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Chronic Conditions</label>{" "}
              <textarea
                onChange={this.handleFieldInput}
                id="chronicHealthConditions"
                value={this.state.chronicHealthConditions}
                className="form-control"
                type="text"
              ></textarea>
            </div>

            {!this.props.formData.approved && (
              <>
                <FormError errorId={this.props.id + "-error"} />
                <div
                  className="form-group logInInputField"
                  style={{ textAlign: "right" }}
                >
                  <button className="darkBtn" onClick={this.validateForm}>
                    Submit
                  </button>
                </div>
              </>
            )}
            </fieldset>
          </div>
        </div>
      );
    }
  }
}

export default FaceSheet;
