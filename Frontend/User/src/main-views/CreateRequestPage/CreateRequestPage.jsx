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
    }
    this.onAmountChange = this.onAmountChange.bind(this);
    this.onBorrowDurationChange = this.onBorrowDurationChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        // borrowerName: this.state.borrowerName,
        amount: this.state.amount,
        // dueDate: 125666,
        // times: 5,
        duration: this.state.borrowDuration,
        interestRate: 18,
        createDate: this.state.createDate
      })

    }).then(
      (result) => {
        if (result.status === 200) {
          alert("create success");
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
