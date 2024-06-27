import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import ClientOption from "../utils/ClientOption.util";
import TextareaAutosize from "react-textarea-autosize";
export const NightMonitoringChildRow = ({
  setRootState,
  rootState,
  valuesSet,
  clients = [],
  signature,
  propsSet = false,
}) => {
  const [date, setDate] = useState(rootState?.date);
  const [roomNumber, setRoomNumber] = useState(rootState?.roomNumber);
  const [timeChildAwake, setTimeChildAwake] = useState(
    rootState?.timeChildAwake
  );
  const [timeChildReturnBed, setTimeChildReturnBed] = useState(
    rootState?.timeChildReturnBed
  );
  const [reason, setReason] = useState(rootState?.reason);
  const [signed, setSigned] = useState(rootState?.signed);
  const [childMeta_name, setChildMeta_name] = useState(
    rootState?.childMeta_name
  );
  const [childSelected, setChildSelected] = useState(rootState?.childSelected);
  const [formSubmitted, setFormSubmitted] = useState(rootState?.formSubmitted);
  const [status, setStatus] = useState(rootState?.status);

  let sigCanvas;
  const doFormatChildMetaName = (val) => {
    try {
      const { childMeta_name } = JSON.parse(val);
      setChildMeta_name(childMeta_name);
      setChildSelected(true);
    } catch (e) {
      alert("Error fetching client data");
    }
  };

  useEffect(() => {
    if (signature && signature.length) {
      sigCanvas.fromData(signature);
      sigCanvas.off();
      console.log('sig & sig.length')
    }
  }, [signature]);

  useEffect(() => {
    if (childMeta_name !== "") {
      setChildSelected(true);
    }
    setRootState({
      date,
      roomNumber,
      timeChildAwake,
      timeChildReturnBed,
      reason,
      signed,
      childMeta_name,
      childSelected,
      formSubmitted,
      status
    });
  }, [
    date,
    roomNumber,
    timeChildAwake,
    timeChildReturnBed,
    reason,
    signed,
    childMeta_name,
    childSelected,
    formSubmitted,
    status
  ]);

  return (
    <Row style={{ marginBottom: "20px" }}>
      <Col sm={12}>
        <Row
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Col sm={4}>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Child's Name</label>{" "}
              {propsSet ? (
                <input
                  onChange={(e) => {
                    setChildMeta_name(e.target.value);
                  }}
                  id="childMeta_name"
                  defaultValue={childMeta_name}
                  className="form-control"
                  type="text"
                  disabled={childSelected ? true : false}
                />
              ) : (
                <Form.Control
                  as="select"
                  defaultValue={null}
                  onChange={(e) => {
                    doFormatChildMetaName(e.target.value);
                  }}
                >
                  {[null, ...clients].map(
                    (client) => (
                      <ClientOption data={client} />
                    ),
                    []
                  )}
                </Form.Control>
              )}
            </div>
          </Col>
          <Col sm={4}>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Date</label>{" "}
              <input
                onChange={(e) => {
                  setDate(e.target.value);
                }}
                id="date"
                defaultValue={date}
                className="form-control"
                disabled={childSelected ? false : true}
                type="date"
              />{" "}
            </div>
          </Col>
          <Col sm={4}>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Room Number</label>{" "}
              <input
                onChange={(e) => {
                  setRoomNumber(e.target.value);
                }}
                id="roomNumber"
                defaultValue={roomNumber}
                className="form-control"
                disabled={childSelected ? false : true}
                type="text"
              />{" "}
            </div>
          </Col>

          <Col sm={4}>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">Time child was awake</label>{" "}
              <input
                onChange={(e) => {
                  setTimeChildAwake(e.target.value);
                }}
                id="timeChildAwake"
                defaultValue={timeChildAwake}
                className="form-control"
                disabled={childSelected ? false : true}
                type="time"
              />{" "}
            </div>
          </Col>
          <Col sm={4}>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Time child went back to bed
              </label>{" "}
              <input
                onChange={(e) => {
                  setTimeChildReturnBed(e.target.value);
                }}
                id="timeChildReturnBed"
                defaultValue={timeChildReturnBed}
                className="form-control"
                disabled={childSelected ? false : true}
                type="time"
              />{" "}
            </div>
          </Col>
          <Col sm={12}>
            <div className="form-group logInInputField">
              {" "}
              <label className="control-label">
                Reason for child to be up
              </label>{" "}
              <TextareaAutosize
                onChange={(e) => {
                  setReason(e.target.value);
                }}
                id="reason"
                defaultValue={reason}
                className="form-control"
                disabled={childSelected ? false : true}
                type="text"
              ></TextareaAutosize>
            </div>
          </Col>
          <div className="sigSection"
            style={{ display: status === 'IN PROGRESS' ? 'none' : 'block' }}
          >
          <label className="control-label">Signature</label>{" "}
          <div id='sigCanvasDiv'>
              <SignatureCanvas
                ref={(ref) => {
                  sigCanvas = ref;
                }}
                style={{ border: "solid", }}
                penColor="black"
                clearOnResize={false}
                canvasProps={{
                  width: 300,
                  height: 100,
                  className: "sigCanvas",
                }}
                backgroundColor="#eeee"
              />
              </div>
            </div>
          {/* </div> */}
        </Row>
      </Col>
    </Row>
  );
};
