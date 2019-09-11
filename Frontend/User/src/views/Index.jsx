import React from 'react';

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
  Col,
} from 'reactstrap';

// core components
import MainNavbar from '../main-views/MainNavbar/MainNavbar.jsx';

// index page sections
import Hero from './IndexSections/Hero.jsx';
import SimpleFooter from 'components/Footers/SimpleFooter';
import {apiLink, bigchainAPI} from 'api';
import {BeatLoader} from 'react-spinners';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      modalValid: false,
      position: 0,
      validTx: {},
      loading: true,
    };
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.convertDateToTimestamp = this.convertDateToTimestamp.bind(this);
    this.getTransaction = this.getTransaction.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  convertDateToTimestamp(date) {
    return Math.round(date.getTime() / 1000);
  }
  convertTimeStampToDate(date) {
    var timestampToDate = new Date(date * 1000);
    return timestampToDate.toLocaleDateString();
  }

  getTransaction() {
    fetch(apiLink + '/rest/transaction/getTop20Transaction', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      },
    })
      .then(result => {
        result.json().then(data => {
          this.setState({
            transactions: data,
          });
          localStorage.setItem('token', '');
          localStorage.setItem('profile', '');
          localStorage.setItem('user', '');
        });
        if (result.status === 200) {
          // alert("create success");
        }
      })
      .catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.handleError(data);
      });
  }
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

    //get transaction
    this.getTransaction();
  }

  roundUp(num) {
    let precision = Math.pow(10, 2);
    return Math.ceil(num * precision) / precision;
  }
  toggleModalValid() {
    this.setState({modalValid: !this.state.modalValid});
  }

  validateTransaction(transactionInput) {
    this.setState({
      validTx: {
        idTrx: '',
        status: '',
        sender: null,
        receiver: null,
        amount: null,
        createDate: null,
      },
    });
    fetch(bigchainAPI + '/search_transaction_by_id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: transactionInput.idTrx,
      }),
    })
      .then(result => {
        result.json().then(data => {
          setTimeout(
            function() {
              if (data.asset.data.tx_data.sender === transactionInput.sender) {
                this.setState({
                  validTx: {
                    ...this.state.validTx,
                    sender: true,
                  },
                });
              }else{
                this.setState({
                  validTx: {
                    ...this.state.validTx,
                    sender: false,
                  },
                });
              }
            }.bind(this),
            1000
          );
          setTimeout(
            function() {
              if (
                data.asset.data.tx_data.receiver === transactionInput.receiver
              ) {
                this.setState({
                  validTx: {
                    ...this.state.validTx,
                    receiver: true,
                  },
                });
              }else{
                this.setState({
                  validTx: {
                    ...this.state.validTx,
                    receiver: false,
                  },
                });
              }
            }.bind(this),
            2000
          );
          setTimeout(
            function() {
              if (
                Number(data.asset.data.tx_data.amountTx) ===
                transactionInput.amountValid
              ) {
                this.setState({
                  validTx: {
                    ...this.state.validTx,
                    amount: true,
                  },
                });
              }else{
                this.setState({
                  validTx: {
                    ...this.state.validTx,
                    amount: false,
                  },
                });
              }
            }.bind(this),
            3000
          );
          setTimeout(
            function() {
              if (
                data.asset.data.tx_data.createDate ===
                transactionInput.createDate
              ) {
                this.setState({
                  validTx: {
                    ...this.state.validTx,
                    createDate: true,
                  },
                });
              } else {
                this.setState({
                  validTx: {
                    ...this.state.validTx,
                    createDate: false,
                  },
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
                    idTrx: data.asset.data.tx_data.txId,
                    status: 'VALID TRANSACTION',
                  },
                });
              } else {
                this.setState({
                  validTx: {
                    idTrx: data.asset.data.tx_data.txId,
                    status: 'INVALID TRANSACTION',
                  },
                });
              }
            }.bind(this),
            4500
          );
        });
      })
      .catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.handleError(data);
      });
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  render() {
    const listItems = this.state.transactions.map((transaction, index) => (
      <tr key={index}>
        <td
          style={{
            width: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'inline-block',
          }}
        >
          {transaction.idTrx}
        </td>
        <td>{transaction.sender}</td>
        <td>{transaction.receiver}</td>
        <td>{this.numberWithCommas(Math.round(transaction.amount))} VND</td>
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
              {this.state.validTx.idTrx === '' ? (
                <div>
                  <FormGroup row className="py-2">
                    <Col md="6">Check Sender</Col>
                    <Col md="6">
                      {this.state.validTx.sender ? (
                        <i
                          className="ni ni-check-bold"
                          style={{color: 'green'}}
                        />
                      ) : this.state.validTx.sender === false ? (
                        <i
                          className="ni ni-fat-remove"
                          style={{color: 'red', fontSize: '20px'}}
                        />
                      ) : (
                        <BeatLoader
                          sizeUnit={'px'}
                          size={10}
                          color={'#123abc'}
                          loading={this.state['loading-sender']}
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
                          style={{color: 'green'}}
                        />
                      ) : this.state.validTx.receiver === false ? (
                        <i
                          className="ni ni-fat-remove"
                          style={{color: 'red', fontSize: '20px'}}
                        />
                      ) : (
                        <BeatLoader
                          sizeUnit={'px'}
                          size={10}
                          color={'#123abc'}
                          loading={this.state['loading-receiver']}
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
                          style={{color: 'green'}}
                        />
                      ) : this.state.validTx.amount === false ? (
                        <i
                          className="ni ni-fat-remove"
                          style={{color: 'red', fontSize: '20px'}}
                        />
                      ) : (
                        <BeatLoader
                          sizeUnit={'px'}
                          size={10}
                          color={'#123abc'}
                          loading={this.state['loading-amount']}
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
                          style={{color: 'green'}}
                        />
                      ) : this.state.validTx.createDate === false ? (
                        <i
                          className="ni ni-fat-remove"
                          style={{color: 'red', fontSize: '20px'}}
                        />
                      ) : (
                        <BeatLoader
                          sizeUnit={'px'}
                          size={10}
                          color={'#123abc'}
                          loading={this.state['loading-createDate']}
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
                      {this.state.validTx.status == 'VALID TRANSACTION' ? (
                        <span>
                          {this.state.validTx.status}
                          <i
                            class="ni ni-check-bold"
                            style={{color: 'green', fontSize: '20px'}}
                          />
                        </span>
                      ) : (
                        <span>
                          {this.state.validTx.status}

                          <i
                            className="ni ni-fat-remove"
                            style={{color: 'red', fontSize: '20px'}}
                          />
                        </span>
                      )}
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
        <MainNavbar />
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

              {/* <video autoplay></video> */}
              {/* <input type="file" accept="video/*" capture="camera" id="recorder" />
              <video id="player" controls></video> */}
            </Container>
          </section>
        </main>
        {/* <CardsFooter /> */}
        <SimpleFooter />
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.isOpenError}
          // toggle={() => this.toggleModal('defaultModal')}
        >
          <div className="modal-header">Error</div>
          <div className="modal-body">
            <h3 className="modal-title" id="modal-title-default">
              {this.state.message}
            </h3>
          </div>
          <div className="modal-footer">
            <Button
              onClick={() => {
                this.setState({isOpenError: false});
              }}
            >
              OK
            </Button>
          </div>
        </Modal>
      </>
    );
  }
}

export default Index;
