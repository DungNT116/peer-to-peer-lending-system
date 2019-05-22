import React, { Component } from 'react';
import {
  // Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  // Collapse,
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
  // Input,
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

    // this.toggle = this.toggle.bind(this);
    // this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      modal: false,
      // collapse: false,
      // fadeIn: true,
      timeout: 300
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  // toggle() {
  //   this.setState({ collapse: !this.state.collapse });
  // }

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
                <strong>Detail Request</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  <FormGroup row>
                    <Col md="3">
                      <Label>Borrower Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="form-control-static">Dung Nguyen</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label>Total amount</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="form-control-static">10,147,940 VND</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label>Borrow Amount</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="form-control-static">10,000,000 VND</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <Label>Borrow Duration</Label>
                    </Col>
                    <Col md="4">
                      <Label>Borrow Day</Label>
                    </Col>
                    <Col md="4">
                      <Label>Pay Back Day</Label>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <p className="form-control-static">30 days</p>
                    </Col>
                    <Col md="4">
                      <p className="form-control-static">17/05/2019</p>
                    </Col>
                    <Col md="4">
                      <p className="form-control-static">16/06/2019</p>
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
                      <Label>Interest Received</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="form-control-static">147,945 VND</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label>Service Fee</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="form-control-static">0 VND</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label>Type of contact</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="form-control-static">Pay at the end of the term</p>
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col xs="12" md="12">
                      <p className="form-control-static">Timeline is here =))</p>
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="md" color="primary" onClick={this.toggleModal}><i className="fa fa-dot-circle-o"></i> Submit</Button>{' '}
                <Button type="submit" size="md" color="primary" onClick={this.toggleModal}><i className="fa fa-dot-circle-o"></i> Change</Button>{' '}
                <Button type="reset" size="md" color="danger"><i className="fa fa-ban"></i> Delete</Button>{' '}
                <Button type="reset" size="md" color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
          <ModalHeader toggle={this.toggleModal}>Xac Nhan yeu cau vay muon</ModalHeader>
          <ModalBody>
            Ban co chac chan se chap nhan yeu cau nay khong
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
