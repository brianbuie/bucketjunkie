import React from 'react';
import moment from 'moment';
import { calendarFormat } from 'helpers';
import { ActivityItem, ActivityItemDate } from 'components/Activity/ActivityItems';

class ActivityList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autoScroll: true
    };
    this.shouldIncludeDate = this.shouldIncludeDate.bind(this);
  }

  componentWillReceiveProps() {
    let feed = this.feed;
    let autoScroll = feed.scrollHeight - (feed.clientHeight + feed.scrollTop) < 100;
    this.setState({ autoScroll });
  }

  componentDidMount() {
    if (this.state.autoScroll) this.feed.scrollTop = this.feed.scrollHeight;
  }

  componentDidUpdate() {
    if (this.state.autoScroll) this.feed.scrollTop = this.feed.scrollHeight;
  }

  shouldIncludeDate(key) {
    if (key === 0) return true;
    let prevDate = this.props.items[key - 1].date;
    let currDate = this.props.items[key].date;
    // return true if calendar dates aren't equal
    return moment(prevDate).calendar(null, calendarFormat) != moment(currDate).calendar(null, calendarFormat);
  }

  render() {
    return(
      <div ref={el => this.feed = el} className="scroll-y pl-2 py-3 flex-grow">
        {this.props.items.map((item, k) => {
          if (this.shouldIncludeDate(k)) return (
            <div key={item._id}>
              <ActivityItemDate date={item.date} />
              <ActivityItem {...item} />
            </div>
          );
          return <ActivityItem key={item._id} {...item} />
        })}
      </div>
    );
  }
}

export default ActivityList;