import React, { Component } from "react";

const selectedUserNameClass = {
  color: "maroon",
  // padding: "10px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "800",
  width: "80%",
};

const userNameClass = {
  color: "black",
  // padding: "10px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "300",
};

const reportDateTimeClass = {
  width: "20%"
}

const reportDetailsClass = {
  width: "60%"
}

class FormSubmitterListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: -1,
      formType: props.formType,
    };
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
              <table class="table table-hover" style={{marginBottom:"0px", borderTopColor:"white"}}>
                  {formIndex === 0 && (
                     <thead style={{borderTopColor:"white"}}>
                     <tr style={{borderTop:"white"}}>
                        <th style={reportDateTimeClass} colspan="2">
                        {this.state.formType === "Incident Report" ? "Incident Occured Date" : "Report Created Date"}
                        </th>
                        <th style={reportDetailsClass}>
                          {this.state.formType === "Incident Report" ? "Incident Explanation" : "Reported By"}
                        </th>
                     </tr>
                     </thead>
                    )}               
                <tbody>
                  <tr>
                    <td style={reportDateTimeClass}>
                      {/* TODO: need to change format recorded on Incident Report to maintain consistency, or something else */}
                    {this.state.formType === "Incident Report" ? form.dateOfIncident : `${new Date(form.createDate).toLocaleDateString()}`}
                    </td>
                    <td style={reportDateTimeClass}>
                    {this.state.formType === "Incident Report" ? form.time_of_incident : `${new Date(form.createDate).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})}`}
                      {/* TODO: need to capture AM/PM recorded in Incident Report form */}
                    </td>
                    <td style={reportDetailsClass}>
                      { this.state.formType === "Incident Report" ?
                        /* Incident Report Summary displayed upon button click */
                        <div>
                          {form.result === "" ? "None specified." : form.result}
                        </div>
                        :
                        /* Non-Incident Report Summary displayed upon button click */
                        <div>
                          {form.createdByName}
                        </div>
                      }
                    </td>
                  </tr>
                </tbody>
              </table>




                      
              
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
