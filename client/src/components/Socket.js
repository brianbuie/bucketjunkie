import openSocket from 'socket.io-client';

const subscribeToLeague = (leagueId) => {
  const socket = openSocket(`/lg/${leagueId}`);
  socket.on('message', message => console.log(message));
  socket.emit('message', { message: 'this is a test' });
};

export default subscribeToLeague;