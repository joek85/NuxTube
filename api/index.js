import express from 'express';
import { createPool } from 'mysql';
const app = express();

import search from './routes/search.js';
import player from './routes/player.js';
import playlist from './routes/playlist.js';
import channel from './routes/channel.js';
import trending from './routes/trending.js';
import history from './routes/history.js';

global.pool  = createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'pass',
  database        : 'nuxtube'
});

app.use('/Search', search);
app.use('/player', player);
app.use('/playlist', playlist);
app.use('/channel', channel);
app.use('/trending', trending);
app.use('/history', history);
export default app;

if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
