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
    switch (this.props.type) {
      case "success":
        return (
          <Fade in={this.props.doShow === true}>
            <div>
              <Alert variant={this.props.type}>
                <Alert.Heading>{this.props.heading}</Alert.Heading>
                {this.props.children}
              </Alert>
            </div>
          </Fade>
        );

      case "light":
        return (
          <Fade in={this.props.doShow === true}>
            <div>
              <Alert variant={this.props.type}>
                <Alert.Heading>{this.props.heading}</Alert.Heading>
                {this.props.children}
              </Alert>
            </div>
          </Fade>
        );

      default:
        return (
          <Fade in={this.props.doShow === true}>
            <div>
              <Alert
                variant={this.props.type}
                onClose={this.props.toggleErrorAlert}
                dismissible
              >
                <Alert.Heading>{this.props.heading}</Alert.Heading>
                {this.props.children}
              </Alert>
            </div>
          </Fade>
        );
    }
    return (
      <Fade in={this.props.doShow === true}>
        <div>
          {this.props.type !== "success" ? (
            <Alert
              variant={this.props.type}
              onClose={this.props.toggleErrorAlert}
              dismissible
            >
              <Alert.Heading>{this.props.heading}</Alert.Heading>
              {this.props.children}
            </Alert>
          ) : (
            <Alert variant={this.props.type}>
              <Alert.Heading>{this.props.heading}</Alert.Heading>
              {this.props.children}
            </Alert>
          )}
        </div>
      </Fade>
    );
  }
}

export default FormAlert;
