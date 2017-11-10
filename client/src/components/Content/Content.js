import React from 'react';
import LeagueOverview from '../LeagueOverview/LeagueOverview';
import ContentMenu from './ContentMenu';

const Content = ({ league, page, user }) => (
  <div className="mx-auto content__container">
    <ContentMenu leagueName={league.name} />
    <div className="bg-light">
      <LeagueOverview league={league} user={user} />
    </div>
  </div>
);

export default Content;