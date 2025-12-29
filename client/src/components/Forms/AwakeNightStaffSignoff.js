/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Component } from "react";
import FormError from "../FormMods/FormError";
import FormAlert from "../Forms/FormAlert";
import "../../App.css";
import Axios from "axios";
import { Container, Col, Form, Row } from "react-bootstrap";
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
      ts1YouthStatus:"",
      ts2Approval: false,
      ts2YouthStatus:"",
      ts3Approval: false,
      ts3YouthStatus:"",
      ts4Approval: false,
      ts4YouthStatus:"",
      ts5Approval: false,
      ts5YouthStatus:"",
      ts6Approval: false,
      ts6YouthStatus:"",
      ts7Approval: false,
      ts7YouthStatus:"",
      ts8Approval: false,
      ts8YouthStatus:"",
      ts9Approval: false,
      ts9YouthStatus:"",
      ts10Approval: false,
      ts10YouthStatus:"",
      ts11Approval: false,
      ts11YouthStatus:"",
      ts12Approval: false,
      ts12YouthStatus:"",
      ts13Approval: false,
      ts13YouthStatus:"",
      ts14Approval: false,
      ts14YouthStatus:"",
      ts15Approval: false,
      ts15YouthStatus:"",
      ts16Approval: false,
      ts16YouthStatus:"",
      ts17Approval: false,
      ts17YouthStatus:"",
      ts18Approval: false,
      ts18YouthStatus:"",
      ts19Approval: false,
      ts19YouthStatus:"",
      ts20Approval: false,
      ts20YouthStatus:"",
      ts21Approval: false,
      ts21YouthStatus:"",
      ts22Approval: false,
      ts22YouthStatus:"",
      ts23Approval: false,
      ts23YouthStatus:"",
      ts24Approval: false,
      ts24YouthStatus:"",
      ts25Approval: false,
      ts25YouthStatus:"",
      ts26Approval: false,
      ts26YouthStatus:"",
      ts27Approval: false,
      ts27YouthStatus:"",
      ts28Approval: false,
      ts28YouthStatus:"",
      ts29Approval: false,
      ts29YouthStatus:"",
      ts30Approval: false,
      ts30YouthStatus:"",
      ts31Approval: false,
      ts31YouthStatus:"",
      ts32Approval: false,
      ts32YouthStatus:"",
      ts33Approval: false,
      ts33YouthStatus:"",
      ts34Approval: false,
      ts34YouthStatus:"",
      ts35Approval: false,
      ts35YouthStatus:"",
      ts36Approval: false,
      ts36YouthStatus:"",
      ts37Approval: false,
      ts37YouthStatus:"",
      ts38Approval: false,
      ts38YouthStatus:"",
      ts39Approval: false,
      ts39YouthStatus:"",
      ts40Approval: false,
      ts40YouthStatus:"",
      ts41Approval: false,
      ts41YouthStatus:"",
      ts42Approval: false,
      ts42YouthStatus:"",
      ts43Approval: false,
      ts43YouthStatus:"",
      ts44Approval: false,
      ts44YouthStatus:"",
      ts45Approval: false,
      ts45YouthStatus:"",
      ts46Approval: false,
      ts46YouthStatus:"",
      ts47Approval: false,
      ts47YouthStatus:"",
      ts48Approval: false,
      ts48YouthStatus:"",
      ts49Approval: false,
      ts49YouthStatus:"",
      ts50Approval: false,
      ts50YouthStatus:"",

      sigCanvas1: null,
      sigCanvas2: null,
      sigCanvas3: null,
      sigCanvas4: null,
      sigCanvas5: null,
      sigCanvas6: null,
      sigCanvas7: null,
      sigCanvas8: null,
      sigCanvas9: null,
      sigCanvas10: null,
      sigCanvas11: null,
      sigCanvas12: null,
      sigCanvas13: null,
      sigCanvas14: null,
      sigCanvas15: null,
      sigCanvas16: null,
      sigCanvas17: null,
      sigCanvas18: null,
      sigCanvas19: null,
      sigCanvas20: null,
      sigCanvas21: null,
      sigCanvas22: null,
      sigCanvas23: null,
      sigCanvas24: null,
      sigCanvas25: null,
      sigCanvas26: null,
      sigCanvas27: null,
      sigCanvas28: null,
      sigCanvas29: null,
      sigCanvas30: null,
      sigCanvas31: null,
      sigCanvas32: null,
      sigCanvas33: null,
      sigCanvas34: null,
      sigCanvas35: null,
      sigCanvas36: null,
      sigCanvas37: null,
      sigCanvas38: null,
      sigCanvas39: null,
      sigCanvas40: null,
      sigCanvas41: null,
      sigCanvas42: null,
      sigCanvas43: null,
      sigCanvas44: null,
      sigCanvas45: null,
      sigCanvas46: null,
      sigCanvas47: null,
      sigCanvas48: null,
      sigCanvas49: null,
      sigCanvas50: null,

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

      userSig: [],
      status: "IN PROGRESS",

      createDate: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
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

  handleFieldInputDate = (event) => {
    var stateObj = {};
    if (event.target.id.indexOf(".") > -1) {
      let level1Obj = event.target.id.split(".")[0];
      let level2Obj = event.target.id.split(".")[1];

      let nestedProperty = { ...this.state[level1Obj] };
      nestedProperty[level2Obj] = event.target.value;
      stateObj[level1Obj] = nestedProperty;
    } else {
      stateObj[event.target.id] = event.target.value.concat(':00.000Z');
    }
    this.setState(stateObj);
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
      ts1YouthStatus:"",
      ts2Approval: false,
      ts2YouthStatus:"",
      ts3Approval: false,
      ts3YouthStatus:"",
      ts4Approval: false,
      ts4YouthStatus:"",
      ts5Approval: false,
      ts5YouthStatus:"",
      ts6Approval: false,
      ts6YouthStatus:"",
      ts7Approval: false,
      ts7YouthStatus:"",
      ts8Approval: false,
      ts8YouthStatus:"",
      ts9Approval: false,
      ts9YouthStatus:"",
      ts10Approval: false,
      ts10YouthStatus:"",
      ts11Approval: false,
      ts11YouthStatus:"",
      ts12Approval: false,
      ts12YouthStatus:"",
      ts13Approval: false,
      ts13YouthStatus:"",
      ts14Approval: false,
      ts14YouthStatus:"",
      ts15Approval: false,
      ts15YouthStatus:"",
      ts16Approval: false,
      ts16YouthStatus:"",
      ts17Approval: false,
      ts17YouthStatus:"",
      ts18Approval: false,
      ts18YouthStatus:"",
      ts19Approval: false,
      ts19YouthStatus:"",
      ts20Approval: false,
      ts20YouthStatus:"",
      ts21Approval: false,
      ts21YouthStatus:"",
      ts22Approval: false,
      ts22YouthStatus:"",
      ts23Approval: false,
      ts23YouthStatus:"",
      ts24Approval: false,
      ts24YouthStatus:"",
      ts25Approval: false,
      ts25YouthStatus:"",
      ts26Approval: false,
      ts26thYouthStatus:"",
      ts27Approval: false,
      ts27YouthStatus:"",
      ts28Approval: false,
      ts28YouthStatus:"",
      ts29Approval: false,
      ts29YouthStatus:"",
      ts30Approval: false,
      ts30YouthStatus:"",
      ts31Approval: false,
      ts31YouthStatus:"",
      ts32Approval: false,
      ts32YouthStatus:"",
      ts33Approval: false,
      ts33YouthStatus:"",
      ts34Approval: false,
      ts34YouthStatus:"",
      ts35Approval: false,
      ts35YouthStatus:"",
      ts36Approval: false,
      ts36YouthStatus:"",
      ts37Approval: false,
      ts37YouthStatus:"",
      ts38Approval: false,
      ts38YouthStatus:"",
      ts39Approval: false,
      ts39YouthStatus:"",
      ts40Approval: false,
      ts40YouthStatus:"",
      ts41Approval: false,
      ts41YouthStatus:"",
      ts42Approval: false,
      ts42YouthStatus:"",
      ts43Approval: false,
      ts43YouthStatus:"",
      ts44Approval: false,
      ts44YouthStatus:"",
      ts45Approval: false,
      ts45YouthStatus:"",
      ts46Approval: false,
      ts46YouthStatus:"",
      ts47Approval: false,
      ts47YouthStatus:"",
      ts48Approval: false,
      ts48YouthStatus:"",
      ts49Approval: false,
      ts49YouthStatus:"",
      ts50Approval: false,
      ts50YouthStatus:"",
      status: "IN PROGRESS",
      createDate: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
    });
  };

  submit = async (save) => {
    if (!save) this.state.status = "COMPLETED";
    let currentState = JSON.parse(JSON.stringify(this.state));
    if (this.props.valuesSet) {
      try {
        await Axios.put(
          `/api/awakeNightStaffSignoff/${this.state.homeId}/${this.props.formData._id}`,
          {
            ...currentState,
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
          formErrorMessage: `User signature required to submit a form. Create a new signature under 'Manage Profile'.`,
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
          errorFields.push('\n' + key);
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

    this.submit(save);
  };

  setSignature = (userObj) => {
    if (userObj.signature && userObj.signature.length) {
      this.sigCanvas.fromData(userObj.signature);
      this.sigCanvas.off();
    }
  };

  setSignatures = async (email, homeId) => {
    let i = 50;
    const { data: userSig } = await GetUserSig(email, homeId);
    if (userSig.signature) {
      for (let x = 1; x <= i; x++) {
        if (this[`sigCanvas${x}`]) {
          this[`sigCanvas${x}`].fromData(userSig.signature);
          this[`sigCanvas${x}`].off();
        }
      }
    }
    this.setState({
      ...this.state,
      loadingSig: false,
      userSig: userSig.signature ?? [],
    });
  };

  setValues = async () => {
    let i = 50;
    const { data: createdUserData } = await GetUserSig(
      this.props.formData.createdBy,
      this.props.userObj.homeId
    );
    if (createdUserData.signature) {
      for (let x = 1; x <= i; x++) {
        if (this[`sigCanvas${x}`]) {
          this[`sigCanvas${x}`].fromData(createdUserData.signature);
          this[`sigCanvas${x}`].off();
        }
      }
    }

    this.setState({
      ...this.state,
      ...this.props.formData,
      loadingSig: false,
      userSig: createdUserData.signature ?? [],
    });
  };

  componentDidMount() {
    if (this.props.valuesSet) {
      this.setValues();
    } else {
      this.setSignatures(this.props.userObj.email, this.props.userObj.homeId);
    }
  }

  handleSelectChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

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
          <div className="text-center">
            {this.state.userSig.length === 0 && !this.state.loadingSig && (
              <p className="text-danger">
                Warning: Looks like you do not have a user signature set.
                <br />
                This form cannot be completed. Visit{" "}
                <a
                  target="#"
                  className="text-info pointer"
                  onClick={() => {
                    document
                      .querySelector(".Submit-a-Form-nav > a")
                      .classList.remove("active");
                    document
                      .querySelector(".Training-nav > a")
                      .classList.remove("active");
                    document
                      .querySelector(".nav-link")
                      .classList.remove("active");
                    document
                      .querySelector(".Manage-Account-nav > a")
                      .classList.add("active");
                    this.props.toggleDisplay("Manage Account");
                  }}
                >
                  Manage Profile
                </a>{" "}
                to set one.
              </p>
            )}
          </div>

          <Container className="print-container">
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>8:00pm- 8:15pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts1Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts1Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts1Approval"
                        className="mb-2 d-flex align-items-center justify-content-space-between "
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                 
                  {this.state.ts1Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas1 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts1YouthStatus"
                            value={this.state.ts1YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>8:15pm - 8:30pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts2Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts2Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts2Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts2Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas2 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts2YouthStatus"
                            value={this.state.ts2YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    {/* create form */}
                    <label>8:30pm - 8:45pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts3Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts3Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts3Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts3Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas3 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts3YouthStatus"
                            value={this.state.ts3YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>8:45pm - 9:00pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts4Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts4Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts4Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts4Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas4 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="t41YouthStatus"
                            value={this.state.ts4YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>9:00pm - 9:15pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts5Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts5Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts5Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts5Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas5 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts5YouthStatus"
                            value={this.state.ts5YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>9:15pm - 9:30pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts6Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts6Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts6Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts6Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas6 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts6YouthStatus"
                            value={this.state.ts6YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>9:30pm - 9:45pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts7Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts7Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts7Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts7Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas7 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts7YouthStatus"
                            value={this.state.ts7YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>9:45pm - 10:00pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts8Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts8Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts8Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts8Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas8 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts8YouthStatus"
                            value={this.state.ts8YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>10:00pm - 10:15pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts9Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts9Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts9Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts9Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas9 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts9YouthStatus"
                            value={this.state.ts9YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>10:15pm - 10:30pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts10Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts10Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts10Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts10Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas10 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts10YouthStatus"
                            value={this.state.ts10YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>10:30pm - 10:45pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts11Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts11Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts11Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts11Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas11 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts11YouthStatus"
                            value={this.state.ts11YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>10:45pm - 11:00pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts12Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts12Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts12Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts12Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas12 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts12YouthStatus"
                            value={this.state.ts12YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>11:00pm - 11:15pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts13Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts13Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts13Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts13Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas13 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts13YouthStatus"
                            value={this.state.ts13YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>11:15pm - 11:30pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts14Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts14Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts14Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts14Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas14 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts14YouthStatus"
                            value={this.state.ts14YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>11:30pm - 11:45pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts15Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts15Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts15Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts15Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas15 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts15YouthStatus"
                            value={this.state.ts15YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>11:45pm - 12:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts16Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts16Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts16Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts16Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas16 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts16YouthStatus"
                            value={this.state.ts16YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>12:00am - 12:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts17Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts17Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts17Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts17Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas17 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts17YouthStatus"
                            value={this.state.ts17YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>12:15am - 12:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts18Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts18Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts18Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts18Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas18 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts18YouthStatus"
                            value={this.state.ts18YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>12:30am - 12:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts19Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts19Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts19Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts19Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas19 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts19YouthStatus"
                            value={this.state.ts19YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>12:45am - 1:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts20Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts20Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts20Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts20Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas20 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts20YouthStatus"
                            value={this.state.ts20YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>1:00am - 1:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts21Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts21Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts21Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts21Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas21 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts21YouthStatus"
                            value={this.state.ts21YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>1:15am - 1:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts22Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts22Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts22Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts22Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas22 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts22YouthStatus"
                            value={this.state.ts22YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>1:30am - 1:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts23Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts23Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts23Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts23Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas23 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts23YouthStatus"
                            value={this.state.ts23YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>1:45am - 2:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts24Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts24Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts24Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts24Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas24 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts24YouthStatus"
                            value={this.state.ts24YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>2:00am - 2:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts25Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts25Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts25Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts25Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas25 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts25YouthStatus"
                            value={this.state.ts25YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>2:15am - 2:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts26Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts26Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts26Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts26Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas26 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts26YouthStatus"
                            value={this.state.ts26YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>2:30am - 2:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts27Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts27Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts27Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts27Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas27 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts27YouthStatus"
                            value={this.state.ts27YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>2:45am - 3:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts28Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts28Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts28Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                 {this.state.ts28Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas28 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts28YouthStatus"
                            value={this.state.ts28YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>3:00am - 3:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts29Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts29Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts29Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts29Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas29 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts29YouthStatus"
                            value={this.state.ts29YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>3:15am - 3:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts30Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts30Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts30Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts30Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas30 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts30YouthStatus"
                            value={this.state.ts30YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>3:30am - 3:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts31Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts31Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts31Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts31Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas31 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts31YouthStatus"
                            value={this.state.ts31YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>3:45am - 4:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts32Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts32Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts32Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts32Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas32 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts32YouthStatus"
                            value={this.state.ts32YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>4:00am - 4:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts33Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts33Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts33Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts33Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas33 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts33YouthStatus"
                            value={this.state.ts33YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>4:15am - 4:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts34Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts34Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts34Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts34Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas34 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts34YouthStatus"
                            value={this.state.ts34YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>4:30am - 4:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts35Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts35Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts35Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts35Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas35 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts35YouthStatus"
                            value={this.state.ts35YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>4:45am - 5:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts36Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts36Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts36Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts36Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas36 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts36YouthStatus"
                            value={this.state.ts36YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>5:00am - 5:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts37Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts37Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts37Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts37Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas37 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts37YouthStatus"
                            value={this.state.ts37YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>5:15am - 5:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts38Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts38Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts38Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts38Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas38 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts38YouthStatus"
                            value={this.state.ts38YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>5:30am - 5:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts39Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts39Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts39Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts39Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas39 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts39YouthStatus"
                            value={this.state.ts39YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>5:45am - 6:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts40Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts40Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts40Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts40Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas40 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts40YouthStatus"
                            value={this.state.ts40YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>6:00am - 6:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts41Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts41Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts41Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts41Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas41 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts41YouthStatus"
                            value={this.state.ts41YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>6:15am - 6:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts42Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts42Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts42Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts42Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas42 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts42YouthStatus"
                            value={this.state.ts42YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>6:30am - 6:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts43Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts43Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts43Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts43Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas43 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts43YouthStatus"
                            value={this.state.ts43YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>6:45am - 7:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts44Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts44Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts44Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts44Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas44 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts44YouthStatus"
                            value={this.state.ts44YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>8:00am - 8:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts49Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts49Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts49Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts49Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas49 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts49YouthStatus"
                            value={this.state.ts49YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>8:15am - 8:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts50Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts50Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts50Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts50Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas50 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts50YouthStatus"
                            value={this.state.ts50YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <FormError errorId={this.props.id + "-error"} />

            <Row className="save-submit-row" style={{ paddingTop: "20px" }}>
              <div style={{ display: "flex", width: "46%" }}>
                <button
                  className="lightBtn hide hide-on-print save-submit-btn"
                  style={{ width: "100%" }}
                  onClick={() => {
                    this.validateForm(true);
                  }}
                >
                  Finish Later
                </button>
              </div>
              <div style={{ display: "flex", width: "46%" }}>
                <button
                  className="darkBtn hide hide-on-print save-submit-btn"
                  style={{ width: "100%" }}
                  onClick={() => {
                    this.validateForm(false);
                  }}
                >
                  Submit
                </button>
              </div>
            </Row>
          </Container>
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

          <Container className="print-container">
            <Row>
              <Col md={12} className="print-column">
                <div className="form-group logInInputField">
                  <label className="control-label">
                    Create Date
                  </label>{" "}
                  <input
                    id="createDate"
                    value={this.state.createDate === null ? "" : this.state.createDate.slice(0, -8)}
                    onChange={this.handleFieldInputDate}
                    className="form-control"
                    type="datetime-local"
                  />{" "}
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>8:00pm - 8:15pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts1Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {this.props.valuesSet && (
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts1Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        )}
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts1Approval"
                        className="mb-2 d-flex hide-on-print align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts1Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas1 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts1YouthStatus"
                            value={this.state.ts1YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>8:15pm - 8:30pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts2Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {this.props.valuesSet && (
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts2Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        )}
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts2Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts2Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas2 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts2YouthStatus"
                            value={this.state.ts2YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    {/* edit form */}
                    <label>8:30pm - 8:45pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts3Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts3Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts3Approval"
                        className="mb-2 hide-on-print hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts3Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas3 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts3YouthStatus"
                            value={this.state.ts3YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>8:45pm - 9:00pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts4Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts4Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts4Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts4Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas4 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts4YouthStatus"
                            value={this.state.ts4YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>9:00pm - 9:15pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts5Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts5Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts5Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts5Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas5 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts5YouthStatus"
                            value={this.state.ts5YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>9:15pm - 9:30pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts6Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts6Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts6Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts6Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas6 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts6YouthStatus"
                            value={this.state.ts6YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>9:30pm - 9:45pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts7Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts7Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts7Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts7Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas7 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts7YouthStatus"
                            value={this.state.ts7YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>9:45pm - 10:00pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts8Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts8Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts8Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts8Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas8 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts8YouthStatus"
                            value={this.state.ts8YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>10:00pm - 10:15pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts9Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts9Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts9Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts9Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas9 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts9YouthStatus"
                            value={this.state.ts9YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>10:15pm - 10:30pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts10Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts10Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts10Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts10Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas10 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts10YouthStatus"
                            value={this.state.ts10YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>10:30pm - 10:45pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts11Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts11Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts11Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts11Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas11 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts11YouthStatus"
                            value={this.state.ts11YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>10:45pm - 11:00pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts12Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts12Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts12Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts12Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas12 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts12YouthStatus"
                            value={this.state.ts12YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>11:00pm - 11:15pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts13Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts13Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts1Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts13Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas13 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts13YouthStatus"
                            value={this.state.ts13YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>11:15pm - 11:30pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts14Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts14Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts14Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts14Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas14 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts14YouthStatus"
                            value={this.state.ts14YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>11:30pm - 11:45pm</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts15Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts15Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts15Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts15Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas15 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts15YouthStatus"
                            value={this.state.ts15YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>11:45pm - 12:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts16Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts16Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts16Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts16Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas16 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts16YouthStatus"
                            value={this.state.ts16YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>12:00am - 12:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts17Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts17Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts17Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts17Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas17 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts17YouthStatus"
                            value={this.state.ts17YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>12:15am - 12:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts18Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts18Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts18Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts18Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas18 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts18YouthStatus"
                            value={this.state.ts18YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>12:30am - 12:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts19Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts19Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts19Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts19Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas19 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts19YouthStatus"
                            value={this.state.ts19YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>12:45am - 1:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts20Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts20Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts20Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts20Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas20 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts20YouthStatus"
                            value={this.state.ts20YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>1:00am - 1:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts21Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts21Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts21Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts21Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas21 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts21YouthStatus"
                            value={this.state.ts21YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>1:15am - 1:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts22Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts22Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts22Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts22Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas22 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts22YouthStatus"
                            value={this.state.ts22YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>1:30am - 1:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts23Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts23Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts23Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts23Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas23 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts23YouthStatus"
                            value={this.state.ts23YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>1:45am - 2:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts24Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts24Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts24Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts24Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas24 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts24YouthStatus"
                            value={this.state.ts24YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>2:00am - 2:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts25Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts25Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts25Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts25Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas25 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts25YouthStatus"
                            value={this.state.ts25YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>2:15am - 2:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts26Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts26Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts26Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts26Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas26 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts26YouthStatus"
                            value={this.state.ts26YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>2:30am - 2:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts27Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts27Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts27Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts27Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas27 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts27YouthStatus"
                            value={this.state.ts27YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>2:45am - 3:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts28Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts28Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts28Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts28Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas28 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts28YouthStatus"
                            value={this.state.ts28YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>3:00am - 3:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts29Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts29Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts29Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts29Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas29 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts29YouthStatus"
                            value={this.state.ts29YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>3:15am - 3:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts30Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts30Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts30Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts30Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas30 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts30YouthStatus"
                            value={this.state.ts30YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>3:30am - 3:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts31Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts31Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts31Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts31Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas31 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts31YouthStatus"
                            value={this.state.ts31YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>3:45am - 4:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts32Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts32Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts32Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts32Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas32 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts32YouthStatus"
                            value={this.state.ts32YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>4:00am - 4:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts33Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts33Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts33Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts33Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas33 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts33YouthStatus"
                            value={this.state.ts33YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>4:15am - 4:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts34Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts34Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts34Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts34Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas34 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts34YouthStatus"
                            value={this.state.ts34YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>4:30am - 4:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts35Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts35Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts35Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts35Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas35 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts35YouthStatus"
                            value={this.state.ts35YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>4:45am - 5:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts36Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts36Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts36Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts36Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas36 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts36YouthStatus"
                            value={this.state.ts36YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>5:00am - 5:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts37Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts37Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts37Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts37Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas37 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts37YouthStatus"
                            value={this.state.ts37YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>5:15am - 5:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts38Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts38Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts38Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts38Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas38 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts38YouthStatus"
                            value={this.state.ts38YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>5:30am - 5:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts39Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts39Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts39Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts39Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas39 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts39YouthStatus"
                            value={this.state.ts39YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>5:45am - 6:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts40Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts40Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts40Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts40Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas40 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts40YouthStatus"
                            value={this.state.ts40YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>6:00am - 6:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts41Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts41Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts41Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts41Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas41 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts41YouthStatus"
                            value={this.state.ts41YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>6:15am - 6:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts42Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts42Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts42Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts42Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas42 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts42YouthStatus"
                            value={this.state.ts42YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            {/* {extend} */}
            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>6:30am - 6:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts43Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts43Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts43Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts43Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas43 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts43YouthStatus"
                            value={this.state.ts43YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>6:45am - 7:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts44Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts44Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts44Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts44Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas44 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts44YouthStatus"
                            value={this.state.ts44YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>7:00am - 7:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts45Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts45Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts45Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                   {this.state.ts45Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas45 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts45YouthStatus"
                            value={this.state.ts45YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>7:15am - 7:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts46Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts46Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts46Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts46Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas46 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts46YouthStatus"
                            value={this.state.ts46YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>7:30am - 7:45am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts47Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts47Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts47Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts47Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas47 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts47YouthStatus"
                            value={this.state.ts47YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>7:45am - 8:00am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts48Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts48Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts48Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts48Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas48 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts48YouthStatus"
                            value={this.state.ts48YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>8:00am - 8:15am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts49Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts49Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts49Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts49Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas49 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts49YouthStatus"
                            value={this.state.ts49YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col
                    md="6"
                    className="control-label d-flex align-items-center justify-content-center"
                  >
                    <label>8:15am - 8:30am</label>
                  </Col>
                  <Col md="6" className="control-label text-center">
                    {this.state.ts50Approval ? (
                      <div className="mb-2 d-flex align-items-center">
                        {
                          <a
                            href="javascript:void(0)"
                            className="hide-on-print"
                            onClick={() => {
                              this.clearFieldInput("ts50Approval");
                            }}
                          >
                            Signed. Remove signature?
                          </a>
                        }
                      </div>
                    ) : (
                      <Form.Check
                        type="checkbox"
                        id="ts50Approval"
                        className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                        label={
                          this.props.valuesSet
                            ? "Not Completed or Signed"
                            : "Click to sign"
                        }
                        onClick={this.handleFieldInput}
                      />
                    )}
                  </Col>
                  {this.state.ts50Approval && (
                    <>
                      {/* Signature (exact same as later time slots) */}
                      <div
                        style={{
                          display: "flex",
                          height: "50px",
                          paddingLeft: "15px",
                          visibility: "visible",
                        }}
                      >
                        <SignatureCanvas
                          ref={(ref) => {
                            if (ref) {
                              this.sigCanvas50 = ref;

                              if (this.state.userSig?.length) {
                                ref.fromData(this.state.userSig);
                                ref.off();
                              }
                            }
                          }}
                          style={{ border: "solid" }}
                          penColor="black"
                          clearOnResize={false}
                          canvasProps={{
                            width: 300,
                            height: 100,
                            className: "sigCanvas",
                          }}
                          backgroundColor="#eeee"
                        />
                      </div>

                      {/* Youth Status BELOW the signature */}
                      <div style={{ paddingLeft: "15px", marginBottom: "20px" }}>
                        <Form.Group style={{ maxWidth: "300px" }}>
                          <Form.Label className="fw-bold">Youth Status</Form.Label>
                          <Form.Control
                            as="select"
                            id="ts50YouthStatus"
                            value={this.state.ts50YouthStatus}
                            onChange={this.handleSelectChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Awake">Awake</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Sick">Sick</option>
                            <option value="Bathroom">Bathroom</option>
                            <option value="Other">Other</option>
                          </Form.Control>
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>

            {!this.props.formData.approved && (
              <>
                <FormError errorId={this.props.id + "-error"} />
                <Row className="save-submit-row" style={{ paddingTop: "20px" }}>
                  <div style={{ display: "flex", width: "46%" }}>
                    <button
                      className="lightBtn hide hide-on-print save-submit-btn"
                      style={{
                        width: "100%",
                        display: this.state.status === 'COMPLETED' ? "none" : "block"
                      }}
                      onClick={() => {
                        this.validateForm(true);
                      }}
                    >
                      Finish Later
                    </button>
                  </div>

                  <div style={{ display: "flex", width: "46%" }}>
                    <button
                      className="darkBtn hide hide-on-print save-submit-btn"
                      style={{ width: "100%" }}
                      onClick={() => {
                        this.validateForm(false);
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </Row>
              </>
            )}
          </Container>
        </div>
      );
    }
  }
}

export default AwakeNightStaffSignoff;
