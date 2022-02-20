import React, { useState } from "react";
import "./ReportsContainer.css";
import { isAdminUser } from "../../utils/AdminReportingRoles";
import { FromReports } from "./FormReports";
import { TrainingReports } from "./TrainingReports";
import AllReports from "./AllReports";

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
    <AllReports
      showFormReports={showFormReports}
      showTrainingReports={showTrainingReports}
      userObj={props.userObj}
      allUsers={props.allUsers}
    />
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
