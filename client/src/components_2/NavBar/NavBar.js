import React from "react";
import { Button, Navbar, Container, Nav } from "react-bootstrap";
import styled from "styled-components";

export const NavBar = () => {
  //   const HomeNavBar = (
  //     <div id="HomeNavBar" className="d-flex justify-content-end">
  //         <div className="HomeNavBar-item-container">

  //         </div>
  //         <div>
  //       <div className="HomeNavBar-item-container">
  //         <Button>Log in</Button>
  //       </div>
  //       <div className="HomeNavBar-item-container ">
  //         <Button>Sign up</Button>
  //       </div>
  //     </div>
  //   );
  return (
    <Navbar expand="lg" variant="light" id="mainNav" className="p-2">
      <Navbar.Brand href="/">LOGO</Navbar.Brand>

      {/* ADD back for logged in flow */}
      {/* <Navbar.Toggle id="mainNavToggle" /> */}
      {/* <Navbar.Collapse className="justify-content-end">
          <div id="NavDropDownItemContainer">
            <Button>
              <span>Programs</span>
            </Button>
            <Button>
              <span>Programs</span>
            </Button>
            <div className="navDropDownItem"></div>
          </div>
        </Navbar.Collapse> */}
      <div className="d-flex">
        <Nav.Link href="#home">Log in</Nav.Link>
        <Nav.Link href="#link">Sign up</Nav.Link>
      </div>
    </Navbar>
  );
};
