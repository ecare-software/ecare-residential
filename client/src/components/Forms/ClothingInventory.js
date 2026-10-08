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

const FORM_TITLE = "Monthly Clothing Inventory";
const API_ROUTE = "/api/clothingInventory";

// Rows of the paper form, top to bottom. "other" rows have a
// staff-entered item name (the blank lines under OTHER).
const CLOTHING_ROWS = [
  ["tShirts", "T-Shirts", "main"],
  ["underwear", "Underwear", "main"],
  ["bras", "Bras", "main"],
  ["pjs", "PJ's", "main"],
  ["robe", "Robe", "main"],
  ["socks", "Socks", "main"],
  ["schoolShoes", "School Shoes", "main"],
  ["dressShoes", "Dress Shoes", "main"],
  ["tennisShoes", "Tennis Shoes", "main"],
  ["blouses", "Blouses", "main"],
  ["dresses", "Dresses", "main"],
  ["jeans", "Jeans", "main"],
  ["dressSlacks", "Dress Slacks", "main"],
  ["sweatshirtJacket", "Sweatshirt / Jacket", "main"],
  ["swimsuits", "Swimsuits", "main"],
  ["gymSuit", "Gym Suit", "main"],
  ["shorts", "Shorts", "seasonal"],
  ["winterCoatHatGloves", "Winter Coat / Hat / Gloves", "seasonal"],
  ["boots", "Boots", "seasonal"],
  ["other1", "", "other"],
  ["other2", "", "other"],
];

const HYGIENE_ROWS = [
  ["bodySoap", "Body Soap", false],
  ["shampooConditioner", "Hair Shampoo/Conditioner", false],
  ["combBrush", "Comb/Brush", false],
  ["hairProducts", "Hair Products", false],
  ["deodorant", "Deodorant", false],
  ["bodyLotion", "Body Lotion", false],
  ["hygieneOther1", "", true],
  ["hygieneOther2", "", true],
];

const COUNT_COLUMNS = [
  ["startCount", "No. of Items from Child's Clothing Supply"],
  ["newCount", "Plus: New"],
  ["usedCount", "Plus: Used"],
  ["willNotFit", "Minus: Will not Fit"],
  ["lost", "Minus: Lost"],
  ["destroyed", "Minus: Destroyed"],
];

const HYGIENE_STATUSES = [
  ["have", "Have"],
  ["almostOut", "Almost Out"],
  ["need", "Need"],
];

const CLOTHING_SECTIONS = [
  ["main", null],
  ["seasonal", "Seasonal"],
  ["other", "Other"],
];

const AUTO_SAVE_MS = 7000;

const defaultClothingItems = () =>
  CLOTHING_ROWS.map(([key, item, category]) => ({
    key,
    item,
    category,
    startCount: null,
    newCount: null,
    usedCount: null,
    willNotFit: null,
    lost: null,
    destroyed: null,
    total: null,
  }));

const defaultHygieneItems = () =>
  HYGIENE_ROWS.map(([key, item, custom]) => ({ key, item, custom, status: "" }));

const defaultClientSignatures = () => [
  { sig: [], date: "" },
  { sig: [], date: "" },
];

const localNowIso = () =>
  new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString();

// Mirrors computeClothingTotal in routes/api/clothingInventory.js, which
// recomputes and stores the authoritative value on every save.
const computeTotal = (row) => {
  const plus = [row.startCount, row.newCount, row.usedCount];
  const minus = [row.willNotFit, row.lost, row.destroyed];
  if ([...plus, ...minus].every((v) => v === null || v === undefined)) return null;
  const sum = (values) => values.reduce((acc, v) => acc + (v || 0), 0);
  return sum(plus) - sum(minus);
};

