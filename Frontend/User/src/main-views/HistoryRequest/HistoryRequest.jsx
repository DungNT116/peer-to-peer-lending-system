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
import {apiLink} from '../../api.jsx';
import SimpleFooter from "components/Footers/SimpleFooter";

class ViewRequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      historyRequests: [],
      page: 1,
      pageSize: 5,
      maxPage: 0,
    }
    this.getRequest = this.getRequest.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  getRequest() {
    let pageParam = encodeURIComponent(this.state.page);
    let pageSizeParam = encodeURIComponent(this.state.pageSize);
    fetch(apiLink + "/rest/request/allRequestHistoryDone?page=" + pageParam + "&element=" + pageSizeParam, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      },
    }).then(
      (result) => {
          result.json().then((data) => {
            this.setState({
              historyRequests: data.data,
              maxPage: data.maxPage
            });
          })
          if(result.status === 200) {
            // alert("create success");
          }

        }
    )
    // event.preventDefault();
    // this.props.history.push('/')
  }

  changePage(index) {
    this.setState({
      page: index
    })
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    this.getRequest();
  }
  render() {
    const listItems = this.state.historyRequests.map((request) =>
      <tr>
        <td><Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
          {request.id}
        </Col></td>
        <td>{request.amount}</td>
        <td>{request.dueDate}</td>
        <td>{request.createDate}</td>
        <td>{request.duration}</td>
        <td>{request.status}</td>
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
                    </tr>
                  </thead>
                  <tbody>
                    {listItems}
                  </tbody>
                </Table>
              </Row>
              <Row className="align-items-center justify-content-center text-center">
              <Pagination maxPage={this.state.maxPage} currentPage={this.state.page}
                 onChange={this.getRequest} changePage={this.changePage}/>
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
