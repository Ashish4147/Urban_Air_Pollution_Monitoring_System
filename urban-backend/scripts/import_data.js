/**
 * Simple import script to insert a local JSON dataset into MongoDB
 * Usage: node import_data.js ./data/sample_pollution.json
 */

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const Pollution = require('../models/Pollution');

async function main() {
  const filePath = process.argv[2] || path.join(__dirname, '..', 'data', 'sample_pollution.json');

  if (!fs.existsSync(filePath)) {
    console.error('Dataset file not found:', filePath);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let docs;
  try {
    docs = JSON.parse(raw);
  } catch (err) {
    console.error('Invalid JSON in dataset file:', err.message);
    process.exit(1);
  }

  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urban-pollution';

  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Normalize documents
    const prepared = docs.map((d) => ({
      city: String(d.city).toLowerCase(),
      timestamp: d.timestamp ? new Date(d.timestamp) : new Date(),
      pm25: Number(d.pm25),
      pm10: Number(d.pm10),
      no2: Number(d.no2),
      so2: Number(d.so2),
      co: Number(d.co),
      o3: Number(d.o3),
    }));

    const res = await Pollution.insertMany(prepared, { ordered: false });
    console.log(`Inserted ${res.length} documents successfully`);
    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
