import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import {
  Button,
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
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
    this.onEntering = this.onEntering.bind(this);
    this.onEntered = this.onEntered.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.toggleCustom = this.toggleCustom.bind(this);
    this.state = {
      collapse: false,
      accordion: [true, false, false],
      custom: [true, false],
      status: 'Closed',
      fadeIn: true,
      timeout: 300,
    };
  }

  onEntering() {
    this.setState({ status: 'Opening...' });
  }

  onEntered() {
    this.setState({ status: 'Opened' });
  }

  onExiting() {
    this.setState({ status: 'Closing...' });
  }

  onExited() {
    this.setState({ status: 'Closed' });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleAccordion(tab) {

    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }

  toggleCustom(tab) {

    const prevState = this.state.custom;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      custom: state,
    });
  }

  toggleFade() {
    this.setState({ fadeIn: !this.state.fadeIn });
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
                    <Col xl="10">
                      <Card>
                        <CardHeader>
                          <i className="fa fa-align-justify"></i> Image <small>Paper</small>
                          <div className="card-header-actions">
                            <Badge>NEW</Badge>
                          </div>
                        </CardHeader>
                        <CardBody>
                          <div id="accordion">
                            <Card className="mb-0">
                              <CardHeader id="headingOne">
                                <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)} aria-expanded={this.state.accordion[0]} aria-controls="collapseOne">
                                  <h5 className="m-0 p-0">Identity Card</h5>
                                </Button>
                              </CardHeader>
                              <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                                <CardBody>
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/70/Osobna_iskaznica_2015_-_prednja_strana.jpg" />
                                </CardBody>
                              </Collapse>
                            </Card>
                            <Card className="mb-0">
                              <CardHeader id="headingTwo">
                                <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(1)} aria-expanded={this.state.accordion[1]} aria-controls="collapseTwo">
                                  <h5 className="m-0 p-0">Land Use Rights Certificate</h5>
                                </Button>
                              </CardHeader>
                              <Collapse isOpen={this.state.accordion[1]} data-parent="#accordion" id="collapseTwo">
                                <CardBody>
                                  <img src="https://icdn.dantri.com.vn/k:aae6c9d50c/2015/12/30/2-1451444507637/thanh-hoa-ky-la-mot-thua-dat-cap-hai-so-do.jpg" />
                                </CardBody>
                              </Collapse>
                            </Card>
                            <Card className="mb-0">
                              <CardHeader id="headingThree">
                                <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(2)} aria-expanded={this.state.accordion[2]} aria-controls="collapseThree">
                                  <h5 className="m-0 p-0">Household</h5>
                                </Button>
                              </CardHeader>
                              <Collapse isOpen={this.state.accordion[2]} data-parent="#accordion" id="collapseThree">
                                <CardBody>
                                  <img src="http://vietnamcentrepoint.edu.vn/nus/image1/HoKhau.jpg" />
                                </CardBody>
                              </Collapse>
                            </Card>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>

                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Accept</Button>
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Refuse</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Forms;
