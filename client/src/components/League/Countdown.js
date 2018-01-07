import React from 'react';
import moment from 'moment';

class Countdown extends React.Component {

  componentWillMount = () => {
    this.startTimer(this.props.end);
  }

  componentWillReceiveProps = newProps => {
    if (this.timer) clearInterval(this.timer);
    this.startTimer(newProps.end);
  }

  componentWillUnmount = () => {
    if (this.timer) clearInterval(this.timer);
  }

  startTimer = end => {
    let endTime = moment(end).unix();
    let currentTime = moment().unix();
    let diffTime = endTime - currentTime;
    let duration = moment.duration(diffTime * 1000, 'milliseconds');
    let interval = 1000;
    this.timer = setInterval(() => {
      duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds');
      if (duration < 0) return clearInterval(this.timer);
      let timePeriods = [duration.days(), duration.hours(), duration.minutes(), duration.seconds()];
      this.setState({
        timePeriods: timePeriods.map(p => p.toString().length === 1 ? '0' + p : p)
      });
    }, interval);
  }

  render = () => (
    <div className="text-center pt-2 flex-row justify-content-between">
      {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, key) => (
        <div key={label}>
          <h4>{this.state ? this.state.timePeriods[key] : '-'}</h4>
          <small className="faded-2">{label}</small>
        </div>
      ))}
    </div>
  );
}

export default Countdown;