// Records saved before a row was added to CLOTHING_ROWS/HYGIENE_ROWS (or
// with rows missing) still render every row of the current form.
const mergeRows = (defaults, saved) => {
  if (!Array.isArray(saved) || saved.length === 0) return defaults;
  const savedByKey = saved.reduce((acc, row) => {
    acc[row.key] = row;
    return acc;
  }, {});
  const merged = defaults.map((row) => ({ ...row, ...(savedByKey[row.key] || {}) }));
  const extra = saved.filter((row) => !defaults.some((d) => d.key === row.key));
  return [...merged, ...extra];
};

class ClothingInventory extends Component {
  constructor(props) {
    super(props);
    this.clientSigCanvases = [];
    this.autoSaveInterval = null;
    this.autoSaveCreated = false;
    // The autosave request currently running, if any - Submit waits for it
    // (see submit) so it can't race the autosave's create or edit.
    this.autoSaveInFlight = null;
    // Bumped whenever the form is cleared for a new entry, so a late
    // autosave response can't attach the old record to the blank form.
    this.formGeneration = 0;
    this.state = {
      childMeta_name: "",
      clientId: "",
      monthOf: "",
      inventoryDate: "",
      clothingItems: defaultClothingItems(),
      hygieneItems: defaultHygieneItems(),
      clientSignatures: defaultClientSignatures(),
      notes: "",
      createdBy: this.props.valuesSet === true ? "" : this.props.userObj.email,
      createdByName:
        this.props.valuesSet === true
          ? ""
          : this.props.userObj.firstName + " " + this.props.userObj.lastName,
      lastEditDate: null,
      homeId: this.props.valuesSet === true ? "" : this.props.userObj.homeId,
      formHasError: false,
      formSubmitted: false,
      formErrorMessage: "",
      loadingClients: true,
      clients: [],
      createDate: localNowIso(),
      status: "IN PROGRESS",
      childSelected: false,
    };
  }

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

  handleClothingCount = (index, field, rawValue) => {
    let value = null;
    if (rawValue !== "") {
      value = parseInt(rawValue, 10);
      if (Number.isNaN(value) || value < 0) return;
    }
    const clothingItems = [...this.state.clothingItems];
    const row = { ...clothingItems[index], [field]: value };
    row.total = computeTotal(row);
    clothingItems[index] = row;
    this.setState({ clothingItems });
  };

  handleRowName = (listName, index, value) => {
    const rows = [...this.state[listName]];
    rows[index] = { ...rows[index], item: value };
    this.setState({ [listName]: rows });
  };

  handleHygieneStatus = (index, status) => {
    const hygieneItems = [...this.state.hygieneItems];
    hygieneItems[index] = { ...hygieneItems[index], status };
    this.setState({ hygieneItems });
  };

  handleClientSigDate = (index, date) => {
    const clientSignatures = [...this.state.clientSignatures];
    clientSignatures[index] = { ...clientSignatures[index], date };
    this.setState({ clientSignatures });
  };

  captureClientSig = (index) => {
    const canvas = this.clientSigCanvases[index];
    if (!canvas) return;
    const clientSignatures = [...this.state.clientSignatures];
    clientSignatures[index] = { ...clientSignatures[index], sig: canvas.toData() };
    this.setState({ clientSignatures });
  };

  clearClientSig = (index) => {
    const canvas = this.clientSigCanvases[index];
    if (canvas) canvas.clear();
    const clientSignatures = [...this.state.clientSignatures];
    clientSignatures[index] = { ...clientSignatures[index], sig: [] };
    this.setState({ clientSignatures });
  };

  loadClientSigs = (clientSignatures) => {
    clientSignatures.forEach((entry, index) => {
      const canvas = this.clientSigCanvases[index];
      if (canvas && Array.isArray(entry.sig) && entry.sig.length) {
        canvas.fromData(entry.sig);
      }
    });
  };

