import { combineReducers } from 'redux';

const activity = combineReducers({
  filter: (state = 'SHOW_ALL', action) => {
    switch (action.type) {
      case 'SET_ACTIVITY_FILTER':
        return action.filter
      default:
        return state
    }
  },
  items: (state = [], action) => {
    switch (action.type) {
      case 'ADD_ACTIVITY_ITEM':
        return [
          ...state,
          action.item
        ]
      default:
        return state;
    }
  },
});

const league = (state = null, action) => state;

const leagueAuth = (state = null, action) => state;

const loading = (state = false, action) => {
  switch (action.type) {
    case 'LOADING':
      return true;
    case 'RECEIVED_RESPONSE':
      return false;
    default:
      return state;
  }
};

const players = (state = [], action) => state;

const rosters = (state = [], action) => {
  switch (action.type) {
    case 'REPLACE_ROSTER':
      return [
        ...state.filter(roster => roster.user._id != action.roster.user._id),
        action.roster
      ];
    default:
      return state;
  }
};

const scores = (state = [], action) => state;

const teams = (state = [], action) => state;

const toast = (state = null, action) => {
  switch (action.type) {
    case 'RECEIVED_RESPONSE':
      if (action.response.meta.status >= 400) return action.response;
      if (!action.errorOnly) return action.response;
      return state;
    case 'DISMISSED_TOAST':
      return null;
    default:
      return state;
  }
};

const user = (state = null, action) => state;

const reducers = combineReducers({
  activity,
  league,
  leagueAuth,
  loading,
  players,
  rosters,
  scores,
  teams,
  toast,
  user,
});

export default reducers;