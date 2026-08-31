import React, { Component, useState } from "react";
import "../../App.css";
import Axios from "axios";
import { Form } from "react-bootstrap";
import styled from "styled-components";
import { useAsync, IfRejected, IfPending, IfFulfilled } from "react-async";
import { getTrainingModType } from "../../utils/TrainingModTypes";
import FirstAidCprTraining from "./FirstAidCprTraining";

const SmallCol = styled.div`
  width: 100px;
  text-align: center;
`;

const SmallColRight = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  text-align: center;
`;

const SmallColRightTitle = styled.div`
  width: 200px;
  text-align: center;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  margin: 20px 0;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  padding: 4px 12px;
  margin-left: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #c82333;
  }
`;

const postTraining = async (formId, data, formType, homeId, userObj) => {
  const { apiPath } = getTrainingModType(formType);

  console.log("postTraining called with:");
  console.log("  formId:", formId);
  console.log("  data:", data);
  console.log("  formType:", formType);
  console.log("  homeId:", homeId);
  console.log("  apiPath:", apiPath);

  if (formId) {
    console.log(`Making PUT request to /api/${apiPath}/${formId}`);
    const response = await Axios.put(`/api/${apiPath}/${formId}`, {
      ...data,
    });
    console.log("PUT response:", response);
    return response;
  }

  console.log(`Making POST request to /api/${apiPath}`);
  const response = await Axios.post(`/api/${apiPath}`, {
    ...data,
    homeId,
    createdBy: userObj?.email,
    createdByName: `${userObj?.firstName} ${userObj?.lastName}`,
  });
  console.log("POST response:", response);
  return response;
};

const getBlankRows = (rowCount) => {
  return Array.from({ length: rowCount }, (_, i) => i + 1).reduce(
    (acc, idx) => {
      acc[`T${idx}`] = { title: "", hours: "", presenter: "" };
      return acc;
    },
    {}
  );
};

const getEditRowsModal = (obj, rowCount) => {
  if (!obj || !obj._id) {
    return getBlankRows(rowCount);
  }

  const rowKeys = Reflect.ownKeys(obj).filter((key) =>
    /^T\d+(Title|Hours|Presenter)$/.test(key)
  );

  return rowKeys.reduce((acc, cur) => {
    const idx = cur.match(/\d+/g)[0];
    if (!acc.hasOwnProperty(`T${idx}`)) {
      acc[`T${idx}`] = {
        title: "",
        hours: "",
        presenter: "",
      };
    }

    if (cur.includes("Presenter")) {
      acc[`T${idx}`].presenter = obj[cur];
    } else if (cur.includes("Title")) {
      acc[`T${idx}`].title = obj[cur];
    } else {
      acc[`T${idx}`].hours = obj[cur];
    }

    return acc;
  }, {});
};

const getHours = (rows) => {
  return Reflect.ownKeys(rows).reduce((acc, cur) => {
    try {
      if (isNaN(rows[cur].hours)) {
        acc = acc + 0;
      } else {
        acc = acc + parseFloat(rows[cur].hours);
      }
    } catch (e) {
      console.log("error row is not populated");
      acc = acc + 0;
    }
    return acc;
  }, 0);
};

const TrainingMod = ({ data, doToggleTrainingDisplay, userObj }) => {
  const formType = data?.formType || "";
  const { rowCount } = getTrainingModType(formType);
  const homeId = data?.homeId || "";
  const _id = data?._id || "";
  const isNew = !_id;

  const [rows, setRows] = useState(getEditRowsModal(data, rowCount));
  const [hours, setHours] = useState(getHours(rows));
  const [isSaving, isSetSaving] = useState(false);
  const [displayName, setDisplayName] = useState(data?.displayName || "");



  const handleFieldInput = (e) => {
    const acc = { ...rows };
    const { id, value } = e.target;
    const keyId = id.match(/\d+/g)[0];
    if (id.includes("Presenter")) {
      acc[`T${keyId}`].presenter = value;
    } else if (id.includes("Title")) {
      acc[`T${keyId}`].title = value;
    } else {
      acc[`T${keyId}`].hours = value;
    }
    setRows(acc);
    setHours(getHours(acc));
  };

  // Add new row to the template
  const addNewRow = () => {
    console.log("addNewRow called!");
    const existingKeys = Object.keys(rows);
    const nextIndex = existingKeys.length + 1;
    const newKey = `T${nextIndex}`;

    const newRows = {
      ...rows,
      [newKey]: { title: "", hours: "", presenter: "" },
    };

    console.log("New rows:", newRows);
    setRows(newRows);
  };

  // Delete a row from the template
  const deleteRow = (rowKey) => {
    const updatedRows = { ...rows };
    delete updatedRows[rowKey];

    // Re-index remaining rows
    const reindexedRows = {};
    Object.keys(updatedRows)
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
      })
      .forEach((key, index) => {
        reindexedRows[`T${index + 1}`] = updatedRows[key];
      });

    setRows(reindexedRows);
    setHours(getHours(reindexedRows));
  };

  const doSave = async () => {
    try {
      isSetSaving(true);

      // Convert rows object to flat structure for database
      const flatValues = Reflect.ownKeys(rows).reduce((acc1, cur1) => {
        const idx = cur1.match(/\d+/g)[0];

        Reflect.ownKeys(rows[cur1]).forEach((cur) => {
          if (cur.includes("presenter")) {
            acc1[`T${idx}Presenter`] = rows[cur1][cur] || "";
          } else if (cur.includes("title")) {
            acc1[`T${idx}Title`] = rows[cur1][cur] || "";
          } else {
            acc1[`T${idx}Hours`] = rows[cur1][cur] || "";
          }
        });

        return acc1;
      }, {});

      flatValues.displayName = (displayName || "").trim();
      flatValues.formType = formType;

      console.log("Saving template with data:", flatValues);

      const response = await postTraining(_id, flatValues, formType, homeId, userObj);

      console.log("Save response:", response);

      alert("Template saved successfully!");
      doToggleTrainingDisplay(true);
    } catch (e) {
      console.error("Save error:", e);
      alert(`Error saving template: ${e.message || e}`);
      isSetSaving(false);
    }
    isSetSaving(false);
  };

  // IMPORTANT: Use the exact string "First aid CPR Training" (lowercase 'a' in 'aid')
  if (data.formType === "First aid CPR Training") {
    console.log("=== Rendering First Aid CPR Training Template ===");

    // TEMPLATE EDITOR - for admins to edit the training template/modal
    return (
      <div className="formComp">
        <div style={{ marginBottom: "20px" }}>
          <button
            className="btn btn-light"
            onClick={() => doToggleTrainingDisplay(true)}
          >
            Back to Training List
          </button>
        </div>
        <div className="formTitleDiv">
          <h2 className="formTitle">
            First Aid CPR Training Template {isNew ? "(New)" : "(Edit)"}
          </h2>
        </div>
        <div className="formFieldsMobile">
          <div className="form-group logInInputField d-flex">
            <div className="col text-center">
              <label className="control-label">Training Name</label>
            </div>
            <div className="col text-center">
              <input
                onChange={(e) => setDisplayName(e.target.value)}
                value={displayName}
                placeholder="First Aid CPR Training"
                className="form-control"
                type="text"
              />
            </div>
          </div>
          <div className="form-group logInInputField d-flex border-bottom">
            <SmallCol className="control-label">
              <label>Hours</label>
            </SmallCol>
            <div className="col text-center">
              <label className="control-label">Training Topic</label>
            </div>
            <div className="col text-center">
              <label className="control-label">Presenter</label>
            </div>
            <div style={{ width: "100px" }}></div>
          </div>
          {Reflect.ownKeys(rows).map((row) => (
            <div key={row} className="form-group logInInputField d-flex">
              <SmallCol className="control-label">
                <input
                  onChange={handleFieldInput}
                  id={`${row}Hours`}
                  value={rows[row].hours}
                  className="form-control"
                  type="text"
                />
              </SmallCol>
              <div className="col text-center">
                <input
                  onChange={handleFieldInput}
                  id={`${row}Title`}
                  value={rows[row].title}
                  className="form-control"
                  type="text"
                />
              </div>
              <div className="col text-center">
                <input
                  onChange={handleFieldInput}
                  id={`${row}Presenter`}
                  value={rows[row].presenter}
                  className="form-control"
                  type="text"
                />
              </div>
              <div
                style={{
                  width: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {Object.keys(rows).length > 1 && (
                  <DeleteButton onClick={() => deleteRow(row)}>
                    Delete
                  </DeleteButton>
                )}
              </div>
            </div>
          ))}

          {/* Add New Training Row Button */}
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <AddButton onClick={addNewRow}>+ Add New Training</AddButton>
          </div>

          <div className="form-group logInInputField d-flex">
            <SmallCol className="control-label">
              <label>{hours === "NaN" || isNaN(hours) ? "∞" : hours}</label>
            </SmallCol>
            <div className="col text-center">
              <label className="control-label">Total Hours</label>
            </div>
            <div className="col text-center">
              <label className="control-label"></label>
            </div>
          </div>
          <div className="form-group logInInputField d-flex">
            <SmallCol className="control-label">
              <button className="darkBtn" onClick={doSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Template"}
              </button>
            </SmallCol>
            <SmallCol />
            <SmallCol />
          </div>
        </div>
      </div>
    );
  }

  console.log("=== Rendering Default Training Template ===");

  return (
    <div className="formComp">
      <div className="formTitleDiv">
        <h2 className="formTitle">
          {formType}
          {isNew ? " (New Template)" : ""}
        </h2>
      </div>
      <div className="formFieldsMobile">
        <div className="form-group logInInputField d-flex">
          <div className="col text-center">
            <label className="control-label">Training Name</label>
          </div>
          <div className="col text-center">
            <input
              onChange={(e) => setDisplayName(e.target.value)}
              value={displayName}
              placeholder={formType}
              className="form-control"
              type="text"
            />
          </div>
        </div>
        <div className="form-group logInInputField d-flex border-bottom">
          <SmallCol className="control-label">
            <label>Hours</label>
          </SmallCol>
          <div className="col text-center">
            <label className="control-label">Training Topic</label>
          </div>
          <div className="col text-center">
            <label className="control-label">Presenter</label>
          </div>
        </div>
        {Reflect.ownKeys(rows).map((row) => (
          <div key={row} className="form-group logInInputField d-flex">
            <SmallCol className="control-label">
              <input
                onChange={handleFieldInput}
                id={`${row}Hours`}
                value={rows[row].hours}
                className="form-control"
                type="text"
              />{" "}
            </SmallCol>
            <div className="col text-center">
              <input
                onChange={handleFieldInput}
                id={`${row}Title`}
                value={rows[row].title}
                className="form-control"
                type="text"
              />{" "}
            </div>
            <div className="col text-center">
              <input
                onChange={handleFieldInput}
                id={`${row}Presenter`}
                value={rows[row].presenter}
                className="form-control"
                type="text"
              />{" "}
            </div>
          </div>
        ))}
        <div className="form-group logInInputField d-flex">
          <SmallCol className="control-label">
            <label>{hours === "NaN" || isNaN(hours) ? "∞" : hours}</label>
          </SmallCol>
          <div className="col text-center">
            <label className="control-label">Total Hours</label>
          </div>
          <div className="col text-center">
            <label className="control-label"></label>
          </div>
        </div>
        <div className="form-group logInInputField d-flex">
          <SmallCol className="control-label">
            <button className="darkBtn" onClick={doSave}>
              Save
            </button>
          </SmallCol>
          <SmallCol />
          <SmallCol />
        </div>
      </div>
    </div>
  );
};

export default TrainingMod;
