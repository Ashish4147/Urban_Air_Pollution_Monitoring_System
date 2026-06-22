/**
 * Pollution Monitoring API Service
 * Handles all HTTP calls to the backend server
 */

import axios from 'axios';

// Backend API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add new pollution data
 * @param {object} pollutionData - Data with city and pollutant levels
 * @returns {Promise} Response with saved data and AQI
 */
export const addPollutionData = (pollutionData) => {
  return apiClient.post('/pollution', pollutionData);
};

/**
 * Get latest pollution data for a city
 * @param {string} city - City name
 * @returns {Promise} Current pollution data with AQI
 */
export const getPollutionByCity = (city) => {
  console.log(`[API] Calling getPollutionByCity for city: ${city}`);
  return apiClient.get(`/pollution/${city}`).then(response => {
    console.log(`[API] getPollutionByCity response:`, response.data);
    return response;
  }).catch(error => {
    console.error(`[API] getPollutionByCity error:`, error);
    throw error;
  });
};

/**
 * Get historical pollution data
 * @param {string} city - City name
 * @param {number} days - Number of days of history (default: 30)
 * @returns {Promise} Array of historical pollution records
 */
export const getPollutionHistory = (city, days = 30) => {
  return apiClient.get(`/pollution/history/${city}`, {
    params: { days },
  });
};

/**
 * Get forecast for a specific pollutant in a city
 * @param {string} city - City name
 * @param {string} pollutant - Pollutant type
 * @returns {Promise} 7-day forecast data
 */
export const getPollutantForecast = (city, pollutant) => {
  return apiClient.get(`/pollution/forecast/${city}/${pollutant}`);
};

/**
 * Get PM2.5 forecast for a city
 * @param {string} city - City name
 * @returns {Promise} 7-day forecast data
 */
export const getPollutionForecast = (city) => {
  return apiClient.get(`/pollution/forecast/${city}/pm25`);
};

/**
 * Upload pollution dataset from JSON file
 * @param {FormData} formData - FormData object containing file
 * @returns {Promise} Upload response with stats
 */
export const uploadDataset = (formData) => {
  // Create a new client instance without Content-Type header for file upload
  const uploadClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 second timeout for file uploads
  });

  return uploadClient.post('/pollution/upload', formData);
};

/**
 * Get upload history
 * @returns {Promise} List of all uploaded datasets
 */
export const getUploadHistory = () => {
  return apiClient.get('/pollution/upload/history');
};

/**
 * Get data sources information
 * @returns {Promise} Info about available data sources
 */
export const getDataSources = () => {
  return apiClient.get('/pollution/data/sources');
};

/**
 * Get list of all available cities
 * @returns {Promise} Array of city names
 */
export const getCities = () => {
  return apiClient.get('/pollution/cities');
};

/**
 * Get average pollutant values per day for a city
 * @param {string} city - City name
 * @param {string} pollutant - Pollutant type (pm25, pm10, etc.)
 * @param {number} days - Number of days (default: 30)
 * @returns {Promise} Daily averages data
 */
export const getAveragePollutant = (city, pollutant, days = 30) => {
  return apiClient.get(`/pollution/average/${city}/${pollutant}`, {
    params: { days },
  });
};

/**
 * Get peak hours data for a pollutant in a city
 * @param {string} city - City name
 * @param {string} pollutant - Pollutant type
 * @param {number} days - Number of days (default: 30)
 * @returns {Promise} Hourly averages data
 */
export const getPeakHours = (city, pollutant, days = 30) => {
  return apiClient.get(`/pollution/peakhours/${city}/${pollutant}`, {
    params: { days },
  });
};

/**
 * Compare pollutant levels across cities
 * @param {string} pollutant - Pollutant type
 * @param {number} days - Number of days (default: 30)
 * @returns {Promise} Comparison data across cities
 */
export const getCityComparison = (pollutant, days = 30) => {
  return apiClient.get(`/pollution/compare/${pollutant}`, {
    params: { days },
  });
};

/**
 * Get pollution alerts
 * @returns {Promise} Current alerts for cities exceeding thresholds
 */
export const getAlerts = () => {
  return apiClient.get('/pollution/alerts');
};

export default apiClient;
