import { combineReducers } from 'redux';
import activity from './activity';
import league from './league';
import loading from './loading';
import players from './players';
import rosters from './rosters';
import scores from './scores';
import toast from './toast';
import user from './user';

const reducers = combineReducers({
  activity,
  league,
  loading,
  players,
  rosters,
  scores,
  toast,
  user,
});

export default reducers;