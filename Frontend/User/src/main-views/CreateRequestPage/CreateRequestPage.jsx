import React from "react";

// nodejs library that concatenates classes
import classnames from "classnames";
import { connect } from 'react-redux';
// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardImg,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Label,
  Form
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import CardsFooter from "components/Footers/CardsFooter.jsx";

//api link
import {apiLink} from '../../api.jsx';

// index page sections
import Download from "../../views/IndexSections/Download.jsx";

class CreateRequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      borrowerName: '',
      amount: '',
      borrowDay: '',
      borrowDuration: '',
      interestRate: '18',
      typeOfContact: '',
    }
    this.onBorrowerNameChange = this.onBorrowerNameChange.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.onBorrowDayChange = this.onBorrowDayChange.bind(this);
    this.onBorrowDurationChange = this.onBorrowDurationChange.bind(this);
    // this.onInterestRateChange = this.onInterestRateChange.bind(this);
    this.onTypeOfContactChange = this.onTypeOfContactChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onBorrowerNameChange(event) {
    this.setState({
      borrowerName: event.target.value
    })
  }

  onAmountChange(event) {
    this.setState({
      amount: event.target.value
    })
  }

  onBorrowDayChange(event) {
    this.setState({
      borrowDay: new Date(event.target.value).toLocaleDateString()
    })
  }

  onBorrowDurationChange(event) {
    this.setState({
      borrowDuration: event.target.value
    })
  }

  // onInterestRateChange(event) {
  //   this.setState({
  //     interestRate: event.target.value
  //   })
  // }

  onTypeOfContactChange(event) {
    this.setState({
      typeOfContact: event.target.value
    })
  }

  handleSubmit(event) {
    console.log(this.state.borrowerName + " " + this.state.amount + " " + this.state.borrowDay + " " + this.state.borrowDuration + " " + this.state.interestRate + " " + this.state.typeOfContact + " ");
    fetch(apiLink + "/rest/request/createRequest", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        // borrowerName: this.state.borrowerName,
        amount: this.state.amount,
        // borrowDay: this.state.borrowDay,
        // borrowDuration: this.state.borrowDuration,
        // interestRate: this.state.interestRate,
        // typeOfContact: this.state.typeOfContact,
        dueDate: 125666,
        times: 5,
        duration: 30,
        interestRate: 18,
        createDate: 155555
      })

    }).then(
      (result) => {
        // result.text().then((data) => {
        //   this.setState({ token: data });
          // console.log(this.state.token);
          console.log(result);
          if(result.status === 200) {
            console.log("create success");
          }

        }
    )
    // console.log(document.querySelector('meta[name="token"]').getAttribute('content'))
    // let metaTags = document.getElementsByTagName("META");
    // for (let index = 0; index < metaTags.length; index++) {
    //   if(metaTags[index].getAttribute("name") === "token") {
    //     console.log(metaTags[index].getAttribute("content"));    
    //   } 
    // }
    
    // console.log(this.state.borrowDay);
    // console.log("aaaaaa");
    // console.log(this.state.interestRate)
    // console.log("Test token Create : " + this.props.tokenReducer.token);
    // console.log(this.props)
    // console.log(this.state)
    event.preventDefault();
    // this.props.history.push('/')
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
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


          <section className="section section-lg bg-info">
            <Container>
              <Row className="justify-content-center text-center">
                <Col>
                  <h2 className="display-3 text-white">Create your request</h2>
                  <Card className="bg-gradient-secondary shadow">
                    <CardBody className="p-lg-5">
                      <h4 className="mb-1">Fill your information into the form</h4>
                      <Form role="form" onSubmit={this.handleSubmit}>
                        <FormGroup
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
                        </FormGroup>
                        <FormGroup
                          className={classnames({
                            focused: this.state.amountFocused
                          })}
                        >
                          <Label>
                            Amount
                          </Label>
                          <InputGroup className="input-group-alternative">
                            <Input
                              placeholder="Amount"
                              type="text"
                              onFocus={e => this.setState({ amountFocused: true })}
                              onBlur={e => this.setState({ amountFocused: false })}
                              onChange={this.onAmountChange}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup
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
                        </FormGroup>
                        <FormGroup className={classnames({
                          focused: this.state.durationFocused
                        })}>
                          <Col>
                            <Label htmlFor="duration">Borrow Duration</Label>
                          </Col>
                          <Col>
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
                        <FormGroup>
                          <Label>
                            Interest rate
                          </Label>
                          <InputGroup className="input-group-alternative">
                            <Input
                              type="text"
                              disabled
                              value="18% per year"
                            // onChange={this.onInterestRateChange}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup className={classnames({
                          focused: this.state.typeFocused
                        })}>
                          <Col>
                            <Label htmlFor="type">Type of contact</Label>
                          </Col>
                          <Col>
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
                        </FormGroup>
                        <p>TimeLine is here</p>
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
            </Container>
          </section>
        </main>
        {/* <CardsFooter /> */}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tokenReducer: state.tokenReducer
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setToken: (token) => {
      dispatch({
        type: "SET_TOKEN",
        payload: token
      });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRequestPage);
