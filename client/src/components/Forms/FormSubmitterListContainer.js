import React, { Component } from "react";

const selectedUserNameClass = {
  color: "maroon",
  padding: "10px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "800",
  width: "80%",
};

const userNameClass = {
  color: "black",
  padding: "10px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "300",
};

class FormSubmitterListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: -1,
      formType: props.formType,
    };
    var formType = props.formType
    console.log('forms on FormSubmitterListContainer:', props)
    console.log('form type:', this.state.formType)
  }

  selectUser = (userId) => {
    if (this.state.selectedUser === userId) {
      this.setState({ selectedUser: -1 });
      this.props.setSelectedUser(-1);
    } else {
      this.setState({ selectedUser: userId });
      this.props.setSelectedUser(userId);
    }
  };

  componentWillReceiveProps() {
    if (this.props.reset) {
      this.setState({ selectedUser: -1 });
    }
  }

  render() {
    return (
      <ul style={{ listStyleType: "none", padding: "0px" }}>
        {this.props.submittions.length > 0 ? (
          this.props.submittions.map((form, formIndex) => (
            <li
              onClick={this.selectUser.bind("", formIndex)}
              style={
                this.state.selectedUser === formIndex
                  ? selectedUserNameClass
                  : userNameClass
              }
              key={formIndex}
            >
              {/* Report View  */}
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div className='col-sm-2'>
                  {`${new Date(form.createDate).toLocaleDateString()}  `} 
                </div>
                <div className='col-sm-3'>
                  {`${new Date(form.createDate).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})}`} 
                </div>
                { this.state.formType === "Incident Report" ?
                /* Incident Report Summary displayed upon button click */
                <div className='col-sm-7'>
                  {form.result === "" ? "None specified." : form.result}
                </div>
                :
                /* Non-Incident Report Summary displayed upon button click */
                <div className='col-sm-7'>
                  {form.createdByName}
                </div>
  }
              </div>           
              
            </li>
          ))
        ) : (
          <p>No records found</p>
        )}
      </ul>
    );
  }
}

export default FormSubmitterListContainer;
