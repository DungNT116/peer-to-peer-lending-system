import React from "react";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  NavLink,
  Card,
  CardBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  Modal
} from "reactstrap";

import classnames from "classnames";
// core components
import MainNavbar from "../MainNavbar/MainNavbar.jsx";
import Pagination from "../../views/IndexSections/Pagination.jsx";

//api link
import { apiLink } from "../../api.jsx";
import SimpleFooter from "components/Footers/SimpleFooter";

class HistoryRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      historyRequests: [],
      page: 1,
      pageSize: 5,
      maxPage: 0,
      iconTabs: 1,
      plainTabs: 1,
      isOpenError: false,
      error: '',
    };
    this.getRequest = this.getRequest.bind(this);
    this.changePage = this.changePage.bind(this);
    this.setDataToDetailPage = this.setDataToDetailPage.bind(this);
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
  }
  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index
    });
  };
  getRequest() {
    let pageParam = encodeURIComponent(this.state.page);
    let pageSizeParam = encodeURIComponent(this.state.pageSize);
    fetch(
      apiLink +
      "/rest/request/allRequestHistoryDone?page=" +
      pageParam +
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
        // alert("create success");
        result.json().then(data => {
          this.setState({
            historyRequests: data.data,
            maxPage: data.maxPage
          });
        });
      } else if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      }
    }).catch(async data => {
      //CANNOT ACCESS TO SERVER
      await this.setState({
        isOpenError: true,
        error: "Cannot access to server"
      })
    });
    // event.preventDefault();
    // this.props.history.push('/')
  }

  convertTimeStampToDate(date) {
    var timestampToDate = new Date(date * 1000);
    return timestampToDate.toLocaleDateString();
  }

  setDataToDetailPage(id) {
    this.props.setRequest(id);
    this.props.setIsHistory(true);
    this.props.setIsViewDetail(true);
    this.props.setIsHistoryDetail(true);
    this.props.setIsTrading(false);
    localStorage.setItem("previousPage", window.location.pathname);
  }

  changePage(index) {
    this.setState({
      page: index
    });
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    this.getRequest();
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  render() {
    const listItems = this.state.historyRequests.map(request => (
      <tr>
        <td>
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            {request.id}
          </Col>
        </td>
        <td>{this.numberWithCommas(request.amount)} VND</td>
        {/* <td>{request.dueDate}</td> */}
        <td>{this.convertTimeStampToDate(request.createDate)}</td>
        {/* <td>{request.duration} days</td> */}
        <td>{request.status}</td>
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
                        History Request{" "}
                        <span>View your own history request</span>
                      </h1>
                      <p className="lead text-white">
                        View borrow request more easier. Every where, every
                        times, ...
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
                      className={classnames("mb-sm-6 mb-md-0", {
                        active: this.state.plainTabs === 1
                      })}
                      onClick={e => this.toggleNavs(e, "plainTabs", 1)}
                      // href="#pablo"
                      role="tab"
                    >
                      History Request
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <Card className="shadow">
                <CardBody>
                  <TabContent activeTab={"plainTabs" + this.state.plainTabs}>
                    {this.state.historyRequests.length === 0 ?
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
                                  {/* <th>DueDate</th> */}
                                  <th>Create Date</th>
                                  {/* <th>Duration</th> */}
                                  <th>Status</th>
                                  <th>Detail</th>
                                </tr>
                              </thead>
                              <tbody>{listItems}</tbody>
                            </Table>
                          </Row>
                          <Row className="align-items-center justify-content-center text-center">
                            <Pagination
                              maxPage={this.state.maxPage}
                              currentPage={this.state.page}
                              onChange={this.getRequest}
                              changePage={this.changePage}
                            />
                          </Row>
                        </TabPane>
                      )}
                  </TabContent>
                </CardBody>
              </Card>
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
              {this.state.error}
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
    request: state.request
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
)(HistoryRequest);
// export default HistoryRequest;
