import React from "react";
import Headroom from "headroom.js";
// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";

class Hero extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }
  async componentDidMount() {
    let headroom = new Headroom(document.getElementById("navbar-main"));
    // initialise
    headroom.init();
    if (localStorage.getItem("isLoggedIn") !== null) {
      await this.setState({
        isLoggedIn: localStorage.getItem("isLoggedIn")
      });
    }
  }
  render() {
    return (
      <>
        <div className="position-relative">
          {/* Hero for FREE version */}
          <section className="section section-lg section-hero section-shaped">
            {/* Background circles */}
            <div className="shape shape-style-1 shape-default">
              <span className="span-150" />
              <span className="span-50" />
              <span className="span-50" />
              <span className="span-75" />
              <span className="span-100" />
              <span className="span-75" />
              <span className="span-50" />
              <span className="span-100" />
              <span className="span-50" />
              <span className="span-100" />
            </div>
            <Container className="shape-container d-flex align-items-center py-sm">
              <div className="col px-0">
                <Row className="align-items-center justify-content-center">
                  <Col className="text-center" lg="6">
                    <img
                      alt="..."
                      className="img-fluid"
                      src={require("assets/img/brand/logo-white.png")}
                      style={{ width: "400px" }}
                    />
                    <p className="lead text-white">
                      A web-based system that allows individuals lending money
                      to others.
                    </p>
                    {this.state.isLoggedIn ? (
                      ""
                    ) : (
                      <div className="btn-wrapper mt-5">
                        <Button
                          className="btn-white btn-icon mb-3 mb-sm-0"
                          color="default"
                          href="/register-page"
                          size="lg"
                        >
                          <span className="btn-inner--icon mr-1">
                            <i className="ni ni-cloud-download-95" />
                          </span>
                          <span className="btn-inner--text">
                            Sign up to Join
                          </span>
                        </Button>{" "}
                      </div>
                    )}
                    {/* <div className="mt-5">
                      <small className="text-white font-weight-bold mb-0 mr-2">
                        *proudly coded by
                      </small>
                      <img
                        alt="..."
                        className="ml-1"
                        style={{ height: "28px" }}
                        src={require("assets/img/brand/creativetim-white-slim.png")}
                      />
                    </div> */}
                  </Col>
                </Row>
              </div>
            </Container>
            {/* SVG separator */}
            <div className="separator separator-bottom separator-skew zindex-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
        </div>
      </>
    );
  }
}

export default Hero;
