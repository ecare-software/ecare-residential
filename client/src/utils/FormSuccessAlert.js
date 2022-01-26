import React from "react";

export const FormSuccessAlert = () => (
  <div
    style={{
      position: "fixed",
      width: "500px",
      minHeight: "150px",
      top: "35%",
      left: "50%",
      marginTop: "-100px",
      marginLeft: "-250px",
      backgroundColor: "rgb(248 248 248)",
      boxShadow: "rgb(0 0 0 / 75%) 0px 2px 7px -1px",
      borderRadius: "9px",
      display: "flex",
      flexDirection: "column",
      zIndex: 1,
    }}
  >
    <h1
      style={{
        margin: "10px",
        color: "maroon",
        textAlign: "center",
      }}
    >
      Form Submitted
    </h1>
    <div
      style={{
        margin: "10px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        style={{
          margin: "10px",
        }}
        onClick={() => {
          document.getElementById("DashboardTab").click();
        }}
        className="btn btn-light extraInfoButton"
      >
        Return to Dashboard
      </button>
      <button
        style={{
          margin: "10px",
        }}
        onClick={() => {
          document.getElementById("ReportsTab").click();
        }}
        className="btn btn-light extraInfoButton"
      >
        View Reports
      </button>
    </div>
  </div>
);
