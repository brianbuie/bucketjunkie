import React from 'react';
import { connect } from 'react-redux';
import { A } from 'components/Utilities';
import { openFeed, closeFeed, dockFeed, undockFeed } from 'actions';

const FeedPositioner = ({ open, docked, openFeed, closeFeed, dockFeed, undockFeed }) => {
  const minimize = (
    <A click={closeFeed} key="minimize" className="flex-column justify-content-center">
      <i className="fa fa-minus m-1"></i>
    </A>
  );
  const float = (
    <A click={() => { openFeed(); undockFeed(); }} key="float" className="flex-column justify-content-center">
      <i className="fa fa-toggle-left m-1"></i>
    </A>
  );
  const dock = (
    <A click={dockFeed} key="dock" className="flex-column justify-content-center">
      <i className="fa fa-toggle-right m-1"></i>
    </A>
  );

  if (!open) return float;
  if (open && !docked) return [minimize, dock];
  return float;
};

export default connect(
  ({ feed }) => ({ ...feed }),
  dispatch => ({
    openFeed: () => dispatch(openFeed()), 
    closeFeed: () => dispatch(closeFeed()), 
    dockFeed: () => dispatch(dockFeed()), 
    undockFeed: () => dispatch(undockFeed()) 
  })
)(FeedPositioner);