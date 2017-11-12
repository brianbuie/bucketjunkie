import React from 'react';
import PlayerList from './PlayerList';
import TeamFilters from '../Team/TeamFilters';

class AllPlayers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      activeTeam: null,
      filter: { type: 'SHOW_ALL' } 
    };
    this.filterClick = this.filterClick.bind(this);
  }

  filterClick(id) {
    let filter = id
      ? { type: 'TEAM', team: id }
      : { type: 'SHOW_ALL' }
    this.setState({ 
      activeTeam: id,
      filter
    });
  }

  render() {
    return (
      <div className="bg-light">
        <TeamFilters activeTeam={this.state.activeTeam} filterClick={this.filterClick} />
        <PlayerList filter={this.state.filter} />
      </div>
    );
  }
}

export default AllPlayers;