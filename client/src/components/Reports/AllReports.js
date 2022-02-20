import React from "react";
import "./ReportsContainer.css";
import { isAdminUser } from "../../utils/AdminReportingRoles";

const AllReports = (props) => {
  return (
    <div style={{ marginTop: "50px" }}>
      <div className="row" style={{ margin: "0px 30px" }}>
        <div className="formTitleDiv" style={{ width: "100%" }}>
          <h2 className="formTitle">Reports{"  "}</h2>
          <hr />
          <h2 className="formTitle">
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <button
                className="btn btn-light extraInfoButton"
                onClick={() => {
                  props.showFormReports();
                }}
              >
                Form Reports
              </button>
            </div>
          </h2>
          {isAdminUser(props.userObj) && (
            <h2 className="formTitle">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <button
                  className="btn btn-light extraInfoButton"
                  onClick={() => {
                    props.showTrainingReports();
                  }}
                >
                  Internal Trainings
                </button>
              </div>
            </h2>
          )}
        </div>
      </div>
      <div className="reportBtnsMobile"></div>
    </div>
  );
};

export default AllReports;
