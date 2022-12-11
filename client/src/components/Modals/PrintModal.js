import React, { Component } from 'react';

class PrintModal extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (
            <div className="modal fade" id="PrintModal" tabIndex="-1" role="dialog" aria-labelledby="PrintModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header" style={{backgroundColor:"#f5f4f4"}}>
                  <button type="button" id="closePrintModel" style={{position:"relative",top:"-10px"}} className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  </div>
                </div>
              </div>
            </div> );
    }
}
 
export default PrintModal;