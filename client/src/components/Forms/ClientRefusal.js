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
import TextareaAutosize from "react-textarea-autosize";
import { Container, Row, Col } from "react-bootstrap";

const FORM_TITLE = "Client Refusal";
const API_ROUTE = "/api/clientRefusal";
const AUTO_SAVE_MS = 7000;

const localNowIso = () =>
  new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString();

// "YYYY-MM-DDTHH:mm" for a datetime-local input.
const localNowInput = () => localNowIso().slice(0, 16);

// Required before Submit (Finish Later saves whatever is there).
const REQUIRED_FIELDS = [
  { key: "refusedItem", label: "What Was Refused" },
  { key: "refusalDateTime", label: "Date/Time of Refusal" },
  { key: "reason", label: "Reason for Refusal" },
  { key: "staffDocumenting", label: "Staff Member Documenting" },
  { key: "followUpAction", label: "Follow-Up Action" },
];

class ClientRefusal extends Component {
  constructor(props) {
    super(props);
    this.autoSaveInterval = null;
    this.autoSaveCreated = false;
    this.state = {
      ...this.blankFields(),
      createdBy: this.props.valuesSet === true ? "" : this.props.userObj.email,
      createdByName:
        this.props.valuesSet === true
          ? ""
          : this.props.userObj.firstName + " " + this.props.userObj.lastName,
      homeId: this.props.valuesSet === true ? "" : this.props.userObj.homeId,
      formHasError: false,
      formSubmitted: false,
      formErrorMessage: "",
      loadingClients: true,
      clients: [],
    };
  }

  blankFields = () => ({
    _id: "",
    lastEditDate: null,
    childMeta_name: "",
    clientId: "",
    refusedItem: "",
    refusalDateTime: localNowInput(),
    reason: "",
    // Prefilled with whoever is entering the form; editable, since the
    // staff member who documented the refusal isn't always the one entering it.
    staffDocumenting: this.props.userObj
      ? `${this.props.userObj.firstName} ${this.props.userObj.lastName}`
      : "",
    followUpAction: "",
    createDate: localNowIso(),
    status: "IN PROGRESS",
    childSelected: false,
  });

  toggleSuccessAlert = () => {
    this.setState({
      formSubmitted: !this.state.formSubmitted,
      loadingClients: false,
    });
  };

  toggleErrorAlert = () => {
    this.setState({
      formHasError: !this.state.formHasError,
      formErrorMessage: "",
    });
  };

  showError = (message) => {
    window.scrollTo(0, 0);
    this.setState({
      formHasError: true,
      formErrorMessage: message,
      loadingClients: false,
    });
  };

  handleFieldInput = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleFieldInputDate = (event) => {
    this.setState({ [event.target.id]: event.target.value.concat(":00.000Z") });
  };

  // Only the fields the route accepts - never UI state like clients or
  // alert flags, and never identity/approval fields, which the server
  // sets from the verified login.
  buildPayload = (status) => ({
    homeId: this.state.homeId,
    childMeta_name: this.state.childMeta_name,
    clientId: this.state.clientId,
    refusedItem: this.state.refusedItem,
    refusalDateTime: this.state.refusalDateTime,
    reason: this.state.reason,
    staffDocumenting: this.state.staffDocumenting,
    followUpAction: this.state.followUpAction,
    createDate: this.state.createDate,
    status,
  });

  resetForm = () => {
    this.setState(this.blankFields());
  };

  autoSave = async () => {
    if (!this.state.childMeta_name) return;
    try {
      if (this.autoSaveCreated) {
        // The create is still in flight - nothing to update yet.
        if (!this.state._id) return;
        const { data } = await Axios.put(
          `${API_ROUTE}/${this.state.homeId}/${this.state._id}`,
          this.buildPayload(this.state.status)
        );
        this.setState({ lastEditDate: data.lastEditDate });
      } else {
        // Set before the request resolves so a slow create can't be
        // followed by a second create on the next tick.
        this.autoSaveCreated = true;
        const { data } = await Axios.post(API_ROUTE, this.buildPayload(this.state.status));
        this.setState({ _id: data._id, lastEditDate: data.lastEditDate });
      }
    } catch (e) {
      console.log(e);
      if (!this.state._id) this.autoSaveCreated = false;
      const serverMessage = e.response && e.response.data && e.response.data.error;
      this.showError(serverMessage || `Error saving ${FORM_TITLE}`);
    }
  };

