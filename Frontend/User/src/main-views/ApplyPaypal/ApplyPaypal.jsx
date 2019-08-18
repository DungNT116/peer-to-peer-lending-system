import React from "react";

// nodejs library that concatenates classes
import classnames from "classnames";
import { connect } from "react-redux";
// reactstrap components
import {
  // Badge,
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
import MainNavbar from "../MainNavbar/MainNavbar";
import { PayPalButton } from "react-paypal-button-v2";
//api link
import {bigchainAPI, client_API } from "../../api.jsx";
class ApplyPaypal extends React.Component {
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }
  constructor(props) {
    super(props);
    this.state = {
      txId: "",
      amount: "",
      sender: "",
      receiver: "",
      createDate: "",
      userId: ""
    };
    this.onUserIdChange = this.onUserIdChange.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.onSenderChange = this.onSenderChange.bind(this);
    this.onReceiverChange = this.onReceiverChange.bind(this);
  }
  send_tx = () => {
    let data_tx = {
      data_tx: {
        data: {
          txId: this.state.txId,
          sender: this.state.sender,
          receiver: this.state.receiver,
          amount: this.state.amount,
          createDate: this.state.createDate
        }
      },
      metadata_tx: {
        userId: this.state.userId,
        createDate: this.state.createDate
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
        
      });
  };
  onUserIdChange(event) {
    this.setState({ userId: event.target.value });
  }
  onAmountChange(event) {
    this.setState({ amount: event.target.value });
  }
  onSenderChange(event) {
    this.setState({ sender: event.target.value });
  }
  onReceiverChange(event) {
    this.setState({ receiver: event.target.value });
  }

  render() {

    return (
      <>
        <MainNavbar />
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
                        Apply Paypal <span>Apply Paypal </span>
                      </h1>
                    </Col>
                  </Row>
                </div>
              </Container>
            </section>
          </div>

          <section className="section">
            <Container>
              <Card className="card-profile shadow mt--200">
                <div className="px-4">
                  <Row className="justify-content-center ">
                    <CardBody className="p-lg-5 ">
                      <h4 className="mb-1">Transaction Information</h4>
                      
                      <Form role="form">
                        <FormGroup
                          className={classnames({
                            focused: this.state.userIdFocused
                          })}
                        >
                          <Label>User Id</Label>
                          <InputGroup className="input-group-alternative">
                            <Input
                              placeholder="User Id"
                              type="text"
                              onFocus={e =>
                                this.setState({ userIdFocused: true })
                              }
                              onBlur={e =>
                                this.setState({ userIdFocused: false })
                              }
                              onChange={this.onUserIdChange}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup
                          className={classnames({
                            focused: this.state.senderFocused
                          })}
                        >
                          <Label>Sender</Label>
                          <InputGroup className="input-group-alternative">
                            <Input
                              placeholder="Sender"
                              type="text"
                              onFocus={e =>
                                this.setState({ senderFocused: true })
                              }
                              onBlur={e =>
                                this.setState({ senderFocused: false })
                              }
                              onChange={this.onSenderChange}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup
                          className={classnames({
                            focused: this.state.receiverFocused
                          })}
                        >
                          <Label>Receiver</Label>
                          <InputGroup className="input-group-alternative">
                            <Input
                              placeholder="Receiver"
                              type="text"
                              onFocus={e =>
                                this.setState({ receiverFocused: true })
                              }
                              onBlur={e =>
                                this.setState({ receiverFocused: false })
                              }
                              onChange={this.onReceiverChange}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup
                          className={classnames({
                            focused: this.state.amountFocused
                          })}
                        >
                          <Label>Amount</Label>
                          <InputGroup className="input-group-alternative">
                            <Input
                              placeholder="Amount"
                              type="text"
                              onFocus={e =>
                                this.setState({ amountFocused: true })
                              }
                              onBlur={e =>
                                this.setState({ amountFocused: false })
                              }
                              onChange={this.onAmountChange}
                            />
                          </InputGroup>
                        </FormGroup>
                        <PayPalButton
                          amount={this.state.amount}
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
                      </Form>
                    </CardBody>
                  </Row>
                </div>
              </Card>
            </Container>
          </section>
        </main>
        {/* <CardsFooter /> */}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    tokenReducer: state.tokenReducer
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setToken: token => {
      dispatch({
        type: "SET_TOKEN",
        payload: token
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplyPaypal);
