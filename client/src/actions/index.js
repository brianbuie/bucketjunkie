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

export const fetchPage = url => dispatch => {
  return fetch(url, { credentials: 'include' })
    .then(response => response.json())
    .then(response => console.log(response));
};

export const postActivityItem = (item, url) => dispatch => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(item),
    headers: { 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then(response => {
    if (response.status != 200) {
      throw Error(response);
    }
  })
};