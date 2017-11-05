import React, { Component } from 'react';
const moment = require('moment');

const ActivityItem = function(props) {
  return (
    <div className={`py-1 px-2 activity__item--${props.category}`}>
      <strong className="pr-1">{props.user.username}</strong>
      <span title={moment(props.date).format('YYYY-MM-DD HH:mm')}>
        {props.message}
      </span>
    </div>
  );
};

class ActivityFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoScroll: true
    };
  }

  componentWillReceiveProps() {
    let feed = this.feed;
    let autoScroll = feed.scrollHeight - (feed.clientHeight + feed.scrollTop) < 100;
    this.setState({ autoScroll });
  }

  componentDidUpdate() {
    if (this.state.autoScroll) {
      this.feed.scrollTop = this.feed.scrollHeight;
    }
  }

  render() {
    return (
      <div id="activity__feed" className="scroll-y pl-2 py-3 flex-grow height-100" ref={el => this.feed = el}>
        {this.props.activity.map(action => {
          return <ActivityItem key={action._id} {...action} />
        })}
      </div>
    );
  }
}

export default ActivityFeed;