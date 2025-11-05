import React from "react";

const StaffOption = ({ data, nullName = "Choose..." }) => {
  return data ? (
    <option
      value={JSON.stringify(data)}
    >{`${data.firstName} ${data.lastName}`}</option>
  ) : (
    <option value={null} selected>
      {nullName}
    </option>
  );
};

export default StaffOption;