  // Only the fields the route accepts - never UI state like clients or
  // alert flags, and never identity/approval fields, which the server
  // sets from the verified login.
  buildPayload = (status) => ({
    homeId: this.state.homeId,
    childMeta_name: this.state.childMeta_name,
    clientId: this.state.clientId,
    monthOf: this.state.monthOf,
    inventoryDate: this.state.inventoryDate,
    clothingItems: this.state.clothingItems,
    hygieneItems: this.state.hygieneItems,
    clientSignatures: this.state.clientSignatures,
    notes: this.state.notes,
    createDate: this.state.createDate,
    status,
  });

  resetForm = () => {
    this.formGeneration += 1;
    this.clientSigCanvases.forEach((canvas) => canvas && canvas.clear());
    this.setState({
      _id: "",
      lastEditDate: null,
      childMeta_name: "",
      clientId: "",
      monthOf: "",
      inventoryDate: "",
      clothingItems: defaultClothingItems(),
      hygieneItems: defaultHygieneItems(),
      clientSignatures: defaultClientSignatures(),
      notes: "",
      createDate: localNowIso(),
      status: "IN PROGRESS",
      childSelected: false,
    });
  };

  runAutoSave = async (generation) => {
    if (!this.state.childMeta_name) return;
    try {
      if (this.autoSaveCreated) {
        // The create is still in flight - nothing to update yet.
        if (!this.state._id) return;
        const { data } = await Axios.put(
          `${API_ROUTE}/${this.state.homeId}/${this.state._id}`,
          this.buildPayload(this.state.status)
        );
        if (generation !== this.formGeneration) return;
        this.setState({ lastEditDate: data.lastEditDate });
      } else {
        // Set before the request resolves so a slow create can't be
        // followed by a second create on the next tick.
        this.autoSaveCreated = true;
        const { data } = await Axios.post(API_ROUTE, this.buildPayload(this.state.status));
        if (generation !== this.formGeneration) return;
        this.setState({ _id: data._id, lastEditDate: data.lastEditDate });
      }
    } catch (e) {
      // The form was cleared since this started - nothing to report.
      if (generation !== this.formGeneration) return;
      // The form changed underneath this one (someone submitted, approved,
      // or returned it to draft - 409) or this user may no longer edit it
      // (403): stop autosaving rather than repeat the error every few seconds.
      const httpStatus = e.response && e.response.status;
      if (httpStatus === 409 || httpStatus === 403) clearInterval(this.autoSaveInterval);
      console.log(e);
      if (!this.state._id) this.autoSaveCreated = false;
      this.showError(
        (e.response && e.response.data && e.response.data.error) || `Error saving ${FORM_TITLE}`
      );
    }
  };

  // One autosave at a time, and Submit / Finish Later wait for it - so a
  // create still in flight can't be followed by a second create, and its
  // response can't land on a form that has since been cleared.
  autoSave = async () => {
    if (this.autoSaveInFlight) return;
    const run = this.runAutoSave(this.formGeneration);
    this.autoSaveInFlight = run;
    try {
      await run;
    } finally {
      if (this.autoSaveInFlight === run) this.autoSaveInFlight = null;
    }
  };

