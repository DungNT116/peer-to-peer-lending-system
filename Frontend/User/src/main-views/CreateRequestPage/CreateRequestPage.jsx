import React from 'react';

// nodejs library that concatenates classes
import classnames from 'classnames';

//connect react and redux
import {connect} from 'react-redux';

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
  Button,
  Modal
} from 'reactstrap';

//components
import MainNavbar from '../MainNavbar/MainNavbar';
import ApplyTimeline from '../ApplyTimeline/ApplyTimeline.jsx';
import SimpleFooter from 'components/Footers/SimpleFooter';

//api link (path)
import {apiLink} from '../../api.jsx';

//currency input
import Cleave from 'cleave.js/react';

const textVerticalCenter = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
};
class CreateRequestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      // borrowDuration: '',
      interestRate: '',
      createDate: '',
      lendingTimeline: [],
      paybackTimeline: [],
      invalidAmount: true,
      errorAmount: '',
      maxloadlimit: 0,
      isOpen : false,
      isOpenError: false
    };

    // this.onBorrowDurationChange = this.onBorrowDurationChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDataTimeline = this.handleDataTimeline.bind(this);
    this.createMileStone = this.createMileStone.bind(this);
    this.onAmountCleaveChange = this.onAmountCleaveChange.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  //create milestone data from lending and payback timeline
  //return list data contains lending and payback milestone
  //milestone: previousDate: timestamp, presentDate: timestamp, percent: 0.1 - 1, type: lend - payback
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

  //function update lending and payback timeline from applytimeline
  async handleDataTimeline(lendingTimeline, paybackTimeline) {
    await this.setState({
      lendingTimeline: lendingTimeline,
      paybackTimeline: paybackTimeline,
    });
  }

  // onBorrowDurationChange(event) {
  //   var index = event.target.selectedIndex;
  //   var text = event.target[index].innerText.split(' ')[0];
  //   this.setState({
  //     borrowDuration: text,
  //   });
  // }

  //create request
  async handleSubmit(event) {
    event.preventDefault();
    if (this.state.invalidAmount === false ) {
      fetch(apiLink + '/rest/request/createRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify({
          amount: this.state.amount,
          duration: 30,
          interestRate: 18,
          createDate: this.state.createDate,
          deal: {
            borrowTimes: this.state.lendingTimeline.length,
            paybackTimes: this.state.paybackTimeline.length,
            milestone: this.createMileStone(),
          },
        }),
      }).then(result => {
        if (result.status === 200) {
          this.setState({
            isOpen: true,
          });
          setTimeout(
            function() {
              setTimeout(this.props.history.push('view-new-request'), 3000);
            }.bind(this),
            3000
          );
        } else if (result.status === 401) {
          localStorage.removeItem('isLoggedIn');
          this.props.history.push('/login-page');
        }
      }).catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.handleError(data)
      });
    }
    event.preventDefault();
  }

  //handle server error
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

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    var dateNow = new Date();
    var timeStampeDateNow = Math.round(dateNow.getTime() / 1000);
    this.setState({
      createDate: timeStampeDateNow,
    });

    //hide make deal field
    this.props.setIsHistory(false);

    //show make deal field
    this.props.setIsViewDetail(true);

    //
    this.props.setIsHistoryDetail(false);

    this.getLoanLimit();
  }

  //currency format
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  //get loan limit and interest rate
  getLoanLimit() {
    fetch(apiLink + '/rest/user/getUserMaximunLoanLimit', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    }).then(result => {
      if (result.status === 200) {
        result.json().then(data => {
          this.setState({
            maxloadlimit: data.loanLimit,
            interestRate : data.interestRate
          });
        });
      } else if (result.status === 401) {
        localStorage.removeItem('isLoggedIn');
        this.props.history.push('/login-page');
      }
    }).catch(async data => {
      //CANNOT ACCESS TO SERVER
      await this.handleError(data);
    });
  }

  //handle amount change
  onAmountCleaveChange(event) {
    var rawValue = event.target.rawValue;
    if (rawValue > this.state.maxloadlimit) {
      this.setState({
        invalidAmount: true,
        errorAmount: 'The amount must be lower than loan limit !',
      });
    } else {
      if (rawValue % 500000 !== 0) {
        if (rawValue >= 1000000000) {
          //1 billion
          this.setState({
            invalidAmount: true,
            errorAmount: 'The amount must be lower than 1 billion!',
          });
        } else {
          this.setState({
            invalidAmount: true,
            errorAmount: 'The amount must be a multiple of 500.000 VND !',
          });
        }
      } else {
        if (rawValue >= 1000000000) {
          //1 billion
          this.setState({
            invalidAmount: true,
            errorAmount: 'The amount must be lower than 1 billion!',
          });
        } else if (rawValue === '') {
          this.setState({
            invalidAmount: true,
            errorAmount: '',
          });
        } else {
          this.setState({
            amount: rawValue,
            invalidAmount: false,
            errorAmount: '',
          });
        }
      }
    }
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
    
    return (
      <>
        <MainNavbar />
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
                        Create Lending Request{' '}
                        <span>Create your own request</span>
                      </h1>
                      <p className="lead text-white">
                        Lending money more easier. Every where, every times, ...
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
                <Modal
                  className="modal-dialog-centered"
                  isOpen={this.state.isOpen}
                  // toggle={() => this.toggleModal('defaultModal')}
                  style={style.sameSizeWithParent}
                >
                  <div className="modal-body">
                    <h3 className="modal-title" id="modal-title-default">
                      <img
                        style={{width: 50, height: 50}}
                        src={require('assets/img/theme/checked.png')}
                      /> 
                      Successfully created request !
                    </h3>
                  </div>
                </Modal>
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
                          Loan limit available:{' '}
                          {this.numberWithCommas(this.state.maxloadlimit)} VNĐ
                        </h5>
                        <Form role="form" onSubmit={this.handleSubmit}>
                          <FormGroup
                            row
                            className={classnames({
                              focused: this.state.amountFocused,
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
                                  numeralThousandsGroupStyle: 'thousand',
                                }}
                                onFocus={this.onCreditCardFocus}
                                onChange={this.onAmountCleaveChange}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  height: 'calc(2.75rem + 2px)',
                                  padding: '0.625rem 0.75rem',
                                  fontSize: '1rem',
                                  lineHeight: 1.5,
                                  color: '#8898aa',
                                  backgroundColor: '#fff',
                                  backgroundClip: 'padding-box',
                                  border: '1px solid #cad1d7',
                                  borderRadius: '0.25rem',
                                  boxShadow: 'none',
                                }}
                              />
                              <small>
                                <strong style={{color: 'red'}}>
                                  {this.state.errorAmount}
                                </strong>
                              </small>
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
                              <span>{this.state.interestRate}% per Year</span>
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
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.isOpenError}
        // toggle={() => this.toggleModal('defaultModal')}
        >
          <div className="modal-header">
            Error
          </div>
          <div className="modal-body">
            <h3 className="modal-title" id="modal-title-default">
              {this.state.error}
            </h3>
          </div>
          <div className="modal-footer">
            <Button onClick={() => { this.setState({ isOpenError: false }) }}>OK</Button>
          </div>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    request: state.request,
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
)(CreateRequestPage);
