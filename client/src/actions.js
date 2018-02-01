import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import routes from 'routes';

export const appInit = initialState => ({
  type: 'APP_INIT',
  initialState
});

export const changeFeedView = view => ({
  type: 'CHANGE_FEED_VIEW',
  view
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

export const replaceMember = user => ({
  type: 'REPLACE_MEMBER',
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

export const replaceOpenLeagues = leagues => ({
  type: 'REPLACE_OPEN_LEAGUES',
  leagues
});

export const replaceScores = scores => ({
  type: 'REPLACE_SCORES',
  scores
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

export const socketConnected = () => ({
  type: 'SOCKET_CONNECTED'
});

export const viewPlayer = id => ({
  type: 'VIEW_PLAYER_DETAIL',
  id
});

export const clearPlayerDetail = () => ({
  type: 'CLEAR_PLAYER_DETAIL'
});

export const replacePageTitle = title => ({
  type: 'REPLACE_PAGE_TITLE',
  title
});

export const replacePageDescription = description => ({
  type: 'REPLACE_PAGE_DESCRIPTION',
  description
});



/*
  Dispatchers
  responsible for chained actions
*/

export const openFeed = () => dispatch => {
  dispatch({ type: 'OPEN_FEED' });
  return post({ feed: { open: true } }, '/api/session/initial-state')
};

export const closeFeed = () => dispatch => {
  dispatch({ type: 'CLOSE_FEED' });
  return post({ feed: { open: false } }, '/api/session/initial-state')
};

export const dockFeed = () => dispatch => {
  dispatch({ type: 'DOCK_FEED' });
  return post({ feed: { docked: true } }, '/api/session/initial-state')
};

export const undockFeed = () => dispatch => {
  dispatch({ type: 'UNDOCK_FEED' });
  return post({ feed: { docked: false } }, '/api/session/initial-state')
};

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

export const submitLeagueEdit = data => dispatch => {
  dispatch(loading());
  return post(data, `/api/lg/${data._id}/edit`)
    .then(res => {
      dispatch(doneLoading());
      let toastType = res.meta.ok ? 'success' : 'danger';
      dispatch(newToast(res.json.message, toastType));
      if (res.meta.ok) dispatch(changeFeedView('LEAGUE_INFO'));
    });
};

export const submitCreateLeague = data => dispatch => {
  dispatch(loading());
  return post(data, `/api/leagues/create`)
    .then(res => {
      dispatch(doneLoading());
      if (res.meta.ok) {
        dispatch(newToast(res.json.message, 'success'));
        dispatch({ type: 'RECEIVED_NEW_LEAGUE' });
        dispatch({ type: 'CREATED_NEW_LEAGUE' });
        dispatch(replaceLeague(res.json.league));
        dispatch(push('/rosters'));
      } else {
        dispatch(newToast(res.json.message, 'danger'))
      }
    });
}

export const submitLogin = data => dispatch => {
  dispatch(loading());
  return post(data, '/api/account/login')
    .then(res => {
      dispatch(doneLoading());
      let toastType = res.meta.ok ? 'success' : 'danger';
      dispatch(newToast(res.json.message, toastType));
      if (res.meta.ok) {
        dispatch(loginSuccess(res.json.user));
      }
    });
};

export const submitRegister = data => dispatch => {
  dispatch(loading());
  return post(data, '/api/account/register')
    .then(res => {
      dispatch(doneLoading());
      let toastType = res.meta.ok ? 'success' : 'danger';
      dispatch(newToast(res.json.message, toastType));
      if (res.meta.ok) {
        dispatch(loginSuccess(res.json.user));
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

export const submitForgotPassword = data => dispatch => {
  dispatch(loading());
  return post(data, '/api/account/forgot-password')
    .then(res => {
      dispatch(doneLoading());
      let toastType = res.meta.ok ? 'success' : 'danger';
      dispatch(newToast(res.json.message, toastType));
      if (res.meta.ok) {
        dispatch(push('/account/login'));
      }
    });
};

export const validatePasswordResetToken = token => dispatch => {
  dispatch(loading());
  return post({ token }, '/api/account/validate-token')
    .then(res => {
      dispatch(doneLoading());
      if (!res.meta.ok) {
        dispatch(push('/account/forgot-password'));
        dispatch(newToast(res.json.message, 'danger'));
      }
      return res;
    });
};

export const submitPasswordReset = data => dispatch => {
  dispatch(loading());
  return post(data, '/api/account/reset-password')
    .then(res => {
      dispatch(doneLoading());
      let toastType = res.meta.ok ? 'success' : 'danger';
      dispatch(newToast(res.json.message, toastType));
      if (res.meta.ok) {
        dispatch(push('/'));
        dispatch(loginSuccess(res.json.user));
      }
    });
};

export const getRosters = () => dispatch => {
  dispatch({ type: 'GETTING_ROSTERS' });
  return get('/api/rosters')
    .then(res => {
      if (res.meta.ok) dispatch(replaceRosters(res.json.rosters));
      if (!res.meta.ok) dispatch(newToast(`Rosters Error: ${res.json.message}`, 'danger'));
    });
};

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

export const getMyLeagues = () => dispatch => {
  dispatch({ type: 'GETTING_MY_LEAGUES' });
  return get('/api/leagues/mine')
    .then(res => {
      if (res.meta.ok) dispatch(replaceMyLeagues(res.json.leagues));
      if (!res.meta.ok) dispatch(newToast(res.json.message, 'danger'));
    });
};

export const setLeague = id => dispatch => get(`/api/lg/${id}`)
  .then(res => {
    if (res.meta.ok) {
      dispatch({ type: 'RECEIVED_NEW_LEAGUE' });
      dispatch(replaceLeague(res.json.league));
    } 
    if (!res.meta.ok) dispatch(newToast(res.json.message, 'danger'));
  });

export const getActivity = () => dispatch => {
  dispatch({ type: 'GETTING_ACTIVITY' });
  return get('/api/activity')
    .then(res => {
      if (res.meta.ok) dispatch(replaceActivity(res.json.activity));
      if (!res.meta.ok) dispatch(newToast(`Activity Error: ${res.json.message}`, 'danger'));
    });
};

export const getScores = () => dispatch => {
  dispatch({ type: 'GETTING_SCORES' });
  return get('/api/scores/league')
    .then(res => {
      if (res.meta.ok) dispatch(replaceScores(res.json.scores));
      if (!res.meta.ok) dispatch(newToast(`Scores Error: ${res.json.message}`, 'danger'));
    });
};

export const joinLeague = id => dispatch => get(`/api/lg/${id}/join`)
  .then(res => {
    if (res.meta.ok) {
      dispatch({ type: 'RECEIVED_NEW_LEAGUE' });
      dispatch(replaceLeague(res.json.league));
      dispatch(push('/rosters'));
    } 
    if (!res.meta.ok) dispatch(newToast(res.json.message, 'danger'));
  });

export const leaveLeague = id => dispatch => post({}, `/api/lg/${id}/leave`)
  .then(res => {
    let toastType = res.meta.ok ? 'success' : 'danger';
    dispatch(newToast(res.json.message, toastType));
    if (res.meta.ok) dispatch({ type: 'REMOVE_LEAGUE' });
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