import { combineReducers } from 'redux';

export const notifications = combineReducers({
  titleNotifications: (state = { shouldDisplay: false, amount: 0 }, action) => {
    switch (action.type) {
      case 'ADD_ACTIVITY_ITEM':
        return state.shouldDisplay ? { ...state, amount: state.amount + 1 } : state;
      case 'WINDOW_FOCUSED':
        return { shouldDisplay: false, amount: 0 };
      case 'WINDOW_BLURRED':
        return { shouldDisplay: true, amount: 0 };
      default:
        return state;
    }
  },
  feedNotifications: (state = { shouldDisplay: false, amount: 0 }, action) => {
    switch (action.type) {
      case 'APP_INIT':
        let shouldDisplay = false;
        if (action.initialState.feed) {
          // shouldDisplay = true if feed is closed on initialState
          // feed defaults to open if feed.open isn't set in initialState
          shouldDisplay = !action.initialState.feed.open;
        }
        return { shouldDisplay, amount: 0 };
      case 'OPEN_FEED':
        return { shouldDisplay: false, amount: 0 };
      case 'CLOSE_FEED':
        return { shouldDisplay: true, amount: 0 };
      case 'ADD_ACTIVITY_ITEM':
        return state.shouldDisplay ? { ...state, amount: state.amount + 1 } : state;
      default:
        return state;
    }
  }
});