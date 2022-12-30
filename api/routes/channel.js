import { Router } from 'express';
const router = Router();
import ytaudio from 'yt-audio';

router.get('/', async (req, res) => {
  let channelId = req.query['channelId'];

  try {
    let response = await ytaudio.getChannelInfos(channelId);
    res.json(response)
  } catch (err) {
    res.json(err)
  }
});
router.get('/videos', async (req, res) => {
  let channelId = req.query['channelId'];
  let clickTrackingParams = req.query['clickTrackingParams'];
  let params = req.query['params'];
  
  try {
    let response = await ytaudio.getChannelVideos(channelId, clickTrackingParams, params);
    //console.log(response)
    res.json(response)
  } catch (err) {
    console.log(err)
    res.json(err)
  }
});
router.get('/playlists', async (req, res) => {
  let channelId = req.query['channelId'];
  let clickTrackingParams = req.query['clickTrackingParams'];
  let params = req.query['params'];
  try {
    let response = await ytaudio.getChannelPlaylists(channelId, clickTrackingParams, params);
    // console.log(response)
    res.json(response)
  } catch (err) {
    console.log(err)
    res.json(err)
  }
});
export default router;
