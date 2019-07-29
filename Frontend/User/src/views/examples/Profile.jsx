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
  Input,
  Collapse,
  Spinner
} from "reactstrap";

import { css } from '@emotion/core';

import { PulseLoader } from 'react-spinners';
// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import { apiLink } from "../../api.jsx";
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      firstName: "",
      lastName: "",
      loanLimit: 0,
      email: "",
      phoneNumber: "",
      documentID: [],
      documentPP: [],
      documentDL: [],

      loadingID: true,
      loadingPP: true,
      loadingDL: true,
      collapse: false,
      accordion: [true, false, false],
      custom: [true, false],
      status: "Closed",
      fadeIn: true,
      timeout: 300
    };
    this.getProfile = this.getProfile.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.toggleCustom = this.toggleCustom.bind(this);
    this.toggleFade = this.toggleFade.bind(this);

    this.handleFileInput = this.handleFileInput.bind(this);

    this.getDocument = this.getDocument.bind(this);
    this.saveDocument = this.saveDocument.bind(this);

    this.setSrcImgBase64 = this.setSrcImgBase64.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.handleDataAvailable = this.handleDataAvailable.bind(this);
    // this.convertBlobToFile = this.convertBlobToFile.bind(this);
  }

  // convertBlobToFile(blob, filename) {
  //   blob.lastModifiedDate = new Date();
  //   blob.name = filename;
  //   return blob;
  // }

  handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      window.recordedBlobs.push(event.data);
    }
  }

  startRecording() {
    window.recordedBlobs = [];
    let options = { mimeType: 'video/webm;codecs=vp9' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not Supported`);
      options = { mimeType: 'video/webm;codecs=vp8' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not Supported`);
        options = { mimeType: 'video/webm' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error(`${options.mimeType} is not Supported`);
          options = { mimeType: '' };
        }
      }
    }
    console.log(options);
    try {
      window.mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
      console.error('Exception while creating MediaRecorder:', e);
      return;
    }

    var recordButton = document.querySelector('button#record');
    recordButton.textContent = 'Stop Recording';
    window.mediaRecorder.ondataavailable = this.handleDataAvailable;
    window.mediaRecorder.start(10);
    console.log('MediaRecorder started', window.mediaRecorder);
  }

  stopRecording() {
    window.mediaRecorder.stop();
    console.log('Recorded Blobs: ', window.recordedBlobs);

    var recordButton = document.querySelector('button#record');
    recordButton.textContent = 'Start Recording';
  }

  setSrcImgBase64(type, image) {
    return "data:" + type + ";base64, " + image;
  }

  getDocument() {
    fetch(apiLink + "/rest/document/getUserDocument", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      }
    }).then(result => {
      if (result.status === 200) {
        result.json().then(data => {
          console.log("get success");
          console.log(data)
          if (data.length === 0) {
            this.setState({
              loadingID: false,
              loadingPP: false,
              loadingDL: false
            })
          } else {
            for (let i = 0; i < data.length; i++) {
              const element = data[i];
              if (element.documentType === "Identity Card") {
                this.setState({
                  documentID: element,
                  loadingID: false
                })
              } else if (element.documentType === "Passport") {
                this.setState({
                  documentPP: element,
                  loadingPP: false
                })
              } else if (element.documentType === "Driving Licence") {
                this.setState({
                  documentDL: element,
                  loadingDL: false
                })
              }
            }
          }
        });
        // this.props.history.push("/view-request-trading");
      } else if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      }
    });
  }

  saveDocument(type) {
    const superBuffer = new Blob(window.recordedBlobs, { type: 'video/webm' });
    var reader = new FileReader();
    reader.readAsDataURL(superBuffer);
    reader.onloadend = function () {
      var base64data = reader.result;
      console.log(base64data);
    }

    let document = [];
    if (type === "ID") {
      document = this.state.documentID;
    } else if (type === "PP") {
      document = this.state.documentPP;
    } else if (type === "DL") {
      document = this.state.documentDL;
    } 
    var formData = new FormData();
    // formData.append("documentType", document.documentType);
    // for (let i = 0; i < document.listImage.length; i++) {
    //   const element = document.listImage[i];
    //   formData.append("file", element);
    // }

    formData.append("file", superBuffer)
    console.log("formData", formData.getAll("file"));
    fetch(apiLink + "/rest/document/uploadFile", {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: localStorage.getItem("token")
      },
      body: formData
      // JSON.stringify({
      //   documentType: this.state.documentID.documentType,
      //   file: this.state.documentID.listImage
      // })
    }).then(result => {
      if (result.status === 200) {
        alert("save success");
        // this.props.history.push("/view-request-trading");
      } else if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      } else if (result.status === 400) {
        alert("error")
      }
    });
  }

  handleFileInput(event, type) {
    var document = { documentType: type, listImage: event.target.files }
    switch (type) {
      case "ID":
        this.setState({
          documentID: document
        });
        break;
      case "PP":
        this.setState({
          documentPP: document
        })
        break;
      case "DL":
        this.setState({
          documentDL: document
        })
        break;
    }

  }

  onEntering() {
    this.setState({ status: "Opening..." });
  }

  onEntered() {
    this.setState({ status: "Opened" });
  }

  onExiting() {
    this.setState({ status: "Closing..." });
  }

  onExited() {
    this.setState({ status: "Closed" });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleAccordion(tab) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    this.setState({
      accordion: state
    });
  }

  toggleCustom(tab) {
    const prevState = this.state.custom;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    this.setState({
      custom: state
    });
  }

  toggleFade() {
    this.setState({ fadeIn: !this.state.fadeIn });
  }

  componentWillMount() {
    this.getDocument();
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    this.getProfile();
    // this.getDocument();
  }

  getProfile() {
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
        // alert("create success");
        // this.props.history.push('view-new-request');
        result.json().then(data => {
          console.log(data);
          this.setState({
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            loanLimit: data.loanLimit,
            email: data.email,
            phoneNumber: data.phoneNumber
          });
        });
      } else if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      }
    });
  }

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
    const override = css`
    display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      padding-left: 0;
      `;
    // let IDData = [];
    // if (this.state.documentID.length !== 0) {
    //   IDData = 
    //   ))
    // }
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
            <Container className="mt--7" style={style.profileComponent}>
              {" "}
              {/* fluid */}
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
                        <Button
                          color="primary"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                          size="sm"
                        >
                          Change Avatar
                        </Button>
                        <h3>
                          {this.state.firstName + " " + this.state.lastName}
                          {/* <span className="font-weight-light">, 27</span> */}
                        </h3>
                        {/* <div className="h5 font-weight-300">
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
                        </div> */}
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
                        <Card className="mb-0">
                          <CardHeader id="headingTwo">
                            <Button
                              block
                              color="link"
                              className="text-left m-0 p-0"
                              onClick={() => this.toggleAccordion(0)}
                              aria-expanded={this.state.accordion[0]}
                              aria-controls="collapseOne"
                            >
                              <h5 className="m-0 p-0">
                                Identity Card
                              </h5>
                            </Button>
                          </CardHeader>
                          <Collapse
                            isOpen={this.state.accordion[0]}
                            data-parent="#accordion"
                            id="collapseOne"
                          >
                            <CardBody style={style.sameSizeWithParent}>

                              {(this.state.loadingID === true) ?
                                (<PulseLoader
                                  css={override}
                                  sizeUnit={"px"}
                                  size={15}
                                  color={'#123abc'}
                                  loading={this.state.loadingID}
                                />)
                                :
                                (this.state.documentID.length !== 0) ?
                                  (<div>
                                    {this.state.documentID.documentFile.map((imageData) => (
                                      <img src={this.setSrcImgBase64(imageData.fileType,
                                        imageData.data)} style={style.sameSizeWithParent} />))}
                                  </div>)
                                  :
                                  (<div>
                                    <Input type="file" multiple onChange={(event) => this.handleFileInput(event, "ID")} />
                                    {' '}
                                    <Button type="button" onClick={() => this.saveDocument("ID")}>Save</Button>
                                  </div>)}
                            </CardBody>
                          </Collapse>
                        </Card>
                        <Card className="mb-0">
                          <CardHeader id="headingThree">
                            <Button
                              block
                              color="link"
                              className="text-left m-0 p-0"
                              onClick={() => this.toggleAccordion(1)}
                              aria-expanded={this.state.accordion[1]}
                              aria-controls="collapseTwo"
                            >
                              <h5 className="m-0 p-0">
                                Passport
                              </h5>
                            </Button>
                          </CardHeader>
                          <Collapse
                            isOpen={this.state.accordion[1]}
                            data-parent="#accordion"
                            id="collapseTwo"
                          >
                            <CardBody style={style.sameSizeWithParent}>

                              {(this.state.loadingPP === true) ?
                                (<PulseLoader
                                  css={override}
                                  sizeUnit={"px"}
                                  size={15}
                                  color={'#123abc'}
                                  loading={this.state.loadingPP}
                                />)
                                :
                                (this.state.documentPP.length !== 0) ?
                                  (<div>
                                    {this.state.documentPP.documentFile.map((imageData) => (
                                      <img src={this.setSrcImgBase64(imageData.fileType,
                                        imageData.data)} style={style.sameSizeWithParent} />))}
                                  </div>)
                                  :
                                  (<div>
                                    <Input type="file" multiple onChange={(event) => this.handleFileInput(event, "PP")} />
                                    {' '}
                                    <Button type="button" onClick={() => this.saveDocument("PP")}>Save</Button>
                                  </div>)}
                            </CardBody>
                          </Collapse>
                        </Card>
                        <Card className="mb-0">
                          <CardHeader id="headingThree">
                            <Button
                              block
                              color="link"
                              className="text-left m-0 p-0"
                              onClick={() => this.toggleAccordion(2)}
                              aria-expanded={this.state.accordion[2]}
                              aria-controls="collapseThree"
                            >
                              <h5 className="m-0 p-0">
                                Driving License
                              </h5>
                            </Button>
                          </CardHeader>
                          <Collapse
                            isOpen={this.state.accordion[2]}
                            data-parent="#accordion"
                            id="collapseThree"
                          >
                            <CardBody style={style.sameSizeWithParent}>

                              {(this.state.loadingDL === true) ?
                                (<PulseLoader
                                  css={override}
                                  sizeUnit={"px"}
                                  size={15}
                                  color={'#123abc'}
                                  loading={this.state.loadingDL}
                                />)
                                :
                                (this.state.documentDL.length !== 0) ?
                                  (<div>
                                    {this.state.documentDL.documentFile.map((imageData) => (
                                      <img src={this.setSrcImgBase64(imageData.fileType,
                                        imageData.data)} style={style.sameSizeWithParent} />))}
                                  </div>)
                                  :
                                  (<div>
                                    <Input type="file" multiple onChange={(event) => this.handleFileInput(event, "DL")} />
                                    {' '}
                                    <Button type="button" onClick={() => this.saveDocument("DL")}>Save</Button>
                                  </div>)}
                            </CardBody>
                          </Collapse>
                        </Card>

                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <video autoPlay id="gum"></video>
                <button id="start" onClick={
                  () => {
                    console.log("gooooooooooooooo")
                    const constraints = {
                      audio: true,
                      video: {
                        width: 1280, height: 720
                      }
                    }
                    try {
                      // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                      //   navigator.mozGetUserMedia || navigator.msGetUserMedia;
                      // console.log()

                      const stream = navigator.mediaDevices.getUserMedia(constraints).then(data => {
                        console.log('getUserMedia() got stream:', data);
                        window.stream = data;

                        const gumVideo = document.querySelector('video#gum');
                        gumVideo.srcObject = data;

                      });

                    } catch (e) {
                      console.error('navigator.getUserMedia error:', e);
                    }
                  }
                }>Start camera</button>
                <button id="record" onClick={
                  () => {
                    var recordButton = document.querySelector('button#record');

                    if (recordButton.textContent === 'Start Recording') {
                      this.startRecording();
                    } else {
                      this.stopRecording();
                    }
                  }
                }>Start Recording</button>

                <video autoPlay id="recorded"></video>
                <button id="play" onClick={
                  () => {
                    const recordedVideo = document.querySelector('video#recorded');
                    const superBuffer = new Blob(window.recordedBlobs, { type: 'video/webm' });
                    recordedVideo.src = null;
                    recordedVideo.srcObject = null;
                    recordedVideo.src = window.URL.createObjectURL(superBuffer);
                    recordedVideo.controls = true;
                    recordedVideo.play();
                    console.log(recordedVideo);
                  }
                }>play</button>
                <button onClick={() => this.saveDocument("DL")}>Save to DB</button>
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
