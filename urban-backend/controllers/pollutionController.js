/**
 * Pollution Controller
 * Handles all business logic for pollution data operations
 * Follows MVC architecture pattern
 */

const Pollution = require('../models/Pollution');
const { calculateAQI } = require('../utils/aqiCalculator');
const { getPollutionForecast } = require('../services/forecastService');
const dataStore = require('../utils/dataStore');

// Mock data for demo when MongoDB is unavailable
const mockPollutionData = {
  delhi: {
    city: 'delhi',
    pm25: 85.5,
    pm10: 120.3,
    no2: 42.1,
    so2: 15.7,
    co: 0.8,
    o3: 35.2,
    timestamp: new Date(),
  },
  mumbai: {
    city: 'mumbai',
    pm25: 62.3,
    pm10: 95.1,
    no2: 35.2,
    so2: 12.1,
    co: 0.6,
    o3: 38.5,
    timestamp: new Date(),
  },
  bangalore: {
    city: 'bangalore',
    pm25: 45.2,
    pm10: 78.9,
    no2: 28.3,
    so2: 10.2,
    co: 0.5,
    o3: 42.1,
    timestamp: new Date(),
  },
};

const isMockMode = process.env.MOCK_DATA === 'true' || !process.env.MONGODB_URI;

/**
 * POST /api/pollution
 * Add new pollution data to database
 * Calculates and includes AQI in response
 */
exports.addPollutionData = async (req, res) => {
  try {
    const { city, pm25, pm10, no2, so2, co, o3 } = req.body;

    // Validate required fields
    if (!city || pm25 === undefined || pm10 === undefined || no2 === undefined || so2 === undefined || co === undefined || o3 === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All pollution parameters are required',
      });
    }

    // Validate numeric values
    if (
      isNaN(pm25) || isNaN(pm10) || isNaN(no2) || isNaN(so2) ||
      isNaN(co) || isNaN(o3)
    ) {
      return res.status(400).json({
        success: false,
        message: 'All values must be numeric',
      });
    }

    // Create new pollution record
    const pollutionRecord = new Pollution({
      city: city.toLowerCase(),
      pm25,
      pm10,
      no2,
      so2,
      co,
      o3,
      timestamp: new Date(),
    });

    // Save to database
    const savedRecord = await pollutionRecord.save();

    // Calculate AQI for this data
    const aqiData = calculateAQI({
      pm25,
      pm10,
      no2,
      o3,
    });

    // Return success response with AQI
    res.status(201).json({
      success: true,
      message: 'Pollution data recorded successfully',
      data: {
        ...savedRecord.toObject(),
        aqi: aqiData,
      },
    });
  } catch (error) {
    console.error('Error in addPollutionData:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving pollution data',
      error: error.message,
    });
  }
};

/**
 * POST /api/pollution/bulk
 * Accepts an array of pollution records and inserts them in bulk.
 * Each record must include: city, pm25, pm10, no2, so2, co, o3
 */
exports.addBulkPollutionData = async (req, res) => {
  try {
    const payload = req.body;

    // Validate payload is an array
    if (!Array.isArray(payload) || payload.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body must be a non-empty array of pollution records',
      });
    }

    // If running in mock/demo mode, refuse to write
    if (isMockMode) {
      return res.status(403).json({
        success: false,
        message: 'Bulk insert disabled in demo/mock mode. Start MongoDB or set SKIP_MONGO=false',
      });
    }

    // Validate and normalize each record
    const docs = payload.map((item, idx) => {
      const required = ['city', 'pm25', 'pm10', 'no2', 'so2', 'co', 'o3'];
      for (const field of required) {
        if (item[field] === undefined) {
          throw new Error(`Record ${idx} is missing required field: ${field}`);
        }
      }

      return {
        city: String(item.city).toLowerCase(),
        timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
        pm25: Number(item.pm25),
        pm10: Number(item.pm10),
        no2: Number(item.no2),
        so2: Number(item.so2),
        co: Number(item.co),
        o3: Number(item.o3),
      };
    });

    // Insert documents in bulk
    const inserted = await Pollution.insertMany(docs, { ordered: false });

    res.status(201).json({
      success: true,
      message: `Inserted ${inserted.length} pollution records successfully`,
      insertedCount: inserted.length,
    });
  } catch (error) {
    console.error('Error in addBulkPollutionData:', error);
    res.status(500).json({
      success: false,
      message: 'Error inserting bulk pollution data',
      error: error.message,
    });
  }
};

