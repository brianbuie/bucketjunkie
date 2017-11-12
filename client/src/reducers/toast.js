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

export default toast;