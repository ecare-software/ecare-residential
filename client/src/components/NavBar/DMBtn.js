import React, { Component } from "react";

class DMB extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  updateDefaultValue = ()=>{
    if(this.props.toUser!==undefined){
      document.getElementById("to").value = this.props.toUser;
      document.getElementById("to").setAttribute("disabled",true);
    }else{
      document.getElementById("to").value = "";
      document.getElementById("to").removeAttribute("disabled");
    }
  }


  render() {
    return (
      <button
      onClick={this.updateDefaultValue}
      data-toggle="modal" data-target="#sendMessageModal"
        style={{
          color: this.props.bgColor,
          fontSize: this.props.fontSz ? this.props.fontSz : ""
        }}
        className="btn DMBtn btn-link"
      >
        <span style={{paddingRight:"10px"}}>{this.props.children}</span>
        <span
          className="glyphicon glyphicon-envelope
"
        />
      </button>
    );
  }
}

export default DMB;
