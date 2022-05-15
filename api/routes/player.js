import { Router } from 'express';
const router = Router();
import ytaudio from 'yt-audio';
import { getInfo, filterFormats, chooseFormat } from 'ytdl-core';


router.get('/', async (req, res) => {
  let id = req.query['id'];
  let date = req.query['date'];
  // ytaudio.getPlayerdata(id).then(videodetails => {
  //   let out = [{id: id, title: videodetails.title, authorThumbnail: videodetails.authorThumbnail , subtitle: videodetails.author, thumbnail: videodetails.thumbnails[videodetails.thumbnails.length-1],
  //     duration: videodetails.lengthSeconds, play_counts: videodetails.viewCount, published_at: videodetails.publishDate,
  //     tags: videodetails.tags, channel_id: videodetails.channelId, description: videodetails.description,
  //     formats: {url: videodetails.audioFormats}, related: [], isLive: videodetails.isLive, author: videodetails.author}];
  //   database_insert_item_history(id, out[0].title, out[0].author, out[0].channel_id, out[0].thumbnail.url, out[0].duration, out[0].play_counts, out[0].published_at, date);
  //   res.json(out)
  // }).catch(err => {
  //   res.json(err)
  // })
  getInfo(id).then(info => {
    let audioformats = filterFormats(info.formats, 'audioonly');
    let af = chooseFormat(audioformats, 'highestaudio');
    let out = [{
      id: id, title: info.videoDetails.title, authorThumbnail: info.videoDetails.author.thumbnails[0].url, subtitle: info.videoDetails.author, thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1],
      duration: info.videoDetails.lengthSeconds, play_counts: info.videoDetails.viewCount, published_at: info.videoDetails.publishDate,
      tags: info.videoDetails.keywords, channel_id: info.videoDetails.channelId, description: info.videoDetails.description,
      formats: { url: af.url }, isLive: info.videoDetails.isLive, author: info.videoDetails.author.name, subscribers: info.videoDetails.author.subscriber_count, chapters: info.videoDetails.chapters
    }];

    database_insert_item_history(id, out[0].title, out[0].author, out[0].channel_id, out[0].thumbnail.url, out[0].duration, out[0].play_counts, out[0].published_at, out[0].authorThumbnail, date);

    res.json(out)
  }).catch(err => {
    console.log(err)
  })
});

router.get('/related', async (req, res) => {
  let id = req.query['id'];
  let continuation = req.query['continuation'];
  let tracking = req.query['ctp'];
  try {
    let response = await ytaudio.getRelatedVideos(id, continuation, tracking)
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
  await query(sql, [data])
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
