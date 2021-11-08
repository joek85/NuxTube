const express = require('express');
const router = express.Router();
let ytaudio = require('yt-audio');

let dateOptions = { year: 'numeric',
  month: 'long', day: 'numeric' };

router.get('/', async (req, res) => {
  let id = req.query['id'];

  ytaudio.getPlayerdata(id).then(videodetails => {
    let out = [{id: id, title: videodetails.title, authorThumbnail: videodetails.authorThumbnail , subtitle: videodetails.author, thumbnail: videodetails.thumbnails[videodetails.thumbnails.length-1],
      duration: videodetails.lengthSeconds, play_counts: videodetails.viewCount, published_at: videodetails.publishDate,
      tags: videodetails.tags, channel_id: videodetails.channelId, description: videodetails.description,
      formats: {url: videodetails.audioFormats}, related: [], isLive: videodetails.isLive, author: videodetails.author}];
    database_insert_item_history(id, out[0].title, out[0].author, out[0].channel_id, out[0].thumbnail.url, out[0].duration, out[0].play_counts, out[0].published_at)
    res.json(out)
  }).catch(err => {
    res.json(err)
  })
});

router.get('/related', async (req, res) => {
  let id = req.query['id'];
  let continuation = req.query['continuation'];
  let tracking = req.query['ctp'];
  ytaudio.getRelatedVideos(id, continuation, tracking).then(response => {
    res.json({relatedVideos: parseRelated(response.videos), continuation: response.continuation})
  }).catch(err => {
    res.json(err)
  })
});

function parseRelated(related) {
  let items = [];
  for ( let i = 0; i < related.length; i++ ) {
    if (related[i].type === 'video') {
      if (related[i].author.id !== 'UCzKaBQDTjmqL1GLwJfxtqXg' && related[i].author.id !== 'UCX4sShAQf01LYjYQhG2ZgKg' && related[i].author.id !== 'UCjQFgnpxDY2b86b0sKp36dg'){
        items.push({id: related[i].id, title : related[i].title, subtitle: related[i].author.name, duration: related[i].length_seconds, playcounts: related[i].short_view_count_text, thumbnail: related[i].thumbnails,
          isLive: related[i].isLive, channel_id: related[i].author.id, published: related[i].published, author: related[i].author
        })
      }
    }
  }
  return items
}

async function database_insert_item_history(videoId, title, author_name, author_id, thumbnail, duration, views, published) {
  let data = {videoId: videoId, title: title, author_name: author_name, author_id: author_id, thumbnail: thumbnail, duration: duration, views: views, published: published, date: new Date().toISOString().replace('T', ' ').substring(0, 19)};
  let sql = 'INSERT INTO history SET ?';
  await query(sql,[data])
}
function query(sql, data) {
  return new Promise(function(resolve, reject){
    pool.query(sql,data, function (error, results, fields) {
      if (error) {
        reject(error);
      }
      else {
        resolve(results);
      }
    });
  });
}

module.exports = router;