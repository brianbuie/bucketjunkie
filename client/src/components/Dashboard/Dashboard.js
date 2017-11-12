import React from 'react';
import { Link } from 'react-router-dom';
import Activity from '../Activity';
import routes from '../../routes';

const Dashboard = ({ leagueName, children }) => (
  <div className="row no-gutters height-100">
    <div className="col px-3 scroll-y">
      <div className="mx-auto Content__Container">
        <div className="d-flex py-3">
          <h4 className="my-0 mr-3">
            {leagueName}
          </h4>
          <div className="flex-grow d-flex px-3 justify-content-between align-items-center">
            <Link to={routes.rosters}>
              <span className="fa fa-user-circle" />
            </Link>
            <Link to={routes.players}>
              <span className="fa fa-user-plus" />
            </Link>
            <Link to={routes.leagueInfo}>
              <span className="fa fa-info-circle" />
            </Link>
            <Link to={routes.leagueEdit}>
              <span className="fa fa-pencil-square" />
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
    <div className="col height-100 d-flex flex-column justify-content-end activity__container">
      <Activity />
    </div>
  </div>
);

export default Dashboard;