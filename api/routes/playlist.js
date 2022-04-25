import { Router } from 'express';
const router = Router();
import ytaudio from 'yt-audio';

router.get('/', async (req, res) => {
  let playlistId = req.query['playlistId'];

  try {
    let response = await ytaudio.getPlaylist(playlistId);
    res.json(response)
  } catch (err) {
    console.log(err)
    res.json(err)
  }
});
router.get('/getplaylists', async (req, res) => {
  let sql = 'SELECT * from ytplaylists';
  try {
    let result = await query(sql);
    res.json(result)
  } catch (err) {
    res.json(err)
  }
});
router.get('/ytplaylists', async (req, res) => {
  let data = { plId: req.query['plId'] };
  let sql = ' SELECT ALL from ytplaylists WHERE plId=?';
  try {
    let result = await query(sql, [data]);
    res.json(result)
  } catch (err) {
    res.json(err)
  }
});
router.post('/addplaylist', async (req, res) => {
  let playlist = req.body.playlist
  let playlistId = req.body.id
  let data = {
    plId: playlistId, title: playlist.sidebar.title, thumbnail: playlist.sidebar.thumbnails.url, videoCounts: playlist.sidebar.videoCounts, views: playlist.sidebar.views,
    published: playlist.sidebar.published, videos: playlist.videos.length
  };
  let sql = 'INSERT INTO ytplaylists SET ?';
  try {
    let result = await query(sql, [data])
    res.json(result)
  } catch (error) {
    res.json(error)
  }
});
function query(sql, data) {
  return new Promise(function (resolve, reject) {
    pool.query(sql, data, function (error, results, fields) {
      if (error) {
        reject(error);
      }
      else {
        resolve(results);
      }
    });
  });
}
export default router;
