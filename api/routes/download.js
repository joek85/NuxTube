import { Router } from 'express';
const router = Router();
import ytaudio from 'yt-audio';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import ytdl from 'ytdl-core';


// const spawn = require('child_process').spawnSync;
// const ffmpeg = require('ffmpeg-static');
// spawn(ffmpeg,['-i',videoFilename,'-i',audioFilename,'-map','0:v:0','-map','1:a:0','-vcodec','copy','-acodec','copy',outputFilename]);

router.get('/', async (req, res) => {
  let videoId = req.query['id'];

  try {
    let response = await ytaudio.getPlayerdata(videoId);
    res.json(response)
  } catch (err) {
    res.json(err)
  }
});

router.get('/image', async (req, res) => {
  let imageUrl = req.query['url'];
  let folder = req.query['folder'];
  let title = req.query['title'];

  const fileName = path.basename(imageUrl);
  if (!fs.existsSync(folder + '/' + title)) {
    fs.mkdirSync(folder + '/' + title, { recursive: true });
  }
  const localFilePath = path.resolve(folder + '/' + title, fileName);
  try {
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream',
    });

    const w = response.data.pipe(fs.createWriteStream(localFilePath));
    w.on('finish', () => {
      res.sendStatus(200)
    });
  } catch (err) {
    console.log(err)
    res.json(err)
  }
});

router.get('/media', async (req, res) => {
  let videoId = req.query['id'];
  let title = req.query['title'];
  let itag = req.query['itag']

  if (!fs.existsSync('/home/joe/Pictures/media/' + title)) {
    fs.mkdirSync('/home/joe/Pictures/media/' + title, { recursive: true });
  }
  const output = path.resolve('/home/joe/Pictures/media/' + title, title + '.mp4');

  const video = ytdl(videoId, { quality: itag })
  let starttime;

  video.pipe(fs.createWriteStream(output));
  video.once('response', () => {
    starttime = Date.now();
  });

  video.on('progress', (chunkLength, downloaded, total) => {
    const percent = downloaded / total;
    const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
    const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;

    console.log(`${(percent * 100).toFixed(2)}% downloaded `);
    console.log(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
    console.log(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
    console.log(`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `);
  });
  video.on('end', () => {
    console.log('end');
  });
});

export default router;