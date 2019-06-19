import React from "react";

// nodejs library that concatenates classes
import classnames from "classnames";
import { connect } from "react-redux";
// reactstrap components
import {
  // Badge,
  Button,
  Card,
  CardBody,
  FormGroup,
  Input,
  InputGroup,
  Container,
  Row,
  Col,
  Label,
  Form
} from "reactstrap";

// core components
import DemoNavbar from "../../components/Navbars/DemoNavbar";
//api link
import HorizontalTimeline from "react-horizontal-timeline";
class ApplyTimeline extends React.Component {
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }
  constructor(props) {
    super(props);
    this.state = {
      curIdx: 0,
      prevIdx: -1,
      editable: false,
      timeline: [
        {
          data: "2018-01-20",
          statusE: "In Progress 30%"
        },
        {
          data: "2018-03-20",
          statusE: "In Progress 60%"
        },
        {
          data: "2018-03-23",
          statusE: "In Progress 90%"
        },
        {
          data: "2019-03-23",
          statusE: "Done"
        }
      ],
      backup_timeline: []
    };
    this.makeDeal = this.makeDeal.bind(this);
    this.saveChange = this.saveChange.bind(this);
    this.addChange = this.addChange.bind(this);
    this.cancelChange = this.cancelChange.bind(this);
    this.onDayChange = this.onDayChange.bind(this);
    this.deleteMilestone = this.deleteMilestone.bind(this);
  }
  async makeDeal() {
    // create temporary data for making backup data
    let dataEXAMPLE = JSON.parse(JSON.stringify(this.state.timeline));
    await this.setState({
      backup_timeline: dataEXAMPLE
    });
    this.changeMilestone();
    //show button
    document.getElementById("addMilestone").style.display = "";
    document.getElementById("saveTimeline").style.display = "";
    document.getElementById("cancelButton").style.display = "";
    document.getElementById("horizontalTimeline").style.display = "none";
  }
  async addChange() {
    await this.setState({
      backup_timeline: [
        ...this.state.backup_timeline,
        {
          data: "2019-07-03",
          statusE: "ABC"
        }
      ]
    });
    //re-render change milestone
    this.cancelChange();
    this.changeMilestone();
    //show button
    document.getElementById("addMilestone").style.display = "";
    document.getElementById("saveTimeline").style.display = "";
    document.getElementById("cancelButton").style.display = "";
    document.getElementById("horizontalTimeline").style.display = "";
  }
  async saveChange() {
    let isDuplicate = false;
    //create new array same with timeline for modifing
    let timelineCopy = JSON.parse(JSON.stringify(this.state.backup_timeline));
    for (let i = 0; i < this.state.backup_timeline.length; i++) {
      timelineCopy[i].data = document.getElementById([
        "day-timeline-" + i
      ]).value;
    }
    //Sort and check duplicate before saving
    for (let i = 0; i < timelineCopy.length; i++) {
      timelineCopy.sort(function(day1, day2) {
        if (new Date(day1.data) - new Date(day2.data) == 0) {
          isDuplicate = true;
          return console.log("Duplicate date in milestone"); // popup show Error
        }
        return new Date(day1.data) - new Date(day2.data);
      });
    }
    if (!isDuplicate) {
      // save data after changing
      await this.setState({
        timeline: timelineCopy
      });
      for (let i = 0; i < this.state.backup_timeline.length; i++) {
        document.getElementById(["day-timeline-" + i]).style.display = "none";
        document.getElementById(["delete-milestone-" + i]).style.display = "none";
      }
      document.getElementById("addMilestone").style.display = "none";
      document.getElementById("saveTimeline").style.display = "none";
      document.getElementById("cancelButton").style.display = "none";
      document.getElementById("horizontalTimeline").style.display = "";
    }
  }
  cancelChange() {
    for (let i = 0; i < this.state.backup_timeline.length; i++) {
      document.getElementById(["day-timeline-" + i]).style.display = "none";
      document.getElementById(["delete-milestone-" + i]).style.display = "none";
    }

    document.getElementById("addMilestone").style.display = "none";
    document.getElementById("saveTimeline").style.display = "none";
    document.getElementById("cancelButton").style.display = "none";
    document.getElementById("horizontalTimeline").style.display = "";
  }
  async deleteMilestone(index) {
    if (this.state.backup_timeline.length <= 2) {
      // Using modal for popup error
      console.log("Timeline have at least 2 milestone");
    } else {
      await this.state.backup_timeline.splice(index, 1);
      document.getElementById(
        "day-timeline-" + this.state.backup_timeline.length
      ).style.display = "none";
      document.getElementById(
        "delete-milestone-" + this.state.backup_timeline.length
      ).style.display = "none";
      this.cancelChange();
      this.changeMilestone();
      //show button
      document.getElementById("addMilestone").style.display = "";
      document.getElementById("saveTimeline").style.display = "";
      document.getElementById("cancelButton").style.display = "";
      document.getElementById("horizontalTimeline").style.display = "none";
    }
  }
  changeMilestone() {
    for (let i = 0; i < this.state.backup_timeline.length; i++) {
      document.getElementById(["day-timeline-" + i]).style.display = "";
      document.getElementById([
        "day-timeline-" + i
      ]).value = this.state.backup_timeline[i].data;
      document.getElementById(["delete-milestone-" + i]).style.display = "";
    }
  }
  createTimeline() {
    return (
      <HorizontalTimeline
        styles={{
          // background: "#f8f8f8",
          foreground: "#1A79AD",
          outline: "#dfdfdf"
        }}
        index={this.state.curIdx}
        indexClick={index => {
          const curIdx = this.state.curIdx;
          this.setState({ curIdx: index, prevIdx: curIdx });
          this.makeDeal(index);
        }}
        minEventPadding={100}
        maxEventPadding={150}
        isOpenBeginning={false}
        isOpenEnding={false}
        fillingMotion={{
          stiffness: 0,
          damping: 25
        }}
        slidingMotion={{
          stiffness: 0,
          damping: 25
        }}
        values={this.state.timeline.map(x => x.data)}
      />
    );
  }
  onDayChange(event) {
    this.setState({
      dayTimeline: new Date(event.target.value).toLocaleDateString()
    });
  }
  render() {
    const { curIdx, prevIdx } = this.state;
    // const curStatus = this.state.timeline[curIdx].statusE;
    // const prevStatus = prevIdx >= 0 ? this.state.timeline[prevIdx].statusE : "";
    return (
      <>
        <DemoNavbar />
        <main ref="main">
          <div className="position-relative">
            <section className="section section-lg section-shaped">
              <div className="shape shape-style-1 shape-default">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <Container className="py-lg-md d-flex">
                <div className="col px-0">
                  <Row>
                    <Col lg="10">
                      <h1 className="display-3 text-white">
                        Apply Timeline <span>Apply Timeline </span>
                      </h1>
                    </Col>
                  </Row>
                </div>
              </Container>
            </section>
          </div>

          <section className="section">
            <Container>
              <Card className="card-profile shadow mt--200">
                <div className="px-4">
                  <Row className="justify-content-center ">
                    <CardBody className="p-lg-5 ">
                      <h4 className="mb-1">Timeline Implement</h4>
                      {this.state.backup_timeline.map((data, index) => (
                        <Row key={index}>
                          <Col md="4">
                            <Input
                              id={"day-timeline-" + index}
                              type="date"
                              onChange={this.onDayChange.bind(this)}
                              style={{ display: "none" }}
                            />
                          </Col>
                          <Col>
                            {/* Delete button */}
                            <Button
                              type="submit"
                              id={"delete-milestone-" + index}
                              size="md"
                              color="danger"
                              style={{ display: "none" }}
                              onClick={() => this.deleteMilestone(index)}
                            >
                              Delete
                            </Button>{" "}
                          </Col>
                        </Row>
                      ))}
                      {/* Add New button */}
                      <Button
                        type="submit"
                        id="addMilestone"
                        size="md"
                        color="primary"
                        style={{ display: "none" }}
                        onClick={() => this.addChange()}
                      >
                        <i className="fa fa-dot-circle-o" /> Add Milestone
                      </Button>{" "}
                      {/* Save button */}
                      <Button
                        type="submit"
                        id="saveTimeline"
                        size="md"
                        color="primary"
                        style={{ display: "none" }}
                        onClick={() => this.saveChange()}
                      >
                        <i className="fa fa-dot-circle-o" /> Save Timeline
                      </Button>{" "}
                      {/* Cancel Button */}
                      <Button
                        type="submit"
                        id="cancelButton"
                        size="md"
                        color="primary"
                        style={{ display: "none" }}
                        onClick={() => this.cancelChange()}
                      >
                        <i className="fa" /> Cancel
                      </Button>
                      <div>
                        <div
                          id="horizontalTimeline"
                          style={{
                            width: "100%",
                            height: "100px",
                            margin: "0 auto",
                            marginTop: "20px",
                            fontSize: "13px"
                          }}
                        >
                          {this.createTimeline()}
                        </div>
                        {/* <div className="text-center">{curStatus}</div> */}
                      </div>
                    </CardBody>
                  </Row>
                </div>
              </Card>
            </Container>
          </section>
        </main>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    tokenReducer: state.tokenReducer
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setToken: token => {
      dispatch({
        type: "SET_TOKEN",
        payload: token
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplyTimeline);
