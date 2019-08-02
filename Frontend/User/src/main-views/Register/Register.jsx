import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Modal
} from "reactstrap";

import { database } from "../../firebase";
// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
//api link
import { apiLink } from "../../api.jsx";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      validUsername: false,
      validFirstname: false,
      validLastname: false,
      validPassword: false,
      validEmail: false,
      validPhone: false,
      isDisable: "",
      checkBoxValue: false,

      isOpen: false,
      loading: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(
      this
    );
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.toggleCheckboxValue = this.toggleCheckboxValue.bind(this);
  }

  componentWillMount() {
    // console.log(localStorage.getItem("isLoggedIn"))
    //isLoggedIn = true go back to homepage (prevent go to login page when isLoggedIn = true)
    if (
      localStorage.getItem("isLoggedIn") === null &&
      localStorage.getItem("token") === null
    ) {
      this.props.history.push("/");
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
      document.getElementById("usernameError").innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Username does not contain special character!</strong></div>";
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
  handleConfirmPasswordChange(event) {
    let password = this.state.password;
    let tmpConfirmPassword = event.target.value;
    if (password !== tmpConfirmPassword) {
      document.getElementById("confirmPasswordError").innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Confirm Password not be matched with Password!</strong></div>";
      this.setState({
        confirmPassword: tmpConfirmPassword,
        validPassword: false
      });
    } else {
      document.getElementById("confirmPasswordError").innerHTML = "";
      this.setState({
        confirmPassword: tmpConfirmPassword,
        validPassword: true
      });
    }
  }
  handleFirstNameChange(event) {
    const tmp = event.target.value;
    if (!tmp.match(/^[a-z A-Z]*$/)) {
      document.getElementById("firstnameError").innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>First name only contain alphabet character!</strong></div>";
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
      document.getElementById("lastnameError").innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Last name only contain alphabet character!</strong></div>";
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
      document.getElementById("emailError").innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Email only contain alphabet character!</strong></div>";
      this.setState({
        email: tmp,
        validEmail: false
      });
    }
  }

  handlePhoneChange(event) {
    const tmp = event.target.value.trim();
    if (!tmp.match(/^(\d{10,12})*$/)) {
      document.getElementById("phoneError").innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Phone only contain number!</strong></div>";
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
    fetch(apiLink + "/rest/user/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
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
    }).then(result => {
      if (result.status !== 200) {
        // console.log(result)
      } else if (result.status === 200) {
        result.text().then(async data => {
          console.log(data);

          await database.ref("ppls/").push({
            username: this.state.username,
            notification: "",
            countNew: 1
          });
          await localStorage.setItem("user", this.state.username);
          const username = localStorage.getItem("user");
          await database
            .ref("ppls")
            .orderByChild("username")
            .equalTo(username)
            .once("value", snapshot => {
              if (snapshot.exists()) {
                const userData = snapshot.val();
                this.setState({ keyUserFb: Object.keys(userData)[0] });
              }
            });
          database.ref("/ppls/" + this.state.keyUserFb + "/notification").push({
            message: "Congratulations ! You have just create account !",
            sender: "System"
          });

          this.setState({
            isOpen: true
          });
        });
      }
    });
    setTimeout(
      function() {
        setTimeout(this.props.history.push("/login-page"), 10000);
      }.bind(this),
      5000
    );
    event.preventDefault();
  }
  async toggleCheckboxValue() {
    await this.setState(({ checkBoxValue }) => ({
      checkBoxValue: !checkBoxValue
    }));
    if (
      this.state.checkBoxValue === true &&
      this.state.validEmail === true &&
      this.state.validFirstname === true &&
      this.state.validPassword === true &&
      this.state.validUsername === true &&
      this.state.validPhone === true
    ) {
      this.setState({ isDisable: "true" });
    } else {
      this.setState({
        isDisable: ""
      });
    }
  }
  toggleModal = stateParam => {
    this.setState({
      [stateParam]: !this.state[stateParam]
    });
  };
  render() {
    const style = {
      profileComponent: {
        position: "relative",
        top: -250
      },
      myAccount: {
        position: "relative",
        top: -150
      },
      sameSizeWithParent: {
        width: "100%",
        height: "100%"
      }
    };
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
                <Modal
                  className="modal-dialog-centered"
                  isOpen={this.state.isOpen}
                  toggle={() => this.toggleModal("defaultModal")}
                  style={style.sameSizeWithParent}
                >
                  {/* <div className="modal-header">
                    <h3 className="modal-title" id="modal-title-default">
                      Successfully Created
                    </h3>
                  </div> */}
                  <div className="modal-body">
                    <h3 className="modal-title" id="modal-title-default">
                      <img
                        style={{ width: 50, height: 50 }}
                        src={require("assets/img/theme/checked.png")}
                      />
                      Successfully Created
                    </h3>
                  </div>
                </Modal>
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
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="username"
                              type="text"
                              value={this.state.username}
                              onChange={this.handleUserNameChange}
                              required
                            />
                          </InputGroup>
                          <p id="usernameError" />
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-circle-08" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="First Name"
                              type="text"
                              value={this.state.firstname}
                              onChange={this.handleFirstNameChange}
                              required
                            />
                          </InputGroup>
                          <p id="firstnameError" />
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-circle-08" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Last Name"
                              type="text"
                              value={this.state.lastname}
                              onChange={this.handleLastNameChange}
                              required
                            />
                          </InputGroup>
                          <p id="lastnameError" />
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-email-83" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Email"
                              type="text"
                              value={this.state.email}
                              onChange={this.handleEmailChange}
                              required
                            />
                          </InputGroup>
                          <p id="emailError" />
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
                              value={this.state.password}
                              onChange={this.handlePasswordChange}
                              required
                            />
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
                              placeholder="Confirm Password "
                              type="password"
                              autoComplete="off"
                              value={this.state.confirmPassword}
                              onChange={this.handleConfirmPasswordChange}
                              required
                            />
                          </InputGroup>

                          <p
                            style={{ color: "red" }}
                            id="confirmPasswordError"
                          />
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i class="ni ni-align-left-2" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="phone number"
                              type="phone"
                              value={this.state.phone}
                              onChange={this.handlePhoneChange}
                              required
                            />
                          </InputGroup>
                          <p id="phoneError" />
                        </FormGroup>

                        <Row className="my-4">
                          <Col xs="12">
                            <div className="custom-control custom-control-alternative custom-checkbox">
                              <Input
                                className="custom-control-input"
                                id="customCheckRegister"
                                type="checkbox"
                                value={this.state.checkboxValue}
                                onChange={this.toggleCheckboxValue}
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
                          <Button
                            type="submit"
                            size="md"
                            outline
                            color="primary"
                            disabled={!this.state.isDisable}
                          >
                            Create Account
                          </Button>
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
