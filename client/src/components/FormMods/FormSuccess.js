import React, { Component } from 'react';

class FormSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <p className="successTest" id={this.props.successId} style={{color:"green",display:"none"}}>
{this.props.children}
        </p> );
    }
}
 
export default FormSuccess;