import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Label,
  Row,
} from 'reactstrap';

class Forms extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState } });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardHeader>
                <strong>User Profile</strong> 
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label>Username</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="form-control-static">JustaTee</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Password</Label>
                    </Col>
                    <Col xs="12" md="3">
                     ***********
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="email-input">Email</Label>
                    </Col>
                    <Col xs="12" md="9">
                      usermail@gmail.com
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="date-input">Date of Birth</Label>
                    </Col>
                    <Col xs="12" md="3">
                      18 May 2019
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="date-input">First Name</Label>
                    </Col>
                    <Col xs="12" md="3">
                    Michael
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="date-input">Last Name</Label>
                    </Col>
                    <Col xs="12" md="3">
                    Grzesiek
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label>Gender</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="form-control-static">Male</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="date-input">Phone number</Label>
                    </Col>
                    <Col xs="12" md="3">
                    099 888 777
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <Link style={{ textDecoration: 'none' }} to="/edit-user-info" >
                        <Button block color="secondary">Edit Profile</Button>
                      </Link>
                    </Col>
                  </FormGroup>                 
                </Form>
              </CardBody>             
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Forms;
