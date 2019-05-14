import io from 'socket.io-client';

const log = console.log;

const init = () => {
  // init
  const socket = io('/', {
    // actual use can pass parameters here
    query: {
      room: 'demo',
      userId: `client_${Math.random()}`,
    },

    // by default, a long-polling connection is established first, then upgraded to "better" transports (like WebSocket). If you like to live dangerously, this part can be skipped.
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    const id = socket.id;

    log('#connect,', id, socket); // receive online user information

    // listen for its own id to implement p2p communication
    socket.on(id, msg => {
      log('#receive,', msg);
    });
  });

  // system events
  socket.on('disconnect', msg => {
    log('#disconnect', msg);
  });

  return socket;
}

export default {
  init,
}