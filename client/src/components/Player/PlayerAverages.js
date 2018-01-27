import React from 'react';
import { connect } from 'react-redux';
import { Panel } from 'components/UI';
import Toggle from 'components/Utilities/Toggle';
import A from 'components/Utilities/A';
import { defaultPointValues } from 'helpers';

const PlayerAverages = props => (
  <Toggle {...props} toggleState={true} Component={({ averages, pointValues, score, toggle, toggleState }) => {
    let viewPts = toggleState;
    let categories = Object.keys(pointValues);
    let columns = categories.length + (viewPts ? 1 : 0);
    let tdStyle = { width: `${100/columns}%` };
    return (
      <Panel className="p-3">
        <div className="flex-row">
          <h5 className="font-weight-normal pb-3 faded-2 flex-grow">Averages</h5>
          <div>
            {viewPts ? <A click={toggle}>Box</A> : <span className="bright">Box</span>}
            {' / '}
            {!viewPts ? <A click={toggle}>Pts</A> : <span className="bright">Pts</span>}
          </div>
        </div>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              {categories.map(category => (
                <td className="text-center" style={tdStyle} key={category}>
                  {category.toUpperCase()}
                </td>
              ))}
              {viewPts && <td style={tdStyle}></td>}
            </tr>
            {viewPts && (
              <tr>
                {categories.map(category => (
                  <td className="faded-2 text-center" key={category}>
                    <sup>
                      {pointValues[category]}
                    </sup>
                  </td>
                ))}
                <td></td>
              </tr>
            )}
            <tr className="border-top">
              {categories.map(category => (
                <td className="text-center pt-2" key={category}>
                  <h5>
                    {Math.round(averages[category] * (viewPts ? pointValues[category] : 1))}
                  </h5>
                </td>
              ))}
              {viewPts && (
                <td className="text-center pt-2">
                  <h5 className="text-primary">
                    {score}
                  </h5>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </Panel>
    );
  }} />
);

export default connect(
  ({ league }) => ({ pointValues: league ? league.pointValues : defaultPointValues })
)(PlayerAverages);