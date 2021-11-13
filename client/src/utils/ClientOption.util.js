import React from "react";

const ClientOption = ({ data, nullName = "Choose..." }) => {
  return data ? (
    <option value={JSON.stringify(data)}>{data.childMeta_name}</option>
  ) : (
    <option value={null} selected>
      {nullName}
    </option>
  );
};

export default ClientOption;
