import React, { Component } from "react";

import { AppSwitch } from "@coreui/react";

import { Button, Card, CardBody, Col, Row, Table, Pagination, PaginationItem, PaginationLink, CardHeader } from "reactstrap";

import { Link } from 'react-router-dom';

// Main Chart

//Random Numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var elements = 27;
var data1 = [];
var data2 = [];
var data3 = [];

for (var i = 0; i <= elements; i++) {
  data1.push(random(50, 200));
  data2.push(random(80, 100));
  data3.push(65);
}

class PendingAccount extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected
    });
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
            <CardHeader>
                <i className="fa fa-align-justify"></i> User List
              </CardHeader>
              <CardBody>
                <Table
                  hover
                  responsive
                  className="table-outline mb-0 d-none d-sm-table"
                >
                  <thead className="thead-light">
                    <tr>
                      <th className="text-center">
                        <i className="icon-people" />
                      </th>
                      <th>Username</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th className="text-center">Registered</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <div className="avatar">
                          <img
                            src={"assets/img/avatars/1.jpg"}
                            className="img-avatar"
                            alt="admin@bootstrapmaster.com"
                          />
                          <span className="avatar-status badge-success" />
                        </div>
                      </td>
                      <td>
                        <div>User name 1</div>
                      </td>
                      <td>
                        <div>First name 1</div>
                      </td>
                      <td>
                        <div>Last name 1</div>
                      </td>
                      <td>
                        <div>email@email.com</div>
                      </td>
                      <td>
                        <div>099 888 777</div>
                      </td>
                      <td className="text-center">2018/01/01</td>
                      <td className="text-center">
                      <Link style={{ textDecoration: 'none' }} to="/pending-account-info" >
                        <Button block color="secondary">Info</Button>
                      </Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="avatar">
                          <img
                            src={"assets/img/avatars/2.jpg"}
                            className="img-avatar"
                            alt="admin@bootstrapmaster.com"
                          />
                          <span className="avatar-status badge-success" />
                        </div>
                      </td>
                      <td>
                        <div>User name 2</div>
                      </td>
                      <td>
                        <div>First name 2</div>
                      </td>
                      <td>
                        <div>Last name 2</div>
                      </td>
                      <td>
                        <div>email@email.com</div>
                      </td>
                      <td>
                        <div>099 888 888</div>
                      </td>
                      <td className="text-center">2018/01/01</td>
                      <td className="text-center">
                      <Link style={{ textDecoration: 'none' }} to="/pending-account-info" >
                        <Button block color="secondary">Info</Button>
                      </Link>
                      </td>
                    </tr>
                  </tbody>                  
                </Table>
                <br/>
                <Pagination>
                  <PaginationItem disabled><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                  <PaginationItem active>
                    <PaginationLink tag="button">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                </Pagination>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PendingAccount;