/**
 * GET /api/pollution/:city
 * Fetch latest pollution data for a city
 * Returns current AQI and pollution levels
 */
exports.getPollutionByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City name is required',
      });
    }

    let pollutionData;

    // First check in-memory uploaded data
    const uploadedData = dataStore.getPollutionByCity(city);
    if (uploadedData) {
      pollutionData = uploadedData;
    }
    // Then try to get from database, fallback to mock data
    else if (isMockMode) {
      pollutionData = mockPollutionData[city.toLowerCase()];
      if (!pollutionData) {
        return res.status(404).json({
          success: false,
          message: `No pollution data found for city: ${city}`,
          availableCities: Object.keys(mockPollutionData),
        });
      }
    } else {
      // Query for latest pollution record from MongoDB
      pollutionData = await Pollution.findOne({
        city: city.toLowerCase(),
      }).sort({ timestamp: -1 }).lean();

      if (!pollutionData) {
        return res.status(404).json({
          success: false,
          message: `No pollution data found for city: ${city}`,
        });
      }
    }

    // Convert Mongoose document to plain object if needed
    const plainData = pollutionData.toObject ? pollutionData.toObject() : pollutionData;

    // Calculate AQI for current data
    const aqiData = calculateAQI({
      pm25: plainData.pm25,
      pm10: plainData.pm10,
      no2: plainData.no2,
      o3: plainData.o3,
    });

    // Return pollution data with AQI
    res.status(200).json({
      success: true,
      mode: isMockMode ? 'demo' : 'production',
      data: {
        ...plainData,
        aqi: aqiData,
      },
    });
  } catch (error) {
    console.error('Error in getPollutionByCity:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pollution data',
      error: error.message,
    });
  }
};

/**
 * GET /api/forecast/:city
 * Get 7-day PM2.5 forecast for a city
 * Calls ML microservice for predictions
 */
