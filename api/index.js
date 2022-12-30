import express from 'express';
import { createPool } from 'mysql';
const path = require('path');
const app = express();
const cors = require('cors');
const request = require('request');
const server = require('http').createServer(app, {
  cors: {
    origin: "*",
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

global.pool = createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '[pass]',
  database: 'nuxtube',
  charset: 'utf8mb4'
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '../../static')));

app.use('/Search', search);
app.use('/player', player);
app.use('/playlist', playlist);
app.use('/channel', channel);
app.use('/trending', trending);
app.use('/history', history);
app.use('/download', download);
app.get('/getUrl', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

  var targetURL = req.query['targetUrl'];
req.pipe(targetURL).pipe(res)

  // let response = request({url:targetURL})

  // response
  // .on('response', function(response) {
  //   console.log(response.statusCode) // 200
  //   console.log(response.headers['content-type']) // 'image/png'
  //   res.send(response)
  // })
  //.pipe(res);
})

app.use(cors)
app.set('socketio', io);
// export default app;

// if (require.main === module) {
  // const port = process.env.PORT || 8001;
  // app.listen(port, () => {
  //   console.log(`API server listening on port ${port}`)
  // })
// }
