const page = (state = 'LEAGUE_INFO', action) => {
  switch (action.type) {
    case 'SET_PAGE':
      return action.page
    default:
      return state
  }
};

export default page;