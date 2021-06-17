const express = require('express');

const app = express();

const search = require('./routes/search');
const player = require('./routes/player');
const trending = require('./routes/trending');
const channel = require('./routes/channel');

app.use('/search', search);
app.use('/player', player);
app.use('/trending', trending);
app.use('/channel', channel);

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
