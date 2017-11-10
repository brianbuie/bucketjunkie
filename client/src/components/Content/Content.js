import React from 'react';
import LeagueOverview from '../LeagueOverview/LeagueOverview';
import Roster from '../Rosters/Roster';
import ContentMenu from './ContentMenu';

const Content = ({ league, page, user, rosters }) => (
  <div className="mx-auto content__container">
    <ContentMenu leagueName={league.name} />
    <LeagueOverview league={league} user={user} />
    {rosters.map((roster, key) => {
      return (
        <Roster {...roster} key={key}/>
      );
    })}
  </div>
);

export default Content;