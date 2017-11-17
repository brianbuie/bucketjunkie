import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { addActivityItem, replaceRoster, replaceLeague } from '../../actions';
import { isModerator } from '../../helpers';
import Activity from '../../components/Activity/Activity';
import routes from '../../routes';
import './Dashboard.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
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
                <Link to={routes.players}>
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

const mapStateToProps = (state) => ({ 
  league: state.league,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  addActivityItem: item => dispatch(addActivityItem(item)),
  replaceRoster: roster => dispatch(replaceRoster(roster)),
  replaceLeague: league => dispatch(replaceLeague(league)),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard));