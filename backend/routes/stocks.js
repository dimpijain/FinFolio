const express = require('express');
const router = express.Router();
const axios = require('axios');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

router.get('/quote', async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

   try {
    const response = await axios.get(
      `https://www.alphavantage.co/query`,
      {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      }
    );
    const quote = response.data["Global Quote"];
    if (quote && quote["05. price"]) {
      res.json({
        symbol: quote["01. symbol"],
        price: quote["05. price"],
        open: quote["02. open"],
        high: quote["03. high"],
        low: quote["04. low"],
        volume: quote["06. volume"],
        previousClose: quote["08. previous close"],
        change: quote["09. change"],
        percent: quote["10. change percent"],
      });
    } else {
      res.status(404).json({ error: "Stock not found or API limit reached." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stock data." });
  }
});

// Autocomplete Route
router.get('/autocomplete', async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: 'Keyword is required' });

  try {
    const response = await axios.get(
      'https://www.alphavantage.co/query',
      {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: keyword,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      }
    );
    const matches = response.data.bestMatches || [];
    const suggestions = matches.map(match => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      region: match['4. region'],
    }));
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch autocomplete data." });
  }
});


module.exports = router;
