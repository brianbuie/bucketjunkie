import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import routes from 'routes';

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

export const replaceActivity = activity => ({
  type: 'REPLACE_ACTIVITY',
  activity
});

export const replaceRoster = roster => ({
  type: 'REPLACE_ROSTER',
  roster
});

export const replaceRosters = rosters => ({
  type: 'REPLACE_ROSTERS',
  rosters
});

export const replaceUser = user => ({
  type: 'REPLACE_USER',
  user
});

export const replaceLeague = league => ({
  type: 'REPLACE_LEAGUE',
  league
});

export const replaceMyLeagues = leagues => ({
  type: 'REPLACE_MY_LEAGUES',
  leagues
});

export const replaceScores = scores => ({
  type: 'REPLACE_SCORES',
  scores
});

export const replacePlayers = players => ({
  type: 'REPLACE_PLAYERS',
  players
});

export const replaceTeams = teams => ({
  type: 'REPLACE_TEAMS',
  teams
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

let nextToastId = 0;
export const newToast = (text, toastType) => dispatch => {
  let id = nextToastId++;
  dispatch(showToast(text, toastType, id));
  setTimeout(() => dispatch(hideToast(id)), 5000);
}

export const submitNewPhoto = formData => dispatch => {
  dispatch(loading());
  return postFormData(formData, '/api/account')
    .then(res => {
      dispatch(doneLoading());
      let toastType = res.meta.ok ? 'success' : 'danger';
      dispatch(newToast(res.json.message, toastType));
      if (res.meta.ok) dispatch(replaceUser(res.json.user));
    });
};

export const submitLeagueEdit = (data, id) => dispatch => {
  dispatch(loading());
  return post(data, `/api/lg/${id}/edit`)
    .then(res => {
      console.log(res);
      dispatch(doneLoading());
      let toastType = res.meta.ok ? 'success' : 'danger';
      dispatch(newToast(res.json.message, toastType));
    });
};

export const submitLogin = data => dispatch => {
  dispatch(loading());
  return post(data, '/api/account/login')
    .then(res => {
      dispatch(doneLoading());
      let toastType = res.meta.ok ? 'success' : 'danger';
      dispatch(newToast(res.json.message, toastType));
      if (res.meta.ok) {
        dispatch(loginSuccess(res.json.user));
        dispatch(push(routes.myLeagues));
      }
    });
};

export const submitLogout = () => dispatch => {
  dispatch(loading());
  return get('/api/account/logout')
  .then(res => {
    dispatch(doneLoading());
    let toastType = res.meta.ok ? 'success' : 'danger';
    dispatch(newToast(res.json.message, toastType));
    if (res.meta.ok) {
      dispatch(logoutSuccess());
    }
  });
};

export const getRosters = () => dispatch => get('/api/rosters')
  .then(res => {
    if (res.meta.ok) dispatch(replaceRosters(res.json.rosters));
    if (!res.meta.ok) dispatch(newToast(`Rosters Error: ${res.json.message}`, 'danger'));
  });

export const addPlayer = player => dispatch => {
  dispatch(loading());
  return post({ player }, '/api/rosters/add-player')
    .then(res => {
      dispatch(doneLoading());
      let toastType = res.meta.ok ? 'success' : 'danger';
      dispatch(newToast(res.json.message, toastType));
    });
};

export const removePlayer = player => dispatch => {
  dispatch(loading());
  return post({ player }, '/api/rosters/remove-player')
    .then(res => {
      dispatch(doneLoading());
      let toastType = res.meta.ok ? 'success' : 'danger';
      dispatch(newToast(res.json.message, toastType));
    });
};

export const movePlayer = (player, delta) => dispatch => {
  return post({ player, delta }, '/api/rosters/move')
    .then(res => {
      if (!res.meta.ok) dispatch(newToast(res.json.message, 'danger'));
    });
};

export const sendChat = message => dispatch => {
  return post({ message }, '/api/activity/chat')
    .then(res => {
      if (!res.meta.ok) dispatch(newToast(res.json.message, 'danger'));
    });
};

export const getMyLeagues = () => dispatch => get('/api/leagues/mine')
  .then(res => {
    if (res.meta.ok) dispatch(replaceMyLeagues(res.json.leagues));
    if (!res.meta.ok) dispatch(newToast(res.json.message, 'danger'));
  });

export const setLeague = id => dispatch => get(`/api/lg/${id}`)
  .then(res => {
    if (res.meta.ok) {
      dispatch(replaceLeague(res.json.league));
      dispatch(push(routes.rosters));
    } 
    if (!res.meta.ok) dispatch(newToast(res.json.message, 'danger'));
  });

export const getActivity = () => dispatch => get('/api/activity')
  .then(res => {
    if (res.meta.ok) dispatch(replaceActivity(res.json.activity));
    if (!res.meta.ok) dispatch(newToast(`Activity Error: ${res.json.message}`, 'danger'));
  });

export const getScores = () => dispatch => get('/api/scores/league')
  .then(res => {
    if (res.meta.ok) dispatch(replaceScores(res.json.scores));
    if (!res.meta.ok) dispatch(newToast(`Scores Error: ${res.json.message}`, 'danger'));
  });

export const getTeams = () => dispatch => get('/api/nba/teams')
  .then(res => {
    if (res.meta.ok) dispatch(replaceTeams(res.json.teams));
    if (!res.meta.ok) dispatch(newToast(`Teams Error: ${res.json.message}`, 'danger'));
  });

export const getPlayers = () => dispatch => get('/api/nba/players')
  .then(res => {
    if (res.meta.ok) dispatch(replacePlayers(res.json.players));
    if (!res.meta.ok) dispatch(newToast(`Players Error: ${res.json.message}`, 'danger'));
  });


/*
  Fetchers
  network request handlers
*/

export const get = url => (
  fetch(url, {
    method: 'GET',
    headers: { 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then(res => res.json().then(text => ({
    json: text,
    meta: res
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
  .then(res => res.json().then(text => ({
    json: text,
    meta: res
  })))
);

export const postFormData = (formData, url) => {
  // debug FormData
  // for (var [key, value] of formData.entries()) { console.log(key, value); }
  return fetch(url, {
    method: 'POST',
    body: formData,
    headers: { 
      'Accept': 'application/json',
    },
    credentials: 'include'
  })
  .then(res => res.json().then(text => ({
    json: text,
    meta: res
  })));
}