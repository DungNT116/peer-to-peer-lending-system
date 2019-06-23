import React from "react";

// reactstrap components
import { Container, Row, Table } from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
// import CardsFooter from "components/Footers/CardsFooter.jsx";

// index page sections
import Hero from "./IndexSections/Hero.jsx";
// import Buttons from "./IndexSections/Buttons.jsx";
// import Inputs from "./IndexSections/Inputs.jsx";
// import CustomControls from "./IndexSections/CustomControls.jsx";
// import Menus from "./IndexSections/Menus.jsx";
// import Navbars from "./IndexSections/Navbars.jsx";
// import Tabs from "./IndexSections/Tabs.jsx";
// import Progress from "./IndexSections/Progress.jsx";
import Pagination from "./IndexSections/Pagination.jsx";
// import Pills from "./IndexSections/Pills.jsx";
// import Labels from "./IndexSections/Labels.jsx";
// import Alerts from "./IndexSections/Alerts.jsx";
// import Typography from "./IndexSections/Typography.jsx";
// import Modals from "./IndexSections/Modals.jsx";
// import Datepicker from "./IndexSections/Datepicker.jsx";
// import TooltipPopover from "./IndexSections/TooltipPopover.jsx";
// import Carousel from "./IndexSections/Carousel.jsx";
// import Icons from "./IndexSections/Icons.jsx";
// import Login from "./IndexSections/Login.jsx";
// import Download from "./IndexSections/Download.jsx";
import SimpleFooter from "components/Footers/SimpleFooter";
import Datepicker from "./IndexSections/Datepicker";
import { apiLink } from "api";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: []
    }
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
  }

  // /rest/transaction/getTop20Transaction
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

    //get transaction
    fetch(apiLink + "/rest/transaction/getTop20Transaction", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        // "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      },
    }).then(
      (result) => {

        result.json().then((data) => {
          this.setState({ 
            transactions: data
          });
        })
        if (result.status === 200) {
          // alert("create success");
        }

      }
    )
    // event.preventDefault();
    // this.props.history.push('/')
  }

  convertTimeStampToDate(date) {
    var timestampToDate = new Date(date * 1000);
    return timestampToDate.toLocaleDateString();
  }

  render() {
    const listItems = this.state.transactions.map((transaction, index) =>
      <tr key={index}>
        <td>
          {transaction.id}
        </td>
        <td>{transaction.sender}</td>
        <td>{transaction.receiver}</td>
        <td>{transaction.amount} VND</td>
        <td>{this.convertTimeStampToDate(transaction.createDate)}</td>
        <td>{transaction.status}</td>
      </tr>
    );
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
          <section className="section section-sm">
            <Container>
              <Row className="justify-content-center text-center">
                <p className="h3">
                  History Transactions
                </p>
              </Row>
              <Row className="justify-content-center text-center">
              {/* <Datepicker /> */}
                <Table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>sender</th>
                      <th>receiver</th>
                      <th>amount</th>
                      <th>createDate</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listItems}
                    {/* <tr>
                      <td>1</td>
                      <td>DungNT</td>
                      <td>MinhLN</td>
                      <td>1000 VND</td>
                      <td>05/06/2019</td>
                      <td>Completed</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>DungNT</td>
                      <td>LocHV</td>
                      <td>1000 VND</td>
                      <td>05/06/2019</td>
                      <td>Completed</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>LocHV</td>
                      <td>MinhLN</td>
                      <td>1000 VND</td>
                      <td>05/06/2019</td>
                      <td>Completed</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>DungNT</td>
                      <td>LocHV</td>
                      <td>1000 VND</td>
                      <td>05/06/2019</td>
                      <td>Completed</td>
                    </tr> */}
                  </tbody>

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
