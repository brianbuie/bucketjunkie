import React from 'react';
// import LeagueOverview from './LeagueOverview/LeagueOverview';
import ContentMenu from './ContentMenu';

const Content = ({ league, page }) => (
  <div className="mx-auto content__container">
    <ContentMenu leagueName={league.name} />
    <div className="bg-light">
      {page}
    </div>
  </div>
);

export default Content;