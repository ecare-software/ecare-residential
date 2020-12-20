import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
function Document({ data, id, download, getUserName }) {
  return (
    <ListGroup.Item>
      <div className="row">
        <div className="col-md-10">
          <h5>{data.imageName}</h5>
          <h6>Created By:{` ${getUserName(data.email)}`}</h6>
          <h6>Date:{` ${new Date(data.uploadDate).toLocaleString()}`}</h6>
        </div>
        <div className="col-md-2">
          <button className="btn btn-light" onClick={download.bind({}, id)}>
            View
          </button>
        </div>
      </div>
    </ListGroup.Item>
  );
}

export default Document;
