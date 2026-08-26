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

const postTraining = async (formId, data, formType, homeId, userObj) => {
  const { apiPath } = getTrainingModType(formType);

  if (formId) {
    return await Axios.put(`/api/${apiPath}/${formId}`, {
      ...data,
    });
  }

  return await Axios.post(`/api/${apiPath}`, {
    ...data,
    homeId,
    createdBy: userObj?.email,
    createdByName: `${userObj?.firstName} ${userObj?.lastName}`,
  });
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
  };

  const doSave = async () => {
    try {
      isSetSaving(true);
      const flatValues = Reflect.ownKeys(rows).reduce((acc1, cur1) => {
        const idx = cur1.match(/\d+/g)[0];

        Reflect.ownKeys(rows[cur1]).forEach((cur) => {
          if (cur.includes("presenter")) {
            acc1[`T${idx}Presenter`] = rows[cur1][cur];
          } else if (cur.includes("title")) {
            acc1[`T${idx}Title`] = rows[cur1][cur];
          } else {
            acc1[`T${idx}Hours`] = rows[cur1][cur];
          }
        });

        return acc1;
      }, {});

      flatValues.displayName = (displayName || "").trim();

      await postTraining(_id, flatValues, formType, homeId, userObj);
      doToggleTrainingDisplay(true);
    } catch (e) {
      alert(e);
      isSetSaving(false);
    }
    isSetSaving(false);
  };

  if (data.formType === "First Aid CPR Training") {
    // Check if this is editing a modal/template or a user submission
    const isEditingModal = data._id && !data.createdBy; // Modal has no createdBy

    if (isEditingModal) {
      // Show the modal editor (the current TrainingMod template editor)
      // This is for editing the training TEMPLATE, not individual user training records
      return (
        <div className="formComp">
          <div className="formTitleDiv">
            <h2 className="formTitle">First Aid CPR Training Template</h2>
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
                  Save Template
                </button>
              </SmallCol>
              <SmallCol />
              <SmallCol />
            </div>
          </div>
        </div>
      );
    }

    // For user training records (not editing the template)
    return (
      <div>
        <div style={{ marginBottom: "20px" }}>
          <button
            className="btn btn-light"
            onClick={() => doToggleTrainingDisplay(true)}
          >
            Back to Training List
          </button>
        </div>
        <FirstAidCprTraining
          valuesSet={false}
          userObj={userObj}
        />
      </div>
    );
  }

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
          <div className="form-group logInInputField d-flex">
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
