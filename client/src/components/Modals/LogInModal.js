import React, { Component } from 'react';
import LogInContiner from "../LogInContainer/LogInContainer";

class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (
            <div className="modal fade" id="logInModal" tabIndex="-1" role="dialog" aria-labelledby="logInModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header" style={{backgroundColor:"#f5f4f4"}}>
                  <button type="button" id="closeLoginModel" style={{position:"relative",top:"-10px"}} className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  </div>

                    <LogInContiner id="mobileLogin" logIn={this.props.logIn} pos={{position: "absolute",
    top: "50%"}} />
                </div>
              </div>
            </div> );
    }
}
 
export default LoginModal;