import React from 'react';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
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
    let scrollHeight = this.list.getScrollHeight();
    let clientHeight = this.list.getClientHeight();
    let scrollTop = this.list.getScrollTop();
    let autoScroll = scrollHeight - (clientHeight + scrollTop) < 100;
    this.setState({ autoScroll });
  }

  componentDidMount() {
    if (this.state.autoScroll) this.list.scrollToBottom();
  }

  componentDidUpdate() {
    if (this.state.autoScroll) this.list.scrollToBottom();
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
      <Scrollbars autoHide ref={el => this.list = el}>
        <div className="pl-2 py-3">
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
      </Scrollbars>
    );
  }
}

export default ActivityList;