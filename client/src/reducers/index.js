import { combineReducers } from 'redux';
import activity from './activity';
import user from './user';
import league from './league';
import page from './page';
import rosters from './rosters';
import scores from './scores';
import upcomingGames from './upcomingGames';

const reducers = combineReducers({
  activity,
  user,
  league,
  page,
  rosters,
  scores,
  upcomingGames
});

export default reducers;