import { combineReducers } from 'redux';
import activity from './activity';
import user from './user';
import league from './league';
import page from './page';

const app = combineReducers({
  activity,
  user,
  league,
  page
});

export default app;