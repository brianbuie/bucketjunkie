import './Feed.scss';
import React from 'react';
import { connect } from 'react-redux';
import AccountLauncher from 'components/Account/AccountLauncher';
import LeagueSwitcher from 'components/League/LeagueSwitcher';
import FeedBody from 'components/Feed/FeedBody';
import { A } from 'components/Utilities';
import { openFeed, closeFeed, dockFeed, undockFeed } from 'actions';

const Feed = ({ open, docked, openFeed, closeFeed, dockFeed, undockFeed}) => (
  <div className={`Feed__Container ${open && 'open'} ${docked && 'docked'}`}>
    <div className="Feed__Menu">
      {open ? (
        <div className="flex-row justify-content-center width-100">
          <LeagueSwitcher />
          <A className="flex-grow width-100" click={!docked ? closeFeed : undockFeed}></A>
          <AccountLauncher />
          {docked ? (
            <A click={undockFeed} className="flex-column justify-content-center DockButton">
              <i className="fa fa-toggle-left m-1"></i>
            </A>
          ) : (
            <A click={dockFeed} className="flex-column justify-content-center DockButton">
              <i className="fa fa-toggle-right m-1"></i>
            </A>
          )}
        </div>
      ) : (
        <A click={openFeed} className="width-100 p-1">
          <LeagueSwitcher readOnly className="mr-auto" />
        </A>
      )}
    </div>
    {open && <FeedBody />}
  </div>
);

export default connect(
  ({ feed }) => ({ ...feed }),
  dispatch => ({
    openFeed: () => dispatch(openFeed()), 
    closeFeed: () => dispatch(closeFeed()), 
    dockFeed: () => dispatch(dockFeed()), 
    undockFeed: () => dispatch(undockFeed()) 
  })
)(Feed);