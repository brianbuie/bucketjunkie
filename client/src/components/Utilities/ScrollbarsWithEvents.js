import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

class ScrollbarsWithEvents extends React.Component {

  handleScrollStop = () => {
    const { top } = this.refs.scrollbars.getValues();
    const { nearBottom, atBottom, nearTop, atTop } = this.props;
    if (top > 0.9 && nearBottom) nearBottom();
    if (top === 1 && atBottom) atBottom();
    if (top < 0.1 && nearTop) nearTop();
    if (top === 0 && atTop) atTop();
  }

  render = () => (
    <Scrollbars onScrollStop={this.handleScrollStop} ref="scrollbars" autoHide={this.props.autoHide}>
      {this.props.children}
    </Scrollbars>
  );
}

export default ScrollbarsWithEvents;