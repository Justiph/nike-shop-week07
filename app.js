const express = require('express');
const path = require('path');
const fs = require('fs');
const Product = require('./models/productModel');
const connectDB = require('./config/db');
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const authenticateToken = require('./middleware/authenticateToken');
const app = express();

// Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// Middlewares
app.use(express.static('src'));
app.use(cookieParser());
app.use(authenticateToken); // Authenticate token middleware

// Setup express.json() and url encoding
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // Optional, main layout

// Connect to the database and insert sample data if no products exist
connectDB()
  .then(async () => {
    try {
      const count = await Product.countDocuments({});
      if (count === 0) {
        const data = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
        await Product.insertMany(data.products);
        console.log('Sample data inserted');
      }
    } catch (err) {
      console.error('Error inserting sample data:', err);
    }
  })
  .catch((error) => console.error('MongoDB connection error:', error));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(productRoutes);
app.use('/auth', authRoutes);

// Home page route
app.get('/', (req, res) => {
  res.render('homepage');
});

module.exports = app;
