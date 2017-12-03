import './Feed.scss';

import React from 'react';
import { connect } from 'react-redux';
import AccountLauncher from 'components/Account/AccountLauncher';
import LeagueSwitcher from 'components/League/LeagueSwitcher';
import FeedPositioner from 'components/Feed/FeedPositioner';
import FeedBody from 'components/Feed/FeedBody';

const Feed = ({ position }) => {
  const classNames = ["Feed__Container", position];
  return (
    <div className={classNames.join(' ')}>
      <div className="Feed__Menu">
        <div className="mr-auto">
          <LeagueSwitcher />
        </div>
        <AccountLauncher />
        <FeedPositioner />
      </div>
      {position != 'minimized'
        ? <FeedBody />
        : ''
      }
    </div>
  );
};

const mapStateToProps = ({ feed }) => ({ position: feed.position });

export default connect(
  mapStateToProps
)(Feed);