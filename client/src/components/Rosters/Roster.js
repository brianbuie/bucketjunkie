import React from 'react';
import { Collapse } from 'reactstrap';

class Roster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: true,
    };
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  toggleCollapse() {
    this.setState({ collapseOpen: !this.state.collapseOpen });
  }

  render() {
    console.log(this.props);
    let user = this.props.user;
    let imgSrc = user.photo ? `/images/uploads/${user.photo}` : '/images/user-default.png'
    return (
      <div className="bg-light mb-3">
        <a href="" onClick={this.toggleCollapse}>
          <div className="d-flex flex-row align-items-center py-2 px-3 member__overview">
            <img className="member__picture rounded-circle" src={imgSrc} />
            <h3 className="px-3 my-0 flex-grow font-weight-normal"> {user.username} </h3>
            <h2 className="my-0"> {this.props.score} </h2>
          </div>
        </a>
        <Collapse isOpen={this.state.collapseOpen}>
          Other Stuff
        </Collapse>
      </div>
    );
  }
}

export default Roster;