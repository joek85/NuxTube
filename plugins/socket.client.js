
import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client'
// const socketInstance = io('/', {
//   rejectUnauthorized: false,
//   reconnection: true,
//   reconnectionDelay: 1000,
//   reconnectionDelayMax : 5000,
//   reconnectionAttempts: 15,
// });

export default ({ store }) => {
  Vue.use(new VueSocketIO({
    debug: false,
    connection: SocketIO('http://localhost:3001', { transports: ["websocket", "polling", "flashsocket"] }),
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    },
    extraHeaders: {
      'Access-Control-Allow-Credentials': true
    },
    allowEIO3: true,
    allowEIO4: false,

    options: {} //Optional options
  }))
};