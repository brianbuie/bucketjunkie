import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { withRouter } from 'react-router';
import { Link, Route } from 'react-router-dom';
import { isModerator } from '../../helpers';
import Activity from '../../components/Activity/Activity';
// Pages
import DashHome from '../../pages/DashHome/DashHome';
import EditLeague from '../../pages/EditLeague/EditLeague';
import LeagueInfo from '../../pages/LeagueInfo/LeagueInfo';
import AllPlayers from '../../pages/Players/AllPlayers';
import PlayerPage from '../../pages/Players/PlayerPage';
import routes from '../../routes';
import './Dashboard.scss';

import { 
  addActivityItem, 
  replaceRoster, 
  replaceLeague,
  getActivity,
  getRosters,
  getScores,
  getTeams,
  getPlayers
} from '../../actions';

class Dashboard extends React.Component {

  componentDidMount() {
    this.props.getActivity();
    this.props.getRosters();
    this.props.getScores();
    this.props.getTeams();
    this.props.getPlayers();
    this.io = io.connect();
    this.io.on('roster:create', roster => this.props.replaceRoster(roster));
    this.io.on('activity:create', item => this.props.addActivityItem(item));
    this.io.on('league:update', league => this.props.replaceLeague(league));
    this.io.on('draft:update', draft => {
      if (draft.user._id === this.props.user._id) this.props.replaceRoster(draft);
    });
    this.io.on('draft:create', draft => {
      if (draft.user._id === this.props.user._id) this.props.replaceRoster(draft);
    });
    this.io.on('message', message => console.log(message));
  }

  componentWillUnmount() {
    this.io.close();
  }

  render() {
    return (
      <div className="row no-gutters height-100">
        <div className="col px-3 scroll-y">
          <div className="mx-auto Dashboard__Content">
            <div className="d-flex py-3">
              <h4 className="my-0 mr-3">
                {this.props.league.name}
              </h4>
              <div className="flex-grow d-flex px-3 justify-content-between align-items-center">
                <Link to={routes.rosters}>
                  <i className="fa fa-user-circle" />
                </Link>
                <Link to="/dash/teams/">
                  <i className="fa fa-user-plus" />
                </Link>
                <Link to={routes.leagueInfo}>
                  <i className="fa fa-info-circle" />
                </Link>
                {isModerator(this.props.league, this.props.user) ? (
                  <Link to={routes.leagueEdit}>
                    <i className="fa fa-pencil-square" />
                  </Link>
                ) : ''}
              </div>
            </div>
            <Route exact path={routes.rosters} component={DashHome} />
            <Route exact path={routes.teams} component={AllPlayers} />
            <Route path={`${routes.teams}/:team`} component={AllPlayers} />
            <Route path={`${routes.players}/:id`} component={PlayerPage} />
            <Route path={routes.leagueInfo} component={LeagueInfo} />
            <Route path={routes.leagueEdit} component={EditLeague} />
          </div>
        </div>
        <Activity />
      </div>
    );
  }
}

const mapStateToProps = ({ league, user }) => ({ league, user });

const mapDispatchToProps = dispatch => ({
  addActivityItem: item => dispatch(addActivityItem(item)),
  replaceRoster: roster => dispatch(replaceRoster(roster)),
  replaceLeague: league => dispatch(replaceLeague(league)),
  getActivity: () => dispatch(getActivity()),
  getRosters: () => dispatch(getRosters()),
  getScores: () => dispatch(getScores()),
  getTeams: () => dispatch(getTeams()),
  getPlayers: () => dispatch(getPlayers())
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard));