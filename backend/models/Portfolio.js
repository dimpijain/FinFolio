const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now }
});

const PortfolioSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // or ObjectId if you have a User model
  name: { type: String, default: "My Portfolio" },
  holdings: [HoldingSchema]
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
