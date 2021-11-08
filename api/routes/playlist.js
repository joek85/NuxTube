import { Router } from 'express';
const router = Router();
import ytpl from 'ytpl';

router.get('/', async (req, res) => {
  let playlistId = req.query['playlistId'];

  try {
    let response = await ytpl(playlistId);
    res.json(response)
  }catch (err){
    res.json(err)
  }
});

export default router;