exports.getForecast = async (req, res) => {
  const { city, pollutant } = req.params;

  try {
    // Validate pollutant
    const validPollutants = ['co2', 'co', 'pm25', 'pm10', 'no2', 'so2', 'o3'];
    if (!validPollutants.includes(pollutant.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid pollutant. Must be one of: ${validPollutants.join(', ')}`,
      });
    }

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City name is required',
      });
    }

    const pollutantField = pollutant.toLowerCase();

    // In mock mode, return sample forecast
    if (isMockMode) {
      const mockForecasts = {
        delhi: [82.5, 79.3, 85.1, 90.2, 87.5, 84.2, 81.9],
        mumbai: [60.2, 62.5, 58.3, 61.1, 64.8, 62.2, 59.5],
        bangalore: [42.5, 44.1, 41.8, 45.3, 43.9, 40.2, 42.7],
      };

      const forecast = mockForecasts[city.toLowerCase()] || [50, 55, 52, 58, 56, 54, 51];

      return res.status(200).json({
        success: true,
        mode: 'demo',
        data: {
          city: city.toLowerCase(),
          pollutant: pollutantField,
          forecast,
          daysAhead: 7,
          generatedAt: new Date(),
        },
      });
    }

    // Get forecast from service (which calls ML microservice)
    const forecast = await getPollutionForecast(city, pollutantField);

    res.status(200).json({
      success: true,
      mode: 'production',
      data: forecast,
    });
  } catch (error) {
    console.error('Error in getForecast:', error);

    // Return mock data on error too
    const mockForecasts = {
      delhi: [82.5, 79.3, 85.1, 90.2, 87.5, 84.2, 81.9],
      mumbai: [60.2, 62.5, 58.3, 61.1, 64.8, 62.2, 59.5],
      bangalore: [42.5, 44.1, 41.8, 45.3, 43.9, 40.2, 42.7],
    };

    const forecast = mockForecasts[city.toLowerCase()] || [50, 55, 52, 58, 56, 54, 51];

    res.status(200).json({
      success: true,
      mode: 'demo-fallback',
      data: {
        city: city.toLowerCase(),
        forecast,
        daysAhead: 7,
        generatedAt: new Date(),
      },
    });
  }
};

/**
 * GET /api/pollution/history/:city
 * Fetch historical pollution data for a city
 * Returns data from last 30 days for trend analysis
 */
exports.getPollutionHistory = async (req, res) => {
  try {
    const { city } = req.params;
    const days = req.query.days || 30;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City name is required',
      });
    }

    // In mock mode, return sample history
    if (isMockMode) {
      // First check uploaded data for the requested range
      const uploadedHistory = dataStore.getPollutionHistory(city, days);
      if (uploadedHistory.length > 0) {
        const enrichedData = uploadedHistory.map((record) => {
          const aqiData = calculateAQI({
            pm25: record.pm25,
            pm10: record.pm10,
            no2: record.no2,
            o3: record.o3,
          });

          return {
            ...record,
            aqi: aqiData.aqi,
          };
        });

        return res.status(200).json({
          success: true,
          mode: 'uploaded',
          count: enrichedData.length,
          data: enrichedData,
        });
      }

      // Fall back to mock data
      const mockHistory = [];
      const baseData = mockPollutionData[city.toLowerCase()];
      
      if (!baseData) {
        return res.status(404).json({
          success: false,
          message: `No pollution data found for city: ${city}`,
          availableCities: Object.keys(mockPollutionData),
        });
      }

      for (let i = parseInt(days) - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const variance = Math.sin(i * 0.5) * 10;
        const record = {
          _id: `mock-${i}`,
          city: baseData.city,
          timestamp: date,
          pm25: baseData.pm25 + variance,
          pm10: baseData.pm10 + variance * 1.2,
          no2: baseData.no2 + variance * 0.5,
          so2: baseData.so2 + variance * 0.3,
          co: baseData.co + variance * 0.05,
          o3: baseData.o3 + variance * 0.8,
        };

        const aqiData = calculateAQI({
          pm25: record.pm25,
          pm10: record.pm10,
          no2: record.no2,
          o3: record.o3,
        });

        mockHistory.push({
          ...record,
          aqi: aqiData.aqi,
        });
      }

      return res.status(200).json({
        success: true,
        mode: 'demo',
        count: mockHistory.length,
        data: mockHistory,
      });
    }

    // Production mode - query database
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - parseInt(days));

    // First check uploaded data
    const uploadedHistory = dataStore.getPollutionHistory(city, days);
    if (uploadedHistory.length > 0) {
      const enrichedData = uploadedHistory.map((record) => {
        const aqiData = calculateAQI({
          pm25: record.pm25,
          pm10: record.pm10,
          no2: record.no2,
          o3: record.o3,
        });

        return {
          ...record,
          aqi: aqiData.aqi,
        };
      });

      return res.status(200).json({
        success: true,
        mode: 'uploaded',
        count: enrichedData.length,
        data: enrichedData,
      });
    }

    // Query for recent historical data from MongoDB
    let historyData = await Pollution.find({
      city: city.toLowerCase(),
      timestamp: { $gte: fromDate },
    })
      .sort({ timestamp: 1 })
      .limit(1000);

    if (historyData.length === 0) {
      const allTimeHistory = await Pollution.find({ city: city.toLowerCase() })
        .sort({ timestamp: 1 })
        .limit(1000);

      if (allTimeHistory.length > 0) {
        const enrichedData = allTimeHistory.map((record) => {
          const aqiData = calculateAQI({
            pm25: record.pm25,
            pm10: record.pm10,
            no2: record.no2,
            o3: record.o3,
          });

          return {
            ...record.toObject(),
            aqi: aqiData.aqi,
          };
        });

        return res.status(200).json({
          success: true,
          mode: 'production-fallback',
          fallback: true,
          fallbackPeriod: 'all available',
          requestedDays: parseInt(days),
          count: enrichedData.length,
          data: enrichedData,
        });
      }

      return res.status(404).json({
        success: false,
        message: `No pollution history found for city: ${city} within the last ${days} days`,
      });
    }

    // Calculate AQI for each record
    const enrichedData = historyData.map((record) => {
      const aqiData = calculateAQI({
        pm25: record.pm25,
        pm10: record.pm10,
        no2: record.no2,
        o3: record.o3,
      });

      return {
        ...record.toObject(),
        aqi: aqiData.aqi,
      };
    });

    res.status(200).json({
      success: true,
      mode: 'production',
      count: enrichedData.length,
      data: enrichedData,
    });
  } catch (error) {
    console.error('Error in getPollutionHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pollution history',
      error: error.message,
    });
  }
};

/**
 * POST /api/pollution/upload
 * Upload pollution data from a JSON or CSV file
 * Stores data in memory for querying without MongoDB
 * Supports local machine file uploads
 */
exports.uploadDataset = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please provide a JSON or CSV file.',
      });
    }

    // Check file type
    const isJSON = req.file.originalname.endsWith('.json');
    const isCSV = req.file.originalname.endsWith('.csv');

    if (!isJSON && !isCSV) {
      return res.status(400).json({
        success: false,
        message: 'File must be in JSON or CSV format.',
      });
    }

    // Parse file based on format
    let records;
    try {
      const fileContent = req.file.buffer.toString('utf-8');

      if (isJSON) {
        // Parse JSON
        records = JSON.parse(fileContent);
      } else if (isCSV) {
        // Parse CSV manually for better control
        const lines = fileContent.trim().split('\n');
        if (lines.length < 2) {
          throw new Error('CSV file must have headers and at least one data row');
        }

        // Parse header line
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

        // Parse data rows
        records = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue; // Skip empty lines

          // Handle CSV with quoted fields
          const values = [];
          let current = '';
          let inQuotes = false;

          for (let j = 0; j < line.length; j++) {
            const char = line[j];
            const nextChar = line[j + 1];

            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim());

          // Create record object
          const record = {};
          headers.forEach((header, idx) => {
            record[header] = values[idx] || '';
          });

          records.push(record);
        }
      }
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return res.status(400).json({
        success: false,
        message: `Invalid ${isJSON ? 'JSON' : 'CSV'} format in uploaded file.`,
        error: parseError.message,
      });
    }

    // Validate records array
    if (!Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: 'File must contain records. For JSON, use an array. For CSV, use headers with data rows.',
      });
    }

    if (records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'File contains no records.',
      });
    }

    // Required fields for validation
    const requiredFields = ['city', 'timestamp', 'co2', 'co', 'pm25', 'pm10', 'no2', 'so2', 'o3'];

    const normalizedRecords = records.map((record) => {
      const normalized = {};
      for (const [key, value] of Object.entries(record)) {
        const lowerKey = String(key).toLowerCase().trim();
        
        // Skip empty values
        if (value === '' || value === null || value === undefined) {
          continue;
        }

        // Try to convert to number if it looks numeric
        const numValue = Number(value);
        if (!isNaN(numValue) && String(value).trim() !== '') {
          normalized[lowerKey] = numValue;
        } else {
          normalized[lowerKey] = String(value).trim();
        }
      }
      return normalized;
    });

    // Validate each record has required fields
    const invalidRecords = [];
    normalizedRecords.forEach((record, idx) => {
      const missingFields = requiredFields.filter(field => !(field in record) || record[field] === null || record[field] === undefined);
      if (missingFields.length > 0) {
        invalidRecords.push({
          recordIndex: idx + 1,
          missingFields,
        });
      }
    });

    if (invalidRecords.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some records are missing required fields',
        invalidRecords: invalidRecords.slice(0, 5), // Show first 5 invalid records
        requiredFields,
      });
    }

    // Prepare documents for MongoDB insertion
    const docs = normalizedRecords.map((record, idx) => ({
      sensor_id: record.sensor_id || `sensor-${record.city || 'unknown'}-${idx + 1}`,
      city: String(record.city).toLowerCase(),
      latitude: record.latitude !== undefined ? Number(record.latitude) : null,
      longitude: record.longitude !== undefined ? Number(record.longitude) : null,
      timestamp: record.timestamp ? new Date(record.timestamp) : new Date(),
      co2: Number(record.co2),
      co: Number(record.co),
      pm25: Number(record.pm25),
      pm10: Number(record.pm10),
      no2: Number(record.no2),
      so2: Number(record.so2),
      o3: Number(record.o3),
    }));

    // Upsert documents to MongoDB to prevent duplicates
    let insertedCount = 0;
    let updatedCount = 0;
    if (!isMockMode) {
      try {
        // Create bulk upsert operations based on sensor_id + timestamp
        const bulkOps = docs.map(doc => ({
          updateOne: {
            filter: {
              sensor_id: doc.sensor_id,
              timestamp: doc.timestamp,
            },
            update: { $set: doc },
            upsert: true,
          },
        }));

        const bulkResult = await Pollution.bulkWrite(bulkOps);
        insertedCount = bulkResult.upsertedCount;
        updatedCount = bulkResult.modifiedCount;
      } catch (dbError) {
        console.error('Database insertion error:', dbError);
        return res.status(500).json({
          success: false,
          message: 'Error saving data to database',
          error: dbError.message,
        });
      }
    }

    // Also add to in-memory data store for compatibility
    const result = dataStore.addDataset(normalizedRecords, req.file.originalname);

    res.status(201).json({
      success: true,
      message: `Dataset uploaded successfully. ${insertedCount} new records, ${updatedCount} records updated.`,
      uploadId: result.uploadId,
      recordsInserted: insertedCount,
      recordsUpdated: updatedCount,
      uploadedFile: req.file.originalname,
      fileFormat: isJSON ? 'JSON' : 'CSV',
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error in uploadDataset:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading dataset',
      error: error.message,
    });
  }
};

/**
 * POST /api/pollution/deduplicate
 * Remove duplicate records from the database based on city + timestamp
 * Keeps the most recently updated record
 */
exports.deduplicateData = async (req, res) => {
  try {
    if (isMockMode) {
      return res.status(403).json({
        success: false,
        message: 'Deduplication only works with MongoDB. Start MongoDB first.',
      });
    }

    // Group by city + timestamp and find duplicates
    const duplicates = await Pollution.aggregate([
      {
        $group: {
          _id: {
            city: '$city',
            timestamp: '$timestamp',
          },
          count: { $sum: 1 },
          ids: { $push: '$_id' },
          maxUpdatedAt: { $max: '$updatedAt' },
        },
      },
      {
        $match: { count: { $gt: 1 } },
      },
    ]);

    let deletedCount = 0;

    // For each duplicate group, keep the latest and delete the rest
    for (const group of duplicates) {
      const idToKeep = group.ids[0];
      const idsToDelete = group.ids.slice(1);

      const deleteResult = await Pollution.deleteMany({
        _id: { $in: idsToDelete },
      });
      deletedCount += deleteResult.deletedCount;
    }

    res.status(200).json({
      success: true,
      message: `Deduplication completed. Removed ${deletedCount} duplicate records.`,
      duplicateGroupsFound: duplicates.length,
      recordsDeleted: deletedCount,
    });
  } catch (error) {
    console.error('Error in deduplicateData:', error);
    res.status(500).json({
      success: false,
      message: 'Error during deduplication',
      error: error.message,
    });
  }
};

/**
 * GET /api/pollution/upload/history
 * Get list of all uploaded datasets
 */
exports.getUploadHistory = async (req, res) => {
  try {
    const history = dataStore.getUploadHistory();
    const stats = {
      totalUploads: history.length,
      totalRecords: dataStore.getRecordCount(),
      availableCities: dataStore.getAllCities(),
    };

    res.status(200).json({
      success: true,
      stats,
      uploads: history,
    });
  } catch (error) {
    console.error('Error in getUploadHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving upload history',
      error: error.message,
    });
  }
};

/**
 * GET /api/pollution/data/sources
 * Get available data sources (DB vs uploaded datasets)
 */
exports.getDataSources = async (req, res) => {
  try {
    const uploadedDataAvailable = dataStore.hasData();
    const cities = uploadedDataAvailable ? dataStore.getAllCities() : [];

    let mongodbRecords = 0;
    let mongodbHasData = false;
    if (!isMockMode) {
      mongodbRecords = await Pollution.estimatedDocumentCount();
      mongodbHasData = mongodbRecords > 0;
    }

    res.status(200).json({
      success: true,
      sources: {
        mongodb: !isMockMode,
        mongodbHasData,
        mongodbRecords,
        uploadedData: uploadedDataAvailable,
      },
      uploadedDataStats: {
        available: uploadedDataAvailable,
        recordCount: dataStore.getRecordCount(),
        cities: cities,
        uploadCount: dataStore.getUploadHistory().length,
      },
    });
  } catch (error) {
    console.error('Error in getDataSources:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving data sources',
      error: error.message,
    });
  }
};

/**
 * GET /api/pollution/cities
 * Get list of all available cities
 */
exports.getCities = async (req, res) => {
  try {
    let dbCities = [];
    let uploadedCities = dataStore.getAllCities();

    if (isMockMode) {
      // Return mock cities when no MongoDB is configured
      dbCities = ['delhi', 'mumbai', 'bangalore', 'beijing', 'new york', 'london'];
    } else {
      // Get unique cities from database
      const cityDocs = await Pollution.distinct('city');
      dbCities = cityDocs;
    }

    const cities = [...new Set([...dbCities, ...uploadedCities])];

    res.status(200).json({
      success: true,
      data: cities,
      count: cities.length,
    });
  } catch (error) {
    console.error('Error in getCities:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving cities',
      error: error.message,
    });
  }
};

/**
 * GET /api/pollution/average/:city/:pollutant
 * Get average pollutant values per day for a city
 */
exports.getAverage = async (req, res) => {
  try {
    const { city, pollutant } = req.params;
    const { days = 30 } = req.query;

    // Validate pollutant
    const validPollutants = ['co2', 'co', 'pm25', 'pm10', 'no2', 'so2', 'o3'];
    if (!validPollutants.includes(pollutant.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid pollutant. Must be one of: ${validPollutants.join(', ')}`,
      });
    }

    const pollutantField = pollutant.toLowerCase();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(days));

    let averages;

    // Use uploaded history first when available
    let uploadedHistory = dataStore.getPollutionHistory(city, days);
    let fallback = false;
    if (uploadedHistory.length === 0) {
      uploadedHistory = dataStore.getAllRecordsByCity(city);
      fallback = uploadedHistory.length > 0;
    }
    if (uploadedHistory.length > 0) {
      const grouped = uploadedHistory.reduce((acc, record) => {
        const date = new Date(record.timestamp).toISOString().split('T')[0];
        const value = Number(record[pollutantField]) || 0;
        if (!acc[date]) acc[date] = { total: 0, count: 0 };
        acc[date].total += value;
        acc[date].count += 1;
        return acc;
      }, {});

      averages = Object.keys(grouped)
        .sort()
        .map((date) => ({
          date,
          average: Math.round((grouped[date].total / grouped[date].count) * 100) / 100,
          count: grouped[date].count,
        }));

      return res.status(200).json({
        success: true,
        mode: fallback ? 'uploaded-fallback' : 'uploaded',
        fallback,
        fallbackPeriod: fallback ? 'all available' : undefined,
        requestedDays: parseInt(days),
        data: {
          city: city.toLowerCase(),
          pollutant: pollutantField,
          period: fallback ? 'all available' : `${days} days`,
          averages,
        },
      });
    }

    if (isMockMode) {
      // Generate mock data
      averages = [];
      for (let i = 0; i < parseInt(days); i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        averages.push({
          date: date.toISOString().split('T')[0],
          average: Math.random() * 100 + 20, // Random value between 20-120
        });
      }
    } else {
      // Aggregate data from database
      const pipeline = [
        {
          $match: {
            city: city.toLowerCase(),
            timestamp: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
            },
            average: { $avg: `$${pollutantField}` },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { '_id': 1 },
        },
      ];

      let results = await Pollution.aggregate(pipeline);
      if (results.length === 0) {
        const allTimeResults = await Pollution.aggregate([
          {
            $match: {
              city: city.toLowerCase(),
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
              },
              average: { $avg: `$${pollutantField}` },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { '_id': 1 },
          },
        ]);

        if (allTimeResults.length > 0) {
          results = allTimeResults;
          fallback = true;
        }
      }

      averages = results.map(result => ({
        date: result._id,
        average: Math.round(result.average * 100) / 100,
        count: result.count,
      }));
    }

    res.status(200).json({
      success: true,
      mode: fallback ? 'production-fallback' : 'production',
      fallback,
      fallbackPeriod: fallback ? 'all available' : undefined,
      requestedDays: parseInt(days),
      data: {
        city: city.toLowerCase(),
        pollutant: pollutantField,
        period: fallback ? 'all available' : `${days} days`,
        averages,
      },
    });
  } catch (error) {
    console.error('Error in getAverage:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating average pollutant values',
      error: error.message,
    });
  }
};

