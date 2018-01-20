import React from 'react';
import { connect } from 'react-redux';
import { Panel } from 'components/UI';
import A from 'components/Utilities/A';
import { defaultPointValues } from 'helpers';

class PlayerAverages extends React.Component {

  componentWillMount = () => {
    this.categories = Object.keys(this.props.averages);
    this.setState({
      viewPts: true
    });
  }

  toggleView = () => {
    this.setState({
      viewPts: !this.state.viewPts
    });
  }

  render = () => {
    let columns = this.categories.length + (this.state.viewPts ? 1 : 0);
    let tdStyle = { width: `${100/columns}%` };
    return (
      <Panel className="p-3">
        <div className="flex-row">
          <h5 className="font-weight-normal pb-3 faded-2 flex-grow">Averages</h5>
          <div>
            {this.state.viewPts ? <A click={this.toggleView}>Box</A> : <span className="bright">Box</span>}
            {' / '}
            {!this.state.viewPts ? <A click={this.toggleView}>Pts</A> : <span className="bright">Pts</span>}
          </div>
        </div>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              {this.categories.map(category => (
                <td className="text-center" style={tdStyle} key={category}>
                  {category.toUpperCase()}
                </td>
              ))}
              {this.state.viewPts && <td style={tdStyle}></td>}
            </tr>
            {this.state.viewPts && (
              <tr>
                {this.categories.map(category => (
                  <td className="faded-2 text-center" key={category}>
                    <sup>
                      {this.props.pointValues[category]}
                    </sup>
                  </td>
                ))}
                <td></td>
              </tr>
            )}
            <tr className="border-top">
              {this.categories.map(category => (
                <td className="text-center pt-2" key={category}>
                  <h5>
                    {Math.round(this.props.averages[category] * (this.state.viewPts ? this.props.pointValues[category] : 1))}
                  </h5>
                </td>
              ))}
              {this.state.viewPts && (
                <td className="text-center pt-2">
                  <h5 className="text-primary">
                    {this.props.score}
                  </h5>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </Panel>
    );
  }
};

export default connect(
  ({ league }) => ({ pointValues: league ? league.pointValues : defaultPointValues })
)(PlayerAverages);