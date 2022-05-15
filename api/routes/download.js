import { Router } from 'express';
const router = Router();
import ytaudio from 'yt-audio';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import ytdl from 'ytdl-core';

const folder = path.join(__dirname, '../../static/media');
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true });
}

router.get('/', async (req, res) => {
  let videoId = req.query['id'];

  try {
    let response = await ytaudio.getPlayerData(videoId);
    res.json(response)
  } catch (err) {
    res.json(err)
  }
});

router.get('/image', async (req, res) => {
  let io = req.app.get('socketio');

  let imageUrl = req.query['url'];
  let title = req.query['title'];
  let uid = req.query['uid'];

  const fileName = path.basename(imageUrl);
  if (!fs.existsSync(folder + '/' + title)) {
    fs.mkdirSync(folder + '/' + title, { recursive: true });
  }
  const localFilePath = path.resolve(folder + '/' + title, fileName);
  let downloaded = 0;
  let total = 0;
  try {
    const { data, headers } = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream',
    });
    const starttime = Date.now();
    total = headers['content-length']
    io.emit('download_start', {
      starttime: Date.now(),
      uid: uid
    });
    data.pipe(fs.createWriteStream(localFilePath));
    data.on('data', function (chunk) {
      downloaded += chunk.length;
      const percent = downloaded / total;
      const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
      const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;

      io.emit('download_progress', {
        uid: uid,
        progress: (percent * 100).toFixed(0),
        total: (total / 1024 / 1024).toFixed(2),
        downloaded: (downloaded / 1024 / 1024).toFixed(2),
        downloadedMinutes: downloadedMinutes.toFixed(2),
        estimatedDownloadTime: estimatedDownloadTime.toFixed(2)
      });
    })
    data.on('end', () => {
      io.emit('download_end');
      res.sendStatus(200)
    });

  } catch (err) {
    console.log(err)
    res.json(err)
  }
});

router.get('/media', async (req, res) => {
  let io = req.app.get('socketio');
  let uid = req.query['uid'];
  let videoId = req.query['id'];
  let title = req.query['title'];
  let itag = req.query['itag']
  let fileExtension = req.query['fileExtension']

  if (!fs.existsSync(folder + '/' + title)) {
    fs.mkdirSync(folder + '/' + title, { recursive: true });
  }
  const output = path.resolve(folder + '/' + title, title + '.' + fileExtension);

  const video = ytdl(videoId, { quality: itag })
  let starttime;

  video.pipe(fs.createWriteStream(output));
  video.once('response', () => {
    starttime = Date.now();
    io.emit('download_start', {
      starttime: Date.now(),
      uid: uid
    });
  });

  video.on('progress', (chunkLength, downloaded, total) => {
    const percent = downloaded / total;
    const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
    const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;

    io.emit('download_progress', {
      uid: uid,
      progress: (percent * 100).toFixed(0),
      total: (total / 1024 / 1024).toFixed(2),
      downloaded: (downloaded / 1024 / 1024).toFixed(2),
      downloadedMinutes: downloadedMinutes.toFixed(2),
      estimatedDownloadTime: estimatedDownloadTime.toFixed(2)
    });
  });
  video.on('end', () => {
    io.emit('download_end');
    res.sendStatus(200)
  });
  video.on('error', (err) => {
    res.json(err)
  })
});

export default router;