import React from "react";

import { connect } from "react-redux";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Modal,
  CardFooter,
  Collapse,
  Row,
  Col
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.jsx";

import { css } from "@emotion/core";
import { PulseLoader } from "react-spinners";
import Header from "components/Headers/Header.jsx";

import { apiLink } from "../api";
class DocumentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: [],
      isOpen: true,
      loading: true,
      //collapse
      collapse: false,
      accordion: [true, false, false],
      custom: [true, false],
      status: "Closed",
      fadeIn: true,
      timeout: 300
    };

    this.onEntering = this.onEntering.bind(this);
    this.onEntered = this.onEntered.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.toggleCustom = this.toggleCustom.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.setSrcImgBase64 = this.setSrcImgBase64.bind(this);
  }

  onEntering() {
    this.setState({ status: "Opening..." });
  }

  onEntered() {
    this.setState({ status: "Opened" });
  }

  onExiting() {
    this.setState({ status: "Closing..." });
  }

  onExited() {
    this.setState({ status: "Closed" });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleAccordion(tab) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));

    this.setState({
      accordion: state
    });
  }

  toggleCustom(tab) {
    const prevState = this.state.custom;
    const state = prevState.map((x, index) => (tab === index ? !x : false));

    this.setState({
      custom: state
    });
  }

  toggleFade() {
    this.setState({ fadeIn: !this.state.fadeIn });
  }

  setSrcImgBase64(type, image) {
    return "data:" + type + ";base64, " + image;
  }
  async componentWillMount() {
    await fetch(
      apiLink +
        "/rest/documentFile/getDocumentFiles?id=" +
        this.props.document.idDoc,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        }
      }
    ).then(result => {
      if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login");
      } else if (result.status === 200) {
        result.json().then(data => {
          this.setState({
            docs: data,
            isOpen: false,
            loading: false
          });
        });
      }
    });
  }
  toggleModal = stateParam => {
    this.setState({
      [stateParam]: !this.state[stateParam]
    });
  };
  render() {
    const override = css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      padding-left: 0;
    `;
    const style = {
      profileComponent: {
        position: "relative",
        top: -250
      },
      myAccount: {
        position: "relative",
        top: -150
      },
      sameSizeWithParent: {
        width: "100%",
        height: "100%"
      }
    };
    console.log(this.state.docs);
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Modal
            className="modal-dialog-centered"
            isOpen={this.state.isOpen}
            toggle={() => this.toggleModal("defaultModal")}
            style={style.sameSizeWithParent}
          >
            <div className="modal-header">
              <h3 className="modal-title" id="modal-title-default">
                Loading
              </h3>
            </div>
            <div className="modal-body">
              <PulseLoader
                css={override}
                sizeUnit={"px"}
                size={15}
                color={"#123abc"}
                loading={this.state.loading}
              />
            </div>
          </Modal>
          <Row>
            <Col className="order-xl-1" xl="10">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">{this.props.document.docType}</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Username
                            </label>
                            <br />
                            <span className="description">
                              {this.state.docs
                                .slice(0, 1)
                                .map(data => data.document.user.username)}
                            </span>
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Full Name
                            </label>
                            <br />
                            <span className="description">
                              {this.state.docs
                                .slice(0, 1)
                                .map(
                                  data =>
                                    data.document.user.firstName +
                                    " " +
                                    data.document.user.lastName
                                )}
                            </span>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>

                    <hr className="my-4" />
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label>Id Card</label>
                          <Input
                            className="form-control-alternative"
                            id="input-postal-code"
                            placeholder="12390849128"
                            type="number"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label>Validate ID(Admin)</label>
                          <Input
                            className="form-control-alternative"
                            id="input-postal-code"
                            placeholder="12390849128"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label>Validation</label>
                          <br />
                          <Button
                            type="button"
                            size="md"
                            className="btn btn-outline-primary"
                            // onClick={() => this.setDataToDetailPage(doc)}
                          >
                            Validate
                          </Button>
                          <Button
                            type="button"
                            size="md"
                            className="btn btn-outline-danger"
                            // onClick={() => this.setDataToDetailPage(doc)}
                          >
                            Reject
                          </Button>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      {this.state.docs.map((imageData, index) => (
                        <Col lg="4" key={index}>
                          <img
                            src={this.setSrcImgBase64(
                              imageData.fileType,
                              imageData.data
                            )}
                            style={style.sameSizeWithParent}
                          />
                        </Col>
                      ))}
                      {/* {this.state.docs.forEach(element => (
                            <img src={this.setSrcImgBase64(element.fileType,element.data)}/>
                          ))} */}
                    </Row>
                    <hr className="my-4" />
                    <div id="accordion" style={{ width: "95%" }}>
                      <Card className="mb-0">
                        <CardHeader id="headingOne">
                          <Button
                            block
                            color="link"
                            className="text-left m-0 p-0"
                            onClick={() => this.toggleAccordion(0)}
                            aria-expanded={this.state.accordion[0]}
                            aria-controls="collapseOne"
                          >
                            <h5 className="m-0 p-0">Id card</h5>
                          </Button>
                        </CardHeader>
                        <Collapse
                          isOpen={this.state.accordion[0]}
                          data-parent="#accordion"
                          id="collapseOne"
                          aria-labelledby="headingOne"
                        >
                          <CardBody>
                            <Row>
                              <Col lg="6">
                                <img src="https://www.idcreator.com/media/sc/id-card-templates/drone_pilots_license_2_featured.png" />
                              </Col>
                              <Col lg="6">
                                <select name="cars">
                                  <option value="">$100.000</option>
                                  <option value="">$200.000</option>
                                  <option value="">$300.000</option>
                                  <option value="">$400.000</option>
                                </select>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="4">
                                <FormGroup>
                                  <label>Id Card</label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-postal-code"
                                    placeholder="12390849128"
                                    type="number"
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="4">
                                <FormGroup>
                                  <label>Name on card</label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-postal-code"
                                    placeholder="Tran Van A"
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="4">
                                <FormGroup>
                                  <label>Create Date</label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-postal-code"
                                    placeholder="Wednesday, December 25"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </CardBody>
                        </Collapse>
                      </Card>
                      <Card className="mb-0">
                        <CardHeader id="headingTwo">
                          <Button
                            block
                            color="link"
                            className="text-left m-0 p-0"
                            onClick={() => this.toggleAccordion(1)}
                            aria-expanded={this.state.accordion[1]}
                            aria-controls="collapseTwo"
                          >
                            <h5 className="m-0 p-0">
                              Collapsible Group Item #2
                            </h5>
                          </Button>
                        </CardHeader>
                        <Collapse
                          isOpen={this.state.accordion[1]}
                          data-parent="#accordion"
                          id="collapseTwo"
                        >
                          <CardBody>
                            2. Anim pariatur cliche reprehenderit, enim eiusmod
                            high life accusamus terry richardson ad squid. 3
                            wolf moon officia aute, non cupidatat skateboard
                            dolor brunch. Food truck quinoa nesciunt laborum
                            eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put
                            a bird on it squid single-origin coffee nulla
                            assumenda shoreditch et. Nihil anim keffiyeh
                            helvetica, craft beer labore wes anderson cred
                            nesciunt sapiente ea proident. Ad vegan excepteur
                            butcher vice lomo. Leggings occaecat craft beer
                            farm-to-table, raw denim aesthetic synth nesciunt
                            you probably haven't heard of them accusamus labore
                            sustainable VHS.
                          </CardBody>
                        </Collapse>
                      </Card>
                      <Card className="mb-0">
                        <CardHeader id="headingThree">
                          <Button
                            block
                            color="link"
                            className="text-left m-0 p-0"
                            onClick={() => this.toggleAccordion(2)}
                            aria-expanded={this.state.accordion[2]}
                            aria-controls="collapseThree"
                          >
                            <h5 className="m-0 p-0">
                              Collapsible Group Item #3
                            </h5>
                          </Button>
                        </CardHeader>
                        <Collapse
                          isOpen={this.state.accordion[2]}
                          data-parent="#accordion"
                          id="collapseThree"
                        >
                          <CardBody>
                            3. Anim pariatur cliche reprehenderit, enim eiusmod
                            high life accusamus terry richardson ad squid. 3
                            wolf moon officia aute, non cupidatat skateboard
                            dolor brunch. Food truck quinoa nesciunt laborum
                            eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put
                            a bird on it squid single-origin coffee nulla
                            assumenda shoreditch et. Nihil anim keffiyeh
                            helvetica, craft beer labore wes anderson cred
                            nesciunt sapiente ea proident. Ad vegan excepteur
                            butcher vice lomo. Leggings occaecat craft beer
                            farm-to-table, raw denim aesthetic synth nesciunt
                            you probably haven't heard of them accusamus labore
                            sustainable VHS.
                          </CardBody>
                        </Collapse>
                      </Card>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    document: state.document
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setDocument: idDoc => {
      dispatch({
        type: "SET_DETAIL_DOCUMENT_DATA",
        payload: idDoc
      });
    },
    setDocType: documentType => {
      dispatch({
        type: "SET_TYPE_DOCUMENT_DATA",
        payload: documentType
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentDetail);
