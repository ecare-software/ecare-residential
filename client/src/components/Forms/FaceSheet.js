import React, { Component } from "react";
import FormError from "../FormMods/FormError";
import FormAlert from "../Forms/FormAlert";
import { Form, Col } from "react-bootstrap";
import "../../App.css";
import Axios from "axios";

class FaceSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childMeta_name: "",
      childMeta_gender: "",
      childMeta_dob: "",
      childMeta_age: "",
      childMeta_religion: "",
      childMeta_ethnicity: "",
      childMeta_dateOfAdmission: "",
      childMeta_medicaidNumber: "",
      childMeta_cpsNumber: "",
      childMeta_ssn: "",
      childMeta_caseWorker: "",
      childMeta_caseWorkerPONumber: "",
      childMeta_levelOfCare: "",
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
      drugAllergies: "",
      allergies: "",
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
  resetForm = () => {
    this.setState({
      childMeta_name: "",
      childMeta_gender: "",
      childMeta_dob: "",
      childMeta_age: "",
      childMeta_religion: "",
      childMeta_ethnicity: "",
      childMeta_dateOfAdmission: "",
      childMeta_medicaidNumber: "",
      childMeta_cpsNumber: "",
      childMeta_ssn: "",
      childMeta_caseWorker: "",
      childMeta_caseWorkerPONumber: "",
      childMeta_levelOfCare: "",
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
      drugAllergies: "",
      allergies: "",
      chronicHealthConditions: "",
    });
  };

  submit = () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    console.log(JSON.stringify(currentState));
    if (this.props.valuesSet) {
      Axios.put(
        `/api/client/${this.state.homeId}/${this.state._id}`,
        this.state
      )
        .then((res) => {
          window.scrollTo(0, 0);
          this.toggleSuccessAlert();
          setTimeout(this.toggleSuccessAlert, 3000);
        })
        .catch((e) => {
          this.setState({
            formHasError: true,
            formErrorMessage: "Error Submitting Face Sheet",
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
            formErrorMessage: "Error Submitting Face Sheet",
          });
        });
    }
  };

  validateForm = () => {
    var keysToExclude = [
      "formHasError",
      "formSubmitted",
      "formErrorMessage",
      "childMeta_medicaidNumber",
      "childMeta_cpsNumber",
      "childMeta_caseWorker",
      "childMeta_caseWorkerPONumber",
      "childMeta_region",
      "childMeta_county",
      "childMeta_streetAddress",
      "childMeta_state",
      "childMeta_city",
      "childMeta_zipcode",
      "childMeta_placeOfBirth_streetAddress",
      "childMeta_placeOfBirth_state",
      "childMeta_placeOfBirth_city",
      "childMeta_placeOfBirth_zipcode",
      "food1",
      "drugAllergies",
      "allergies",
      "chronicHealthConditions",
      "childMeta_religion",
    ];

    //resubmit fields
    keysToExclude = [
      ...keysToExclude,
      "__v",
      "approved",
      "approvedBy",
      "approvedByDate",
      "approvedByName",
    ];

    var isValid = true;
    var errorFields = [];

    /*Object.keys(this.state).forEach((key) => {
      if (!keysToExclude.includes(key)) {
        if (
          !this.state[key] ||
          /^\s+$/.test(this.state[key]) ||
          this.state[key].length < 1
        ) {
          errorFields.push("\n" + key);
          isValid = false;
        }
      }
    });
*/

    if (!isValid) {
      this.setState({
        formHasError: true,
        formErrorMessage: `Please complete the following field(s): ${errorFields
          .toString()
          .replace(/,/g, "\n")}`,
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

  render() {
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
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Name</label>{" "}
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
              <label className="control-label">Date of Birth</label>{" "}
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
              <label className="control-label">Date of Admission</label>{" "}
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
              <label className="control-label">Case Worker Name</label>{" "}
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
                <option value={""}>Choose</option>
              </Form.Control>
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
              <label className="control-label">Food Allergies</label>{" "}
              <textarea
                onChange={this.handleFieldInput}
                id="food1"
                value={this.state.food1}
                className="form-control"
                type="text"
              ></textarea>
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Medicine Allergies</label>{" "}
              <textarea
                onChange={this.handleFieldInput}
                id="drugAllergies"
                value={this.state.drugAllergies}
                className="form-control"
                type="text"
              ></textarea>
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Other Allergies</label>{" "}
              <textarea
                onChange={this.handleFieldInput}
                id="allergies"
                value={this.state.allergies}
                className="form-control"
                type="text"
              ></textarea>
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
          <div className="formTitleDivReport">
            <h2 className="formTitle">Face Sheet</h2>
          </div>
          <div className="formFieldsMobileReport">
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Name</label>{" "}
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
              <label className="control-label">Date of Birth</label>{" "}
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
              <label className="control-label">Date of Admission</label>{" "}
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
              <label className="control-label">Case Worker Name</label>{" "}
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
                <option value={""}>Choose</option>
              </Form.Control>
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
              <label className="control-label">Food Allergies</label>{" "}
              <textarea
                onChange={this.handleFieldInput}
                id="food1"
                value={this.state.food1}
                className="form-control"
                type="text"
              ></textarea>
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Medicine Allergies</label>{" "}
              <textarea
                onChange={this.handleFieldInput}
                id="drugAllergies"
                value={this.state.drugAllergies}
                className="form-control"
                type="text"
              ></textarea>
            </div>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Other Allergies</label>{" "}
              <textarea
                onChange={this.handleFieldInput}
                id="allergies"
                value={this.state.allergies}
                className="form-control"
                type="text"
              ></textarea>
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
          </div>
        </div>
      );
    }
  }
}

export default FaceSheet;
