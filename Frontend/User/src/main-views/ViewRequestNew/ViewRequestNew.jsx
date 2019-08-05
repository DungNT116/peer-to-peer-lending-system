import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// reactstrap components
import { Button, Container, Row, Col, Table } from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import Pagination from "../../views/IndexSections/Pagination.jsx";

//api link
import { apiLink } from "../../api.jsx";
import SimpleFooter from "components/Footers/SimpleFooter";

class ViewRequestNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newRequests: [],
      newPage: 1,
      newMaxPage: 0,
      dealingRequests: [],
      dealingPage: 1,
      dealingMaxPage: 0,
      pageSize: 5
    };
    this.getRequest = this.getRequest.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
    this.changeNewPage = this.changeNewPage.bind(this);
    this.changeDealingPage = this.changeDealingPage.bind(this);
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.setDataToDetailPage = this.setDataToDetailPage.bind(this);
  }

  setDataToDetailPage(id) {
    this.props.setRequest(id);
    
    this.props.setIsHistoryDetail(false);
  }

  changeNewPage(index) {
    this.setState({
      newPage: index
    });
  }

  changeDealingPage(index) {
    this.setState({
      dealingPage: index
    });
  }
  getRequest() {
    let newPageParam = encodeURIComponent(this.state.newPage);
    let dealingPageParam = encodeURIComponent(this.state.dealingPage);
    let pageSizeParam = encodeURIComponent(this.state.pageSize);
    fetch(
      apiLink +
        "/rest/request/allRequestHistoryPending?page=" +
        newPageParam +
        "&element=" +
        pageSizeParam,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
          // "Authorization": this.props.tokenReducer.token
          // 'Access-Control-Allow-Origin': '*'
        }
      }
    ).then(result => {
      if (result.status === 200) {
        // console.log("create success");
        result.json().then(data => {
          this.setState({
            newRequests: data.data,
            newMaxPage: data.maxPage
          });
        });
      } else if (result.status === 401) {
        localStorage.setItem("isLoggedIn", false);
        this.props.history.push("/login-page");
      }
    });

    fetch(
      apiLink +
        "/rest/request/all_request_dealing_by_borrower_or_lender?page=" +
        dealingPageParam +
        "&element=" +
        pageSizeParam,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
          // "Authorization": this.props.tokenReducer.token
          // 'Access-Control-Allow-Origin': '*'
        }
      }
    ).then(result => {
      if (result.status === 200) {
        // console.log("create success");
        result.json().then(data => {
          // console.log(data.data);
          this.setState({
            dealingRequests: data.data,
            dealingMaxPage: data.maxPage
          });
        });
      } else if (result.status === 401) {
        localStorage.setItem("isLoggedIn", false);
        this.props.history.push("/login-page");
      }
    });
    // event.preventDefault();
    // this.props.history.push('/')
  }

  convertTimeStampToDate(date) {
    var timestampToDate = new Date(date * 1000);
    return timestampToDate.toLocaleDateString();
  }

  deleteRequest(id) {
    fetch(apiLink + "/rest/request/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
        // "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        id: id
      })
    }).then(result => {
      if (result.status === 200) {
        alert("delete success");
        //reload data
        this.getRequest();
      } else if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      }
    });
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
    
    console.log(this.state.newRequests);
    const newListItems = this.state.newRequests.map(request => (
      <tr>
        <td>
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            {request.id}
          </Col>
        </td>
        <td>{request.amount} VND</td>
        {/* <td>{request.dueDate}</td> */}
        <td>{this.convertTimeStampToDate(request.createDate)}</td>
        <td>{request.duration} days</td>
        <td>{request.status}</td>
        <td>
          <Link to="/view-detail-request">
            <Button
              type="button"
              size="md"
              color="primary"
              onClick={() => this.setDataToDetailPage(request)}
            >
              <i className="fa fa-dot-circle-o" /> View Detail
            </Button>{" "}
          </Link>
        </td>
        <td>
          <Button
            type="button"
            id="dealButton"
            size="md"
            color="primary"
            onClick={() => this.deleteRequest(request.id)}
          >
            <i className="fa fa-dot-circle-o" /> Delete
          </Button>{" "}
        </td>
      </tr>
    ));

    const dealingListItems = this.state.dealingRequests.map(request => (
      <tr>
        <td>
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            {request.id}
          </Col>
        </td>
        <td>{request.amount} VND</td>
        {/* <td>{request.dueDate}</td> */}
        <td>{this.convertTimeStampToDate(request.createDate)}</td>
        <td>{request.duration} days</td>
        <td>{request.status}</td>
        <td>
          <Link to="/view-detail-request">
            <Button
              type="button"
              size="md"
              color="primary"
              onClick={() => this.setDataToDetailPage(request)}
            >
              <i className="fa fa-dot-circle-o" /> View Detail
            </Button>{" "}
          </Link>
        </td>
        {/* <td>
          <Button type="button" id="dealButton" size="md" color="primary" onClick={() => this.deleteRequest(request.id)}>
            <i className="fa fa-dot-circle-o"></i> Delete
            </Button>{' '}
        </td> */}
      </tr>
    ));
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
                        My Own Request <span>View your own new request</span>
                      </h1>
                      <p className="lead text-white">
                        View your new borrow request more easier. Every where,
                        every times, ...
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
              <h4>Pending request</h4>
              <Row className="justify-content-center text-center">
                <Table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Amount</th>
                      {/* <th>DueDate</th> */}
                      <th>CreateDate</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>View detail</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>{newListItems}</tbody>
                </Table>
              </Row>
              <Row className="align-items-center justify-content-center text-center">
                <Pagination
                  maxPage={this.state.newMaxPage}
                  currentPage={this.state.newPage}
                  onChange={this.getRequest}
                  changePage={this.changeNewPage}
                />
              </Row>
            </Container>
          </section>

          <section className="section section-lg">
            <Container>
              <h4>Dealing request</h4>
              <Row className="justify-content-center text-center">
                <Table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Amount</th>
                      {/* <th>DueDate</th> */}
                      <th>CreateDate</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>View detail</th>
                      {/* <th>Delete</th> */}
                    </tr>
                  </thead>
                  <tbody>{dealingListItems}</tbody>
                </Table>
              </Row>
              <Row className="align-items-center justify-content-center text-center">
                <Pagination
                  maxPage={this.state.dealingMaxPage}
                  currentPage={this.state.dealingPage}
                  onChange={this.getRequest}
                  changePage={this.changeDealingPage}
                />
              </Row>
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
    // tokenReducer: state.tokenReducer,
    // paging: state.paging
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setRequest: (id) => {
      dispatch({
        type: "SET_REQUEST",
        payload: id
      });
    },
    setIsTrading: (status) => {
      dispatch({
        type: "SET_IS_TRADING",
        payload: status
      });
    },
    setIsViewDetail: (status) => {
      dispatch({
        type: "SET_IS_VIEWDETAIL",
        payload: status
      });
    },
    setIsHistory: (status) => {
      dispatch({
        type: "SET_IS_HISTORY",
        payload: status
      });
    },
    setIsHistoryDetail: (status) => {
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
)(ViewRequestNew);
// export default ViewRequestList;
