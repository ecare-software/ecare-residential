import React, { Component } from "react";
import { Alert } from "react-bootstrap";
import { Fade } from "react-bootstrap";
import "../../App.css";

class FormAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // if (this.props.doShow) {
    //   if (this.props.type === "success") {
    return (
      <Fade in={this.props.doShow === true}>
        <div>
          {this.props.type === "success" ? (
            <Alert variant={this.props.type}>
              <Alert.Heading>{this.props.heading}</Alert.Heading>
              {this.props.children}
            </Alert>
          ) : (
            <Alert
              variant={this.props.type}
              onClose={this.props.toggleErrorAlert}
              dismissible
            >
              <Alert.Heading>{this.props.heading}</Alert.Heading>
              {this.props.children}
            </Alert>
          )}
        </div>
      </Fade>
    );
  }
  //   if (this.props.type === "error") {
  //     return (
  //       <Alert className="alert" variant="danger">
  //         <Alert.Heading>Hey, nice to see you</Alert.Heading>
  //         {this.props.children}
  //       </Alert>
  //     );
  //   }
  // } else {
  //   return <React.Fragment />;
  // }
  //   }
}

export default FormAlert;
