import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardFooter,
  Col,
  PaginationItem,
  PaginationLink,
  Progress,
  Badge,
  Table,
  Container,
  Modal,
  Row
} from "reactstrap";
// core components

import { Link, Redirect } from "react-router-dom";
import Pagination from "../views/examples/Pagination";
import Header from "components/Headers/Header.jsx";

import { apiLink } from "../api";

class Tables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      page: 1,
      pageSize: 5,
      maxPage: 0,
      iconTabs: 1,
      plainTabs: 1
    };
    this.getRequest = this.getRequest.bind(this);
    // this.setDataToDetailPage = this.setDataToDetailPage.bind(this);
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.changePage = this.changePage.bind(this);

    this.changeStatus = this.changeStatus.bind(this);
  }

  changePage(index) {
    this.setState({
      page: index
    });
  }

  getRequest() {
    let pageParam = encodeURIComponent(this.state.page);
    let pageSizeParam = encodeURIComponent(this.state.pageSize);
    fetch(
      apiLink +
        "/rest/admin/user/getUsers?page=" +
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
        this.props.history.push("/login");
      } else if (result.status === 200) {
        result.json().then(data => {
          this.setState({
            users: data.data,
            maxPage: data.maxPage
          });
        });
      }
    });
  }
  changeStatus(index, userId) {
    var userTmp = this.state.users;
    if (userTmp[index].status == "active") {
      userTmp[index].status = "deactive";
      fetch(apiLink + "/rest/admin/user/deactivateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify({
          id: userId
        })
      });
    } else {
      userTmp[index].status = "active";
      fetch(apiLink + "/rest/admin/user/activateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify({
          id: userId
        })
      });
    }
    this.setState({ users: userTmp });
  }
  componentWillMount() {
    this.getRequest();
  }
  componentWillUpdate() {
    if (
      localStorage.getItem("isLoggedIn") == "" ||
      localStorage.getItem("isLoggedIn") == undefined
    ) {
      this.props.history.push("/login");
    }
  }
  convertTimeStampToDate(date) {
    var timestampToDate = new Date(date * 1000);
    return timestampToDate.toLocaleDateString();
  }
  toggleModal = stateParam => {
    this.setState({
      [stateParam]: !this.state[stateParam]
    });
  };
  render() {
    const listUsers = this.state.users.map((user, index) => (
      <tr key={index}>
        <td>
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            {user.id}
          </Col>
        </td>
        <td>{user.username}</td>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>

        <td>
          <div>
            <label className="custom-toggle">
              <input
                type="checkbox"
                checked={user.status == "active" ? true : false}
                onChange={() => this.toggleModal("defaultModal-" + index)}
              />
              <span className="custom-toggle-slider rounded-circle" />
            </label>
            <Modal
              className="modal-dialog-centered"
              isOpen={this.state["defaultModal-" + index]}
              toggle={() => this.toggleModal("defaultModal-" + index)}
            >
              <div className="modal-header">
                <h6 className="modal-title" id="modal-title-default">
                  Confirm change status
                </h6>
                <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggleModal("defaultModal-" + index)}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  {" "}
                  Are you sure to change status of{" "}
                  <strong>{user.username}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <Button
                  color="primary"
                  type="button"
                  onClick={() => {
                    this.changeStatus(index, user.id);
                    this.toggleModal("defaultModal-" + index);
                  }}
                >
                  Yes
                </Button>
                <Button
                  className="ml-auto"
                  color="link"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggleModal("defaultModal-" + index)}
                >
                  No
                </Button>
              </div>
            </Modal>
          </div>
        </td>
        <td>
          <Link to="/view-detail-request">
            <Button
              type="button"
              id="dealButton"
              size="md"
              className="btn btn-outline-primary"
              // onClick={() => this.setDataToDetailPage(user)}
            >
              View Detail
            </Button>{" "}
          </Link>
        </td>
      </tr>
    ));
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">List Users</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Username</th>
                      <th scope="col">First Name</th>
                      <th scope="col">Last Name</th>
                      <th scope="col">Status</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>{listUsers}</tbody>
                </Table>
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    {/* <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem className="disabled">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="active">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          2 <span className="sr-only">(current)</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          3
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination> */}
                    <Row className="align-items-center justify-content-center text-center">
                      <Pagination
                        maxPage={this.state.maxPage}
                        currentPage={this.state.page}
                        onChange={this.getRequest}
                        changePage={this.changePage}
                      />
                    </Row>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Tables;
