/**
 * Pollution Data Schema
 * Defines the structure of pollution monitoring data
 */

const mongoose = require('mongoose');

// Define the pollution schema with all required air quality parameters
const pollutionSchema = new mongoose.Schema(
  {
    sensor_id: {
      type: String,
      trim: true,
      default: null,
    },
    city: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
      lowercase: true,
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
      default: null,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
      default: null,
    },
    timestamp: {
      type: Date,
      required: [true, 'Timestamp is required'],
      default: Date.now,
    },
    co2: {
      type: Number,
      required: [true, 'CO2 value is required'],
      min: 0,
      description: 'Carbon dioxide (ppm)',
    },
    co: {
      type: Number,
      required: [true, 'CO value is required'],
      min: 0,
      description: 'Carbon monoxide (ppm)',
    },
    pm25: {
      type: Number,
      required: [true, 'PM2.5 value is required'],
      min: 0,
      description: 'Fine particulate matter (µg/m³)',
    },
    pm10: {
      type: Number,
      required: [true, 'PM10 value is required'],
      min: 0,
      description: 'Coarse particulate matter (µg/m³)',
    },
    no2: {
      type: Number,
      required: [true, 'NO2 value is required'],
      min: 0,
      description: 'Nitrogen dioxide (ppb)',
    },
    so2: {
      type: Number,
      required: [true, 'SO2 value is required'],
      min: 0,
      description: 'Sulfur dioxide (ppb)',
    },
    o3: {
      type: Number,
      required: [true, 'O3 value is required'],
      min: 0,
      description: 'Ozone (ppb)',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create indexes for faster queries
pollutionSchema.index({ city: 1, timestamp: -1 });
pollutionSchema.index({ sensor_id: 1 });
pollutionSchema.index({ city: 1, timestamp: 1 });

// Create model from schema
const Pollution = mongoose.model('Pollution', pollutionSchema);

module.exports = Pollution;
