import React, { Component } from "react";
import FormError from "../FormMods/FormError";
import FormAlert from "../Forms/FormAlert";
import "../../App.css";
import Axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { Form } from "react-bootstrap";
import ClientOption from "../../utils/ClientOption.util";
import SignatureCanvas from "react-signature-canvas";
import { GetUserSig } from "../../utils/GetUserSig";
import { FormSuccessAlert } from "../../utils/FormSuccessAlert";
import { FormSavedAlert } from "../../utils/FormSavedAlert";
import { isAdminUser } from "../../utils/AdminReportingRoles";
import { Container, Row, Col } from "react-bootstrap";

const FORM_TITLE = "Medication Destruction";
const API_ROUTE = "/api/medicationDestruction";
const AUTO_SAVE_MS = 7000;

const DRAFT = "IN PROGRESS";
const AWAITING = "AWAITING WITNESS";
const COMPLETED = "COMPLETED";

// Mirrors DESTRUCTION_METHODS in routes/api/medicationDestruction.js.
const DESTRUCTION_METHODS = [
  "Returned to pharmacy / drug take-back",
  "Drug disposal pouch or kit",
  "Mixed with an undesirable substance and placed in trash",
  "Flushed (FDA flush list only)",
  "Other",
];

// Required before Submit (mirrors REQUIRED_FIELDS server-side).
const REQUIRED_FIELDS = [
  { key: "medicationName", label: "Medication Name" },
  { key: "quantity", label: "Quantity" },
  { key: "destructionMethod", label: "Method of Destruction" },
  { key: "destructionDate", label: "Date of Destruction" },
  { key: "witness2Id", label: "Witness 2" },
];

const localNowIso = () =>
  new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString();

const SIG_CANVAS_PROPS = { width: 300, height: 100, className: "sigCanvas" };

const serverError = (e) => e.response && e.response.data && e.response.data.error;

class MedicationDestruction extends Component {
  constructor(props) {
    super(props);
    this.autoSaveInterval = null;
    this.autoSaveCreated = false;
    this.state = {
      ...this.blankFields(),
      homeId: this.props.valuesSet === true ? "" : this.props.userObj.homeId,
      formHasError: false,
      formSubmitted: false,
      formErrorMessage: "",
      loadingClients: true,
      clients: [],
      witnesses: [],
      pendingCosign: [],
      expandedPendingId: null,
      cosignMessage: "",
    };
  }

  blankFields = () => ({
    _id: "",
    lastEditDate: null,
    childMeta_name: "",
    clientId: "",
    medicationName: "",
    quantity: "",
    destructionMethod: "",
    destructionMethodOther: "",
    destructionDate: localNowIso().slice(0, 10),
    witness1Name: "",
    witness1SignedAt: null,
    witness2Id: "",
    witness2Name: "",
    witness2SignedAt: null,
    createDate: localNowIso(),
    status: DRAFT,
    childSelected: false,
  });

  toggleSuccessAlert = () => {
    this.setState({
      formSubmitted: !this.state.formSubmitted,
      loadingClients: false,
    });
  };

  toggleErrorAlert = () => {
    this.setState({ formHasError: !this.state.formHasError, formErrorMessage: "" });
  };

  showError = (message) => {
    window.scrollTo(0, 0);
    this.setState({ formHasError: true, formErrorMessage: message, loadingClients: false });
  };

  handleFieldInput = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleFieldInputDate = (event) => {
    this.setState({ [event.target.id]: event.target.value.concat(":00.000Z") });
  };

  // Only the fields the route accepts. Witness 1 and both signatures are
  // set server-side from the verified logins, never sent from here.
  buildPayload = (status) => ({
    homeId: this.state.homeId,
    clientId: this.state.clientId,
    medicationName: this.state.medicationName,
    quantity: this.state.quantity,
    destructionMethod: this.state.destructionMethod,
    destructionMethodOther:
      this.state.destructionMethod === "Other" ? this.state.destructionMethodOther : "",
    destructionDate: this.state.destructionDate,
    witness2Id: this.state.witness2Id,
    createDate: this.state.createDate,
    status,
  });

  resetForm = () => {
    this.setState(this.blankFields());
  };

