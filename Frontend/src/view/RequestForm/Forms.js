import React, { Component } from 'react';
import {
  // Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  // DropdownItem,
  // DropdownMenu,
  // DropdownToggle,
  // Fade,
  Form,
  FormGroup,
  // FormText,
  // FormFeedback,
  Input,
  // InputGroup,
  // InputGroupAddon,
  // InputGroupButtonDropdown,
  // InputGroupText,
  Label,
  Row,
} from 'reactstrap';

class Forms extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    // this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      modal: false,
      collapse: false,
      fadeIn: true,
      timeout: 300
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  // toggleFade() {
  //   this.setState((prevState) => { return { fadeIn: !prevState } });
  // }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardHeader>
                <strong>Request Form</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  <FormGroup row>
                    <Col md="3">
                      <Label>Borrower Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Borrower's name" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label>Amount</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Enter the amount you need" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="date-input">Borrow Day</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="date" id="date-input" name="date-input" placeholder="borrow day" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="duration">Borrow Duration</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="duration" id="duration">
                        <option value="0">Please select</option>
                        <option value="1">30 days</option>
                        <option value="2">90 days</option>
                        <option value="3">1 Years(365 days)</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label>Interest Rate</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="form-control-static">18% per Year</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="contact">Type of contact</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="contact" id="contact" onChange={this.toggle}>
                        <option value="0">pay at the end of the term</option>
                        <option value="1">pay tung phan</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Collapse isOpen={this.state.collapse}>
                      <Card>
                        <CardBody>
                          TimeLine is here =)))
                        </CardBody>
                      </Card>
                    </Collapse>
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary" onClick={this.toggleModal}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
          <ModalHeader toggle={this.toggleModal}>Xac Nhan yeu cau vay muon</ModalHeader>
          <ModalBody>
            Ban co chac chan se tao yeu cau nay khong
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleModal}>Yes</Button>{' '}
            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Forms;
