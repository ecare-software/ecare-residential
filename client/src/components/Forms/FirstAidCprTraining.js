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
  return await Axios.get(`/api/firstAidCprTrainingMod/${homeId}`);
};

const getHours = (rows) => {
  return Reflect.ownKeys(rows).reduce((acc, cur) => {
    try {
      acc = acc + parseInt(rows[cur].hours);
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
    const idx = cur.match(/\d/g)[0];
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

class FirstAidCprTraining extends Component {
  constructor(props) {
    super(props);
    this.state = {
      T1: "",

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
      Axios.put(`/api/firstAidCprTraining/${this.state._id}`, currentState)
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
      Axios.post("/api/firstAidCprTraining", currentState)
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
          `/api/firstAidCprTraining/${this.props.userObj.homeId}/${this.props.userObj.email}`
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
          <h2 className="formTitle">First Aid / CPR Training</h2>
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

export default FirstAidCprTraining;