  autoSave = async () => {
    if (!this.state.clientId || this.state.status !== DRAFT) return;
    try {
      if (this.autoSaveCreated) {
        if (!this.state._id) return; // create still in flight
        const { data } = await Axios.put(
          `${API_ROUTE}/${this.state.homeId}/${this.state._id}`,
          this.buildPayload(DRAFT)
        );
        this.setState({ lastEditDate: data.lastEditDate });
      } else {
        this.autoSaveCreated = true;
        const { data } = await Axios.post(API_ROUTE, this.buildPayload(DRAFT));
        this.setState({ _id: data._id, lastEditDate: data.lastEditDate });
      }
    } catch (e) {
      console.log(e);
      if (!this.state._id) this.autoSaveCreated = false;
      this.showError(serverError(e) || `Error saving ${FORM_TITLE}`);
    }
  };

  // save=true: Finish Later (stay a draft). save=false: submit to witness 2.
  submit = async (save) => {
    const status = save ? DRAFT : AWAITING;
    clearInterval(this.autoSaveInterval);
    try {
      let data;
      if (this.props.valuesSet || this.state._id) {
        ({ data } = await Axios.put(
          `${API_ROUTE}/${this.state.homeId}/${this.state._id}`,
          this.buildPayload(status)
        ));
        if (this.props.doUpdateFormDates) this.props.doUpdateFormDates(data.createDate);
      } else {
        ({ data } = await Axios.post(API_ROUTE, this.buildPayload(status)));
      }
      this.setState({ ...data, loadingClients: false });
      window.scrollTo(0, 0);
      this.toggleSuccessAlert();
      if (!this.props.valuesSet) {
        this.autoSaveCreated = false;
        this.resetForm();
        this.startAutoSave();
      } else {
        this.drawSignatures();
      }
    } catch (e) {
      console.log(e);
      this.showError(serverError(e) || `Error submitting ${FORM_TITLE}`);
      if (!this.props.valuesSet) this.startAutoSave();
    }
  };

  validateForm = async (save) => {
    if (!save) {
      const missing = REQUIRED_FIELDS.filter(
        ({ key }) => !String(this.state[key] || "").trim()
      ).map(({ label }) => label);
      if (this.state.destructionMethod === "Other" && !this.state.destructionMethodOther.trim()) {
        missing.push("Other Method (describe)");
      }
      if (missing.length) {
        this.showError(`Please complete the following field(s): ${missing.join(", ")}`);
        return;
      }
      const { data: createdUserData } = await GetUserSig(
        this.props.userObj.email,
        this.props.userObj.homeId
      );
      if (
        !createdUserData.signature ||
        Array.isArray(createdUserData.signature) === false ||
        !createdUserData.signature.length > 0
      ) {
        this.showError(
          `User signature required to sign as a witness. Create a new signature under 'Manage Profile'.`
        );
        return;
      }
    }
    this.setState({ loadingClients: true });
    this.submit(save);
  };

  // Report view: witness 1 (or an admin) pulls a form back from
  // AWAITING WITNESS to fix it or pick a different witness.
  returnToDraft = async () => {
    if (!window.confirm("Return this form to draft? Witness 1's signature will be removed.")) {
      return;
    }
    try {
      const { data } = await Axios.put(`${API_ROUTE}/${this.state.homeId}/${this.state._id}`, {
        status: DRAFT,
      });
      this.setState({ ...data });
      this.drawSignatures();
      this.getWitnesses();
    } catch (e) {
      this.showError(serverError(e) || "Error returning form to draft");
    }
  };

  cosign = async (formId) => {
    try {
      const { data } = await Axios.post(
        `${API_ROUTE}/${this.props.userObj.homeId}/${formId}/cosign`
      );
      return data;
    } catch (e) {
      this.showError(serverError(e) || "Error co-signing form");
      return null;
    }
  };

  // Report view co-sign (witness 2 opened the form from Reports).
  cosignThisForm = async () => {
    const data = await this.cosign(this.state._id);
    if (data) {
      this.setState({ ...data });
      this.drawSignatures();
    }
  };

  // Form-page co-sign, from the "Awaiting your signature" list.
  cosignPending = async (formId) => {
    const data = await this.cosign(formId);
    if (data) {
      this.setState({
        pendingCosign: this.state.pendingCosign.filter((f) => f._id !== formId),
        expandedPendingId: null,
        cosignMessage: `Co-signed: ${data.medicationName} for ${data.childMeta_name}.`,
      });
    }
  };

  startAutoSave = () => {
    clearInterval(this.autoSaveInterval);
    this.autoSaveInterval = setInterval(this.autoSave, AUTO_SAVE_MS);
  };

  componentWillUnmount() {
    clearInterval(this.autoSaveInterval);
  }

  drawSignatures = () => {
    [
      [this.witness1Canvas, this.state.witness1Sig],
      [this.witness2Canvas, this.state.witness2Sig],
    ].forEach(([canvas, sig]) => {
      if (!canvas) return;
      canvas.clear();
      if (Array.isArray(sig) && sig.length) canvas.fromData(sig);
      canvas.off();
    });
  };

