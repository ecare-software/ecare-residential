import React, { Component } from "react";
import FormSubmitterListContainer from "./FormSubmitterListContainer";

const selectedFormNameClass = {
  backgroundColor: "rgb(128, 0, 0)",
  color: "white",
  padding: "10px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "900",
};

const formNameClass = {
  color: "black",
  padding: "10px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "900",
  border: "1px solid rgb(128, 0, 0)",
};

const selectedFormCountClass = {
  border: "1px solid white",
  color: "white",
  fontWeight: "900",
  borderRadius: "9px",
  padding: "5px 10px",
  margin: "5px 0px 0px 5px",
};

const formCountClass = {
  border: "1px solid white",
  fontWeight: "900",
  borderRadius: "9px",

  padding: "5px 10px",
  margin: "5px 0px 0px 5px",
};

class FormListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedForm: this.props.reset === "true" ? -1 : -1,
      userObj: props.userObj
    };
  }

  componentDidUpdate = () => {
    if (this.props.doReset && this.state.selectedForm !== -1) {
      console.log("reset state");
      this.setState({ selectedForm: -1 });
    }
  };

  selectForm = (formId) => {
    this.props.setSelectedUser(-1);
    if (this.state.selectedForm === formId) {
      this.setState({ selectedForm: -1 });
      this.props.setSelectedForm(-1);
    } else {
      this.setState({ selectedForm: formId });
      this.props.setSelectedForm(formId);
    }
  };

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {this.props.formObjs.length === 0 && (
          <div>
            <p style={{ textAlign: "center" }}>No Results Found</p>
          </div>
        )}
        {this.props.formObjs.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: "600px",
              }}
            >
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column" }}>
                <p
                className='hide-on-print'
                  onClick={this.selectForm.bind({}, index)}
                  style={
                    this.state.selectedForm === index
                      ? selectedFormNameClass
                      : formNameClass
                  }
                >
                  {item.name}{" "}
                  <span
                  className='hide-on-print'
                    style={
                      this.state.selectedForm === index
                        ? selectedFormCountClass
                        : formCountClass
                    }
                  >
                    {item.forms.length}
                  </span>
                </p>
              </div>
              <div
                className={this.state.selectedForm === index ? "" : "hideIt"}
              >
                <FormSubmitterListContainer
                  reset={this.state.selectedForm === index ? false : true}
                  setSelectedUser={this.props.setSelectedUser}
                  submittions={item.forms}
                  formType={item.forms[0].formType}
                  userObj={this.props.userObj}
                />
              </div>
              <div
                // style={{ marginLeft: "10px" }}
                className={this.state.selectedForm === index ? "hideIt" : ""}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default FormListContainer;
