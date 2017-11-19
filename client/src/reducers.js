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
    default:
      return state;
  }
};

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

const user = (state = null, action) => state;

const reducers = combineReducers({
  activity,
  league,
  loading,
  players,
  rosters,
  scores,
  teams,
  toasts,
  user,
});

export default reducers;