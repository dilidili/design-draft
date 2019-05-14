import io from './io';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
    },
  },
  plugins: [
    require('dva-logger')(),
  ],
};

export function render(oldRender) {
  const socket = io.init();

  socket.emit('exchange', {
    target: '/webrtc#Dkn3UXSu8_jHvKBmAAHW',
    payload: {
      msg: 'test'
    }
  });

  oldRender();
}