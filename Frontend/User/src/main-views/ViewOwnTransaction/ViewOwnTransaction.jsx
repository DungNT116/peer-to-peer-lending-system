import React from "react";

// nodejs library that concatenates classes
// import classnames from "classnames";
import { connect } from "react-redux";

// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  NavLink,
  Card,
  CardBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup
} from "reactstrap";

import classnames from "classnames";
// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";

import { BeatLoader } from "react-spinners";
import Pagination from "../../views/IndexSections/Pagination.jsx";
//api link
import { apiLink, bigchainAPI } from "../../api.jsx";
import SimpleFooter from "components/Footers/SimpleFooter";

// index page sections

class ViewOwnTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      page: 1,
      pageSize: 5,
      maxPage: 0,
      iconTabs: 1,
      plainTabs: 1,
      transactions: [],
      modalValid: false,
      position: 0,
      validTx: {},
      loading: true
    };
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index
    });
  };
  changePage(index) {
    this.setState({
      page: index
    });
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

    let pageParam = encodeURIComponent(this.state.page);
    let pageSizeParam = encodeURIComponent(this.state.pageSize);
    //get transaction
    fetch(
      apiLink +
        "/rest/transaction/getAllUserTransaction?page=" +
        pageParam +
        "&element=" +
        pageSizeParam,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        }
      }
    ).then(result => {
      result.json().then(data => {
        // console.log(data)
        this.setState({
          transactions: data.data
        });
      });
      if (result.status === 200) {
        // alert("create success");
      }

      // console.log(this.state.transactions);
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
        console.log(transactionInput);
        console.log(data);
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
            if (Number(data.asset.data.amount) === transactionInput.amountValid) {
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
              this.state.validTx.sender === true &&
              this.state.validTx.receiver === true &&
              this.state.validTx.amount === true &&
              this.state.validTx.createDate === true
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
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  render() {
    const listItems = this.state.transactions.map((transaction, index) => (
      <tr key={index}>
        <td
          style={{
            width: 200,
            height:40,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "inline-block"
          }}
        >
          {transaction.idTrx}
        </td>
        <td>{transaction.sender}</td>
        <td>{transaction.receiver}</td>
        <td>{this.numberWithCommas(transaction.amount)} VND</td>
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
              {this.state.validTx.idTrx === "" ? (
                <div>
                  <FormGroup row className="py-2">
                    <Col md="6">Check Sender</Col>
                    <Col md="6">
                      {this.state.validTx.sender ? (
                        <i
                          className="ni ni-check-bold"
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
                          className="ni ni-check-bold"
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
                        className="ni ni-check-bold"
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
                        className="ni ni-check-bold"
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
                      <i
                        className="ni ni-check-bold"
                        style={{ color: "green", fontSize: "20px" }}
                      />
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
                        View Own Transactions{" "}
                        <span>View your own transactions </span>
                      </h1>
                      <p className="lead text-white">
                        Check your transactions on Blockchain more easier.
                      </p>
                    </Col>
                  </Row>
                </div>
              </Container>
            </section>
            {/* 1st Hero Variation */}
          </div>

          <section className="section section-lg mt--200">
            <Container>
              <div className="nav-wrapper">
                <Nav
                  className="nav-fill flex-column flex-md-row"
                  id="tabs-icons-text"
                  pills
                  role="tablist"
                >
                  <NavItem>
                    <NavLink
                      aria-selected={this.state.plainTabs === 1}
                      className={classnames("mb-sm-6 mb-md-0", {
                        active: this.state.plainTabs === 1
                      })}
                      onClick={e => this.toggleNavs(e, "plainTabs", 1)}
                      href="#pablo"
                      role="tab"
                    >
                      Own Transactions
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <Card className="shadow">
                <CardBody>
                  <TabContent activeTab={"plainTabs" + this.state.plainTabs}>
                    <TabPane tabId="plainTabs1">
                      <Row className="justify-content-center text-center">
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
                      <Row className="align-items-center justify-content-center text-center">
                        <Pagination
                          maxPage={this.state.maxPage}
                          currentPage={this.state.page}
                          onChange={this.getRequest}
                          changePage={this.changePage}
                        />
                      </Row>
                    </TabPane>
                  </TabContent>
                </CardBody>
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
)(ViewOwnTransaction);