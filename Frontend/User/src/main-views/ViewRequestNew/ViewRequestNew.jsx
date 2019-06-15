import React from "react";
import { connect } from 'react-redux';
// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
  Table
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import Pagination from "../../views/IndexSections/Pagination.jsx";

//api link
import { apiLink } from '../../api.jsx';
import SimpleFooter from "components/Footers/SimpleFooter";

class ViewRequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: []
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

    }).then(
      (result) => {
        result.json().then((data) => {
          this.setState({ requests: data });
        })
        if (result.status === 200) {
          // console.log("create success");
        }

      }
    )
    // event.preventDefault();
    // this.props.history.push('/')
  }

  //maybe not use
  // deleteRequest(id) {

  //   fetch(apiLink + "/rest/request/delete", {
  //     method: 'DELETE',
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": this.props.tokenReducer.token
  //       // 'Access-Control-Allow-Origin': '*'
  //     },
  //     body: JSON.stringify({
  //       id: id
  //     })

  //   }).then(
  //     (result) => {
  //       if (result.status === 200) {
  //         alert("delete success");
  //       }

  //     }
  //   )
  //   // event.preventDefault();
  //   // this.props.history.push('/')
  // }

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
        <td>{request.amount}</td>
        <td>{request.dueDate}</td>
        <td>{request.createDate}</td>
        <td>{request.duration}</td>
        <td>{request.status}</td>
        <td>
          <Button type="button" id="dealButton" size="md" color="primary" onClick={() => this.deleteRequest(request.id)}>
            <i className="fa fa-dot-circle-o"></i> Delete
            </Button>{' '}
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
                      <th>Amount</th>
                      <th>DueDate</th>
                      <th>CreateDate</th>
                      <th>Duration</th>
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
        <SimpleFooter />
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
