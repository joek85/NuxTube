import { Router } from 'express';
const router = Router();
import { getChannelVideos } from 'yt-channel-info';
import { getChannelInfos, getChannelPlaylists } from 'yt-audio';

router.get('/', async (req, res) => {
  let channelId = req.query['channelId'];

  try {
    let response = await getChannelInfos(channelId);
    // console.log(response)
    res.json(response)
  }catch (err){
    res.json(err)
  }
});
router.get('/videos', async (req, res) => {
  let channelId = req.query['channelId'];

  try {
    let response = await getChannelVideos(channelId);
    res.json(response)
  }catch (err){
    res.json(err)
  }
});
router.get('/playlists', async (req, res) => {
  let channelId = req.query['channelId'];
  let clickTrackingParams = req.query['clickTrackingParams'];
  let params = req.query['params'];
  // console.log(channelId)
  // console.log(clickTrackingParams)
  // console.log(params)
  try {
    let response = await getChannelPlaylists(channelId, clickTrackingParams, params);
    // console.log(response)
    res.json(response)
  }catch (err){
    console.log(err)
    res.json(err)
  }
});
export default router;
