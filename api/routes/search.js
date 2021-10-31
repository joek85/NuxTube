const express = require('express');
const router = express.Router();
let ytaudio = require('yt-audio');

router.get('/', async (req, res) => {
  let q = req.query['q'];

  let results = await ytaudio.getSearchResults(q);

  res.json(results)
});

module.exports = router;
