import fetch from 'isomorphic-fetch';

export const setActivityFilter = filter => ({
  type: 'SET_ACTIVITY_FILTER',
  filter
});

export const addActivityItem = item => ({
  type: 'ADD_ACTIVITY_ITEM',
  item
});

export const replaceRoster = roster => ({
  type: 'REPLACE_ROSTER',
  roster
});

export const receivedResponse = (response, errorOnly = false) => ({
  type: 'RECEIVED_RESPONSE',
  response,
  errorOnly
});

export const addPlayer = id => dispatch => {
  dispatch({ type: 'LOADING' });
  return sendRequest({ player: id }, '/roster/add-player')
    .then(response => dispatch(receivedResponse(response)));
};

export const removePlayer = id => dispatch => {
  dispatch({ type: 'LOADING' });
  return sendRequest({ player: id }, '/roster/remove-player')
    .then(response => dispatch(receivedResponse(response)));
};

export const sendChat = message => dispatch => {
  return sendRequest({ message }, '/api/activity/chat')
    .then(response => dispatch(receivedResponse(response, true)));
};

export const sendRequest = (item, url) => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(item),
    headers: { 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then(response => response.json().then(text => ({
    json: text,
    meta: response
  })));
};