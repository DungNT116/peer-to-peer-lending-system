import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// reactstrap components
import { Button, Container, Row, Col, Table, NavLink, Card, CardBody, TabContent, TabPane, Nav, NavItem } from "reactstrap";
import classnames from "classnames";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import Pagination from "../../views/IndexSections/Pagination.jsx";

//api link
import { apiLink } from "../../api.jsx";
import SimpleFooter from "components/Footers/SimpleFooter";
import { SET_IS_LEND_MANY } from "redux/action/types";
import { SET_IS_PAY_MANY } from "redux/action/types";

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

      pageSize: 5,

      iconTabs: 1,
      plainTabs: 1
    };
    this.getRequest = this.getRequest.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
    this.changeNewPage = this.changeNewPage.bind(this);
    this.changeDealingPage = this.changeDealingPage.bind(this);
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.setDataToDetailPage = this.setDataToDetailPage.bind(this);
    this.cancelRequest = this.cancelRequest.bind(this);
  }

  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index
    });
  };

  cancelRequest(id) {
    fetch(apiLink + "/rest/deal/cancelDeal", {
      method: "PUT",
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
        // alert("delete success");
        //reload data
        this.getRequest();
      } else if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      }
    });
  }

  setDataToDetailPage(id, where) {
    this.props.setRequest(id);
    if (where === "dealing") {
      this.props.setIsHistoryDetail(false);
    } else {
      this.props.setIsHistoryDetail(true);
    }
    this.props.setIsHistory(true);
    this.props.setIsViewDetail(true);
    this.props.setIsTrading(false);
    localStorage.setItem("previousPage", window.location.pathname);
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
              className="btn btn-outline-primary"
              onClick={() => this.setDataToDetailPage(request, "pending")}
            >
               View Detail
            </Button>{" "}
          </Link>
        </td>
        <td>
          <Button
            type="button"
            id="dealButton"
            size="md"
            className="btn btn-outline-danger"
            onClick={() => this.deleteRequest(request.id)}
          >
            <i className="fa fa-remove" /> Delete
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
              className="btn btn-outline-primary"
              type="button"
              size="md"
              // color="primary"
              onClick={() => this.setDataToDetailPage(request, "dealing")}
            >
               View Detail
            </Button>{" "}
          </Link>
        </td>
        <td>
          <Button type="button" id="dealButton" size="md" className="btn btn-outline-danger" onClick={() => this.cancelRequest(request.id)}>
            <i className="fa fa-remove"></i> Cancel Deal
            </Button>{' '}
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
          </div>

          <section className="section section-lg mt--200">
            <Container>
              <Row className="justify-content-center">
                <Col className="mt-5 mt-lg-0" lg="12">
                  {/* Menu */}
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
                          className={classnames("mb-sm-3 mb-md-0", {
                            active: this.state.plainTabs === 1
                          })}
                          onClick={e => this.toggleNavs(e, "plainTabs", 1)}
                          href="#pablo"
                          role="tab"
                        >
                          Pending Request
                  </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          aria-selected={this.state.plainTabs === 2}
                          className={classnames("mb-sm-3 mb-md-0", {
                            active: this.state.plainTabs === 2
                          })}
                          onClick={e => this.toggleNavs(e, "plainTabs", 2)}
                          href="#pablo"
                          role="tab"
                        >
                          Dealing Request
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
                                  <th>Id</th>
                                  <th>Amount</th>
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
                        </TabPane>
                        <TabPane tabId="plainTabs2">
                          <Row className="justify-content-center text-center">
                            <Table>
                              <thead>
                                <tr>
                                  <th>Id</th>
                                  <th>Amount</th>
                                  <th>CreateDate</th>
                                  <th>Duration</th>
                                  <th>Status</th>
                                  <th>View detail</th>
                                  <th>Cancel</th>
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
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
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
    },
    setIsLendMany: (status) => {
      dispatch({
        type: SET_IS_LEND_MANY,
        payload: status
      });
    },
    setIsPayMany: (status) => {
      dispatch({
        type: SET_IS_PAY_MANY,
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
