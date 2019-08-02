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
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { database } from "../../firebase";

class DemoNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: []
    };
    this.logout = this.logout.bind(this);
    this.onResetCountView = this.onResetCountView.bind(this);
  }

  logout() {
    // localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  }

  async componentDidMount() {
    let headroom = new Headroom(document.getElementById("navbar-main"));
    // initialise
    headroom.init();
  }
  async componentWillMount() {
    const username = localStorage.getItem("user");
    //query data get key of User exist
    if (username !== undefined && username !== null) {
      await database
        .ref("ppls")
        .orderByChild("username")
        .equalTo(username)
        .once("value", snapshot => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            this.setState({ keyUserFb: Object.keys(userData)[0] });
          }
        });

      //query notifications base on key get above
      const notificationRef = await database
        .ref("/ppls/" + this.state.keyUserFb + "/notification")
        .orderByKey()
        .limitToLast(100);
      await notificationRef.on("value", snapshot => {
        let notificationObj = snapshot.val();
        let notifications = [];
        if (notificationObj !== null && notificationObj !== undefined) {
          Object.keys(notificationObj).forEach(key =>
            notifications.push(notificationObj[key])
          );
          notifications = notifications.reverse().map(noti => {
            return { message: noti.message, user: noti.sender };
          });
          this.setState(prevState => ({
            notifications: notifications
          }));
        }
      });
      //get amounts new Notifications
      await database
        .ref("/ppls/" + this.state.keyUserFb + "/countNew")
        .on("value", snapshot => {
          this.setState({
            countNew: snapshot.val()
          });
        });
    }
  }
  //reset count view by clicking notification
  onResetCountView(event) {
    event.preventDefault();
    var upvotesRef = database.ref(
      "/ppls/" + this.state.keyUserFb + "/countNew"
    );
    upvotesRef.transaction(function(current_value) {
      return (current_value -= current_value);
    });
  }

  //function add new message to firebase when something happen
  onAddMessage(event) {
    event.preventDefault();
    var upvotesRef = database.ref(
      "/ppls/" + this.state.keyUserFb + "/countNew"
    );
    upvotesRef.transaction(function(current_value) {
      return (current_value || 0) + 1;
    });

    database
      .ref("/ppls/" + this.state.keyUserFb + "/notification/")
      .push({ message: this.input.value, sender: this.state.username });
  }

  render() {
    return (
      <>
        <header className="header-global">
          <Navbar
            className="navbar-main navbar-transparent navbar-light headroom"
            expand="lg"
            id="navbar-main"
          >
            <Container>
              <NavbarBrand
                className="mr-lg-5"
                to={(() => {
                  if (localStorage.getItem("isLoggedIn")) {
                    return "/view-new-request";
                  } else {
                    return "/";
                  }
                })()}
                tag={Link}
              >
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
                          src={require("assets/img/brand/logo-white.png")}
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
                  {localStorage.getItem("isLoggedIn") ? (
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
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  ) : (
                    ""
                  )}
                  {localStorage.getItem("isLoggedIn") ? (
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
                  ) : (
                    ""
                  )}
                  {localStorage.getItem("isLoggedIn") ? (
                    <UncontrolledDropdown nav>
                      <DropdownToggle nav>
                        <i className="ni ni-collection d-lg-none mr-1" />
                        <span className="nav-link-inner--text">
                          My Requests
                        </span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem to="/view-new-request" tag={Link}>
                          Own Requests
                        </DropdownItem>
                        <DropdownItem to="/view-own-transactions" tag={Link}>
                          Own Transactions
                        </DropdownItem>
                        <DropdownItem to="/view-request-trading" tag={Link}>
                          Requests Trading
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  ) : (
                    ""
                  )}
                </Nav>
                <Nav
                  className="align-items-lg-center navbar-nav-hover ml-lg-auto"
                  navbar
                >
                  <NavItem className="d-none d-lg-block ml-lg-4">
                    {localStorage.getItem("isLoggedIn") ? (
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
                        <span className="nav-link-inner--text ml-1">Login</span>
                      </Button>
                    )}
                    {localStorage.getItem("isLoggedIn") ? (
                      ""
                    ) : (
                      <Button
                        className="btn-neutral btn-icon"
                        color="default"
                        href="/register-page"
                      >
                        <span className="btn-inner--icon">
                          <i className="ni ni-key-25 mr-2" />
                        </span>
                        <span className="nav-link-inner--text ml-1">
                          register
                        </span>
                      </Button>
                    )}
                    {localStorage.getItem("isLoggedIn") ? (
                      <div>
                        <UncontrolledDropdown nav>
                          <DropdownToggle nav>
                            <Media className="align-items-center">
                              <span
                                className="avatar avatar-sm rounded-circle"
                                style={{ backgroundColor: "white" }}
                              >
                                <img
                                  alt="..."
                                  src={require("assets/img/theme/icon_smartinbox.svg")}
                                />
                                <NotificationBadge
                                  count={this.state.countNew}
                                  effect={Effect.SCALE}
                                />
                              </span>
                            </Media>
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem>
                              <h6 className="text-overflow m-0">
                                Notification
                              </h6>
                            </DropdownItem>
                            <div
                              style={{
                                height: "auto",
                                maxHeight: "200px",
                                overflowX: "hidden"
                              }}
                            >
                              {this.state.notifications.map((noti, index) => {
                                return (
                                  <div key={index}>
                                    <DropdownItem divider />
                                    <DropdownItem
                                      href="#"
                                      onClick={this.onResetCountView}
                                    >
                                      <span>{noti.message}</span>
                                      <strong>{" - " + noti.user}</strong>
                                    </DropdownItem>
                                  </div>
                                );
                              })}
                            </div>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav>
                          <DropdownToggle nav>
                            <Media className="align-items-center">
                              <span className="avatar avatar-sm rounded-circle">
                                <img
                                  alt="..."
                                  src={require("assets/img/theme/team-4-800x800.png")}
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
                            <DropdownItem
                              className="noti-title"
                              header
                              tag="div"
                            >
                              <h6 className="text-overflow m-0">Welcome!</h6>
                            </DropdownItem>
                            <DropdownItem to="/profile-page" tag={Link}>
                              <i className="ni ni-single-02" />
                              <span>My profile</span>
                            </DropdownItem>
                            {/* <DropdownItem to="/admin/user-profile" tag={Link}>
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
                          </DropdownItem> */}
                            <DropdownItem divider />
                            <DropdownItem
                              href="/"
                              onClick={() => this.logout()}
                            >
                              <i className="ni ni-user-run" />
                              <span>Logout</span>
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
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
