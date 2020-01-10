import React, { Component } from 'react';
import {
    PieChart, Pie, Sector, Cell,Tooltip,Legend
  } from 'recharts';
  
const COLORS = ['red', 'yellow', 'green',"pink","blue"];

const RADIAN = Math.PI / 180;                    
// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
//  	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x  = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy  + radius * Math.sin(-midAngle * RADIAN);
 
//   return (
//     <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
//       {data[index].name}
//     </text>
//   );
// };

class ReportPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
     const x  = cx + radius * Math.cos(-midAngle * RADIAN);
     const y = cy  + radius * Math.sin(-midAngle * RADIAN);
    
     return (
       <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
         {this.props.data[index].name}
       </text>
     );
   };
    

    render() { 
        return ( <PieChart width={400} height={250} onMouseEnter={this.onPieEnter}>
            <Pie
              data={this.props.data} 
              cx={250} 
              cy={90} 
              labelLine={false}
              xlabel={this.renderCustomizedLabel}
              outerRadius={80} 
              fill="#8884d8"
              dataKey="value"
            >
                {
                  this.props.data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
              }
            </Pie>
            <Tooltip/>
            <Legend/>

          </PieChart>
        );
    }
}
 
export default ReportPieChart;