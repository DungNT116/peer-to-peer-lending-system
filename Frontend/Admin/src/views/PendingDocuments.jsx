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
import Pagination from "./examples/Pagination";
import Header from "components/Headers/Header.jsx";
import { PulseLoader } from "react-spinners";
import { apiLink } from "../api";

import { css } from "@emotion/core";
class PendingDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingDocs: [],
      page: 1,
      pageSize: 5,
      maxPage: 0,
      iconTabs: 1,
      plainTabs: 1,
      loading: true
    };
    this.getPendingDocuments = this.getPendingDocuments.bind(this);
    // this.setDataToDetailPage = this.setDataToDetailPage.bind(this);
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  changePage(index) {
    this.setState({
      page: index
    });
  }

  getPendingDocuments() {
    let pageParam = encodeURIComponent(this.state.page);
    let pageSizeParam = encodeURIComponent(this.state.pageSize);
    fetch(
      apiLink +
        "/rest/admin/document/getAllInvalidDocument?page=" +
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
            pendingDocs: data.data,
            maxPage: data.maxPage,
            loading: false
          });
        });
      }
    });
  }
  componentWillMount() {
    this.getPendingDocuments();
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
    const override = css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      padding-left: 0;
    `;
    const style = {
      profileComponent: {
        position: "relative",
        top: -250
      },
      myAccount: {
        position: "relative",
        top: -150
      },
      sameSizeWithParent: {
        width: "100%",
        height: "100%"
      }
    };
    const listPendingDocs = this.state.pendingDocs.map((doc, index) => (
      <tr key={index}>
        <td>
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            {doc.id}
          </Col>
        </td>
        <td>{doc.user.username}</td>
        <td>
          {doc.user.firstName} {doc.user.lastName}
        </td>
        <td>{doc.documentType}</td>
        <td>
          <Link to="/view-detail-request">
            <Button
              type="button"
              id="dealButton"
              size="md"
              className="btn btn-outline-primary"
              // onClick={() => this.setDataToDetailPage(request)}
            >
              View Detail
            </Button>
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
              <Card className="shadow" style={style.sameSizeWithParent}>
                <CardHeader className="border-0">
                  <h3 className="mb-0">List Pending Documents </h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Username</th>
                      <th scope="col">Full Name</th>
                      <th scope="col">Document Type</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>{listPendingDocs}</tbody>
                </Table>
                <PulseLoader
                  css={override}
                  sizeUnit={"px"}
                  size={15}
                  color={"#123abc"}
                  loading={this.state.loading}
                />
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Row className="align-items-center justify-content-center text-center">
                      <Pagination
                        maxPage={this.state.maxPage}
                        currentPage={this.state.page}
                        onChange={this.getPendingDocuments}
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

export default PendingDocuments;
