import './Feed.scss';
import React from 'react';
import { connect } from 'react-redux';
import AccountLauncher from 'components/Account/AccountLauncher';
import LeagueSwitcher from 'components/League/LeagueSwitcher';
import FeedBody from 'components/Feed/FeedBody';
import { A } from 'components/Utilities';
import { openFeed, closeFeed, dockFeed, undockFeed } from 'actions';

const Feed = ({ league, user, open, docked, openFeed, closeFeed, dockFeed, undockFeed}) => (
  <div className={`Feed__Container ${open && 'open'} ${docked && 'docked'}`}>
    <div className="Feed__Menu" onClick={e => {
      if (e.target.id === "Feed__Menu__Target") {
        !docked ? closeFeed() : undockFeed()
      }
    }}>
      {open ? (
        <div className="flex-row justify-content-end width-100" id="Feed__Menu__Target">
          <LeagueSwitcher className="mr-auto" />
          <AccountLauncher />
          <A click={docked ? undockFeed : dockFeed} className="flex-column justify-content-center DockButton">
            <i className="fa fa-exchange m-1"></i>
          </A>
        </div>
      ) : (
        <A click={openFeed} className="width-100 p-1 text-center">
          {!user
            ? 'Login'
            : league 
              ? league.name 
              : 'Select a League'
          }
        </A>
      )}
    </div>
    {open && <FeedBody />}
  </div>
);

export default connect(
  ({ feed, user, league }) => ({ ...feed, user, league }),
  dispatch => ({
    openFeed: () => dispatch(openFeed()), 
    closeFeed: () => dispatch(closeFeed()), 
    dockFeed: () => dispatch(dockFeed()), 
    undockFeed: () => dispatch(undockFeed()) 
  })
)(Feed);