  submit = async (save) => {
    const status = save ? this.state.status : "COMPLETED";
    clearInterval(this.autoSaveInterval);
    // Let an autosave that's already running finish first: if it's still
    // creating the record, this then updates that record instead of
    // creating a second one. (runAutoSave handles its own errors.)
    if (this.autoSaveInFlight) await this.autoSaveInFlight;
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
        // A fresh blank form for the next child - drop the saved record
        // and restart autosave from scratch.
        this.autoSaveCreated = false;
        this.resetForm();
        this.startAutoSave();
      }
    } catch (e) {
      console.log(e);
      const serverMessage = e.response && e.response.data && e.response.data.error;
      this.showError(serverMessage || `Error submitting ${FORM_TITLE}`);
      // A failed Submit (rejected fields, a network error, ...) leaves a new
      // form open as a draft, so keep autosaving it - unless the form changed
      // underneath (409) or this user may no longer edit it (403), where
      // autosave would only fail again.
      const httpStatus = e.response && e.response.status;
      if (!this.props.valuesSet && httpStatus !== 409 && httpStatus !== 403) {
        this.startAutoSave();
      }
    }
  };

  validateForm = async (save) => {
    if (!save) {
      if (!this.state.monthOf) {
        this.showError("Please enter the inventory month before submitting.");
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
    const clientSignatures =
      Array.isArray(formData.clientSignatures) && formData.clientSignatures.length
        ? [...formData.clientSignatures, ...defaultClientSignatures()].slice(0, 2)
        : defaultClientSignatures();
    await this.setState({
      ...formData,
      clothingItems: mergeRows(defaultClothingItems(), formData.clothingItems),
      hygieneItems: mergeRows(defaultHygieneItems(), formData.hygieneItems),
      clientSignatures,
      loadingClients: false,
    });
    this.loadClientSigs(clientSignatures);
    if (this.isLocked()) {
      this.clientSigCanvases.forEach((canvas) => canvas && canvas.off());
    }

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
    // Mirrors canEditForm in utils/formIntegrity.js: a submitted inventory
    // is read-only except to its author or an admin.
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

  renderClothingTable = () => {
    const disabled = this.isDisabled();
    return (
      <div className="table-responsive">
        <table className="table table-bordered table-sm clothing-inventory-table">
          <thead>
            <tr>
              <th rowSpan={2} style={{ minWidth: 150 }}>
                Item
              </th>
              <th rowSpan={2}>No. of Items from Child's Clothing Supply</th>
              <th colSpan={2} className="text-center">
                Plus
              </th>
              <th colSpan={3} className="text-center">
                Minus
              </th>
              <th rowSpan={2}>Total Monthly Inventory</th>
            </tr>
            <tr>
              <th>New</th>
              <th>Used</th>
              <th>Will not Fit</th>
              <th>Lost</th>
              <th>Destroyed</th>
            </tr>
          </thead>
          <tbody>
            {CLOTHING_SECTIONS.map(([category, heading]) => (
              <React.Fragment key={category}>
                {heading && (
                  <tr>
                    <th colSpan={8}>{heading.toUpperCase()}</th>
                  </tr>
                )}
                {this.state.clothingItems.map((row, index) =>
                  row.category !== category ? null : (
                    <tr key={row.key}>
                      <td>
                        {category === "other" ? (
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            placeholder="Other item"
                            aria-label="Other clothing item name"
                            value={row.item}
                            disabled={disabled}
                            onChange={(e) =>
                              this.handleRowName("clothingItems", index, e.target.value)
                            }
                          />
                        ) : (
                          row.item
                        )}
                      </td>
                      {COUNT_COLUMNS.map(([field, label]) => (
                        <td key={field} style={{ minWidth: 70 }}>
                          <input
                            className="form-control form-control-sm"
                            type="number"
                            min="0"
                            step="1"
                            aria-label={`${row.item || "Other item"} - ${label}`}
                            value={row[field] === null || row[field] === undefined ? "" : row[field]}
                            disabled={disabled}
                            onChange={(e) => this.handleClothingCount(index, field, e.target.value)}
                          />
                        </td>
                      ))}
                      <td className="text-center align-middle" style={{ minWidth: 70 }}>
                        <strong>{row.total === null || row.total === undefined ? "" : row.total}</strong>
                      </td>
                    </tr>
                  )
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  renderHygieneTable = () => {
    const disabled = this.isDisabled();
    // Unique per rendered form - the print view renders many forms on one
    // page, and radio groups with the same name would interfere.
    const groupPrefix = `hygiene-${this.state._id || "new"}`;
    return (
      <div className="table-responsive">
        <table className="table table-bordered table-sm clothing-inventory-table">
          <thead>
            <tr>
              <th style={{ minWidth: 150 }}>Hygiene Supplies</th>
              {HYGIENE_STATUSES.map(([status, label]) => (
                <th key={status} className="text-center">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.state.hygieneItems.map((row, index) => (
              <tr key={row.key}>
                <td>
                  {row.custom ? (
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      placeholder="Other item"
                      aria-label="Other hygiene item name"
                      value={row.item}
                      disabled={disabled}
                      onChange={(e) => this.handleRowName("hygieneItems", index, e.target.value)}
                    />
                  ) : (
                    row.item
                  )}
                </td>
                {HYGIENE_STATUSES.map(([status, label]) => (
                  <td key={status} className="text-center align-middle">
                    <input
                      type="radio"
                      name={`${groupPrefix}-${row.key}`}
                      aria-label={`${row.item || "Other item"} - ${label}`}
                      checked={row.status === status}
                      disabled={disabled}
                      onChange={() => this.handleHygieneStatus(index, status)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  renderClientSignatures = () => {
    const disabled = this.isDisabled();
    return (
      <Row>
        {this.state.clientSignatures.map((entry, index) => (
          <Col md={6} className="print-column" key={index}>
            <div className="form-group logInInputField">
              <label className="control-label">Client Signature {index + 1}</label>
              <div id="sigCanvasDiv">
                <SignatureCanvas
                  ref={(ref) => {
                    this.clientSigCanvases[index] = ref;
                  }}
                  style={{ border: "solid" }}
                  penColor="black"
                  clearOnResize={false}
                  canvasProps={{ width: 300, height: 100, className: "sigCanvas" }}
                  backgroundColor="#eeee"
                  onEnd={() => this.captureClientSig(index)}
                />
              </div>
              {!disabled && (
                <button
                  type="button"
                  className="lightBtn hide-on-print"
                  style={{ marginTop: 5 }}
                  onClick={() => this.clearClientSig(index)}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="form-group logInInputField">
              <label className="control-label">Date</label>
              <input
                className="form-control"
                type="date"
                value={entry.date}
                disabled={disabled}
                onChange={(e) => this.handleClientSigDate(index, e.target.value)}
              />
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  renderFields = () => {
    const disabled = this.isDisabled();
    const isAdmin = isAdminUser(this.props.userObj);
    return (
      <Container className="print-container clothing-inventory">
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
          <Col md={6} className="print-column">
            <div className="form-group logInInputField">
              <label className="control-label">Month Of</label>{" "}
              <input
                id="monthOf"
                onChange={this.handleFieldInput}
                value={this.state.monthOf}
                className="form-control"
                type="month"
                disabled={disabled}
              />
            </div>
          </Col>
          <Col md={6} className="print-column">
            <div className="form-group logInInputField">
              <label className="control-label">Date</label>{" "}
              <input
                id="inventoryDate"
                onChange={this.handleFieldInput}
                value={this.state.inventoryDate}
                className="form-control"
                type="date"
                disabled={disabled}
              />
            </div>
          </Col>
        </Row>

        <h5 className="mt-3">Clothing</h5>
        <p className="text-muted hide-on-print" style={{ fontSize: "0.9em" }}>
          Total Monthly Inventory is calculated automatically: items from the child's clothing
          supply, plus new and used items, minus items that will not fit, are lost, or were
          destroyed.
        </p>
        {this.renderClothingTable()}

        <h5 className="mt-3">Hygiene Supplies</h5>
        {this.renderHygieneTable()}

        <div className="form-group logInInputField">
          <label className="control-label">Notes</label>{" "}
          <TextareaAutosize
            id="notes"
            onChange={this.handleFieldInput}
            value={this.state.notes}
            className="form-control"
            disabled={disabled}
          />
        </div>

        {this.renderClientSignatures()}
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
          {/* Kept mounted (just hidden) while loading so the signature
              canvas refs survive a save. */}
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

export default ClothingInventory;
