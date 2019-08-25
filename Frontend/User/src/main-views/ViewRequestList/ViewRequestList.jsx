import React from "react";

// nodejs library that concatenates classes
// import classnames from "classnames";
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
  Modal,
  Input,
} from "reactstrap";

import classnames from "classnames";
// core components
import MainNavbar from "../MainNavbar/MainNavbar.jsx";

import Pagination from "../../views/IndexSections/Pagination.jsx";
//api link
import { apiLink } from "../../api.jsx";
import SimpleFooter from "components/Footers/SimpleFooter";

// index page sections

class ViewRequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      page: 1,
      pageSize: 5,
      maxPage: 0,
      iconTabs: 1,
      plainTabs: 1,
      isOpenError: false,
      message: '',
      selectedFilter: "0",
    };
    this.getRequest = this.getRequest.bind(this);
    this.setDataToDetailPage = this.setDataToDetailPage.bind(this);
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.changePage = this.changePage.bind(this);
    this.handleError = this.handleError.bind(this);
    this.onSelectFilterChange = this.onSelectFilterChange.bind(this);
  }

  async onSelectFilterChange(e) {
    await this.setState({
      selectedFilter: e.target.value
    })
    await this.getRequest();
  }

  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index
    });
  };
  changePage(index) {
    this.setState({
      page: index
    });
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  getRequest() {
    let controllerLink = "/rest/request/user/";
    console.log(this.state.selectedFilter)
    switch (this.state.selectedFilter) {
      case "0":
        controllerLink += "allRequest?page=";
        break;
      case "1":
        controllerLink += "allRequestSortByDateAsc?page=";
        break;
      case "2":
        controllerLink += "allRequestSortByAmountDesc?page=";
        break;
      case "3":
        controllerLink += "allRequestSortByAmountAsc?page=";
        break;
    }
    console.log("aaaaaaaaaaaaaaaaaaa", controllerLink)
    let pageParam = encodeURIComponent(this.state.page);
    let pageSizeParam = encodeURIComponent(this.state.pageSize);
    fetch(
      apiLink + controllerLink +
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
      if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login-page");
      } else if (result.status === 200) {
        // alert("create success");
        result.json().then(data => {
          this.setState({
            requests: data.data,
            maxPage: data.maxPage
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
    this.props.setIsHistory(true);
    this.props.setIsTrading(false);
    this.props.setIsViewDetail(true);
    this.props.setIsHistoryDetail(false);
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

  render() {
    const listItems = this.state.requests.map((request, index) => (
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
                        Lending Requests{" "}
                        <span>View request for your lending </span>
                      </h1>
                      <p className="lead text-white">
                        Accept borrowing request more easier.
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
                      Lending Requests
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <Card className="shadow">
                <CardBody>
                  <TabContent activeTab={"plainTabs" + this.state.plainTabs}>
                    {this.state.requests.length === 0 ?
                      (
                        <p className="h3" style={{ textAlign: 'center' }}>No data</p>
                      )
                      :
                      (
                        <TabPane tabId="plainTabs1">
                          <Row className="justify-content-center text-center">
                            <Input type="select" className="col-md-3 offset-md-9" onChange={this.onSelectFilterChange}>
                              <option value="0" selected>Day descending</option>
                              <option value="1">Day ascending</option>
                              <option value="2">Amount descending</option>
                              <option value="3">Amount ascending</option>
                            </Input>
                          </Row>
                          <p></p>
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
)(ViewRequestList);
