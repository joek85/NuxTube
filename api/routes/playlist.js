import { Router } from 'express';
const router = Router();
import ytaudio from 'yt-audio';

router.get('/', async (req, res) => {
  let playlistId = req.query['playlistId'];

  try {
    let response = await ytaudio.getPlaylist(playlistId);
    res.json(response)
  }catch (err){
    console.log(err)
    res.json(err)
  }
});

export default router;
