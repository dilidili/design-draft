import io from 'socket.io-client';

const log = console.log;

const socket = io('/', {
  // by default, a long-polling connection is established first, then upgraded to "better" transports (like WebSocket). If you like to live dangerously, this part can be skipped.
  transports: ['websocket'],
});

export default socket;
