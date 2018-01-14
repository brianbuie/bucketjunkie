import './Feed.scss';

import React from 'react';
import { connect } from 'react-redux';
import AccountLauncher from 'components/Account/AccountLauncher';
import LeagueSwitcher from 'components/League/LeagueSwitcher';
import FeedPositioner from 'components/Feed/FeedPositioner';
import FeedBody from 'components/Feed/FeedBody';
import { FullHeight } from 'components/Utilities';

const Feed = ({ open, docked }) => (
  <div className={`Feed__Container ${open && 'open'} ${docked && 'docked'}`}>
    <div className="Feed__Menu">
      <div className="mr-auto">
        <LeagueSwitcher readOnly={!open} />
      </div>
      {open && <AccountLauncher />}
      <FeedPositioner />
    </div>
    {open && <FeedBody />}
  </div>
);

export default connect(
  ({ feed }) => ({ ...feed })
)(Feed);