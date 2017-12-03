import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { defaultPointValues, appendPlayerScore } from 'helpers';

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
});

const feed = combineReducers({
  position: (state = 'floating', action) => {
    switch (action.type) {
      case 'FEED_POSITION':
        return action.position;
      default:
        return state;
    }
  },
  view: (state = 'ACTIVITY', action) => {
    switch (action.type) {
      case 'APP_INIT':
        if (action.initialState.league) return 'ACTIVITY';
        if (!action.initialState.user) return 'LOGIN';
        if (!action.initialState.league) return 'MY_LEAGUES';
        return state;
      case 'CHANGE_FEED_VIEW':
        return action.view;
      case 'PASSWORD_RESET_TOKEN_CREATED':
        return 'LOGIN';
      case 'PASSWORD_RESET_TOKEN_INVALID':
        return 'FORGOT_PASSWORD';
      case 'PASSWORD_RESET_TOKEN_VALID':
        return 'RESET_PASSWORD';
      case 'LOGIN_SUCCESS':
        return 'MY_LEAGUES';
      case 'LOGOUT_SUCCESS':
        return 'LOGIN';
      case 'RECEIVED_NEW_LEAGUE':
        return 'ACTIVITY';
      default:
        return state;
    }
  }
});

const dataNeeds = combineReducers({
  myLeagues: (state = 'ok', action) => {
    switch (action.type) {
      case 'APP_INIT':
        if (action.initialState.user) return 'need';
        return state;
      case 'LOGIN_SUCCESS':
        return 'need';
      case 'GETTING_MY_LEAGUES':
        return 'fetching';
      default:
        return state;
    }
  },
  activity: (state = 'ok', action) => {
    switch (action.type) {
      case 'APP_INIT':
        if (action.initialState.league) return 'need';
        return state;
      case 'RECEIVED_NEW_LEAGUE':
        return 'need';
      case 'GETTING_ACTIVITY':
        return 'fetching';
      case 'REPLACE_ACTIVITY':
        return 'ok';
      default:
        return state;
    }
  },
  rosters: (state = 'ok', action) => {
    switch (action.type) {
      case 'APP_INIT':
        if (action.initialState.league) return 'need';
        return state;
      case 'RECEIVED_NEW_LEAGUE':
        return 'need'; 
      case 'GETTING_ROSTERS':
        return 'fetching';
      case 'REPLACE_ROSTERS':
        return 'ok';
      default:
        return state;
    }
  },
  scores: (state = 'ok', action) => {
    switch (action.type) {
      case 'APP_INIT':
        if (action.initialState.league) return 'need';
        return state;
      case 'RECEIVED_NEW_LEAGUE':
        return 'need';
      case 'GETTING_SCORES':
        return 'fetching';
      case 'REPLACE_SCORES':
        return 'ok';
      default:
        return state;
    }
  },
  socket: (state = 'ok', action) => {
    switch (action.type) {
      case 'APP_INIT':
        if (action.initialState.league) return 'need';
        return state;
      case 'RECEIVED_NEW_LEAGUE':
        return 'need';
      case 'SOCKET_CONNECTED':
        return 'ok';
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
    // I don't like this
    case 'APP_INIT':
      let pointValues = action.initialState.league 
        ? action.initialState.league.pointValues 
        : defaultPointValues;
      return state.map(player => appendPlayerScore(player, pointValues));
    case 'REPLACE_LEAGUE':
      return state.map(player => appendPlayerScore(player, action.league.pointValues));
    case 'LOGOUT_SUCCESS':
      return state.map(player => appendPlayerScore(player, defaultPointValues));
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

const teams = (state = [], action) => state;

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
  dataNeeds,
  feed,
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