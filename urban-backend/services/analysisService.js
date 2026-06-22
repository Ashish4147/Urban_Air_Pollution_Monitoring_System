/**
 * Data Analysis Service
 * Handles all data analysis operations for pollution monitoring
 * Provides functions for: average, peak hours, comparisons, forecasts, and alerts
 */

const dataStore = require('../utils/dataStore');
const { calculateAQI } = require('./aqiCalculator');

class DataAnalysisService {
  /**
   * Get average pollutant values per day for a city
   */
  static getAveragePollutantByDate(city, pollutant) {
    const records = dataStore.getPollutionHistory(city, 365);
    if (records.length === 0) {
      return [];
    }

    // Group by date
    const byDate = {};
    records.forEach(record => {
      const date = new Date(record.timestamp).toISOString().split('T')[0];
      if (!byDate[date]) {
        byDate[date] = [];
      }
      byDate[date].push(Number(record[pollutant]) || 0);
    });

    // Calculate averages
    const result = [];
    Object.keys(byDate).sort().forEach(date => {
      const values = byDate[date];
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      result.push({
        date,
        value: Math.round(avg * 100) / 100,
        count: values.length
      });
    });

    return result;
  }

  /**
   * Get average pollutant by hour of day
   */
  static getPeakHours(city, pollutant) {
    const records = dataStore.getPollutionHistory(city, 365);
    if (records.length === 0) {
      return [];
    }

    // Group by hour
    const byHour = {};
    for (let i = 0; i < 24; i++) {
      byHour[i] = [];
    }

    records.forEach(record => {
      const hour = new Date(record.timestamp).getHours();
      byHour[hour].push(Number(record[pollutant]) || 0);
    });

    // Calculate averages
    const result = [];
    Object.keys(byHour).forEach(hour => {
      const values = byHour[hour];
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        result.push({
          hour: parseInt(hour),
          value: Math.round(avg * 100) / 100,
          count: values.length
        });
      }
    });

    return result;
  }

  /**
   * Compare average pollutant across all cities
   */
  static compareRegions(pollutant) {
    const cities = dataStore.getAllCities();
    const result = [];

    cities.forEach(city => {
      const records = dataStore.getPollutionHistory(city, 365);
      if (records.length > 0) {
        const values = records.map(r => Number(r[pollutant]) || 0);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        result.push({
          city,
          value: Math.round(avg * 100) / 100,
          count: values.length,
          min: Math.round(Math.min(...values) * 100) / 100,
          max: Math.round(Math.max(...values) * 100) / 100
        });
      }
    });

    return result.sort((a, b) => b.value - a.value);
  }

  /**
   * Simple forecast using moving average (7-day trend)
   */
  static forecast(city, pollutant, days = 7) {
    const records = dataStore.getPollutionHistory(city, 30);
    if (records.length < 7) {
      return { error: 'Insufficient data for forecast' };
    }

    // Get last 7 days average
    const avgByDay = {};
    records.forEach(record => {
      const date = new Date(record.timestamp).toISOString().split('T')[0];
      if (!avgByDay[date]) {
        avgByDay[date] = [];
      }
      avgByDay[date].push(Number(record[pollutant]) || 0);
    });

    const dayAverages = [];
    Object.keys(avgByDay).sort().forEach(date => {
      const values = avgByDay[date];
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      dayAverages.push(avg);
    });

    // Calculate trend (simple moving average)
    const lastWeek = dayAverages.slice(-7);
    const avg = lastWeek.reduce((a, b) => a + b, 0) / lastWeek.length;

    // Generate forecast
    const forecast = [];
    for (let i = 1; i <= days; i++) {
      const trend = (lastWeek[lastWeek.length - 1] - lastWeek[0]) / 6;
      const forecastValue = avg + (trend * i * 0.3);
      forecast.push({
        day: i,
        value: Math.round(forecastValue * 100) / 100,
        trend: trend > 0 ? 'up' : 'down'
      });
    }

    return {
      city,
      pollutant,
      lastValue: Math.round(dayAverages[dayAverages.length - 1] * 100) / 100,
      average: Math.round(avg * 100) / 100,
      forecast
    };
  }

  /**
   * Check for pollution alerts
   */
  static checkAlerts() {
    const thresholds = {
      pm25: 100,
      pm10: 150,
      co2: 1000,
      co: 9,
      no2: 80,
      so2: 80,
      o3: 120
    };

    const alerts = [];
    const cities = dataStore.getAllCities();

    cities.forEach(city => {
      const latest = dataStore.getPollutionByCity(city);
      if (latest) {
        Object.keys(thresholds).forEach(pollutant => {
          const value = latest[pollutant];
          if (value !== undefined && value > thresholds[pollutant]) {
            alerts.push({
              city,
              pollutant,
              value: Math.round(value * 100) / 100,
              threshold: thresholds[pollutant],
              severity: value > thresholds[pollutant] * 2 ? 'critical' : 'warning'
            });
          }
        });
      }
    });

    return {
      alertCount: alerts.length,
      alerts: alerts.sort((a, b) => b.value - a.value)
    };
  }

  /**
   * Get summary statistics for a pollutant across dataset
   */
  static getPollutantStats(city, pollutant) {
    const records = dataStore.getPollutionHistory(city, 365);
    if (records.length === 0) {
      return null;
    }

    const values = records.map(r => Number(r[pollutant]) || 0).filter(v => v > 0);
    values.sort((a, b) => a - b);

    return {
      city,
      pollutant,
      count: values.length,
      min: Math.round(values[0] * 100) / 100,
      max: Math.round(values[values.length - 1] * 100) / 100,
      mean: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100,
      median: Math.round(values[Math.floor(values.length / 2)] * 100) / 100,
      p95: Math.round(values[Math.floor(values.length * 0.95)] * 100) / 100
    };
  }
}

module.exports = DataAnalysisService;
