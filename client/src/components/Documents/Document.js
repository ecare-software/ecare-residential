import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { Form, Col } from "react-bootstrap";
import Axios from "axios";
function Document({ data, isAdminRole, userObj, id, download, getUserName }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isApproved, setIsApproved] = useState(
    data.approved ? data.approved : false
  );
  const [approvedByText, setApprovedByText] = useState(
    data.approved === true
      ? `${data.approvedByName}, ${new Date(
          data.approvedByDate
        ).toLocaleString()}`
      : ""
  );

  const setApprovedLabel = (approved) => {
    if (approved) {
      return `Approved by ${approvedByText}`;
    } else {
      if (isAdminRole) {
        return "Approve submission";
      } else {
        return "Not yet approved";
      }
    }
  };

  const updateApproval = async () => {
    let isApprovedPostData = !isApproved;
    await setIsApproved(isApprovedPostData);
    try {
      await Axios.put(`/api/uploadDocument/${userObj.homeId}/${id}`, {
        approved: isApprovedPostData,
        approvedBy: userObj.email,
        approvedByName: `${userObj.firstName} ${userObj.lastName}`,
        approvedByDate: new Date(),
      });
      setApprovedByText(
        `${userObj.firstName} ${
          userObj.lastName
        } ${new Date().toLocaleString()}`
      );
    } catch (e) {
      //go back
      alert("Error update form state");
      setApprovedByText("");
      setIsApproved(!isApproved);
    }
  };

  useEffect(() => {
    function _arrayBufferToBase64(buffer) {
      var binary = "";
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }
    if (data.img) {
      const base64Flag = `data:${data.img.contentType};base64,`;
      setImageSrc(base64Flag + _arrayBufferToBase64(data.img.data.data));
    }
  });
  return (
    <ListGroup.Item>
      <div className="row">
        <div className="col-md-10">
          <h5>{data.imageName}</h5>
          <h6>Created By:{` ${getUserName(data.email)}`}</h6>
          <h6>Date:{` ${new Date(data.uploadDate).toLocaleString()}`}</h6>
          <div>
            <Form.Row>
              <Col xs="auto">
                <Form.Check
                  type="checkbox"
                  id={`autoSizingCheck-${id}`}
                  className="mb-2 d-flex align-items-center"
                  label={setApprovedLabel(isApproved)}
                  disabled={!isAdminRole}
                  checked={isApproved}
                  onClick={updateApproval}
                />
              </Col>
            </Form.Row>
          </div>
        </div>
        <div className="col-md-2 d-flex align-items-center">
          <button className="btn btn-light" onClick={download.bind({}, id)}>
            download
          </button>
        </div>
      </div>
    </ListGroup.Item>
  );
}

export default Document;
