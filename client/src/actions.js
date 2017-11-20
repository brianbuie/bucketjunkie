import fetch from 'isomorphic-fetch';

export const setActivityFilter = filter => ({
  type: 'SET_ACTIVITY_FILTER',
  filter
});

export const minimizeActivity = () => ({ type: 'MINIMIZE_ACTIVITY' });
export const maximizeActivity = () => ({ type: 'MAXIMIZE_ACTIVITY' });
export const dockActivity = () => ({ type: 'DOCK_ACTIVITY' });
export const undockActivity = () => ({ type: 'UNDOCK_ACTIVITY'});

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

export const replaceUser = user => ({
  type: 'REPLACE_USER',
  user
});

export const submitNewPhoto = formData => dispatch => {
  dispatch(loading());
  return sendFormData(formData, '/account')
    .then(response => {
      dispatch(doneLoading());
      let toastType = response.meta.ok ? 'success' : 'danger';
      dispatch(newToast(response.json.message, toastType));
      if (response.meta.ok) dispatch(replaceUser(response.json.user));
    });
}

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

export const addPlayer = player => dispatch => {
  dispatch(loading());
  return sendRequest({ player }, '/roster/add-player')
    .then(response => {
      dispatch(doneLoading());
      let toastType = response.meta.ok ? 'success' : 'danger';
      dispatch(newToast(response.json.message, toastType));
    });
};

export const removePlayer = player => dispatch => {
  dispatch(loading());
  return sendRequest({ player }, '/roster/remove-player')
    .then(response => {
      dispatch(doneLoading());
      let toastType = response.meta.ok ? 'success' : 'danger';
      dispatch(newToast(response.json.message, toastType));
    });
};

export const movePlayer = (player, delta) => dispatch => {
  return sendRequest({ player, delta }, '/roster/move')
    .then(response => {
      if (!response.meta.ok) dispatch(newToast(response.json.message, 'danger'));
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

export const sendFormData = (formData, url) => {
  return fetch(url, {
    method: 'POST',
    body: formData,
    headers: { 
      'Accept': 'application/json',
    },
    credentials: 'include'
  })
  .then(response => response.json().then(text => ({
    json: text,
    meta: response
  })));
}