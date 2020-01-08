import React, { Component } from 'react';
import "./Navbar.css";
import "../../App.css";

class NavbarItem extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <div className={this.props.isItemSelected==="true" ? "NavbarItem NavbarItem-active" : "NavbarItem"}>
           <span className="NavbarItemText">{this.props.children}</span>
        </div> );
    }
}
 
export default NavbarItem;