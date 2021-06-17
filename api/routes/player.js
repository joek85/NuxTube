const express = require('express');
const router = express.Router();
let ytdl = require('ytdl-core');

router.get('/', async (req, res) => {
  let id = req.query['id'];

  getinfos(id).then(async function (info) {
    let videodetails = info.player_response.videoDetails;
    let audioformats = ytdl.filterFormats(info.formats, 'audioonly');
    let af = ytdl.chooseFormat(audioformats, 'highestaudio');
    let related = info.related_videos;
    let out;
    out = [{id: id, title: videodetails.title, subtitle: videodetails.author, thumbnail: videodetails.thumbnail.thumbnails[videodetails.thumbnail.thumbnails.length-1],
      duration: videodetails.lengthSeconds, play_counts: videodetails.viewCount, published_at: info.videoDetails.publishDate,
      tags: videodetails.keywords, channel_id: videodetails.channelId, description: videodetails.shortDescription,
      formats: {url: af.url}, related: parseRelated(related), isLive: videodetails.isLiveContent, author: info.videoDetails.author}];
    // await database_insert_item_history(id,d,videodetails.channelId,videodetails.title,videodetails.author,videodetails.thumbnail.thumbnails[videodetails.thumbnail.thumbnails.length-1].url,videodetails.lengthSeconds
    //   ,videodetails.viewCount,info.videoDetails.publishDate);
    console.log(related);
    res.json(out)

  }).catch(err=>{
    console.log(err);
    res.status(400).json(err)
  });

});
async function getinfos(id) {
  return await ytdl.getInfo(id);
}
function parseRelated(related) {
  let items = [];
  for ( let i = 0; i < related.length; i++ ) {
    if (related[i].author.id !== 'UCzKaBQDTjmqL1GLwJfxtqXg' && related[i].author.id !== 'UCX4sShAQf01LYjYQhG2ZgKg' && related[i].author.id !== 'UCjQFgnpxDY2b86b0sKp36dg'){
      items.push({id: related[i].id, title : related[i].title, subtitle: related[i].author.name, duration: related[i].length_seconds, playcounts: related[i].short_view_count_text, thumbnail: related[i].thumbnails,
        isLive: related[i].isLive, channel_id: related[i].author.id, published: related[i].published, author: related[i].author
      })
    }
  }
  return items
}
module.exports = router;
