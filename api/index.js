const express = require('express');

const app = express();

const search = require('./routes/search');
const player = require('./routes/player');
const playlist = require('./routes/playlist');
const channel = require('./routes/channel');

app.use('/Search', search);
app.use('/player', player);
app.use('/playlist', playlist);
app.use('/channel', channel);

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
