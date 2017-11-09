import React from 'react';
import PropTypes from 'prop-types';
import ActivityItem from './ActivityItem';

class ActivityList extends React.Component {
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
    return(
      <div ref={el => this.feed = el} className="scroll-y pl-2 py-3 flex-grow height-100">
        {this.props.items.map(item => (
          <ActivityItem key={item._id} {...item} />
        ))}
      </div>
    );
  }
}

ActivityList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      user: PropTypes.shape({
        username: PropTypes.string.isRequired
      }).isRequired,
      date: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default ActivityList;