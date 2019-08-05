import React from "react";
import { connect } from 'react-redux';
// import {reducer} from '../../reducers/reducer';
// import { store } from '../../store/store';
// import  { Redirect } from 'react-router-dom';
// reactstrap components
import {
  Card, CardHeader, CardBody, FormGroup, Form, Input, InputGroupAddon,
  InputGroupText, InputGroup, Container, Row, Col, Button
} from "reactstrap";
// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";

//api link
import { apiLink } from '../../api.jsx';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isForgotPassword: false,
      usernameForgotPassword: '',
      emailForgotPassword: '',
      validUsername: false,
      validEmail: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.getUsername = this.getUsername.bind(this);
    this.changeIsForgotPassword = this.changeIsForgotPassword.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.handleUsernameForgotPassword = this.handleUsernameForgotPassword.bind(this);
    this.handleEmailForgotPassword = this.handleEmailForgotPassword.bind(this);
  }

  handleEmailForgotPassword(event) {
    const tmp = event.target.value.trim();
    if (tmp.match(/^[a-zA-Z0-9]{5,30}@[a-z]{3,10}(.[a-z]{2,3})+$/)) {
      document.getElementById("emailError").innerHTML = "";
      this.setState({
        emailForgotPassword: tmp,
        validEmail: true
      });
    } else {
      document.getElementById("emailError").innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Email only contain alphabet character!</strong></div>";
      this.setState({
        emailForgotPassword: tmp,
        validEmail: false
      });
    }
  }

  handleUsernameForgotPassword(event) {
    const tmp = event.target.value.trim();
    if (!tmp.match(/^\w*$/)) {
      document.getElementById("usernameError").innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Username does not contain special character!</strong></div>";
      this.setState({
        usernameForgotPassword: tmp,
        validUsername: false
      });
    } else {
      document.getElementById("usernameError").innerHTML = "";
      this.setState({
        usernameForgotPassword: tmp,
        validUsername: true
      });
    }
  }

  forgotPassword() {
    // if (this.state.isSamePassword === true) {
    // console.log("gooooooooooooooo")
    console.log(this.state.validUsername)
    console.log(this.state.validEmail)
    if(this.state.validEmail && this.state.validUsername) {
      var formData = new FormData();
    formData.append("username", this.state.usernameForgotPassword);
    formData.append("email", this.state.emailForgotPassword);

    fetch(apiLink + "/rest/user/forgotPassword", {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        // Authorization: localStorage.getItem("token")
      },
      body: formData
    }).then(result => {
      console.log(result);
      console.log(result.status)
      if (result.status === 200) {
        // this.changeIsChangePassword();
        alert("Forgot Password")
      } else if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      } else if(result.status === 400) {
        alert("email or username is not exist")
      }
    })

    } 
    // }
  }

  changeIsForgotPassword() {
    console.log("aaaaaaaaaaaaaaaaaa")
    this.setState({
      isForgotPassword: !this.state.isForgotPassword
    })
  }

  getUsername() {
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
          result.json().then((data) => {
            localStorage.setItem("profile", data.firstName + " " + data.lastName)
          })
        } else if (result.status === 401) {
          localStorage.removeItem("isLoggedIn");
          this.props.history.push('/login-page')
        }

      }
    )
  }

  handleNameChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  // setToken(token) {
  //   this.props.setToken(token);
  // }

  handleSubmit() {
    fetch(apiLink + "/rest/login", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        // 'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })

    }).then(
      (result) => {
        result.json().then((data) => {
          if (result.status === 200) {
            if (data.role === "ROLE_USER") {
              localStorage.setItem("token", data.token);
              localStorage.setItem("isLoggedIn", true);
              localStorage.setItem("user", data.username);
              this.getUsername();
              this.props.history.push('view-request-list');

            } else {
              document.getElementById("loginError").innerHTML =
                "<div class='alert alert-danger' role='alert'><strong>Your account is not user account</strong><br/> Please try again!</div>";
            }
          }
          if (result.status !== 200) {
            // event.preventDefault();
            if (data.message === "Wrong userId and password")
              document.getElementById("loginError").innerHTML =
                "<div class='alert alert-danger' role='alert'><strong>Username or password is incorrect!</strong><br/> Please try again!</div>";
          }
        });
      }

    )
    // event.preventDefault();
    // this.props.history.push('/')
  }

  componentWillMount() {
    // console.log(localStorage.getItem("isLoggedIn"))
    //isLoggedIn = true go back to homepage (prevent go to login page when isLoggedIn = true)
    if (localStorage.getItem("isLoggedIn") !== null && localStorage.getItem("token") !== null) {
      this.props.history.push("/")
    } else {
      // localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
    }
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

  }
  render() {
    // back up save token in meta tags
    // document.getElementsByTagName("META")[3].content="Your description about the page or site here to set dynamically";
    // let header = document.getElementsByTagName("head")[0];
    // // console.log("header" + header);
    // var meta = document.createElement("meta");
    // meta.name = "token";
    // meta.content = "aaaaa";
    // header.appendChild(meta);
    // let metaTags = document.getElementsByTagName("META");
    // for (let index = 0; index < metaTags.length; index++) {
    //   if(metaTags[index].getAttribute("name") === "token") {
    //     metaTags[index].content= this.state.savedToken;
    //   }

    // }
    return (
      <>

        <DemoNavbar />
        <main ref="main">
          <section className="section section-shaped section-lg bg-gradient-info">
            {/* <div className="shape shape-style-1 shape-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div> */}
            <Container className="pt-lg-md">
              <Row className="justify-content-center">
                <Col lg="5">
                  <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-white pb-1">
                      <p className="text-center text-muted mb-4">Peer-to-Peer Lending System</p>
                    </CardHeader>
                    <CardBody className="">
                      <div className="text-center text-muted">
                        <p>Sign in here</p>
                      </div>
                      <Form>
                        {/* role="form" */}
                        {/* onSubmit={this.handleSubmit} */}
                        {this.state.isForgotPassword === false ?
                          (
                            <div>
                              <FormGroup className="mb-3">
                                <InputGroup className="input-group-alternative">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                      <i className="ni ni-email-83" />
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Input placeholder="Username" type="text" value={this.state.username} onChange={this.handleNameChange} />
                                </InputGroup>
                              </FormGroup>
                              <FormGroup>
                                <InputGroup className="input-group-alternative">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                      <i className="ni ni-lock-circle-open" />
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Input
                                    placeholder="Password"
                                    type="password"
                                    autoComplete="off"
                                    value={this.state.password} onChange={this.handlePasswordChange}
                                  />
                                </InputGroup>
                              </FormGroup>
                              <div>
                                <p style={{ color: "red" }} id="loginError"></p>
                              </div>
                              <div className="text-center my-4">
                                {/* type="submit"  */}
                                <Button size="md" outline color="primary" onClick={() => this.handleSubmit()}>Sign In</Button>
                              </div>
                            </div>
                          )
                          :
                          (
                            <div>
                              <FormGroup>
                                <Input
                                  placeholder="Username"
                                  type="text"
                                  autoComplete="off"
                                  value={this.state.usernameForgotPassword}
                                  onChange={this.handleUsernameForgotPassword}
                                />
                                <p id="usernameError"></p>
                              </FormGroup>
                              <FormGroup>
                                <Input
                                  placeholder="Email"
                                  type="email"
                                  autoComplete="off"
                                  value={this.state.emailForgotPassword}
                                  onChange={this.handleEmailForgotPassword}
                                />
                                <p id="emailError"></p>
                              </FormGroup>
                              <div className="text-center my-4">
                                <Button size="md" outline color="primary" onClick={() => this.forgotPassword()}>Send</Button>
                              </div>
                            </div>
                          )}

                      </Form>
                    </CardBody>
                  </Card>
                  {this.state.isForgotPassword === false ?
                    (
                      <Row className="mt-3">
                        <Col xs="6">
                          <p
                            className="text-white"
                            style={{ cursor: 'pointer' }}
                            // href="#pablo"
                            onClick={() => this.changeIsForgotPassword()}
                          >
                            <small>Forgot password?</small>
                          </p>
                        </Col>
                        <Col className="text-right" xs="6">
                          <a
                            className="text-white"
                            href="/register-page"
                          >
                            <small>Create new account</small>
                          </a>
                        </Col>
                      </Row>
                    )
                    :
                    (
                      ""
                    )}

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

// const mapStateToProps = (state) => {
//   return {
//     tokenReducer: state.tokenReducer
//   };
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     setToken: (token) => {
//       dispatch({
//         type: "SET_TOKEN",
//         payload: token
//       });
//     }
//   }
// }


// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default Login;
