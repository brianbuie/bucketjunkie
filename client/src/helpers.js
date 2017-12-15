export const defaultPointValues = {
  ftm: 0,
  fg2m: 1,
  fg3m: 2,
  reb: 1,
  ast: 1,
  blk: 2,
  stl: 2,
  to: -1
};

export const appendPlayerScore = (player, pointValues) => {
  player.score = Object.keys(pointValues)
    .reduce((sum, stat) => sum + (player.averages[stat] * pointValues[stat]), 0);
  return player; 
};

export const sortByScore = (a,b) => {
  if (a.score < b.score) return 1;
  if (a.score > b.score) return -1;
  return 0;
};

export const truncateText = ({ text, length = 50 }) => text.length > length ? text.substring(0, length) + '...' : text;

// Moment relative dates
export const calendarFormat = {
  lastDay : '[Yesterday]',
  sameDay : '[Today]',
  nextDay : '[Tomorrow]',
  lastWeek : 'dddd',
  nextWeek : 'dddd',
  sameElse : 'L'
};

export const isMember = (league, user) => league.members.some(member => member._id === user._id);

export const isModerator = (league, user) => league.moderators.some(mod => mod._id === user._id);

export const isCreator = (league, user) => league.creator === user._id;