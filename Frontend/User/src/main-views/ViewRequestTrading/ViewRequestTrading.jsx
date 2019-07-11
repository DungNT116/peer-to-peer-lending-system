import React from "react";

// nodejs library that concatenates classes
import classnames from "classnames";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { SET_PAGE_NUMBER } from "../../redux/action/types";
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
  TabPane
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
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
      plainTabs: 1
    };
    this.getRequest = this.getRequest.bind(this);
    this.setDataToDetailPage = this.setDataToDetailPage.bind(this);
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.changeLendPage = this.changeLendPage.bind(this);
    this.changeBorrowPage = this.changeBorrowPage.bind(this);
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
      console.log(result);
      if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      } else if (result.status === 200) {
        // alert("create success");
        result.json().then(data => {
          this.setState({
            lendRequests: data.data,
            lendMaxPage: data.maxPage
          });
        });
        console.log("success");
      }
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
      console.log(result);
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
        console.log("success");
      }
    });
    // event.preventDefault();
    // this.props.history.push('/')
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
    // console.log(localStorage.getItem("token"));

    //change timestamp to date String and vice versa
    // var date = "07/22/2018";
    // var dateToTimestamp = Math.round(new Date(date).getTime() / 1000);
    // var timestampToDate = new Date(dateToTimestamp * 1000);

    // console.log("dateToTimestamp: " + dateToTimestamp);
    // console.log("timestampToDate: " +timestampToDate.toLocaleDateString())
  }

  convertTimeStampToDate(date) {
    var timestampToDate = new Date(date * 1000);
    return timestampToDate.toLocaleDateString();
  }

  render() {
    const lendListItems = this.state.lendRequests.map((request, index) => (
      <tr key={index}>
        <td>
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            {request.id}
          </Col>
        </td>
        <td>{request.amount} VND</td>
        <td>{request.borrower.username}</td>
        <td>{this.convertTimeStampToDate(request.createDate)}</td>
        <td>{request.duration} days</td>
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
        <td>{request.amount} VND</td>
        <td>{request.borrower.username}</td>
        <td>{this.convertTimeStampToDate(request.createDate)}</td>
        <td>{request.duration} days</td>
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
                        View Request Trading <span>View request trading </span>
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
                        <TabPane tabId="plainTabs1">
                        <Row className="justify-content-center text-center">
                <Table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Amount</th>
                      <th>user</th>
                      <th>CreateDate</th>
                      <th>Duration</th>
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
                        <TabPane tabId="plainTabs2">
                        <Row className="justify-content-center text-center">
                <Table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Amount</th>
                      <th>user</th>
                      <th>CreateDate</th>
                      <th>Duration</th>
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
