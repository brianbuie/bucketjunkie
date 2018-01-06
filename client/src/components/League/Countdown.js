import React from 'react';
import moment from 'moment';

class Countdown extends React.Component {

  componentDidMount = () => {
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
      let periods = [
        moment.duration(duration).days(),
        moment.duration(duration).hours(),
        moment.duration(duration).minutes(),
        moment.duration(duration).seconds()
      ];
      this.setState({
        periods: periods.map(p => p.toString().length === 1 ? '0' + p : p)
      });
    }, interval);
  }

  render = () => (
    <div className="text-center pt-2 flex-row justify-content-between">
      {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, key) => (
        <div key={label}>
          <h4>{this.state ? this.state.periods[key] : '-'}</h4>
          <small className="faded-2">{label}</small>
        </div>
      ))}
    </div>
  );
}

export default Countdown;