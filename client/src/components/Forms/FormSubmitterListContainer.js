import React, { Component } from "react";
import ShowFormContainer from "../Reports/ShowFormContainer";
import { isAdminUser } from "../../utils/AdminReportingRoles";
import ClipLoader from "react-spinners/ClipLoader";
import { FetchHomeData } from "../../utils/FetchHomeData";


const selectedUserNameClass = {
  color: "maroon",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "800",
  width: "80%",
};

const userNameClass = {
  color: "black",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "300",
  display: "flex",
  justifyContent: "center"
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
      submittions: props.submittions,
      showFullForms: false,
      formsToPrint: [],
      forms: [],
      userObj: props.userObj,
      homeData: ' ',
      searchObj: props.searchObj
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

  triggerPrint = () => {
    /*
    1. change all of the listed forms to full view of forms
    */
    this.setState({ ...this.state, showFullForms: true });
    /*
    2. call print method, (window.print()), bringing up the print window on the list of forms
    */

    // 2.1 list forms (loop)
    const allForms = this.props.submittions;

    //2.2 display all of the forms
    const allFormComps = allForms.reduce((acc, form) => {
      form = { ...form, name: form.formType };
      acc.push(
        <ShowFormContainer
          valuesSet='true'
          userObj={this.state.userObj}
          formData={form}
          form={form}
          isAdminRole={isAdminUser(this.state.userObj)}
        />
      );
      return acc;
    }, []);
    this.setState({ ...this.state, formsToPrint: allFormComps });

    /*
    3. change the view back after set amount of time, showing list of filtered forms again
    */
    setTimeout(() => {
      window.print();
    }, 5000);

    setTimeout(() => {
      this.setState({ ...this.state, showFullForms: false, formsToPrint: [] });
    }, 8000);
  };

  setHomeData = async () => {
    try {
      const { data } = await FetchHomeData(this.state.submittions[0].homeId);
      this.setState({ homeData: data[0]});
      console.log('homeData in setHomeData:', this.state.homeData.name)
      this.printTable();
    } catch (e) {
      console.log('Error fetching home info');
    }
  };
  
  printTable = () => {
    {console.log('homeData in printTable:', this.state.homeData.name)}
    window.print();
  }

  render() {
    if (this.state.formsToPrint.length > 0) {
      return (
        <div className="container">
          <div 
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "start",
              marginTop: "100px",
              marginBottom: "100px",
              marginLeft: "0px",
            }}
            className='hide-on-print row'
          >
            <div className="col-xs-4">
              <ClipLoader className='formSpinner' size={40} color={"#ffc107"} />
            </div>
            <div className="col-xs-8">
              <h1 style={{fontSize:"1.2rem", paddingLeft:"10px", paddingTop:"5px"}}>Printing {this.state.formType} Forms. Please wait...</h1>
            </div>
            
          </div>
          <div className='hide-on-non-print'>
            {this.state.formsToPrint.map((form, idx) => (
              <div key={`print-form-${idx}`}>{form}</div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <ul style={{ listStyleType: "none", padding: "0px" }}>
        {/* home info printed on top of table */}
        {this.state.homeData && (
        <div className="hide-on-non-print">
            <h3 className='text-center'>
              {this.state.homeData.name && `RTC - ${this.state.homeData.name}`}
            </h3>
            {this.state.homeData.address && (
              <h4 className='text-center'>
                {`${this.state.homeData.address?.street}, ${this.state.homeData.address?.city}, ${this.state.homeData.address?.state} ${this.state.homeData.address?.zip}`}
              </h4>
            )}
              <h4 className='text-center'>
              {this.state.homeData.phone && `${this.state.homeData.phone}`}
            </h4>
            <h3 style={{paddingLeft:"50px"}}>
              {this.props.formType} Overview
            </h3>
            {/* TODO: add more filters to print area */}
            {this.state.searchObj.searchString.length > 0 && (
              <p style={{paddingLeft:"50px"}}>Client Name - {this.state.searchObj.searchString}</p>
            )}
          </div>
          )}
        <div className="hide-on-print" style={{paddingBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <button onClick={this.triggerPrint} className='btn btn-link'>
              <span className='fa fa-print'></span> Print {this.props.formType} Forms
            </button>
            <button onClick={this.setHomeData} className='btn btn-link'>
              <span className='fa fa-print'></span> Print Table
            </button>
            
        </div>
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
              <table class="table table-hover" id="report-table" style={{width: "90%", marginBottom:"0px"}}>
                  {formIndex === 0 && (
                     <thead>
                     <tr>
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
                    {this.state.formType === "Incident Report" ? `${new Date(form.dateOfIncident + 'T00:00:00').toLocaleDateString()}` : `${new Date(form.createDate).toLocaleDateString()}`}
                    </td>
                    <td style={reportDateTimeClass}>
                    {this.state.formType === "Incident Report" ? 
                      `${new Date('01/01/2001 '+ form.time_of_incident).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true, hourCycle: 'h12'})}` : 
                      `${new Date(form.createDate).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})}`
                    }
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
