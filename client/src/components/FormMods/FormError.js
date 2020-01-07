import React, { Component } from 'react';

class FormError extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <p className="errorTest" id={this.props.errorId} style={{color:"red",display:"none"}}>
{this.props.children}
        </p> );
    }
}
 
export default FormError;