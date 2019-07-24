import React from "react";

// reactstrap components
import {
  Container,
  Row,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Col
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";

// index page sections
import Hero from "./IndexSections/Hero.jsx";
import SimpleFooter from "components/Footers/SimpleFooter";
import { apiLink, bigchainAPI } from "api";
import { BeatLoader } from "react-spinners";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      modalValid: false,
      position: 0,
      validTx: {},
      loading: true
    };
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.convertDateToTimestamp = this.convertDateToTimestamp.bind(this);
  }

  convertDateToTimestamp(date) {
    return Math.round(date.getTime() / 1000);
  }
  convertTimeStampToDate(date) {
    var timestampToDate = new Date(date * 1000);
    return timestampToDate.toLocaleDateString();
  }
  // /rest/transaction/getTop20Transaction
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

    //get transaction
    fetch(apiLink + "/rest/transaction/getTop20Transaction", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
        // "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      }
    }).then(result => {
      result.json().then(data => {
        this.setState({
          transactions: data
        });
      });
      if (result.status === 200) {
        // alert("create success");
      }
    });
  }

  toggleModalValid() {
    this.setState({ modalValid: !this.state.modalValid });
  }
  validateTransaction(transactionInput) {
    this.setState({
      validTx: {
        idTrx: "",
        status: "",
        sender: false,
        receiver: false,
        amount: false,
        createDate: false
      }
    });
    fetch(bigchainAPI + "/search_transaction_by_id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: transactionInput.idTrx
      })
    }).then(result => {
      result.json().then(data => {
        let dateCreate = new Date(data.asset.data.createDate);
        setTimeout(
          function() {
            if (data.asset.data.sender === transactionInput.sender) {
              this.setState({
                validTx: {
                  ...this.state.validTx,
                  sender: true
                }
              });
            }
          }.bind(this),
          1000
        );
        setTimeout(
          function() {
            if (data.asset.data.receiver === transactionInput.receiver) {
              this.setState({
                validTx: {
                  ...this.state.validTx,
                  receiver: true
                }
              });
            }
          }.bind(this),
          2000
        );
        setTimeout(
          function() {
            if (Number(data.asset.data.amount) === transactionInput.amount) {
              this.setState({
                validTx: {
                  ...this.state.validTx,
                  amount: true
                }
              });
            }
          }.bind(this),
          3000
        );
        setTimeout(
          function() {
            if (
              Math.round(dateCreate.getTime() / 1000) ===
              transactionInput.createDate
            ) {
              this.setState({
                validTx: {
                  ...this.state.validTx,
                  createDate: true
                }
              });
            }
          }.bind(this),
          4000
        );
        setTimeout(
          function() {
            if (
              this.state.validTx.sender == true &&
              this.state.validTx.receiver == true &&
              this.state.validTx.amount == true &&
              this.state.validTx.createDate == true
            ) {
              this.setState({
                validTx: {
                  idTrx: data.asset.data.txId,
                  status: "VALID TRANSACTION"
                }
              });
            } else {
              this.setState({
                validTx: {
                  idTrx: data.asset.data.txId,
                  status: "INVALID TRANSACTION"
                }
              });
            }
          }.bind(this),
          4500
        );
      });
    });
  }
  render() {
    const listItems = this.state.transactions.map((transaction, index) => (
      <tr key={index}>
        <td
          style={{
            width: 200,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "inline-block"
          }}
        >
          {transaction.idTrx}
        </td>
        <td>{transaction.sender}</td>
        <td>{transaction.receiver}</td>
        <td>{transaction.amount} VND</td>
        <td>{this.convertTimeStampToDate(transaction.createDate)}</td>
        {/* <td>{transaction.status}</td> */}
        <td>
          <Button
            id="acceptButton"
            size="md"
            color="primary"
            onClick={() => {
              this.toggleModalValid();
              this.validateTransaction(transaction);
            }}
            disabled={this.state.editable}
          >
            <i className="fa" /> Validate
          </Button>
          <Modal
            isOpen={this.state.modalValid}
            toggle={() => this.toggleModalValid()}
            className={this.props.className}
          >
            <ModalHeader toggle={() => this.toggleModalValid()}>
              Valid transaction
            </ModalHeader>
            <ModalBody>
              {this.state.validTx.idTrx == "" ? (
                <div>
                  <FormGroup row className="py-2">
                    <Col md="6">Check Sender</Col>
                    <Col md="6">
                      {this.state.validTx.sender ? (
                        <i
                          class="ni ni-check-bold"
                          style={{ color: "green" }}
                        />
                      ) : (
                        <BeatLoader
                          sizeUnit={"px"}
                          size={10}
                          color={"#123abc"}
                          loading={this.state["loading-sender"]}
                        />
                      )}
                    </Col>
                  </FormGroup>
                  <FormGroup row className="py-2">
                    <Col md="6">Check Receiver</Col>
                    <Col md="6">
                      {this.state.validTx.receiver ? (
                        <i
                          class="ni ni-check-bold"
                          style={{ color: "green" }}
                        />
                      ) : (
                        <BeatLoader
                          sizeUnit={"px"}
                          size={10}
                          color={"#123abc"}
                          loading={this.state["loading-receiver"]}
                        />
                      )}
                    </Col>
                  </FormGroup>
                  <FormGroup row className="py-2">
                    <Col md="6">Check Amount</Col>
                    <Col md="6">
                      {this.state.validTx.amount ? (
                        <i
                          class="ni ni-check-bold"
                          style={{ color: "green" }}
                        />
                      ) : (
                        <BeatLoader
                          sizeUnit={"px"}
                          size={10}
                          color={"#123abc"}
                          loading={this.state["loading-amount"]}
                        />
                      )}
                    </Col>
                  </FormGroup>
                  <FormGroup row className="py-2">
                    <Col md="6">Check Create Date</Col>
                    <Col md="6">
                      {this.state.validTx.createDate ? (
                        <i
                          class="ni ni-check-bold"
                          style={{ color: "green" }}
                        />
                      ) : (
                        <BeatLoader
                          sizeUnit={"px"}
                          size={10}
                          color={"#123abc"}
                          loading={this.state["loading-createDate"]}
                        />
                      )}
                    </Col>
                  </FormGroup>
                </div>
              ) : (
                <div>
                  <FormGroup row className="py-2">
                    <Col md="6">ID Transaction</Col>
                    <Col md="6">Status</Col>
                  </FormGroup>
                  <FormGroup row className="py-2">
                    <Col md="6">{this.state.validTx.idTrx}</Col>
                    <Col md="6">
                      {this.state.validTx.status}
                      <i class="ni ni-check-bold" style={{ color: "green",fontSize: "20px" }} />
                    </Col>
                  </FormGroup>
                </div>
              )}
            </ModalBody>
          </Modal>
        </td>
      </tr>
    ));
    return (
      <>
        <DemoNavbar />
        <main ref="main">
          <Hero />
          <section className="section section-sm ">
            <Container>
              {/* <CustomControls /> */}
              <Row className="justify-content-center text-center">
                <p className="h3">History Transactions</p>
              </Row>
              <Row className="justify-content-center text-center">
                {/* <Datepicker /> */}
                <Table>
                  <thead>
                    <tr>
                      <th>Id Tx Blockchain</th>
                      <th>Sender</th>
                      <th>Receiver</th>
                      <th>Amount</th>
                      <th>Create Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>{listItems}</tbody>
                </Table>
              </Row>
              {/* <Row className="align-items-center justify-content-center text-center">
                <Pagination />
              </Row> */}
            </Container>
          </section>
        </main>
        {/* <CardsFooter /> */}
        <SimpleFooter />
      </>
    );
  }
}

export default Index;
