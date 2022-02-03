import React from "react";
import Fade from "react-reveal/Fade";
import caregiverAssistance from "../Header/images/Caregiver-Assistance.jpg";
import "./Testimonial.css";

const Testimonial = ({ dir }) => {
  return dir === "right" ? (
    <div className="container-fluid testimonialContainer">
      <div className="testimonialRow row">
        <div className="col-sm-6">
          <Fade bottom>
            <div className="testimonialDiv">
              <div className="testimonialImgDiv">
                <img
                  alt="testImg"
                  className="testimonialImg imgL"
                  src={caregiverAssistance}
                />
              </div>
              <p className="testimonialP">
                Health care, health-care, or healthcare is the maintenance or
                improvement of health via the prevention, diagnosis, and
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
  ) : (
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
                  src={caregiverAssistance}
                />
              </div>
              <p className="testimonialP">
                Health care, health-care, or healthcare is the maintenance or
                improvement of health via the prevention, diagnosis, and
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
};

export default Testimonial;
