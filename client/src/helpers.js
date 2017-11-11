export const sortByScore = (a,b) => {
  if (a.score < b.score) return 1;
  if (a.score > b.score) return -1;
  return 0;
};