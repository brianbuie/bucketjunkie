import './Feed.scss';

import React from 'react';
import { connect } from 'react-redux';
import AccountLauncher from 'components/Account/AccountLauncher';
import LeagueSwitcher from 'components/League/LeagueSwitcher';
import FeedPositioner from 'components/Feed/FeedPositioner';
import Activity from 'components/Activity/Activity';

const Feed = ({ position }) => {
  const classNames = ["Feed__Container"];
  if (position === 'FLOATING') classNames.push('floating');
  if (position === 'MINIMIZED') classNames.push('minimized');
  if (position === 'DOCKED') classNames.push('docked');
  return (
    <div className={classNames.join(' ')}>
      <div className="Feed__Menu">
        <div className="mr-auto">
          <LeagueSwitcher />
        </div>
        <AccountLauncher />
        <FeedPositioner />
      </div>
      {position != 'MINIMIZED'
        ? <Activity />
        : ''
      }
    </div>
  );
};

const mapStateToProps = ({ feed }) => ({ position: feed.position });

export default connect(
  mapStateToProps
)(Feed);