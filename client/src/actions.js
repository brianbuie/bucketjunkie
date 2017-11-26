import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import routes from './routes';

export const setActivityFilter = filter => ({
  type: 'SET_ACTIVITY_FILTER',
  filter
});

export const minimizeActivity = () => ({ 
  type: 'MINIMIZE_ACTIVITY' 
});

export const maximizeActivity = () => ({ 
  type: 'MAXIMIZE_ACTIVITY' 
});

export const dockActivity = () => ({ 
  type: 'DOCK_ACTIVITY' 
});

export const undockActivity = () => ({ 
  type: 'UNDOCK_ACTIVITY'
});

export const addActivityItem = item => ({
  type: 'ADD_ACTIVITY_ITEM',
  item
});

export const replaceRoster = roster => ({
  type: 'REPLACE_ROSTER',
  roster
});

export const replaceUser = user => ({
  type: 'REPLACE_USER',
  user
});

export const replaceLeague = league => ({
  type: 'REPLACE_LEAGUE',
  league
});

export const loginSuccess = user => ({
  type: 'LOGIN_SUCCESS',
  user
});

export const logoutSuccess = () => ({ 
  type: 'LOGOUT_SUCCESS' 
});

export const loading = () => ({ 
  type: 'LOADING' 
});

export const doneLoading = () => ({ 
  type: 'DONE_LOADING' 
});

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

/*
  Dispatchers
  responsible for chained actions
*/

export const submitNewPhoto = formData => dispatch => {
  dispatch(loading());
  return postFormData(formData, '/api/account')
    .then(response => {
      dispatch(doneLoading());
      let toastType = response.meta.ok ? 'success' : 'danger';
      dispatch(newToast(response.json.message, toastType));
      if (response.meta.ok) dispatch(replaceUser(response.json.user));
    });
};

export const submitLeagueEdit = (data, id) => dispatch => {
  dispatch(loading());
  return post(data, `/api/lg/${id}/edit`)
    .then(response => {
      console.log(response);
      dispatch(doneLoading());
      let toastType = response.meta.ok ? 'success' : 'danger';
      dispatch(newToast(response.json.message, toastType));
    });
};

export const submitLogin = data => dispatch => {
  dispatch(loading());
  return post(data, '/api/account/login')
    .then(response => {
      dispatch(doneLoading());
      let toastType = response.meta.ok ? 'success' : 'danger';
      dispatch(newToast(response.json.message, toastType));
      if (response.meta.ok) {
        dispatch(loginSuccess(response.json.user));
        dispatch(push(routes.account));
      }
    });
};

export const submitLogout = () => dispatch => {
  dispatch(loading());
  return get('/api/account/logout')
  .then(response => {
    dispatch(doneLoading());
    let toastType = response.meta.ok ? 'success' : 'danger';
    dispatch(newToast(response.json.message, toastType));
    if (response.meta.ok) {
      dispatch(push(routes.login));
      dispatch(logoutSuccess());
    }
  });
};

let nextToastId = 0;
export const newToast = (text, toastType) => dispatch => {
  let id = nextToastId++;
  dispatch(showToast(text, toastType, id));
  setTimeout(() => dispatch(hideToast(id)), 5000);
}

export const addPlayer = player => dispatch => {
  dispatch(loading());
  return post({ player }, '/api/roster/add-player')
    .then(response => {
      dispatch(doneLoading());
      let toastType = response.meta.ok ? 'success' : 'danger';
      dispatch(newToast(response.json.message, toastType));
    });
};

export const removePlayer = player => dispatch => {
  dispatch(loading());
  return post({ player }, '/api/roster/remove-player')
    .then(response => {
      dispatch(doneLoading());
      let toastType = response.meta.ok ? 'success' : 'danger';
      dispatch(newToast(response.json.message, toastType));
    });
};

export const movePlayer = (player, delta) => dispatch => {
  return post({ player, delta }, '/api/roster/move')
    .then(response => {
      if (!response.meta.ok) dispatch(newToast(response.json.message, 'danger'));
    });
};

export const sendChat = message => dispatch => {
  return post({ message }, '/api/chat')
    .then(response => {
      if (!response.meta.ok) dispatch(newToast(response.json.message, 'danger'));
    });
};

export const get = url => (
  fetch(url, {
    method: 'GET',
    headers: { 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then(response => response.json().then(text => ({
    json: text,
    meta: response
  })))
);

export const post = (data, url) => (
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then(response => response.json().then(text => ({
    json: text,
    meta: response
  })))
);

export const postFormData = (formData, url) => {
  // for (var [key, value] of formData.entries()) { 
  //   console.log(key, value);
  // }
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