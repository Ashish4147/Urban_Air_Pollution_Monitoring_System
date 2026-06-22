/**
 * Forecast Service
 * Handles communication with the ML microservice
 * Sends historical pollution data to Flask ARIMA model
 */

const axios = require('axios');
const Pollution = require('../models/Pollution');

/**
 * Fetch historical pollutant data for a city
 * @param {string} city - City name
 * @param {string} pollutant - Pollutant field name
 * @param {number} days - Number of days of historical data
 * @returns {Promise<array>} Array of pollutant values
 */
const getHistoricalData = async (city, pollutant = 'pm25', days = 30) => {
  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    // Query MongoDB for historical pollution data
    const data = await Pollution.find({
      city: city.toLowerCase(),
      timestamp: { $gte: fromDate },
    })
      .sort({ timestamp: 1 })
      .select(`${pollutant} timestamp`)
      .lean();

    // Extract pollutant values in chronological order
    const pollutantValues = data.map((record) => record[pollutant]);

    if (pollutantValues.length < 7) {
      throw new Error('Insufficient historical data for forecasting');
    }

    return pollutantValues;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

/**
 * Request forecast from ML microservice
 * @param {array} historicalValues - Array of PM2.5 values for ARIMA model
 * @returns {Promise<object>} Forecast data with predictions
 */
const getForecast = async (historicalValues) => {
  try {
    // Get ML service URL from environment
    const mlServiceURL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

    // Send request to Flask microservice
    const response = await axios.post(`${mlServiceURL}/predict`, {
      values: historicalValues,
    });

    if (!response.data || !response.data.forecast) {
      throw new Error('Invalid forecast response from ML service');
    }

    return response.data;
  } catch (error) {
    console.error('Error getting forecast from ML service:', error.message);
    throw new Error(`ML Service Error: ${error.message}`);
  }
};

/**
 * Get complete forecast for a city and pollutant
 * Combines historical data fetch and ML prediction
 * @param {string} city - City name
 * @param {string} pollutant - Pollutant field name
 * @returns {Promise<object>} Complete forecast object
 */
const getPollutionForecast = async (city, pollutant = 'pm25') => {
  try {
    // Fetch historical data from MongoDB
    const historicalValues = await getHistoricalData(city, pollutant, 30);

    // Get forecast from ML microservice
    const forecastData = await getForecast(historicalValues);

    // Format response
    return {
      city: city.toLowerCase(),
      pollutant,
      forecast: forecastData.forecast,
      daysAhead: 7,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error in getPollutionForecast:', error);
    throw error;
  }
};

module.exports = {
  getPollutionForecast,
  getHistoricalData,
  getForecast,
};
