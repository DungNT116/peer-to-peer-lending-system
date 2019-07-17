import React from "react";

// reactstrap components
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input
} from "reactstrap";
// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import { apiLink } from '../../api.jsx';
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    firstName: '',
    lastName: '',
    loanLimit: 0,
    email: '',
    phoneNumber: '',
    }
    this.getProfile = this.getProfile.bind(this);
  }
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    this.getProfile();
  }

  getProfile() {
    fetch(apiLink + "/rest/user/getUser", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
        // "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      }
    }).then(
      (result) => {
        if (result.status === 200) {
          // alert("create success");
          // this.props.history.push('view-new-request');
          result.json().then((data) => {
            console.log(data);
            this.setState({
              username: data.username,
              firstName: data.firstName,
              lastName: data.lastName,
              loanLimit: data.loanLimit,
              email: data.email,
              phoneNumber: data.phoneNumber,
            })
          })
        } else if (result.status === 401) {
          localStorage.removeItem("isLoggedIn");
          this.props.history.push('/login-page')
        }

      }
    )
  }

  render() {
    const style ={
      profileComponent :{
        position:'relative',
        top: -250,
      },
      myAccount : {
        position: 'relative',
        top: -150,
      }
    }
    return (
      <>
        <DemoNavbar />
        <main className="profile-page" ref="main">
          <section className="section-profile-cover section-shaped my-0 bg-gradient-info">
            {/* <div className="shape shape-style-1 shape-default alpha-4">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div> */}
            {/* SVG separator */}
            <div className="separator separator-bottom separator-skew">
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
          <section className="section">
          
            <Container className="mt--7" style={style.profileComponent} > {/* fluid */}
              <Row>
                <Col className="order-xl-1 mb-5 mb-xl-0" xl="4">
                  <Card className="card-profile shadow">
                    <Row className="justify-content-center">
                      <Col className="order-lg-2" lg="3">
                        <div className="card-profile-image">
                          <a href="#pablo" onClick={e => e.preventDefault()}>
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={require("assets/img/theme/team-4-800x800.jpg")}
                            />
                          </a>
                        </div>
                      </Col>
                    </Row>
                    <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                      <div className="d-flex justify-content-between">
                        {/* <Button
                          className="mr-4"
                          color="info"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                          size="sm"
                        >
                          Connect
                        </Button>
                        <Button
                          className="float-right"
                          color="default"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                          size="sm"
                        >
                          Message
                        </Button> */}
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0 pt-md-4">
                      <Row>
                        <div className="col">
                          <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                            {/* <div>
                              <span className="heading">22</span>
                              <span className="description">Friends</span>
                            </div>
                            <div>
                              <span className="heading">10</span>
                              <span className="description">Photos</span>
                            </div>
                            <div>
                              <span className="heading">89</span>
                              <span className="description">Comments</span>
                            </div> */}
                          </div>
                        </div>
                      </Row>
                      <div className="text-center">
                        <h3>
                          Jessica Jones
                          <span className="font-weight-light">, 27</span>
                        </h3>
                        <div className="h5 font-weight-300">
                          <i className="ni location_pin mr-2" />
                          Bucharest, Romania
                        </div>
                        <div className="h5 mt-4">
                          <i className="ni business_briefcase-24 mr-2" />
                          Solution Manager - Creative Tim Officer
                        </div>
                        <div>
                          <i className="ni education_hat mr-2" />
                          University of Computer Science
                        </div>
                        <hr className="my-4" />
                        <p>
                          Ryan — the name taken by Melbourne-raised,
                          Brooklyn-based Nick Murphy — writes, performs and
                          records all of his own music.
                        </p>
                        <a href="#pablo" onClick={e => e.preventDefault()}>
                          Show more
                        </a>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col className="order-xl-2 " style={style.myAccount} xl="8">
                  <Card className="bg-secondary shadow">
                    <CardHeader className="bg-white border-0">
                      <Row className="align-items-center">
                        <Col xs="6">
                          <h3 className="mb-0">My account</h3>
                        </Col>
                        <Col className="text-right" xs="3">
                          <Button
                            color="primary"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                            size="sm"
                          >
                            Edit Profile
                          </Button>
                        </Col>
                        <Col className="text-right" xs="3">
                          <Button
                            color="primary"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                            size="sm"
                          >
                            Change Password
                          </Button>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <Form>
                        <h6 className="heading-small text-muted mb-4">
                          User information
                        </h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-phonenumber"
                                >
                                  Phone Number
                                </label>
                                <p>{this.state.phoneNumber}</p>
                                <Input
                                  className="form-control-alternative"
                                  value={this.state.phoneNumber}
                                  id="input-phonenumber"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-email"
                                >
                                  Email address
                                </label>
                                <p>{this.state.email}</p>
                                <Input
                                  className="form-control-alternative"
                                  value={this.state.email}
                                  id="input-email"
                                  type="email"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-first-name"
                                >
                                  First name
                                </label>
                                <p>{this.state.firstName}</p>
                                <Input
                                  className="form-control-alternative"
                                  value={this.state.firstName}
                                  id="input-first-name"
                                  placeholder="First name"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-last-name"
                                >
                                  Last name
                                </label>
                                <p>{this.state.lastName}</p>
                                <Input
                                  className="form-control-alternative"
                                  value={this.state.lastName}
                                  id="input-last-name"
                                  placeholder="Last name"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <hr className="my-4" />
                        {/* Description */}
                        <h6 className="heading-small text-muted mb-4">
                          About me
                        </h6>
                        <div className="pl-lg-4">
                          <FormGroup>
                            <Input
                              className="form-control-alternative"
                              placeholder="A few words about you ..."
                              rows="4"
                              defaultValue="A beautiful Dashboard for Bootstrap 4. It is Free and
                          Open Source."
                              type="textarea"
                            />
                          </FormGroup>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>
        </main>
        <SimpleFooter />
      </>
    );
  }
}

export default Profile;
