import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

class Tables extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: new Array(4).fill('1'),
    };
  }

  lorem() {
    return (
      <>
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
      </>
    );
  }

  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice()
    newArray[tabPane] = tab
    this.setState({
      activeTab: newArray,
    });
  }

  tabPane() {
    return (
      <>
        <TabPane tabId="1">
          {this.lorem()}
        </TabPane>
        <TabPane tabId="2">
          {this.lorem()}
        </TabPane>
      </>
    );
  }

  render() {
    return (
      <div className="animated fadeIn" >
        <Col xs="12" md="12" className="mb-4">
          <Nav tabs>
            <NavItem className="w-50">
              <NavLink
                active={this.state.activeTab[0] === '1'}
                onClick={() => { this.toggle(0, '1'); }}
              >
                Own Request
                </NavLink>
            </NavItem>
            <NavItem className="w-50">
              <NavLink
                active={this.state.activeTab[0] === '2'}
                onClick={() => { this.toggle(0, '2'); }}
              >
                Request From Other User
                </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab[0]}>
            {this.tabPane()}
            <CardFooter>
              <Link to="/requestForm">
                <Button type="submit" size="sm" color="primary" onClick={this.toggleModal}><i className="fa fa-dot-circle-o"></i> Create</Button>
              </Link>
            </CardFooter>
          </TabContent>
        </Col>
      </div>

    );
  }
}

export default Tables;