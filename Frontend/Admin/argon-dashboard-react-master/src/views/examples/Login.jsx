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
  Row,
  Col
} from "reactstrap";

import { apiLink } from "../../api.jsx";
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.getUsername = this.getUsername.bind(this);
  }
  getUsername() {
    fetch(apiLink + "/rest/user/getUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
        // "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      }
    }).then(result => {
      if (result.status === 200) {
        result.json().then(data => {
          localStorage.setItem("profile", data.firstName + " " + data.lastName);
        });
      } else if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login");
      }
    });
  }

  handleNameChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    fetch(apiLink + "/rest/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // 'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    }).then(result => {
      result.text().then(data => {
        console.log(data)
        if (result.status === 200) {
          localStorage.setItem("user", this.state.username);
          if (localStorage.getItem("user") !== "admin") {
            document.getElementById("loginError").innerHTML =
              "<div class='alert alert-danger' role='alert'><strong>Only Admin can login to this site !</strong></div>";
          } else {
            localStorage.setItem("token", data);
            localStorage.setItem("user", this.state.username);
            localStorage.setItem("isLoggedIn", true);
            this.getUsername();
            this.props.history.push("/");
          }
        }
        if (result.status !== 200) {
          event.preventDefault();
          // alert(data);
          if (data === "Wrong userId and password")
            document.getElementById("loginError").innerHTML =
              "<div class='alert alert-danger' role='alert'><strong>Username or password is incorrect!</strong><br/> Please try again!</div>";
        }
      });
    });
    event.preventDefault();
    // this.props.history.push('/')
  }
  render() {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent">
              <div className="text-center text-muted mb-4">
                <p className="text-center text-muted mb-4">
                  Peer-to-Peer Lending System
                </p>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted">
                <p>Sign in Admin Site - PPLS</p>
              </div>
              <Form role="form" onSubmit={this.handleSubmit}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email or username"
                      type="text"
                      value={this.state.username}
                      onChange={this.handleNameChange}
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
                      placeholder="Password"
                      type="password"
                      autoComplete="off"
                      value={this.state.password}
                      onChange={this.handlePasswordChange}
                    />
                  </InputGroup>
                </FormGroup>
                <div>
                  <p style={{ color: "red" }} id="loginError" />
                </div>
                <div className="text-center my-4">
                  <Button type="submit" size="md" outline color="primary">
                    Sign In
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          {/* <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                <small>Forgot password?</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                <small>Create new account</small>
              </a>
            </Col>
          </Row> */}
        </Col>
      </>
    );
  }
}

export default Login;