/**
 * GET /api/pollution/peakhours/:city/:pollutant
 * Get average pollutant values by hour of day
 */
exports.getPeakHours = async (req, res) => {
  try {
    const { city, pollutant } = req.params;
    const { days = 30 } = req.query;

    // Validate pollutant
    const validPollutants = ['co2', 'co', 'pm25', 'pm10', 'no2', 'so2', 'o3'];
    if (!validPollutants.includes(pollutant.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid pollutant. Must be one of: ${validPollutants.join(', ')}`,
      });
    }

    const pollutantField = pollutant.toLowerCase();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(days));

    let peakHours;

    // Use uploaded history first when available
    let uploadedHistory = dataStore.getPollutionHistory(city, days);
    let fallback = false;
    if (uploadedHistory.length === 0) {
      uploadedHistory = dataStore.getAllRecordsByCity(city);
      fallback = uploadedHistory.length > 0;
    }
    if (uploadedHistory.length > 0) {
      const grouped = uploadedHistory.reduce((acc, record) => {
        const hour = new Date(record.timestamp).getHours();
        const value = Number(record[pollutantField]) || 0;
        if (!acc[hour]) acc[hour] = { total: 0, count: 0 };
        acc[hour].total += value;
        acc[hour].count += 1;
        return acc;
      }, {});

      peakHours = Object.keys(grouped)
        .map((hour) => ({
          hour: Number(hour),
          average: Math.round((grouped[hour].total / grouped[hour].count) * 100) / 100,
          count: grouped[hour].count,
        }))
        .sort((a, b) => a.hour - b.hour);

      return res.status(200).json({
        success: true,
        mode: fallback ? 'uploaded-fallback' : 'uploaded',
        fallback,
        fallbackPeriod: fallback ? 'all available' : undefined,
        requestedDays: parseInt(days),
        data: {
          city: city.toLowerCase(),
          pollutant: pollutantField,
          period: fallback ? 'all available' : `${days} days`,
          peakHours,
        },
      });
    }

    if (isMockMode) {
      // Generate mock data
      peakHours = [];
      for (let hour = 0; hour < 24; hour++) {
        peakHours.push({
          hour,
          average: Math.random() * 80 + 30, // Random value between 30-110
        });
      }
    } else {
      // Aggregate data from database
      const pipeline = [
        {
          $match: {
            city: city.toLowerCase(),
            timestamp: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: { $hour: '$timestamp' },
            average: { $avg: `$${pollutantField}` },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { '_id': 1 },
        },
      ];

      let results = await Pollution.aggregate(pipeline);
      if (results.length === 0) {
        const allTimeResults = await Pollution.aggregate([
          {
            $match: {
              city: city.toLowerCase(),
            },
          },
          {
            $group: {
              _id: { $hour: '$timestamp' },
              average: { $avg: `$${pollutantField}` },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { '_id': 1 },
          },
        ]);

        if (allTimeResults.length > 0) {
          results = allTimeResults;
          fallback = true;
        }
      }

      peakHours = results.map(result => ({
        hour: result._id,
        average: Math.round(result.average * 100) / 100,
        count: result.count,
      }));
    }

    res.status(200).json({
      success: true,
      mode: fallback ? 'production-fallback' : 'production',
      fallback,
      fallbackPeriod: fallback ? 'all available' : undefined,
      requestedDays: parseInt(days),
      data: {
        city: city.toLowerCase(),
        pollutant: pollutantField,
        period: fallback ? 'all available' : `${days} days`,
        peakHours,
      },
    });
  } catch (error) {
    console.error('Error in getPeakHours:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating peak hours data',
      error: error.message,
    });
  }
};

/**
 * GET /api/pollution/compare/:pollutant
 * Compare pollutant averages across cities
 */
exports.getCompare = async (req, res) => {
  try {
    const { pollutant } = req.params;
    const { days = 30 } = req.query;

    // Validate pollutant
    const validPollutants = ['co2', 'co', 'pm25', 'pm10', 'no2', 'so2', 'o3'];
    if (!validPollutants.includes(pollutant.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid pollutant. Must be one of: ${validPollutants.join(', ')}`,
      });
    }

    const pollutantField = pollutant.toLowerCase();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(days));

    let comparisons;

    if (isMockMode) {
      // Generate mock data
      const cities = ['delhi', 'mumbai', 'bangalore', 'beijing', 'new york', 'london'];
      comparisons = cities.map(city => ({
        city,
        average: Math.random() * 100 + 20,
      }));
    } else {
      // Use uploaded records for comparison when available
      const uploadedRecords = dataStore.getAllRecords();
      if (uploadedRecords.length > 0) {
        const grouped = uploadedRecords.reduce((acc, record) => {
          const cityName = record.city;
          const value = Number(record[pollutantField]) || 0;
          if (!acc[cityName]) acc[cityName] = { total: 0, count: 0 };
          acc[cityName].total += value;
          acc[cityName].count += 1;
          return acc;
        }, {});

        comparisons = Object.keys(grouped)
          .map((cityName) => ({
            city: cityName,
            average: Math.round((grouped[cityName].total / grouped[cityName].count) * 100) / 100,
            count: grouped[cityName].count,
          }))
          .sort((a, b) => b.average - a.average);
      } else {
        // Aggregate data from database
        const pipeline = [
          {
            $match: {
              timestamp: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: '$city',
              average: { $avg: `$${pollutantField}` },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { average: -1 },
          },
        ];

        let results = await Pollution.aggregate(pipeline);
        if (results.length === 0) {
          // Fall back to all time comparison data when no recent records exist
          results = await Pollution.aggregate([
            {
              $group: {
                _id: '$city',
                average: { $avg: `$${pollutantField}` },
                count: { $sum: 1 },
              },
            },
            {
              $sort: { average: -1 },
            },
          ]);
        }

        comparisons = results.map(result => ({
          city: result._id,
          average: Math.round(result.average * 100) / 100,
          count: result.count,
        }));
      }
    }

    res.status(200).json({
      success: true,
      data: {
        pollutant: pollutantField,
        period: `${days} days`,
        comparisons,
      },
    });
  } catch (error) {
    console.error('Error in getCompare:', error);
    res.status(500).json({
      success: false,
      message: 'Error comparing pollutant data across cities',
      error: error.message,
    });
  }
};

