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
      uploadDocumentID: [],
      uploadDocumentPP: [],
      uploadDocumentDL: [],

      loadingID: true,
      loadingPP: true,
      loadingDL: true,
      collapse: false,
      accordion: [true, false, false, false],
      custom: [true, false],
      status: "Closed",
      fadeIn: true,
      timeout: 300,
      isUploadedVideo: false,
      loadingVideo: true,
      editable: false,
      validPhone: true,
      validEmail: true,
      validLastname: true,
      newFirstName: "",
      newLastName: "",
      newEmail: "",
      newPhoneNumber: "",

      isChangePassword: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      isSamePassword: false,
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
    this.uploadVideo = this.uploadVideo.bind(this);
    this.changeEditable = this.changeEditable.bind(this);

    this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);

    this.saveUserInformation = this.saveUserInformation.bind(this);

    this.changeIsChangePassword = this.changeIsChangePassword.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeOldPassword = this.changeOldPassword.bind(this);
    this.changeNewPassword = this.changeNewPassword.bind(this);
    this.changeConfirmPassword = this.changeConfirmPassword.bind(this);
  }

  changeOldPassword(event) {
    this.setState({
      oldPassword: event.target.value
    })
  }

  changeNewPassword(event) {
    // console.log(event.target.value)
    var errorElement = document.getElementById("confirmError");
    if (event.target.value === this.state.confirmPassword) {
      errorElement.innerHTML = ""
      this.setState({
        newPassword: event.target.value,
        isSamePassword: true
      })
    } else {
      errorElement.innerHTML = "<div class='alert alert-danger' role='alert'><strong>Confirm password is not match</strong></div>"
      this.setState({
        newPassword: event.target.value,
        isSamePassword: false
      })
    }
  }

  changeConfirmPassword(event) {
    // console.log(event.target.value)
    // console.log(this.state.newPassword)
    // console.log(this.state.confirmPassword)
    var errorElement = document.getElementById("confirmError");
    if (this.state.newPassword === event.target.value) {
      errorElement.innerHTML = ""
      this.setState({
        confirmPassword: event.target.value,
        isSamePassword: true
      })
    } else {
      errorElement.innerHTML = "<div class='alert alert-danger' role='alert'><strong>Confirm password is not match</strong></div>"
      this.setState({
        confirmPassword: event.target.value,
        isSamePassword: false
      })
    }
  }

  changePassword() {
    // console.log(this.state.isSamePassword)
    // console.log(this.state.oldPassword);
    // console.log(this.state.newPassword);
    if (this.state.isSamePassword === true) {
      // console.log("gooooooooooooooo")
      var formData = new FormData();
      formData.append("oldPassword", this.state.oldPassword);
      formData.append("newPassword", this.state.newPassword);

      fetch(apiLink + "/rest/user/changePassword", {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        },
        body: formData
      }).then(result => {
        console.log(result);
        console.log(result.status)
        if (result.status === 200) {
          this.changeIsChangePassword();
          alert("change Password success")
          this.setState({
            newPassword: '',
            oldPassword: '',
            confirmPassword: '',
          })
          // console.log(result);
          // this.changeEditable();
          // this.getProfile();
        } else if (result.status === 401) {
          localStorage.removeItem("isLoggedIn");
          this.props.history.push("/login-page");
        } 
      })
    }

  }

  changeIsChangePassword() {
    this.setState({
      isChangePassword: !this.state.isChangePassword
    })
  }

  saveUserInformation() {
    fetch(apiLink + "/rest/user/changeUserInfo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify({
        firstName: this.state.newFirstName,
        lastName: this.state.newLastName,
        email: this.state.newEmail,
        phoneNumber: this.state.newPhoneNumber
      })
    }).then(result => {
      if (result.status === 200) {
        console.log(result);
        this.changeEditable();
        this.getProfile();
      } else if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      }
    })
  }

  onPhoneNumberChange(event) {
    const tmp = event.target.value.trim();
    if (!tmp.match(/^(\d{10,12})*$/)) {
      document.getElementById("phoneError").innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Phone only contain number!</strong></div>";
      this.setState({
        newPhoneNumber: tmp,
        validPhone: false
      });
    } else {
      document.getElementById("phoneError").innerHTML = "";
      this.setState({
        newPhoneNumber: tmp,
        validPhone: true
      });
    }
  }

  onEmailChange(event) {
    const tmp = event.target.value.trim();
    if (tmp.match(/^[a-zA-Z0-9]{5,30}@[a-z]{3,10}(.[a-z]{2,3})+$/)) {
      document.getElementById("emailError").innerHTML = "";
      this.setState({
        newEmail: tmp,
        validEmail: true
      });
    } else {
      document.getElementById("emailError").innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Email only contain alphabet character!</strong></div>";
      this.setState({
        newEmail: tmp,
        validEmail: false
      });
    }
  }

  onFirstNameChange(event) {
    const tmp = event.target.value;
    if (!tmp.match(/^[a-z A-Z]*$/)) {
      document.getElementById("firstnameError").innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>First name only contain alphabet character!</strong></div>";
      this.setState({
        newFirstName: tmp,
        validFirstname: false
      });
    } else {
      document.getElementById("firstnameError").innerHTML = "";
      this.setState({
        newFirstName: tmp,
        validFirstname: true
      });
    }
  }

  onLastNameChange(event) {
    const tmp = event.target.value;
    if (tmp.match(/^[a-z A-Z]*$/)) {
      document.getElementById("lastnameError").innerHTML = "";
      this.setState({
        newLastName: tmp,
        validLastname: true
      });
    } else {
      document.getElementById("lastnameError").innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Last name only contain alphabet character!</strong></div>";
      this.setState({
        newLastName: tmp,
        validLastname: false
      });
    }
  }

  changeEditable() {
    this.setState({
      editable: !this.state.editable
    })
  }

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
          if (data.length === 0) {
            this.setState({
              loadingID: false,
              loadingPP: false,
              loadingDL: false,
              loadingVideo: false
            })
          } else {
            for (let i = 0; i < data.length; i++) {
              const element = data[i];
              if (element.documentType.name === "Identity Card") {
                this.setState({
                  documentID: element,
                  loadingID: false
                })
              }
              if (element.documentType.name === "Passport") {
                this.setState({
                  documentPP: element,
                  loadingPP: false
                })
              }
              if (element.documentType.name === "Driving Licence") {
                this.setState({
                  documentDL: element,
                  loadingDL: false
                })
              }
              if (element.documentType.name === "Video") {
                console.log("video");
                this.setState({
                  isUploadedVideo: true,
                  loadingVideo: false
                })
              } else {
                this.setState({
                  isUploadedVideo: false,
                  loadingVideo: false
                })
              }
            }
            if (this.state.documentID.length === 0) {
              this.setState({
                loadingID: false
              })
            }
            if (this.state.documentPP.length === 0) {
              this.setState({
                loadingPP: false
              })
            }
            if (this.state.documentDL.length === 0) {
              this.setState({
                loadingDL: false
              })
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

  uploadVideo() {
    const superBuffer = new Blob(window.recordedBlobs, { type: 'video/webm' });
    var base64data = '';
    var reader = new FileReader();
    reader.readAsDataURL(superBuffer);
    reader.onloadend = function () {
      base64data = reader.result;
      console.log(base64data);

      var formData = new FormData();
      formData.append("fileType", 'video/webm')
      formData.append("documentTypeId", 2); //2= VIdeo
      formData.append("base64Video", base64data)

      // formData.append("file", superBuffer)
      console.log("formData", formData.getAll("file"));

      fetch(apiLink + "/rest/document/uploadVideo", {
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
      }).then(async result => {
        if (result.status === 200) {
          alert("save success");

          //load document again
          await this.setState({
            loadingID: true,
            loadingPP: true,
            loadingDL: true,
            loadingVideo: true,
          })
          this.getDocument();
          // this.props.history.push("/view-request-trading");
        } else if (result.status === 401) {
          localStorage.removeItem("isLoggedIn");
          this.props.history.push("/login-page");
        } else if (result.status === 400) {
          alert("error")
        }
      });
    }


  }

  saveDocument(type) {
    // const superBuffer = new Blob(window.recordedBlobs, { type: 'video/webm' });
    // var reader = new FileReader();
    // reader.readAsDataURL(superBuffer);
    // reader.onloadend = function () {
    //   var base64data = reader.result;
    //   console.log(base64data);
    // }

    let document = [];
    let typeId = 0;
    if (type === "ID") {
      document = this.state.uploadDocumentID;
      typeId = 1;
    } else if (type === "PP") {
      document = this.state.uploadDocumentPP;
      typeId = 3;
    } else if (type === "DL") {
      document = this.state.uploadDocumentDL;
      typeId = 4;
    }

    if (document.listImage !== undefined) {
      console.log("typeId: ", typeId)
      var formData = new FormData();
      formData.append("documentTypeId", typeId);
      for (let i = 0; i < document.listImage.length; i++) {
        const element = document.listImage[i];
        formData.append("file", element);
      }

      // formData.append("file", superBuffer)
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
      }).then(async result => {
        if (result.status === 200) {
          alert("save success");

          //load document again
          await this.setState({
            loadingID: true,
            loadingPP: true,
            loadingDL: true,
            loadingVideo: true,
          })
          this.getDocument();
          // this.props.history.push("/view-request-trading");
        } else if (result.status === 401) {
          localStorage.removeItem("isLoggedIn");
          this.props.history.push("/login-page");
        } else if (result.status === 400) {
          alert("error")
        }
      });
    } else {
      alert("please select image to upload")
    }

  }

  handleFileInput(event, type) {
    var document = { documentType: type, listImage: event.target.files }
    switch (type) {
      case "ID":
        this.setState({
          uploadDocumentID: document
        });
        break;
      case "PP":
        this.setState({
          uploadDocumentPP: document
        })
        break;
      case "DL":
        this.setState({
          uploadDocumentDL: document
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
          this.setState({
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            loanLimit: data.loanLimit,
            email: data.email,
            phoneNumber: data.phoneNumber,
            newFirstName: data.firstName,
            newLastName: data.lastName,
            newEmail: data.email,
            newPhoneNumber: data.phoneNumber,
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
                              src={require("assets/img/theme/team-4-800x800.png")}
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
                          {this.state.editable === false ?
                            (
                              <Button
                                id="editProfile"
                                color="primary"
                                href="#pablo"
                                onClick={() => this.changeEditable()}
                                disabled={this.state.isChangePassword === true ? true : false}
                                size="sm"
                              >
                                Edit Profile
                              </Button>
                            )
                            :
                            (
                              ""
                            )}
                        </Col>
                        <Col className="text-right" xs="3">
                          {this.state.isChangePassword === false ?
                            (
                              <Button
                                color="primary"
                                href="#pablo"
                                onClick={() => this.changeIsChangePassword()}
                                disabled={this.state.editable === true ? true : false}
                                size="sm"
                              >
                                Change Password
                          </Button>
                            )
                            :
                            (
                              ""
                            )}
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <Form>
                        <h6 className="heading-small text-muted mb-4">
                          User information
                        </h6>
                        <div className="pl-lg-4">
                          {this.state.isChangePassword === false ?
                            (
                              <div>
                                <Row>
                                  <Col lg="6">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-phonenumber"
                                      >
                                        Phone Number
                                </label>
                                      {this.state.editable === true ?
                                        (
                                          <div>
                                            <Input
                                              className="form-control-alternative"
                                              value={this.state.newPhoneNumber}
                                              id="input-phonenumber"
                                              type="text"
                                              onChange={this.onPhoneNumberChange}
                                            />
                                            <p
                                              style={{ color: "red" }}
                                              id="phoneError"
                                            />
                                          </div>
                                        )
                                        :
                                        (
                                          <p>{this.state.phoneNumber}</p>
                                        )}
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
                                      {this.state.editable === true ?
                                        (
                                          <div>
                                            <Input
                                              className="form-control-alternative"
                                              value={this.state.newEmail}
                                              id="input-email"
                                              type="email"
                                              onChange={this.onEmailChange}
                                            />
                                            <p
                                              style={{ color: "red" }}
                                              id="emailError"
                                            />
                                          </div>
                                        )
                                        :
                                        (
                                          <p>{this.state.email}</p>
                                        )}
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
                                      {this.state.editable === true ?
                                        (
                                          <div>
                                            <Input
                                              className="form-control-alternative"
                                              value={this.state.newFirstName}
                                              id="input-first-name"
                                              placeholder="First name"
                                              type="text"
                                              onChange={this.onFirstNameChange}
                                            />
                                            <p
                                              style={{ color: "red" }}
                                              id="firstnameError"
                                            />
                                          </div>
                                        )
                                        :
                                        (
                                          <p>{this.state.firstName}</p>
                                        )}
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
                                      {this.state.editable === true ?
                                        (
                                          <div>
                                            <Input
                                              className="form-control-alternative"
                                              value={this.state.newLastName}
                                              id="input-last-name"
                                              placeholder="Last name"
                                              type="text"
                                              onChange={this.onLastNameChange}
                                            />
                                            <p
                                              style={{ color: "red" }}
                                              id="lastnameError"
                                            />
                                          </div>
                                        )
                                        :
                                        (
                                          <p>{this.state.lastName}</p>
                                        )}
                                    </FormGroup>
                                  </Col>
                                </Row>
                                {this.state.editable === true ?
                                  (
                                    <Row>
                                      <Col className="text-right" xs="3">
                                        <Button
                                          id="saveProfile"
                                          color="primary"
                                          href="#pablo"
                                          onClick={() => this.saveUserInformation()}
                                          size="sm"
                                        >
                                          save Profile
                                  </Button>
                                      </Col>
                                      <Col className="text-right" xs="3">
                                        <Button
                                          id="cancelProfile"
                                          color="primary"
                                          href="#pablo"
                                          onClick={() => this.changeEditable()}
                                          size="sm"
                                        >
                                          cancel
                                  </Button>
                                      </Col>
                                    </Row>
                                  )
                                  :
                                  (
                                    ""
                                  )
                                }
                              </div>
                            )
                            :
                            (
                              <div>
                                <Row>
                                  <Col lg="6">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-oldPassword"
                                      >
                                        Old Password
                                      </label>
                                      <div>
                                        <Input
                                          className="form-control-alternative"
                                          value={this.state.oldPassword}
                                          id="input-oldPassword"
                                          type="password"
                                          onChange={this.changeOldPassword}
                                        />
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg="6">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-newPassword"
                                      >
                                        New Password
                                      </label>
                                      <div>
                                        <Input
                                          className="form-control-alternative"
                                          value={this.state.newPassword}
                                          id="input-newPassword"
                                          type="password"
                                          onChange={this.changeNewPassword}
                                        />
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg="6">
                                    <FormGroup>
                                      <label
                                        className="form-control-label"
                                        htmlFor="input-comfirmPassword"
                                      >
                                        Confirm Password
                                      </label>
                                      <div>
                                        <Input
                                          className="form-control-alternative"
                                          value={this.state.confirmPassword}
                                          id="input-confirmPassword"
                                          type="password"
                                          onChange={this.changeConfirmPassword}
                                        />
                                        <p id="confirmError"></p>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Button
                                    id="savePassword"
                                    color="primary"
                                    href="#pablo"
                                    onClick={() => this.changePassword()}
                                    size="sm"
                                  >
                                    save
                                  </Button>
                                  {' '}
                                  <Button
                                    id="cancelChangePassword"
                                    color="primary"
                                    href="#pablo"
                                    onClick={() => this.changeIsChangePassword()}
                                    size="sm"
                                  >
                                    cancel
                                  </Button>
                                </Row>
                              </div>
                            )
                          }
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
                                ((this.state.documentID.length !== 0) ?
                                  (<div>
                                    {this.state.documentID.documentFile.map((imageData) => (
                                      <img src={this.setSrcImgBase64(imageData.fileType,
                                        imageData.data)} style={style.sameSizeWithParent} />))}
                                    {console.log(this.state.documentID)}
                                    {this.state.documentID.status === "invalid" ? (
                                      <div>
                                        <Input type="file" multiple onChange={(event) => this.handleFileInput(event, "ID")} />
                                        {' '}
                                        <Button type="button" onClick={() => this.saveDocument("ID")}>Save</Button>
                                      </div>
                                    ) : (
                                        this.state.documentID.status === "pending" ? ("Document is waiting for validation") : ("")
                                      )}
                                  </div>)
                                  :
                                  (<div>
                                    {console.log(this.state.documentID)}
                                    <Input type="file" multiple onChange={(event) => this.handleFileInput(event, "ID")} />
                                    {' '}
                                    <Button type="button" onClick={() => this.saveDocument("ID")}>Save</Button>
                                  </div>))
                              }
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
                                    {this.state.documentPP.status === "invalid" ? (
                                      <div>
                                        <Input type="file" multiple onChange={(event) => this.handleFileInput(event, "ID")} />
                                        {' '}
                                        <Button type="button" onClick={() => this.saveDocument("ID")}>Save</Button>
                                      </div>
                                    ) : (
                                        this.state.documentPP.status === "pending" ? ("Document is waiting for validation") : ("")
                                      )}
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
                                    {this.state.documentDL.status === "invalid" ? (
                                      <div>
                                        <Input type="file" multiple onChange={(event) => this.handleFileInput(event, "ID")} />
                                        {' '}
                                        <Button type="button" onClick={() => this.saveDocument("ID")}>Save</Button>
                                      </div>
                                    ) : (
                                        this.state.documentDL.status === "pending" ? ("Document is waiting for validation") : ("")
                                      )}
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
                        <Card className="mb-0">
                          <CardHeader id="headingThree">
                            <Button
                              block
                              color="link"
                              className="text-left m-0 p-0"
                              onClick={() => this.toggleAccordion(3)}
                              aria-expanded={this.state.accordion[3]}
                              aria-controls="collapseThree"
                            >
                              <h5 className="m-0 p-0">
                                Identity Video
                              </h5>
                            </Button>
                          </CardHeader>
                          <Collapse
                            isOpen={this.state.accordion[3]}
                            data-parent="#accordion"
                            id="collapseThree"
                          >
                            <CardBody style={style.sameSizeWithParent}>

                              {(this.state.loadingVideo === true) ?
                                (<PulseLoader
                                  css={override}
                                  sizeUnit={"px"}
                                  size={15}
                                  color={'#123abc'}
                                  loading={this.state.loadingVideo}
                                />)
                                :
                                (this.state.isUploadedVideo === false) ?
                                  (
                                    <div>
                                      <Row>
                                        <video autoPlay id="gum"></video>
                                      </Row>
                                      <Row>
                                        <button id="start" onClick={
                                          (event) => {
                                            event.preventDefault();
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
                                          (event) => {
                                            event.preventDefault();
                                            var recordButton = document.querySelector('button#record');

                                            if (recordButton.textContent === 'Start Recording') {
                                              this.startRecording();
                                            } else {
                                              this.stopRecording();
                                            }
                                          }
                                        }>Start Recording</button>
                                      </Row>
                                      <Row>
                                        <video autoPlay id="recorded"></video>
                                      </Row>
                                      <Row>
                                        <button id="play" onClick={
                                          (event) => {
                                            event.preventDefault();
                                            const recordedVideo = document.querySelector('video#recorded');
                                            const superBuffer = new Blob(window.recordedBlobs, { type: 'video/webm' });
                                            recordedVideo.src = null;
                                            recordedVideo.srcObject = null;
                                            recordedVideo.src = window.URL.createObjectURL(superBuffer);
                                            recordedVideo.controls = true;
                                            recordedVideo.play();
                                            console.log(recordedVideo);
                                          }
                                        }>play</button> {' '}
                                        <button onClick={(event) => { event.preventDefault(); this.uploadVideo() }}>Save to DB</button>
                                      </Row>
                                    </div>
                                  )
                                  :
                                  (<div>
                                    <p>You already upload video, you dont need to upload again</p>
                                  </div>)}
                            </CardBody>
                          </Collapse>
                        </Card>
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
