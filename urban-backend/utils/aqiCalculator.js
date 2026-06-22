/**
 * AQI (Air Quality Index) Calculator
 * Converts individual pollutant measurements into a single AQI value
 * Uses standard EPA breakpoints for categorization
 */

/**
 * Breakpoints for different pollutants
 * Based on EPA and international standards
 */
const BREAKPOINTS = {
  pm25: [
    { max: 12, aqi: 50 },
    { max: 35.4, aqi: 100 },
    { max: 55.4, aqi: 150 },
    { max: 150.4, aqi: 200 },
    { max: 250.4, aqi: 300 },
    { max: Infinity, aqi: 500 },
  ],
  pm10: [
    { max: 54, aqi: 50 },
    { max: 154, aqi: 100 },
    { max: 254, aqi: 150 },
    { max: 354, aqi: 200 },
    { max: 424, aqi: 300 },
    { max: Infinity, aqi: 500 },
  ],
  no2: [
    { max: 53, aqi: 50 },
    { max: 100, aqi: 100 },
    { max: 360, aqi: 150 },
    { max: 649, aqi: 200 },
    { max: 1249, aqi: 300 },
    { max: Infinity, aqi: 500 },
  ],
  o3: [
    { max: 54, aqi: 50 },
    { max: 70, aqi: 100 },
    { max: 85, aqi: 150 },
    { max: 105, aqi: 200 },
    { max: 200, aqi: 300 },
    { max: Infinity, aqi: 500 },
  ],
};

/**
 * Calculate AQI for a single pollutant
 * @param {string} pollutant - Name of the pollutant (pm25, pm10, no2, o3)
 * @param {number} value - Measured value of the pollutant
 * @returns {number} AQI value for that pollutant
 */
const calculateIndividualAQI = (pollutant, value) => {
  if (!BREAKPOINTS[pollutant]) {
    console.warn(`Unknown pollutant: ${pollutant}`);
    return 0;
  }

  // Find the appropriate breakpoint
  const breakpoint = BREAKPOINTS[pollutant].find((bp) => value <= bp.max);
  
  if (!breakpoint) {
    return BREAKPOINTS[pollutant][BREAKPOINTS[pollutant].length - 1].aqi;
  }

  return breakpoint.aqi;
};

/**
 * Calculate overall AQI from multiple pollutants
 * @param {object} pollutionData - Object containing pollutant values
 * @returns {object} Object with AQI value and category
 */
const calculateAQI = (pollutionData) => {
  try {
    // Calculate AQI for each pollutant
    const pm25AQI = calculateIndividualAQI('pm25', pollutionData.pm25);
    const pm10AQI = calculateIndividualAQI('pm10', pollutionData.pm10);
    const no2AQI = calculateIndividualAQI('no2', pollutionData.no2);
    const o3AQI = calculateIndividualAQI('o3', pollutionData.o3);

    // Overall AQI is the maximum of all individual AQIs
    const overallAQI = Math.max(pm25AQI, pm10AQI, no2AQI, o3AQI);

    // Determine air quality category
    let category = '';
    let color = '';
    let severity = '';

    if (overallAQI <= 50) {
      category = 'Good';
      color = '#00E400';
      severity = 'low';
    } else if (overallAQI <= 100) {
      category = 'Moderate';
      color = '#FFFF00';
      severity = 'moderate';
    } else if (overallAQI <= 150) {
      category = 'Unhealthy for Sensitive Groups';
      color = '#FF7E00';
      severity = 'medium';
    } else if (overallAQI <= 200) {
      category = 'Unhealthy';
      color = '#FF0000';
      severity = 'high';
    } else if (overallAQI <= 300) {
      category = 'Very Unhealthy';
      color = '#8F3F97';
      severity = 'very_high';
    } else {
      category = 'Hazardous';
      color = '#7E0023';
      severity = 'hazardous';
    }

    return {
      aqi: Math.round(overallAQI),
      category,
      color,
      severity,
      breakdown: {
        pm25: Math.round(pm25AQI),
        pm10: Math.round(pm10AQI),
        no2: Math.round(no2AQI),
        o3: Math.round(o3AQI),
      },
    };
  } catch (error) {
    console.error('Error calculating AQI:', error);
    throw error;
  }
};

module.exports = {
  calculateAQI,
  calculateIndividualAQI,
};
