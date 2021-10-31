const express = require('express');
const router = express.Router();
const ytpl = require('ytpl');

router.get('/', async (req, res) => {
  let playlistId = req.query['playlistId'];

  try {
    let response = await ytpl(playlistId);
    res.json(response)
  }catch (err){
    res.json(err)
  }
});

module.exports = router;
