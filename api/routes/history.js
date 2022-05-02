import { Router } from 'express';
const router = Router();

router.get('/', async function (req, res, next) {
  let date = req.query['date'];

  let sql = 'SELECT DISTINCT videoId,author_id,author_name,author_thumbnail,title,duration,thumbnail,views,published FROM `history` WHERE date = ? GROUP BY videoId ORDER BY id DESC';

  try {
    let result = await query(sql, [date]);
    res.json(JSON.parse(JSON.stringify(result)))
  } catch (err) {
    res.json(err)
  }

});

router.get('/dates', async (req, res) => {
  let sql = 'SELECT DISTINCT date FROM history GROUP BY date order by date DESC';
  try {
    let result = await query(sql);
    res.json(result)
  } catch (err) {
    res.json(err)
  }
});

router.get('/remove', async (req, res) => {
  let ids = req.query['ids'];
  let sql = 'DELETE FROM history WHERE videoId IN (?)';
  try {
    let result = await query(sql, [ids]);
    res.json(result)
  } catch (err) {
    res.json(err)
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
