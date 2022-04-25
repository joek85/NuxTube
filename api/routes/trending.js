const express = require('express');
const router = express.Router();
import ytaudio from 'yt-audio';

router.get('/', (req, res) => {
  ytaudio.getTrendingPage().then(response => {
    res.json(response)
  }).catch(err => {
    res.json(err)
  })
});

module.exports = router;
