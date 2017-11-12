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

export default loading;