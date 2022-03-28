import { Router } from 'express';
const router = Router();
import ytaudio from 'yt-audio';

router.get('/', async (req, res) => {
    let videoId = req.query['id'];
  
    try {
      let response = await ytaudio.getPlayerdata(videoId);
      res.json(response)
    } catch (err) {
      res.json(err)
    }
  });

  export default router;