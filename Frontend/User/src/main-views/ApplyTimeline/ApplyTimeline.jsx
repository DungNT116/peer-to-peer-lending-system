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
  async componentWillMount() {

    //this function will update lending array and payback array in parent component (create request)
    this.props.onDataChange(this.state.timeline_lending, this.state.timeline_payback);

    if(this.props.setTimelineData !== undefined) {
      let timelineData = this.props.setTimelineData();
      console.log(timelineData)
      // = {lendingTimeline : [], payBackTimeline: []};
      // await this.setState({
      //   timelineData: this.props.setTimelineData()});
      // console.log(this.state.timelineData);
      await this.setState({
        timeline_lending: timelineData.lendingTimeline,
        timeline_payback: timelineData.payBackTimeline
      })
    }
    
  }
  componentDidMount() {
    // document.documentElement.scrollTop = 0;
    // document.scrollingElement.scrollTop = 0;
    // this.refs.main.scrollTop = 0;

    
  }
  constructor(props) {
    super(props);
    let duration = 30;
    this.state = {
      //lending state
      // timelineData: {},
      curLendingId: 0,
      prevLendingId: -1,
      editable: false,
      isLendOnce: true,
      isLendMany: false,
      duration: 30,
      timeline_lending: [
        {
          data: this.formatDate(new Date(Date.now())),
          status: "In Progress 30%"
        },
        {
          data: this.formatDate(
            new Date(
              (new Date(Date.now()).getTime() / 1000 + 86400 * duration) * 1000
            ).toLocaleDateString()
          ),
          status: "In Progress 60%"
        }
      ],

      backup_timeline_lending: [],
      // payback state
      curPaybackId: 0,
      prevPaybackId: -1,
      editable: false,
      isPaybackOnce: true,
      isPaybackMany: false,
      timeline_payback: [
        {
          data: this.formatDate(
            new Date(
              (new Date(Date.now()).getTime() / 1000 + 86400 * duration) * 1000
            ).toLocaleDateString()
          ),
          status: "In Progress 30%"
        },
        {
          data: this.formatDate(
            new Date(
              (new Date(Date.now()).getTime() / 1000 + 86400 * duration * 2) *
                1000
            ).toLocaleDateString()
          ),
          status: "In Progress 60%"
        }
      ],
      backup_timeline_payback: []
    };
    this.changeTimeLineLending = this.changeTimeLineLending.bind(this);
    this.saveTimeLineLending = this.saveTimeLineLending.bind(this);
    this.addMilestoneLending = this.addMilestoneLending.bind(this);
    this.cancelTimeLineLending = this.cancelTimeLineLending.bind(this);
    this.onDayChangeLending = this.onDayChangeLending.bind(this);
    this.deleteMilestoneLending = this.deleteMilestoneLending.bind(this);

    this.changePaybackTimeLine = this.changePaybackTimeLine.bind(this);
    this.savePaybackTimeLine = this.savePaybackTimeLine.bind(this);
    this.addPaybackMilestone = this.addPaybackMilestone.bind(this);
    this.cancelPaybackTimeLine = this.cancelPaybackTimeLine.bind(this);
    this.onDayChangePayback = this.onDayChangePayback.bind(this);
    this.deleteMilestonePayback = this.deleteMilestonePayback.bind(this);
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  // Begin Function Lending
  async changeTimeLineLending() {
    // create temporary data for making backup data
    let dataEXAMPLE = JSON.parse(JSON.stringify(this.state.timeline_lending));
    await this.setState({
      backup_timeline_lending: dataEXAMPLE
    });
    this.changeLendingMilestone();
    //show button
    if (this.state.isLendMany) {
      document.getElementById("addMilestoneLending").style.display = "";
    }
    document.getElementById("saveTimelineLending").style.display = "";
    document.getElementById("cancelButtonLending").style.display = "";
    document.getElementById("horizontalLendingTimeline").style.display = "none";
    document.getElementById("dropdownChooseLending").style.display = "none";
  }
  async addMilestoneLending() {
    await this.setState({
      backup_timeline_lending: [
        ...this.state.backup_timeline_lending,
        {
          data: this.formatDate(
            new Date(
              (new Date(
                this.state.timeline_lending[
                  this.state.timeline_lending.length - 1
                ].data
              ).getTime() /
                1000 +
                86400 * this.state.duration) *
                1000
            ).toLocaleDateString()
          ),
          status: "ABC"
        }
      ]
    });

    //re-render change milestone
    this.cancelTimeLineLending();
    this.changeLendingMilestone();
    //show button
    if (this.state.isLendMany) {
      document.getElementById("addMilestoneLending").style.display = "";
    }
    document.getElementById("saveTimelineLending").style.display = "";
    document.getElementById("cancelButtonLending").style.display = "";
    document.getElementById("horizontalLendingTimeline").style.display = "none";
    document.getElementById("dropdownChooseLending").style.display = "none";
  }

  updatePaybackTimelineState() {
    this.setState({
      backup_timeline_payback: []
    });
  }
  async saveTimeLineLending() {
    let isDuplicate = false;
    //create new array same with timeline_lending for modifing
    let timelineCopy = JSON.parse(
      JSON.stringify(this.state.backup_timeline_lending)
    );
    for (let i = 0; i < this.state.backup_timeline_lending.length; i++) {
      timelineCopy[i].data = document.getElementById([
        "day-timeline-lending-" + i
      ]).value;
    }
    //Sort and check duplicate before saving
    for (let i = 0; i < timelineCopy.length; i++) {
      timelineCopy.sort(function(day1, day2) {
        if (new Date(day1.data) - new Date(day2.data) == 0) {
          isDuplicate = true;
        }
        return new Date(day1.data) - new Date(day2.data);
      });
    }
    if (!isDuplicate) {
      // save data after changing
      await this.setState({
        timeline_lending: timelineCopy
      });
      //update data in parent (create request)
      this.props.onDataChange(this.state.timeline_lending, this.state.timeline_payback);

      for (let i = 0; i < this.state.backup_timeline_lending.length; i++) {
        document.getElementById(["day-timeline-lending-" + i]).style.display =
          "none";
        document.getElementById([
          "delete-milestone-lending-" + i
        ]).style.display = "none";
      }
      if (this.state.isLendMany) {
        document.getElementById("addMilestoneLending").style.display = "none";
      }
      document.getElementById("saveTimelineLending").style.display = "none";
      document.getElementById("cancelButtonLending").style.display = "none";
      document.getElementById("horizontalLendingTimeline").style.display = "";
      document.getElementById("dropdownChooseLending").style.display = "";
    } else {
      window.alert("Duplicate date in milestone"); // popup show Error
    }
    // synchonize last milestone lending with first milestone payback
    if (this.state.backup_timeline_payback.length <= 2) {
      let payback = [...this.state.timeline_payback];
      payback[0].data = this.state.backup_timeline_lending[
        this.state.backup_timeline_lending.length - 1
      ].data;
      payback[1].data = this.formatDate(
        new Date(
          (new Date(payback[0].data).getTime() / 1000 +
            86400 * this.state.duration) *
            1000
        ).toLocaleDateString()
      );
      this.setState({ timeline_payback: payback });
    }
  }
  cancelTimeLineLending() {
    for (let i = 0; i < this.state.backup_timeline_lending.length; i++) {
      document.getElementById(["day-timeline-lending-" + i]).style.display =
        "none";
      document.getElementById(["delete-milestone-lending-" + i]).style.display =
        "none";
    }
    if (this.state.isLendMany) {
      document.getElementById("addMilestoneLending").style.display = "none";
    }
    document.getElementById("saveTimelineLending").style.display = "none";
    document.getElementById("cancelButtonLending").style.display = "none";
    document.getElementById("horizontalLendingTimeline").style.display = "";
    document.getElementById("dropdownChooseLending").style.display = "";
  }
  async deleteMilestoneLending(index) {
    if (this.state.backup_timeline_lending.length <= 2) {
      // Using modal for popup error
      window.alert("Timeline have at least 2 milestone");
    } else {
      await this.state.backup_timeline_lending.splice(index, 1);
      document.getElementById(
        "day-timeline-lending-" + this.state.backup_timeline_lending.length
      ).style.display = "none";
      document.getElementById(
        "delete-milestone-lending-" + this.state.backup_timeline_lending.length
      ).style.display = "none";
      this.cancelTimeLineLending();
      this.changeLendingMilestone();
      //show button
      if (this.state.isLendMany) {
        document.getElementById("addMilestoneLending").style.display = "";
      }
      document.getElementById("saveTimelineLending").style.display = "";
      document.getElementById("cancelButtonLending").style.display = "";
      document.getElementById("horizontalLendingTimeline").style.display =
        "none";
      document.getElementById("dropdownChooseLending").style.display = "none";
    }
  }
  changeLendingMilestone() {
    for (let i = 0; i < this.state.backup_timeline_lending.length; i++) {
      document.getElementById(["day-timeline-lending-" + i]).style.display = "";
      document.getElementById([
        "day-timeline-lending-" + i
      ]).value = this.state.backup_timeline_lending[i].data;
      document.getElementById(["delete-milestone-lending-" + i]).style.display =
        "";
    }
  }
  createLendingTimeline() {
    return (
      <HorizontalTimeline
        styles={{
          // background: "#f8f8f8",
          foreground: "#1A79AD",
          outline: "#dfdfdf"
        }}
        index={this.state.curLendingId}
        indexClick={index => {
          const curLendingId = this.state.curLendingId;
          this.setState({ curLendingId: index, prevLendingId: curLendingId });
          // this.changeTimeLineLending();
        }}
        minEventPadding={100}
        maxEventPadding={150}
        // isOpenBeginning={false}
        // isOpenEnding={false}
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
  onDayChangeLending(event) {
    this.setState({
      dayTimelineLending: new Date(event.target.value).toLocaleDateString()
    });
  }
  // End Function Lending

  //Begin Function Payback
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
          data: this.formatDate(
            new Date(
              (new Date(
                this.state.timeline_payback[
                  this.state.timeline_payback.length - 1
                ].data
              ).getTime() /
                1000 +
                86400 * this.state.duration) *
                1000
            ).toLocaleDateString()
          ),
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
        }
        return new Date(day1.data) - new Date(day2.data);
      });
    }
    if (!isDuplicate) {
      // save data after changing
      await this.setState({
        timeline_payback: timelineCopy
      });
      //update data in parent (create request)
      this.props.onDataChange(this.state.timeline_lending, this.state.timeline_payback);
      
      for (let i = 0; i < this.state.backup_timeline_payback.length; i++) {
        document.getElementById(["day-timeline-payback-" + i]).style.display =
          "none";
        document.getElementById([
          "delete-milestone-payback-" + i
        ]).style.display = "none";
      }
      if (this.state.isPaybackMany) {
        document.getElementById("addMilestonePayback").style.display = "none";
      }
      document.getElementById("saveTimelinePayback").style.display = "none";
      document.getElementById("cancelButtonPayback").style.display = "none";
      document.getElementById("horizontalPaybackTimeline").style.display = "";
      document.getElementById("dropdownChoosePayback").style.display = "";
    } else {
      window.alert("Duplicate date in milestone"); // popup show Error
    }
  }
  cancelPaybackTimeLine() {
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
  async deleteMilestonePayback(index) {
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
      document.getElementById("horizontalPaybackTimeline").style.display =
        "none";
      document.getElementById("dropdownChoosePayback").style.display = "none";
    }
  }
  changePaybackMilestone() {
    for (let i = 0; i < this.state.backup_timeline_payback.length; i++) {
      document.getElementById(["day-timeline-payback-" + i]).style.display = "";
      document.getElementById([
        "day-timeline-payback-" + i
      ]).value = this.state.backup_timeline_payback[i].data;
      document.getElementById(["delete-milestone-payback-" + i]).style.display =
        "";
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
        // isOpenBeginning={false}
        // isOpenEnding={false}
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
  //End Function Payback

  render() {
    const {
      curLendingId,
      prevLendingId,
      curPaybackId,
      prevPaybackId
    } = this.state;
    const curLendingStatus = this.state.timeline_lending[curLendingId].status;
    const prevLendingStatus =
      prevLendingId >= 0
        ? this.state.timeline_lending[prevLendingId].status
        : "";
    const isLendMany = this.state.isLendMany;

    const curPaybackStatus = this.state.timeline_payback[curPaybackId].status;
    const prevPaybackStatus =
      prevPaybackId >= 0
        ? this.state.timeline_payback[prevPaybackId].status
        : "";
    const isPaybackMany = this.state.isPaybackMany;
    return (
      <>
        {/* Begin Lending  */}
        <Row className="justify-content-center ">
          <CardBody className="p-lg-4">
            <div id="dropdownChooseLending">
              <Label>
                Type Lending Timeline <span>&nbsp;&nbsp;&nbsp;</span>{" "}
              </Label>
              <UncontrolledDropdown>
                <DropdownToggle caret color="secondary">
                  Choose Type
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    href="#pablo"
                    onClick={e => {
                      if (this.state.timeline_lending.length > 2) {
                        window.alert("Timeline have over 2 milestones.");
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
            </div>
            {this.state.backup_timeline_lending.map((data, index) => (
              <Row key={index}>
                <Col md="4">
                  <Input
                    id={"day-timeline-lending-" + index}
                    type="date"
                    onChange={this.onDayChangeLending.bind(this)}
                    style={{ display: "none" }}
                  />
                </Col>
                <Col>
                  {/* Delete button */}
                  <Button
                    // type="submit"
                    id={"delete-milestone-lending-" + index}
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
            {/* Lend - Add New button */}
            {isLendMany ? (
              <Button
                // type="submit"
                id="addMilestoneLending"
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
            {/* Lend - Save button */}
            <Button
              // type="submit"
              id="saveTimelineLending"
              size="md"
              color="primary"
              style={{ display: "none" }}
              onClick={() => this.saveTimeLineLending()}
            >
              <i className="fa fa-dot-circle-o" /> Save Timeline
            </Button>{" "}
            {/* Lend - Cancel Button */}
            <Button
              // type="submit"
              id="cancelButtonLending"
              size="md"
              color="primary"
              style={{ display: "none" }}
              onClick={() => this.cancelTimeLineLending()}
            >
              <i className="fa" /> Cancel
            </Button>
            <div id="horizontalLendingTimeline">
              <Label>
                Lending Timeline <span>&nbsp;&nbsp;&nbsp;</span>
              </Label>
              <Button
                // type="submit"
                id="changeTimeline"
                size="sm"
                outline
                color="primary"
                onClick={() => this.changeTimeLineLending()}
              >
                Change timeline lending
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
                {this.createLendingTimeline()}
              </div>
              <div className="text-center">{curLendingStatus}</div>
            </div>
          </CardBody>
        </Row>
        {/* End Lending  */}

        {/* Begin Payback  */}
        <Row className="justify-content-center ">
          <CardBody className="p-lg-4">
            <div id="dropdownChoosePayback">
              <Label>
                Type Payback Timeline <span>&nbsp;&nbsp;&nbsp;</span>{" "}
              </Label>
              <UncontrolledDropdown>
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
            </div>
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
                    // type="submit"
                    id={"delete-milestone-payback-" + index}
                    size="md"
                    color="danger"
                    style={{ display: "none" }}
                    onClick={() => this.deleteMilestonePayback(index)}
                  >
                    Delete
                  </Button>{" "}
                </Col>
              </Row>
            ))}
            {/* Payback - Add New button */}
            {isPaybackMany ? (
              <Button
                // type="submit"
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
              // type="submit"
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
              // type="submit"
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
                // type="submit"
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

        {/* End Payback  */}
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
