/**
 * In-Memory Data Store
 * Manages locally uploaded datasets without requiring MongoDB
 * Stores pollution data from file uploads for querying
 */

class DataStore {
  constructor() {
    // Store datasets by upload ID
    this.datasets = {};
    // Store all merged pollution data
    this.pollutionData = [];
    // Track upload history
    this.uploadHistory = [];
    this.nextId = 1;
  }

  /**
   * Add uploaded dataset
   * @param {Array} records - Array of pollution records
   * @param {String} filename - Original filename
   * @returns {Object} Upload info
   */
  addDataset(records, filename) {
    const uploadId = this.nextId++;
    const timestamp = new Date();

    // Validate and normalize records
    const validRecords = records.map((record, idx) => {
      // Required core pollution fields
      const required = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3'];
      
      for (const field of required) {
        if (record[field] === undefined || record[field] === null || record[field] === '') {
          throw new Error(
            `Record ${idx} is missing required field: ${field}`
          );
        }
      }

      // City is also required
      if (!record.city) {
        throw new Error(`Record ${idx} is missing required field: city`);
      }

      const normalized = {
        city: String(record.city).toLowerCase(),
        timestamp: record.timestamp ? new Date(record.timestamp) : timestamp,
        pm25: Number(record.pm25),
        pm10: Number(record.pm10),
        no2: Number(record.no2),
        so2: Number(record.so2),
        co: Number(record.co),
        o3: Number(record.o3),
        uploadId,
        uploadTimestamp: timestamp,
      };

      // Include optional fields if present
      if (record.co2 !== undefined && record.co2 !== null) {
        normalized.co2 = Number(record.co2);
      }
      if (record.sensor_id !== undefined && record.sensor_id !== null) {
        normalized.sensor_id = record.sensor_id;
      }
      if (record.latitude !== undefined && record.latitude !== null) {
        normalized.latitude = Number(record.latitude);
      }
      if (record.longitude !== undefined && record.longitude !== null) {
        normalized.longitude = Number(record.longitude);
      }

      return normalized;
    });

    // Store dataset info
    this.datasets[uploadId] = {
      id: uploadId,
      filename,
      uploadTimestamp: timestamp,
      recordCount: validRecords.length,
      cities: [...new Set(validRecords.map((r) => r.city))],
    };

    // Add records to pollution data
    this.pollutionData.push(...validRecords);

    // Add to upload history
    this.uploadHistory.push(this.datasets[uploadId]);

    return {
      success: true,
      uploadId,
      recordsInserted: validRecords.length,
      message: `Successfully uploaded ${validRecords.length} records from ${filename}`,
    };
  }

  /**
   * Get latest pollution data for a city
   * @param {String} city - City name
   * @returns {Object|null} Latest pollution record or null
   */
  getPollutionByCity(city) {
    const cityLower = String(city).toLowerCase();
    const records = this.pollutionData.filter((r) => r.city === cityLower);

    if (records.length === 0) {
      return null;
    }

    // Return latest record for this city
    return records.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    )[0];
  }

  /**
   * Get historical pollution data for a city
   * @param {String} city - City name
   * @param {Number} days - Number of days of history
   * @returns {Array} Historical records
   */
  getPollutionHistory(city, days = 30) {
    const cityLower = String(city).toLowerCase();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.pollutionData
      .filter(
        (r) =>
          r.city === cityLower &&
          new Date(r.timestamp) >= cutoffDate
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  /**
   * Get all uploaded records for a specific city
   * @param {String} city
   * @returns {Array}
   */
  getAllRecordsByCity(city) {
    const cityLower = String(city).toLowerCase();
    return this.pollutionData
      .filter((r) => r.city === cityLower)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  /**
   * Get all uploaded datasets
   * @returns {Array} Upload history
   */
  getUploadHistory() {
    return this.uploadHistory;
  }

  /**
   * Check if data store has data
   * @returns {Boolean}
   */
  hasData() {
    return this.pollutionData.length > 0;
  }

  /**
   * Get total records in store
   * @returns {Number}
   */
  getRecordCount() {
    return this.pollutionData.length;
  }

  /**
   * Get all cities in store
   * @returns {Array}
   */
  getAllCities() {
    return [...new Set(this.pollutionData.map((r) => r.city))];
  }

  getAllRecords() {
    return this.pollutionData.slice();
  }

  /**
   * Clear all data
   */
  clearAll() {
    this.datasets = {};
    this.pollutionData = [];
    this.uploadHistory = [];
  }

  /**
   * Remove specific dataset
   * @param {Number} uploadId - Upload ID to remove
   */
  removeDataset(uploadId) {
    if (this.datasets[uploadId]) {
      // Remove associated records
      this.pollutionData = this.pollutionData.filter(
        (r) => r.uploadId !== uploadId
      );
      // Remove dataset info
      delete this.datasets[uploadId];
      return true;
    }
    return false;
  }
}

// Single instance
const dataStore = new DataStore();

module.exports = dataStore;
