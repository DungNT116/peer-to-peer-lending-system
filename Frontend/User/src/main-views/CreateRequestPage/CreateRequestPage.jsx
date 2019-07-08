import React from "react";
import ReactDOM from "react-dom";

// nodejs library that concatenates classes
import classnames from "classnames";
import { connect } from 'react-redux';
// reactstrap components
import {
  Card,
  CardBody,
  FormGroup,
  Input,
  InputGroup,
  Container,
  Row,
  Col,
  Label,
  Form,
  Button
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import ApplyTimeline from "../ApplyTimeline/ApplyTimeline.jsx";

//api link
import { apiLink } from '../../api.jsx';
import SimpleFooter from "components/Footers/SimpleFooter";

const textVerticalCenter = {
  display: 'flex',
  alignItems: 'center',
  height: '100%'
}
class CreateRequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      borrowDuration: '',
      interestRate: '',
      createDate: '',
      lendingTimeline: [],
      paybackTimeline: [],
      validAmount: false
    }

    this.onAmountChange = this.onAmountChange.bind(this);
    this.onBorrowDurationChange = this.onBorrowDurationChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDataTimeline = this.handleDataTimeline.bind(this);
    this.createMileStone = this.createMileStone.bind(this);
  }

  createMileStone() {
    let milestones = [];
    let milestone = {
      previousDate: '',
      presentDate: '',
      percent: '',
      type: '',

    }
    for (let i = 0; i < this.state.lendingTimeline.length; i++) {
      const element = this.state.lendingTimeline[i];
      console.log(element)
      // console.log(new Date(element.data).getTime() / 1000)
      var dateToTimestamp = new Date(element.data).getTime() / 1000;
      milestone = {
        previousDate: '',
        presentDate: '',
        percent: '',
        type: ''
      }
      if (i === 0) {
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = dateToTimestamp;
        milestone.type = "lend";
        milestone.percent = element.percent;
        console.log("Milestone 0 : " + milestone.percent);
        console.log("Milestone 0 : " + milestone.presentDate);
        console.log("Milestone 0 : " + milestone.previousDate);
        console.log("Milestone 0 : " + milestone.type);
      } else {
        const preElement = this.state.lendingTimeline[i - 1];
        var preDateToTimestamp = new Date(preElement.data).getTime() / 1000;
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = preDateToTimestamp;
        milestone.type = "lend";
        milestone.percent = element.percent;
        console.log("Milestone 0 : " + milestone.percent);
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
        previousDate: '',
        presentDate: '',
        percent: '',
        type: ''
      }
      if (i === 0) {
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = dateToTimestamp;
        milestone.type = "payback";
        milestone.percent = element.percent;
        console.log("Milestone 0 : " + milestone.percent);
        console.log("Milestone 0 : " + milestone.presentDate);
        console.log("Milestone 0 : " + milestone.previousDate);
        console.log("Milestone 0 : " + milestone.type);
      } else {
        const preElement = this.state.paybackTimeline[i - 1];
        var preDateToTimestamp = new Date(preElement.data).getTime() / 1000;
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = preDateToTimestamp;
        milestone.type = "payback";
        milestone.percent = element.percent;
        console.log("Milestone 0 : " + milestone.percent);
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

  async handleDataTimeline(lendingTimeline, paybackTimeline) {
    await this.setState({
      lendingTimeline: lendingTimeline,
      paybackTimeline: paybackTimeline
    });
    // console.log("aaaaTimeline")
    console.log(this.state.lendingTimeline)
    console.log(this.state.paybackTimeline)
    // this.createMileStone();
  }

  onAmountChange(event) {
    const tmp = event.target.value.trim();
    console.log(tmp);
    if (!tmp.match(/^(\d{1,12})*$/)) {
      document.getElementById("amountError").innerHTML = "amount only contain number ";
      this.setState({
        amount: Number(tmp),
        validAmount: false
      });
    } else {
      document.getElementById("amountError").innerHTML = "";
      this.setState({
        amount: tmp,
        validAmount: true
      });
    }
  }

  onBorrowDurationChange(event) {
    var index = event.target.selectedIndex;
    var text = event.target[index].innerText.split(" ")[0];
    this.setState({
      borrowDuration: text,
    })
  }

  handleSubmit(event) {
    console.log(this.state.validAmount)
    if (this.state.validAmount === true) {
      fetch(apiLink + "/rest/request/createRequest", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
          // "Authorization": this.props.tokenReducer.token
          // 'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          // borrowerName: this.state.borrowerName,
          amount: this.state.amount,
          // dueDate: 125666,
          // times: 5,
          duration: this.state.borrowDuration,
          interestRate: 18,
          createDate: this.state.createDate,
          deal: {
            borrowTime: this.state.lendingTimeline.length,
            paybackTime: this.state.paybackTimeline.length,
            milestone: this.createMileStone()
          }
        })

      }).then(
        (result) => {
          if (result.status === 200) {
            alert("create success");
            this.props.history.push('view-new-request');
          } else if (result.status === 401) {
            localStorage.removeItem("isLoggedIn");
            this.props.history.push('/login-page')
          }
        }
      )
    }
    event.preventDefault();
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    var dateNow = new Date();
    var timeStampeDateNow = Math.round(dateNow.getTime() / 1000);
    this.setState({
      createDate: timeStampeDateNow
    })
    this.props.setIsHistory(false);
    this.props.setIsViewDetail(true);
    this.props.setIsHistoryDetail(false);
  }
  render() {

    return (
      <>
        <DemoNavbar />
        <main ref="main">
          <div className="position-relative">
            {/* shape Hero */}
            <section className="section section-lg section-shaped">
              <div className="shape shape-style-1 shape-default">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <Container className="py-lg-md d-flex">
                <div className="col px-0">
                  <Row>
                    <Col lg="10">
                      <h1 className="display-3 text-white">
                        Create Lending Request{" "}
                        <span>create your own request</span>
                      </h1>
                      <p className="lead text-white">
                        create borrow request more easier. Every where, every times, ...
                      </p>
                    </Col>
                  </Row>
                </div>
              </Container>
            </section>
            {/* 1st Hero Variation */}
          </div>

          <section className="section">
            <Container>
              <Card className="card-profile shadow mt--200">
                {/* <div className="px-4"> */}
                <Row className="justify-content-center ">
                  <Col>
                    <h2 className="display-3 text-center">Create your request</h2>
                    <Card className="bg-gradient-secondary shadow">
                      <CardBody className="p-lg-5">
                        <h4 className="mb-1 text-center mb-5">Fill your information into the form</h4>
                        <Form role="form" onSubmit={this.handleSubmit}>
                          <FormGroup row
                            className={classnames({
                              focused: this.state.amountFocused
                            })}
                          >
                            <Col lg="3" md="3">
                              <Label htmlFor="amount" style={textVerticalCenter}>
                                Amount
                            </Label>
                            </Col>
                            <Col lg="9" md="9">
                                <Input
                                  name="amount"
                                  placeholder="Amount"
                                  type="text"
                                  onFocus={e => this.setState({ amountFocused: true })}
                                  onBlur={e => this.setState({ amountFocused: false })}
                                  onChange={this.onAmountChange}
                                  required
                                />
                              <p id="amountError"></p>
                            </Col>
                          </FormGroup>
                          <FormGroup row className={classnames({
                            focused: this.state.durationFocused
                          })}>
                            <Col lg="3" md="3">
                              <Label htmlFor="duration" style={textVerticalCenter}>Borrow Duration</Label>
                            </Col>
                            <Col lg="9" md="9">
                                <Input type="select" name="duration" id="duration"
                                  onFocus={e => this.setState({ durationFocused: true })}
                                  onBlur={e => this.setState({ durationFocused: false })}
                                  onChange={this.onBorrowDurationChange} required defaultValue="">
                                  <option value="" disabled>Please select</option>
                                  <option value="1">30 days</option>
                                  <option value="2">90 days</option>
                                  <option value="3">1 Years(365 days)</option>
                                </Input>
                              <p id="durationError"></p>
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Col lg="3" md="3">
                              <Label htmlFor="interestedRate" style={textVerticalCenter}>
                                Interest rate
                          </Label>
                            </Col>
                            <Col lg="9" md="9">
                                <Input
                                  name="interestedRate"
                                  type="text"
                                  disabled
                                  value="18% per year"
                                />
                            </Col>
                          </FormGroup>
                          <ApplyTimeline 
                            onDataChange={this.handleDataTimeline}></ApplyTimeline>
                          <div className="text-center my-4">
                            {/* <Input type="submit" value="Send" /> */}
                            <Button type="submit" size="md" color="primary">Create Request</Button>
                          </div>

                        </Form>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                {/* </div> */}
              </Card>
            </Container>
          </section>
        </main>
        <SimpleFooter />
      </>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    request: state.request,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setRequest: (id) => {
      dispatch({
        type: "SET_REQUEST",
        payload: id
      });
    },
    setIsTrading: (status) => {
      dispatch({
        type: "SET_IS_TRADING",
        payload: status
      });
    },
    setIsViewDetail: (status) => {
      dispatch({
        type: "SET_IS_VIEWDETAIL",
        payload: status
      });
    },
    setIsHistory: (status) => {
      dispatch({
        type: "SET_IS_HISTORY",
        payload: status
      });
    },
    setIsHistoryDetail: (status) => {
      dispatch({
        type: "SET_IS_HISTORY_DETAIL",
        payload: status
      });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRequestPage);
