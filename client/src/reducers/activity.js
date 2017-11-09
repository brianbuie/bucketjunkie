import { combineReducers } from 'redux';

const filter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_ACTIVITY_FILTER':
      return action.filter
    default:
      return state
  }
};

const items = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ACTIVITY_ITEM':
      return [
        ...state,
        action.item
      ]
    default:
      return state;
  }
};

const activity = combineReducers({ filter, items });

export default activity;