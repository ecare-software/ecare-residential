import React, { Component } from "react";
import FormError from "../FormMods/FormError";
import FormAlert from "../Forms/FormAlert";
import "../../App.css";
import Axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { GetUserSig } from "../../utils/GetUserSig";
import { FormSuccessAlert } from "../../utils/FormSuccessAlert";
import { FormSavedAlert } from "../../utils/FormSavedAlert";
import { isAdminUser } from "../../utils/AdminReportingRoles";
import { NightMonitoringChildRow } from "../NightMonitoringChildRow";
import { Row } from "react-bootstrap";
var interval = 0; // used for autosaving
let initAutoSave = false;
class NightMonitoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      roomNumber: "",
      timeChildAwake: "",
      timeChildReturnBed: "",
      reason: "",
      signed: false,
      childMeta_name: "",
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
      loadingSig: true,
      clients: [],
      clientId: "",
      signature: [],
      createDate: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
      status: "IN PROGRESS",
      childSelected: false,
    };
  }

  toggleSuccessAlert = () => {
    this.setState({
      formSubmitted: true,
      loadingClients: false,
    });
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

  resetForm = () => {
    this.setState({
      ...this.state,
      date: "",
      roomNumber: "",
      timeChildAwake: "",
      timeChildReturnBed: "",
      reason: "",
      signed: false,
      createDate: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
      status: "IN PROGRESS",
      childSelected: false,
    });
  };
  componentWillUnmount() {
    console.log("clearing auto save interval");
    initAutoSave = false;
    clearInterval(interval);
  }
  // auto save
  autoSave = async () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
    delete currentState.clients;
    delete currentState.staff;
    console.log("auto saving");
    if (initAutoSave) {
      console.log("updating existing form");
      try {
        const { data } = await Axios.put(
          `/api/nightMonitoring/${this.state.homeId}/${this.state._id}`,
          {
            ...currentState,
          }
        );
        this.setState({
          ...this.state,
          lastEditDate: data.lastEditDate,
        });
      } catch (e) {
        console.log(e);
        this.setState({
          formHasError: true,
          formErrorMessage: "Error Submitting Night Monitoring Form",
          loadingClients: false,
        });
      }
    } else {
      console.log("creating");
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/nightMonitoring", currentState)
        .then((res) => {
          initAutoSave = true;

          this.setState({
            ...this.state,
            _id: res.data._id,
          });
        })
        .catch((e) => {
          console.log(e);
          this.setState({
            formHasError: true,
            formErrorMessage: "Error Submitting Night Monitoring Form",
            loadingClients: false,
          });
        });
    }
  };

  submit = async (save) => {
    if (!save) this.state.status = "COMPLETED";
    let currentState = JSON.parse(JSON.stringify(this.state));
    delete currentState.clients;
    delete currentState.staff;
    initAutoSave = false;
    clearInterval(interval);
    if (this.props.valuesSet || this.state._id) {
      try {
        const { data } = await Axios.put(
          `/api/nightMonitoring/${this.state.homeId}/${this.state._id}`,
          {
            ...currentState,
          }
        );

        this.setState({ ...this.state, ...data });
        window.scrollTo(0, 0);
        this.setState({
          formSubmitted: true,
        });
        this.toggleSuccessAlert();
        // setTimeout(() => {
        //   this.toggleSuccessAlert();
        // }, 2000);
      } catch (e) {
        console.log(e);
        this.setState({
          formHasError: true,
          formErrorMessage: "Error Submitting Night Monitoring Form",
          loadingClients: false,
        });
      }
    } else {
      currentState.createdBy = this.props.userObj.email;
      currentState.createdByName =
        this.props.userObj.firstName + " " + this.props.userObj.lastName;

      Axios.post("/api/nightMonitoring", currentState)
        .then((res) => {
          window.scrollTo(0, 0);
          this.toggleSuccessAlert();
          if (!this.props.valuesSet) {
            this.resetForm();
          }
        })
        .catch((e) => {
          console.log(e);
          this.setState({
            formHasError: true,
            formErrorMessage: "Error Submitting Night Monitoring Form",
            loadingClients: false,
          });
        });
    }
  };

  validateForm = async (save) => {
    this.setState({
      ...this.state,
      loadingClients: true,
    });


    this.submit(save);
  };


  setValues = async () => {
    const { data: createdUserData } = await GetUserSig(
      this.props.formData.createdBy,
      this.props.userObj.homeId
    );

    this.setState({
      ...this.state,
      ...this.props.formData,
      loadingSig: false,
      loadingClients: false,
      signature: this.props.userObj.signature,
    });
  };

  getClients = async () => {
    try {
      let { data: clients } = await Axios.get(
        `/api/client/${this.props.userObj.homeId}?active=true`
      );
      setTimeout(() => {
        this.setState({
          ...this.state,
          clients,
          loadingClients: !this.state.loadingClients,
        });
      }, 2000);
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
      interval = setInterval(() => {
        this.autoSave();
      }, 7000);
    }
  }

  handleClientSelect = async (event) => {
    this.state.childSelected = true;
    if (event.target.value !== null) {
      const client = JSON.parse(event.target.value);
      const clonedState = { ...this.state };
      const id = clonedState._id;
      const lastEditDate = clonedState.lastEditDate;
      Object.keys(client).forEach((key) => {
        if (!key.includes("create") && clonedState.hasOwnProperty(key)) {
          clonedState[key] = client[key];
        }
      });
      await this.setState({
        ...clonedState,
        clientId: client._id,
        _id: id,
        lastEditDate,
      });
    }
  };

  setRootState = (body) => {
    const stateCopy = { ...this.state, ...body };
    console.log(stateCopy);
    this.setState({
      ...stateCopy,
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
            <h2 className="formTitle">Awake Night Monitoring</h2>
            <h5
              className="text-center"
              style={{ color: "rgb(119 119 119 / 93%)" }}
            >
              {this.state.lastEditDate ? (
                <i>
                  {" "}
                  Last Saved:
                  {`${new Date(this.state.lastEditDate)
                    .toTimeString()
                    .replace(/\s.*/, "")} - ${new Date(
                      this.state.lastEditDate
                    ).toDateString()}`}
                </i>
              ) : (
                "-"
              )}
            </h5>
          </div>
          {this.state.loadingClients ? (
            <div className="formLoadingDiv">
              <div>
                <ClipLoader
                  className="formSpinner"
                  size={50}
                  color={"#ffc107"}
                />
              </div>

              <p>Loading...</p>
            </div>
          ) : (
            <div className="formFieldsMobile">
              <div className="form-group logInInputField">
                <label className="control-label hide-on-print">
                  Create Date
                </label>{" "}
                <input
                  onChange={this.handleFieldInputDate}
                  id="createDate"
                  value={this.state.createDate.slice(0, -8)}
                  className="form-control hide-on-print"
                  type="datetime-local"
                />{" "}
              </div>
              <NightMonitoringChildRow
                setRootState={this.setRootState}
                rootState={this.state}
                clients={this.state.clients}
                signature={this.props.userObj.signature}
              />
              <FormError errorId={this.props.id + "-error"} />

              <Row className="save-submit-row">
                <div style={{ display: "flex", width: "46%" }}>
                  <button
                    className="lightBtn hide hide-on-print save-submit-btn"
                    style={{ width: "100%" }}
                    disabled={this.state.childSelected ? false : true}
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
                    disabled={this.state.childSelected ? false : true}
                    onClick={() => {
                      this.validateForm(false);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </Row>
            </div>
          )}
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
            <h2 className="formTitle">Awake Night Monitoring</h2>
          </div>

          <div className="formFieldsMobileReport">
            {this.state.loadingClients ? (
              <div className="formLoadingDiv">
                <div>
                  <ClipLoader
                    className="formSpinner"
                    size={50}
                    color={"#ffc107"}
                  />
                </div>

                <p>Loading...</p>
              </div>
            ) : (
              <div>
                <div className="form-group logInInputField">
                  <label className="control-label hide-on-print">
                    Create Date
                  </label>{" "}
                  <input
                    id="createDate"
                    value={this.state.createDate.slice(0, -8)}
                    className="form-control hide-on-print"
                    type="datetime-local"
                    disabled
                  />{" "}
                </div>
                <NightMonitoringChildRow
                  propsSet={true}
                  setRootState={this.setRootState}
                  rootState={this.state}
                  clients={this.state.clients}
                  signature={this.state.signature}
                />
              </div>
            )}
            {/* <label className="control-label">Signature</label>{" "}
            <div className="sigSection">
              <div
                style={{
                 width: "100%",
                  display: "flex",
maxHeight:"170",
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
                    height: 100,
                    className: "sigCanvas",
                  }}
                  backgroundColor="#eeee"
                />
              </div>
            </div> */}
            {!this.props.formData.approved && (
              <>
                <FormError errorId={this.props.id + "-error"} />
                <Row style={{ display: "flex", justifyContent: "space-between", paddingRight: "0px", marginLeft: "1px", marginRight: "1px" }}>
                    <div style={{ display: "flex", width: "46%" }}>
                      <button
                        className="lightBtn hide hide-on-print save-submit-btn"
                        style={{ 
                          width: "100%",
                          display: this.state.status === 'COMPLETED' ? "none" : "block",
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
          </div>
        </div>
      );
    }
  }
}

export default NightMonitoring;
