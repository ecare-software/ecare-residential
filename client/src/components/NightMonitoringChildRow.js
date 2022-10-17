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

  let sigCanvas;
  const doFormatChildMetaName = (val) => {
    try {
      const { childMeta_name } = JSON.parse(val);
      setChildMeta_name(childMeta_name);
    } catch (e) {
      alert("Error fetching client data");
    }
  };

  useEffect(() => {
    if (signature && signature.length) {
      sigCanvas.fromData(signature);
      sigCanvas.off();
    }
  }, [signature]);

  useEffect(() => {
    console.log(rootState);
    setRootState({
      date,
      roomNumber,
      timeChildAwake,
      timeChildReturnBed,
      reason,
      signed,
      childMeta_name,
    });
  }, [
    date,
    roomNumber,
    timeChildAwake,
    timeChildReturnBed,
    reason,
    signed,
    childMeta_name,
  ]);

  return (
    <Row style={{ marginBottom: "50px" }}>
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
                type="text"
              ></TextareaAutosize>
            </div>
          </Col>
          <Col md="6" className="control-label text-center">
            {signed ? (
              <div className="mb-2 d-flex align-items-center">
                {
                  <a
                    href="javascript:void(0)"
                    className="hide-on-print"
                    onClick={() => {
                      setSigned(false);
                    }}
                  >
                    Signed. Remove signature?
                  </a>
                }
              </div>
            ) : (
              <Form.Check
                type="checkbox"
                className="mb-2 hide-on-print d-flex align-items-center justify-content-space-between"
                label={valuesSet ? "Not Completed or Signed" : "Click to sign"}
                onClick={() => {
                  setSigned(true);
                  console.log(sigCanvas);
                  if (signature && signature.length) {
                    sigCanvas.fromData(signature);
                    sigCanvas.off();
                  }
                }}
              />
            )}
          </Col>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              visibility: signed ? "visible" : "hidden",
            }}
          >
            <SignatureCanvas
              ref={(ref) => {
                sigCanvas = ref;
              }}
              style={{ border: "solid" }}
              penColor="black"
              clearOnResize={false}
              canvasProps={{
                width: 600,
                height: 200,
                className: "sigCanvas",
              }}
              backgroundColor="#eeee"
            />
          </div>
        </Row>
      </Col>
    </Row>
  );
};
