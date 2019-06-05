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
  Form,
  Table
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import CardsFooter from "components/Footers/CardsFooter.jsx";
import Pagination from "../../views/IndexSections/Pagination.jsx";

//api link
import {apiLink} from '../../api.jsx';

// index page sections
import Download from "../../views/IndexSections/Download.jsx";

class ViewRequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: Array().fill(null)
    }
    this.getRequest = this.getRequest.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
  }

  getRequest() {

    fetch(apiLink + "/rest/request/allRequestHistoryDone", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      },
      // body: JSON.stringify({
      //   borrowerName: this.state.borrowerName,
      //   amount: this.state.amount,
      //   borrowDay: this.state.borrowDay,
      //   borrowDuration: this.state.borrowDuration,
      //   interestRate: this.state.interestRate,
      //   typeOfContact: this.state.typeOfContact,
      // })

    }).then(
      (result) => {
        // result.text().then((data) => {
        //   this.setState({ token: data });
          // console.log(this.state.token);
          // console.log(result.json());
          result.json().then((data) => {
            console.log(data);
            this.setState({requests: data});
            console.log(this.state.requests);
          })
          if(result.status === 200) {
            console.log("create success");
          }

        }
    )
    // event.preventDefault();
    // this.props.history.push('/')
  }

  deleteRequest(id) {

    fetch(apiLink + "/rest/request/delete", {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        id: id
      })

    }).then(
      (result) => {
        // result.text().then((data) => {
        //   this.setState({ token: data });
          // console.log(this.state.token);
          // console.log(result.json());
          // result.json().then((data) => {
          //   console.log(data);
          //   this.setState({requests: data});
          //   console.log(this.state.requests);
          // })
          console.log(result)
          if(result.status === 200) {
            console.log("delete success");
          }

        }
    )
    // event.preventDefault();
    // this.props.history.push('/')
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    this.getRequest();
  }
  render() {
    const listItems = this.state.requests.map((request) =>
      <tr>
        <td><Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
          {request.id}
        </Col></td>
        {/* <td>{request.borrowerName}</td> */}
        <td>{request.amount}</td>
        <td>{request.dueDate}</td>
        <td>{request.createDate}</td>
        <td>{request.duration}</td>
        {/* <td>{request.borrowDay}</td>
        <td>{request.borrowDuration}</td>
        <td>{request.interestRate}</td>
        <td>{request.typeOfContact}</td> */}
        <td>{request.status}</td>
        <td>
          {/* <Link to="/view-history-request"> */}
            <Button type="button" id="dealButton" size="md" color="primary" onClick={() => this.deleteRequest(request.id)}>
              <i className="fa fa-dot-circle-o"></i> Delete
            </Button>{' '}
          {/* </Link> */}
        </td>
      </tr>
    );
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
                        History Request{" "}
                        <span>View your own history request</span>
                      </h1>
                      <p className="lead text-white">
                        View borrow request more easier. Every where, every times, ...
                      </p>
                    </Col>
                  </Row>
                </div>
              </Container>
            </section>
            {/* 1st Hero Variation */}
          </div>


          <section className="section section-lg">
            <Container>
              <Row className="justify-content-center text-center">
                <Table>
                  <thead>
                    <tr>
                    <th>Id</th>
                      {/* <th>Borrower Name</th> */}
                      <th>Amount</th>
                      <th>DueDate</th>
                      <th>CreateDate</th>
                      <th>Duration</th>
                      {/* <th>Borrow Day</th>
                      <th>Borrow Duration</th>
                      <th>Interest Rate</th>
                      <th>Type Of Contact</th> */}
                      <td>status</td>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listItems}
                  </tbody>
                </Table>
              </Row>
              <Row className="align-items-center justify-content-center text-center">
                <Pagination />
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewRequestList);
