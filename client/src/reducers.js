import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

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
        ];
      case 'REPLACE_ACTIVITY':
        return action.activity;
      case 'LOGOUT_SUCCESS':
        return [];
      default:
        return state;
    }
  },
  docked: (state = true, action) => {
    switch (action.type) {
      case 'DOCK_ACTIVITY':
        return true;
      case 'UNDOCK_ACTIVITY':
        return false;
      default:
        return state;
    }
  },
  minimized: (state = false, action) => {
    switch (action.type) {
      case 'MINIMIZE_ACTIVITY':
        return true;
      case 'MAXIMIZE_ACTIVITY':
        return false;
      case 'DOCK_ACTIVITY':
        return false;
      default:
        return state;
    }
  },
});

const league = (state = null, action) => {
  switch (action.type) {
    case 'REPLACE_LEAGUE':
      return action.league;
    case 'LOGOUT_SUCCESS':
      return null;
    default:
      return state;
  }
};

const myLeagues = (state = [], action) => {
  switch (action.type) {
    case 'REPLACE_MY_LEAGUES':
      return action.leagues;
    case 'LOGOUT_SUCCESS':
      return [];
    default:
      return state;
  }
};

const openLeagues = (state = [], action) => state;

const loading = (state = false, action) => {
  switch (action.type) {
    case 'LOADING':
      return true;
    case 'DONE_LOADING':
      return false;
    default:
      return state;
  }
};

const players = (state = [], action) => {
  switch (action.type) {
    case 'REPLACE_PLAYERS':
      return action.players;
    default:
      return state;
  }
};

const rosters = (state = [], action) => {
  switch (action.type) {
    case 'REPLACE_ROSTER':
      return [
        ...state.filter(roster => roster.user._id != action.roster.user._id),
        action.roster
      ];
    case 'REPLACE_ROSTERS':
      return action.rosters;
    case 'LOGOUT_SUCCESS':
      return [];
    default:
      return state;
  }
};

const scores = (state = [], action) => {
  switch (action.type) {
    case 'REPLACE_SCORES':
      return action.scores;
    case 'LOGOUT_SUCCESS':
      return [];
    default:
      return state;
  }
};

const teams = (state = [], action) => {
  switch (action.type) {
    case 'REPLACE_TEAMS':
      return action.teams;
    default:
      return state;
  }
};

const toasts = (state = [], action) => {
  switch (action.type) {
    case 'SHOW_TOAST':
      return state.concat([{
        id: action.id,
        text: action.text,
        toastType: action.toastType,
        hidden: false
      }]);
    case 'HIDE_TOAST':
      return state.map(toast => {
        if (toast.id === action.id) {
          toast.hidden = true;
        }
        return toast;
      });
    default:
      return state;
  }
};

const user = (state = null, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return action.user;
    case 'LOGOUT_SUCCESS':
      return null;
    case 'REPLACE_USER':
      return action.user;
    default:
      return state;
  }
};

const reducers = combineReducers({
  activity,
  league,
  myLeagues,
  openLeagues,
  loading,
  players,
  rosters,
  router,
  scores,
  teams,
  toasts,
  user,
});

export default reducers;