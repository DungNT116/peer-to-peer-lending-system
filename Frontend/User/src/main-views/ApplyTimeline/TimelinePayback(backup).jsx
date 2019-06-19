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
  Form,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

//api link
import HorizontalTimeline from "react-horizontal-timeline";
class ApplyTimeline extends React.Component {
  // componentDidMount() {
  //   document.documentElement.scrollTop = 0;
  //   document.scrollingElement.scrollTop = 0;
  //   this.refs.main.scrollTop = 0;
  // }
  constructor(props) {
    super(props);
    this.state = {
      curPaybackId: 0,
      prevPaybackId: -1,
      editable: false,
      isPaybackOnce: true,
      isPaybackMany: false,
      timeline_payback: [
        {
          data: "2018-01-20",
          status: "In Progress 30%"
        },
        {
          data: "2018-03-20",
          status: "In Progress 60%"
        }
      ],
      backup_timeline_payback: []
    };
    this.changePaybackTimeLine = this.changePaybackTimeLine.bind(this);
    this.savePaybackTimeLine = this.savePaybackTimeLine.bind(this);
    this.addPaybackMilestone = this.addPaybackMilestone.bind(this);
    this.cancelPaybackTimeLine = this.cancelPaybackTimeLine.bind(this);
    this.onDayChangePayback = this.onDayChangePayback.bind(this);
    this.deleteMilestoneLending = this.deleteMilestoneLending.bind(this);
  }
  async changePaybackTimeLine() {
    // create temporary data for making backup data
    let dataEXAMPLE = JSON.parse(JSON.stringify(this.state.timeline_payback));
    await this.setState({
      backup_timeline_payback: dataEXAMPLE
    });
    this.changePaybackMilestone();
    //show button
    if (this.state.isPaybackMany) {
      document.getElementById("addMilestonePayback").style.display = "";
    }
    document.getElementById("saveTimelinePayback").style.display = "";
    document.getElementById("cancelButtonPayback").style.display = "";
    document.getElementById("horizontalPaybackTimeline").style.display = "none";
    document.getElementById("dropdownChoosePayback").style.display = "none";
  }
  async addPaybackMilestone() {
    await this.setState({
      backup_timeline_payback: [
        ...this.state.backup_timeline_payback,
        {
          data: "2019-07-03",
          status: "ABC"
        }
      ]
    });
    //re-render change milestone
    this.cancelPaybackTimeLine();
    this.changePaybackMilestone();
    //show button
    if (this.state.isPaybackMany) {
      document.getElementById("addMilestonePayback").style.display = "";
    }
    document.getElementById("saveTimelinePayback").style.display = "";
    document.getElementById("cancelButtonPayback").style.display = "";
    document.getElementById("horizontalPaybackTimeline").style.display = "none";
    document.getElementById("dropdownChoosePayback").style.display = "none";
  }
  async savePaybackTimeLine() {
    let isDuplicate = false;
    //create new array same with timeline_payback for modifing
    let timelineCopy = JSON.parse(
      JSON.stringify(this.state.backup_timeline_payback)
    );
    for (let i = 0; i < this.state.backup_timeline_payback.length; i++) {
      timelineCopy[i].data = document.getElementById([
        "day-timeline-payback-" + i
      ]).value;
    }
    //Sort and check duplicate before saving
    for (let i = 0; i < timelineCopy.length; i++) {
      timelineCopy.sort(function(day1, day2) {
        if (new Date(day1.data) - new Date(day2.data) == 0) {
          isDuplicate = true;
          return window.alert("Duplicate date in milestone"); // popup show Error
        }
        return new Date(day1.data) - new Date(day2.data);
      });
    }
    if (!isDuplicate) {
      // save data after changing
      await this.setState({
        timeline_payback: timelineCopy
      });
      for (let i = 0; i < this.state.backup_timeline_payback.length; i++) {
        document.getElementById(["day-timeline-payback-" + i]).style.display =
          "none";
        document.getElementById(["delete-milestone-payback-" + i]).style.display =
          "none";
      }
      if (this.state.isPaybackMany) {
        document.getElementById("addMilestonePayback").style.display = "none";
      }
      document.getElementById("saveTimelinePayback").style.display = "none";
      document.getElementById("cancelButtonPayback").style.display = "none";
      document.getElementById("horizontalPaybackTimeline").style.display = "";
      document.getElementById("dropdownChoosePayback").style.display = "";
    }
  }
  cancelPaybackTimeLine() {
    for (let i = 0; i < this.state.backup_timeline_payback.length; i++) {
      document.getElementById(["day-timeline-payback-" + i]).style.display =
        "none";
      document.getElementById(["delete-milestone-payback-" + i]).style.display = "none";
    }
    if (this.state.isPaybackMany) {
      document.getElementById("addMilestonePayback").style.display = "none";
    }
    document.getElementById("saveTimelinePayback").style.display = "none";
    document.getElementById("cancelButtonPayback").style.display = "none";
    document.getElementById("horizontalPaybackTimeline").style.display = "";
    document.getElementById("dropdownChoosePayback").style.display = "";
  }
  async deleteMilestoneLending(index) {
    if (this.state.backup_timeline_payback.length <= 2) {
      // Using modal for popup error
      window.alert("Timeline have at least 2 milestone");
    } else {
      await this.state.backup_timeline_payback.splice(index, 1);
      document.getElementById(
        "day-timeline-payback-" + this.state.backup_timeline_payback.length
      ).style.display = "none";
      document.getElementById(
        "delete-milestone-payback-" + this.state.backup_timeline_payback.length
      ).style.display = "none";
      this.cancelPaybackTimeLine();
      this.changePaybackMilestone();
      //show button
      if (this.state.isPaybackMany) {
        document.getElementById("addMilestonePayback").style.display = "";
      }
      document.getElementById("saveTimelinePayback").style.display = "";
      document.getElementById("cancelButtonPayback").style.display = "";
      document.getElementById("horizontalPaybackTimeline").style.display = "none";
      document.getElementById("dropdownChoosePayback").style.display = "none";
    }
  }
  changePaybackMilestone() {
    for (let i = 0; i < this.state.backup_timeline_payback.length; i++) {
      document.getElementById(["day-timeline-payback-" + i]).style.display = "";
      document.getElementById([
        "day-timeline-payback-" + i
      ]).value = this.state.backup_timeline_payback[i].data;
      document.getElementById(["delete-milestone-payback-" + i]).style.display = "";
    }
  }
  createPaybackTimeline() {
    return (
      <HorizontalTimeline
        styles={{
          // background: "#f8f8f8",
          foreground: "#1A79AD",
          outline: "#dfdfdf"
        }}
        index={this.state.curPaybackId}
        indexClick={index => {
          const curPaybackId = this.state.curPaybackId;
          this.setState({ curPaybackId: index, prevPaybackId: curPaybackId });
          // this.changePaybackTimeLine();
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
        values={this.state.timeline_payback.map(x => x.data)}
      />
    );
  }
  onDayChangePayback(event) {
    this.setState({
      dayTimelinePayback: new Date(event.target.value).toLocaleDateString()
    });
  }
  render() {
    const { curPaybackId, prevPaybackId } = this.state;
    const curPaybackStatus = this.state.timeline_payback[curPaybackId].status;
    const prevPaybackStatus =
      prevPaybackId >= 0 ? this.state.timeline_payback[prevPaybackId].status : "";
    const isPaybackMany = this.state.isPaybackMany;
    return (
      <>
        <Row className="justify-content-center ">
          <CardBody className="p-lg-5 ">
            <UncontrolledDropdown id="dropdownChoosePayback">
              <Label>
                Type Payback Timeline <span>&nbsp;&nbsp;&nbsp;</span>{" "}
              </Label>
              <DropdownToggle caret color="secondary">
                Choose Type
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  href="#pablo"
                  onClick={e => {
                    if (this.state.timeline_payback.length > 2) {
                      window.alert("Timeline have over 2 milestones.");
                    } else {
                      this.setState({
                        isPaybackOnce: true,
                        isPaybackMany: false
                      });
                    }
                    e.preventDefault();
                  }}
                >
                  Payback Once
                </DropdownItem>
                <DropdownItem
                  href="#pablo"
                  onClick={e => {
                    this.setState({
                      isPaybackOnce: false,
                      isPaybackMany: true
                    });
                    e.preventDefault();
                  }}
                >
                  Payback Many
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            {this.state.backup_timeline_payback.map((data, index) => (
              <Row key={index}>
                <Col md="4">
                  <Input
                    id={"day-timeline-payback-" + index}
                    type="date"
                    onChange={this.onDayChangePayback.bind(this)}
                    style={{ display: "none" }}
                  />
                </Col>
                <Col>
                  {/* Delete button */}
                  <Button
                    type="submit"
                    id={"delete-milestone-payback-" + index}
                    size="md"
                    color="danger"
                    style={{ display: "none" }}
                    onClick={() => this.deleteMilestoneLending(index)}
                  >
                    Delete
                  </Button>{" "}
                </Col>
              </Row>
            ))}
            {/* Payback - Add New button */}
            {isPaybackMany ? (
              <Button
                type="submit"
                id="addMilestonePayback"
                size="md"
                color="primary"
                style={{ display: "none" }}
                onClick={() => this.addPaybackMilestone()}
              >
                <i className="fa fa-dot-circle-o" /> Add Milestone
              </Button>
            ) : (
              ""
            )}
            {/* Payback - Save button */}
            <Button
              type="submit"
              id="saveTimelinePayback"
              size="md"
              color="primary"
              style={{ display: "none" }}
              onClick={() => this.savePaybackTimeLine()}
            >
              <i className="fa fa-dot-circle-o" /> Save Timeline
            </Button>{" "}
            {/* Payback - Cancel Button */}
            <Button
              type="submit"
              id="cancelButtonPayback"
              size="md"
              color="primary"
              style={{ display: "none" }}
              onClick={() => this.cancelPaybackTimeLine()}
            >
              <i className="fa" /> Cancel
            </Button>
            <div id="horizontalPaybackTimeline">
              <Label>
                Payback Timeline <span>&nbsp;&nbsp;&nbsp;</span>
              </Label>
              <Button
                type="submit"
                id="changeTimeline"
                size="sm"
                outline
                color="primary"
                onClick={() => this.changePaybackTimeLine()}
              >
                Change timeline payback
              </Button>
              <div
                style={{
                  width: "100%",
                  height: "100px",
                  margin: "0 auto",
                  marginTop: "20px",
                  fontSize: "13px"
                }}
              >
                {this.createPaybackTimeline()}
              </div>
              <div className="text-center">{curPaybackStatus}</div>
            </div>
          </CardBody>
        </Row>
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
