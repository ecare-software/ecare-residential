import React, { Component } from "react";
import FormError from "../FormMods/FormError";
import FormAlert from "../Forms/FormAlert";
import "../../App.css";
import Axios from "axios";
import { Col, Form, Row } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import { GetUserSig } from "../../utils/GetUserSig";
import { FormSuccessAlert } from "../../utils/FormSuccessAlert";
import { FormSavedAlert } from "../../utils/FormSavedAlert";
import { isAdminUser } from "../../utils/AdminReportingRoles";

class AwakeNightStaffSignoff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ts1Approval: false,
      ts2Approval: false,
      ts3Approval: false,
      ts4Approval: false,
      ts5Approval: false,
      ts6Approval: false,
      ts7Approval: false,
      ts8Approval: false,
      ts9Approval: false,
      ts10Approval: false,
      ts11Approval: false,
      ts12Approval: false,
      ts13Approval: false,
      ts14Approval: false,
      ts15Approval: false,
      ts16Approval: false,
      ts17Approval: false,
      ts18Approval: false,
      ts19Approval: false,
      ts20Approval: false,
      ts21Approval: false,
      ts22Approval: false,
      ts23Approval: false,
      ts24Approval: false,
      ts25Approval: false,
      ts26Approval: false,
      ts27Approval: false,
      ts28Approval: false,
      ts29Approval: false,
      ts30Approval: false,
      ts31Approval: false,
      ts32Approval: false,
      ts33Approval: false,
      ts34Approval: false,
      ts35Approval: false,
      ts36Approval: false,
      ts37Approval: false,
      ts38Approval: false,
      ts39Approval: false,
      ts40Approval: false,

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

      loadingSig: true,
    };
  }

  toggleSuccessAlert = () => {
    this.setState({
      formSubmitted: !this.state.formSubmitted,
    });
  };

  toggleErrorAlert = () => {
    this.setState({
      formHasError: !this.state.formHasError,
      formErrorMessage: "",
    });
  };

  handleFieldInput = async (event) => {
    const id = event.target.id;
    const cloneState = { ...this.state };
    cloneState[id] = true;
    await this.setState({ ...cloneState });
  };

  clearFieldInput = async (id) => {
    const cloneState = { ...this.state };
    cloneState[id] = false;
    await this.setState({ ...cloneState });
  };

  resetForm = () => {
    this.setState({
      ts1Approval: false,
      ts2Approval: false,
      ts3Approval: false,
      ts4Approval: false,
      ts5Approval: false,
      ts6Approval: false,
      ts7Approval: false,
      ts8Approval: false,
      ts9Approval: false,
      ts10Approval: false,
      ts11Approval: false,
      ts12Approval: false,
      ts13Approval: false,
      ts14Approval: false,
      ts15Approval: false,
      ts16Approval: false,
      ts17Approval: false,
      ts18Approval: false,
      ts19Approval: false,
      ts20Approval: false,
      ts21Approval: false,
      ts22Approval: false,
      ts23Approval: false,
      ts24Approval: false,
      ts25Approval: false,
      ts26Approval: false,
      ts27Approval: false,
      ts28Approval: false,
      ts29Approval: false,
      ts30Approval: false,
      ts31Approval: false,
      ts32Approval: false,
      ts33Approval: false,
      ts34Approval: false,
      ts35Approval: false,
      ts36Approval: false,
      ts37Approval: false,
      ts38Approval: false,
      ts39Approval: false,
      ts40Approval: false,
    });
  };

  submit = async () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    if (this.props.valuesSet) {
      try {
        await Axios.put(
          `/api/awakeNightStaffSignoff/${this.state.homeId}/${this.props.formData._id}`,
          {
            ...this.state,
          }
        );
        this.props.doUpdateFormDates();
        window.scrollTo(0, 0);
        this.toggleSuccessAlert();
        setTimeout(() => {
          this.toggleSuccessAlert();
        }, 2000);
      } catch (e) {
        this.setState({
          formHasError: true,
          formErrorMessage: "Error Submitting Awake Night Staff Sign Off",
        });
      }
    } else {
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;
      console.log(currentState);

      Axios.post("/api/awakeNightStaffSignoff", currentState)
        .then((res) => {
          window.scrollTo(0, 0);
          this.toggleSuccessAlert();
          if (!this.props.valuesSet) {
            this.resetForm();
          }
        })
        .catch((e) => {
          this.setState({
            formHasError: true,
            formErrorMessage: "Error Submitting Awake Night Staff Sign Off",
          });
        });
    }
  };

  validateForm = async (save) => {
    if (!save) {
      const { data: createdUserData } = await GetUserSig(
        this.props.userObj.email,
        this.props.userObj.homeId
      );

      if (
        !createdUserData.signature ||
        Array.isArray(createdUserData.signature) === false ||
        !createdUserData.signature.length > 0
      ) {
        this.setState({
          ...this.state,
          formHasError: true,
          formErrorMessage: `User signiture required to submit a form. Create a new signiture under 'Manage Profile'.`,
        });
        return;
      }
    }

    var keysToExclude = [
      "formHasError",
      "formSubmitted",
      "formErrorMessage",
      "tempMethodTaken",
      "tempInitialReading",
      "adminFollowUp",
      "lastMedicationGiven",
      "otherActionsTreatment",
      "treatmentAuthBy",
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

    if (!isValid && !isAdminUser(this.props.userObj)) {
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

  setSignature = (userObj) => {
    if (userObj.signature && userObj.signature.length) {
      this.sigCanvas.fromData(userObj.signature);
    }
  };

  setValues = async () => {
    const { data: createdUserData } = await GetUserSig(
      this.props.formData.createdBy,
      this.props.userObj.homeId
    );
    console.log(this.props.formData);
    this.setSignature(createdUserData);
    this.sigCanvas.off();
    this.setState({
      ...this.state,
      ...this.props.formData,
      loadingSig: false,
    });
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
              {this.state.formSubmitted && <FormSuccessAlert />}
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
            <h2 className="formTitle">Awake Night Staff Sign Off</h2>
          </div>

          <div className="formFieldsMobile">
            <Row>
              <Col md="6" className="control-label text-center">
                <label>Time</label>
              </Col>
              <Col md="6" className="control-label">
                Signed
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>8:00am - 8:15am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts1Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts1Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts1Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>8:15am - 8:30am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts2Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts2Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts2Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>8:30am - 8:45am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts3Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts3Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts3Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>8:45am - 9:00am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts4Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts4Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts4Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>9:00am - 9:15am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts5Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts5Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts5Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>9:15am - 9:30am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts6Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts6Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts6Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>9:30am - 9:45am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts7Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts7Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts7Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>9:45am - 10:00am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts8Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts8Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts8Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>10:00am - 10:15am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts9Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts9Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts9Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>10:15am - 10:30am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts10Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts10Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts10Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>10:30am - 10:45am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts11Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts11Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts11Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>10:45am - 11:00am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts12Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts12Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts12Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>11:00am - 11:15am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts13Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts13Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts1Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>11:15am - 11:30am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts14Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts14Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts14Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>11:30am - 11:45am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts15Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts15Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts15Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>11:45am - 12:00pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts16Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts16Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts16Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>12:00pm - 12:15pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts17Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts17Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts17Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>12:15pm - 12:30pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts18Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts18Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts18Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>12:30pm - 12:45pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts19Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts19Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts19Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>12:45pm - 1:00pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts20Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts20Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts20Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>1:00pm - 1:15pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts21Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts21Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts21Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>1:15pm - 1:30pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts22Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts22Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts22Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>1:30pm - 1:45pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts23Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts23Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts23Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>1:45pm - 2:00pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts24Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts24Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts24Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>2:00pm - 2:15pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts25Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts25Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts25Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>2:15pm - 2:30pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts26Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts26Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts26Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>2:30pm - 2:45pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts27Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts27Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts27Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>2:45pm - 3:00pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts28Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts28Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts28Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>3:00pm - 3:15pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts29Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts29Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts29Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>3:15pm - 3:30pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts30Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts30Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts30Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>3:30pm - 3:45pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts31Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts31Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts31Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>3:45pm - 4:00pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts32Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts32Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts32Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>4:00pm - 4:15pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts33Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts33Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts33Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>4:15pm - 4:30pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts34Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts34Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts34Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>4:30pm - 4:45pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts35Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts35Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts35Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>4:45pm - 5:00pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts36Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts36Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts36Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>5:00pm - 5:15pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts37Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts37Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts37Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>5:15pm - 5:30pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts38Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts38Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts38Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>5:30pm - 5:45pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts39Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts39Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts39Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>5:45pm - 6:00pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts40Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts40Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts40Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>

            <FormError errorId={this.props.id + "-error"} />
            <div
              className="form-group logInInputField"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <button
                className="lightBtn"
                onClick={() => {
                  this.validateForm(true);
                }}
              >
                Save
              </button>

              <button
                className="darkBtn"
                onClick={() => {
                  this.validateForm(false);
                }}
              >
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
              {this.state.formSubmitted && <FormSavedAlert />}
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
            <h2 className="formTitle">Awake Night Staff Sign Off</h2>
          </div>

          <div className="formFieldsMobileReport">
            <Row>
              <Col md="6" className="control-label text-center">
                <label>Time</label>
              </Col>
              <Col md="6" className="control-label">
                Signed
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>8:00am - 8:15am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts1Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts1Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts1Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>8:15am - 8:30am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts2Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts2Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts2Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>8:30am - 8:45am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts3Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts3Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts3Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>8:45am - 9:00am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts4Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts4Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts4Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>9:00am - 9:15am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts5Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts5Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts5Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>9:15am - 9:30am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts6Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts6Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts6Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>9:30am - 9:45am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts7Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts7Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts7Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>9:45am - 10:00am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts8Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts8Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts8Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>10:00am - 10:15am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts9Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts9Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts9Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>10:15am - 10:30am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts10Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts10Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts10Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>10:30am - 10:45am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts11Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts11Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts11Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>10:45am - 11:00am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts12Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts12Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts12Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>11:00am - 11:15am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts13Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts13Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts1Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>11:15am - 11:30am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts14Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts14Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts14Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>11:30am - 11:45am</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts15Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts15Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts15Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>11:45am - 12:00pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts16Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts16Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts16Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>12:00pm - 12:15pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts17Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts17Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts17Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>12:15pm - 12:30pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts18Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts18Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts18Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>12:30pm - 12:45pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts19Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts19Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts19Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>12:45pm - 1:00pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts20Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts20Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts20Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>1:00pm - 1:15pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts21Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts21Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts21Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>1:15pm - 1:30pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts22Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts22Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts22Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>1:30pm - 1:45pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts23Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts23Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts23Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>1:45pm - 2:00pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts24Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts24Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts24Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>2:00pm - 2:15pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts25Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts25Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts25Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>2:15pm - 2:30pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts26Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts26Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts26Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>2:30pm - 2:45pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts27Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts27Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts27Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>2:45pm - 3:00pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts28Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts28Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts28Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>3:00pm - 3:15pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts29Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts29Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts29Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>3:15pm - 3:30pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts30Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts30Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts30Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>3:30pm - 3:45pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts31Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts31Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts31Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>3:45pm - 4:00pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts32Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts32Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts32Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>4:00pm - 4:15pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts33Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts33Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts33Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>4:15pm - 4:30pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts34Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts34Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts34Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>4:30pm - 4:45pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts35Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts35Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts35Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>4:45pm - 5:00pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts36Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts36Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts36Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>5:00pm - 5:15pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts37Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts37Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts37Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>5:15pm - 5:30pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts38Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts38Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts38Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>5:30pm - 5:45pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts39Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts39Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts39Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col
                md="6"
                className="control-label d-flex align-items-center justify-content-center"
              >
                <label>5:45pm - 6:00pm</label>
              </Col>
              <Col md="6" className="control-label text-center">
                {this.state.ts40Approval ? (
                  <div className="mb-2 d-flex align-items-center">
                    {
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("ts40Approval");
                        }}
                      >
                        Signed. Remove signiture?
                      </a>
                    }
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="ts40Approval"
                    className="mb-2 d-flex align-items-center justify-content-space-between"
                    label={
                      this.props.valuesSet ? "Not Completed" : "Click to sign"
                    }
                    onClick={this.handleFieldInput}
                  />
                )}
              </Col>
            </Row>
            <label className="control-label">Signature</label>{" "}
            <div className="sigSection">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <SignatureCanvas
                  ref={(ref) => {
                    this.sigCanvas = ref;
                  }}
                  style={{ border: "solid" }}
                  penColor="black"
                  clearOnResize={false}
                  canvasProps={{
                    width: 600,
                    height: 200,
                    className: "sigCanvas",
                  }}
                  backgroundColor="#eeee"
                />
              </div>
            </div>
            {!this.props.formData.approved && (
              <>
                <FormError errorId={this.props.id + "-error"} />
                <div
                  className="form-group logInInputField"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <button
                    className="lightBtn"
                    onClick={() => {
                      this.validateForm(true);
                    }}
                  >
                    Save
                  </button>

                  {/* <button
                    className="darkBtn"
                    onClick={() => {
                      this.validateForm(false);
                    }}
                  >
                    Submit
                  </button> */}
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
  }
}

export default AwakeNightStaffSignoff;
