import { combineReducers } from 'redux';
import activity from './activity';
import user from './user';
import league from './league';
import page from './page';
import rosters from './rosters';

const app = combineReducers({
  activity,
  user,
  league,
  page,
  rosters
});

export default app;