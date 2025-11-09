import React from "react";

export const FormSavedAlert = () => (
  <div
    style={{
      position: "fixed",
      width: "500px",
      top: "35%",
      left: "50%",
      marginTop: "-100px",
      marginLeft: "-250px",
      backgroundColor: "rgb(248 248 248)",
      boxShadow: "rgb(0 0 0 / 75%) 0px 2px 7px -1px",
      borderRadius: "9px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <h1
      style={{
        margin: "10px",
        color: "maroon",
        textAlign: "center",
      }}
    >
      Form Saved
    </h1>
  </div>
);