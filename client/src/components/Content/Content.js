import React from 'react';
import LeagueOverview from '../LeagueOverview/LeagueOverview';
import RostersContainer from '../Rosters/RostersContainer';
import ContentMenu from './ContentMenu';

const Content = ({ league, page, user }) => (
  <div className="mx-auto content__container">
    <ContentMenu leagueName={league.name} />
    <LeagueOverview league={league} user={user} />
    <RostersContainer />
  </div>
);

export default Content;