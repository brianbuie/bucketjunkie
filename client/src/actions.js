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

export const replaceLeague = league => ({
  type: 'REPLACE_LEAGUE',
  league
});

export const loading = () => ({ type: 'LOADING' });

export const doneLoading = () => ({ type: 'DONE_LOADING' });

export const showToast = (text, toastType, id) => ({
  type: 'SHOW_TOAST',
  text,
  toastType,
  id
});

export const hideToast = id => ({
  type: 'HIDE_TOAST',
  id
});

let nextToastId = 0;
export const newToast = (text, toastType) => dispatch => {
  let id = nextToastId++;
  dispatch(showToast(text, toastType, id));
  setTimeout(() => dispatch(hideToast(id)), 5000);
}

export const addPlayer = id => dispatch => {
  dispatch(loading());
  return sendRequest({ player: id }, '/roster/add-player')
    .then(response => {
      dispatch(doneLoading());
      let toastType = response.meta.ok ? 'success' : 'danger';
      dispatch(newToast(response.json.message, toastType));
    });
};

export const removePlayer = id => dispatch => {
  dispatch(loading());
  return sendRequest({ player: id }, '/roster/remove-player')
    .then(response => {
      dispatch(doneLoading());
      let toastType = response.meta.ok ? 'success' : 'danger';
      dispatch(newToast(response.json.message, toastType));
    });
};

export const sendChat = message => dispatch => {
  return sendRequest({ message }, '/api/activity/chat')
    .then(response => {
      if (!response.meta.ok) dispatch(newToast(response.json.message, 'danger'));
    });
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