import React from "react";

// nodejs library that concatenates classes
import classnames from "classnames";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  NavItem,
  NavLink,
  Nav,
  Card,
  CardBody,
  TabContent,
  TabPane,
  Modal
} from "reactstrap";

// core components
import MainNavbar from "../MainNavbar/MainNavbar.jsx";
// import CardsFooter from "components/Footers/CardsFooter.jsx";

import Pagination from "../../views/IndexSections/Pagination.jsx";
//api link
import { apiLink } from "../../api.jsx";
import SimpleFooter from "components/Footers/SimpleFooter";

class ViewRequestTrading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      borrowRequests: [],
      lendRequests: [],

      borrowPage: 1,
      lendPage: 1,

      borrowMaxPage: 0,
      lendMaxPage: 0,

      pageSize: 5,

      iconTabs: 1,
      plainTabs: 1,
      isOpenError: false,
      message: '',
    };
    this.getRequest = this.getRequest.bind(this);
    this.setDataToDetailPage = this.setDataToDetailPage.bind(this);
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.changeLendPage = this.changeLendPage.bind(this);
    this.changeBorrowPage = this.changeBorrowPage.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index
    });
  };

  changeLendPage(index) {
    this.setState({
      lendPage: index
    });
  }

  changeBorrowPage(index) {
    this.setState({
      borrowPage: index
    });
  }

  getRequest() {
    //   /rest/request/all_request_trading_by_lender
    let lendPageParam = encodeURIComponent(this.state.lendPage);
    let borrowPageParam = encodeURIComponent(this.state.borrowPage);
    let pageSizeParam = encodeURIComponent(this.state.pageSize);
    fetch(
      apiLink +
      "/rest/request/all_request_trading_by_lender?page=" +
      lendPageParam +
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
      if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      } else if (result.status === 200) {
        result.json().then(data => {
          this.setState({
            lendRequests: data.data,
            lendMaxPage: data.maxPage
          });
        });
      }
    }).catch(async data => {
      //CANNOT ACCESS TO SERVER
      await this.handleError(data)
    });

    fetch(
      apiLink +
      "/rest/request/all_request_trading_by_borrower?page=" +
      borrowPageParam +
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
      if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      } else if (result.status === 200) {
        // alert("create success");
        result.json().then(data => {
          this.setState({
            borrowRequests: data.data,
            borrowMaxPage: data.maxPage
          });
        });
      }
    }).catch(async data => {
      //CANNOT ACCESS TO SERVER
      await this.handleError(data)
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
  setDataToDetailPage(id) {
    this.props.setRequest(id);
    this.props.setIsHistory(false);
    this.props.setIsViewDetail(false);
    this.props.setIsHistoryDetail(true);
    this.props.setIsTrading(true);
    localStorage.setItem("previousPage", window.location.pathname);
  }

  componentWillMount() {
    this.getRequest();
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }

  convertTimeStampToDate(date) {
    var timestampToDate = new Date(date * 1000);
    return timestampToDate.toLocaleDateString();
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  render() {
    const lendListItems = this.state.lendRequests.map((request, index) => (
      <tr key={index}>
        <td>
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            {request.id}
          </Col>
        </td>
        <td>{this.numberWithCommas(request.amount)} VND</td>
        <td>{request.borrower.username}</td>
        <td>{this.convertTimeStampToDate(request.createDate)}</td>
        {/* <td>{request.duration} days</td> */}
        <td>
          <Link to="/view-detail-request">
            <Button
              type="button"
              id="dealButton"
              size="md"
              className="btn btn-outline-primary"
              onClick={() => this.setDataToDetailPage(request)}
            >
              View Detail
            </Button>{" "}
          </Link>
        </td>
      </tr>
    ));

    const borrowListItems = this.state.borrowRequests.map((request, index) => (
      <tr key={index}>
        <td>
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            {request.id}
          </Col>
        </td>
        <td>{this.numberWithCommas(request.amount)} VND</td>
        <td>{request.borrower.username}</td>
        <td>{this.convertTimeStampToDate(request.createDate)}</td>
        {/* <td>{request.duration} days</td> */}
        <td>
          <Link to="/view-detail-request">
            <Button
              type="button"
              id="dealButton"
              size="md"
              className="btn btn-outline-primary"
              onClick={() => this.setDataToDetailPage(request)}
            >
              View Detail
            </Button>{" "}
          </Link>
        </td>
      </tr>
    ));
    return (
      <>
        <MainNavbar />
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
                        Trading Requests <span>View your trading requests </span>
                      </h1>
                      <p className="lead text-white">
                        View status borrow and lend request
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
                          Borrow
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
                          Lend
                  </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <Card className="shadow">
                    <CardBody>
                      <TabContent activeTab={"plainTabs" + this.state.plainTabs}>
                        {(this.state.borrowRequests.length === 0 &&
                          this.state.plainTabs === 1) ?
                          (
                            <p className="h3" style={{ textAlign: 'center' }}>No data</p>
                          )
                          :
                          (
                            <TabPane tabId="plainTabs1">
                              <Row className="justify-content-center text-center">
                                <Table>
                                  <thead>
                                    <tr>
                                      <th>Id</th>
                                      <th>Amount</th>
                                      <th>User</th>
                                      <th>Create Date</th>
                                      {/* <th>Duration</th> */}
                                      <th>View Detail</th>
                                    </tr>
                                  </thead>
                                  <tbody>{borrowListItems}</tbody>
                                </Table>
                              </Row>
                              <Row className="align-items-center justify-content-center text-center">
                                <Pagination
                                  maxPage={this.state.borrowMaxPage}
                                  currentPage={this.state.borrowPage}
                                  onChange={this.getRequest}
                                  changePage={this.changeBorrowPage}
                                />
                              </Row>
                            </TabPane>
                          )}
                        {(this.state.lendRequests.length === 0 &&
                          this.state.plainTabs === 2) ?
                          (
                            <p className="h3" style={{ textAlign: 'center' }}>No data</p>
                          )
                          :
                          (
                            <TabPane tabId="plainTabs2">
                              <Row className="justify-content-center text-center">
                                <Table>
                                  <thead>
                                    <tr>
                                      <th>Id</th>
                                      <th>Amount</th>
                                      <th>User</th>
                                      <th>Create Date</th>
                                      {/* <th>Duration</th> */}
                                      <th>View Detail</th>
                                    </tr>
                                  </thead>
                                  <tbody>{lendListItems}</tbody>
                                </Table>
                              </Row>
                              <Row className="align-items-center justify-content-center text-center">
                                <Pagination
                                  maxPage={this.state.lendMaxPage}
                                  currentPage={this.state.lendPage}
                                  onChange={this.getRequest}
                                  changePage={this.changeLendPage}
                                />
                              </Row>
                            </TabPane>
                          )}
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>
        </main>
        <SimpleFooter />
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.isOpenError}
        // toggle={() => this.toggleModal('defaultModal')}
        >
          <div className="modal-header">
            Error
          </div>
          <div className="modal-body">
            <h3 className="modal-title" id="modal-title-default">
              {this.state.message}
            </h3>
          </div>
          <div className="modal-footer">
            <Button onClick={() => { this.setState({ isOpenError: false }) }}>OK</Button>
          </div>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    request: state.request,
    tokenReducer: state.tokenReducer,
    viewDetail: state.viewDetail
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
)(ViewRequestTrading);
