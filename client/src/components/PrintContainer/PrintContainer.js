import React, { Component } from "react";
import "./PrintContainer.css";
import "../../App.css";

class PrintContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportTitle: "",
    };

    // this.handleFieldInput = this.handleFieldInput.bind(this);
    // this.submit = this.submit.bind(this);
  }

  doPrint = async () => {
    // window.print();
    alert("printing")
  };
  
  render() {
    return (
      <div id={this.props.id} style={this.props.pos} className="printContainer">
          <div className="form-group printInputField d-flex justify-content-between align-items-center">
          <button
          onClick={() => {
            this.doPrint();
          }}
          className="mr-3 btn btn-light hide-on-print"
        >
          Print <i className="fas fa-print"></i>
        </button>
          </div>
      </div>
    );
  }
}

export default PrintContainer;
