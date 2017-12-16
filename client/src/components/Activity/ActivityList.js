import './Activity.scss';

import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { calendarFormat } from 'helpers';
import ActivityItem from 'components/Activity/ActivityItems';

class ActivityList extends React.Component {

  componentWillReceiveProps = () => {
    let scrollHeight = this.list.getScrollHeight();
    let clientHeight = this.list.getClientHeight();
    let scrollTop = this.list.getScrollTop();
    let autoScroll = scrollHeight - (clientHeight + scrollTop) < 100;
    this.setState({ autoScroll });
  }

  componentDidMount = () => {
    this.setState({ autoScroll: true });
    this.list.scrollToBottom();
  }

  componentDidUpdate = () => {
    if (this.state.autoScroll) this.list.scrollToBottom();
  }

  shouldIncludeDate = key => {
    if (key === 0) return true;
    let prevDate = this.props.items[key - 1].date;
    let currDate = this.props.items[key].date;
    // return true if calendar dates aren't equal
    return moment(prevDate).calendar(null, calendarFormat) != moment(currDate).calendar(null, calendarFormat);
  }

  render = () => (
    <div className="Activity__Container">
      <Scrollbars autoHide ref={el => this.list = el}>
        <div className="Activity__List">
          {this.props.items.map((item, key) => (
            <ActivityItem 
              {...item} 
              key={key} 
              includeDate={this.shouldIncludeDate(key)} 
              self={item.user._id === this.props.user._id}
            />
          ))}
        </div>
      </Scrollbars>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  items: !!ownProps.filter ? state.activity.items.filter(a => a.category === ownProps.filter) : state.activity.items,
  user: state.user
});

export default connect(
  mapStateToProps
)(ActivityList);