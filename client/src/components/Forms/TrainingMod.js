import React, { Component, useState } from "react";
import "../../App.css";
import Axios from "axios";
import { Form } from "react-bootstrap";
import styled from "styled-components";
import { useAsync, IfRejected, IfPending, IfFulfilled } from "react-async";

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

const postTraining = async (formId, data, formType) => {
  let subString;
  switch (formType) {
    case "Orientation Training":
      subString = `orientationTrainingMod`;
    default:
      subString = `orientationTrainingMod`;
  }
  return await Axios.put(`/api/${subString}/${formId}`, {
    ...data,
  });
};

const getEditRowsModal = (obj) => {
  const reducedObj = { ...obj };
  delete reducedObj.createdBy;
  delete reducedObj.createdByName;
  delete reducedObj.lastEditDate;
  delete reducedObj.formType;
  delete reducedObj.homeId;
  delete reducedObj.createDate;
  delete reducedObj._id;
  delete reducedObj.approved;

  return Reflect.ownKeys(reducedObj).reduce((acc, cur) => {
    console.log(cur);
    const idx = cur.match(/\d+/g)[0];
    if (!acc.hasOwnProperty(`T${idx}`)) {
      acc[`T${idx}`] = {
        title: "",
        hours: "",
        presenter: "",
      };
    }

    if (cur.includes("Presenter")) {
      acc[`T${idx}`].presenter = reducedObj[cur];
    } else if (cur.includes("Title")) {
      acc[`T${idx}`].title = reducedObj[cur];
    } else {
      acc[`T${idx}`].hours = reducedObj[cur];
    }

    return acc;
  }, {});
};

const getHours = (rows) => {
  return Reflect.ownKeys(rows).reduce((acc, cur) => {
    try {
      acc = acc + parseInt(rows[cur].hours);
    } catch (e) {
      console.log("error row is not populated");
      acc = acc + 0;
    }
    return acc;
  }, 0);
};

const TrainingMod = ({ data, doToggleTrainingDisplay }) => {
  const [rows, setRows] = useState(getEditRowsModal(data));
  const [hours, setHours] = useState(getHours(rows));
  const [isSaving, isSetSaving] = useState(false);
  let formType = "";
  let homeId = "";
  let _id = "";
  if (data) {
    formType = data.formType;
    homeId = data.homeId;
    _id = data._id;
  }

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
      //   setHours(acc);
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

      await postTraining(_id, flatValues, formType);
      doToggleTrainingDisplay(true);
    } catch (e) {
      alert(e);
      isSetSaving(false);
    }
    isSetSaving(false);
  };

  return (
    <div className="formComp">
      <div className="formTitleDiv">
        <h2 className="formTitle">{formType}</h2>
      </div>
      <div className="formFieldsMobile">
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
            <label>{hours}</label>
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
