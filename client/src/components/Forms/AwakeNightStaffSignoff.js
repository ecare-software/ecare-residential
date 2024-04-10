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
      ts41Approval: false,
      ts42Approval: false,
      ts43Approval: false,
      ts44Approval: false,

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

      createDate: new Date().toISOString(),
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
      ts41Approval: false,
      ts42Approval: false,
      ts43Approval: false,
      ts44Approval: false,
      status: "IN PROGRESS",
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
    let i = 44;
    const { data: userSig } = await GetUserSig(email, homeId);
    if (userSig.signature) {
      for (let x = 1; x <= i; x++) {
        this[`sigCanvas${x}`].fromData(userSig.signature);
        this[`sigCanvas${x}`].off();
      }
    }
    this.setState({
      ...this.state,
      loadingSig: false,
      userSig: userSig.signature ?? [],
    });
  };

  createDateTimeStamp = () =>
    new Date(new Date(this.state.createDate).getTime()).toLocaleString(
      "en-us",
      { timeZone: "UTC" }
    );

  setValues = async () => {
    let i = 44;
    const { data: createdUserData } = await GetUserSig(
      this.props.formData.createdBy,
      this.props.userObj.homeId
    );
    if (createdUserData.signature) {
      for (let x = 1; x <= i; x++) {
        this[`sigCanvas${x}`].fromData(createdUserData.signature);
        this[`sigCanvas${x}`].off();
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
            <p>{this.createDateTimeStamp()}</p>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts1Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas1 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts2Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas2 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts3Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas3 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts4Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas4 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts5Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas5 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts6Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas6 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts7Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas7 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts8Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas8 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts9Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas9 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts10Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas10 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts11Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas11 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts12Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas12 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts13Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas13 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts14Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas14 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts15Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas15 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts16Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas16 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts17Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas17 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts18Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas18 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts19Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas19 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts20Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas20 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts21Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas21 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts22Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas22 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts23Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas23 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts24Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas24 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts25Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas25 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts26Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas26 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts27Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas27 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts28Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas28 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts29Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas29 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts30Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas30 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts31Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas31 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts32Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas32 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts33Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas33 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts34Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas34 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts35Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas35 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts36Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas36 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts37Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas37 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts38Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas38 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts39Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas39 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts40Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas40 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts41Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas41 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts42Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas42 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts43Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas43 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts44Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas44 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
                </Row>
              </Col>
            </Row>

            <FormError errorId={this.props.id + "-error"} />
            <div
              className="form-group logInInputField"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <button
                className="lightBtn hide-on-print"
                onClick={() => {
                  this.validateForm(true);
                }}
              >
                Finish Later
              </button>

              <button
                className="darkBtn hide-on-print"
                onClick={() => {
                  this.validateForm(false);
                }}
              >
                Submit
              </button>
            </div>
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
            <p>{this.createDateTimeStamp()}</p>
          </div>

          <Container className="print-container">
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts1Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas1 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts2Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas2 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts3Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas3 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts4Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas4 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts5Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas5 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts6Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas6 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts7Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas7 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts8Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas8 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts9Approval ? "visible" : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas9 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts10Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas10 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts11Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas11 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts12Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas12 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts13Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas13 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts14Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas14 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts15Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas15 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts16Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas16 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts17Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas17 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts18Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas18 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts19Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas19 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts20Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas20 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts21Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas21 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts22Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas22 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts23Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas23 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts24Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas24 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts25Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas25 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts26Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas26 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts27Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas27 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts28Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas28 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts29Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas29 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts30Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas30 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts31Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas31 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts32Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas32 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts33Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas33 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts34Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas34 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts35Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas35 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts36Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas36 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts37Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas37 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts38Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas38 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts39Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas39 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts40Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas40 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts41Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas41 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts42Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas42 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts43Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas43 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      maxHeight: "170",
                      justifyContent: "center",
                      visibility: this.state.ts44Approval
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <SignatureCanvas
                      ref={(ref) => {
                        this.sigCanvas44 = ref;
                      }}
                      style={{ border: "solid" }}
                      penColor="black"
                      clearOnResize={false}
                      canvasProps={{
                        width: 600,
                        height: 100,
                        className: "sigCanvas",
                      }}
                      backgroundColor="#eeee"
                    />
                  </div>
                </Row>
              </Col>
            </Row>

            {!this.props.formData.approved && (
              <>
                <FormError errorId={this.props.id + "-error"} />
                <div
                  className="form-group logInInputField"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <button
                    className="lightBtn hide-on-print"
                    onClick={() => {
                      this.validateForm(true);
                    }}
                  >
                    Save
                  </button>

                  {/* <button
                    className='darkBtn'
                    onClick={() => {
                      this.validateForm(false);
                    }}
                  >
                    Submit
                  </button> */}
                </div>
              </>
            )}
          </Container>
        </div>
      );
    }
  }
}

export default AwakeNightStaffSignoff;
