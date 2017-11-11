import { combineReducers } from 'redux';
import activity from './activity';
import user from './user';
import league from './league';
import rosters from './rosters';
import scores from './scores';
import players from './players';

const reducers = combineReducers({
  activity,
  user,
  league,
  rosters,
  scores,
  players
});

export default reducers;