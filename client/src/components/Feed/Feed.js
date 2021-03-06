import React from 'react';
import { connect } from 'react-redux';
import UserPhotoAndModal from 'components/User/UserPhotoAndModal';
import LeagueSwitcher from 'components/League/LeagueSwitcher';
import MyLeagues from 'components/League/MyLeagues';
import FeedBody from 'components/Feed/FeedBody';
import A from 'components/Utilities/A';
import { openFeed, closeFeed, dockFeed, undockFeed } from 'actions';

const Feed = ({ league, user, feedNotifications, open, docked, openFeed, closeFeed, dockFeed, undockFeed }) => user ? (
  <div className={`Feed__Container ${open && 'open'} ${docked && 'docked'}`}>
    <div className="Feed__Menu" onClick={e => {
      if (e.target.id === "Feed__Menu__Target") {
        !docked ? closeFeed() : undockFeed()
      }
    }}>
      {open ? (
        <div className="flex-row justify-content-end width-100" id="Feed__Menu__Target">
          <LeagueSwitcher className="mr-auto" />
          <div style={{ width: '30px' }}>
            <UserPhotoAndModal {...user} />
          </div>
          <A click={docked ? undockFeed : dockFeed} className="flex-column justify-content-center DockButton">
            <i className="fa fa-exchange m-1 ml-2"></i>
          </A>
        </div>
      ) : (
        <A click={openFeed} className="width-100 p-1 text-center">
          {league ? league.name : 'Select a League'}
          {
            feedNotifications.shouldDisplay && feedNotifications.amount
              ? <span className="badge badge-pill badge-danger Feed__Notification">{feedNotifications.amount}</span>
              : ''
          }
        </A>
      )}
    </div>
    {open && (league ? <FeedBody /> : <MyLeagues />)}
  </div>
) : '';

export default connect(
  ({ feed, user, league, notifications }) => ({ ...feed, ...notifications, user, league }),
  dispatch => ({
    openFeed: () => dispatch(openFeed()), 
    closeFeed: () => dispatch(closeFeed()), 
    dockFeed: () => dispatch(dockFeed()), 
    undockFeed: () => dispatch(undockFeed()) 
  })
)(Feed);