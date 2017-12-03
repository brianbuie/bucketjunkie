import React from 'react';
import { connect } from 'react-redux';
import { A } from 'components/Utilities';
import { changeFeedPosition } from 'actions';

const FeedPositioner = ({ position, changeFeedPosition }) => {
  const minimize = (
    <A click={() => changeFeedPosition('minimized')} key="minimize">
      <i className="fa fa-minus m-1"></i>
    </A>
  );
  const float = (
    <A click={() => changeFeedPosition('floating')} key="float">
      <i className="fa fa-toggle-left m-1"></i>
    </A>
  );
  const dock = (
    <A click={() => changeFeedPosition('docked')} key="dock">
      <i className="fa fa-toggle-right m-1"></i>
    </A>
  );

  switch (position) {
    case 'minimized':
      return float;
    case 'floating':
      return [minimize, dock];
    case 'docked':
      return float;
  }
};

const mapStateToProps = ({ feed }) => ({ position: feed.position });

const mapDispatchToProps = dispatch => ({
  changeFeedPosition: position => dispatch(changeFeedPosition(position))
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedPositioner);