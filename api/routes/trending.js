const express = require('express');
const router = express.Router();
const ytrend = require("yt-trending-scraper");

router.get('/', (req, res) => {
  let location = req.query['location']
  let page = req.query['page']
  const parameters = {
    geoLocation: location,
    parseCreatorOnRise: false,
    page: page
  };
  ytrend.scrape_trending_page(parameters).then((data) =>{
    //console.log('hi')
    // console.log(data)
    res.json(data)
  }).catch((error)=>{
    console.log(error)
    res.json(error)
  });
});

module.exports = router;
