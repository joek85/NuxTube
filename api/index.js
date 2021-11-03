const express = require('express');
const mysql = require('mysql');
const app = express();

const search = require('./routes/search');
const player = require('./routes/player');
const playlist = require('./routes/playlist');
const channel = require('./routes/channel');
const trending = require('./routes/trending');

global.pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'pizza',
  database        : 'nuxtube'
});

app.use('/Search', search);
app.use('/player', player);
app.use('/playlist', playlist);
app.use('/channel', channel);
app.use('/trending', trending);

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
