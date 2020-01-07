import React, { Component } from "react";
import Fade from "react-reveal/Fade";
import "./Testimonial.css";

class Testimonial extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    if (this.props.dir === "right") {
      return (
        <div className="container-fluid testimonialContainer">
          <div className="testimonialRow row">
            <div className="col-sm-6">
              <Fade bottom>
                <div className="testimonialDiv">
                  <div className="testimonialImgDiv">
                    <img
                      alt="testImg"
                      className="testimonialImg imgL"
                      src={require("../Header/images/Caregiver-Assistance.jpg")}
                    />
                  </div>
                  <p className="testimonialP">
                    Health care, health-care, or healthcare is the maintenance
                    or improvement of health via the prevention, diagnosis, and
                    treatment of disease, illness, injury, and other physical.
                  </p>
                  <h1 className="testimonialHeader">John Doe</h1>
                  <p className="testimonialCo">Some Medical Company</p>
                </div>
              </Fade>
            </div>
            <div className="col-sm-6" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="container-fluid testimonialContainer">
          <div className="testimonialRow row">
            <div className="col-sm-6 testimonialBtnContainer">
              <div className="testimonialBtnDiv">
                <button className="btn darkBtn">Request a Demo</button>
              </div>
            </div>
            <div className="col-sm-6">
              <Fade bottom>
                <div className="testimonialDiv testimonialDivL">
                  <div className="testimonialImgDiv">
                    <img
                      alt="testImg"
                      className="testimonialImg imgL"
                      src={require("../Header/images/Caregiver-Assistance.jpg")}
                    />
                  </div>
                  <p className="testimonialP">
                    Health care, health-care, or healthcare is the maintenance
                    or improvement of health via the prevention, diagnosis, and
                    treatment of disease, illness, injury, and other physical.
                  </p>
                  <h1 className="testimonialHeader">John Doe</h1>
                  <p className="testimonialCo">Some Medical Company</p>
                </div>
              </Fade>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Testimonial;
