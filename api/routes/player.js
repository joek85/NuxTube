import { Router } from 'express';
const router = Router();
import ytaudio from 'yt-audio';
import fs from 'fs';
import path from 'path';
import { filterFormats, chooseFormat, addFormatMeta, decipherFormats } from 'ytdl-core';
import { ytlive, startStreaming, stopStreaming } from 'yt-live';

const folder = path.join(__dirname, '../../static/media');
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true });
}

router.get('/', async (req, res) => {
  let id = req.query['id'];
  let date = req.query['date'];

  try {
    let data = await ytaudio.getPlayerData(id);

    let formats = data.videoDetails.formats.adaptiveFormats.map(addFormatMeta);
    let audioformats = filterFormats(formats, 'audioonly');

    let af = chooseFormat(audioformats, 'highestaudio');
    let df = await decipherFormats([af], id);

    let ob = Object.values(Object.assign({}, df));
    let related = await parseRelated(data.relatedVideos.videos)
    let out = {
      id: id, title: data.videoDetails.title, thumbnail: data.videoDetails.thumbnails.url,
      duration: data.videoDetails.lengthSeconds, play_counts: data.videoDetails.viewCount, published_at: data.videoDetails.publishDate,
      tags: data.videoDetails.tags, channel_id: data.videoDetails.channelId, description: data.videoDetails.description,
      formats: ob, related: { relatedVideos: related, continuation: data.relatedVideos.continuation }, isLive: data.videoDetails.isLive, owner: data.owner, chapters: data.chapters
    };
    //console.log(ob)
    database_insert_item_history(id, out.title, out.owner.owner.title, out.channel_id, out.thumbnail, out.duration, out.play_counts, out.published_at, out.owner.owner.thumbnails.url, date);

    res.json(out)
  } catch (err) {
    console.log(err)
    res.json(err)
  }

});

router.get('/related', async (req, res) => {
  let id = req.query['id'];
  let continuation = req.query['continuation'];
  //let tracking = req.query['ctp'];
  try {
    let response = await ytaudio.getRelatedVideos(id, continuation)
    let related = await parseRelated(response.videos)
    res.json({ relatedVideos: related, continuation: response.continuation })
  } catch (error) {
    res.json(error)
  }
});

router.get('/mix', async (req, res) => {
  let listId = req.query['listId'];

  try {
    let response = await ytaudio.getPlayerMix(listId)

    res.json(response)
  } catch (error) {
    res.json(error)
  }
});

router.get('/block', async (req, res) => {
  let videoId = req.query['videoId'];
  try {
    let result = block_video(videoId)
    res.json(result)
  } catch (error) {
    res.json(error)
  }
});
router.get('/live', async (req, res) => {
  let videoId = req.query['videoId'];
  //console.log(videoId)
  const streamFile = path.resolve(folder + '/stream.m4a');
  
  try {
    let live = ytlive().pipe(fs.createWriteStream(streamFile))
    startStreaming(live, videoId);//
    //res.json('ok')
    res.json('/media/stream.m4a')
  } catch (error) {
    res.json(error)
  }
})
async function parseRelated(related) {
  let items = [];
  let videos = related.map(v => v.id)
  let blocked_videos = await get_blocked_videos(videos)
  blocked_videos = blocked_videos.map(row => row.videoId)
  related = related.filter(item => !blocked_videos.includes(item.id))

  for (let i = 0; i < related.length; i++) {
    if (related[i].type === 'video') {
      items.push({
        id: related[i].id, title: related[i].title, authorName: related[i].author.name, duration: related[i].length_seconds, playCounts: related[i].short_view_count_text, thumbnail: related[i].thumbnails,
        isLive: related[i].isLive, channelId: related[i].author.id, published: related[i].published, authorThumbnail: related[i].author.thumbnails, type: related[i].type
      })
    } else if (related[i].type === 'playlist') {
      items.push({
        id: related[i].id, title: related[i].title, subtitle: related[i].subtitle, thumbnail: related[i].thumbnail, published: related[i].published, count: related[i].count, type: related[i].type
      })
    } else if (related[i].type === 'mix') {
      items.push(related[i])
    }
  }
  return items
}

async function database_insert_item_history(videoId, title, author_name, author_id, thumbnail, duration, views, published, author_thumbnail, date) {
  let data = { videoId: videoId, title: title, author_name: author_name, author_id: author_id, thumbnail: thumbnail, duration: duration, views: views, published: published, author_thumbnail: author_thumbnail, date: date };
  let sql = 'INSERT INTO history SET ?';

  try {
    await query(sql, [data])
  } catch (error) {
    console.log(error)
  }

}
async function block_video(videoId) {
  let sql = 'INSERT INTO blocked SET ?';
  return await query(sql, { videoId: videoId })
}
async function get_blocked_videos(videos) {
  let sql = 'SELECT videoId FROM blocked WHERE FIND_IN_SET(videoId, ?)';
  return await query(sql, videos.toString())
}
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
