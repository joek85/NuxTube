import express from 'express';
import { createPool } from 'mysql';
const app = express();

import search from './routes/search';
import player from './routes/player';
import playlist from './routes/playlist';
import channel from './routes/channel';
import trending from './routes/trending';
import history from './routes/history.js';

global.pool  = createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'password',
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
