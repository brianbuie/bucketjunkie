import React from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import Activity from '../Activity';
import routes from '../../routes';
import './Dashboard.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.io = io.connect();
    this.io.on('roster:create', roster => this.props.replaceRoster(roster));
    this.io.on('activity:create', item => this.props.addActivityItem(item));
    this.io.on('message', message => console.log(message));
  }

  render() {
    return (
      <div className="row no-gutters height-100">
        <div className="col px-3 scroll-y">
          <div className="mx-auto Dashboard__Content">
            <div className="d-flex py-3">
              <h4 className="my-0 mr-3">
                {this.props.leagueName}
              </h4>
              <div className="flex-grow d-flex px-3 justify-content-between align-items-center">
                <Link to={routes.rosters}>
                  <i className="fa fa-user-circle" />
                </Link>
                <Link to={routes.players}>
                  <i className="fa fa-user-plus" />
                </Link>
                <Link to={routes.leagueInfo}>
                  <i className="fa fa-info-circle" />
                </Link>
                {this.props.leagueAuth.isModerator
                  ? <Link to={routes.leagueEdit}>
                      <i className="fa fa-pencil-square" />
                    </Link>
                  : ''
                }
              </div>
            </div>
            {this.props.children}
          </div>
        </div>
        <div className="col height-100 d-flex flex-column justify-content-end activity__container">
          <Activity />
        </div>
      </div>
    );
  }
}

export default Dashboard;