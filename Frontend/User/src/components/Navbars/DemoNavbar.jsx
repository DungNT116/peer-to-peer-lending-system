import React from "react";
import { Link } from "react-router-dom";
// JavaScript plugin that hides or shows a component based on your scroll
import Headroom from "headroom.js";
// reactstrap components
import {
  Button,
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  // Media,
  NavbarBrand,
  Navbar,
  NavItem,
  // NavLink,
  Nav,
  Container,
  Row,
  Col,
  Media
  // UncontrolledTooltip
} from "reactstrap";

class DemoNavbar extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   isLoggedIn: false
    // }
    this.logout = this.logout.bind(this);
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  }

  async componentDidMount() {
    let headroom = new Headroom(document.getElementById("navbar-main"));
    // initialise
    headroom.init();
    // if (localStorage.getItem("isLoggedIn") !== null) {
    //   await this.setState({
    //     isLoggedIn: localStorage.getItem("isLoggedIn")
    //   });
    // }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if(this.state.isLoggedIn !== localStorage.getItem("isLoggedIn")) {
  //     return true;
  //   }
  //   return false;
  // }

  render() {
    // console.log(localStorage.getItem("isLoggedIn"))
    return (
      <>
        <header className="header-global">
          <Navbar
            className="navbar-main navbar-transparent navbar-light headroom"
            expand="lg"
            id="navbar-main"
          >
            <Container>
              <NavbarBrand className="mr-lg-5" to={(() => {
                  if (localStorage.getItem("isLoggedIn")) {
                    return "/view-new-request";
                  } else {
                    return "/";
                  }
                })()} 
                tag={Link}>
                <img
                  alt="..."
                  src={require("assets/img/brand/logo-white.png")}
                />
              </NavbarBrand>
              <button className="navbar-toggler" id="navbar_global">
                <span className="navbar-toggler-icon" />
              </button>
              <UncontrolledCollapse navbar toggler="#navbar_global">
                <div className="navbar-collapse-header">
                  <Row>
                    <Col className="collapse-brand" xs="6">
                      <Link to="/">
                        <img
                          alt="..."
                          src={require("assets/img/brand/argon-react.png")}
                        />
                      </Link>
                    </Col>
                    <Col className="collapse-close" xs="6">
                      <button className="navbar-toggler" id="navbar_global">
                        <span />
                        <span />
                      </button>
                    </Col>
                  </Row>
                </div>
                <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                  {/* <UncontrolledDropdown nav>
                    <DropdownToggle nav>
                      <i className="ni ni-ui-04 d-lg-none mr-1" />
                      <span className="nav-link-inner--text">Components</span>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-xl">
                      <div className="dropdown-menu-inner">
                        <Media
                          className="d-flex align-items-center"
                          href="https://demos.creative-tim.com/argon-design-system-react/#/documentation/overview?ref=adsr-navbar"
                          target="_blank"
                        >
                          <div className="icon icon-shape bg-gradient-primary rounded-circle text-white">
                            <i className="ni ni-spaceship" />
                          </div>
                          <Media body className="ml-3">
                            <h6 className="heading text-primary mb-md-1">
                              Getting started
                            </h6>
                            <p className="description d-none d-md-inline-block mb-0">
                              Learn how to use Argon compiling Scss, change
                              brand colors and more.
                            </p>
                          </Media>
                        </Media>
                        <Media
                          className="d-flex align-items-center"
                          href="https://demos.creative-tim.com/argon-design-system-react/#/documentation/colors?ref=adsr-navbar"
                          target="_blank"
                        >
                          <div className="icon icon-shape bg-gradient-success rounded-circle text-white">
                            <i className="ni ni-palette" />
                          </div>
                          <Media body className="ml-3">
                            <h6 className="heading text-primary mb-md-1">
                              Foundation
                            </h6>
                            <p className="description d-none d-md-inline-block mb-0">
                              Learn more about colors, typography, icons and the
                              grid system we used for Argon.
                            </p>
                          </Media>
                        </Media>
                        <Media
                          className="d-flex align-items-center"
                          href="https://demos.creative-tim.com/argon-design-system-react/#/documentation/alert?ref=adsr-navbar"
                          target="_blank"
                        >
                          <div className="icon icon-shape bg-gradient-warning rounded-circle text-white">
                            <i className="ni ni-ui-04" />
                          </div>
                          <Media body className="ml-3">
                            <h5 className="heading text-warning mb-md-1">
                              Components
                            </h5>
                            <p className="description d-none d-md-inline-block mb-0">
                              Browse our 50 beautiful handcrafted components
                              offered in the Free version.
                            </p>
                          </Media>
                        </Media>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown> */}
                  {/* {(this.state.isLoggedIn) ? */}
                  {(localStorage.getItem("isLoggedIn")) ?
                  // {this.state.isLoggedIn ? (
                    <UncontrolledDropdown nav>
                      <DropdownToggle nav>
                        <i className="ni ni-collection d-lg-none mr-1" />
                        <span className="nav-link-inner--text">Borrowing</span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem to="/create-request-page" tag={Link}>
                          Create Request
                        </DropdownItem>
                        <DropdownItem to="/view-history-request" tag={Link}>
                          View History Request
                        </DropdownItem>
                        <DropdownItem to="/view-new-request" tag={Link}>
                          View New Request
                        </DropdownItem>
                        <DropdownItem to="/view-request-trading" tag={Link}>
                          View Request Trading
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    : ""}
                  {(localStorage.getItem("isLoggedIn")) ?
                    <UncontrolledDropdown nav>
                      <DropdownToggle nav>
                        <i className="ni ni-collection d-lg-none mr-1" />
                        <span className="nav-link-inner--text">Lending</span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem to="/view-request-list" tag={Link}>
                          View Request
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    : ""}
                </Nav>
                <Nav className="align-items-lg-center navbar-nav-hover ml-lg-auto" navbar>
                  <NavItem className="d-none d-lg-block ml-lg-4">
                    {(localStorage.getItem("isLoggedIn")) ?
                    (
                      ""
                    ) : (
                      <Button
                        className="btn-neutral btn-icon"
                        color="default"
                        href="/login-page"
                      >
                        <span className="btn-inner--icon">
                          <i className="fa fa-user mr-2" />
                        </span>
                        <span className="nav-link-inner--text ml-1">
                          Login
                    </span>
                      </Button>
                    )}
                    {(localStorage.getItem("isLoggedIn")) ?
                    (
                      ""
                    ) : (
                      <Button
                        className="btn-neutral btn-icon"
                        color="default"
                        href="/register-page"
                      >
                        <span className="btn-inner--icon">
                          <i className="fa fa-user mr-2" />
                        </span>
                        <span className="nav-link-inner--text ml-1">
                          register
                    </span>
                      </Button>
                    )}
                    {(localStorage.getItem("isLoggedIn")) ? (
                      <UncontrolledDropdown nav>
                        <DropdownToggle nav>
                          <Media className="align-items-center">
                            <span className="avatar avatar-sm rounded-circle">
                              <img
                                alt="..."
                                src={require("assets/img/theme/team-4-800x800.jpg")}
                              />
                            </span>
                            <Media className="ml-2 d-none d-lg-block">
                              <span className="mb-0 text-sm font-weight-bold">
                                {localStorage.getItem("profile")}
                              </span>
                            </Media>
                          </Media>
                        </DropdownToggle>

                        <DropdownMenu>
                          <DropdownItem className="noti-title" header tag="div">
                            <h6 className="text-overflow m-0">Welcome!</h6>
                          </DropdownItem>
                          <DropdownItem to="/profile-page" tag={Link}>
                            <i className="ni ni-single-02" />
                            <span>My profile</span>
                          </DropdownItem>
                          <DropdownItem to="/admin/user-profile" tag={Link}>
                            <i className="ni ni-settings-gear-65" />
                            <span>Settings</span>
                          </DropdownItem>
                          <DropdownItem to="/admin/user-profile" tag={Link}>
                            <i className="ni ni-calendar-grid-58" />
                            <span>Activity</span>
                          </DropdownItem>
                          <DropdownItem to="/admin/user-profile" tag={Link}>
                            <i className="ni ni-support-16" />
                            <span>Support</span>
                          </DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem href="/" onClick={() => this.logout()}>
                            <i className="ni ni-user-run" />
                            <span>Logout</span>
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    ) : (
                      ""
                    )}
                  </NavItem>
                </Nav>
              </UncontrolledCollapse>
            </Container>
          </Navbar>
        </header>
      </>
    );
  }
}

export default DemoNavbar;
