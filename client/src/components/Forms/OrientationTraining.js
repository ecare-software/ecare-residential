import React, { Component } from "react";
import "../../App.css";
import Axios from "axios";
import { Form } from "react-bootstrap";
import styled from "styled-components";

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

class OrientationTraining extends Component {
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

      createdBy: this.props.valuesSet === true ? "" : this.props.userObj.email,

      createdByName:
        this.props.valuesSet === true
          ? ""
          : this.props.userObj.firstName + " " + this.props.userObj.lastName,

      lastEditDate: new Date(),

      homeId: this.props.valuesSet === true ? "" : this.props.userObj.homeId,

      doUpdate: false,
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
      Axios.put(`/api/orientationTraining/${this.state._id}`, currentState)
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
      Axios.post("/api/orientationTraining", currentState)
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

  getSubmission = async () => {
    try {
      if (this.props.valuesSet) {
        this.setValues();
      } else {
        let { data } = await Axios.get(
          `/api/orientationTraining/${this.props.userObj.homeId}/${this.props.userObj.email}`
        );
        if (data.length !== 0) {
          this.setState({ ...data[0], doUpdate: true });
        }
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
          <h2 className="formTitle">New Employee Orientation Training</h2>
        </div>
        <div className="formFieldsMobile">
          <div className="form-group logInInputField d-flex border-bottom">
            <SmallCol className="control-label">
              <label>Hours</label>
            </SmallCol>
            <div className="col text-center">
              <label className="control-label">Training Topics</label>
            </div>
            <SmallColRightTitle>
              <label>Completion</label>
            </SmallColRightTitle>
          </div>
          <div className="form-group logInInputField d-flex">
            <SmallCol className="control-label">1</SmallCol>
            <div className="col">
              <label className="control-label">
                New Pathways Mission, Philosophy, and Vision
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
                    this.props.valuesSet ? "Not Completed" : "Mark as completed"
                  }
                  onClick={this.handleFieldInput}
                />
              )}
            </SmallColRight>
          </div>
          <div className="form-group logInInputField d-flex">
            <SmallCol className="control-label">2</SmallCol>
            <div className="col">
              <label className="control-label">New Pathways Employee</label>
              <ul>
                <li>Personnel Policies</li>
                <li>Personnel Benefits</li>
                <li>Harassment</li>
                <li>
                  Preventing Sexual Misconduct and Inappropriate Relationships
                </li>
                <li>Introduction to Key Personnel and Leaders</li>
              </ul>
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
                    this.props.valuesSet ? "Not Completed" : "Mark as completed"
                  }
                  onClick={this.handleFieldInput}
                />
              )}
            </SmallColRight>
          </div>
          <div className="form-group logInInputField d-flex">
            <SmallCol className="control-label">1</SmallCol>
            <div className="col">
              <label className="control-label">
                New Pathways History, Program Components and Services
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
                    this.props.valuesSet ? "Not Completed" : "Mark as completed"
                  }
                  onClick={this.handleFieldInput}
                />
              )}
            </SmallColRight>
          </div>
          <div className="form-group logInInputField d-flex">
            <SmallCol className="control-label">1</SmallCol>
            <div className="col">
              <label className="control-label">
                Supervision Strategies and Boundaries
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
                    this.props.valuesSet ? "Not Completed" : "Mark as completed"
                  }
                  onClick={this.handleFieldInput}
                />
              )}
            </SmallColRight>
          </div>
          <div className="form-group logInInputField d-flex">
            <SmallCol className="control-label">1</SmallCol>
            <div className="col">
              <label className="control-label">Job Descriptions</label>
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
                    this.props.valuesSet ? "Not Completed" : "Mark as completed"
                  }
                  onClick={this.handleFieldInput}
                />
              )}
            </SmallColRight>
          </div>
          <div className="form-group logInInputField d-flex">
            <SmallCol className="control-label">1</SmallCol>
            <div className="col">
              <label className="control-label">
                Contract or Agreement Overview
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
                    this.props.valuesSet ? "Not Completed" : "Mark as completed"
                  }
                  onClick={this.handleFieldInput}
                />
              )}
            </SmallColRight>
          </div>
          <div className="form-group logInInputField d-flex">
            <SmallCol className="control-label">1</SmallCol>
            <div className="col">
              <label className="control-label">
                Fire Extinguisher Training and First Aid Equipment
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
                    this.props.valuesSet ? "Not Completed" : "Mark as completed"
                  }
                  onClick={this.handleFieldInput}
                />
              )}
            </SmallColRight>
          </div>
          <div className="form-group logInInputField d-flex border-top">
            <SmallCol className="control-label">
              <label>8</label>
            </SmallCol>
            <div className="col text-center">
              <label className="control-label">Total Hours</label>
            </div>
            <SmallCol />
          </div>
        </div>
      </div>
    );
  }
}

export default OrientationTraining;
