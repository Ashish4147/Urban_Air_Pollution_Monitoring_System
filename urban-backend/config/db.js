/**
 * MongoDB Connection Configuration
 * Handles connection to MongoDB Atlas using Mongoose
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses environment variables for connection string
 */
const connectDB = async () => {
  try {
    // Get MongoDB connection string from environment variables
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urban-pollution';
    
    // Check if MongoDB is being used
    if (process.env.SKIP_MONGO === 'true') {
      console.log('⊘ MongoDB skipped (running in demo mode)');
      return;
    }
    
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.warn('⚠ MongoDB connection unavailable. Running in DEMO MODE with mock data.');
    console.warn('   To use production mode, install MongoDB and set MONGODB_URI');
    // Don't exit - allow app to run with mock data
  }
};

module.exports = connectDB;
