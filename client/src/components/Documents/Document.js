import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";

function Document(props){
    return(<ListGroup.Item>
        {props.title}
        <button className="btn btn-default" onClick={props.download.bind({},props.id)}>v</button>
    </ListGroup.Item>)
}

export default Document;