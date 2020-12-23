import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
function Document({ data, id, download, getUserName }) {
  console.log(data.img);
  const [imageSrc, setImageSrc] = useState(null);

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
        </div>
        {/* {imageSrc && <img src={imageSrc} />} */}
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
