import React, { Component } from "react";

class SaveSubmitContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      };
    
      validateForm = async (save) => {
        this.setState({
          ...this.state,
          loadingClients: true,
        });
    
        if (!this.state.createDate) {
          this.setState({
            formHasError: true,
            formErrorMessage: `Please complete the following field(s): Create Date`,
          });
          return;
        } else {
          this.setState({
            ...this.state,
            createDate: new Date(this.state.createDate),
          });
        }
    
        this.submit();
      };

    render () {
        return (
            <div className="form-group logInInputField"
                style={{ display: "flex", justifyContent: "space-between" }}
                >
                <button className="lightBtn hide-on-print"
                    onClick={() => {
                    this.validateForm(true);
                    }}
                >
                    Save
                </button>

                <button className="darkBtn hide-on-print"
                    onClick={() => {
                    this.validateForm(false);
                    }}
                >
                    Submit
                </button>
                </div>
        )
    }

}

export default SaveSubmitContainer;