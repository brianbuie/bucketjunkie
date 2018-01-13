import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Panel } from 'components/UI';
import { A } from 'components/Utilities'
import { defaultPointValues } from 'helpers';
import TeamIcon from 'components/Team/TeamIcon';
import FetchContainer from 'components/FetchManager/FetchContainer';

class PlayerBoxscores extends React.Component {

  componentWillMount = () => {
    this.categories = Object.keys(this.props.pointValues);
    this.setState({
      viewPts: true
    });
  }

  toggleView = () => {
    this.setState({
      viewPts: !this.state.viewPts
    });
  }

  render = () => (
    <Panel className="p-3">
      <div className="flex-row">
        <h5 className="font-weight-normal pb-3 faded-2 flex-grow">Latest Performances</h5>
        <div>
          {this.state.viewPts ? <A click={this.toggleView}>Box</A> : <span className="bright">Box</span>}
          {' / '}
          {!this.state.viewPts ? <A click={this.toggleView}>Pts</A> : <span className="bright">Pts</span>}
        </div>
      </div>
      <FetchContainer url={`/api/nba/boxscores/player/${this.props.id}`} component={({ boxscores }) => {
        let columns = this.categories.length + 2 + (this.state.viewPts ? 1 : 0);
        let tdStyle = { width: `${100/columns}%` };
        return boxscores.length ? (
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td colSpan="2"></td>
                {this.categories.map(category => (
                  <td className="text-center" style={tdStyle} key={category}>
                    {category.toUpperCase()}
                  </td>
                ))}
                {this.state.viewPts && <td></td>}
              </tr>
              {this.state.viewPts && (
                <tr>
                  <td colSpan="2"></td>
                  {this.categories.map(category => (
                    <td className="faded-2 text-center" style={tdStyle} key={category}>
                      <sup>
                        {this.props.pointValues[category]}
                      </sup>
                    </td>
                  ))}
                  <td></td>
                </tr>
              )}
              {boxscores.map(boxscore => (
                <tr key={boxscore._id} className="border-top">
                  <td className="text-center">
                    {moment(boxscore.game.date).format('M/D')}
                  </td>
                  <td className="text-center" style={tdStyle}>
                    <TeamIcon id={boxscore.opponent} />
                  </td>
                  {this.categories.map(category => (
                    <td className="text-center" key={category}>
                      {(Math.round(boxscore[category] * (this.state.viewPts ? this.props.pointValues[category] : 1))) || '-'}
                    </td>
                  ))}
                  {this.state.viewPts && (
                    <td className="text-center text-primary">
                      {Math.round(this.categories.reduce((sum, stat) => sum + (boxscore[stat] * this.props.pointValues[stat]), 0))}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="faded-2 text-center py-4">No Recent Games</p> 
      }} />
    </Panel>
  );
};

export default connect(
  ({ league }) => ({ pointValues: league ? league.pointValues : defaultPointValues })
)(PlayerBoxscores);