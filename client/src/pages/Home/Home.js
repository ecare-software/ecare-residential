import styled from "styled-components";
import "./style.css";
import img from "../../images/desktop.png";
import iPhone from "../../images/iphone.gif";
import { NavBar } from "../../components_2";
import { Button, Col, Row } from "react-bootstrap";
{
  /* Logging functionality */
}
{
  /* email for demo feature */
}
{
  /* content about ecare - residential and ecare-software */
}
{
  /* image carousel */
}

const Hero = styled.div`
  background-image: url(${img});
`;

export default function Home() {
  return (
    <div className="container-fluid" id="Home-Page">
      <NavBar />
      <Row>
        <Hero
          id="HomeHero"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Col lg="12" style={{ height: "50px" }}>
            Residential Care System
          </Col>
          <Col lg="12" style={{ height: "50px" }}>
            <Button>Learn more</Button>
            <Button variant="link">Sign in</Button>
          </Col>
        </Hero>
      </Row>
      <Row>
        <Col lg="12">
          <h2>Documentation management and communication for your team</h2>
        </Col>
      </Row>
      <Row>
        <Col lg="6" style={{ display: "flex", justifyContent: "end" }}>
          <img src={iPhone} style={{ width: "400px" }} />
        </Col>
        <Col
          lg="6"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h3>Simple, easy to use documenting and messaging software suite.</h3>
          <h3>
            We aim to provide a simple, functional software solution for both
            large and small scale behavior residential care facilities.
          </h3>
        </Col>
      </Row>
    </div>
  );
}
