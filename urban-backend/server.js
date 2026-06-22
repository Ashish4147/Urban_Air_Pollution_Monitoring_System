/**
 * Urban Air Pollution Monitoring System - Backend Server
 * Main application entry point
 * Initializes Express app, connects to MongoDB, starts REST API server
 */

require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const fs = require('fs');
const pollutionRoutes = require('./routes/pollutionRoutes');

// Initialize Express app
const app = express();

// Middleware configuration
// Enable CORS for all routes to allow frontend communication
app.use(cors());

// Parse JSON request bodies (max size: 10MB)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB database
connectDB();

// API Routes
// Mount pollution routes at /api/pollution
app.use('/api/pollution', pollutionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
  });
});

// MongoDB status endpoint
app.get('/api/db-status', (req, res) => {
  const mongoose = require('mongoose');
  const isConnected = mongoose.connection.readyState === 1;
  
  res.status(200).json({
    success: true,
    mongodb: {
      connected: isConnected,
      state: mongoose.connection.readyState, // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/urban-pollution',
      message: isConnected 
        ? '✓ MongoDB is connected' 
        : '⚠ MongoDB is NOT connected. Start MongoDB server and check connection string.',
    },
    instructions: !isConnected ? {
      windows: 'Run: net start MongoDB',
      standalone: 'mongod',
      check: 'Open MongoDB Compass and verify connection: mongodb://localhost:27017',
    } : null,
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Urban Air Pollution Monitoring System API',
    version: '1.0.0',
    endpoints: {
      'POST /api/pollution': 'Add new pollution data',
      'GET /api/pollution/:city': 'Get latest pollution data for city',
      'GET /api/pollution/history/:city': 'Get historical pollution data',
      'GET /api/forecast/:city': 'Get 7-day forecast for city',
      'GET /api/health': 'Health check',
    },
  });
});

// Error handling middleware for 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✓ Backend server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✓ Server shutting down gracefully...');
  process.exit(0);
});
