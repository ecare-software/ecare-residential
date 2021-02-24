import React from "react";

const ClientOption = ({ data }) => {
  return data ? (
    <option value={JSON.stringify(data)}>{data.childMeta_name}</option>
  ) : (
    <option value={null} selected>
      Choose...
    </option>
  );
};

export default ClientOption;
