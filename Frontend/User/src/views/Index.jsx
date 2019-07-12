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

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      modalValid: false,
      position: 0,
      validTx: {}
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
        status: ""
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
        setTimeout(
          function() {
            let dateCreate = new Date(data.asset.data.createDate);
            if (
              data.asset.data.sender === transactionInput.sender &&
              data.asset.data.receiver === transactionInput.receiver &&
              Number(data.asset.data.amount) === transactionInput.amount &&
              Math.round(dateCreate.getTime() / 1000) ===
                transactionInput.createDate
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
          1000
        );
      });
    });
  }
  render() {
    const listItems = this.state.transactions.map((transaction, index) => (
      <tr key={index}>
        <td style={{ width: 50, overflowX: "hidden" }}>{transaction.idTrx}</td>
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
              <FormGroup row className="py-2">
                <Col md="6">ID Transaction</Col>
                <Col md="6">Status</Col>
              </FormGroup>
              <FormGroup row className="py-2">
                <Col md="6">{this.state.validTx.idTrx}</Col>
                <Col md="6">{this.state.validTx.status}</Col>
              </FormGroup>
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
          {/* <Buttons />
          <Inputs />
          <section className="section">
            <Container>
              <CustomControls />
              <Menus />
            </Container>
          </section> */}
          {/* <Navbars /> */}
          {/* <section className="section section-components">
            <Container>
              <Tabs />
              <Row className="row-grid justify-content-between align-items-center mt-lg">
                <Progress />
                <Pagination />
              </Row>
              <Row className="row-grid justify-content-between">
                <Pills />
                <Labels />
              </Row>
              <Alerts />
              <Typography />
              <Modals />
              <Datepicker />
              <TooltipPopover />
            </Container>
          </section> */}
          {/* <Carousel /> */}
          {/* <Icons /> */}
          {/* <Login /> */}
          {/* <Download /> */}
          <section className="section section-sm ">
            <Container >
            {/* <CustomControls /> */}
              <Row className="justify-content-center text-center">
                <p className="h3">History Transactions</p>
              </Row>
              <Row className="justify-content-center text-center">
                {/* <Datepicker /> */}
                <Table>
                  <thead>
                    <tr>
                      <th>Id Transaction Blockchain</th>
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
