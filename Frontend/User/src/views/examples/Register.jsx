import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";

//api link
import { apiLink } from '../../api.jsx';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      validUsername: false,
      validFirstname: false,
      validLastname: false,
      validEmail: false,
      validPhone: false,
      isDisable: true
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
  }

  componentWillMount() {
    // console.log(localStorage.getItem("isLoggedIn"))
    //isLoggedIn = true go back to homepage (prevent go to login page when isLoggedIn = true)
    if (localStorage.getItem("isLoggedIn") === null && localStorage.getItem("token") === null) {
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

  handleUserNameChange(event) {
    const tmp = event.target.value.trim();
    if (!tmp.match(/^\w*$/)) {
      document.getElementById("usernameError").innerHTML = "username does not contain special character";
      this.setState({
        username: tmp,
        validUsername: false
      });
    } else {
      document.getElementById("usernameError").innerHTML = "";
      this.setState({
        username: tmp,
        validUsername: true
      });
    }
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleFirstNameChange(event) {
    const tmp = event.target.value;
    if (!tmp.match(/^[a-z A-Z]*$/)) {
      document.getElementById("firstnameError").innerHTML = "firtname only contain alphabet character";
      this.setState({
        firstname: tmp,
        validFirstname: false
      });
    } else {
      document.getElementById("firstnameError").innerHTML = "";
      this.setState({
        firstname: tmp,
        validFirstname: true
      });
    }
  }

  handleLastNameChange(event) {
    const tmp = event.target.value;
    if (tmp.match(/^[a-z A-Z]*$/)) {
      document.getElementById("lastnameError").innerHTML = "";
      this.setState({
        lastname: tmp,
        validLastname: true
      });
    } else {
      document.getElementById("lastnameError").innerHTML = "lastname only contain alphabet character";
      this.setState({
        lastname: tmp,
        validLastname: false
      });
    }
  }

  handleEmailChange(event) {
    const tmp = event.target.value.trim();
    if (tmp.match(/^[a-zA-Z0-9]{5,30}@[a-z]{3,10}(.[a-z]{2,3})+$/)) {
      document.getElementById("emailError").innerHTML = "";
      this.setState({
        email: tmp,
        validEmail: true
      });
    } else {
      document.getElementById("emailError").innerHTML = "email only contain alphabet character";
      this.setState({
        email: tmp,
        validEmail: false
      });
    }
  }

  handlePhoneChange(event) {
    const tmp = event.target.value.trim();
    if (!tmp.match(/^(\d{10,12})*$/)) {
      document.getElementById("phoneError").innerHTML = "phone only contain number";
      this.setState({
        phone: tmp,
        validPhone: false
      });
    } else {
      document.getElementById("phoneError").innerHTML = "";
      this.setState({
        phone: tmp,
        validPhone: true
      });
    }
  }
  handleSubmit(event) {
    if (this.state.validEmail === true && this.state.validFirstname === true
      && this.state.validLastname === true && this.state.validPhone === true
      && this.state.validUsername === true) {
      fetch(apiLink + "/rest/user/createUser", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          // 'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          email: this.state.email,
          firstName: this.state.firstname,
          lastName: this.state.lastname,
          phoneNumber: this.state.phone
        })

      }).then(
        (result) => {
          console.log(result)
          result.text().then((data) => {
            console.log(data);
          })

        }

      )
      // this.props.history.push('/login-page')
    }
    event.preventDefault();
  }
  render() {
    return (
      <>
        <DemoNavbar />
        <main ref="main">
          <section className="section section-shaped section-lg bg-gradient-info">
            {/* <div className="shape shape-style-1 bg-gradient-default">
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
                <Col lg="7">
                  <Card className="bg-secondary shadow border-0">
                    <CardBody>
                      <div className="text-center text-muted mb-4">
                        <h3>Sign up</h3>
                      </div>
                      <Form role="form" onSubmit={this.handleSubmit}>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-email-83" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="Firstname" type="text" value={this.state.firstname} onChange={this.handleFirstNameChange} required />
                          </InputGroup>
                          <p id="firstnameError"></p>
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-email-83" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="Lastname" type="text" value={this.state.lastname} onChange={this.handleLastNameChange} required />
                          </InputGroup>
                          <p id="lastnameError"></p>
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-email-83" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="Email" type="text" value={this.state.email} onChange={this.handleEmailChange} required />
                          </InputGroup>
                          <p id="emailError"></p>
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-hat-3" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="username" type="text" value={this.state.username} onChange={this.handleUserNameChange} required />
                          </InputGroup>
                          <p id="usernameError"></p>
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
                              required
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-email-83" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="phone" type="phone" value={this.state.phone} onChange={this.handlePhoneChange} required />
                          </InputGroup>
                          <p id="phoneError"></p>
                        </FormGroup>

                        <Row className="my-4">
                          <Col xs="12">
                            <div className="custom-control custom-control-alternative custom-checkbox">
                              <input
                                className="custom-control-input"
                                id="customCheckRegister"
                                type="checkbox"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="customCheckRegister"
                              >
                                <span>
                                  I agree with the{" "}
                                  <a
                                    href="#pablo"
                                    onClick={e => e.preventDefault()}
                                  >
                                    Privacy Policy
                                  </a>
                                </span>
                              </label>
                            </div>
                          </Col>
                        </Row>
                        <div className="text-center my-4">
                          {/* <Input type="submit" value="Create account" /> */}
                          <Button type="submit" size="md" outline color="primary" 
                          >Create Account</Button>
                          {/* <Button
                            className="mt-4"
                            color="primary"
                            type="button"
                          >
                            Create account
                          </Button> */}
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

export default Register;
