import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
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
          <Col xs="12" md="9">
            <Card>
              <CardHeader>
                <strong>Change password</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" className="form-horizontal">
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="hf-password">Your current passowrd</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password" id="hf-password" name="hf-password" placeholder="Enter Your Current Password..." autoComplete="current-password" />
                      <FormText className="help-block">Enter the password you current using</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="hf-password">Enter Your New Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password" id="hf-password" name="hf-password" placeholder="Enter New Password..." />
                      <FormText className="help-block">Please enter your new password</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="hf-password">Re-Enter Your New Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password" id="hf-password" name="hf-password" placeholder="Re-Enter New Password..." />
                      <FormText className="help-block">Please re-enter your new password</FormText>
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Forms;
