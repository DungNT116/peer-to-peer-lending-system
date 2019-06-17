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
      newRequests: [],
      page: 1,
      pageSize: 5,
      maxPage: 0,
    }
    this.getRequest = this.getRequest.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  changePage(index) {
    this.setState({
      page: index
    })
  }

  getRequest() {
    let pageParam = encodeURIComponent(this.state.page);
    console.log(pageParam);
    let pageSizeParam = encodeURIComponent(this.state.pageSize);
    console.log(pageSizeParam);
    console.log(apiLink + "/rest/request/allRequestHistoryPending?page=" + pageParam + "&element=" +  pageSizeParam)
    fetch(apiLink + "/rest/request/allRequestHistoryPending?page=" + pageParam + "&element=" +  pageSizeParam, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      },

    }).then(
      (result) => {
        result.json().then((data) => {
          console.log(data.data);
          this.setState({
            newRequests: data.data,
            maxPage: data.maxPage
          });
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
        if (result.status === 200) {
          alert("delete success");
          //reload data
          this.getRequest();
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
    const listItems = this.state.newRequests.map((request) =>
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
                        History New Request{" "}
                        <span>View your own new request</span>
                      </h1>
                      <p className="lead text-white">
                        View your new borrow request more easier. Every where, every times, ...
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
                      <th>status</th>
                      <th>Delete</th>
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
