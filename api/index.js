import express from 'express';
import { createPool } from 'mysql';
const path = require('path');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: false,
    //allowEIO3: true
  },
  transport: ['websocket']
});

const io = require('socket.io')(server);

server.listen(3001)

io.on('connection', client => {
  console.log(`\u001B[1m\u001B[35mSocket Connected (Id = ${client.id}) \u001B[0m`)
});

module.exports = { path: '/api', handler: app }

import search from './routes/search.js';
import player from './routes/player.js';
import playlist from './routes/playlist.js';
import channel from './routes/channel.js';
import trending from './routes/trending.js';
import history from './routes/history.js';
import download from './routes/download.js';
import renderffmpeg from './routes/renderffmpeg';

global.pool = createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'pass',
  database: 'nuxtube',
  charset: 'utf8mb4'
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../static')));

app.use('/Search', search);
app.use('/player', player);
app.use('/playlist', playlist);
app.use('/channel', channel);
app.use('/trending', trending);
app.use('/history', history);
app.use('/download', download);
app.use('/renderffmpeg', renderffmpeg);

app.use(cors)
app.set('socketio', io);
// export default app;

// if (require.main === module) {
  // const port = process.env.PORT || 8001;
  // app.listen(port, () => {
  //   console.log(`API server listening on port ${port}`)
  // })
// }
