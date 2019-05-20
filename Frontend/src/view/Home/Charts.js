import React, { Component } from 'react';

import { Button, Col, Jumbotron, Badge, Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
class Tables extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <div className="card">

          <div className="card-body">
            <h1>Description</h1>
            <p>
              We introduce a solution to make loan transactions transparent, a web application called Peer-to-peer Lending System. This Peer-to-peer Lending System helps people borrow money directly by making an agreement with the lender, from which all transactions will be stored on the Blockchain and viewed by anyone in the system.

            </p>
          </div>
          <div className="card-body">
            <Jumbotron>
              <h1 className="display-3">Join us NOW</h1>
              {/* <p className="lead">blablablallalalblalblalblalballba</p> */}
              <hr className="my-2" />
              <p className="lead">
                <Button color="warning">Sign Up</Button>
              </p>
            </Jumbotron>
          </div>
          <div className="card-body">
            <h1>Happening transactions</h1>
            <Table responsive>
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Value</th>
                  <th>Due date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                    <Button block color="ghost-primary">No.1</Button>
                  </Col></td>
                  <td>500,001</td>
                  <td>20/05/2019 17:00</td>
                  <td>
                    <Badge color="warning">Waiting</Badge>
                  </td>
                </tr>
                <tr>
                  <td><Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                    <Button block color="ghost-primary">No.2</Button>
                  </Col></td>
                  <td>500,002</td>
                  <td>20/05/2019 17:00</td>
                  <td>
                    <Badge color="warning">Waiting</Badge>
                  </td>
                </tr>
                <tr>
                  <td><Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                    <Button block color="ghost-primary">No.3</Button>
                  </Col></td>
                  <td>500,003</td>
                  <td>20/05/2019 17:00</td>
                  <td>
                    <Badge color="warning">Waiting</Badge>
                  </td>
                </tr>
                <tr>
                  <td><Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                    <Button block color="ghost-primary">No.4</Button>
                  </Col></td>
                  <td>500,004</td>
                  <td>20/05/2019 17:00</td>
                  <td>
                    <Badge color="danger">Cancelled</Badge>
                  </td>
                </tr>
                <tr>
                  <td><Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                    <Button block color="ghost-primary">No.5</Button>
                  </Col></td>
                  <td>500,005</td>
                  <td>20/05/2019 17:00</td>
                  <td>
                    <Badge color="success">Success</Badge>
                  </td>
                </tr>
              </tbody>
            </Table>
            <Pagination>
              <PaginationItem>
                <PaginationLink previous tag="button"></PaginationLink>
              </PaginationItem>
              <PaginationItem active>
                <PaginationLink tag="button">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink tag="button">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink tag="button">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink tag="button">4</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink next tag="button"></PaginationLink>
              </PaginationItem>
            </Pagination>
          </div>
        </div>
      </div>

    );
  }
}

export default Tables;