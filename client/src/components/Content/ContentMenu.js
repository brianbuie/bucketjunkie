import React from 'react';
import ContentLink from './ContentLink';

const ContentMenu = ({ leagueName }) => (
<div className="d-flex py-3">
  <h4 className="my-0 mr-3">
    {leagueName}
  </h4>
  <div className="flex-grow d-flex px-3 justify-content-between align-items-center">
    <ContentLink page="ROSTERS">
      <span className="fa fa-user-circle" />
    </ContentLink>
    <ContentLink page="PLAYERS">
      <span className="fa fa-user-plus" />
    </ContentLink>
    <ContentLink page="LEAGUE_INFO">
      <span className="fa fa-info-circle" />
    </ContentLink>
    <ContentLink page="LEAGUE_EDIT">
      <span className="fa fa-pencil-square" />
    </ContentLink>
  </div>
</div>
);

export default ContentMenu;