import React, { Component } from 'react';
import { Badge, Card, CardBody, Col, Pagination, PaginationItem, PaginationLink, Table,Button } from 'reactstrap';

class Tables extends Component {
  render() {
    return (
      <div className="animated fadeIn" >
            <Card>
              
              <CardBody>
                <Table responsive>
                  <thead>
                  <tr>
                    <th>Request</th>
                    <th>Username</th>
                    <th>Rating</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td><Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                    <Button block color="ghost-primary">No.1</Button>
                    </Col></td>
                    <td>User 1</td>
                    <td>5</td>
                    <td>20/05/2019 17:00</td>
                    <td>
                    <Badge color="warning">Waiting</Badge>
                    </td>
                  </tr>
                  <tr>
                  <td><Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                    <Button block color="ghost-primary">No.2</Button>
                    </Col></td>
                    <td>User 2</td>
                    <td>4</td>
                    <td>20/05/2019 17:00</td>
                    <td>
                    <Badge color="warning">Waiting</Badge>
                    </td>
                  </tr>
                  <tr>
                  <td><Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                    <Button block color="ghost-primary">No.3</Button>
                    </Col></td>
                    <td>User 3</td>
                    <td>4.5</td>
                    <td>20/05/2019 17:00</td>
                    <td>
                    <Badge color="warning">Waiting</Badge>
                    </td>
                  </tr>
                  <tr>
                  <td><Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                    <Button block color="ghost-primary">No.4</Button>
                    </Col></td>
                    <td>User 4</td>
                    <td>5</td>
                    <td>20/05/2019 17:00</td>
                    <td>
                      <Badge color="warning">Waiting</Badge>
                    </td>
                  </tr>
                  <tr>
                  <td><Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                    <Button block color="ghost-primary">No.5</Button>
                    </Col></td>
                    <td>User 5</td>
                    <td>4</td>
                    <td>20/05/2019 17:00</td>
                    <td>
                    <Badge color="warning">Waiting</Badge>
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
              </CardBody>
            </Card>
      </div>

    );
  }
}

export default Tables;