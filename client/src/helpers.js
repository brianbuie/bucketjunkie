export const sortByScore = (a,b) => {
  if (a.score < b.score) return 1;
  if (a.score > b.score) return -1;
  return 0;
};

export const isMember = (league, user) => league.members.some(member => member._id === user._id);

export const isModerator = (league, user) => league.moderators.some(mod => mod._id === user._id);

export const isCreator = (league, user) => league.creator === user._id;