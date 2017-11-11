import { combineReducers } from 'redux';
import activity from './activity';
import user from './user';
import league from './league';
import rosters from './rosters';
import scores from './scores';
import upcomingGames from './upcomingGames';

const reducers = combineReducers({
  activity,
  user,
  league,
  rosters,
  scores,
  upcomingGames
});

export default reducers;