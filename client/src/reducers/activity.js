const activity = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ACTION':
      return [
        ...state,
        action
      ]
    default:
      return state;
  }
};

export default activity;