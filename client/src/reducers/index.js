import { combineReducers } from 'redux';
import activity from './activity';
import user from './user';
import league from './league';

const app = combineReducers({
  activity,
  user,
  league,
});

export default app;