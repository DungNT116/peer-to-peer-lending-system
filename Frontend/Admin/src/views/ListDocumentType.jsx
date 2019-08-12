import React from 'react';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  Col,
  Input,
  Table,
  Container,
  Modal,
  Row,
  FormGroup,
} from 'reactstrap';
// core components

import Cleave from 'cleave.js/react';
import {Link, Redirect} from 'react-router-dom';
import Pagination from './examples/Pagination';
import Header from 'components/Headers/Header.jsx';
import {PulseLoader} from 'react-spinners';
import {apiLink} from '../api';

import {css} from '@emotion/core';
class ListDocumentType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idDoc: '',
      nameDoc: '',
      amountDoc: '',
      acronymDoc: '',
      documentTypes: [],
      invalidAmount: true,
      invalidName: true,
      invalidAcronym: true,
      errorAmount: '',
      errorAcronymDoc: '',
      loading: true,
    };
    this.getDocumentTypeList = this.getDocumentTypeList.bind(this);
    // this.setDataToDetailPage = this.setDataToDetailPage.bind(this);
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.editDocument = this.editDocument.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAcronymChange = this.handleAcronymChange.bind(this);
    this.addNewDocument = this.addNewDocument.bind(this);
    this.onAmountCleaveChange = this.onAmountCleaveChange.bind(this);
  }

  getDocumentTypeList() {
    fetch(apiLink + '/rest/documentType/listDocumentType', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
        // "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      },
    }).then(result => {
      if (result.status === 401) {
        localStorage.removeItem('isLoggedIn');
        this.props.history.push('/login');
      } else if (result.status === 200) {
        result.json().then(data => {
          console.log(data);
          this.setState({
            documentTypes: data,
            loading: false,
          });
        });
      }
    });
  }

  editDocument() {
    fetch(apiLink + '/rest/admin/documentType/updateDocumentType', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        id: this.state.idDoc,
        name: this.state.nameDoc,
        amountLimit: Number(this.state.amountDoc),
        acronymDoc : this.state.acronymDoc
      }),
    }).then(result => {
      if (result.status === 200) {
        window.alert('save success !');

        this.getDocumentTypeList();
      } else if (result.status === 401) {
        localStorage.removeItem('isLoggedIn');
        this.props.history.push('/login-page');
      }
    });
  }
  componentWillMount() {
    this.getDocumentTypeList();
  }

  componentWillUpdate() {
    if (
      localStorage.getItem('isLoggedIn') == '' ||
      localStorage.getItem('isLoggedIn') == undefined
    ) {
      this.props.history.push('/login');
    }
  }
  convertTimeStampToDate(date) {
    var timestampToDate = new Date(date * 1000);
    return timestampToDate.toLocaleDateString();
  }
  toggleModal = async stateParam => {
    this.setState({
      [stateParam]: !this.state[stateParam],
    });
    if (
      this.state.idDoc !== '' ||
      this.state.amountDoc !== '' ||
      this.state.nameDoc !== '' ||
      this.state.acronymDoc !== ''
    ) {
      await this.setState({
        idDoc: '',
        amountDoc: '',
        acronymDoc: '',
        nameDoc: '',
        errorNameDoc: '',
        errorAmount: '',
        errorAcronymDoc: '',
      });
    }
  };
  addNewDocument() {
    fetch(apiLink + '/rest/admin/documentType/newDocumentType', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        name: this.state.nameDoc,
        amountLimit: Number(this.state.amountDoc),
        acronymDoc : this.state.acronymDoc
      }),
    }).then(result => {
      if (result.status === 200) {
        window.alert('add success !');

        this.getDocumentTypeList();
      } else if (result.status === 401) {
        localStorage.removeItem('isLoggedIn');
        this.props.history.push('/login-page');
      }
    });
  }
  handleNameChange(event) {
    // console.log(event.target.value);
    var nameDocument = event.target.value;
    if (nameDocument == undefined || nameDocument == '') {
      this.setState({
        nameDoc: nameDocument,
        errorNameDoc: 'Document name can not be blank !',
        invalidName: true,
      });
    } else {
      this.setState({
        nameDoc: nameDocument,
        errorNameDoc: '',
        invalidName: false,
      });
    }
  }
  handleAcronymChange(event) {
    // console.log(event.target.value);
    var acronymDocument = event.target.value;
    if (acronymDocument == undefined || acronymDocument == '') {
      this.setState({
        acronymDoc: acronymDocument,
        errorAcronymDoc: 'Acronym can not be blank !',
        invalidAcronym: true,
      });
    } else {
      this.setState({
        acronymDoc: acronymDocument,
        errorAcronymDoc: '',
        invalidAcronym: false,
      });
    }
  }
  handleAmountChange(event) {
    this.setState({amountDoc: event.target.value});
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  onAmountCleaveChange(event) {
    var rawValue = event.target.rawValue;

    if (rawValue % 500000 !== 0) {
      if (rawValue >= 10000000) {
        //1 billion
        this.setState({
          amountDoc: rawValue,
          invalidAmount: true,
          errorAmount: 'The amount must be lower than 10 Million!',
        });
      } else {
        this.setState({
          amountDoc: rawValue,
          invalidAmount: true,
          errorAmount: 'The amount must be a multiple of 500.000 VNĐ !',
        });
      }
    } else {
      if (rawValue > 10000000) {
        //10 million
        this.setState({
          amountDoc: rawValue,
          invalidAmount: true,
          errorAmount: 'The amount must be lower than 10 Million!',
        });
      } else if (rawValue === '') {
        this.setState({
          amountDoc: rawValue,
          invalidAmount: true,
          errorAmount: '',
        });
      } else {
        this.setState({
          amountDoc: rawValue,
          invalidAmount: false,
          errorAmount: '',
        });
      }
    }
  }
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
        position: 'relative',
        top: -250,
      },
      myAccount: {
        position: 'relative',
        top: -150,
      },
      sameSizeWithParent: {
        width: '100%',
        height: '100%',
      },
    };
    const listDocumentType = this.state.documentTypes.map(
      (documentType, index) => (
        <tr key={index}>
          <td>
            <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
              {documentType.id}
            </Col>
          </td>
          <td>{documentType.name}</td>
          <td>{this.numberWithCommas(documentType.amountLimit)}</td>
          {/* <td>{documentTypes.lastName}</td> */}
          <td>{documentType.acronym}</td>
          <td>
            <Button
              onClick={() => {
                this.setState({
                  idDoc: documentType.id,
                  nameDoc: documentType.name,
                  amountDoc: documentType.amountLimit,
                  acronymDoc: documentType.acronym,
                });
                this.toggleModal('defaultModal-' + index);
              }}
            >
              Edit
            </Button>

            {/* <label className="custom-toggle">
              <input
                type="checkbox"
                checked={user.status == "active" ? true : false}
                onChange={() => this.toggleModal("defaultModal-" + index)}
              />
              <span className="custom-toggle-slider rounded-circle" />
            </label> */}
            <Modal
              className="modal-dialog-centered"
              isOpen={this.state['defaultModal-' + index]}
              toggle={() => this.toggleModal('defaultModal-' + index)}
            >
              <div className="modal-header">
                <h6 className="modal-title" id="modal-title-default">
                  Edit {this.state.nameDoc}
                </h6>
                <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggleModal('defaultModal-' + index)}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  {' '}
                  Change information of Document :{' '}
                  <strong>{this.state.nameDoc}</strong>
                  {/* <strong>{user.username}</strong>? */}
                </p>
                <FormGroup row>
                  <Col md="4">Id</Col>
                  <Col md="4">
                    <Input
                      type="text"
                      autoComplete="off"
                      value={this.state.idDoc}
                      disabled
                    />
                  </Col>
                </FormGroup>{' '}
                <FormGroup row>
                  <Col md="4">Name</Col>
                  <Col md="8">
                    <Input
                      placeholder="Name Document Type"
                      type="text"
                      autoComplete="off"
                      value={this.state.nameDoc}
                      onChange={this.handleNameChange}
                      required
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="12">
                    <strong
                      style={{
                        color: 'red',
                      }}
                    >
                      {this.state.errorNameDoc}
                    </strong>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="4">Amount Limit</Col>
                  <Col md="8">
                    <Cleave
                      placeholder="Amount Document Type"
                      options={{
                        numeral: true,
                        numeralThousandsGroupStyle: 'thousand',
                      }}
                      value={this.state.amountDoc}
                      onChange={this.onAmountCleaveChange}
                      style={{
                        display: 'block',
                        width: '100%',
                        height: 'calc(2.75rem + 2px)',
                        padding: '0.625rem 0.75rem',
                        fontSize: '1rem',
                        lineHeight: 1.5,
                        color: '#8898aa',
                        backgroundColor: '#fff',
                        backgroundClip: 'padding-box',
                        border: '1px solid #cad1d7',
                        borderRadius: '0.25rem',
                        boxShadow: 'none',
                      }}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="12">
                    <strong
                      style={{
                        color: 'red',
                      }}
                    >
                      {this.state.errorAmount}
                    </strong>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="4">Acronym</Col>
                  <Col md="8">
                    <Input
                      placeholder="Acronym Document Type"
                      type="text"
                      autoComplete="off"
                      value={this.state.acronymDoc}
                      onChange={this.handleAcronymChange}
                      required
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="12">
                    <strong
                      style={{
                        color: 'red',
                      }}
                    >
                      {this.state.errorAcronymDoc}
                    </strong>
                  </Col>
                </FormGroup>
              </div>
              <div className="modal-footer">
                <Button
                  color="warning"
                  data-dismiss="modal"
                  type="button"
                  outline
                  onClick={() => this.toggleModal('defaultModal-' + index)}
                >
                  Cancel
                </Button>
                <Button
                  className="ml-auto"
                  color="primary"
                  type="button"
                  outline
                  disabled={
                    this.state.invalidAmount ||
                    this.state.invalidName ||
                    this.state.invalidAcronym
                  }
                  onClick={() => {
                    this.editDocument();
                    this.toggleModal('defaultModal-' + index);
                  }}
                >
                  Save
                </Button>
              </div>
            </Modal>
          </td>
          {/* <td>
          <Link to="/view-detail-request">
            <Button
              type="button"
              id="dealButton"
              size="md"
              className="btn btn-outline-primary"
              // onClick={() => this.setDataToDetailPage(user)}
            >
              View Detail
            </Button>{" "}
          </Link>
        </td> */}
        </tr>
      )
    );
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow" style={style.sameSizeWithParent}>
                <Button
                  className="ml-auto"
                  color="success"
                  type="button"
                  outline
                  style={{position: 'relative', top: 50, right: 50}}
                  onClick={() => {
                    this.toggleModal('modalAdd');
                  }}
                >
                  Add new
                </Button>
                <Modal
                  className="modal-dialog-centered"
                  isOpen={this.state['modalAdd']}
                  toggle={() => this.toggleModal('modalAdd')}
                >
                  <div className="modal-header">
                    <h6 className="modal-title" id="modal-title-default">
                      Add new document type
                    </h6>
                    <button
                      aria-label="Close"
                      className="close"
                      data-dismiss="modal"
                      type="button"
                      onClick={() => this.toggleModal('modalAdd')}
                    >
                      <span aria-hidden={true}>×</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>
                      {' '}
                      Input information of Document :
                      {/* <strong>{user.username}</strong>? */}
                    </p>
                    <FormGroup row>
                      <Col md="4">Name</Col>
                      <Col md="8">
                        <Input
                          placeholder="Name Document Type"
                          type="text"
                          autoComplete="off"
                          value={this.state.nameDoc}
                          onChange={this.handleNameChange}
                          required
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="12">
                        <strong
                          style={{
                            color: 'red',
                          }}
                        >
                          {this.state.errorNameDoc}
                        </strong>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="4">Amount Limit</Col>
                      <Col md="8">
                        <Cleave
                          placeholder="Amount Document Type"
                          options={{
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand',
                          }}
                          onChange={this.onAmountCleaveChange}
                          style={{
                            display: 'block',
                            width: '100%',
                            height: 'calc(2.75rem + 2px)',
                            padding: '0.625rem 0.75rem',
                            fontSize: '1rem',
                            lineHeight: 1.5,
                            color: '#8898aa',
                            backgroundColor: '#fff',
                            backgroundClip: 'padding-box',
                            border: '1px solid #cad1d7',
                            borderRadius: '0.25rem',
                            boxShadow: 'none',
                          }}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="12">
                        <strong
                          style={{
                            color: 'red',
                          }}
                        >
                          {this.state.errorAmount}{' '}
                        </strong>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="4">Acronym</Col>
                      <Col md="8">
                        <Input
                          placeholder="Acronym Document Type"
                          type="text"
                          autoComplete="off"
                          value={this.state.acronymDoc}
                          onChange={this.handleAcronymChange}
                          required
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="12">
                        <strong
                          style={{
                            color: 'red',
                          }}
                        >
                          {this.state.errorAcronymDoc}
                        </strong>
                      </Col>
                    </FormGroup>
                  </div>
                  <div className="modal-footer">
                    <Button
                      color="warning"
                      data-dismiss="modal"
                      type="button"
                      outline
                      onClick={() => this.toggleModal('modalAdd')}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="ml-auto"
                      color="primary"
                      type="button"
                      outline
                      disabled={
                        this.state.invalidAmount ||
                        this.state.invalidName ||
                        this.state.invalidAcronym
                      }
                      onClick={() => {
                        this.addNewDocument();
                        this.toggleModal('modalAdd');
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </Modal>
                <CardHeader className="border-0">
                  <h3 className="mb-0">List Document Type</h3>
                </CardHeader>

                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Name Type</th>
                      <th scope="col">Amount Limit</th>
                      <th scope="col">Acronym</th>
                      {/* <th scope="col">Last Name</th> */}
                      <th scope="col">Edit</th>
                      {/* <th scope="col" /> */}
                    </tr>
                  </thead>
                  {listDocumentType == '' ? (
                    'No data is matching'
                  ) : (
                    <tbody>{listDocumentType}</tbody>
                  )}
                </Table>
                <PulseLoader
                  css={override}
                  sizeUnit={'px'}
                  size={15}
                  color={'#123abc'}
                  loading={this.state.loading}
                />
                {/* <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Row className="align-items-center justify-content-center text-center">
                      <Pagination
                        maxPage={this.state.maxPage}
                        currentPage={this.state.page}
                        onChange={this.getUserList}
                        changePage={this.changePage}
                      />
                    </Row>
                  </nav>
                </CardFooter> */}
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default ListDocumentType;
