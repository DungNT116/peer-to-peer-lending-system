import React from "react";

// nodejs library that concatenates classes
// import classnames from "classnames";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { SET_PAGE_NUMBER } from "../../redux/action/types";
// reactstrap components
import {
  // Badge,
  Button,
  // Card,
  // CardBody,
  // CardImg,
  // FormGroup,
  // Input,
  // InputGroupAddon,
  // InputGroupText,
  // InputGroup,
  Container,
  Row,
  Col,
  // Label,
  // Form,
  Table
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
// import CardsFooter from "components/Footers/CardsFooter.jsx";

import Pagination from "../../views/IndexSections/Pagination.jsx";
//api link
import { apiLink } from '../../api.jsx';
import SimpleFooter from "components/Footers/SimpleFooter";

// index page sections
// import Download from "../../views/IndexSections/Download.jsx";

class ViewRequestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      page: 1,
      pageSize: 5,
      maxPage: 0,
    }
    this.getRequest = this.getRequest.bind(this);
    this.setDataToDetailPage = this.setDataToDetailPage.bind(this);
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  changePage(index) {
    this.setState({
      page: index
    })
  }

  getRequest() {
    let pageParam = encodeURIComponent(this.state.page);
    let pageSizeParam = encodeURIComponent(this.state.pageSize);
    fetch(apiLink + "/rest/request/user/allRequest?page=" + pageParam + "&element=" + pageSizeParam, {
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
            requests: data.data,
            maxPage: data.maxPage
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

  setDataToDetailPage(id) {
    this.props.setRequest(id);
  }

  componentWillMount() {
    this.getRequest();
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    
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
    const listItems = this.state.requests.map((request, index) =>
      <tr key={index}>
        <td><Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
          {request.id}
        </Col></td>
        <td>{request.amount}</td>
        <td>{request.borrower.username}</td>
        <td>{this.convertTimeStampToDate(request.createDate)}</td>
        <td>{request.duration}</td>
        <td>
          <Link to="/view-detail-request">
            <Button type="button" id="dealButton" size="md" color="primary" onClick={() => this.setDataToDetailPage(request)}>
              <i className="fa fa-dot-circle-o"></i> View Detail
            </Button>{' '}
          </Link>
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
                        View Request List{" "}
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


          <section className="section section-lg">
            <Container>
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
    request: state.request,
    tokenReducer: state.tokenReducer,
    paging: state.paging
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setRequest: (id) => {
      dispatch({
        type: "SET_REQUEST",
        payload: id
      });
    },
    setPage: (page) => {
      dispatch({
        type: "SET_PAGE_NUMBER",
        payload: page
      });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewRequestList);
