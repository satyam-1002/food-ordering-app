require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const db = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for food images
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Server port
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Start server and test database connection
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await db.query('SELECT 1');
    console.log('Database connected successfully');
  } catch (error) {
    console.log('Database connection failed. Please check your configuration.');
    console.error(error.message);
  }
});

module.exports = app;