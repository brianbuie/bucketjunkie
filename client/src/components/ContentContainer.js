import React from 'react';
import LeagueOverview from './LeagueOverview/LeagueOverview';

class ContentContainer extends React.Component {
  render() {
    return (
      <div className="mx-auto content__container">
        <div className="d-flex py-3">
          <h4 className="my-0 mr-3">
            {this.props.league.name}
          </h4>
          <div className="flex-grow d-flex px-3 justify-content-between align-items-center">
            <a className="app__nav" href="">
              <span className="fa fa-user-circle" />
            </a>
            <a className="app__nav" href="">
              <span className="fa fa-user-plus" />
            </a>
            <a className="app__nav" href="">
              <span className="fa fa-info-circle" />
            </a>
            <a className="app__nav" href="">
              <span className="fa fa-pencil-square" />
            </a>
          </div>
        </div>
        <div className="bg-light">
          <LeagueOverview league={this.props.league} user={this.props.user} />
        </div>
      </div>
    );
  }
}

export default ContentContainer;