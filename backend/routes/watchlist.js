const express = require('express');
const router = express.Router();
const axios = require('axios');
const Watchlist = require('../models/Watchlist');
const auth = require('../middleware/authMiddleware');

require('dotenv').config();

// POST /api/watchlist/add
router.post('/add', auth, async (req, res) => {
  const { symbol } = req.body;
  const userId = req.user.userId;

  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;

    const response = await axios.get(url);
    const data = response.data;

    if (!data.Symbol) return res.status(400).json({ error: 'Invalid symbol' });

    const stockData = {
      symbol: data.Symbol,
      name: data.Name,
      sector: data.Sector,
      addedDate: new Date()
    };

    let watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) watchlist = new Watchlist({ userId, stocks: [] });

    const alreadyExists = watchlist.stocks.some(stock => stock.symbol === symbol);
    if (alreadyExists) return res.status(409).json({ error: 'Already in watchlist' });

    watchlist.stocks.push(stockData);
    await watchlist.save();

    res.status(200).json(watchlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET /api/watchlist
router.get('/', auth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) return res.json({ stocks: [] });

    res.json(watchlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/watchlist/:symbol
router.delete('/:symbol', auth, async (req, res) => {
  const userId = req.user.userId;
  const { symbol } = req.params;

  try {
    const watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) return res.status(404).json({ error: 'Watchlist not found' });

    watchlist.stocks = watchlist.stocks.filter(s => s.symbol !== symbol);
    await watchlist.save();

    res.json(watchlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
