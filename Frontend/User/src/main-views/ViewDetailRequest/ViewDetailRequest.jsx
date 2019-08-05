import React from "react";
import { connect } from "react-redux";

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
  Input
} from "reactstrap";

import { PayPalButton } from "react-paypal-button-v2";
import { apiLink, bigchainAPI, client_API } from "../../api.jsx";
// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import ApplyTimeline from "../ApplyTimeline/ApplyTimeline";

import { Redirect } from "react-router-dom";

class ViewDetailRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      timeout: 300,
      editable: false,
      createDay: "",
      dueDay: "",
      borrowDuration: "",
      typeOfContact: "",
      dbDataLendingTimeline: [],
      dbDataPayBackTimeline: [],
      isTrading: false,
      isHistory: false,
      isViewDetail: false,
      data_tx: {}
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.makeDeal = this.makeDeal.bind(this);
    this.saveDeal = this.saveDeal.bind(this);
    this.onCreateDayChange = this.onCreateDayChange.bind(this);
    this.onDueDayChange = this.onDueDayChange.bind(this);
    this.onBorrowDurationChange = this.onBorrowDurationChange.bind(this);
    this.onTypeOfContactChange = this.onTypeOfContactChange.bind(this);
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
  }

  goToViewRequestTrading() {
    this.props.history.push("/view-request-trading")
  }

  convertDateToTimestamp(date) {
    return Math.round(date.getTime() / 1000);
  }

  saveTransaction(data, data_transaction) {
    console.log(data)
    console.log(data_transaction)
    console.log(this.props.request.data.deal.milestone[1].id)
    fetch(apiLink + "/rest/transaction/newTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify({
        sender: data_transaction.data_tx.data.sender,
        receiver: data_transaction.data_tx.data.receiver,
        amount: Number(data_transaction.data_tx.data.amount),
        status: data.status,
        createDate: this.convertDateToTimestamp(data_transaction.data_tx.data.createDate),
        milestone: {
          id: Number(this.props.request.data.deal.milestone[1].id)
        }
      })
    }).then(result => {
      if (result.status === 200) {
        alert("create success");
        this.props.history.push("/view-request-trading");
      } else if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      }
    });
  }

  validRedux() {
    // console.log(this.props.request.data.amount)
    console.log(Object.keys(this.props.request.data).length === 0);
    if (Object.keys(this.props.request.data).length === 0) {
      localStorage.removeItem("isLoggedIn");
      this.props.history.push("/login-page");

      // reload page to go to login page
      window.location.reload();
      // return <Redirect to='/login-page'  />
      // this.props.history.push('/path')
    }
  }
  // componentWillMount() {
  //   console.log(this.props.request.data)
  //   if (this.props.request.data.length === 0) {
  //     // localStorage.removeItem("isLoggedIn");
  //     // this.props.history.push('/login-page')
  //     // return <Redirect to='/login-page'  />
  //     // this.props.history.push('/path')
  //   }
  // }

  acceptDeal() {
    fetch(apiLink + "/rest/deal/acceptDeal", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify({
        id: this.props.request.data.deal.id,
        request: {
          borrowDate: Math.round(new Date().getTime() / 1000)
        }
      })
    }).then(result => {
      if (result.status === 200) {
        alert("create success");
        this.props.history.push("/view-request-trading");
      } else if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      }
    });
  }

  createMileStone() {
    let milestones = [];
    let milestone = {
      previousDate: "",
      presentDate: "",
      type: ""
    };
    for (let i = 0; i < this.state.lendingTimeline.length; i++) {
      const element = this.state.lendingTimeline[i];
      console.log(element);
      // console.log(new Date(element.data).getTime() / 1000)
      var dateToTimestamp = new Date(element.data).getTime() / 1000;
      milestone = {
        previousDate: "",
        presentDate: "",
        type: ""
      };
      if (i === 0) {
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = dateToTimestamp;
        milestone.type = "lend";
        console.log("Milestone 0 : " + milestone.presentDate);
        console.log("Milestone 0 : " + milestone.previousDate);
        console.log("Milestone 0 : " + milestone.type);
      } else {
        const preElement = this.state.lendingTimeline[i - 1];
        var preDateToTimestamp = new Date(preElement.data).getTime() / 1000;
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = preDateToTimestamp;
        milestone.type = "lend";
        console.log("Milestone " + i + " : " + milestone.presentDate);
        console.log("Milestone " + i + " : " + milestone.previousDate);
        console.log("Milestone " + i + " : " + milestone.type);
      }
      // console.log(milestone);
      milestones.push(milestone);
    }
    for (let i = 0; i < this.state.paybackTimeline.length; i++) {
      const element = this.state.paybackTimeline[i];

      // console.log(new Date(element.data).getTime() / 1000)
      var dateToTimestamp = new Date(element.data).getTime() / 1000;
      milestone = {
        previousDate: "",
        presentDate: "",
        type: ""
      };
      if (i === 0) {
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = dateToTimestamp;
        milestone.type = "payback";
        console.log("Milestone 0 : " + milestone.presentDate);
        console.log("Milestone 0 : " + milestone.previousDate);
        console.log("Milestone 0 : " + milestone.type);
      } else {
        const preElement = this.state.paybackTimeline[i - 1];
        var preDateToTimestamp = new Date(preElement.data).getTime() / 1000;
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = preDateToTimestamp;
        milestone.type = "payback";
        console.log("Milestone " + i + " : " + milestone.presentDate);
        console.log("Milestone " + i + " : " + milestone.previousDate);
        console.log("Milestone " + i + " : " + milestone.type);
      }
      // console.log(milestone);
      milestones.push(milestone);
    }
    console.log(milestones);
    return milestones;
  }

  saveNewDealInformationToDB() {
    console.log(this.state.lendingTimeline);
    console.log(this.state.paybackTimeline);
    // console.log( this.state.lendingTimeline.length)
    // console.log( this.state.paybackTimeline.length)

    //     console.log( this.createMileStone())
    fetch(apiLink + "/rest/deal/makeDeal", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify({
        id: this.props.request.data.deal.id,
        borrowTime: this.state.lendingTimeline.length,
        paybackTime: this.state.paybackTimeline.length,
        milestone: this.createMileStone()
      })
    }).then(result => {
      console.log(result);
      if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      } else if (result.status === 200) {
        // alert("create success");
        console.log("success");
      }
    });
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  changeMilestoneToTimelineData() {
    console.log(this.props.request.data.deal.milestone);
    let milestone = this.props.request.data.deal.milestone;
    let timelineData = { lendingTimeline: [], payBackTimeline: [] };
    let lendingTimeline = [];
    let payBackTimeline = [];
    let milestoneTimeline = { data: "", status: "" };
    for (let i = 0; i < milestone.length; i++) {
      const element = milestone[i];
      milestoneTimeline = { data: "", status: "" };
      milestoneTimeline.data = this.formatDate(
        this.convertTimeStampToDate(element.presentDate)
      );
      milestoneTimeline.status = "data is nothing";
      if (element.type === "lend") {
        lendingTimeline.push(milestoneTimeline);
      } else {
        payBackTimeline.push(milestoneTimeline);
      }
    }
    timelineData.lendingTimeline = lendingTimeline;
    timelineData.payBackTimeline = payBackTimeline;
    console.log(lendingTimeline);
    console.log(payBackTimeline);
    // this.setState({
    //   dbDataLendingTimeline: lendingTimeline,
    //   dbDataPayBackTimeline: payBackTimeline
    // })
    // console.log(timelineData);
    return timelineData;
  }

  async handleDataTimeline(lendingTimeline, paybackTimeline) {
    await this.setState({
      lendingTimeline: lendingTimeline,
      paybackTimeline: paybackTimeline
    });
    // console.log("aaaaTimeline")
    console.log(this.state.lendingTimeline);
    console.log(this.state.paybackTimeline);
    // this.createMileStone();
  }

  send_tx = () => {
    // http://capstone.ppls.cf:5000/search_transaction_by_metadata
    // let numberOfTransaction = 0;
    let user = localStorage.getItem("user");
    // fetch(bigchainAPI + "/search_transaction_by_metadata", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     userId: user
    //   })
    // }).then(result => {
    //   result.json().then(data => {
    //     numberOfTransaction = data.length;
    //     console.log(numberOfTransaction);
    //     console.log(data.length);
    //   });
    // });

    let data_transaction = {
      data_tx: {
        data: {
          //change amount later
          txId: this.state.data_tx.txId,
          sender: user,
          receiver: this.props.request.data.borrower.username,
          amount: this.state.data_tx.amount,
          createDate: this.state.data_tx.createDate
        }
      },
      metadata_tx: {
        // userId: this.state.userId,
        // createDate: this.state.createDate
        userId: user,
        createDate: this.state.data_tx.createDate
      }
    };

    fetch(bigchainAPI + "/send_tx", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data_transaction)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.acceptDeal();
        this.saveTransaction(data, data_transaction);
      });
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    this.changeMilestoneToTimelineData();
    this.setState({
      isTrading: this.props.viewDetail.isTrading,
      isViewDetail: this.props.viewDetail.isViewDetail,
      isHistory: this.props.viewDetail.isHistory
    });
    if (this.props.viewDetail.isHistoryDetail === false) {
      document.getElementById("saveDealButton").style.display = "none";
    }

    document.getElementById("duration").style.display = "none";
    document.getElementById("dueDay").style.display = "none";
  }
  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  convertTimeStampToDate(date) {
    var timestampToDate = new Date(date * 1000);
    return timestampToDate.toLocaleDateString();
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
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
      )
    });
    //button visiable and invisible
    document.getElementById("dealButton").style.display = "none";
    document.getElementById("acceptButton").style.display = "none";
    document.getElementById("saveDealButton").style.display = "";

    //display field to edit data
    // document.getElementById("createDay").style.display = "";
    document.getElementById("duration").style.display = "";
    document.getElementById("dueDay").style.display = "";

    //hidden p tags
    // document.getElementById("createDayText").style.display = "none";
    document.getElementById("durationText").style.display = "none";
    document.getElementById("dueDateText").style.display = "none";

    //select default value
    // document.getElementById("createDay").value = this.formatDate(this.state.createDay);
    document.getElementById("dueDay").value = this.formatDate(
      this.state.dueDay
    );
    // document.getElementById("createDay").value = this.convertTimeStampToDate(this.state.createDay);
    // document.getElementById("dueDay").value = this.convertTimeStampToDate(this.state.dueDay);
    document.getElementById("duration").value = this.state.borrowDuration;
  }

  saveDeal() {
    //set UI timeline
    this.props.setIsHistory(true);

    //save db
    this.saveNewDealInformationToDB();

    //set up view again
    this.setState({ editable: !this.state.editable });
    //button
    document.getElementById("dealButton").style.display = "";
    document.getElementById("acceptButton").style.display = "none";
    document.getElementById("saveDealButton").style.display = "none";

    //hidden field to edit data
    // document.getElementById("createDay").style.display = "none";
    document.getElementById("duration").style.display = "none";
    document.getElementById("dueDay").style.display = "none";

    //display p tags
    // document.getElementById("createDayText").style.display = "";
    document.getElementById("durationText").style.display = "";
    document.getElementById("dueDateText").style.display = "";

    // document.getElementById("createDayText").innerHTML = this.state.createDay;
    if (this.state.borrowDuration < 12) {
      document.getElementById("durationText").innerHTML =
        this.state.borrowDuration * 30 + " days";
    } else {
      document.getElementById("durationText").innerHTML =
        this.state.borrowDuration + " days";
    }
    document.getElementById("dueDateText").innerHTML = this.state.dueDay;
  }

  onCreateDayChange(event) {
    this.setState({
      createDay: new Date(event.target.value).toLocaleDateString()
    });
  }
  onDueDayChange(event) {
    this.setState({
      dueDay: new Date(event.target.value).toLocaleDateString()
    });
  }

  onBorrowDurationChange(event) {
    var index = event.target.selectedIndex;
    var text = event.target[index].innerText.split(" ")[0];
    this.setState({
      borrowDuration: text
    });
  }

  onTypeOfContactChange(event) {
    this.setState({
      typeOfContact: event.target.value
    });
  }

  render() {
    const isHistoryDetail = this.props.viewDetail.isHistoryDetail;
    return (
      <>
        {this.validRedux()}
        <DemoNavbar />
        <main className="profile-page" ref="main">
          <section className="section-profile-cover section-shaped my-0">
            {/* Circles background */}
            <div className="shape shape-style-1 shape-default alpha-4">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
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
                                {this.props.request.data.borrower.firstName}{" "}
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
                                {this.props.request.data.amount +
                                  (this.props.request.data.amount *
                                    (this.props.request.data.duration / 30) *
                                    1.5) /
                                    100}{" "}
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
                                {this.props.request.data.amount} VND
                              </p>
                            </Col>
                          </FormGroup>
                          <FormGroup row className="py-2">
                            <Col md="3">
                              <Label className="h6">Borrow Duration</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <p className="h6" id="durationText">
                                {this.props.request.data.duration} days
                              </p>
                              <Input
                                type="select"
                                name="duration"
                                id="duration"
                                style={{
                                  width: "30%"
                                }}
                                disabled={!this.state.editable}
                                onChange={this.onBorrowDurationChange}
                              >
                                <option value="0">Please select</option>
                                <option value="1">30 days</option>
                                <option value="2">60 days</option>
                                <option value="3">90 days</option>
                                <option value="12">1 Years(360 days)</option>
                              </Input>
                            </Col>
                          </FormGroup>
                          <FormGroup row className="py-2">
                            <Col md="4">
                              <Label className="h6">Borrow Day</Label>
                            </Col>
                            <Col md="4">
                              <Label className="h6">Create Day</Label>
                            </Col>
                            <Col md="4">
                              <Label className="h6">Due Day</Label>
                            </Col>
                          </FormGroup>

                          <FormGroup row className="py-2">
                            {this.props.request.data.borrowDate ? (
                              <Col md="4">
                                <p
                                  className="h6"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: "100%"
                                  }}
                                  id="createDayText"
                                >
                                  {this.convertTimeStampToDate(
                                    this.props.request.data.borrowDate
                                  )}
                                </p>
                              </Col>
                            ) : (
                              <Col md="4">
                                <p
                                  className="h6"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: "100%"
                                  }}
                                  id="createDayText"
                                >
                                  {" "}
                                  Not Yet
                                </p>
                              </Col>
                            )}
                            <Col md="4">
                              <p
                                className="h6"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  height: "100%"
                                }}
                                id="borrowDayText"
                              >
                                {this.convertTimeStampToDate(
                                  this.props.request.data.createDate
                                )}
                              </p>
                              {/* <Input
                                id="borrowDay"
                                type="date"
                                disabled={!this.state.editable}
                                // onChange={this.onCreateDayChange}
                              /> */}
                            </Col>
                            <Col md="4">
                              <p className="h6" id="dueDateText">
                                {this.convertTimeStampToDate(
                                  new Date().getTime() / 1000 +
                                    86400 * this.props.request.data.duration
                                )}
                              </p>
                              <Input
                                id="dueDay"
                                type="date"
                                style={{
                                  width: "80%"
                                }}
                                disabled={!this.state.editable}
                                onChange={this.onDueDayChange}
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup row className="py-2">
                            <Col md="3">
                              <Label className="h6">Interest Rate</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <p className="h6">18% per Year</p>
                            </Col>
                          </FormGroup>
                          <FormGroup row className="py-2">
                            <Col md="3">
                              <Label className="h6">Interest Received</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <p className="h6">
                                {Math.round(
                                  ((this.props.request.data.amount *
                                    (this.props.request.data.duration / 30) *
                                    1.5) /
                                    100) *
                                    1000
                                ) / 1000}{" "}
                                VND
                              </p>
                            </Col>
                          </FormGroup>
                          <ApplyTimeline
                            onDataChange={this.handleDataTimeline}
                            setTimelineData={this.changeMilestoneToTimelineData}
                            rawMilestone={
                              this.props.request.data.deal.milestone
                            }
                            isTrading={this.state.isTrading}
                            isViewDetail={this.state.isViewDetail}
                            isHistory={this.state.isHistory}
                            borrowerUser={this.props.request.data.borrower.username}
                            goToViewRequestTrading={() => this.goToViewRequestTrading()}
                          />
                        </Form>
                        {isHistoryDetail ? (
                          ""
                        ) : (
                          <div>
                            <CardFooter className="text-center">
                              <Button
                                type="submit"
                                id="dealButton"
                                size="md"
                                color="primary"
                                onClick={() => this.makeDeal()}
                                disabled={this.state.editable}
                              >
                                <i className="fa fa-dot-circle-o" /> Make Deal
                              </Button>{" "}
                              <Button
                                type="submit"
                                id="saveDealButton"
                                size="md"
                                color="primary"
                                onClick={() => this.saveDeal()}
                                disabled={!this.state.editable}
                              >
                                <i className="fa fa-dot-circle-o" /> Save Deal
                              </Button>{" "}
                              <Button
                                type="submit"
                                id="acceptButton"
                                size="md"
                                color="primary"
                                onClick={this.toggleModal}
                                disabled={this.state.editable}
                              >
                                <i className="fa fa-dot-circle-o" /> Accept
                              </Button>{" "}
                            </CardFooter>
                            <Modal
                              isOpen={this.state.modal}
                              toggle={this.toggleModal}
                              className={this.props.className}
                            >
                              <ModalHeader toggle={this.toggleModal}>
                                Xac Nhan yeu cau vay muon
                              </ModalHeader>
                              <ModalBody>
                                Ban co chac chan se chap nhan yeu cau nay khong
                              </ModalBody>
                              <ModalFooter>
                                <PayPalButton
                                  amount={12}
                                  onSuccess={(details, data) => {
                                    this.setState({
                                      data_tx: {
                                        txId: details.id,
                                        createDate: new Date,
                                        status: details.status,
                                        amount:
                                          details.purchase_units[0].amount.value
                                      }
                                    });
                                    this.send_tx();
                                  }}
                                  style={{
                                    layout: "horizontal",
                                    shape: "pill",
                                    disableFunding: true,
                                    tagline: false,
                                    size: "responsive"
                                  }}
                                  options={{
                                    clientId: client_API
                                  }}
                                />
                                <Button
                                  color="primary"
                                  onClick={this.toggleModal}
                                >
                                  Yes
                                </Button>{" "}
                                <Button
                                  color="secondary"
                                  onClick={this.toggleModal}
                                >
                                  Cancel
                                </Button>
                              </ModalFooter>
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
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    request: state.request,
    tokenReducer: state.tokenReducer,
    viewDetail: state.viewDetail
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setRequest: id => {
      dispatch({
        type: "SET_REQUEST",
        payload: id
      });
    },
    setIsTrading: status => {
      dispatch({
        type: "SET_IS_TRADING",
        payload: status
      });
    },
    setIsViewDetail: status => {
      dispatch({
        type: "SET_IS_VIEWDETAIL",
        payload: status
      });
    },
    setIsHistory: status => {
      dispatch({
        type: "SET_IS_HISTORY",
        payload: status
      });
    },
    setIsHistoryDetail: status => {
      dispatch({
        type: "SET_IS_HISTORY_DETAIL",
        payload: status
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDetailRequest);
