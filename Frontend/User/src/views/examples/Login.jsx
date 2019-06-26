import React from "react";
import { connect } from 'react-redux';
// import {reducer} from '../../reducers/reducer';
// import { store } from '../../store/store';
// import  { Redirect } from 'react-router-dom';
// reactstrap components
import {
  Card, CardHeader, CardBody, FormGroup, Form, Input, InputGroupAddon,
  InputGroupText, InputGroup, Container, Row, Col
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
      // savedToken: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    // this.setToken = this.setToken.bind(this);
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

  handleSubmit(event) {
    console.log(this.state.username + " " + this.state.password);
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
        result.text().then((data) => {
          if (result.status === 200) {
            // this.setToken(data);
            //                   let header = document.getElementsByTagName("head")[0];
            // // console.log("header" + header);
            // var meta = document.createElement("meta");
            // meta.name = "token";
            // meta.content = data;
            // header.appendChild(meta);
            localStorage.setItem("token", data);
            localStorage.setItem("isLoggedIn", true);

            this.props.history.push('view-request-list');
          }
          if (result.status !== 200) {
            event.preventDefault();
            // alert(data);
            if (data === "Wrong userId and password")
              document.getElementById("loginError").innerHTML = "<small>username or password is incorrect<br/> please try again</small>";
          }
        });
      }

    )
    event.preventDefault();
    // this.props.history.push('/')
  }

  componentWillMount() {
    // var token = localStorage.getItem("token");
    // if (token !== null) {

    // }
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
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
          <section className="section section-shaped section-lg">
            <div className="shape shape-style-1 shape-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <Container className="pt-lg-md">
              <Row className="justify-content-center">
                <Col lg="5">
                  <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-white pb-1">
                      <p className="text-center text-muted mb-4">Peer-to-Peer Lending System</p>
                    </CardHeader>
                    <CardBody className="">
                      <div className="text-center text-muted">
                        <p>sign in here</p>
                      </div>
                      <Form role="form" onSubmit={this.handleSubmit}>
                        <FormGroup className="mb-3">
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-email-83" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="Email or username" type="text" value={this.state.username} onChange={this.handleNameChange} />
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
                          <Input type="submit" value="Sign in" className="text-light" />
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                  <Row className="mt-3">
                    <Col xs="6">
                      <a
                        className="text-white"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        <small>Forgot password?</small>
                      </a>
                    </Col>
                    <Col className="text-right" xs="6">
                      <a
                        className="text-white"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        <small>Create new account</small>
                      </a>
                    </Col>
                  </Row>
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