  setValues = async () => {
    await this.setState({ ...this.props.formData, loadingClients: false });
    this.drawSignatures();
    if (this.state.status === DRAFT) this.getWitnesses();
  };

  getClients = async () => {
    try {
      let { data: clients } = await Axios.get(
        `/api/client/${this.props.userObj.homeId}?active=true`
      );
      clients = clients.filter((client) => {
        return !client.hasOwnProperty("active") || client.active === true;
      });
      this.setState({ clients, loadingClients: false });
    } catch (e) {
      console.log(e);
      alert("Error loading clients");
    }
  };

  getWitnesses = async () => {
    try {
      const { data } = await Axios.get(
        `${API_ROUTE}/${this.props.userObj.homeId}/witnesses`
      );
      this.setState({ witnesses: data });
    } catch (e) {
      console.log(e);
    }
  };

  getPendingCosign = async () => {
    try {
      const { data } = await Axios.get(
        `${API_ROUTE}/${this.props.userObj.homeId}/pendingCosign`
      );
      this.setState({ pendingCosign: data });
    } catch (e) {
      console.log(e);
    }
  };

  async componentDidMount() {
    if (this.props.valuesSet) {
      this.setValues();
    } else {
      this.getWitnesses();
      this.getPendingCosign();
      await this.getClients();
      this.startAutoSave();
    }
  }

  handleClientSelect = (event) => {
    if (!event.target.value) return;
    const client = JSON.parse(event.target.value);
    this.setState({
      childSelected: true,
      childMeta_name: client.childMeta_name,
      clientId: client._id,
    });
  };

  // Details are editable only while the form is a draft.
  isLocked = () =>
    !!(this.props.valuesSet && (this.state.status !== DRAFT || this.state.approved));

  isDisabled = () => {
    if (this.isLocked()) return true;
    return !this.props.valuesSet && !this.state.childSelected;
  };

  formatDateTime = (value) => (value ? new Date(value).toLocaleString() : "");

  renderField = (id, label, md, input) => (
    <Col md={md} className="print-column">
      <div className="form-group logInInputField">
        <label className="control-label" htmlFor={id}>
          {label}
        </label>{" "}
        {input}
      </div>
    </Col>
  );

  renderTextInput = (id, placeholder) => (
    <input
      id={id}
      onChange={this.handleFieldInput}
      value={this.state[id] || ""}
      className="form-control"
      type="text"
      placeholder={placeholder}
      disabled={this.isDisabled()}
    />
  );

