import { combineReducers } from 'redux';
import activity from './activity';
import activityFilter from './activityFilter';
import user from './user';
import league from './league';

const app = combineReducers({
  activity,
  user,
  league,
  activityFilter
});

export default app;