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

class ViewDetailRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      timeout: 300,
      editable: false,
      borrowDay: "",
      dueDay: "",
      borrowDuration: "",
      typeOfContact: "",
      dbDataLendingTimeline: [],
      dbDataPayBackTimeline: []
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.makeDeal = this.makeDeal.bind(this);
    this.saveDeal = this.saveDeal.bind(this);
    this.onBorrowDayChange = this.onBorrowDayChange.bind(this);
    this.onDueDayChange = this.onDueDayChange.bind(this);
    this.onBorrowDurationChange = this.onBorrowDurationChange.bind(this);
    this.onTypeOfContactChange = this.onTypeOfContactChange.bind(this);
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.handleDataTimeline = this.handleDataTimeline.bind(this);
    this.changeMilestoneToTimelineData = this.changeMilestoneToTimelineData.bind(
      this
    );
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
      milestoneTimeline.data = this.formatDate(this.convertTimeStampToDate(element.presentDate));
      milestoneTimeline.status = "data is nothing";
      if (element.type === "lend") {
        lendingTimeline.push(milestoneTimeline);
      } else {
        payBackTimeline.push(milestoneTimeline);
      }
    }
    timelineData.lendingTimeline = lendingTimeline;
    timelineData.payBackTimeline = payBackTimeline;
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
    let data_tx = {
      data_tx: {
        data: {
          // txId: this.state.txId,
          // sender: this.state.sender,
          // receiver: this.state.receiver,
          // amount: this.state.amount,
          // createDate: this.state.createDate
          txId: "this.state.txId",
          sender: "this.state.sender",
          receiver: "this.state.receiver",
          amount: 12,
          createDate: "this.state.createDate"
        }
      },
      metadata_tx: {
        // userId: this.state.userId,
        // createDate: this.state.createDate
        userId: "this.state.userId",
        createDate: "this.state.createDate"
      }
    };
    fetch(bigchainAPI + "/send_tx", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data_tx)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      });
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

    this.changeMilestoneToTimelineData();

    //change timestamp to date String and vice versa
    // var date = "07/22/2018";
    // var dateToTimestamp = Math.round(new Date(date).getTime() / 1000);
    // console.log("getTime 22/7/2018: " + dateToTimestamp);
    // var timestampToDate = new Date(dateToTimestamp * 1000);
    // console.log("day 22/7/2018: " + timestampToDate);

    // dateToTimestamp = dateToTimestamp + (86400 * 30);
    // console.log("getTime 21/8/2018: " + dateToTimestamp);
    // var timestampToDate2 = new Date(dateToTimestamp * 1000);
    // console.log("day 21/8/2018: " + timestampToDate2);

    // var timestampToDate = new Date(dateToTimestamp * 1000);

    // console.log("dateToTimestamp: " + dateToTimestamp);
    // console.log("timestampToDate: " +timestampToDate.toLocaleDateString())

    // document.getElementById("borrowDay").value = "2014-02-09";
    // document.getElementById("dueDay").value = "2014-02-09";
    // document.getElementById("borrowDay").value = this.convertTimeStampToDate(this.props.request.data.amount);
    // document.getElementById("dueDay").value = "2014-02-09";
    document.getElementById("saveDealButton").style.display = "none";
    // document.getElementById("duration").value = 1;
    document.getElementById("borrowDay").style.display = "none";
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

  // testdaytime() {

  // }

  async makeDeal() {
    await this.setState({
      editable: !this.state.editable,
      //when load data from api, set default data for edit field
      //when save deal p tags will have data, if we dont set it
      //p tags will have no data, if we doesnt change anything
      borrowDay: "2014-02-09",
      borrowDuration: this.props.request.data.duration / 30,
      // typeOfContact: 1,
      dueDay: "2014-02-09"
    });
    //button visiable and invisible
    document.getElementById("dealButton").style.display = "none";
    document.getElementById("acceptButton").style.display = "none";
    document.getElementById("saveDealButton").style.display = "";

    //display field to edit data
    document.getElementById("borrowDay").style.display = "";
    document.getElementById("duration").style.display = "";
    document.getElementById("dueDay").style.display = "";

    //hidden p tags
    document.getElementById("borrowDayText").style.display = "none";
    document.getElementById("durationText").style.display = "none";
    document.getElementById("dueDateText").style.display = "none";

    //select default value
    document.getElementById("borrowDay").value = this.state.borrowDay;
    document.getElementById("dueDay").value = this.state.dueDay;
    // document.getElementById("borrowDay").value = this.convertTimeStampToDate(this.state.borrowDay);
    // document.getElementById("dueDay").value = this.convertTimeStampToDate(this.state.dueDay);
    document.getElementById("duration").value = this.state.borrowDuration;
  }

  saveDeal() {
    this.setState({ editable: !this.state.editable });
    //button
    document.getElementById("dealButton").style.display = "";
    document.getElementById("acceptButton").style.display = "";
    document.getElementById("saveDealButton").style.display = "none";

    //hidden field to edit data
    document.getElementById("borrowDay").style.display = "none";
    document.getElementById("duration").style.display = "none";
    document.getElementById("dueDay").style.display = "none";

    //display p tags
    document.getElementById("borrowDayText").style.display = "";
    document.getElementById("durationText").style.display = "";
    document.getElementById("dueDateText").style.display = "";

    document.getElementById("borrowDayText").innerHTML = this.state.borrowDay;
    if (this.state.borrowDuration < 12) {
      document.getElementById("durationText").innerHTML =
        this.state.borrowDuration * 30 + " days";
    } else {
      document.getElementById("durationText").innerHTML =
        this.state.borrowDuration + " days";
    }
    document.getElementById("dueDateText").innerHTML = this.state.dueDay;
  }

  onBorrowDayChange(event) {
    this.setState({
      borrowDay: new Date(event.target.value).toLocaleDateString()
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
    return (
      <>
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
                            <Col md="4">
                              <Label className="h6">Borrow Duration</Label>
                            </Col>
                            <Col md="4">
                              <Label className="h6">Borrow Day</Label>
                            </Col>
                            <Col md="4">
                              <Label className="h6">Due Day</Label>
                            </Col>
                          </FormGroup>
                          <FormGroup row className="py-2">
                            <Col md="4">
                              <p className="h6" id="durationText">
                                {this.props.request.data.duration} days
                              </p>
                              <Input
                                type="select"
                                name="duration"
                                id="duration"
                                disabled={!this.state.editable}
                                onChange={this.onBorrowDurationChange}
                              >
                                <option value="0">Please select</option>
                                <option value="1">30 days</option>
                                <option value="2">60 days</option>
                                <option value="2">90 days</option>
                                <option value="12">1 Years(360 days)</option>
                              </Input>
                            </Col>
                            <Col md="4">
                              <p className="h6" id="borrowDayText">
                                {this.convertTimeStampToDate(
                                  this.props.request.data.borrowDate
                                )}
                              </p>
                              <Input
                                id="borrowDay"
                                type="date"
                                disabled={!this.state.editable}
                                onChange={this.onBorrowDayChange}
                              />
                            </Col>
                            <Col md="4">
                              <p className="h6" id="dueDateText">
                                {this.convertTimeStampToDate(
                                  this.props.request.data.borrowDate +
                                    86400 * this.props.request.data.duration
                                )}
                              </p>
                              <Input
                                id="dueDay"
                                type="date"
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
                            rawMilestone={this.props.request.data.deal.milestone}
                          />
                          {/* <FormGroup>
                            <Col lg="12">
                              <h5 className="h5 text-success font-weight-bold mb-4">
                                TimeLine
                              </h5>
                              <div className="progress-wrapper">
                                <div className="progress-info">
                                  <div className="progress-label">
                                    <span>Task completed</span>
                                  </div>
                                  <div className="progress-percentage">
                                    <span>40%</span>
                                  </div>
                                </div>
                                <Progress max="100" value="25" color="default" />
                              </div>
                              <div className="progress-wrapper">
                                <div className="progress-info">
                                  <div className="progress-label">
                                    <span>Task completed</span>
                                  </div>
                                  <div className="progress-percentage">
                                    <span>60%</span>
                                  </div>
                                </div>
                                <Progress max="100" value="60" />
                              </div>
                            </Col>
                          </FormGroup> */}
                        </Form>
                        <CardFooter className="text-center">
                          <Button
                            type="submit"
                            id="dealButton"
                            size="md"
                            color="primary"
                            onClick={this.makeDeal}
                            disabled={this.state.editable}
                          >
                            <i className="fa fa-dot-circle-o" /> Make Deal
                          </Button>{" "}
                          <Button
                            type="submit"
                            id="saveDealButton"
                            size="md"
                            color="primary"
                            onClick={this.saveDeal}
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
                                  txId: details.id,
                                  createDate: details.create_time,
                                  status: details.status,
                                  amount: details.purchase_units[0].amount.value
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
                            <Button color="primary" onClick={this.toggleModal}>
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
    tokenReducer: state.tokenReducer
  };
};

export default connect(mapStateToProps)(ViewDetailRequest);
