import React, { useState } from "react";
import "./ReportsContainer.css";
import { isAdminUser } from "../../utils/AdminReportingRoles";
import { FromReports } from "./FormReports";
import { TrainingReports } from "./TrainingReports";

const ReportsContainer = (props) => {
  const [{ showForms, showTrainings }, setState] = useState({
    showForms: false,
    showTrainings: false,
  });

  const showFormReports = () => {
    setState({ showForms: true, showTrainings: false });
  };
  const showTrainingReports = () => {
    setState({ showForms: false, showTrainings: true });
  };
  const resetReports = () => {
    setState({ showForms: false, showTrainings: false });
  };

  return !showForms && !showTrainings ? (
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
                  showFormReports();
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
                    showTrainingReports();
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
  ) : showForms ? (
    <div>
      <FromReports
        resetReports={() => {
          resetReports();
        }}
        userObj={props.userObj}
        allUsers={props.allUsers}
      />
    </div>
  ) : (
    <div>
      <TrainingReports
        resetReports={() => {
          resetReports();
        }}
        userObj={props.userObj}
        allUsers={props.allUsers}
      />
    </div>
  );
};

export default ReportsContainer;
