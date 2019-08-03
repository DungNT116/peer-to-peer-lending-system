import React from "react";

// nodejs library that concatenates classes
import classnames from "classnames";
import { connect } from "react-redux";
// reactstrap components
import {
  Card,
  CardBody,
  FormGroup,
  Input,
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
import { apiLink } from "../../api.jsx";
import SimpleFooter from "components/Footers/SimpleFooter";
import Cleave from "cleave.js/react";
const textVerticalCenter = {
  display: "flex",
  alignItems: "center",
  height: "100%"
};
class CreateRequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      borrowDuration: "",
      interestRate: "",
      createDate: "",
      lendingTimeline: [],
      paybackTimeline: [],
      invalidAmount: true,
      errorAmount: "",
      maxloadlimit: 0
      // invalidLoanLimit: true
    };

    this.onAmountChange = this.onAmountChange.bind(this);
    this.onBorrowDurationChange = this.onBorrowDurationChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDataTimeline = this.handleDataTimeline.bind(this);
    this.createMileStone = this.createMileStone.bind(this);
    this.onAmountCleaveChange = this.onAmountCleaveChange.bind(this);
    this.onCreditCardFocus = this.onCreditCardFocus.bind(this);
    this.checkLoanLimit = this.checkLoanLimit.bind(this);
  }

  checkLoanLimit() {
    if (this.state.maxloadlimit > 0) {
      // this.setState({
      //   invalidLoanLimit: false
      // })
      return false;
    } else {
      alert("your loan limit is not enough to use this function");
      return true;
    }
  }

  formatCurrency(number) {
    let count = 0;
    let tmpString = "";
    if (number.length > 3) {
      for (let i = number.length; i > 0; i--) {
        const element = number[i - 1];
        if (count === 3 && i !== number.length) {
          count = 0;
          tmpString += "," + element;
        } else if (count !== 3) {
          tmpString += element;
        }
        count++;
      }
    }

    let output = "";
    for (let i = tmpString.length; i > 0; i--) {
      const element = tmpString[i - 1];
      output += element;
    }
    return output;
  }

  createMileStone() {
    let milestones = [];
    let milestone = {
      previousDate: "",
      presentDate: "",
      percent: "",
      type: ""
    };
    for (let i = 0; i < this.state.lendingTimeline.length; i++) {
      const element = this.state.lendingTimeline[i];
      // console.log(new Date(element.data).getTime() / 1000)
      var dateToTimestamp = new Date(element.data).getTime() / 1000;
      milestone = {
        previousDate: "",
        presentDate: "",
        percent: "",
        type: ""
      };
      if (i === 0) {
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = dateToTimestamp;
        milestone.type = "lend";
        milestone.percent = element.percent;
      } else {
        const preElement = this.state.lendingTimeline[i - 1];
        var preDateToTimestamp = new Date(preElement.data).getTime() / 1000;
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = preDateToTimestamp;
        milestone.type = "lend";
        milestone.percent = element.percent;
      }
      milestones.push(milestone);
    }
    for (let i = 0; i < this.state.paybackTimeline.length; i++) {
      const element = this.state.paybackTimeline[i];

      // console.log(new Date(element.data).getTime() / 1000)
      var dateToTimestamp = new Date(element.data).getTime() / 1000;
      milestone = {
        previousDate: "",
        presentDate: "",
        percent: "",
        type: ""
      };
      if (i === 0) {
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = dateToTimestamp;
        milestone.type = "payback";
        milestone.percent = element.percent;
      } else {
        const preElement = this.state.paybackTimeline[i - 1];
        var preDateToTimestamp = new Date(preElement.data).getTime() / 1000;
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = preDateToTimestamp;
        milestone.type = "payback";
        milestone.percent = element.percent;
      }
      milestones.push(milestone);
    }
    return milestones;
  }

  async handleDataTimeline(lendingTimeline, paybackTimeline) {
    await this.setState({
      lendingTimeline: lendingTimeline,
      paybackTimeline: paybackTimeline
    });
  }

  onAmountChange(event, maskedvalue, floatvalue) {
    this.setState({
      amount: maskedvalue
    });
  }

  onBorrowDurationChange(event) {
    var index = event.target.selectedIndex;
    var text = event.target[index].innerText.split(" ")[0];
    this.setState({
      borrowDuration: text
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    var invalidLoanLimit = this.checkLoanLimit();
    if (this.state.invalidAmount === false && invalidLoanLimit === false) {
      fetch(apiLink + "/rest/request/createRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify({
          amount: this.state.amount,
          duration: this.state.borrowDuration,
          interestRate: 18,
          createDate: this.state.createDate,
          deal: {
            borrowTime: this.state.lendingTimeline.length,
            paybackTime: this.state.paybackTimeline.length,
            milestone: this.createMileStone()
          }
        })
      }).then(result => {
        if (result.status === 200) {
          // alert("create success");
          this.props.history.push("view-new-request");
        } else if (result.status === 401) {
          localStorage.removeItem("isLoggedIn");
          this.props.history.push("/login-page");
        }
      });
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
    });
    this.props.setIsHistory(false);
    this.props.setIsViewDetail(true);
    this.props.setIsHistoryDetail(false);

    this.getLoanLimit();
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  getLoanLimit() {
    fetch(apiLink + "/rest/user/getUserMaximunLoanLimit", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      }
    }).then(result => {
      if (result.status === 200) {
        result.json().then(data => {
          console.log("set loan limit");
          this.setState({
            maxloadlimit: data
          });
        });
      } else if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      }
    });
  }

  onAmountCleaveChange(event) {
    // formatted pretty value
    // console.log(event.target.value);

    // raw value
    // console.log(event.target.rawValue);
    var rawValue = event.target.rawValue;

    if (rawValue % 500000 !== 0) {
      if (rawValue >= 1000000000) {
        //1 billion
        this.setState({
          invalidAmount: true,
          errorAmount: "The amount must be lower than 1 billion!"
        });
      } else {
        this.setState({
          invalidAmount: true,
          errorAmount: "The amount must be a multiple of 500.000 VNĐ !"
        });
      }
    } else {
      if (rawValue >= 1000000000) {
        //1 billion
        this.setState({
          invalidAmount: true,
          errorAmount: "The amount must be lower than 1 billion!"
        });
      } else if (rawValue === "") {
        this.setState({
          invalidAmount: true,
          errorAmount: ""
        });
      } else {
        
        this.setState({
          amount : rawValue,
          invalidAmount: false,
          errorAmount: ""
        });
      }
    }
  }

  onCreditCardFocus(event) {
    // update some state
  }
  render() {
    return (
      <>
        <DemoNavbar />
        <main ref="main">
          <div className="position-relative">
            {/* shape Hero */}
            <section className="section section-lg section-shaped bg-gradient-info">
              {/* <div className="shape shape-style-1 shape-default">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div> */}
              <Container className="py-lg-md d-flex">
                <div className="col px-0">
                  <Row>
                    <Col lg="10">
                      <h1 className="display-3 text-white">
                        Create Lending Request{" "}
                        <span>create your own request</span>
                      </h1>
                      <p className="lead text-white">
                        create borrow request more easier. Every where, every
                        times, ...
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
                    <h2 className="display-3 text-center">
                      Create your request
                    </h2>
                    <Card className="bg-gradient-secondary shadow">
                      <CardBody className="p-lg-5">
                        <h4 className="mb-1 text-center mb-5">
                          Fill your information into the form
                        </h4>
                        <h5 className="mb-1 text-center mb-5">
                          Loan limit available:{" "}
                          {this.numberWithCommas(this.state.maxloadlimit)} VNĐ
                        </h5>
                        <Form role="form" onSubmit={this.handleSubmit}>
                          <FormGroup
                            row
                            className={classnames({
                              focused: this.state.amountFocused
                            })}
                          >
                            <Col lg="3" md="3">
                              <Label
                                htmlFor="amount"
                                style={textVerticalCenter}
                              >
                                Amount
                              </Label>
                            </Col>
                            <Col lg="4" md="4">
                              <Cleave
                                placeholder="Enter your Amount"
                                options={{
                                  numeral: true,
                                  numeralThousandsGroupStyle: "thousand"
                                }}
                                onFocus={this.onCreditCardFocus}
                                onChange={this.onAmountCleaveChange}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  height: "calc(2.75rem + 2px)",
                                  padding: "0.625rem 0.75rem",
                                  fontSize: "1rem",
                                  lineHeight: 1.5,
                                  color: "#8898aa",
                                  backgroundColor: "#fff",
                                  backgroundClip: "padding-box",
                                  border: "1px solid #cad1d7",
                                  borderRadius: "0.25rem",
                                  boxShadow: "none"
                                }}
                              />
                              <small>
                                <strong style={{ color: "red" }}>
                                  {this.state.errorAmount}
                                </strong>
                              </small>
                            </Col>
                          </FormGroup>
                          <FormGroup
                            row
                            className={classnames({
                              focused: this.state.durationFocused
                            })}
                          >
                            <Col lg="3" md="3">
                              <Label
                                htmlFor="duration"
                                style={textVerticalCenter}
                              >
                                Borrow Duration
                              </Label>
                            </Col>
                            <Col lg="3" md="3">
                              <Input
                                type="select"
                                name="duration"
                                id="duration"
                                onFocus={e =>
                                  this.setState({ durationFocused: true })
                                }
                                onBlur={e =>
                                  this.setState({ durationFocused: false })
                                }
                                onChange={this.onBorrowDurationChange}
                                required
                                defaultValue=""
                              >
                                <option value="" disabled>
                                  Please select
                                </option>
                                <option value="1">30 days</option>
                                <option value="3">90 days</option>
                                <option value="6">180 days</option>
                                <option value="9">270 days</option>
                                <option value="12">360 days</option>
                              </Input>
                              <p id="durationError" />
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Col lg="3" md="3">
                              <Label
                                htmlFor="interestedRate"
                                style={textVerticalCenter}
                              >
                                Interest rate
                              </Label>
                            </Col>
                            <Col lg="9" md="9">
                              <p>18% per year</p>
                              {/* <Input
                                  name="interestedRate"
                                  type="text"
                                  disabled
                                  value="18% per year"
                                /> */}
                            </Col>
                          </FormGroup>
                          <ApplyTimeline
                            onDataChange={this.handleDataTimeline}
                          />
                          <div className="text-center my-4">
                            {/* <Input type="submit" value="Send" /> */}
                            <Button
                              type="submit"
                              size="md"
                              className="btn btn-outline-primary"
                              disabled={this.state.invalidAmount}
                            >
                              Create Request
                            </Button>
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

const mapStateToProps = state => {
  return {
    request: state.request
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
)(CreateRequestPage);
