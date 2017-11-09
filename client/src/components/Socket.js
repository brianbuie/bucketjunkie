import openSocket from 'socket.io-client';

const subscribeToLeague = (leagueId) => {
  const socket = openSocket(`/lg/${leagueId}`);
  socket.on('message', action => console.log(action));
  socket.emit('message', { message: 'this is a test' });
};

export default subscribeToLeague;