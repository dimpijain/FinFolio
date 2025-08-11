const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio')
const authMiddleware=require('../middleware/authMiddleware');

router.use(authMiddleware);

// POST /api/portfolio
router.post('/', async (req, res) => {
  try {
    const { userId, name } = req.body;
    const portfolio = new Portfolio({ userId, name, holdings: [] });
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get portfolio by portfolioId
router.get('/:portfolioId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.portfolioId);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a holding to a portfolio
router.post('/:portfolioId/holdings', async (req, res) => {
  try {
    const { symbol, quantity, purchasePrice } = req.body;
    const portfolio = await Portfolio.findById(req.params.portfolioId);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

    // Prevent duplicate symbols (optional, but good practice)
    const alreadyExists = portfolio.holdings.some(h => h.symbol === symbol);
    if (alreadyExists) {
      return res.status(400).json({ error: 'Holding already exists for this symbol' });
    }

    portfolio.holdings.push({ symbol, quantity, purchasePrice });
    await portfolio.save();
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a holding from a portfolio
router.delete('/:portfolioId/holdings/:symbol', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.portfolioId);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

    portfolio.holdings = portfolio.holdings.filter(
      (h) => h.symbol !== req.params.symbol
    );
    await portfolio.save();
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
