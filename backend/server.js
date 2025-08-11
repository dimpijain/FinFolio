const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route imports
const stockRoutes = require('./routes/stocks');
const authRoutes = require('./routes/auth');
const watchlistRoutes = require('./routes/watchlist');
const portfolioRoutes = require('./routes/portfolio'); // <-- ADD THIS LINE

// Route registrations
app.use('/api/stocks', stockRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/portfolio', portfolioRoutes); // <-- AND THIS LINE




// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));



// Example route
app.get('/', (req, res) => {
  res.send('FinFolio backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
