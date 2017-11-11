import React from 'react';
import { Collapse } from 'reactstrap';
import PlayerContainer from '../Player/PlayerContainer';

class Roster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
    };
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  toggleCollapse(e) {
    e.preventDefault();
    this.setState({ collapseOpen: !this.state.collapseOpen });
  }

  render() {
    let user = this.props.user;
    let imgSrc = user.photo ? `/images/uploads/${user.photo}` : '/images/user-default.png';
    let score = this.props.score[0] || { score: 0 };
    return (
      <div className="bg-light mb-3">
        <a href="" onClick={this.toggleCollapse} className="link-discreet">
          <div className="d-flex flex-row align-items-center py-2 px-3 member__overview">
            <img className="member__picture rounded-circle" src={imgSrc} />
            <h3 className="px-3 my-0 flex-grow font-weight-normal"> {user.username} </h3>
            <h2 className="my-0"> {score.score} </h2>
          </div>
        </a>
        <Collapse isOpen={this.state.collapseOpen}>
          {this.props.players.map(player => (
            <PlayerContainer id={player._id} key={player._id} />
          ))}
        </Collapse>
      </div>
    );
  }
}

export default Roster;