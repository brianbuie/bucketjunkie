import React from 'react';
import { Panel, Container } from 'components/UI';
import ScrollbarsWithEvents from 'components/Utilities/ScrollbarsWithEvents';
import PlayerList from 'components/Player/PlayerList';
import TeamContainer from 'components/Team/TeamContainer';
import TeamHeading from 'components/Team/TeamHeading';
import PlayerDetailLayout from 'components/Layout/PlayerDetailLayout';

class AllPlayers extends React.Component {

  componentWillMount = () => {
    this.setState({
      limit: 30
    });
  }

  componentWillReceiveProps = newProps => {
    this.setState({
      limit: newProps.limit || 30
    });
  }

  increaseLimit = () => {
    this.setState({
      limit: this.state.limit + 15
    });
  }

  render = () => {
    const { match } = this.props;
    const team = match.params.team;
    const filter = team ? { type: 'TEAM', team } : { type: 'SHOW_ALL'};
    return (
      <PlayerDetailLayout handleScrollStop={this.handleScrollStop}>
        <ScrollbarsWithEvents nearBottom={this.increaseLimit} autoHide>
          <Container size="4" className="width-100 height-100">
            <TeamContainer id={match.params.team} component={TeamHeading} />
            <Panel>
              <PlayerList filter={filter} limit={this.state.limit} />
            </Panel>
          </Container>
        </ScrollbarsWithEvents>
      </PlayerDetailLayout>
    );
  }
}

export default AllPlayers;