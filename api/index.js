import express from 'express';
import { createPool } from 'mysql';
const app = express();

module.exports = { path: '/api', handler: app }

import search from './routes/search.js';
import player from './routes/player.js';
import playlist from './routes/playlist.js';
import channel from './routes/channel.js';
import trending from './routes/trending.js';
import history from './routes/history.js';
import download from './routes/download.js';

global.pool  = createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'pass',
  database        : 'nuxtube',
  charset         : 'utf8mb4'
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/Search', search);
app.use('/player', player);
app.use('/playlist', playlist);
app.use('/channel', channel);
app.use('/trending', trending);
app.use('/history', history);
app.use('/download', download);

// export default app;

// if (require.main === module) {
  // const port = process.env.PORT || 8001;
  // app.listen(port, () => {
  //   console.log(`API server listening on port ${port}`)
  // })
// }
