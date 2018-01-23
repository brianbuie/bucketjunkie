import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import io from 'socket.io-client';
import { isMember } from 'helpers';
import { 
  addActivityItem, 
  replaceRoster, 
  replaceLeague,
  replaceMember,
  getActivity,
  getRosters,
  getScores,
  getMyLeagues,
  socketConnected,
} from 'actions';

class FetchManager extends React.Component {

  componentDidMount() {
    this.io = io.connect();
    this.io.on('roster:create', roster => this.props.replaceRoster(roster));
    this.io.on('activity:create', item => this.props.addActivityItem(item));
    this.io.on('league:update', league => this.props.replaceLeague(league));
    this.io.on('draft:update', draft => draft.user._id === this.props.user._id ? this.props.replaceRoster(draft) : null);
    this.io.on('draft:create', draft => draft.user._id === this.props.user._id ? this.props.replaceRoster(draft) : null);
    this.io.on('user:update', user => this.props.league && isMember(this.props.league, user) && this.props.replaceMember(user));
    this.io.on('message', message => console.log(message));
    this.evaluateNeeds(this.props.dataNeeds);
  }

  componentWillReceiveProps(nextProps) {
    this.evaluateNeeds(nextProps.dataNeeds);
  }

  evaluateNeeds(dataNeeds) {
    if (dataNeeds.myLeagues === 'need') this.props.getMyLeagues();
    if (dataNeeds.activity === 'need') this.props.getActivity();
    if (dataNeeds.rosters === 'need') this.props.getRosters();
    if (dataNeeds.scores === 'need') this.props.getScores();
    if (dataNeeds.socket === 'need') {
      this.io.close();
      this.io.connect();
      this.props.socketConnected();
    }
  }

  render() {
    return (<i/>);
  }
}

const mapStateToProps = ({ dataNeeds, user, league, router }) => ({ 
  dataNeeds, 
  user,
  league,
});

const mapDispatchToProps = dispatch => ({
  addActivityItem: item => dispatch(addActivityItem(item)),
  replaceRoster: roster => dispatch(replaceRoster(roster)),
  replaceLeague: league => dispatch(replaceLeague(league)),
  replaceMember: user => dispatch(replaceMember(user)),
  getActivity: () => dispatch(getActivity()),
  getRosters: () => dispatch(getRosters()),
  getScores: () => dispatch(getScores()),
  getMyLeagues: () => dispatch(getMyLeagues()),
  socketConnected: () => dispatch(socketConnected()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FetchManager);