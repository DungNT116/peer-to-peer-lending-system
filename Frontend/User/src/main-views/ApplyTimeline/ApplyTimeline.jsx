import React from 'react';

// nodejs library that concatenates classes
import {connect} from 'react-redux';
// reactstrap components
import {
  // Badge,
  Button,
  CardBody,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Label,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import {database} from '../../firebase';
import {PayPalButton} from 'react-paypal-button-v2';
import {apiLink, bigchainAPI, client_API} from '../../api.jsx';
//api link
import HorizontalTimeline from 'react-horizontal-timeline';
class ApplyTimeline extends React.Component {
  async componentWillMount() {
    //this function will update lending array and payback array in parent component (create request)
    this.props.onDataChange(
      this.state.timeline_lending,
      this.state.timeline_payback
    );

    if (this.props.setTimelineData !== undefined) {
      let timelineData = this.props.setTimelineData();
      this.props.onDataChange(
        timelineData.lendingTimeline,
        timelineData.payBackTimeline
      );
      await this.setState({
        timeline_lending: timelineData.lendingTimeline,
        timeline_payback: timelineData.payBackTimeline,
      });
    }

    if (this.props.rawMilestone !== undefined) {
      await this.setState({
        rawMilestone: this.props.rawMilestone,
      });
    }

    if (this.props.isLendMany !== undefined) {
      await this.setState({
        isLendMany: this.props.isLendMany,
        isLendOnce: !this.props.isLendMany,
      });
    }

    if (this.props.isPayMany !== undefined) {
      await this.setState({
        isPaybackMany: this.props.isPayMany,
        isPaybackOnce: !this.props.isPayMany,
      });
    }
    if (this.props.amountProps !== undefined) {
      await this.setState({
        amountProps: this.props.amountProps,
      });
    }
  }
  async componentDidMount() {
    // document.documentElement.scrollTop = 0;
    // document.scrollingElement.scrollTop = 0;
    // this.refs.main.scrollTop = 0;
    fetch(
      'http://www.apilayer.net/api/live?access_key=b0346f8c3eb9232b90f3d8f63534e6f4&format=1',
      {
        method: 'GET',
      }
    )
      .then(response => response.json())
      .then(async data => {
        this.setState({
          currencyUSDVND: data.quotes.USDVND,
        });
      })
      .catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.setState({
          isOpenError: true,
          message: 'Cannot access to server',
        });
      });
  }
  constructor(props) {
    super(props);
    let duration = 30;
    this.state = {
      isOpenSuccess: false,
      error: '',
      isOpenError: false,
      rawMilestone: [],
      duration: 30,
      editable: false,
      isViewDetail: false,
      isTrading: false,
      isHistory: false,
      data_transaction: {},
      typePayment: '',
      //lending state
      curLendingId: 0,
      prevLendingId: -1,
      isLendOnce: true,
      isLendMany: false,
      modalLending: false,
      isInMilestoneLending: false,
      isMilestoneLendingPaid: false,
      timeline_lending: [
        {
          data: this.formatDate(new Date(Date.now())),
          percent: '',
        },
        {
          data: this.formatDate(
            new Date(
              (new Date(Date.now()).getTime() / 1000 + 86400 * duration) * 1000
            )
          ),
          percent: 1.0,
        },
      ],
      backup_timeline_lending: [],
      // payback state
      curPaybackId: 0,
      prevPaybackId: -1,
      curDateLending: {},
      curDatePayback: {},
      modalPayback: false,
      isInMilestonePayback: false,
      isMilestonePaybackPaid: false,
      isPaybackOnce: true,
      isPaybackMany: false,
      timeline_payback: [
        {
          data: this.formatDate(
            new Date(
              (new Date(Date.now()).getTime() / 1000 + 86400 * duration) * 1000
            )
          ),
          percent: '',
        },
        {
          data: this.formatDate(
            new Date(
              (new Date(Date.now()).getTime() / 1000 + 86400 * duration * 2) *
                1000
            )
          ),
          percent: 1.0,
        },
      ],
      backup_timeline_payback: [],
      penalty: 0,
      durationLate: 0,
      currencyUSDVND: null,
    };
    //Lending
    this.changeTimeLineLending = this.changeTimeLineLending.bind(this);
    this.saveTimeLineLending = this.saveTimeLineLending.bind(this);
    this.addMilestoneLending = this.addMilestoneLending.bind(this);
    this.cancelTimeLineLending = this.cancelTimeLineLending.bind(this);
    this.onDayChangeLending = this.onDayChangeLending.bind(this);
    this.deleteMilestoneLending = this.deleteMilestoneLending.bind(this);
    //payback
    this.changePaybackTimeLine = this.changePaybackTimeLine.bind(this);
    this.savePaybackTimeLine = this.savePaybackTimeLine.bind(this);
    this.addPaybackMilestone = this.addPaybackMilestone.bind(this);
    this.cancelPaybackTimeLine = this.cancelPaybackTimeLine.bind(this);
    this.onDayChangePayback = this.onDayChangePayback.bind(this);
    this.deleteMilestonePayback = this.deleteMilestonePayback.bind(this);
    //convert
    this.convertTimeStampToDate = this.convertTimeStampToDate.bind(this);
    this.convertDateToTimestamp = this.convertDateToTimestamp.bind(this);
    this.handleError = this.handleError.bind(this);
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  convertDateToTimestamp(date) {
    return Math.round(date.getTime() / 1000);
  }
  convertTimeStampToDate(date) {
    var timestampToDate = new Date(date * 1000);
    return timestampToDate.toLocaleDateString();
  }
  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  // Begin Function Lending
  async changeTimeLineLending() {
    // create temporary data for making backup data
    let dataEXAMPLE = JSON.parse(JSON.stringify(this.state.timeline_lending));
    await this.setState({
      backup_timeline_lending: dataEXAMPLE,
    });
    this.changeLendingMilestone();
    //show button
    if (this.state.isLendMany) {
      document.getElementById('addMilestoneLending').style.display = '';
    }
    document.getElementById('saveTimelineLending').style.display = '';
    document.getElementById('cancelButtonLending').style.display = '';
    document.getElementById('horizontalLendingTimeline').style.display = 'none';
    document.getElementById('dropdownChooseLending').style.display = 'none';
  }
  async addMilestoneLending() {
    await this.setState({
      backup_timeline_lending: [
        ...this.state.backup_timeline_lending,
        {
          data: this.formatDate(
            new Date(
              (new Date(
                this.state.backup_timeline_lending[
                  this.state.backup_timeline_lending.length - 1
                ].data
              ).getTime() /
                1000 +
                86400 * this.state.duration) *
                1000
            )
          ),
          percent:
            Math.round((1 / this.state.backup_timeline_lending.length) * 100) /
            100,
          status: 'ABC',
        },
      ],
    });

    //re-render change milestone
    this.cancelTimeLineLending();
    this.changeLendingMilestone();
    //show button
    if (this.state.isLendMany) {
      document.getElementById('addMilestoneLending').style.display = '';
    }
    document.getElementById('saveTimelineLending').style.display = '';
    document.getElementById('cancelButtonLending').style.display = '';
    document.getElementById('horizontalLendingTimeline').style.display = 'none';
    document.getElementById('dropdownChooseLending').style.display = 'none';
  }
  async saveTimeLineLending() {
    let isDuplicate = false;
    let isLendingPrevious = false;
    //create new array same with timeline_lending for modifing
    let timelineCopy = JSON.parse(
      JSON.stringify(this.state.backup_timeline_lending)
    );
    for (let i = 0; i < this.state.backup_timeline_lending.length; i++) {
      timelineCopy[i].data = document.getElementById([
        'day-timeline-lending-' + i,
      ]).value;
    }
    //Sort and check duplicate before saving
    for (let i = 0; i < timelineCopy.length; i++) {
      timelineCopy.sort(function(day1, day2) {
        if (new Date(day1.data) - new Date(day2.data) === 0) {
          isDuplicate = true;
        }
        return new Date(day1.data) - new Date(day2.data);
      });
    }

    // var currentDay = this.convertDateToTimestamp(new Date());
    var currentDay = new Date(this.state.timeline_lending[0].data);
    // CHECK NOT ALLOW Milestone lower than current day
    for (let i = 0; i < timelineCopy.length; i++) {
      const element = timelineCopy[i];
      if (
        this.convertDateToTimestamp(currentDay) > this.convertDateToTimestamp(new Date(element.data))
      ) {
        isLendingPrevious = true;
      }
    }
    if (!isDuplicate && !isLendingPrevious) {
      // change percent before save
      for (let i = 1; i < timelineCopy.length; i++) {
        const element = timelineCopy[i];
        element.percent =
          Math.round(
            (1 / (this.state.backup_timeline_lending.length - 1)) * 100
          ) / 100;
      }

      // save data after changing
      await this.setState({
        timeline_lending: timelineCopy,
      });
      //update data in parent (create request)
      this.props.onDataChange(
        this.state.timeline_lending,
        this.state.timeline_payback
      );

      for (let i = 0; i < this.state.backup_timeline_lending.length; i++) {
        document.getElementById(['day-timeline-lending-' + i]).style.display =
          'none';
        document.getElementById([
          'delete-milestone-lending-' + i,
        ]).style.display = 'none';
      }
      if (this.state.isLendMany) {
        document.getElementById('addMilestoneLending').style.display = 'none';
      }
      document.getElementById('saveTimelineLending').style.display = 'none';
      document.getElementById('cancelButtonLending').style.display = 'none';
      document.getElementById('horizontalLendingTimeline').style.display = '';
      document.getElementById('dropdownChooseLending').style.display = '';

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
          )
        );
        this.setState({timeline_payback: payback});
      }
    } else {
      // window.alert('Duplicate date in milestone'); // popup show Error
      if (isDuplicate) {
        await this.setState({
          isOpenError: true,
          error: 'Duplicate date in milestone',
        });
      } else if (isLendingPrevious) {
        await this.setState({
          isOpenError: true,
          error: 'Day cannot be set in the past',
        });
      }
    }
  }
  cancelTimeLineLending() {
    for (let i = 0; i < this.state.backup_timeline_lending.length; i++) {
      document.getElementById(['day-timeline-lending-' + i]).style.display =
        'none';
      document.getElementById(['delete-milestone-lending-' + i]).style.display =
        'none';
    }
    if (this.state.isLendMany) {
      document.getElementById('addMilestoneLending').style.display = 'none';
    }
    document.getElementById('saveTimelineLending').style.display = 'none';
    document.getElementById('cancelButtonLending').style.display = 'none';
    document.getElementById('horizontalLendingTimeline').style.display = '';
    document.getElementById('dropdownChooseLending').style.display = '';
  }
  async deleteMilestoneLending(index) {
    if (this.state.backup_timeline_lending.length <= 2) {
      // Using modal for popup error
      // window.alert('Timeline have at least 2 milestone');
      await this.setState({
        isOpenError: true,
        error: 'Timeline have at least 2 milestone',
      });
    } else {
      await this.state.backup_timeline_lending.splice(index, 1);
      document.getElementById(
        'day-timeline-lending-' + this.state.backup_timeline_lending.length
      ).style.display = 'none';
      document.getElementById(
        'delete-milestone-lending-' + this.state.backup_timeline_lending.length
      ).style.display = 'none';
      this.cancelTimeLineLending();
      this.changeLendingMilestone();
      //show button
      if (this.state.isLendMany) {
        document.getElementById('addMilestoneLending').style.display = '';
      }
      document.getElementById('saveTimelineLending').style.display = '';
      document.getElementById('cancelButtonLending').style.display = '';
      document.getElementById('horizontalLendingTimeline').style.display =
        'none';
      document.getElementById('dropdownChooseLending').style.display = 'none';
    }
  }
  changeLendingMilestone() {
    for (let i = 0; i < this.state.backup_timeline_lending.length; i++) {
      document.getElementById(['day-timeline-lending-' + i]).style.display = '';
      document.getElementById([
        'day-timeline-lending-' + i,
      ]).value = this.state.backup_timeline_lending[i].data;
      document.getElementById(['delete-milestone-lending-' + i]).style.display =
        '';
    }
  }
  createLendingTimeline() {
    return (
      <HorizontalTimeline
        styles={{
          // background: "#f8f8f8",
          foreground: '#1A79AD',
          outline: '#dfdfdf',
        }}
        index={this.state.curLendingId}
        indexClick={index => {
          const curLendingId = this.state.curLendingId;
          this.setState({curLendingId: index, prevLendingId: curLendingId});
          // this.changeTimeLineLending();
        }}
        minEventPadding={100}
        maxEventPadding={150}
        // isOpenBeginning={false}
        // isOpenEnding={false}
        fillingMotion={{
          stiffness: 0,
          damping: 25,
        }}
        slidingMotion={{
          stiffness: 0,
          damping: 25,
        }}
        values={this.state.timeline_lending.map(x => x.data)}
      />
    );
  }
  onDayChangeLending(event) {
    this.setState({
      dayTimelineLending: new Date(event.target.value),
    });
  }
  toggleModalCheckTimelineLending() {
    this.setState({modalLending: !this.state.modalLending});
  }
  toggleModalCheckTimelinePayback() {
    this.setState({modalPayback: !this.state.modalPayback});
  }
  async checkPaymentPaid(rawMilestone, previousDate, presentDate, pos) {
    let penalty = 0;
    let today = this.convertDateToTimestamp(new Date());
    let durationLate = 0;
    let mileStonePayback = [];
    let firstPayback = 0;
    await this.setState({});
    for (let i = 0; i < rawMilestone.length; i++) {
      const element = rawMilestone[i];
      if (element.type === 'payback') {
        mileStonePayback.push(element);
      }
      if (mileStonePayback[0] == element) {
        firstPayback = i;
      }
    }
    if (pos == rawMilestone.length - 1 && today > presentDate) {
      durationLate = Math.round((today - presentDate) / 86400);
    } else if (pos === firstPayback) {
      durationLate = Math.round((today - presentDate) / 86400);
    }
    // else if (today > previousDate && today < presentDate){
    //   console.log('cccccccccccccccc');
    //   durationLate = Math.round((today - previousDate) / 86400);
    // }
    for (let i = 1; i < mileStonePayback.length; i++) {
      const element = mileStonePayback[i];
      if (element.presentDate === presentDate) {
        this.setState({
          unpaidPaybackError:
            'You did not payback in range between ' +
            this.convertTimeStampToDate(previousDate) +
            ' and ' +
            this.convertTimeStampToDate(presentDate) +
            '! You must pay for it !',
          curDatePayback: element,
        });
        break;
      } else {
        if (
          element.transaction.status === null &&
          element.presentDate !== presentDate
        ) {
          this.setState({
            unpaidPaybackError:
              'You did not payback in range between ' +
              this.convertTimeStampToDate(previousDate) +
              ' and ' +
              this.convertTimeStampToDate(presentDate) +
              '! You must pay for it !',
            curDatePayback: element,
          });
          break;
        }
      }
    }
    penalty = (this.props.request.data.interestRate / 720) * durationLate;
    this.setState({
      durationLate: durationLate,
      penalty: penalty.toFixed(2),
    });
    // return penalty.toFixed(2);
  }
  async checkTimeline(typePayment) {
    await this.setState({
      unpaidPaybackError: '',
    });
    const dateNow = this.convertDateToTimestamp(new Date());
    this.setState({penalty: 0});
    let lendMS = [];
    let paybackMS = [];
    for (let i = 0; i < this.props.rawMilestone.length; i++) {
      const element = this.props.rawMilestone[i];
      if (element.type === 'lend') {
        lendMS.push(element);
      } else if (element.type === 'payback') {
        paybackMS.push(element);
      }
    }
    for (let i = 0; i < this.state.rawMilestone.length; i++) {
      const element = this.state.rawMilestone[i];
      if (element.type === typePayment && typePayment === 'lend') {
        if (element.previousDate <= dateNow && element.presentDate >= dateNow) {
          this.setState({
            curDateLending: element,
            typePayment: typePayment,
            isInMilestoneLending: true,
          });
          if (element.transaction.status != null) {
            this.setState({
              isMilestoneLendingPaid: true,
            });
          } else {
            this.setState({
              isMilestoneLendingPaid: false,
            });
          }
          break;
        } else {
          this.setState({isInMilestoneLending: false});
        }
      } else if (element.type === typePayment && typePayment === 'payback') {
        if (element.previousDate <= dateNow && element.presentDate >= dateNow) {
          this.setState({
            curDatePayback: element,
            typePayment: typePayment,
            isInMilestonePayback: true,
          });
          if (element.transaction.status != null) {
            this.setState({
              isMilestonePaybackPaid: true,
            });
            break;
          } else {
            this.setState({
              isMilestonePaybackPaid: false,
            });
            this.checkPaymentPaid(
              this.state.rawMilestone,
              element.previousDate,
              element.presentDate,
              i
            );
            break;
          }
        } else if (
          element.presentDate < dateNow &&
          element.type === typePayment &&
          typePayment === 'payback' &&
          element !== paybackMS[0]
        ) {
          if (element.transaction.status != null) {
            this.setState({
              isMilestonePaybackPaid: true,
            });
            break;
          } else {
            this.setState({
              isInMilestonePayback: true,
              isMilestonePaybackPaid: false,
            });
            this.checkPaymentPaid(
              this.state.rawMilestone,
              element.previousDate,
              element.presentDate,
              i
            );
            break;
          }
        } else {
          this.setState({isInMilestonePayback: false});
        }
      }
    }
  }
  // End Function Lending

  //Begin Function Payback
  async changePaybackTimeLine() {
    // create temporary data for making backup data
    let dataEXAMPLE = JSON.parse(JSON.stringify(this.state.timeline_payback));
    await this.setState({
      backup_timeline_payback: dataEXAMPLE,
    });
    this.changePaybackMilestone();
    //show button
    if (this.state.isPaybackMany) {
      document.getElementById('addMilestonePayback').style.display = '';
    }
    document.getElementById('saveTimelinePayback').style.display = '';
    document.getElementById('cancelButtonPayback').style.display = '';
    document.getElementById('horizontalPaybackTimeline').style.display = 'none';
    document.getElementById('dropdownChoosePayback').style.display = 'none';
  }
  async addPaybackMilestone() {
    await this.setState({
      backup_timeline_payback: [
        ...this.state.backup_timeline_payback,
        {
          data: this.formatDate(
            new Date(
              (new Date(
                this.state.backup_timeline_payback[
                  this.state.backup_timeline_payback.length - 1
                ].data
              ).getTime() /
                1000 +
                86400 * this.state.duration) *
                1000
            )
          ),
          status: 'ABC',
        },
      ],
    });
    //re-render change milestone
    this.cancelPaybackTimeLine();
    this.changePaybackMilestone();
    //show button
    if (this.state.isPaybackMany) {
      document.getElementById('addMilestonePayback').style.display = '';
    }
    document.getElementById('saveTimelinePayback').style.display = '';
    document.getElementById('cancelButtonPayback').style.display = '';
    document.getElementById('horizontalPaybackTimeline').style.display = 'none';
    document.getElementById('dropdownChoosePayback').style.display = 'none';
  }
  async savePaybackTimeLine() {
    let isDuplicate = false;
    let isPaybackPrevious = false;
    //create new array same with timeline_payback for modifing
    let timelinePaybackCopy = JSON.parse(
      JSON.stringify(this.state.backup_timeline_payback)
    );
    let timelineLendingCopy = JSON.parse(
      JSON.stringify(this.state.timeline_lending)
    );
    for (let i = 0; i < this.state.backup_timeline_payback.length; i++) {
      timelinePaybackCopy[i].data = document.getElementById([
        'day-timeline-payback-' + i,
      ]).value;
    }
    //Sort and check duplicate before saving
    for (let i = 0; i < timelinePaybackCopy.length; i++) {
      timelinePaybackCopy.sort(function(day1, day2) {
        if (new Date(day1.data) - new Date(day2.data) === 0) {
          isDuplicate = true;
        }
        return new Date(day1.data) - new Date(day2.data);
      });
    }
    var currentDay = new Date(this.state.timeline_payback[0].data);
    // CHECK NOT ALLOW Milestone lower than current day
    for (let i = 0; i < timelinePaybackCopy.length; i++) {
      const element = timelinePaybackCopy[i];
      if (
        this.convertDateToTimestamp(currentDay) > this.convertDateToTimestamp(new Date(element.data))
      ) {
        isPaybackPrevious = true;
      }
    }
    if (!isDuplicate && !isPaybackPrevious) {
      // change data if type isLendMany and isPaybackMany
      if (this.state.isLendMany && this.state.isPaybackMany) {
        for (let i = 1; i < timelineLendingCopy.length; i++) {
          const elementLending = timelineLendingCopy[i];
          let j = i - 1;
          const elementPayback = timelinePaybackCopy[j];
          elementPayback.data = elementLending.data;
          if (i === timelineLendingCopy.length) {
            for (let k = j + 1; k < timelinePaybackCopy.length; k++) {
              const elementK = timelinePaybackCopy[k];
              elementK.data = this.formatDate(
                new Date(
                  (new Date(
                    this.state.backup_timeline_payback[
                      this.state.backup_timeline_payback.length - 1
                    ].data
                  ).getTime() /
                    1000 +
                    86400 * this.state.duration) *
                    1000
                )
              );
            }
          }
        }
      }
      // change percent before save
      for (let i = 1; i < timelinePaybackCopy.length; i++) {
        const element = timelinePaybackCopy[i];
        element.percent =
          Math.round(
            (1 / (this.state.backup_timeline_payback.length - 1)) * 100
          ) / 100;
      }
      await this.setState({
        timeline_payback: timelinePaybackCopy,
      });
      //update data in parent (create request)
      this.props.onDataChange(
        this.state.timeline_lending,
        this.state.timeline_payback
      );

      for (let i = 0; i < this.state.backup_timeline_payback.length; i++) {
        document.getElementById(['day-timeline-payback-' + i]).style.display =
          'none';
        document.getElementById([
          'delete-milestone-payback-' + i,
        ]).style.display = 'none';
      }
      if (this.state.isPaybackMany) {
        document.getElementById('addMilestonePayback').style.display = 'none';
      }
      document.getElementById('saveTimelinePayback').style.display = 'none';
      document.getElementById('cancelButtonPayback').style.display = 'none';
      document.getElementById('horizontalPaybackTimeline').style.display = '';
      document.getElementById('dropdownChoosePayback').style.display = '';
    } else {
      // window.alert('Duplicate date in milestone'); // popup show Error
      if(isDuplicate) {
        await this.setState({
          isOpenError: true,
          error: 'Duplicate date in milestone',
        });
      } else if(isPaybackPrevious) {
        await this.setState({
          isOpenError: true,
          error: 'Day cannot be set in the past'
        })
      }
      
    }
  }
  cancelPaybackTimeLine() {
    for (let i = 0; i < this.state.backup_timeline_payback.length; i++) {
      document.getElementById(['day-timeline-payback-' + i]).style.display =
        'none';
      document.getElementById(['delete-milestone-payback-' + i]).style.display =
        'none';
    }
    if (this.state.isPaybackMany) {
      document.getElementById('addMilestonePayback').style.display = 'none';
    }
    document.getElementById('saveTimelinePayback').style.display = 'none';
    document.getElementById('cancelButtonPayback').style.display = 'none';
    document.getElementById('horizontalPaybackTimeline').style.display = '';
    document.getElementById('dropdownChoosePayback').style.display = '';
  }
  async deleteMilestonePayback(index) {
    if (this.state.backup_timeline_payback.length <= 2) {
      // Using modal for popup error
      // window.alert('Timeline have at least 2 milestone');
      await this.setState({
        isOpenError: true,
        error: 'Timeline have at least 2 milestone',
      });
    } else {
      await this.state.backup_timeline_payback.splice(index, 1);
      document.getElementById(
        'day-timeline-payback-' + this.state.backup_timeline_payback.length
      ).style.display = 'none';
      document.getElementById(
        'delete-milestone-payback-' + this.state.backup_timeline_payback.length
      ).style.display = 'none';
      this.cancelPaybackTimeLine();
      this.changePaybackMilestone();
      //show button
      if (this.state.isPaybackMany) {
        document.getElementById('addMilestonePayback').style.display = '';
      }
      document.getElementById('saveTimelinePayback').style.display = '';
      document.getElementById('cancelButtonPayback').style.display = '';
      document.getElementById('horizontalPaybackTimeline').style.display =
        'none';
      document.getElementById('dropdownChoosePayback').style.display = 'none';
    }
  }
  changePaybackMilestone() {
    for (let i = 0; i < this.state.backup_timeline_payback.length; i++) {
      document.getElementById(['day-timeline-payback-' + i]).style.display = '';
      document.getElementById([
        'day-timeline-payback-' + i,
      ]).value = this.state.backup_timeline_payback[i].data;
      document.getElementById(['delete-milestone-payback-' + i]).style.display =
        '';
    }
  }
  createPaybackTimeline() {
    return (
      <HorizontalTimeline
        styles={{
          // background: "#f8f8f8",
          foreground: '#1A79AD',
          outline: '#dfdfdf',
        }}
        index={this.state.curPaybackId}
        indexClick={index => {
          const curPaybackId = this.state.curPaybackId;
          this.setState({curPaybackId: index, prevPaybackId: curPaybackId});
          // this.changePaybackTimeLine();
        }}
        minEventPadding={100}
        maxEventPadding={150}
        // isOpenBeginning={false}
        // isOpenEnding={false}
        fillingMotion={{
          stiffness: 0,
          damping: 25,
        }}
        slidingMotion={{
          stiffness: 0,
          damping: 25,
        }}
        values={this.state.timeline_payback.map(x => x.data)}
      />
    );
  }
  onDayChangePayback(event) {
    this.setState({
      dayTimelinePayback: new Date(event.target.value),
    });
  }
  async handleError(data) {
    var error = data.toString();
    if (error === 'TypeError: Failed to fetch') {
      await this.setState({
        isOpenError: true,
        error: 'Cannot access to server',
      });
    } else {
      await this.setState({
        isOpenError: true,
        error: 'Something when wrong !',
      });
    }
  }
  //End Function Payback
  send_tx = () => {
    let user = localStorage.getItem('user');
    let receiver = '';
    if (user === this.props.borrowerUser) {
      receiver = this.props.lenderUser;
    } else {
      receiver = this.props.borrowerUser;
    }
    if (receiver !== '') {
      let data_transaction = {
        data_tx: {
          data: {
            //change amount later
            tx_data: {
              txId: this.state.data_tx.txId,
              sender: user,
              receiver: receiver,
              amountTx: this.state.data_tx.amount,
              createDate: this.state.data_tx.createDate,
            },
            deal_data: {
              //re-work
              dealId: this.props.request.data.deal.id,
              amount: this.props.request.data.amount,
              interestRate: this.props.request.data.interestRate,
              borrower: this.props.request.data.borrower.username,
              lender: this.props.request.data.lender.username,
              milestone: this.props.request.data.deal.milestone,
            },
          },
        },
        metadata_tx: {
          ownerTx: user,
          createDate: this.state.data_tx.createDate,
        },
      };
      fetch(bigchainAPI + '/send_tx', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data_transaction),
      })
        .then(response => response.json())
        .then(data => {
          this.saveTransaction(data, data_transaction);
        })
        .catch(async data => {
          //CANNOT ACCESS TO SERVER
          console.log(data);
          await this.handleError(data);
        });
    } else {
      alert('Receiver is null');
    }
  };
  saveTransaction(data, data_transaction) {
    let idMilestone = -1;
    let amountToSV = 0;
    if (this.state.typePayment !== '' && this.state.typePayment === 'lend') {
      idMilestone = this.state.curDateLending.id;
      amountToSV = this.props.amountProps * this.state.curDateLending.percent;
    } else {
      idMilestone = this.state.curDatePayback.id;
      amountToSV =
        (this.props.request.data.amount +
          Math.round(
            ((((this.props.request.data.amount *
              (this.props.request.data.deal.milestone[
                this.props.request.data.deal.milestone.length - 1
              ].presentDate -
                this.props.request.data.deal.milestone[0].presentDate)) /
              86400 /
              30) *
              (this.props.request.data.interestRate / 12)) /
              100) *
              1000
          ) /
            1000) *
          this.state.curDatePayback.percent +
        this.state.penalty * this.props.request.data.amount;
    }
    fetch(apiLink + '/rest/transaction/newTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        sender: data_transaction.data_tx.data.tx_data.sender,
        receiver: data_transaction.data_tx.data.tx_data.receiver,
        amount: Number(amountToSV),
        amountValid: Number(data.amount),
        status: data.status,
        idTrx: data.id,
        createDate: data_transaction.data_tx.data.tx_data.createDate,
        milestone: {
          id: Number(idMilestone),
        },
      }),
    })
      .then(async result => {
        if (result.status === 200) {
          await this.setState({
            isOpenSuccess: true,
          });
          await database
            .ref('ppls')
            .orderByChild('username')
            .equalTo(data_transaction.data_tx.data.tx_data.receiver)
            .once('value', snapshot => {
              if (snapshot.exists()) {
                const userData = snapshot.val();
                this.setState({keyUserFb: Object.keys(userData)[0]});
              }
            });
          await database
            .ref('/ppls/' + this.state.keyUserFb + '/notification')
            .push({
              message:
                localStorage.getItem('user') +
                ' paid for milestone number : ' +
                idMilestone +
                ' ',
              sender: localStorage.getItem('user'),
            });
          var upvotesRef = database.ref(
            '/ppls/' + this.state.keyUserFb + '/countNew'
          );
          await upvotesRef.transaction(function(current_value) {
            return (current_value || 0) + 1;
          });
          this.props.goToViewRequestTrading();
        } else if (result.status === 401) {
          localStorage.removeItem('isLoggedIn');
          this.props.history.push('/login-page');
        } else if (result.status === 400) {
          result.text().then(async data => {
            console.log(data);
          });
        }
      })
      .catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.handleError(data);
      });
  }

  roundUp(num) {
    let precision = Math.pow(10, 2);
    return Math.ceil(num * precision) / precision;
  }
  render() {
    const {curLendingId, curPaybackId} = this.state;
    const curLendingStatus = this.state.timeline_lending[curLendingId].percent;
    const isLendMany = this.state.isLendMany;

    const curPaybackStatus = this.state.timeline_payback[curPaybackId].percent;
    const isPaybackMany = this.state.isPaybackMany;

    const isTrading = this.props.viewDetail.isTrading;
    const isViewDetail = this.props.viewDetail.isViewDetail;
    const isHistory = this.props.viewDetail.isHistory;
    const styleCheckTimeline = {
      margin: '0 auto',
      marginTop: '3em',
    };

    return (
      <>
        {/* Begin Lending  */}
        <Row className="justify-content-center ">
          <CardBody className="p-lg-4">
            {isViewDetail ? (
              isHistory ? (
                ''
              ) : (
                <div id="dropdownChooseLending">
                  <Label>
                    Type Lending Timeline <span>&nbsp;&nbsp;&nbsp;</span>{' '}
                  </Label>
                  <UncontrolledDropdown>
                    <DropdownToggle caret color="secondary">
                      {isLendMany ? (
                        <span>Lend Many</span>
                      ) : (
                        <span>Lend Once</span>
                      )}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        // href="#pablo"
                        onClick={async e => {
                          if (this.state.timeline_lending.length > 2) {
                            // window.alert('Timeline have over 2 milestones.');
                            await this.setState({
                              isOpenError: true,
                              error: 'Timeline have at least 2 milestone',
                            });
                          } else {
                            this.setState({
                              isLendOnce: true,
                              isLendMany: false,
                            });
                          }
                          e.preventDefault();
                        }}
                      >
                        Lend Once
                      </DropdownItem>
                      <DropdownItem
                        // href="#pablo"
                        onClick={e => {
                          this.setState({
                            isLendOnce: false,
                            isLendMany: true,
                          });
                          e.preventDefault();
                        }}
                      >
                        Lend Many
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              )
            ) : (
              ''
            )}
            {this.state.backup_timeline_lending.map((data, index) => (
              <Row key={index}>
                <Col md="4">
                  <Input
                    id={'day-timeline-lending-' + index}
                    type="date"
                    onChange={this.onDayChangeLending.bind(this)}
                    style={{display: 'none'}}
                  />
                </Col>
                <Col>
                  {/* Delete button */}
                  <Button
                    // type="submit"
                    id={'delete-milestone-lending-' + index}
                    size="md"
                    outline
                    color="danger"
                    style={{display: 'none'}}
                    onClick={() => this.deleteMilestoneLending(index)}
                  >
                    <i className="fa fa-remove" /> Delete
                  </Button>{' '}
                </Col>
              </Row>
            ))}
            {/* Lend - Add New button */}
            {isLendMany ? (
              <Button
                // type="submit"
                id="addMilestoneLending"
                size="md"
                outline
                color="primary"
                style={{display: 'none'}}
                onClick={() => this.addMilestoneLending()}
              >
                <i className="fa fa-dot-circle-o" /> Add Milestone
              </Button>
            ) : (
              ''
            )}
            {/* Lend - Save button */}
            <Button
              // type="submit"
              id="saveTimelineLending"
              size="md"
              outline
              color="primary"
              style={{display: 'none'}}
              onClick={() => this.saveTimeLineLending()}
            >
              <i className="ni ni-cloud-download-95" /> Save Timeline
            </Button>{' '}
            {/* Lend - Cancel Button */}
            <Button
              // type="submit"
              id="cancelButtonLending"
              size="md"
              outline
              color="warning"
              style={{display: 'none'}}
              onClick={() => this.cancelTimeLineLending()}
            >
              <i className="fa" /> Cancel
            </Button>
            <div id="horizontalLendingTimeline">
              {isViewDetail ? (
                isHistory ? (
                  ''
                ) : (
                  <div>
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
                  </div>
                )
              ) : (
                ''
              )}
              <div>
                {isTrading ? (
                  <div>
                    <FormGroup row className="py-2">
                      <Col md="9">
                        <div
                          style={{
                            width: '100%',
                            height: '100px',
                            margin: '0 auto',
                            marginTop: '20px',
                            fontSize: '13px',
                          }}
                        >
                          {this.createLendingTimeline()}
                        </div>

                        <div className="text-center">
                          {'Amount Percent to lend in milestone ' +
                            curLendingId +
                            ' is' +
                            curLendingStatus * 100 +
                            '%'}
                        </div>
                      </Col>
                      <Col md="3">
                        {this.props.borrowerUser ===
                        localStorage.getItem('user') ? (
                          ''
                        ) : (
                          <Button
                            id="acceptButton"
                            size="md"
                            color="primary"
                            onClick={() => {
                              this.checkTimeline('lend');
                              this.toggleModalCheckTimelineLending();
                            }}
                            disabled={this.state.editable}
                            style={styleCheckTimeline}
                          >
                            <i className="fa" /> Check Timeline
                          </Button>
                        )}

                        <Modal
                          isOpen={this.state.modalLending}
                          toggle={() => this.toggleModalCheckTimelineLending()}
                          className={this.props.className}
                        >
                          <ModalHeader
                            toggle={() =>
                              this.toggleModalCheckTimelineLending()
                            }
                          >
                            Check timeline
                          </ModalHeader>
                          <ModalBody>
                            <FormGroup row>
                              <Col md="6">
                                <Label className="h6">Today</Label>
                              </Col>
                              <Col md="6">
                                <Label className="h6">
                                  {this.convertTimeStampToDate(
                                    this.convertDateToTimestamp(new Date())
                                  )}
                                </Label>
                              </Col>
                            </FormGroup>
                            {this.state.isInMilestoneLending ? (
                              <div>
                                <FormGroup row>
                                  <Col md="6">
                                    <Label className="h6">
                                      Milestone start
                                    </Label>
                                  </Col>
                                  <Col md="6">
                                    <Label className="h6">Milestone end</Label>
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Col md="6">
                                    <p>
                                      {this.convertTimeStampToDate(
                                        this.state.curDateLending.previousDate
                                      )}
                                    </p>
                                  </Col>
                                  <Col md="6">
                                    <p>
                                      {this.convertTimeStampToDate(
                                        this.state.curDateLending.presentDate
                                      )}
                                    </p>
                                  </Col>
                                  {this.state.isMilestoneLendingPaid ? (
                                    <Col md="10">
                                      <p style={{paddingLeft: '40%'}}>
                                        Milestone is Paid
                                      </p>
                                    </Col>
                                  ) : (
                                    <Col>
                                      <PayPalButton
                                        amount={this.roundUp(
                                          (this.state.amountProps *
                                            this.state.curDateLending.percent) /
                                            this.state.currencyUSDVND
                                        )}
                                        onSuccess={(details, data) => {
                                          this.toggleModalCheckTimelineLending();
                                          this.setState({
                                            modalLending: false,
                                            data_tx: {
                                              txId: details.id,
                                              createDate: this.convertDateToTimestamp(
                                                new Date()
                                              ),
                                              status: details.status,
                                              amount:
                                                details.purchase_units[0].amount
                                                  .value,
                                            },
                                          });
                                          this.send_tx();
                                        }}
                                        style={{
                                          layout: 'horizontal',
                                          shape: 'pill',
                                          disableFunding: true,
                                          tagline: false,
                                          size: 'responsive',
                                        }}
                                        options={{
                                          clientId: client_API,
                                        }}
                                      />
                                    </Col>
                                  )}
                                </FormGroup>
                              </div>
                            ) : (
                              <FormGroup row>
                                <Col md="10">
                                  <p style={{paddingLeft: '40%'}}>
                                    Today is not in timeline
                                  </p>
                                </Col>
                              </FormGroup>
                            )}
                          </ModalBody>
                        </Modal>
                      </Col>
                    </FormGroup>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        width: '100%',
                        height: '100px',
                        margin: '0 auto',
                        marginTop: '20px',
                        fontSize: '13px',
                      }}
                    >
                      {this.createLendingTimeline()}
                    </div>

                    <div className="text-center">
                      {'Amount Percent to lend in milestone ' +
                        curLendingId +
                        ' is ' +
                        curLendingStatus * 100 +
                        '%'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Row>
        {/* End Lending  */}

        {/* Begin Payback  */}
        <Row className="justify-content-center ">
          <CardBody className="p-lg-4">
            {isViewDetail ? (
              isHistory ? (
                ''
              ) : (
                <div id="dropdownChoosePayback">
                  <Label>
                    Type Payback Timeline <span>&nbsp;&nbsp;&nbsp;</span>{' '}
                  </Label>
                  <UncontrolledDropdown>
                    <DropdownToggle caret color="secondary">
                      {isPaybackMany ? (
                        <span>Payback Many</span>
                      ) : (
                        <span>Payback Once</span>
                      )}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        // href="#pablo"
                        onClick={async e => {
                          if (this.state.timeline_payback.length > 2) {
                            // window.alert('Timeline have over 2 milestones.');
                            await this.setState({
                              isOpenError: true,
                              error: 'Timeline have at least 2 milestone',
                            });
                          } else {
                            this.setState({
                              isPaybackOnce: true,
                              isPaybackMany: false,
                            });
                          }
                          e.preventDefault();
                        }}
                      >
                        Payback Once
                      </DropdownItem>
                      <DropdownItem
                        // href="#pablo"
                        onClick={e => {
                          this.setState({
                            isPaybackOnce: false,
                            isPaybackMany: true,
                          });
                          e.preventDefault();
                        }}
                      >
                        Payback Many
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              )
            ) : (
              ''
            )}
            {this.state.backup_timeline_payback.map((data, index) => (
              <Row key={index}>
                <Col md="4">
                  <Input
                    id={'day-timeline-payback-' + index}
                    type="date"
                    onChange={this.onDayChangePayback.bind(this)}
                    style={{display: 'none'}}
                  />
                </Col>
                <Col>
                  {/* Delete button */}
                  <Button
                    // type="submit"
                    id={'delete-milestone-payback-' + index}
                    size="md"
                    outline
                    color="danger"
                    style={{display: 'none'}}
                    onClick={() => this.deleteMilestonePayback(index)}
                  >
                    <i className="fa fa-remove" /> Delete
                  </Button>{' '}
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
                outline
                style={{display: 'none'}}
                onClick={() => this.addPaybackMilestone()}
              >
                <i className="fa fa-dot-circle-o" /> Add Milestone
              </Button>
            ) : (
              ''
            )}
            {/* Payback - Save button */}
            <Button
              // type="submit"
              id="saveTimelinePayback"
              size="md"
              outline
              color="primary"
              style={{display: 'none'}}
              onClick={() => this.savePaybackTimeLine()}
            >
              <i className="ni ni-cloud-download-95" /> Save Timeline
            </Button>{' '}
            {/* Payback - Cancel Button */}
            <Button
              // type="submit"
              id="cancelButtonPayback"
              size="md"
              outline
              color="primary"
              style={{display: 'none'}}
              onClick={() => this.cancelPaybackTimeLine()}
            >
              <i className="fa" /> Cancel
            </Button>
            <div id="horizontalPaybackTimeline">
              {isViewDetail ? (
                isHistory ? (
                  ''
                ) : (
                  <div>
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
                  </div>
                )
              ) : (
                ''
              )}
              {isTrading ? (
                <div>
                  <FormGroup row className="py-2">
                    <Col md="9">
                      <div
                        style={{
                          width: '100%',
                          height: '100px',
                          margin: '0 auto',
                          marginTop: '20px',
                          fontSize: '13px',
                        }}
                      >
                        {this.createPaybackTimeline()}
                      </div>
                      <div className="text-center">
                        {'Amount Percent to pay in milestone ' +
                          curPaybackId +
                          ' is ' +
                          curPaybackStatus * 100 +
                          ' %'}
                      </div>
                    </Col>
                    <Col md="3">
                      {this.props.borrowerUser ===
                      localStorage.getItem('user') ? (
                        <Button
                          id="acceptButton"
                          size="md"
                          color="primary"
                          onClick={() => {
                            this.checkTimeline('payback');
                            this.toggleModalCheckTimelinePayback();
                          }}
                          disabled={this.state.editable}
                          style={styleCheckTimeline}
                        >
                          <i className="fa" /> Check Timeline
                        </Button>
                      ) : (
                        ''
                      )}

                      <Modal
                        isOpen={this.state.modalPayback}
                        toggle={() => this.toggleModalCheckTimelinePayback()}
                        className={this.props.className}
                      >
                        <ModalHeader
                          toggle={() => this.toggleModalCheckTimelinePayback()}
                        >
                          Check timeline
                        </ModalHeader>
                        <ModalBody>
                          <FormGroup row>
                            {this.state.unpaidPaybackError !== '' ? (
                              <p className="h6" style={{color: 'red'}}>
                                {this.state.unpaidPaybackError}
                              </p>
                            ) : (
                              ''
                            )}

                            <Col md="6">
                              <Label className="h6">Today</Label>
                            </Col>
                            <Col md="6">
                              <Label className="h6">
                                {this.convertTimeStampToDate(
                                  this.convertDateToTimestamp(new Date())
                                )}
                              </Label>
                            </Col>
                          </FormGroup>
                          {this.state.durationLate > 0 ? (
                            <div>
                              <FormGroup row>
                                <Col md="6">
                                  <Label className="h6">Late Days : </Label>
                                </Col>
                                <Col md="6">
                                  <Label className="h6">
                                    {this.state.durationLate} days
                                  </Label>
                                </Col>
                              </FormGroup>
                              <FormGroup row>
                                <Col md="6">
                                  <Label className="h6">
                                    Penalty per day :{' '}
                                  </Label>
                                </Col>
                                <Col md="6">
                                  <Label className="h6">
                                    {this.numberWithCommas(
                                      Math.round(
                                        (this.state.penalty /
                                          this.state.durationLate) *
                                          this.props.request.data.amount
                                      )
                                    )}{' '}
                                    VNĐ
                                  </Label>
                                </Col>
                              </FormGroup>
                            </div>
                          ) : (
                            ''
                          )}

                          {this.state.isInMilestonePayback ? (
                            <div>
                              <FormGroup row>
                                <Col md="6">
                                  <Label className="h6">Amount :</Label>
                                </Col>
                                <Col md="6">
                                  <Label className="h6">
                                    {this.numberWithCommas(
                                      (this.props.request.data.amount +
                                        Math.round(
                                          ((((this.props.request.data.amount *
                                            (this.props.request.data.deal
                                              .milestone[
                                              this.props.request.data.deal
                                                .milestone.length - 1
                                            ].presentDate -
                                              this.props.request.data.deal
                                                .milestone[0].presentDate)) /
                                            86400 /
                                            30) *
                                            (this.props.request.data
                                              .interestRate /
                                              12)) /
                                            100) *
                                            1000
                                        ) /
                                          1000) *
                                        this.state.curDatePayback.percent +
                                        this.state.penalty *
                                          this.props.request.data.amount
                                    )}{' '}
                                    VNĐ
                                  </Label>
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Col md="6">Milestone Start</Col>
                                <Col md="6">Milestone End</Col>
                              </FormGroup>
                              <FormGroup row>
                                <Col md="6">
                                  <p>
                                    {this.convertTimeStampToDate(
                                      this.state.curDatePayback.previousDate
                                    )}
                                  </p>
                                </Col>
                                <Col md="6">
                                  <p>
                                    {this.convertTimeStampToDate(
                                      this.state.curDatePayback.presentDate
                                    )}
                                  </p>
                                </Col>
                                {this.state.isMilestonePaybackPaid ? (
                                  <Col md="10">
                                    <p style={{paddingLeft: '40%'}}>
                                      Milestone is Paid
                                    </p>
                                  </Col>
                                ) : (
                                  <Col>
                                    <PayPalButton
                                      amount={this.roundUp(
                                        ((this.props.request.data.amount +
                                          Math.round(
                                            ((((this.props.request.data.amount *
                                              (this.props.request.data.deal
                                                .milestone[
                                                this.props.request.data.deal
                                                  .milestone.length - 1
                                              ].presentDate -
                                                this.props.request.data.deal
                                                  .milestone[0].presentDate)) /
                                              86400 /
                                              30) *
                                              (this.props.request.data
                                                .interestRate /
                                                12)) /
                                              100) *
                                              1000
                                          ) /
                                            1000) *
                                          this.state.curDatePayback.percent +
                                          this.state.penalty *
                                            this.props.request.data.amount) /
                                          this.state.currencyUSDVND
                                      )}
                                      onSuccess={(details, data) => {
                                        this.toggleModalCheckTimelinePayback();
                                        this.setState({
                                          modalPayback: false,
                                          data_tx: {
                                            txId: details.id,
                                            createDate: this.convertDateToTimestamp(
                                              new Date()
                                            ),
                                            status: details.status,
                                            amount:
                                              details.purchase_units[0].amount
                                                .value,
                                          },
                                        });
                                        this.send_tx();
                                      }}
                                      style={{
                                        layout: 'horizontal',
                                        shape: 'pill',
                                        disableFunding: true,
                                        tagline: false,
                                        size: 'responsive',
                                      }}
                                      options={{
                                        clientId: client_API,
                                      }}
                                    />
                                  </Col>
                                )}
                              </FormGroup>
                            </div>
                          ) : (
                            <FormGroup row>
                              <Col md="10">
                                <p style={{paddingLeft: '40%'}}>
                                  Today is not in timeline
                                </p>
                              </Col>
                            </FormGroup>
                          )}
                        </ModalBody>
                      </Modal>
                    </Col>
                  </FormGroup>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      width: '100%',
                      height: '100px',
                      margin: '0 auto',
                      marginTop: '20px',
                      fontSize: '13px',
                    }}
                  >
                    {this.createPaybackTimeline()}
                  </div>
                  <div className="text-center">
                    {'Amount Percent to pay in milestone ' +
                      curPaybackId +
                      ' is ' +
                      curPaybackStatus * 100 +
                      '%'}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Row>

        {/* End Payback  */}
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.isOpenError}
          // toggle={() => this.toggleModal('defaultModal')}
        >
          <div className="modal-header">Error</div>
          <div className="modal-body">
            <h3 className="modal-title" id="modal-title-default">
              {this.state.error}
            </h3>
          </div>
          <div className="modal-footer">
            <Button
              onClick={() => {
                this.setState({isOpenError: false});
              }}
            >
              OK
            </Button>
          </div>
        </Modal>
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.isOpenSuccess}
          // toggle={() => this.toggleModal('defaultModal')}
        >
          <div className="modal-body">
            <h3 className="modal-title" id="modal-title-default">
              <img
                style={{width: 50, height: 50}}
                src={require('assets/img/theme/checked.png')}
              />
              Successfully Saved
            </h3>
          </div>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    viewDetail: state.viewDetail,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setIsTrading: status => {
      dispatch({
        type: 'SET_IS_TRADING',
        payload: status,
      });
    },
    setIsViewDetail: status => {
      dispatch({
        type: 'SET_IS_VIEWDETAIL',
        payload: status,
      });
    },
    setIsHistory: status => {
      dispatch({
        type: 'SET_IS_HISTORY',
        payload: status,
      });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplyTimeline);