  submit = async (save) => {
    const status = save ? this.state.status : "COMPLETED";
    clearInterval(this.autoSaveInterval);
    try {
      if (this.props.valuesSet || this.state._id) {
        const { data } = await Axios.put(
          `${API_ROUTE}/${this.state.homeId}/${this.state._id}`,
          this.buildPayload(status)
        );
        this.setState({ ...data, loadingClients: false });
        if (this.props.doUpdateFormDates) {
          this.props.doUpdateFormDates(data.createDate);
        }
      } else {
        const { data } = await Axios.post(API_ROUTE, this.buildPayload(status));
        this.setState({ ...data, loadingClients: false });
      }
      window.scrollTo(0, 0);
      this.toggleSuccessAlert();
      if (!this.props.valuesSet) {
        // A fresh blank form for the next refusal - drop the saved record
        // and restart autosave from scratch.
        this.autoSaveCreated = false;
        this.resetForm();
        this.startAutoSave();
      }
    } catch (e) {
      console.log(e);
      const serverMessage = e.response && e.response.data && e.response.data.error;
      this.showError(serverMessage || `Error submitting ${FORM_TITLE}`);
    }
  };

  validateForm = async (save) => {
    if (!save) {
      const missing = REQUIRED_FIELDS.filter(
        ({ key }) => !String(this.state[key] || "").trim()
      ).map(({ label }) => label);
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
          `User signature required to submit a form. Create a new signature under 'Manage Profile'.`
        );
        return;
      }
    }
    this.setState({ loadingClients: true });
    this.submit(save);
  };

  startAutoSave = () => {
    clearInterval(this.autoSaveInterval);
    this.autoSaveInterval = setInterval(this.autoSave, AUTO_SAVE_MS);
  };

  componentWillUnmount() {
    clearInterval(this.autoSaveInterval);
  }

  setValues = async () => {
    const formData = this.props.formData;
    await this.setState({
      ...formData,
      loadingClients: false,
    });

    try {
      const { data: createdUserData } = await GetUserSig(
        // The signer is whoever submitted the form (older records: its creator).
        formData.submittedBy || formData.createdBy,
        this.props.userObj.homeId
      );
      if (this.staffSigCanvas && createdUserData.signature && createdUserData.signature.length) {
        this.staffSigCanvas.fromData(createdUserData.signature);
      }
      if (this.staffSigCanvas) this.staffSigCanvas.off();
    } catch (e) {
      console.log(e);
    }
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

  async componentDidMount() {
    if (this.props.valuesSet) {
      this.setValues();
    } else {
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

  // Approved records are read-only (the route rejects non-admin edits to
  // them, and the save buttons are hidden once approved).
  isLocked = () => {
    if (!this.props.valuesSet) return false;
    const { formData, userObj } = this.props;
    if (formData.approved) return true;
    // Mirrors canEditForm in utils/formIntegrity.js: a submitted form is
    // read-only except to its author or an admin.
    if (formData.status !== "COMPLETED" || isAdminUser(userObj)) return false;
    // The signer: whoever submitted it, else (older records) its creator.
    const isAuthor = formData.submittedById
      ? formData.submittedById === userObj._id
      : formData.createdById
      ? formData.createdById === userObj._id
      : formData.createdBy === userObj.email;
    return !isAuthor;
  };

  isDisabled = () => {
    if (this.isLocked()) return true;
    return !this.props.valuesSet && !this.state.childSelected;
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
                // Back-dating an already-saved record is admin/supervisor
                // only (see utils/applyCreateDateEdit.js server-side).
                disabled={this.props.valuesSet ? !isAdmin : false}
                title={
                  this.props.valuesSet && !isAdmin
                    ? "Only an admin or supervisor can change the creation date after a form has been saved."
                    : undefined
                }
              />{" "}
              {this.state.createDateEditedBy && (
                <small className="text-muted d-block mt-1">
                  Creation date corrected by {this.state.createDateEditedBy}
                  {this.state.createDateEditedAt
                    ? ` on ${new Date(this.state.createDateEditedAt).toLocaleString()}`
                    : ""}
                  {this.state.originalCreateDate
                    ? ` (originally ${new Date(this.state.originalCreateDate).toLocaleString()})`
                    : ""}
                </small>
              )}
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
          <Col md={4} className="print-column">
            <div className="form-group logInInputField">
              <label className="control-label">What Was Refused</label>{" "}
              <input
                id="refusedItem"
                onChange={this.handleFieldInput}
                value={this.state.refusedItem}
                className="form-control"
                type="text"
                placeholder="e.g. medication, meal, school, appointment"
                disabled={disabled}
              />
            </div>
          </Col>
          <Col md={4} className="print-column">
            <div className="form-group logInInputField">
              <label className="control-label">Date/Time of Refusal</label>{" "}
              <input
                id="refusalDateTime"
                onChange={this.handleFieldInput}
                value={this.state.refusalDateTime}
                className="form-control"
                type="datetime-local"
                disabled={disabled}
              />
            </div>
          </Col>
          <Col md={4} className="print-column">
            <div className="form-group logInInputField">
              <label className="control-label">Staff Member Documenting</label>{" "}
              <input
                id="staffDocumenting"
                onChange={this.handleFieldInput}
                value={this.state.staffDocumenting}
                className="form-control"
                type="text"
                disabled={disabled}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="print-column">
            <div className="form-group logInInputField">
              <label className="control-label">Reason for Refusal</label>{" "}
              <TextareaAutosize
                id="reason"
                onChange={this.handleFieldInput}
                value={this.state.reason}
                className="form-control"
                minRows={3}
                placeholder="The child's stated reason, in their words where possible"
                disabled={disabled}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="print-column">
            <div className="form-group logInInputField">
              <label className="control-label">Follow-Up Action</label>{" "}
              <TextareaAutosize
                id="followUpAction"
                onChange={this.handleFieldInput}
                value={this.state.followUpAction}
                className="form-control"
                minRows={3}
                placeholder="e.g. re-offered later, nurse/prescriber notified, caseworker notified"
                disabled={disabled}
              />
            </div>
          </Col>
        </Row>
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
              style={{
                width: "100%",
                display: this.state.status === "COMPLETED" ? "none" : "block",
              }}
              disabled={disabled}
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
              disabled={disabled}
              onClick={() => {
                this.validateForm(false);
              }}
            >
              Submit
            </button>
          </div>
        </Row>
      </>
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
            <h5 className="text-center hide-on-print" style={{ color: "rgb(119 119 119 / 93%)" }}>
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
          {/* Kept mounted (just hidden) while loading, matching the
              report view below. */}
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
        </div>
        <div className="formFieldsMobileReport">
          {this.state.loadingClients && this.renderLoading()}
          <div style={{ display: this.state.loadingClients ? "none" : "block" }}>
            {this.renderFields()}
            <div
              className="sigSection"
              style={{ display: this.state.status === "IN PROGRESS" ? "none" : "block" }}
            >
              <label className="control-label">Staff Signature</label>{" "}
              <div id="sigCanvasDiv">
                <SignatureCanvas
                  ref={(ref) => {
                    this.staffSigCanvas = ref;
                  }}
                  style={{ border: "solid" }}
                  penColor="black"
                  clearOnResize={false}
                  canvasProps={{ width: 300, height: 100, className: "sigCanvas" }}
                  backgroundColor="#eeee"
                />
              </div>
              <small className="text-muted">
                {this.state.submittedByName || this.state.createdByName}
                {/* Creation date, not last-edited date - only the creation date
                    appears on a printed form. */}
                {this.state.createDate
                  ? ` - ${new Date(this.state.createDate).toLocaleDateString()}`
                  : ""}
              </small>
            </div>
            {!this.isLocked() && this.renderSaveButtons()}
          </div>
        </div>
      </div>
    );
  }
}

export default ClientRefusal;
