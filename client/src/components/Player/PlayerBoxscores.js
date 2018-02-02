import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Panel } from 'components/UI';
import A from 'components/Utilities/A';
import Toggle from 'components/Utilities/Toggle';
import { defaultPointValues } from 'helpers';
import { get } from 'actions';
import TeamIcon from 'components/Team/TeamIcon';
import AsyncContainer from 'components/Fetch/AsyncContainer';
import { SpinningBallLoader } from 'features/loading/BallLoaders';

const PlayerBoxscores = props => (
  <AsyncContainer
    {...props}
    asyncAction={() => get(`/api/nba/boxscores/player/${props.id}`)}
    refreshTrigger={props.id}
    Component={props => (
      <Toggle {...props} toggleState={true} Component={({ boxscores, pointValues, toggle, toggleState }) => {
        let viewPts = toggleState;
        let categories = Object.keys(pointValues);
        let columns = categories.length + 2 + (viewPts ? 1 : 0);
        let tdStyle = { width: `${100/columns}%` };
        return boxscores.length ? (
          <Panel className="p-3">
            <div className="flex-row">
              <h5 className="font-weight-normal pb-3 faded-2 flex-grow">Latest Performances</h5>
              <div>
                {viewPts ? <A click={toggle}>Box</A> : <span className="bright">Box</span>}
                {' / '}
                {!viewPts ? <A click={toggle}>Pts</A> : <span className="bright">Pts</span>}
              </div>
            </div>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td colSpan="2"></td>
                  {categories.map(category => (
                    <td className="text-center" style={tdStyle} key={category}>
                      {category.toUpperCase()}
                    </td>
                  ))}
                  {viewPts && <td></td>}
                </tr>
                {viewPts && (
                  <tr>
                    <td colSpan="2"></td>
                    {categories.map(category => (
                      <td className="faded-2 text-center" style={tdStyle} key={category}>
                        <sup>
                          {pointValues[category]}
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
                    {categories.map(category => (
                      <td className="text-center" key={category}>
                        {(Math.round(boxscore[category] * (viewPts ? pointValues[category] : 1))) || '-'}
                      </td>
                    ))}
                    {viewPts && (
                      <td className="text-center text-primary">
                        {Math.round(categories.reduce((sum, stat) => sum + (boxscore[stat] * pointValues[stat]), 0))}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        ) : (
          <Panel className="p-3">
            <div className="flex-row">
              <h5 className="font-weight-normal pb-3 faded-2 flex-grow">Latest Performances</h5>
            </div>
            <p className="faded-2 text-center py-4">No Recent Games</p>
          </Panel>
        );
      }} /> // Toggle
    )} // Async Component
    LoadingComponent={() => (
      <Panel className="p-3">
        <div className="flex-row">
          <h5 className="font-weight-normal pb-3 faded-2 flex-grow">Latest Performances</h5>
        </div>
        <SpinningBallLoader />
      </Panel>
    )} // LoadingComponent
  /> //AsyncComponent
);

export default connect(
  ({ league }) => ({ 
    pointValues: league ? league.pointValues : defaultPointValues 
  })
)(PlayerBoxscores);