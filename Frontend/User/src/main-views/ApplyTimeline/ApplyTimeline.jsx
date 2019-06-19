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
      curIdx: 0,
      prevIdx: -1,
      editable: false,
      isLendOnce: true,
      isLendMany: false,
      timeline_lending: [
        {
          data: "2018-01-20",
          status: "In Progress 30%"
        },
        {
          data: "2018-03-20",
          status: "In Progress 60%"
        }
      ],
      backup_timeline_lending: []
    };
    this.changeTimeLineLending = this.changeTimeLineLending.bind(this);
    this.saveTimeLineLending = this.saveTimeLineLending.bind(this);
    this.addMilestoneLending = this.addMilestoneLending.bind(this);
    this.cancelTimeLineLending = this.cancelTimeLineLending.bind(this);
    this.onDayChange = this.onDayChange.bind(this);
    this.deleteMilestoneLending = this.deleteMilestoneLending.bind(this);
  }
  async changeTimeLineLending() {
    // create temporary data for making backup data
    let dataEXAMPLE = JSON.parse(JSON.stringify(this.state.timeline_lending));
    await this.setState({
      backup_timeline_lending: dataEXAMPLE
    });
    this.changeMilestone();
    //show button
    if (this.state.isLendMany) {
      document.getElementById("addMilestone").style.display = "";
    }
    document.getElementById("saveTimeline").style.display = "";
    document.getElementById("cancelButton").style.display = "";
    document.getElementById("horizontalTimeline").style.display = "none";
  }
  async addMilestoneLending() {
    await this.setState({
      backup_timeline_lending: [
        ...this.state.backup_timeline_lending,
        {
          data: "2019-07-03",
          status: "ABC"
        }
      ]
    });
    //re-render change milestone
    this.cancelTimeLineLending();
    this.changeMilestone();
    //show button
    if (this.state.isLendMany) {
      document.getElementById("addMilestone").style.display = "";
    }
    document.getElementById("saveTimeline").style.display = "";
    document.getElementById("cancelButton").style.display = "";
    document.getElementById("horizontalTimeline").style.display = "none";
  }
  async saveTimeLineLending() {
    let isDuplicate = false;
    //create new array same with timeline_lending for modifing
    let timelineCopy = JSON.parse(
      JSON.stringify(this.state.backup_timeline_lending)
    );
    for (let i = 0; i < this.state.backup_timeline_lending.length; i++) {
      timelineCopy[i].data = document.getElementById([
        "day-timeline_lending-" + i
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
        timeline_lending: timelineCopy
      });
      for (let i = 0; i < this.state.backup_timeline_lending.length; i++) {
        document.getElementById(["day-timeline_lending-" + i]).style.display =
          "none";
        document.getElementById(["delete-milestone-" + i]).style.display =
          "none";
      }
      if (this.state.isLendMany) {
        document.getElementById("addMilestone").style.display = "none";
      }
      document.getElementById("saveTimeline").style.display = "none";
      document.getElementById("cancelButton").style.display = "none";
      document.getElementById("horizontalTimeline").style.display = "";
    }
  }
  cancelTimeLineLending() {
    for (let i = 0; i < this.state.backup_timeline_lending.length; i++) {
      document.getElementById(["day-timeline_lending-" + i]).style.display =
        "none";
      document.getElementById(["delete-milestone-" + i]).style.display = "none";
    }
    if (this.state.isLendMany) {
      document.getElementById("addMilestone").style.display = "none";
    }
    document.getElementById("saveTimeline").style.display = "none";
    document.getElementById("cancelButton").style.display = "none";
    document.getElementById("horizontalTimeline").style.display = "";
  }
  async deleteMilestoneLending(index) {
    if (this.state.backup_timeline_lending.length <= 2) {
      // Using modal for popup error
      console.log("Timeline have at least 2 milestone");
    } else {
      await this.state.backup_timeline_lending.splice(index, 1);
      document.getElementById(
        "day-timeline_lending-" + this.state.backup_timeline_lending.length
      ).style.display = "none";
      document.getElementById(
        "delete-milestone-" + this.state.backup_timeline_lending.length
      ).style.display = "none";
      this.cancelTimeLineLending();
      this.changeMilestone();
      //show button
      if (this.state.isLendMany) {
        document.getElementById("addMilestone").style.display = "";
      }
      document.getElementById("saveTimeline").style.display = "";
      document.getElementById("cancelButton").style.display = "";
      document.getElementById("horizontalTimeline").style.display = "none";
    }
  }
  changeMilestone() {
    for (let i = 0; i < this.state.backup_timeline_lending.length; i++) {
      document.getElementById(["day-timeline_lending-" + i]).style.display = "";
      document.getElementById([
        "day-timeline_lending-" + i
      ]).value = this.state.backup_timeline_lending[i].data;
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
          // this.changeTimeLineLending();
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
        values={this.state.timeline_lending.map(x => x.data)}
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
    const curStatus = this.state.timeline_lending[curIdx].status;
    const prevStatus =
      prevIdx >= 0 ? this.state.timeline_lending[prevIdx].status : "";
    const isLendMany = this.state.isLendMany;
    return (
      <>
        <Row className="justify-content-center ">
          <CardBody className="p-lg-5 ">
            <UncontrolledDropdown>
              <DropdownToggle caret color="secondary">
                Choose Type
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  href="#pablo"
                  onClick={e => {
                    if (this.state.timeline_lending.length > 2) {
                      console.log("Timeline have over 2 milestones.");
                    } else {
                      this.setState({
                        isLendOnce: true,
                        isLendMany: false
                      });
                    }
                    e.preventDefault();
                  }}
                >
                  Lend Once
                </DropdownItem>
                <DropdownItem
                  href="#pablo"
                  onClick={e => {
                    this.setState({
                      isLendOnce: false,
                      isLendMany: true
                    });
                    e.preventDefault();
                  }}
                >
                  Lend Many
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            {this.state.backup_timeline_lending.map((data, index) => (
              <Row key={index}>
                <Col md="4">
                  <Input
                    id={"day-timeline_lending-" + index}
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
                    onClick={() => this.deleteMilestoneLending(index)}
                  >
                    Delete
                  </Button>{" "}
                </Col>
              </Row>
            ))}
            {/* Add New button */}
            {isLendMany ? (
              <Button
                type="submit"
                id="addMilestone"
                size="md"
                color="primary"
                style={{ display: "none" }}
                onClick={() => this.addMilestoneLending()}
              >
                <i className="fa fa-dot-circle-o" /> Add Milestone
              </Button>
            ) : (
              ""
            )}
            {/* Save button */}
            <Button
              type="submit"
              id="saveTimeline"
              size="md"
              color="primary"
              style={{ display: "none" }}
              onClick={() => this.saveTimeLineLending()}
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
              onClick={() => this.cancelTimeLineLending()}
            >
              <i className="fa" /> Cancel
            </Button>
            <div id="horizontalTimeline">
              <Label>
                Lending Timeline <span>&nbsp;&nbsp;&nbsp;</span>
              </Label>
              <Button
                type="submit"
                id="changeTimeline"
                size="sm"
                outline
                color="primary"
                onClick={() => this.changeTimeLineLending()}
              >
                Change timeline_lending
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
                {this.createTimeline()}
              </div>
              <div className="text-center">{curStatus}</div>
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
