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

  submit = () => {
    let currentState = JSON.parse(JSON.stringify(this.state));
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
    this.setState({ ...this.state, ...this.props.formData });
  };

  getModal = async () => {
    try {
      this.setState({ ...this.state, isLoading: true });
      const { data } = await fetchTrainingModal(this.props.userObj.homeId);
      this.setState({ ...this.state, modal: data[0] });
      const rows = getEditRowsModal(data[0]);
      const hours = getHours(rows);
      this.setState({ ...this.state, modal: data[0], hours, isLoading: false });
    } catch (e) {
      alert("Error");
      console.log(e);
      this.setState({ ...this.state, isLoading: false });
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
          this.setState({ ...data[0], doUpdate: true, isLoading: false });
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

  render() {
    return (
      <div className="formComp">
        <div className="formTitleDiv">
          <h2 className="formTitle">Annual Training</h2>
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T1Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T1Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T1Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T1 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T1
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T1");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T1"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T2Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T2Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T2Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T2 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T2
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T2");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T2"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T3Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T3Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T3Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T3 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T3
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T3");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T3"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T4Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T4Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T4Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T4 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T4
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T4");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T4"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T5Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T5Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T5Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T5 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T5
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T5");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T5"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T6Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T6Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T6Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T6 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T6
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T6");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T6"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T7Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T7Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T7Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T7 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T7
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T7");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T7"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T8Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T8Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T8Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T8 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T8
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T8");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T8"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T9Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T9Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T9Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T9 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T9
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T9");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T9"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T10Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T10Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T10Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T10 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T10
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T10");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T10"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T11Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T11Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T11Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T11 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T11
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T11");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T11"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T12Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T12Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T12Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T12 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T12
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T12");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T12"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T13Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T13Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T13Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T13 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T13
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T13");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T13"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T14Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T14Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T14Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T14 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T14
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T14");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T14"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T15Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T15Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T15Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T15 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T15
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T15");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T15"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T16Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T16Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T16Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T16 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T16
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T16");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T16"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T17Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T17Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T17Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T17 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T17
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T17");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T17"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T18Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T18Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T18Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T18 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T18
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T18");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T18"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T19Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T19Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T19Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T19 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T19
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T19");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T19"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T20Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T20Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T20Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T20 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T20
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T20");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T20"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T21Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T21Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T21Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T21 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T21
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T21");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T21"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T22Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T22Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T22Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T22 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T22
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T22");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T22"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T23Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T23Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T23Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T23 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T23
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T23");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T23"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T24Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T24Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T24Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T24 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T24
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T24");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T24"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T25Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T25Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T25Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T25 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T25
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T25");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T25"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T26Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T26Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T26Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T26 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T26
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T26");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T26"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T27Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T27Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T27Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T27 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T27
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T27");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T27"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T28Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T28Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T28Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T28 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T28
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T28");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T28"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T29Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T29Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T29Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T29 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T29
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T29");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T29"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T30Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T30Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T30Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T30 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T30
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T30");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T30"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T31Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T31Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T31Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T31 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T31
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T31");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T31"
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
            </div>
            <div className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                {this.state.modal.T32Hours}
              </SmallCol>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T32Title}
                </label>
              </div>
              <div className="col text-center">
                <label className="control-label">
                  {this.state.modal.T32Presenter}
                </label>
              </div>
              <SmallColRight>
                {this.state.T32 ? (
                  <div>
                    <p>{`Completed ${new Date(
                      this.state.T32
                    ).toLocaleString()}`}</p>
                    {!this.props.valuesSet && (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          this.clearFieldInput("T32");
                        }}
                      >
                        Clear Completion
                      </a>
                    )}
                  </div>
                ) : (
                  <Form.Check
                    type="checkbox"
                    id="T32"
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
            </div>
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
