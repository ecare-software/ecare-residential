import React from "react";
import "./PrintContainer.css";
import "../../App.css";

const PrintContainer = ({ id, pos }) => {
  const doPrint = async () => {
    // window.print();
    alert("printing");
  };

  return (
    <div id={id} style={pos} className="printContainer">
      <div className="form-group printInputField d-flex justify-content-between align-items-center">
        <button
          onClick={doPrint}
          className="mr-3 btn btn-light hide-on-print"
        >
          Print <i className="fas fa-print"></i>
        </button>
      </div>
    </div>
  );
};

export default PrintContainer
