const activity = (state = [], action) => {
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

export default activity;