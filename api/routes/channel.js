const express = require('express');
const router = express.Router();
const ytch = require('yt-channel-info');

router.get('/', async (req, res) => {
  let channelId = req.query['channelId'];

  try {
    let response = await ytch.getChannelInfo(channelId, '');
    res.json(response)
  }catch (err){
    res.json(err)
  }
});
router.get('/videos', async (req, res) => {
  let channelId = req.query['channelId'];

  try {
    let response = await ytch.getChannelVideos(channelId);
    res.json(response)
  }catch (err){
    res.json(err)
  }
});
module.exports = router;
