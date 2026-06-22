/**
 * Pollution Routes
 * Defines all REST API endpoints for pollution data
 * Maps requests to appropriate controller methods
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const pollutionController = require('../controllers/pollutionController');

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept both JSON and CSV files
    const isJSON = file.mimetype === 'application/json' || file.originalname.endsWith('.json');
    const isCSV = file.mimetype === 'text/csv' || file.originalname.endsWith('.csv');
    
    if (isJSON || isCSV) {
      cb(null, true);
    } else {
      cb(new Error('Only JSON and CSV files are allowed'), false);
    }
  },
});

/**
 * POST /api/pollution
 * Add new pollution measurement
 * Request body: { city, pm25, pm10, no2, so2, co, o3 }
 */
router.post('/', pollutionController.addPollutionData);

/**
 * POST /api/pollution/bulk
 * Bulk upload endpoint - accepts an array of pollution records
 */
router.post('/bulk', pollutionController.addBulkPollutionData);

/**
 * POST /api/pollution/upload
 * Upload pollution dataset from JSON file
 * File is stored in memory and available for querying
 * Uses UPSERT to prevent duplicate records (same sensor_id + timestamp)
 * Route MUST be defined before :city routes
 */
router.post('/upload', upload.single('file'), pollutionController.uploadDataset);

/**
 * POST /api/pollution/deduplicate
 * Remove duplicate records from database
 * Keeps the most recently updated record for each city + timestamp
 * Route MUST be defined before :city routes
 */
router.post('/deduplicate', pollutionController.deduplicateData);

/**
 * GET /api/pollution/upload/history
 * Get list of all uploaded datasets
 * Route MUST be defined before :city routes
 */
router.get('/upload/history', pollutionController.getUploadHistory);

/**
 * GET /api/pollution/data/sources
 * Get information about available data sources
 * Route MUST be defined before :city routes
 */
router.get('/data/sources', pollutionController.getDataSources);

/**
 * GET /api/pollution/history/:city
 * Get historical pollution data for a city
 * Query params: days (default: 30)
 */
router.get('/history/:city', pollutionController.getPollutionHistory);

/**
 * GET /api/pollution/forecast/:city/:pollutant
 * Get 7-day forecast for a specific pollutant in a city
 * Calls ML microservice for predictions
 */
router.get('/forecast/:city/:pollutant', pollutionController.getForecast);

/**
 * GET /api/pollution/cities
 * Get list of all available cities
 */
router.get('/cities', pollutionController.getCities);

/**
 * GET /api/pollution/average/:city/:pollutant
 * Get average pollutant values per day for a city
 */
router.get('/average/:city/:pollutant', pollutionController.getAverage);

/**
 * GET /api/pollution/peakhours/:city/:pollutant
 * Get average pollutant values by hour of day
 */
router.get('/peakhours/:city/:pollutant', pollutionController.getPeakHours);

/**
 * GET /api/pollution/compare/:pollutant
 * Compare pollutant averages across cities
 */
router.get('/compare/:pollutant', pollutionController.getCompare);

/**
 * GET /api/pollution/alerts
 * Get pollution alerts for cities exceeding thresholds
 */
router.get('/alerts', pollutionController.getAlerts);

/**
 * GET /api/pollution/:city
 * Get latest pollution data for a specific city
 * Returns current AQI and pollutant levels
 */
router.get('/:city', pollutionController.getPollutionByCity);

module.exports = router;
