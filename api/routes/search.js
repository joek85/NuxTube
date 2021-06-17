const express = require('express');
const router = express.Router();
let ytsr = require('ytsr');

router.get('/', async (req, res) => {
  let q = req.query['q']

  const options = {
    limit: 25,
    pages: 1
  };
  let results = await ytsr(q, options);

  res.json(results)
});

module.exports = router;