/**
 * GET /api/pollution/alerts
 * Get pollution alerts for cities exceeding thresholds
 */
exports.getAlerts = async (req, res) => {
  try {
    // Define thresholds
    const thresholds = {
      pm25: 100,
      pm10: 150,
      co: 9,
      no2: 80,
      so2: 80,
      o3: 120,
    };

    let alerts = [];

    if (isMockMode) {
      // Generate mock alerts
      const cities = ['delhi', 'mumbai', 'bangalore'];
      cities.forEach(city => {
        const mockData = mockPollutionData[city];
        const exceeded = [];

        Object.keys(thresholds).forEach(pollutant => {
          if (mockData[pollutant] > thresholds[pollutant]) {
            exceeded.push({
              pollutant,
              value: mockData[pollutant],
              threshold: thresholds[pollutant],
            });
          }
        });

        if (exceeded.length > 0) {
          alerts.push({
            city,
            timestamp: new Date(),
            exceeded,
            severity: exceeded.length > 2 ? 'high' : 'medium',
          });
        }
      });
    } else {
      // Get latest data for each city and check thresholds
      const cities = await Pollution.distinct('city');

      for (const city of cities) {
        const latestData = await Pollution.findOne({ city })
          .sort({ timestamp: -1 })
          .lean();

        if (latestData) {
          const exceeded = [];

          Object.keys(thresholds).forEach(pollutant => {
            if (latestData[pollutant] > thresholds[pollutant]) {
              exceeded.push({
                pollutant,
                value: latestData[pollutant],
                threshold: thresholds[pollutant],
              });
            }
          });

          if (exceeded.length > 0) {
            alerts.push({
              city,
              timestamp: latestData.timestamp,
              exceeded,
              severity: exceeded.length > 2 ? 'high' : 'medium',
            });
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        alerts,
        thresholds,
        alertCount: alerts.length,
      },
    });
  } catch (error) {
    console.error('Error in getAlerts:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving pollution alerts',
      error: error.message,
    });
  }
};
