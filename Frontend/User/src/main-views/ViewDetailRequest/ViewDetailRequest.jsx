import React from 'react';
import {connect} from 'react-redux';

// reactstrap components
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Label,
  FormGroup,
  CardFooter,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Progress,
  Input,
} from 'reactstrap';

import {database} from '../../firebase';
import {PayPalButton} from 'react-paypal-button-v2';
import {apiLink, bigchainAPI, client_API} from '../../api.jsx';
// core components
import MainNavbar from '../MainNavbar/MainNavbar.jsx';
import SimpleFooter from 'components/Footers/SimpleFooter.jsx';
import ApplyTimeline from '../ApplyTimeline/ApplyTimeline';
// library support generate pdf file
import jsPDF from 'jspdf';

class ViewDetailRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saveDealModal: false,
      modal: false,
      timeout: 300,
      editable: false,
      createDay: '',
      dueDay: '',
      borrowDuration: '',
      dbDataLendingTimeline: [],
      dbDataPayBackTimeline: [],
      isTrading: false,
      isHistory: false,
      isViewDetail: false,
      data_tx: {},
      lendingTimeline: [],
      paybackTimeline: [],
      isLendMany: false,
      isPayMany: false,

      errorModal: false,
      isOpenSuccess: false,
      isOpenError: false,
      message: '',
      currencyUSDVND: null,

      validHash: false,
      file: null,
      hashError: '',
      isOpenPDF: false,
      fullName: '',
      blockchainID: '',
    };
    this.toggleErrorModal = this.toggleErrorModal.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleSaveDealModal = this.toggleSaveDealModal.bind(this);
    this.makeDeal = this.makeDeal.bind(this);
    this.saveDeal = this.saveDeal.bind(this);
    this.onCreateDayChange = this.onCreateDayChange.bind(this);
    this.onDueDayChange = this.onDueDayChange.bind(this);
    this.onBorrowDurationChange = this.onBorrowDurationChange.bind(this);
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.handleDataTimeline = this.handleDataTimeline.bind(this);
    this.changeMilestoneToTimelineData = this.changeMilestoneToTimelineData.bind(
      this
    );
    this.formatDate = this.formatDate.bind(this);
    this.saveNewDealInformationToDB = this.saveNewDealInformationToDB.bind(
      this
    );
    this.createMileStone = this.createMileStone.bind(this);
    this.acceptDeal = this.acceptDeal.bind(this);
    this.validRedux = this.validRedux.bind(this);
    this.saveTransaction = this.saveTransaction.bind(this);
    this.convertDateToTimestamp = this.convertDateToTimestamp.bind(this);
    this.goToViewRequestTrading = this.goToViewRequestTrading.bind(this);
    this.handleFileInput = this.handleFileInput.bind(this);
    this.validHashFile = this.validHashFile.bind(this);
    this.handleError = this.handleError.bind(this);
    this.generatePDF = this.generatePDF.bind(this);
    this.getProfile = this.getProfile.bind(this);
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
            console.log(data.firstName + ' ' + data.lastName);
            this.setState({
              fullName: data.firstName + ' ' + data.lastName,
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

  generatePDF() {
    console.log(this.props.request.data);
    let duration =
      (this.props.request.data.deal.milestone[
        this.props.request.data.deal.milestone.length - 1
      ].presentDate -
        this.props.request.data.deal.milestone[0].presentDate) /
      86400;
    var doc = new jsPDF();

    doc.setFontSize(35);
    doc.text('Transaction information', 105, 20, 'center');
    doc.setFontSize(25);
    doc.text('Deal Information', 20, 40);
    doc.setFontSize(14);
    doc.text(
      'Borrower Name: ' +
        this.props.request.data.borrower.firstName +
        ' ' +
        this.props.request.data.borrower.lastName,
      20,
      50
    );
    doc.text('Lender Name: ' + this.state.fullName, 20, 60);
    doc.text(
      'Total Amount: ' +
        this.numberWithCommas(
          this.props.request.data.amount +
            Math.round(
              ((((this.props.request.data.amount * duration) / 30) *
                (this.props.request.data.interestRate / 12)) /
                100) *
                1000
            ) /
              1000
        ) +
        ' VND',
      20,
      70
    );
    doc.text(
      'Borrow Amount: ' +
        this.numberWithCommas(this.props.request.data.amount) +
        ' VND',
      20,
      80
    );
    doc.text(
      'Interest Rate: ' +
        this.props.request.data.interestRate +
        ' percent per year',
      20,
      90
    );
    doc.text(
      'Interest Received: ' +
        this.numberWithCommas(
          Math.round(
            ((((this.props.request.data.amount * duration) / 30) *
              (this.props.request.data.interestRate / 12)) /
              100) *
              1000
          ) / 1000
        ) +
        ' VND',
      20,
      100
    );
    doc.setFontSize(25);
    doc.text('Milestone Information (Month/Day/Year): ', 20, 120);
    doc.setFontSize(14);
    var line = 120;
    var paybackIndex = 1;
    for (let i = 0; i < this.props.request.data.deal.milestone.length; i++) {
      const element = this.props.request.data.deal.milestone[i];
      // console.log(element)
      line += 5
      if (element.type === 'lend' && i % 2 === 1) {
        if (element.transaction.status !== null) {
          doc.text('Milestone Lend ' + Number(i) + ' - ' + Number(i + 1) + ': ' + this.convertTimeStampToDate(element.previousDate) + ' - ' + this.convertTimeStampToDate(element.presentDate) + " (Paid)", 20, line)
        } else {
          if (i === 1) {
            doc.text('Milestone Lend ' + Number(i) + ' - ' + Number(i + 1) + ': ' + this.convertTimeStampToDate(element.previousDate) + ' - ' + this.convertTimeStampToDate(element.presentDate) + " (Paid)", 20, line)
          } else {
            doc.text('Milestone Lend ' + Number(i) + ' - ' + Number(i + 1) + ': ' + this.convertTimeStampToDate(element.previousDate) + ' - ' + this.convertTimeStampToDate(element.presentDate), 20, line)
          }
        }

      } else if (element.type === 'payback' && i % 2 === 1) {
        if (element.transaction.status !== null) {
          doc.text('Milestone payback ' + Number(paybackIndex) + ' - ' + Number(paybackIndex + 1) + ': ' + this.convertTimeStampToDate(element.previousDate) + ' - ' + this.convertTimeStampToDate(element.presentDate) + " (Paid)", 20, line)
          paybackIndex += 2;
        } else {
          doc.text('Milestone Payback ' + Number(paybackIndex) + ' - ' + Number(paybackIndex + 1) + ': ' + this.convertTimeStampToDate(element.previousDate) + ' - ' + this.convertTimeStampToDate(element.presentDate), 20, line)
          paybackIndex += 2;
        }
      }
    }
    let user = localStorage.getItem('user');
    let lenderUsername = '';
    if (this.props.request.data.borrower.username !== user) {
      lenderUsername = user;
    } else {
      lenderUsername = this.props.request.data.borrower.username;
    }
    line += 20;
    doc.setFontSize(25);
    doc.text('Transaction Information: ', 20, line);

    doc.setFontSize(14);
    line += 10;
    doc.text('Milestone 1 - 2: ' + this.convertTimeStampToDate(this.props.request.data.deal.milestone[1].previousDate) + ' - ' + this.convertTimeStampToDate(this.props.request.data.deal.milestone[1].presentDate), 20, line)
    line += 10;
    var tmp = doc.splitTextToSize('Transaction ID: ' + this.state.blockchainID, 180);
    doc.text(20, line, tmp)
    line += 15;
    doc.text('Sender: ' + lenderUsername, 20, line);
    line += 10;
    doc.text(
      'Receiver: ' + this.props.request.data.borrower.username,
      20,
      line
    );
    line += 10;
    doc.text(
      'Transaction Amount (USD): ' + this.state.data_tx.amount + ' USD',
      20,
      line
    );
    line += 10;
    doc.text(
      'Transaction Amount (VND): ' +
        this.numberWithCommas(
          this.roundUp(
            this.props.request.data.amount *
              this.props.request.data.deal.milestone[1].percent
          )
        ) +
        ' VND',
      20,
      line
    );
    line += 10;
    doc.text(
      'Created Day: ' +
        this.convertTimeStampToDate(this.state.data_tx.createDate),
      20,
      line
    );

    doc.save(
      'receipt-' +
        lenderUsername +
        '-' +
        this.state.data_tx.createDate +
        '.pdf'
    );
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

  async validHashFile() {
    // if(this.state.file !== null || )

    if (this.state.file !== undefined && this.state.file !== null) {
      var file = this.state.file[0];
      console.log(file);
      var formData = new FormData();
      console.log(file);
      formData.append('file', file);
      console.log(formData.get('file'));

      fetch(apiLink + '/rest/document/validHashFile', {
        method: 'POST',
        headers: {
          // ContentType: 'multipart/form-data',
          // Accept: "application/json",
          Authorization: localStorage.getItem('token'),
        },
        body: formData,
      })
        .then(async result => {
          if (result.status === 200) {
            await this.setState({
              validHash: true,
            });
          } else if (result.status === 401) {
            localStorage.removeItem('isLoggedIn');
            this.props.history.push('/login-page');
          } else if (result.status === 400) {
            result.text().then(async error => {
              await this.setState({
                hashError: error,
              });
            });
            // alert('error');
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
        message: 'please select text file to upload',
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
      if (!element.type.includes('text/plain')) {
        validFilesCount--;
      } else {
        validFilesCount++;
      }
    }
    //10 MB
    if (validFilesCount === files.length && totalFilesSize <= 10000000) {
      // var document = { documentType: type, listImage: event.target.files };
      await this.setState({
        file: files,
      });
    } else {
      await this.setState({
        isOpenError: true,
        message: 'please select text file or size is lower than 10MB',
      });
    }
  }

  toggleErrorModal() {
    this.setState({
      errorModal: !this.state.errorModal,
    });
  }

  toggleSaveDealModal() {
    this.setState({
      saveDealModal: !this.state.saveDealModal,
    });
  }

  goToViewRequestTrading() {
    this.props.history.push('/view-request-trading');
  }

  convertDateToTimestamp(date) {
    return Math.round(date.getTime() / 1000);
  }

  saveTransaction(data, data_transaction) {
    fetch(apiLink + '/rest/transaction/newTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        sender: data_transaction.data_tx.data.tx_data.sender,
        receiver: data_transaction.data_tx.data.tx_data.receiver,
        amount: Number(
          this.props.request.data.amount *
            this.props.request.data.deal.milestone[1].percent
        ),
        amountValid: Number(data.amount),
        status: data.status,
        idTrx: data.id,
        createDate: data_transaction.data_tx.data.tx_data.createDate,
        milestone: {
          id: Number(this.props.request.data.deal.milestone[1].id),
        },
      }),
    })
      .then(async result => {
        if (result.status === 200) {
          // alert('create success');
          // await this.setState({
          //   isOpenSuccess: true
          // })
          // await setTimeout(
          //   async function () {
          //     // this.props.history.push('/view-request-trading');
          //     await this.setState({
          //       isOpenSuccess: false
          //     })
          //   }.bind(this),
          //   1000
          // );
          await this.setState({
            isOpenPDF: true,
          });
          // this.props.history.push("/view-request-trading");
        } else if (result.status === 401) {
          localStorage.removeItem('isLoggedIn');
          this.props.history.push('/login-page');
        }
      })
      .catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.setState({
          isOpenError: true,
          message: 'Cannot access to server',
        }).catch(async data => {
          //CANNOT ACCESS TO SERVER
          await this.setState({
            isOpenError: true,
            message: 'Cannot access to server',
          });
        });
      });
  }

  validRedux() {
    if (
      Object.keys(this.props.request.data).length === 0 ||
      Object.keys(this.props.request.data.deal).length === 0
    ) {
      // localStorage.removeItem("isLoggedIn");
      this.props.history.push(localStorage.getItem('previousPage'));
      // reload page to go to login page
      window.location.reload();
    }
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  acceptDeal() {
    fetch(apiLink + '/rest/deal/acceptDeal', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        id: this.props.request.data.deal.id,
        request: {
          borrowDate: Math.round(new Date().getTime() / 1000),
        },
      }),
    })
      .then(async result => {
        if (result.status === 200) {
          await database
            .ref('ppls')
            .orderByChild('username')
            .equalTo(this.state.borrowUsername)
            .once('value', snapshot => {
              if (snapshot.exists()) {
                const userData = snapshot.val();
                this.setState({keyUserFb: Object.keys(userData)[0]});
              }
            });
          await database
            .ref('/ppls/' + this.state.keyUserFb + '/notification')
            .push({
              message:
                localStorage.getItem('user') +
                ' accepted request number : ' +
                this.props.request.data.id +
                ' !',
              sender: localStorage.getItem('user'),
              requestId: this.props.request.data.id,
            });
          var upvotesRef = database.ref(
            '/ppls/' + this.state.keyUserFb + '/countNew'
          );
          await upvotesRef.transaction(function(current_value) {
            return (current_value || 0) + 1;
          });
        } else if (result.status === 401) {
          localStorage.removeItem('isLoggedIn');
          this.props.history.push('/login-page');
        }
      })
      .catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.setState({
          isOpenError: true,
          message: 'Cannot access to server',
        });
      });
  }

  createMileStone() {
    let milestones = [];
    let milestone = {
      previousDate: '',
      presentDate: '',
      percent: '',
      type: '',
    };
    for (let i = 0; i < this.state.lendingTimeline.length; i++) {
      const element = this.state.lendingTimeline[i];
      var dateToTimestamp = new Date(element.data).getTime() / 1000;
      milestone = {
        previousDate: '',
        presentDate: '',
        percent: '',
        type: '',
      };
      if (i === 0) {
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = dateToTimestamp;
        milestone.type = 'lend';
        milestone.percent = element.percent;
      } else {
        const preElement = this.state.lendingTimeline[i - 1];
        var preDateToTimestamp = new Date(preElement.data).getTime() / 1000;
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = preDateToTimestamp;
        milestone.type = 'lend';
        milestone.percent = element.percent;
      }
      milestones.push(milestone);
    }
    for (let i = 0; i < this.state.paybackTimeline.length; i++) {
      const element = this.state.paybackTimeline[i];
      var dateToTimestamp = new Date(element.data).getTime() / 1000;
      milestone = {
        previousDate: '',
        presentDate: '',
        percent: '',
        type: '',
      };
      if (i === 0) {
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = dateToTimestamp;
        milestone.type = 'payback';
        milestone.percent = element.percent;
      } else {
        const preElement = this.state.paybackTimeline[i - 1];
        var preDateToTimestamp = new Date(preElement.data).getTime() / 1000;
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = preDateToTimestamp;
        milestone.type = 'payback';
        milestone.percent = element.percent;
      }
      milestones.push(milestone);
    }
    return milestones;
  }

  saveNewDealInformationToDB() {
    fetch(apiLink + '/rest/deal/makeDeal', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        id: this.props.request.data.deal.id,
        borrowTimes: this.state.lendingTimeline.length,
        paybackTimes: this.state.paybackTimeline.length,
        milestone: this.createMileStone(),
      }),
    })
      .then(async result => {
        if (result.status === 401) {
          localStorage.removeItem('isLoggedIn');
          this.props.history.push('/login-page');
        } else if (result.status === 200) {
          await database
            .ref('ppls')
            .orderByChild('username')
            .equalTo(this.state.makeDealUsername)
            .once('value', snapshot => {
              if (snapshot.exists()) {
                const userData = snapshot.val();
                this.setState({keyUserFb: Object.keys(userData)[0]});
              }
            });
          await database
            .ref('/ppls/' + this.state.keyUserFb + '/notification')
            .push({
              message:
                localStorage.getItem('user') +
                ' make deal request number : ' +
                this.props.request.data.id +
                ' !',
              sender: localStorage.getItem('user'),
              requestId: this.props.request.data.id,
            });
          var upvotesRef = database.ref(
            '/ppls/' + this.state.keyUserFb + '/countNew'
          );
          await upvotesRef.transaction(function(current_value) {
            return (current_value || 0) + 1;
          });
        } else if (result.status === 400) {
          this.toggleErrorModal();
        }
      })
      .catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.setState({
          isOpenError: true,
          message: 'Cannot access to server',
        });
      });
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  changeMilestoneToTimelineData() {
    let numberOfLendingMilestones = 0;
    let numberOfPayBackMilestones = 0;
    let milestone = this.props.request.data.deal.milestone;
    let timelineData = {lendingTimeline: [], payBackTimeline: []};
    let lendingTimeline = [];
    let payBackTimeline = [];
    console.log('aaaaaaaaaaa', milestone);
    let milestoneTimeline = {data: '', status: '', percent: ''};
    for (let i = 0; i < milestone.length; i++) {
      const element = milestone[i];
      milestoneTimeline = {
        data: '',
        status: element.transaction.status,
        percent: '',
      };
      milestoneTimeline.data = this.formatDate(
        this.convertTimeStampToDate(element.presentDate)
      );
      milestoneTimeline.percent = element.percent;
      if (element.type === 'lend') {
        numberOfLendingMilestones++;
        lendingTimeline.push(milestoneTimeline);
      } else {
        numberOfPayBackMilestones++;
        payBackTimeline.push(milestoneTimeline);
      }
    }
    if (numberOfLendingMilestones > 2) {
      this.setState({
        isLendMany: true,
      });
    }

    if (numberOfPayBackMilestones > 2) {
      this.setState({
        isPayMany: true,
      });
    }

    timelineData.lendingTimeline = lendingTimeline;
    timelineData.payBackTimeline = payBackTimeline;
    return timelineData;
  }

  async handleDataTimeline(lendingTimeline, paybackTimeline) {
    await this.setState({
      lendingTimeline: lendingTimeline,
      paybackTimeline: paybackTimeline,
    });
    // this.createMileStone();
  }

  send_tx = () => {
    let user = localStorage.getItem('user');
    let lenderUsername = '';
    if (this.props.request.data.borrower.username !== user) {
      lenderUsername = user;
    } else {
      lenderUsername = this.props.request.data.borrower.username;
    }
    let data_transaction = {
      data_tx: {
        data: {
          //change amount later
          tx_data: {
            txId: this.state.data_tx.txId,
            sender: user,
            receiver: this.props.request.data.borrower.username,
            amountTx: this.state.data_tx.amount,
            createDate: this.state.data_tx.createDate,
          },
          deal_data: {
            //re-work
            dealId: this.props.request.data.deal.id,
            amount: this.props.request.data.amount,
            interestRate: this.props.request.data.interestRate,
            borrower: this.props.request.data.borrower.username,
            lender: lenderUsername,
            milestone: this.props.request.data.deal.milestone,
          },
        },
      },
      metadata_tx: {
        ownerTx: user,
        createDate: this.state.data_tx.createDate,
      },
    };

    fetch(bigchainAPI + '/send_tx', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data_transaction),
    })
      .then(response => response.json())
      .then(async data => {
        await this.setState({
          borrowUsername: this.props.request.data.borrower.username,
          blockchainID: data.id,
        });
        this.acceptDeal();
        this.toggleModal();
        //after success redirect to trading page
        this.saveTransaction(data, data_transaction);
      })
      .catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.setState({
          isOpenError: true,
          message: 'Cannot access to server',
        });
      });
  };

  componentDidMount() {
    this.getProfile();
    // this.generatePDF();
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    this.changeMilestoneToTimelineData();
    this.setState({
      isTrading: this.props.viewDetail.isTrading,
      isViewDetail: this.props.viewDetail.isViewDetail,
      isHistory: this.props.viewDetail.isHistory,
    });
    if (this.props.viewDetail.isHistoryDetail === false) {
      document.getElementById('saveDealButton').style.display = 'none';
    }
    fetch(
      'http://www.apilayer.net/api/live?access_key=b0346f8c3eb9232b90f3d8f63534e6f4&format=1',
      {
        method: 'GET',
      }
    )
      .then(response => response.json())
      .then(async data => {
        this.setState({
          currencyUSDVND: data.quotes.USDVND,
        });
      })
      .catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.setState({
          isOpenError: true,
          message: 'Cannot access to server',
        });
      });
  }

  convertTimeStampToDate(date) {
    var timestampToDate = new Date(date * 1000);
    return timestampToDate.toLocaleDateString();
  }

  toggleModal() {
    if(this.state.modal === true) {
      this.setState({
        modal: !this.state.modal,
        validHash: false
      });
    } else {
      this.setState({
        modal: !this.state.modal,
      });
    }
    
  }
  async makeDeal() {
    this.props.setIsHistory(false);
    await this.setState({
      editable: !this.state.editable,
      //when load data from api, set default data for edit field
      //when save deal p tags will have data, if we dont set it
      //p tags will have no data, if we doesnt change anything
      createDay: this.convertTimeStampToDate(
        this.props.request.data.createDate
      ),
      borrowDuration: this.props.request.data.duration / 30,
      // typeOfContact: 1,
      dueDay: this.convertTimeStampToDate(
        new Date().getTime() / 1000 + 86400 * this.props.request.data.duration
      ),
    });
    //button visiable and invisible
    document.getElementById('dealButton').style.display = 'none';
    if (
      this.props.request.data.borrower.username !== localStorage.getItem('user')
    ) {
      document.getElementById('acceptButton').style.display = 'none';
    }
    document.getElementById('saveDealButton').style.display = '';
  }

  saveDeal() {
    //hide save deal modal
    this.toggleSaveDealModal();

    //set UI timeline
    this.props.setIsHistory(true);
    this.setState({
      makeDealUsername: this.props.request.data.deal.user.username,
    });
    //save db
    this.saveNewDealInformationToDB();

    //set up view again
    this.setState({editable: !this.state.editable});
    //button
    document.getElementById('dealButton').style.display = 'none';
    if (
      this.props.request.data.borrower.username !== localStorage.getItem('user')
    ) {
      document.getElementById('acceptButton').style.display = 'none';
    }
    document.getElementById('saveDealButton').style.display = 'none';
  }

  onCreateDayChange(event) {
    this.setState({
      createDay: new Date(event.target.value).toLocaleDateString(),
    });
  }
  onDueDayChange(event) {
    this.setState({
      dueDay: new Date(event.target.value).toLocaleDateString(),
    });
  }

  onBorrowDurationChange(event) {
    var index = event.target.selectedIndex;
    var text = event.target[index].innerText.split(' ')[0];
    this.setState({
      borrowDuration: text,
    });
  }
  roundUp(num) {
    let precision = Math.pow(10, 2);
    return Math.ceil(num * precision) / precision;
  }
  render() {
    {
      this.validRedux();
    }
    const isHistoryDetail = this.props.viewDetail.isHistoryDetail;
    let lenderUsername = '';
    if (
      this.props.request.data.lender !== undefined &&
      this.props.request.data.lender !== null
    )
      lenderUsername = this.props.request.data.lender.username;
    else lenderUsername = '';
    let duration =
      (this.props.request.data.deal.milestone[
        this.props.request.data.deal.milestone.length - 1
      ].presentDate -
        this.props.request.data.deal.milestone[0].presentDate) /
      86400;
    return (
      <>
        <MainNavbar />
        <main className="profile-page" ref="main">
          <section className="section-profile-cover section-shaped my-0 bg-gradient-info">
            {/* Circles background */}
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
            <Container>
              <Card className="card-profile shadow mt--300">
                <div className="px-4">
                  <div className="text-center mt-5">
                    <h3>
                      <strong>Detail Request</strong>
                    </h3>
                  </div>
                  <div className="mt-5 py-5 border-top">
                    <Row className="justify-content-center">
                      <Col lg="12">
                        <Form
                          action=""
                          method="post"
                          encType="multipart/form-data"
                          className="form-horizontal"
                        >
                          <FormGroup row className="py-2">
                            <Col lg="3" md="3">
                              <Label className="h6">Borrower Name</Label>
                            </Col>
                            <Col xs="12" md="9" lg="9">
                              <p className="h6">
                                {this.props.request.data.borrower.firstName}{' '}
                                {this.props.request.data.borrower.lastName}
                              </p>
                            </Col>
                          </FormGroup>
                          <FormGroup row className="py-2">
                            <Col md="3">
                              <Label className="h6">Total amount</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <p className="h6">
                                {this.numberWithCommas(
                                  Math.round(
                                    this.props.request.data.amount +
                                      Math.round(
                                        ((((this.props.request.data.amount *
                                          duration) /
                                          30) *
                                          (this.props.request.data
                                            .interestRate /
                                            12)) /
                                          100) *
                                          1000
                                      ) /
                                        1000
                                  )
                                )}{' '}
                                VND
                              </p>
                            </Col>
                          </FormGroup>
                          <FormGroup row className="py-2">
                            <Col md="3">
                              <Label className="h6">Borrow Amount</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <p className="h6">
                                {this.numberWithCommas(
                                  this.props.request.data.amount
                                )}{' '}
                                VND
                              </p>
                            </Col>
                          </FormGroup>

                          <FormGroup row className="py-2">
                            <Col md="3">
                              <Label className="h6">Interest Rate</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <p className="h6">
                                {this.props.request.data.interestRate}% per Year
                              </p>
                            </Col>
                          </FormGroup>
                          <FormGroup row className="py-2">
                            <Col md="3">
                              <Label className="h6">Interest Received</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <p className="h6">
                                {this.numberWithCommas(
                                  Math.round(
                                    Math.round(
                                      ((((this.props.request.data.amount *
                                        duration) /
                                        30) *
                                        (this.props.request.data.interestRate /
                                          12)) /
                                        100) *
                                        1000
                                    ) / 1000
                                  )
                                )}{' '}
                                VND
                              </p>
                            </Col>
                          </FormGroup>
                          <ApplyTimeline
                            request={this.props.request}
                            amountProps={this.props.request.data.amount}
                            onDataChange={this.handleDataTimeline}
                            setTimelineData={this.changeMilestoneToTimelineData}
                            rawMilestone={
                              this.props.request.data.deal.milestone
                            }
                            isTrading={this.state.isTrading}
                            isViewDetail={this.state.isViewDetail}
                            isHistory={this.state.isHistory}
                            isLendMany={this.state.isLendMany}
                            isPayMany={this.state.isPayMany}
                            borrowerUser={
                              this.props.request.data.borrower.username !==
                              undefined
                                ? this.props.request.data.borrower.username
                                : ''
                            }
                            lenderUser={lenderUsername}
                            goToViewRequestTrading={() =>
                              this.goToViewRequestTrading()
                            }
                          />
                        </Form>
                        {isHistoryDetail ? (
                          ''
                        ) : (
                          <div>
                            <CardFooter className="text-center">
                              <Button
                                type="submit"
                                id="dealButton"
                                size="md"
                                className="btn btn-outline-primary"
                                onClick={() => this.makeDeal()}
                                disabled={this.state.editable}
                              >
                                <i className="fa fa-dot-circle-o" /> Make Deal
                              </Button>{' '}
                              <Button
                                type="submit"
                                id="saveDealButton"
                                size="md"
                                className="btn btn-outline-primary"
                                onClick={this.toggleSaveDealModal}
                                disabled={!this.state.editable}
                              >
                                <i className="ni ni-cloud-download-95" /> Save
                                Deal
                              </Button>{' '}
                              {this.props.request.data.borrower.username ===
                              localStorage.getItem('user') ? (
                                ''
                              ) : (
                                <Button
                                  type="submit"
                                  id="acceptButton"
                                  size="md"
                                  className="btn btn-outline-primary"
                                  onClick={this.toggleModal}
                                  disabled={this.state.editable}
                                >
                                  <i className="ni ni-check-bold" /> Accept
                                </Button>
                              )}
                            </CardFooter>
                            {/* save deal */}
                            <Modal
                              isOpen={this.state.saveDealModal}
                              toggle={this.toggleSaveDealModal}
                              className={this.props.className}
                            >
                              <ModalHeader toggle={this.toggleSaveDealModal}>
                                Confirm saving
                              </ModalHeader>
                              <ModalBody>
                                Are you sure to save this deal ?
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  color="primary"
                                  onClick={() => this.saveDeal()}
                                >
                                  Yes
                                </Button>{' '}
                                <Button
                                  color="secondary"
                                  onClick={this.toggleSaveDealModal}
                                >
                                  Cancel
                                </Button>
                              </ModalFooter>
                            </Modal>

                            {/* accept modal */}
                            <Modal
                              isOpen={this.state.modal}
                              toggle={this.toggleModal}
                              className={this.props.className}
                            >
                              <ModalHeader toggle={this.toggleModal}>
                                Payment
                              </ModalHeader>
                              <ModalBody>
                                {this.state.validHash === true ? (
                                  <PayPalButton
                                    amount={this.roundUp(
                                      (this.props.request.data.amount *
                                        this.props.request.data.deal
                                          .milestone[1].percent) /
                                        this.state.currencyUSDVND
                                    )}
                                    onSuccess={(details, data) => {
                                      // this.toggleModal();
                                      this.setState({
                                        data_tx: {
                                          txId: details.id,
                                          createDate: this.convertDateToTimestamp(
                                            new Date()
                                          ),
                                          status: details.status,
                                          amount:
                                            details.purchase_units[0].amount
                                              .value,
                                        },
                                      });
                                      this.send_tx();
                                    }}
                                    style={{
                                      layout: 'horizontal',
                                      shape: 'pill',
                                      disableFunding: true,
                                      tagline: false,
                                      size: 'responsive',
                                    }}
                                    options={{
                                      clientId: client_API,
                                    }}
                                  />
                                ) : (
                                  <div>
                                    <Input
                                      type="file"
                                      accept="text/plain"
                                      onChange={this.handleFileInput}
                                    />
                                    <p></p>
                                    <Button
                                      // type="submit"
                                      size="md"
                                      className="btn btn-outline-primary"
                                      onClick={() => this.validHashFile()}
                                    >
                                      Check
                                    </Button>
                                    {this.state.hashError !== '' ? (
                                      <strong
                                        class="alert alert-danger"
                                        role="alert"
                                      >
                                        {this.state.hashError}
                                      </strong>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                )}
                              </ModalBody>
                            </Modal>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card>
            </Container>
          </section>
        </main>
        <SimpleFooter />
        <Modal
          isOpen={this.state.errorModal}
          toggle={this.toggleErrorModal}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggleErrorModal}>Error</ModalHeader>
          <ModalBody>
            You already made deal please waiting for response!!
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleErrorModal}>
              OK
            </Button>{' '}
          </ModalFooter>
        </Modal>
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.isOpenSuccess}
          // toggle={() => this.toggleModal('defaultModal')}
        >
          <div className="modal-body">
            <h3 className="modal-title" id="modal-title-default">
              <img
                style={{width: 50, height: 50}}
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
                this.setState({isOpenError: false});
              }}
            >
              OK
            </Button>
          </div>
        </Modal>
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.isOpenPDF}
          // toggle={() => this.toggleModal('defaultModal')}
        >
          <div className="modal-header">Transaction information</div>
          <div className="modal-body">
            <h3 className="modal-title" id="modal-title-default">
              Milestone 1 - 2: {this.convertTimeStampToDate(this.props.request.data.deal.milestone[1].previousDate) + ' - ' + this.convertTimeStampToDate(this.props.request.data.deal.milestone[1].presentDate)}
            </h3>
            <p style={{wordBreak: 'break-all'}}>
              Transaction ID: {this.state.blockchainID}
            </p>
            <p>
              Sender:{' '}
              {this.props.request.data.borrower.username !==
              localStorage.getItem('user')
                ? localStorage.getItem('user')
                : this.props.request.data.borrower.username}
            </p>
            <p>Receiver: {this.props.request.data.borrower.username}</p>
            <p>Transaction Amount (USD): {this.state.data_tx.amount} USD</p>
            <p>
              Transaction Amount (VND):{' '}
              {this.numberWithCommas(
                this.roundUp(
                  this.props.request.data.amount *
                    this.props.request.data.deal.milestone[1].percent
                )
              )}{' '}
              VND
            </p>
            <p>
              Created Day:{' '}
              {this.convertTimeStampToDate(this.state.data_tx.createDate)}
            </p>
          </div>
          <div className="modal-footer">
            <Button
              onClick={() => {
                this.setState({isOpenPDF: false});
                this.props.history.push('/view-request-trading');
              }}
            >
              OK
            </Button>
            <Button onClick={() => this.generatePDF()}>Download Receipt</Button>
          </div>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    request: state.request,
    tokenReducer: state.tokenReducer,
    viewDetail: state.viewDetail,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setRequest: id => {
      dispatch({
        type: 'SET_REQUEST',
        payload: id,
      });
    },
    setIsTrading: status => {
      dispatch({
        type: 'SET_IS_TRADING',
        payload: status,
      });
    },
    setIsViewDetail: status => {
      dispatch({
        type: 'SET_IS_VIEWDETAIL',
        payload: status,
      });
    },
    setIsHistory: status => {
      dispatch({
        type: 'SET_IS_HISTORY',
        payload: status,
      });
    },
    setIsHistoryDetail: status => {
      dispatch({
        type: 'SET_IS_HISTORY_DETAIL',
        payload: status,
      });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDetailRequest);
