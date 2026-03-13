const router = require('express').Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://portal.ce.pdn.ac.lk/api/news/v1/');
    res.json(response.data);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;