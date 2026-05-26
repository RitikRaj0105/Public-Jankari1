const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const store = require('./config/store');

// Load environment variables
dotenv.config();

// Connect to Store (handles Mongoose + Memory Fallback)
store.connectStore();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/verifications', require('./routes/verificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Global Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
