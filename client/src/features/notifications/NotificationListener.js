import React from 'react';
import { connect } from 'react-redux';
import { windowFocused, windowBlurred } from 'features/notifications/actions';

class NotificationListener extends React.Component {
  componentDidMount = () => {
    if (document.hidden) {
      this.props.onWindowBlur();
    } else {
      this.props.onWindowFocus();
    }
    window.onfocus = () => {
      this.props.onWindowFocus();
    }
    window.onblur = () => {
      this.props.onWindowBlur();
    }
  }

  render = () => '';
}

export default connect(
  null,
  dispatch => ({
    onWindowFocus: () => dispatch(windowFocused()),
    onWindowBlur: () => dispatch(windowBlurred())
  })
)(NotificationListener);