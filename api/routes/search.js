const express = require('express');
const router = express.Router();
import ytaudio from 'yt-audio';
import axios from 'axios'

const SEARCH_URL = 'https://suggestqueries.google.com/complete/search';

router.get('/', async (req, res) => {
  let q = req.query['q'];

  let results = await ytaudio.getSearchResults(q);

  res.json(results)
});

router.get('/suggestions', async (req, res) => {
  let q = req.query['q'];
  let suggestions = [];

  let results = await axios.get(SEARCH_URL, {
    params: {
      client: 'youtube',
      jsonp: 'JP',
      ds: 'yt',
      gl: 'US',
      q: q
    }
  });
  let response = results.data;
  response = response.substring(3, response.length-1);
  let json = JSON.parse(response);
  for (let suggestion of json[1]){
    suggestions.push({text: suggestion[0]})
  }
  res.json(suggestions)
});
module.exports = router;
