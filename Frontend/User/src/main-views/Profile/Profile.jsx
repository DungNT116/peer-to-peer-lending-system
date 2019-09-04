import React from 'react';

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
  Modal,
} from 'reactstrap';

import { css } from '@emotion/core';

import { PulseLoader } from 'react-spinners';
// core components
import MainNavbar from '../MainNavbar/MainNavbar.jsx';
import SimpleFooter from 'components/Footers/SimpleFooter.jsx';
import { apiLink } from '../../api.jsx';
import { database } from 'firebase';
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
      documentID: [],
      documentPP: [],
      documentDL: [],
      uploadDocumentID: [],
      uploadDocumentPP: [],
      uploadDocumentDL: [],
      docs: [],
      documentTypes: [],
      loadingID: true,
      loadingPP: true,
      loadingDL: true,
      collapse: false,
      accordion: [true, false, false, false],
      custom: [true, false],
      status: 'Closed',
      fadeIn: true,
      timeout: 300,
      isUploadedVideo: false,
      loadingVideo: true,
      editable: false,
      validPhone: true,
      validEmail: true,
      validLastname: true,
      validFirstname: true,
      newFirstName: '',
      newLastName: '',
      newEmail: '',
      newPhoneNumber: '',
      isChangePassword: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      isSamePassword: false,
      isVideoSaved: false,
      loading: true,
      isOpen: true,
      isOpenSuccess: false,
      isOpenError: false,
      isOpenUpload: false,
      isDownloaded: false,
    };
    this.getProfile = this.getProfile.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this);

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
    this.getDocumentTypeList = this.getDocumentTypeList.bind(this);

    this.handleError = this.handleError.bind(this);
    this.getHashFile = this.getHashFile.bind(this);
  }

  getHashFile() {
    // window.open('192.168.7.215:8080/document/download/hashFileTest')
    fetch(apiLink + '/rest/document/download/hashFile', {
      method: 'GET',
      headers: {
        // "Content-Type": "application/json",
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(async result => {
        if (result.status === 200) {
          //load profile again
          this.getProfile();
          result.blob().then(blob => {
            var txtURL = window.URL.createObjectURL(blob);
            var tempLink = document.createElement('a');
            tempLink.href = txtURL;
            tempLink.setAttribute('download', 'pplsUserHashFile.txt');
            tempLink.click();
          })
        } else if (result.status === 400) {
          this.setState({
            isOpenError: true,
            message: "Please upload identity card and video to get hash"
          })
        } else if (result.status === 401) {
          localStorage.removeItem('isLoggedIn');
          this.props.history.push('/login-page');
        } else {
          result.text().then(async data => {
            await this.setState({
              isOpenError: true,
              message: "something went wrong",
            });
          });
        }
      })
      .catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.handleError(data);
      });
  }

  changeOldPassword(event) {
    this.setState({
      oldPassword: event.target.value,
    });
  }

  changeNewPassword(event) {
    var errorElement = document.getElementById('confirmError');
    var tmpPassword = event.target.value;
    if (tmpPassword.length < 8) {
      document.getElementById('passwordError').innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Password length at least 8 characters!</strong></div>";
      this.setState({
        newPassword: tmpPassword,
        validPassword: false,
      });
      if (event.target.value === this.state.confirmPassword) {
        errorElement.innerHTML = '';
        this.setState({
          newPassword: tmpPassword,
          isSamePassword: true,
        });
      } else {
        errorElement.innerHTML =
          "<div class='alert alert-danger' role='alert'><strong>Confirm password is not match</strong></div>";
        this.setState({
          newPassword: tmpPassword,
          isSamePassword: false,
        });
      }
    } else {
      document.getElementById('passwordError').innerHTML = '';
      this.setState({
        newPassword: tmpPassword,
        validPassword: true,
      });
    }
  }

  changeConfirmPassword(event) {
    var errorElement = document.getElementById('confirmError');
    if (this.state.newPassword === event.target.value) {
      errorElement.innerHTML = '';
      this.setState({
        confirmPassword: event.target.value,
        isSamePassword: true,
      });
    } else {
      errorElement.innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Confirm password is not match</strong></div>";
      this.setState({
        confirmPassword: event.target.value,
        isSamePassword: false,
      });
    }
  }
  toggleModal = stateParam => {
    this.setState({
      [stateParam]: !this.state[stateParam],
    });
  };

  changePassword() {
    if (this.state.isSamePassword === true) {
      var formData = new FormData();
      formData.append('oldPassword', this.state.oldPassword);
      formData.append('newPassword', this.state.newPassword);

      fetch(apiLink + '/rest/user/changePassword', {
        method: 'POST',
        headers: {
          // "Content-Type": "application/json",
          Authorization: localStorage.getItem('token'),
        },
        body: formData,
      })
        .then(async result => {
          if (result.status === 200) {
            this.changeIsChangePassword();
            await this.setState({
              newPassword: '',
              oldPassword: '',
              confirmPassword: '',
              isOpenSuccess: true,
            });
            setTimeout(
              function () {
                this.setState({ isOpenSuccess: false });
              }.bind(this),
              1000
            );
          } else if (result.status === 401) {
            localStorage.removeItem('isLoggedIn');
            this.props.history.push('/login-page');
          } else {
            result.text().then(async data => {
              await this.setState({
                isOpenError: true,
                message: "something went wrong",
              });
            });
          }
        })
        .catch(async data => {
          //CANNOT ACCESS TO SERVER
          await this.handleError(data);
        });
    }
  }

  changeIsChangePassword() {
    this.setState({
      isChangePassword: !this.state.isChangePassword,
    });
  }

  async saveUserInformation() {
    if (
      this.state.validEmail === true &&
      this.state.validFirstname === true &&
      this.state.validLastname === true &&
      this.state.validPhone === true
    ) {
      fetch(apiLink + '/rest/user/changeUserInfo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify({
          firstName: this.state.newFirstName,
          lastName: this.state.newLastName,
          email: this.state.newEmail,
          phoneNumber: this.state.newPhoneNumber,
        }),
      })
        .then(result => {
          if (result.status === 200) {
            this.changeEditable();
            this.getProfile();
          } else if (result.status === 401) {
            localStorage.removeItem('isLoggedIn');
            this.props.history.push('/login-page');
          }
        })
        .catch(async data => {
          //CANNOT ACCESS TO SERVER
          await this.handleError(data);
        });
    } else {
      await this.setState({
        isOpenError: true,
        message: 'Some field is still error, please fix all error field',
      });
    }
  }

  onPhoneNumberChange(event) {
    const tmp = event.target.value.trim();
    if (!tmp.match(/^(\d{10,12})*$/)) {
      document.getElementById('phoneError').innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Phone number contains at least 10 digit and at biggest 12 digit</strong></div>";
      this.setState({
        newPhoneNumber: tmp,
        validPhone: false,
      });
    } else {
      document.getElementById('phoneError').innerHTML = '';
      this.setState({
        newPhoneNumber: tmp,
        validPhone: true,
      });
    }
  }

  onEmailChange(event) {
    const tmp = event.target.value.trim();
    if (tmp.match(/^[a-zA-Z0-9]{5,30}@[a-z]{3,10}(.[a-z]{2,3})+$/)) {
      document.getElementById('emailError').innerHTML = '';
      this.setState({
        newEmail: tmp,
        validEmail: true,
      });
    } else {
      document.getElementById('emailError').innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Email is wrong format!</strong></div>";
      this.setState({
        newEmail: tmp,
        validEmail: false,
      });
    }
  }

  onFirstNameChange(event) {
    const tmp = event.target.value;
    if (!tmp.match(/^[a-z A-Z]*$/)) {
      document.getElementById('firstnameError').innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>First name is wrong format</strong></div>";
      this.setState({
        newFirstName: tmp,
        validFirstname: false,
      });
    } else {
      document.getElementById('firstnameError').innerHTML = '';
      this.setState({
        newFirstName: tmp,
        validFirstname: true,
      });
    }
  }

  onLastNameChange(event) {
    const tmp = event.target.value;
    if (tmp.match(/^[a-z A-Z]*$/)) {
      document.getElementById('lastnameError').innerHTML = '';
      this.setState({
        newLastName: tmp,
        validLastname: true,
      });
    } else {
      document.getElementById('lastnameError').innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Last name is wrong format!</strong></div>";
      this.setState({
        newLastName: tmp,
        validLastname: false,
      });
    }
  }

  changeEditable() {
    this.setState({
      editable: !this.state.editable,
    });
  }

  handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      window.recordedBlobs.push(event.data);
    }
  }

  async startRecording() {
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
    try {
      window.mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
      console.error('Exception while creating MediaRecorder:', e);
      return;
    }

    var recordButton = document.querySelector('button#record');
    recordButton.textContent = 'Recording';
    recordButton.disabled = true;
    window.mediaRecorder.ondataavailable = this.handleDataAvailable;
    window.mediaRecorder.start();

    var startCameraButton = document.querySelector('button#start');
    startCameraButton.disabled = true;

    var playButton = document.querySelector('button#play');
    playButton.disabled = true;

    var saveButton = document.querySelector('button#saveToDB');
    saveButton.disabled = true;
  }

  stopRecording() {
    window.mediaRecorder.stop();

    var recordButton = document.querySelector('button#record');
    recordButton.textContent = 'Start Recording';
    recordButton.disabled = false;

    var startCameraButton = document.querySelector('button#start');
    startCameraButton.disabled = false;

    var playButton = document.querySelector('button#play');
    playButton.disabled = false;

    var saveButton = document.querySelector('button#saveToDB');
    saveButton.disabled = false;
  }

  setSrcImgBase64(type, image) {
    return 'data:' + type + ';base64, ' + image;
  }

  containsObject(obj, list) {
    for (var i = 0; i < list.length; i++) {
      const [first] = Object.keys(list[i]);
      if (
        list[i][first].documentType === obj.documentType &&
        Object.values(list[i][first]).length === 0
      ) {
        return true;
      }
    }
    return false;
  }

  containKeyInArray(keyName, list) {
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      if (element.hasOwnProperty(keyName)) {
        return true;
      }
    }
    return false;
  }
  async getDocument() {
    await fetch(apiLink + '/rest/document/getUserDocument', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(async result => {
        if (result.status === 200) {
          this.setState({ docs: [] });
          result.json().then(async data => {
            for (let i = 0; i < this.state.documentTypes.length; i++) {
              //get element in doc type
              const elementType = await this.state.documentTypes[i];
              for (let j = 0; j < this.state.documentTypes.length; j++) {
                //get element in user doc
                const element = await data[j];
                if (element === undefined) {
                  //case elemnt undefined , check key exist in the state docs
                  if (
                    !this.containKeyInArray(
                      'document' + elementType.name.replace(/\s+/g, ''),
                      this.state.docs
                    )
                  ) {
                    await this.setState({
                      docs: [
                        ...this.state.docs,
                        {
                          ['document' + elementType.name.replace(/\s+/g, '')]: {
                            documentType: elementType,
                          },
                        },
                      ],
                      ['loading' +
                        elementType.acronym.replace(/\s+/g, '')]: false,
                    });
                  }
                } else if (elementType.name === element.documentType.name) {
                  //check exist in the state docs
                  var checkExist = await this.containsObject(
                    element,
                    this.state.docs
                  );
                  if (checkExist === false) {
                    //set data to docs if element exist in user document
                    await this.setState({
                      docs: [
                        ...this.state.docs,
                        {
                          ['document' +
                            element.documentType.name.replace(
                              /\s+/g,
                              ''
                            )]: element,
                        },
                      ],
                      ['loading' +
                        element.documentType.acronym.replace(/\s+/g, '')]: false,
                    });
                  }
                  //special with Video type
                  if (element.documentType.name === 'Video') {
                    if (element.status === 'invalid') {
                      await this.setState({
                        isVideoSaved: false,
                        isUploadedVideo: false,
                      });
                    } else {
                      await this.setState({
                        isUploadedVideo: true,
                        isVideoSaved: true,
                      });
                    }
                    this.setState({
                      loadingVideo: false,
                    });
                  } else {
                    await this.setState({
                      loadingVideo: false,
                    });
                  }
                }
              }
            }
            for (let i = 0; i < data.length; i++) {
              const element = data[i];
              if (
                this.state.docs[
                'document' + element.documentType.name.replace(/\s+/g, '')
                ] === null
              ) {
                await this.setState({
                  ['loading' +
                    element.documentType.acronym.replace(/\s+/g, '')]: false,
                });
              }
            }

            this.setState({
              isOpen: false,
            });
          });
          // this.props.history.push("/view-request-trading");
        } else if (result.status === 401) {
          localStorage.removeItem('isLoggedIn');
          this.props.history.push('/login-page');
        }
      })
      .catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.handleError(data);
      });
  }

  async uploadVideo() {
    const superBuffer = new Blob(window.recordedBlobs, { type: 'video/webm' });
    var base64data = '';
    var reader = new FileReader();
    reader.readAsDataURL(superBuffer);
    reader.onloadend = () => {
      base64data = reader.result;
      var formData = new FormData();
      formData.append('fileType', 'video/webm');
      formData.append('documentTypeId', 2); //2= VIdeo
      formData.append('base64Video', base64data);

      // formData.append("file", superBuffer)

      fetch(apiLink + '/rest/document/uploadVideo', {
        method: 'POST',
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem('token'),
        },
        body: formData,
        // JSON.stringify({
        //   documentType: this.state.documentID.documentType,
        //   file: this.state.documentID.listImage
        // })
      }).then(async result => {
        if (result.status === 200) {
          await this.getDocument()
          console.log('success');
        } else if (result.status === 401) {
          localStorage.removeItem('isLoggedIn');
          this.props.history.push('/login-page');
        } else if (result.status === 400) {
          alert('error');
        } else {
          alert('error not found');
        }
      });
    };
  }

  async saveDocument(idDoc, type) {
    let document = this.state['uploadDocument' + type];
    let typeId = idDoc;
    if (document.listImage !== undefined) {
      var formData = new FormData();
      formData.append('documentTypeId', typeId);
      for (let i = 0; i < document.listImage.length; i++) {
        const element = document.listImage[i];
        formData.append('file', element);
      }

      fetch(apiLink + '/rest/document/uploadFile', {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token'),
        },
        body: formData,
      })
        .then(async result => {
          if (result.status === 200) {
            //load document again
            await this.setState({
              loadingID: true,
              loadingPP: true,
              loadingDL: true,
              loadingVideo: true,
            });
            await this.getDocument();
            this.setState({
              isOpen: true,
              loading: true,
            });
            // this.props.history.push("/view-request-trading");
          } else if (result.status === 401) {
            localStorage.removeItem('isLoggedIn');
            this.props.history.push('/login-page');
          } else if (result.status === 400) {
            alert('error');
          } else {
            alert('error not found');
          }
        })
        .catch(async data => {
          //CANNOT ACCESS TO SERVER
          await this.handleError(data);
        });
    } else {
      // alert('please select image to upload');
      await this.setState({
        isOpenError: true,
        message: 'please select image to upload',
      });
    }
  }

  async handleFileInput(event, type) {
    var files = event.target.files;
    var validFilesCount = 0;
    var totalFilesSize = 0;
    for (let i = 0; i < files.length; i++) {
      const element = files[i];
      totalFilesSize += element.size;
      if (!element.type.includes('image')) {
        validFilesCount--;
      } else {
        validFilesCount++;
      }
    }
    //10 MB
    if (validFilesCount === files.length && totalFilesSize <= 10000000) {
      var document = { documentType: type, listImage: event.target.files };
      await this.setState({
        ['uploadDocument' + type]: document,
      });
    } else {
      await this.setState({
        isOpenError: true,
        message: 'please select image files or size is lower than 10MB',
      });
    }
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  async toggleAccordion(tab, docName) {
    var arrAccordition = await this.fillArray(
      false,
      this.state.documentTypes.length
    );
    await this.setState({
      accordion: arrAccordition,
    });
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));

    this.setState({
      accordion: state,
    });
    if (docName === 'Video') {
      var recordButton = document.querySelector('button#record');
      if (recordButton !== null) {
        recordButton.disabled = true;
      }
      var playButton = document.querySelector('button#play');
      if (playButton !== null) {
        playButton.disabled = true;
      }
      var saveButton = document.querySelector('button#saveToDB');
      if (saveButton !== null) {
        saveButton.disabled = true;
      }
    }
  }

  fillArray(value, len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
      arr.push(value);
    }
    return arr;
  }

  componentWillMount() {
    this.getDocumentTypeList();
    this.getDocument();
    // this.getHashFile();
  }

  componentDidMount() {
    const self = this;
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    this.getProfile();
  }

  getProfile() {
    fetch(apiLink + '/rest/user/getUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
        // "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      },
    })
      .then(result => {
        if (result.status === 200) {
          result.json().then(data => {
            console.log(data);
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
              isDownloaded: data.generateHashFile,
            });
          });
        } else if (result.status === 401) {
          localStorage.removeItem('isLoggedIn');
          this.props.history.push('/login-page');
        }
      })
      .catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.handleError(data);
      });
  }
  async handleError(data) {
    var error = data.toString();
    if (error === 'TypeError: Failed to fetch') {
      await this.setState({
        isOpenError: true,
        error: 'Cannot access to server',
      });
    } else {
      await this.setState({
        isOpenError: true,
        error: 'Something when wrong !',
      });
    }
  }
  openCamera(event) {
    event.preventDefault();
    const constraints = {
      audio: true,
      video: {
        width: '100%',
        height: 240,
      },
    };
    try {
      const stream = navigator.mediaDevices
        .getUserMedia(constraints)
        .then(async data => {
          window.stream = data;

          const gumVideo = await document.querySelector('video#gum');
          gumVideo.srcObject = data;

          var recordButton = document.querySelector('button#record');
          recordButton.disabled = false;
        });
    } catch (e) {
      console.error('navigator.getUserMedia error:', e);
    }
  }
  autoPlayVideo(event) {
    event.preventDefault();
    const recordedVideo = document.querySelector('video#recorded');
    const superBuffer = new Blob(window.recordedBlobs, { type: 'video/webm' });
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
    recordedVideo.play();
  }
  async getDocumentTypeList() {
    await fetch(apiLink + '/rest/documentType/listDocumentType', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
        // "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      },
    }).then(result => {
      if (result.status === 401) {
        localStorage.removeItem('isLoggedIn');
        this.props.history.push('/login-page');
      } else if (result.status === 200) {
        result.json().then(async data => {
          await this.setState({
            documentTypes: data,
          });
        });
      }
    });
  }
  getIdOfDocument(name) {
    const arrName = name.split(' ');
    let finalName = '';
    if (name === 'Video') {
      return (finalName = 'Video');
    } else {
      for (let i = 0; i < arrName.length; i++) {
        const element = arrName[i];
        finalName += element.charAt(0).toUpperCase();
      }
    }
    return finalName;
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  render() {
    const style = {
      profileComponent: {
        position: 'relative',
        top: -250,
      },
      myAccount: {
        position: 'relative',
        top: -150,
      },
      sameSizeWithParent: {
        width: '100%',
        height: '100%',
      },
    };
    const override = css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      padding-left: 0;
    `;
    const listDocumentType = this.state.docs.map((doc, index) => (
      <Card className="mb-0">
        <CardHeader id={'heading' + index}>
          <Button
            block
            color="link"
            className="text-left m-0 p-0"
            onClick={() =>
              this.toggleAccordion(
                index,
                doc[Object.keys(doc)[0]].documentType.name
              )
            }
            aria-expanded={this.state.accordion[index]}
            aria-controls={'collapse' + index}
          >
            <h5 className="m-0 p-0">
              {doc[Object.keys(doc)[0]].documentType.name}
            </h5>
          </Button>
        </CardHeader>
        <Collapse
          isOpen={this.state.accordion[index]}
          data-parent="#accordion"
          id={'collapse' + index}
        >
          <CardBody style={style.sameSizeWithParent}>
            {this.state[
              'loading' + doc[Object.keys(doc)[0]].documentType.acronym
            ] === true ? (
                <PulseLoader
                  css={override}
                  sizeUnit={'px'}
                  size={15}
                  color={'#123abc'}
                  loading={
                    this.state[
                    'loading' + doc[Object.keys(doc)[0]].documentType.acronym
                    ]
                  }
                />
              ) : doc[Object.keys(doc)[0]].documentFile !== undefined &&
                doc[Object.keys(doc)[0]].documentType.name !== 'Video' ? (
                  //
                  <div>
                    {/*  */}
                    {doc[Object.keys(doc)[0]].status === 'invalid' ? (
                      <div>
                        <small style={{ color: 'red' }}>
                          <strong>
                            Your document is rejected, please upload again for
                            validation !
                      </strong>
                        </small>
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={event =>
                            this.handleFileInput(
                              event,
                              doc[Object.keys(doc)[0]].documentType.acronym
                            )
                          }
                        />{' '}
                        <Button
                          type="button"
                          onClick={async () =>
                            await this.saveDocument(
                              doc[Object.keys(doc)[0]].documentType.id,
                              doc[Object.keys(doc)[0]].documentType.acronym
                            )
                          }
                        >
                          Save
                    </Button>
                      </div>
                    ) : doc[Object.keys(doc)[0]].status === 'pending' ? (
                      'Document is waiting for validation'
                    ) : (
                          ''
                        )}
                    {/*  */}
                    {doc[Object.keys(doc)[0]].documentFile.map(imageData => (
                      <img
                        src={this.setSrcImgBase64(
                          imageData.fileType,
                          imageData.data
                        )}
                        style={style.sameSizeWithParent}
                      />
                    ))}
                  </div>
                ) : doc[Object.keys(doc)[0]].documentType.name === 'Video' ? (
                  this.state[
                    'loading' + doc[Object.keys(doc)[0]].documentType.acronym
                  ] === true ? (
                      <PulseLoader
                        css={override}
                        sizeUnit={'px'}
                        size={15}
                        color={'#123abc'}
                        loading={
                          this.state[
                          'loading' +
                          doc[Object.keys(doc)[0]].documentType.acronym.replace(
                            /\s+/g,
                            ''
                          )
                          ]
                        }
                      />
                    ) : this.state.isUploadedVideo === false ? (
                      this.state.isVideoSaved === false ? (
                        <div>
                          <Row>
                            <Col md={2} />
                            <Col md={8}>
                              <video autoPlay id="gum" />
                              <video autoPlay id="recorded" />
                            </Col>
                            <Col md={2} />
                          </Row>
                          <Row>
                            <h5>
                              <strong>
                                Turn on the camera , show your face clearly in camera
                                and talk "I agree to use PPLS" to validate your
                                Identity Video
                        </strong>
                            </h5>
                          </Row>
                          <Row>
                            <Button
                              size="md"
                              className="btn btn-outline-primary"
                              id="start"
                              onClick={event => {
                                this.openCamera(event);
                              }}
                            >
                              Start camera
                      </Button>
                            <Button
                              size="md"
                              className="btn btn-outline-primary"
                              id="record"
                              onClick={event => {
                                event.preventDefault();
                                var recordButton = document.querySelector(
                                  'button#record'
                                );
                                this.openCamera(event);
                                if (recordButton.textContent === 'Start Recording') {
                                  this.startRecording();
                                  setTimeout(
                                    function () {
                                      this.stopRecording();
                                      window.stream
                                        .getTracks()
                                        .forEach(function (track) {
                                          track.stop();
                                        });
                                    }.bind(this),
                                    5000
                                  );
                                }
                              }}
                            >
                              Start Recording
                      </Button>
                            <Button
                              size="md"
                              className="btn btn-outline-primary"
                              id="play"
                              onClick={event => {
                                this.autoPlayVideo(event);
                              }}
                            >
                              Play
                      </Button>{' '}
                            <Button
                              id="saveToDB"
                              size="md"
                              className="btn btn-outline-primary"
                              onClick={event => {
                                event.preventDefault();
                                this.uploadVideo();
                              }}
                            >
                              Save video
                      </Button>
                          </Row>
                        </div>
                      ) : (
                          <div>
                            <p>
                              You had already upload video, waiting for validating from
                              Admin
                    </p>
                          </div>
                        )
                    ) : (
                        <div>
                          <p>
                            You had already upload video, system will keep your Identity
                            Video due to User Privacy
                  </p>
                        </div>
                      )
                ) : (
                    <div>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={event =>
                          this.handleFileInput(
                            event,
                            doc[Object.keys(doc)[0]].documentType.acronym
                          )
                        }
                      />{' '}
                      <Button
                        type="button"
                        onClick={async () =>
                          await this.saveDocument(
                            doc[Object.keys(doc)[0]].documentType.id,
                            doc[Object.keys(doc)[0]].documentType.acronym
                          )
                        }
                      >
                        Save
                </Button>
                    </div>
                  )}
          </CardBody>
        </Collapse>
      </Card>
    ));
    return (
      <>
        <MainNavbar />
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
              <Modal
                className="modal-dialog-centered"
                isOpen={this.state.isOpen}
                toggle={() => this.toggleModal('defaultModal')}
                style={style.sameSizeWithParent}
              >
                <div className="modal-header">
                  <h3 className="modal-title" id="modal-title-default">
                    Loading
                  </h3>
                </div>
                <div className="modal-body">
                  <PulseLoader
                    css={override}
                    sizeUnit={'px'}
                    size={15}
                    color={'#123abc'}
                    loading={this.state.loading}
                  />
                </div>
              </Modal>
              <Row>
                <Col className="order-xl-1 mb-5 mb-xl-0" xl="4">
                  <Card className="card-profile shadow">
                    <Row className="justify-content-center">
                      <Col className="order-lg-2" lg="3">
                        <div className="card-profile-image">
                          <a
                            // href="#pablo"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={require('assets/img/theme/team-4-800x800.png')}
                            />
                          </a>
                        </div>
                      </Col>
                    </Row>
                    <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                      <div className="d-flex justify-content-between" />
                    </CardHeader>
                    <CardBody className="pt-0 pt-md-4">
                      <Row>
                        <div className="col">
                          <div className="card-profile-stats d-flex justify-content-center mt-md-5" />
                        </div>
                      </Row>
                      <div className="text-center">
                        <Button
                          color="primary"
                          // href="#pablo"
                          onClick={e => e.preventDefault()}
                          size="sm"
                        >
                          Change Avatar
                        </Button>
                        <h3>
                          {this.state.firstName + ' ' + this.state.lastName}
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
                        {/* <hr className="my-4" />
                        <p>
                          Ryan — the name taken by Melbourne-raised,
                          Brooklyn-based Nick Murphy — writes, performs and
                          records all of his own music.
                        </p>
                        <a href="#pablo" onClick={e => e.preventDefault()}>
                          Show more
                        </a> */}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col className="order-xl-2 " style={style.myAccount} xl="8">
                  <Card className="bg-secondary shadow">
                    <CardHeader className="bg-white border-0">
                      <Row className="align-items-center">
                        <Col xs="5">
                          <h3 className="mb-0">My account</h3>
                        </Col>
                        {this.state.isDownloaded === false ?
                          (<Col className="text-right" xs="2">
                            <Button
                              id="hash"
                              color="primary"
                              onClick={() => {this.setState({ hashModal: true });}}
                              size="sm"
                            >
                              Get Hash
                        </Button>
                          </Col>)
                          :
                          ("")}

                        <Col className="text-right" xs="2">
                          {this.state.editable === false ? (
                            <Button
                              id="editProfile"
                              color="primary"
                              // href="#pablo"
                              onClick={() => this.changeEditable()}
                              disabled={
                                this.state.isChangePassword === true
                                  ? true
                                  : false
                              }
                              size="sm"
                            >
                              Edit Profile
                            </Button>
                          ) : (
                              ''
                            )}
                        </Col>
                        <Col className="text-right" xs="3">
                          {this.state.isChangePassword === false ? (
                            <Button
                              color="primary"
                              // href="#pablo"
                              onClick={() => this.changeIsChangePassword()}
                              disabled={
                                this.state.editable === true ? true : false
                              }
                              size="sm"
                            >
                              Change Password
                            </Button>
                          ) : (
                              ''
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
                          {this.state.isChangePassword === false ? (
                            <div>
                              <Row>
                                <Col lg="6">
                                  <FormGroup>
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-phonenumber"
                                    >
                                      Loan Limit
                                    </label>
                                  </FormGroup>
                                </Col>
                                <Col lg="6">
                                  {this.numberWithCommas(this.state.loanLimit)}{' '}
                                  VND
                                </Col>
                              </Row>
                              <Row>
                                <Col lg="6">
                                  <FormGroup>
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-phonenumber"
                                    >
                                      Phone Number
                                    </label>
                                    {this.state.editable === true ? (
                                      <div>
                                        <Input
                                          className="form-control-alternative"
                                          value={this.state.newPhoneNumber}
                                          id="input-phonenumber"
                                          type="text"
                                          onChange={this.onPhoneNumberChange}
                                        />
                                        <p
                                          style={{ color: 'red' }}
                                          id="phoneError"
                                        />
                                      </div>
                                    ) : (
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
                                    {this.state.editable === true ? (
                                      <div>
                                        <Input
                                          className="form-control-alternative"
                                          value={this.state.newEmail}
                                          id="input-email"
                                          type="email"
                                          onChange={this.onEmailChange}
                                        />
                                        <p
                                          style={{ color: 'red' }}
                                          id="emailError"
                                        />
                                      </div>
                                    ) : (
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
                                    {this.state.editable === true ? (
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
                                          style={{ color: 'red' }}
                                          id="firstnameError"
                                        />
                                      </div>
                                    ) : (
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
                                    {this.state.editable === true ? (
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
                                          style={{ color: 'red' }}
                                          id="lastnameError"
                                        />
                                      </div>
                                    ) : (
                                        <p>{this.state.lastName}</p>
                                      )}
                                  </FormGroup>
                                </Col>
                              </Row>

                              {this.state.editable === true ? (
                                <Row>
                                  <Col className="text-right" xs="3">
                                    <Button
                                      id="saveProfile"
                                      color="primary"
                                      // href="#pablo"
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
                                      // href="#pablo"
                                      onClick={() => this.changeEditable()}
                                      size="sm"
                                    >
                                      cancel
                                    </Button>
                                  </Col>
                                </Row>
                              ) : (
                                  ''
                                )}
                            </div>
                          ) : (
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
                                        <p
                                          style={{ color: 'red' }}
                                          id="passwordError"
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
                                        <p id="confirmError" />
                                      </div>
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <Row>
                                  <Button
                                    id="savePassword"
                                    color="primary"
                                    onClick={() => this.changePassword()}
                                    size="sm"
                                  >
                                    save
                                </Button>{' '}
                                  <Button
                                    id="cancelChangePassword"
                                    color="primary"
                                    onClick={() => this.changeIsChangePassword()}
                                    size="sm"
                                  >
                                    cancel
                                </Button>
                                </Row>
                              </div>
                            )}
                        </div>
                        <small style={{ color: 'red' }}>
                          <strong>
                            *Identity Card and Identity Video are required to
                            increase loan limit
                          </strong>
                        </small>
                        {listDocumentType}
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>
        </main>
        <SimpleFooter />
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.isOpenSuccess}
        // toggle={() => this.toggleModal('defaultModal')}
        >
          <div className="modal-body">
            <h3 className="modal-title" id="modal-title-default">
              <img
                style={{ width: 50, height: 50 }}
                src={require('assets/img/theme/checked.png')}
              />
              Successfully Saved
            </h3>
          </div>
        </Modal>
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.isOpenError}
        // toggle={() => this.toggleModal('defaultModal')}
        >
          <div className="modal-header">Error</div>
          <div className="modal-body">
            <h3 className="modal-title" id="modal-title-default">
              {this.state.message}
            </h3>
          </div>
          <div className="modal-footer">
            <Button
              onClick={() => {
                this.setState({ isOpenError: false });
              }}
            >
              OK
            </Button>
          </div>
        </Modal>

        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.isOpenUpload}
        >
          <div className="modal-body">
            <h3 className="modal-title" id="modal-title-default">
              <img
                style={{ width: 50, height: 50 }}
                src={require('assets/img/theme/checked.png')}
              />
              Successfully Upload Video
            </h3>
          </div>
        </Modal>
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.hashModal}
        >
          <div className="modal-header">Confirm</div>
          <div className="modal-body">
            <h3 className="modal-title">
              <p>This hash file use for execute transaction and download once!</p>
              <p>Please keep this file safe</p>
            </h3>
          </div>
          <div className="modal-footer">
            <Button
              onClick={() => {
                this.getHashFile()
                this.setState({
                  hashModal: false
                })
              }}
            >
              OK
            </Button>
            <Button
              onClick={() => {
                this.setState({
                  hashModal: false
                })
              }}
            >
              close
            </Button>
          </div>
        </Modal>
      </>
    );
  }
}

export default Profile;
