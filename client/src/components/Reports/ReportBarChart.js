import React, { Component } from 'react';
// import {
//     BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
//   } from 'recharts';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';

class ReportBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 

        if(this.props.data.length>0){
        return ( 
        <BarChart
            width={500}
            height={300}
            data={this.props.data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="submissions" fill="red" />
          </BarChart>
           );
        }else{
            return (<div></div>)
        }
    }
}
 
export default ReportBarChart;