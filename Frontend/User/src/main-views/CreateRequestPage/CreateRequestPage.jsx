import React from "react";

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
  Form
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import ApplyTimeline from "../ApplyTimeline/ApplyTimeline.jsx";

//api link
import { apiLink } from '../../api.jsx';


class CreateRequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      borrowDuration: '',
      interestRate: '',
      createDate: '',
      lendingTimeline: [],
      paybackTimeline: []
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
      type: ''
  }
    for (let i = 0; i < this.state.lendingTimeline.length; i++) {
      const element = this.state.lendingTimeline[i];
      
      // console.log(new Date(element.data).getTime() / 1000)
      var dateToTimestamp = new Date(element.data).getTime() / 1000;
      
      if(i === 0) {
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = dateToTimestamp;
        milestone.type = "lending";
      } else {
        const preElement = this.state.lendingTimeline[i-1];
        var preDateToTimestamp = new Date(preElement.data).getTime() / 1000;
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = preDateToTimestamp;
        milestone.type = "lending";
      }
      milestones.push(milestone);
    }
    for (let i = 0; i < this.state.paybackTimeline.length; i++) {
      const element = this.state.paybackTimeline[i];
      
      // console.log(new Date(element.data).getTime() / 1000)
      var dateToTimestamp = new Date(element.data).getTime() / 1000;
      
      if(i === 0) {
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = dateToTimestamp;
        milestone.type = "payback";
      } else {
        const preElement = this.state.paybackTimeline[i-1];
        var preDateToTimestamp = new Date(preElement.data).getTime() / 1000;
        milestone.presentDate = dateToTimestamp;
        milestone.previousDate = preDateToTimestamp;
        milestone.type = "payback";
      }
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
    // console.log(this.state.lendingTimeline)
    // console.log(this.state.paybackTimeline)
    this.createMileStone();
  }

  onAmountChange(event) {
    this.setState({
      amount: event.target.value
    })
  }

  onBorrowDurationChange(event) {
    var index = event.target.selectedIndex;
    var text = event.target[index].innerText.split(" ")[0];
    this.setState({
      borrowDuration: text
    })
  }

  handleSubmit(event) {
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
            milestone: this.createMileStone
            // [
            //     {
            //         previousDate: 11123123123,
            //         presentDate: 11123123123,
            //         type: "borrow"
            //     },
            //     {
            //       previousDate: 11123123123,
            //       presentDate: 1231345646,
            //       type: "borrow"
            //   },
            //     {
            //         previousDate: 11123123123,
            //         presentDate: 11123123123,
            //         type: "payback"
            //     },
            //     {
            //         previousDate: 11123123123,
            //         presentDate: 12315456488,
            //         type: "payback"
            //     }
            // ]
        }
      })

    }).then(
      (result) => {
        if (result.status === 200) {
          alert("create success");
          this.props.history.push('view-new-request');
        } else if(result.status === 401) {
          localStorage.removeItem("isLoggedIn");
          this.props.history.push('/login-page')
        }

      }
    )
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
                        {/* <FormGroup
                          className={classnames("mt-5", {
                            focused: this.state.nameFocused
                          })}
                        >
                          <Label>
                            Borrower Name
                          </Label>
                          <InputGroup className="input-group-alternative">
                            <Input
                              placeholder="Borrower name"
                              type="text"
                              onFocus={e => this.setState({ nameFocused: true })}
                              onBlur={e => this.setState({ nameFocused: false })}
                              onChange={this.onBorrowerNameChange}
                            />
                          </InputGroup>
                        </FormGroup> */}
                        <FormGroup row
                          className={classnames({
                            focused: this.state.amountFocused
                          })}
                        >
                          <Col lg="3" md="3">
                            <Label>
                              Amount
                            </Label>
                            </Col>
                            <Col lg="9" md="9">
                              <InputGroup className="input-group-alternative">
                                <Input
                                  placeholder="Amount"
                                  type="text"
                                  onFocus={e => this.setState({ amountFocused: true })}
                                  onBlur={e => this.setState({ amountFocused: false })}
                                  onChange={this.onAmountChange}
                                />
                              </InputGroup>
                            </Col>
                        </FormGroup>
                        {/* <FormGroup
                          className={classnames({
                            focused: this.state.borrowDayFocused
                          })}
                        >
                          <Label>
                            Borrow Day
                          </Label>
                          <InputGroup className="input-group-alternative">
                            <Input
                              type="date"
                              onFocus={e => this.setState({ borrowDayFocused: true })}
                              onBlur={e => this.setState({ borrowDayFocused: false })}
                              onChange={this.onBorrowDayChange}
                            />
                          </InputGroup>
                        </FormGroup> */}
                        <FormGroup row className={classnames({
                          focused: this.state.durationFocused
                        })}>
                          <Col lg="3" md="3">
                            <Label htmlFor="duration">Borrow Duration</Label>
                          </Col>
                          <Col lg="9" md="9">
                            <InputGroup className="input-group-alternative">
                              <Input type="select" name="duration" id="duration"
                                onFocus={e => this.setState({ durationFocused: true })}
                                onBlur={e => this.setState({ durationFocused: false })}
                                onChange={this.onBorrowDurationChange}>
                                <option value="0">Please select</option>
                                <option value="1">30 days</option>
                                <option value="2">90 days</option>
                                <option value="3">1 Years(365 days)</option>
                              </Input>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                        <Col lg="3" md="3">
                          <Label>
                            Interest rate
                          </Label>
                          </Col>
                          <Col lg="9" md="9">
                          <InputGroup className="input-group-alternative">
                            <Input
                              type="text"
                              disabled
                              value="18% per year"
                            // onChange={this.onInterestRateChange}
                            />
                          </InputGroup>
                          </Col>
                        </FormGroup>
                        {/* <FormGroup row className={classnames({
                          focused: this.state.typeFocused
                        })}>
                          <Col lg="3" md="3">
                            <Label htmlFor="type">Type of contact</Label>
                          </Col>
                          <Col lg="9" md="9">
                            <InputGroup className="input-group-alternative">
                              <Input type="select" name="type" id="type"
                                onFocus={e => this.setState({ typeFocused: true })}
                                onBlur={e => this.setState({ typeFocused: false })}
                                onChange={this.onTypeOfContactChange}>
                                <option value="0">Please select</option>
                                <option value="1">end of the term</option>
                                <option value="2">split into many times</option>
                              </Input>
                            </InputGroup>
                          </Col>
                        </FormGroup> */}
                        {/* <p>TimeLine is here</p> */}
                        <ApplyTimeline onDataChange={this.handleDataTimeline}></ApplyTimeline>
                        <div>
                          {/* <Button
                            type="submit"
                            className="btn-round"
                            color="info"
                            size="lg">
                            Send Message
                        </Button> */}
                          <Input type="submit" value="Send" />

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

          {/* <section className="section section-lg bg-info">
            <Container>
              
            </Container>
          </section> */}
        </main>
        {/* <CardsFooter /> */}
      </>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     tokenReducer: state.tokenReducer
//   }
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

// export default connect(mapStateToProps, mapDispatchToProps)(CreateRequestPage);
export default (CreateRequestPage);
