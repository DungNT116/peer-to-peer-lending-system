import React from "react";
import { connect } from 'react-redux';

// reactstrap components
import { 
    Button,
    Card,
    Container,
    Row,
    Col,
    Label,
    FormGroup,
    // CardHeader,
    // CardBody,
    CardFooter,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    Progress,
    // InputGroup,
    Input
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
// import { Input } from "glamorous";

class ViewDetailRequest extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      modal: false,
      timeout: 300,
      editable : false,
      borrowDay: '',
      payBackDay: '',
      borrowDuration: '',
      typeOfContact: ''
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.makeDeal = this.makeDeal.bind(this);
    this.saveDeal = this.saveDeal.bind(this);
    this.onBorrowDayChange = this.onBorrowDayChange.bind(this);
    this.onPayBackDayChange = this.onPayBackDayChange.bind(this);
    this.onBorrowDurationChange = this.onBorrowDurationChange.bind(this);
    this.onTypeOfContactChange = this.onTypeOfContactChange.bind(this);
  }
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    document.getElementById("borrowDay").value = "2014-02-09";
    document.getElementById("payBackDay").value = "2014-02-09";
    document.getElementById("saveDealButton").style.display = "none";
    document.getElementById("duration").value = 1;
    // document.getElementById("contactType").value = 1;
    document.getElementById("borrowDay").style.display = "none";
    document.getElementById("duration").style.display = "none";
    // document.getElementById("contactType").style.display = "none";
    document.getElementById("payBackDay").style.display = "none";

    // console.log("request " +this.props.request.data);
    // console.log(this.props.request.data.amount * (this.props.request.data.duration / 30) * 1.5 / 100);
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  makeDeal() {
    this.setState({
      editable: !this.state.editable,
      //when load data from api, set default data for edit field
      //when save deal p tags will have data, if we dont set it
      //p tags will have no data, if we doesnt change anything
      borrowDay: "2014-02-09",
      borrowDuration: 1,
      typeOfContact: 1,
      payBackDay: "2014-02-09"
    });
    //button visiable and invisible
    document.getElementById("dealButton").style.display = "none";
    document.getElementById("acceptButton").style.display = "none";
    document.getElementById("saveDealButton").style.display = "";

    //display field to edit data
    document.getElementById("borrowDay").style.display = "";
    document.getElementById("duration").style.display = "";
    // document.getElementById("contactType").style.display = "";
    document.getElementById("payBackDay").style.display = "";

    //hidden p tags
    document.getElementById("borrowDayText").style.display = "none";
    document.getElementById("durationText").style.display = "none";
    // document.getElementById("contactTypeText").style.display = "none";
    document.getElementById("payBackText").style.display = "none";

    //select default value
    document.getElementById("borrowDay").value = this.state.borrowDay;
    document.getElementById("payBackDay").value = this.state.payBackDay;
    document.getElementById("duration").value = this.state.borrowDuration;
    // document.getElementById("contactType").value = this.state.typeOfContact;
  }

  saveDeal() {
    this.setState({ editable: !this.state.editable});
    //button
    document.getElementById("dealButton").style.display = "";
    document.getElementById("acceptButton").style.display = "";
    document.getElementById("saveDealButton").style.display = "none";

    //hidden field to edit data
    document.getElementById("borrowDay").style.display = "none";
    document.getElementById("duration").style.display = "none";
    // document.getElementById("contactType").style.display = "none";
    document.getElementById("payBackDay").style.display = "none";

    //display p tags
    document.getElementById("borrowDayText").style.display = "";
    document.getElementById("durationText").style.display = "";
    // document.getElementById("contactTypeText").style.display = "";
    document.getElementById("payBackText").style.display = "";

    document.getElementById("borrowDayText").innerHTML = this.state.borrowDay;    
    document.getElementById("durationText").innerHTML = this.state.borrowDuration;    
    // document.getElementById("contactTypeText").innerHTML = this.state.typeOfContact;    
    document.getElementById("payBackText").innerHTML = this.state.payBackDay;    
  }

  onBorrowDayChange(event) {
    this.setState({
      borrowDay: new Date(event.target.value).toLocaleDateString()
    })
  }
  onPayBackDayChange(event) {
    this.setState({
      payBackDay: new Date(event.target.value).toLocaleDateString()
    })
  }

  onBorrowDurationChange(event) {
    this.setState({
      borrowDuration: event.target.value
    })
  }

  onTypeOfContactChange(event) {
    this.setState({
      typeOfContact: event.target.value
    })
  }

  render() {
    return (
      <>
        <DemoNavbar />
        <main className="profile-page" ref="main">
          <section className="section-profile-cover section-shaped my-0">
            {/* Circles background */}
            <div className="shape shape-style-1 shape-default alpha-4">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            {/* SVG separator */}
            <div className="separator separator-bottom separator-skew">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
          
          <section className="section">
            <Container>
              <Card className="card-profile shadow mt--300">
                <div className="px-4">
                <div className="text-center mt-5">
                    <h3>
                    <strong>Detail Request</strong>
                    </h3>
                  </div>
                  <div className="mt-5 py-5 border-top">
                    <Row className="justify-content-center">
                      <Col lg="12">
                      {/* <Card> */}
              {/* <CardHeader> */}
                
              {/* </CardHeader> */}
              {/* <CardBody> */}
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  <FormGroup row className="py-2">
                    <Col lg="3" md="3">
                      <Label className="h6">Borrower Name</Label>
                    </Col>
                    <Col xs="12" md="9" lg="9">
                      <p className="h6">{this.props.request.data.borrower.firstName} {this.props.request.data.borrower.lastName}</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row className="py-2">
                    <Col md="3">
                      <Label className="h6">Total amount</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="h6">{this.props.request.data.amount + (this.props.request.data.amount * (this.props.request.data.duration / 30) * 1.5 / 100)} VND</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row className="py-2">
                    <Col md="3">
                      <Label className="h6">Borrow Amount</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="h6">{this.props.request.data.amount} VND</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row className="py-2">
                    <Col md="4">
                      <Label className="h6">Borrow Duration</Label>
                    </Col>
                    <Col md="4">
                      <Label className="h6">Borrow Day</Label>
                    </Col>
                    <Col md="4">
                      <Label className="h6">Pay Back Day</Label>
                    </Col>
                  </FormGroup>
                  <FormGroup row className="py-2">
                    <Col md="4">
                      <p className="h6" id="durationText">{this.props.request.data.duration} days</p>
                      <Input type="select" name="duration" id="duration"
                        disabled={!this.state.editable}
                        onChange={this.onBorrowDurationChange}
                        >
                        <option value="0">Please select</option>
                        <option value="1">30 days</option>
                        <option value="2">90 days</option>
                        <option value="3">1 Years(365 days)</option>
                      </Input>
                    </Col>
                    <Col md="4">
                      <p className="h6" id="borrowDayText">17/05/2019</p>
                      <Input
                        id="borrowDay"
                        type="date"
                        disabled={!this.state.editable}
                        onChange={this.onBorrowDayChange}
                        />
                    </Col>
                    <Col md="4">
                      <p className="h6" id="payBackText">16/06/2019</p>
                      <Input
                        id="payBackDay"
                        type="date"
                        disabled={!this.state.editable}
                        onChange={this.onPayBackDayChange}
                        />
                    </Col>
                  </FormGroup>
                  <FormGroup row className="py-2">
                    <Col md="3">
                      <Label className="h6">Interest Rate</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="h6">18% per Year</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row className="py-2">
                    <Col md="3">
                      <Label className="h6">Interest Received</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="h6">{this.props.request.data.amount * (this.props.request.data.duration / 30) * 1.5 / 100} VND</p>
                    </Col>
                  </FormGroup>
                  {/* <FormGroup row className="py-2">
                    <Col md="3">
                      <Label className="h6">Service Fee</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="h6">0 VND</p>
                    </Col>
                  </FormGroup> */}
                  {/* <FormGroup row className="py-2">
                    <Col md="3">
                      <Label className="h6">Type of contact</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="h6" id="contactTypeText">Pay at the end of the term</p>
                      <Input type="select" name="contactType" id="contactType"
                        disabled={!this.state.editable}
                        onChange={this.onTypeOfContactChange}
                        >
                        <option value="0">Please select</option>
                        <option value="1">Pay end of the term</option>
                        <option value="2">Pay many times</option>
                      </Input>
                    </Col>
                  </FormGroup> */}
                  <FormGroup>
                    {/* <Col xs="12" md="12">
                      <p className="">Timeline is here =))</p>
                    </Col> */}
                    <Col lg="12">
          <h5 className="h5 text-success font-weight-bold mb-4">
            TimeLine
          </h5>
          <div className="progress-wrapper">
            <div className="progress-info">
              <div className="progress-label">
                <span>Task completed</span>
              </div>
              <div className="progress-percentage">
                <span>40%</span>
              </div>
            </div>
            <Progress max="100" value="25" color="default" />
          </div>
          <div className="progress-wrapper">
            <div className="progress-info">
              <div className="progress-label">
                <span>Task completed</span>
              </div>
              <div className="progress-percentage">
                <span>60%</span>
              </div>
            </div>
            <Progress max="100" value="60" />
          </div>
        </Col>
                  </FormGroup>
                </Form>
              {/* </CardBody> */}
              <CardFooter className="text-center">
                <Button type="submit" id="dealButton" size="md" color="primary" onClick={this.makeDeal} disabled={this.state.editable}><i className="fa fa-dot-circle-o"></i> Make Deal</Button>{' '}
                <Button type="submit" id="saveDealButton" size="md" color="primary" onClick={this.saveDeal} disabled={!this.state.editable}><i className="fa fa-dot-circle-o"></i> Save Deal</Button>{' '}
                <Button type="submit" id="acceptButton" size="md" color="primary" onClick={this.toggleModal} disabled={this.state.editable}><i className="fa fa-dot-circle-o"></i> Accept</Button>{' '}
                {/* <Button type="reset" size="md" color="danger"><i className="fa fa-ban"></i> Delete</Button>{' '}
                <Button type="reset" size="md" color="danger"><i className="fa fa-ban"></i> Reset</Button> */}
              </CardFooter>
            {/* </Card> */}
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
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card>
            </Container>
          </section>
        </main>
        <SimpleFooter />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    request: state.request,
    tokenReducer: state.tokenReducer
  }
}
// const mapDispatchToProps = (dispatch) => {
//   return {
//     setRequest: (id) => {
//       dispatch({
//         type: "SET_REQUEST",
//         payload: id
//       });
//     }
//   }
// }

export default connect(mapStateToProps)(ViewDetailRequest);

