import fetch from 'isomorphic-fetch';

export const setActivityFilter = filter => ({
  type: 'SET_ACTIVITY_FILTER',
  filter
});

export const addActivityItem = item => ({
  type: 'ADD_ACTIVITY_ITEM',
  item
});

export const setPage = page => ({
  type: 'SET_PAGE',
  page
});

export const fetchPage = url => dispatch => fetch(url)
  .then(response => console.log(response.json()), error => console.log(error));