  renderWitnesses = () => {
    const locked = this.isLocked();
    const disabled = this.isDisabled();
    const userId = this.props.userObj._id;
    const canCosign =
      this.props.valuesSet && this.state.status === AWAITING && this.state.witness2Id === userId;
    const canReturnToDraft =
      this.props.valuesSet &&
      this.state.status === AWAITING &&
      !this.state.approved &&
      (this.state.witness1Id === userId || isAdminUser(this.props.userObj));
    return (
      <Row>
        <Col md={6} className="print-column">
          <div className="form-group logInInputField">
            <label className="control-label">Witness 1 (submitting staff)</label>
            <p className="mb-1">
              {this.state.witness1Name ||
                (this.props.valuesSet ? "Not yet signed" : "You - signed when you submit")}
            </p>
            {this.props.valuesSet && (
              <>
                <div id="sigCanvasDiv">
                  <SignatureCanvas
                    ref={(ref) => {
                      this.witness1Canvas = ref;
                    }}
                    style={{ border: "solid" }}
                    penColor="black"
                    clearOnResize={false}
                    canvasProps={SIG_CANVAS_PROPS}
                    backgroundColor="#eeee"
                  />
                </div>
                <small className="text-muted">
                  {this.formatDateTime(this.state.witness1SignedAt)}
                </small>
              </>
            )}
          </div>
        </Col>
        <Col md={6} className="print-column">
          <div className="form-group logInInputField">
            <label className="control-label" htmlFor="witness2Id">
              Witness 2 (staff)
            </label>
            {locked ? (
              <p className="mb-1">{this.state.witness2Name}</p>
            ) : (
              <Form.Control
                as="select"
                id="witness2Id"
                value={this.state.witness2Id}
                onChange={this.handleFieldInput}
                disabled={disabled}
              >
                <option value="">Choose...</option>
                {/* Keep a saved witness selectable even if they've since
                    dropped out of the list (e.g. deactivated). */}
                {this.state.witness2Id &&
                  !this.state.witnesses.some((w) => w._id === this.state.witness2Id) && (
                    <option value={this.state.witness2Id}>{this.state.witness2Name}</option>
                  )}
                {this.state.witnesses.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.name}
                  </option>
                ))}
              </Form.Control>
            )}
            {this.props.valuesSet && (
              <>
                <div
                  id="sigCanvasDiv"
                  style={{ display: this.state.witness2SignedAt ? "block" : "none" }}
                >
                  <SignatureCanvas
                    ref={(ref) => {
                      this.witness2Canvas = ref;
                    }}
                    style={{ border: "solid" }}
                    penColor="black"
                    clearOnResize={false}
                    canvasProps={SIG_CANVAS_PROPS}
                    backgroundColor="#eeee"
                  />
                </div>
                <small className="text-muted">
                  {this.state.witness2SignedAt
                    ? this.formatDateTime(this.state.witness2SignedAt)
                    : this.state.status === AWAITING
                    ? "Awaiting witness 2's signature"
                    : ""}
                </small>
              </>
            )}
            {!this.props.valuesSet && (
              <small className="text-muted d-block">
                They'll co-sign from their own login. Only staff with a signature on file are
                listed.
              </small>
            )}
          </div>
        </Col>
        {(canCosign || canReturnToDraft) && (
          <Col md={12} className="hide-on-print d-flex" style={{ gap: 10 }}>
            {canCosign && (
              <button className="darkBtn" onClick={this.cosignThisForm}>
                Co-sign as Witness 2
              </button>
            )}
            {canReturnToDraft && (
              <button className="lightBtn" onClick={this.returnToDraft}>
                Return to Draft
              </button>
            )}
          </Col>
        )}
      </Row>
    );
  };

  renderFields = () => {
    const disabled = this.isDisabled();
    const isAdmin = isAdminUser(this.props.userObj);
    return (
      <Container className="print-container">
        <Row>
          <Col md={6} className="print-column">
            <div className="form-group logInInputField">
              <label className="control-label">Create Date</label>{" "}
              <input
                id="createDate"
                onChange={this.handleFieldInputDate}
                value={this.state.createDate ? this.state.createDate.slice(0, -8) : ""}
                className="form-control"
                type="datetime-local"
                // Back-dating a saved record is admin/supervisor only
                // (utils/applyCreateDateEdit.js server-side).
                disabled={this.props.valuesSet ? !isAdmin : false}
              />
            </div>
          </Col>
          <Col md={6} className="print-column">
            <div className="form-group logInInputField">
              <label className="control-label">Child's Name</label>{" "}
              {this.props.valuesSet ? (
                <input
                  id="childMeta_name"
                  value={this.state.childMeta_name}
                  className="form-control"
                  type="text"
                  disabled
                />
              ) : (
                <Form.Control as="select" defaultValue={null} onChange={this.handleClientSelect}>
                  {[null, ...this.state.clients].map((client) => (
                    <ClientOption key={client ? client._id : "none"} data={client} />
                  ))}
                </Form.Control>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          {this.renderField(
            "medicationName",
            "Medication Name",
            6,
            this.renderTextInput("medicationName", "Name and strength, e.g. Sertraline 50 mg")
          )}
          {this.renderField("quantity", "Quantity", 6, this.renderTextInput("quantity", "e.g. 12 tablets"))}
        </Row>
        <Row>
          {this.renderField(
            "destructionDate",
            "Date of Destruction",
            6,
            <input
              id="destructionDate"
              onChange={this.handleFieldInput}
              value={this.state.destructionDate || ""}
              className="form-control"
              type="date"
              max={localNowIso().slice(0, 10)}
              disabled={disabled}
            />
          )}
          {this.renderField(
            "destructionMethod",
            "Method of Destruction",
            6,
            <Form.Control
              as="select"
              id="destructionMethod"
              value={this.state.destructionMethod}
              onChange={this.handleFieldInput}
              disabled={disabled}
            >
              <option value="">Choose...</option>
              {DESTRUCTION_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </Form.Control>
          )}
        </Row>
        {this.state.destructionMethod === "Other" && (
          <Row>
            <Col md={6} className="print-column" />
            {this.renderField(
              "destructionMethodOther",
              "Other Method (describe)",
              6,
              this.renderTextInput("destructionMethodOther")
            )}
          </Row>
        )}
        {this.renderWitnesses()}
      </Container>
    );
  };

  renderSaveButtons = () => {
    const disabled = this.isDisabled();
    return (
      <>
        <FormError errorId={this.props.id + "-error"} />
        <Row className="save-submit-row">
          <div style={{ display: "flex", width: "46%" }}>
            <button
              className="lightBtn hide hide-on-print save-submit-btn"
              style={{ width: "100%" }}
              disabled={disabled}
              onClick={() => this.validateForm(true)}
            >
              Finish Later
            </button>
          </div>
          <div style={{ display: "flex", width: "46%" }}>
            <button
              className="darkBtn hide hide-on-print save-submit-btn"
              style={{ width: "100%" }}
              disabled={disabled}
              onClick={() => this.validateForm(false)}
            >
              Sign &amp; Send to Witness 2
            </button>
          </div>
        </Row>
      </>
    );
  };

  renderPendingCosign = () => {
    if (!this.state.pendingCosign.length && !this.state.cosignMessage) return null;
    return (
      <div className="form-group logInInputField hide-on-print" style={{ margin: "0 15px 20px" }}>
        {this.state.cosignMessage && (
          <div className="alert alert-success">{this.state.cosignMessage}</div>
        )}
        {this.state.pendingCosign.length > 0 && (
          <>
            <h5>Awaiting your signature as Witness 2</h5>
            {this.state.pendingCosign.map((form) => {
              const expanded = this.state.expandedPendingId === form._id;
              return (
                <div key={form._id} className="border rounded p-2 mb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>
                      <strong>{form.medicationName}</strong> for {form.childMeta_name} -
                      submitted by {form.witness1Name}
                    </span>
                    <button
                      className="lightBtn"
                      onClick={() =>
                        this.setState({ expandedPendingId: expanded ? null : form._id })
                      }
                    >
                      {expanded ? "Hide" : "Review"}
                    </button>
                  </div>
                  {expanded && (
                    <div className="mt-2">
                      <p className="mb-1">Quantity: {form.quantity}</p>
                      <p className="mb-1">
                        Method: {form.destructionMethod}
                        {form.destructionMethodOther ? ` - ${form.destructionMethodOther}` : ""}
                      </p>
                      <p className="mb-1">Date of destruction: {form.destructionDate}</p>
                      <p className="mb-2">
                        Witness 1 signed: {this.formatDateTime(form.witness1SignedAt)}
                      </p>
                      <button className="darkBtn" onClick={() => this.cosignPending(form._id)}>
                        I witnessed this - Co-sign
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  };

  renderAlerts = () =>
    this.state.formSubmitted || this.state.formHasError ? (
      <React.Fragment>
        {this.state.formSubmitted &&
          (this.props.valuesSet ? <FormSavedAlert /> : <FormSuccessAlert />)}
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
    );

  renderLoading = () => (
    <div className="formLoadingDiv">
      <div>
        <ClipLoader className="formSpinner" size={50} color={"#ffc107"} />
      </div>
      <p>Loading...</p>
    </div>
  );

  render() {
    if (!this.props.valuesSet) {
      return (
        <div className="formComp">
          {this.renderAlerts()}
          <div className="formTitleDiv">
            <h2 className="formTitle">{FORM_TITLE}</h2>
            <h5 className="text-center" style={{ color: "rgb(119 119 119 / 93%)" }}>
              {this.state.lastEditDate ? (
                <i>
                  {" "}
                  Last Saved:
                  {`${new Date(this.state.lastEditDate)
                    .toTimeString()
                    .replace(/\s.*/, "")} - ${new Date(this.state.lastEditDate).toDateString()}`}
                </i>
              ) : (
                "-"
              )}
            </h5>
          </div>
          {this.renderPendingCosign()}
          {this.state.loadingClients && this.renderLoading()}
          <div style={{ display: this.state.loadingClients ? "none" : "block" }}>
            {this.renderFields()}
            {this.renderSaveButtons()}
          </div>
        </div>
      );
    }

    return (
      <div className="formComp">
        {this.renderAlerts()}
        <div className="formTitleDivReport">
          <h2 className="formTitle">{FORM_TITLE}</h2>
          <h6 className="text-center">
            {this.state.status === AWAITING
              ? "Awaiting witness 2's signature"
              : this.state.status === COMPLETED
              ? "Both witnesses signed"
              : "Draft"}
          </h6>
        </div>
        <div className="formFieldsMobileReport">
          {this.state.loadingClients && this.renderLoading()}
          <div style={{ display: this.state.loadingClients ? "none" : "block" }}>
            {this.renderFields()}
            {!this.isLocked() && this.renderSaveButtons()}
          </div>
        </div>
      </div>
    );
  }
}

export default MedicationDestruction;
