# Upload Dataset Feature

## Overview

The **Upload Dataset** feature allows users to upload pollution data from local JSON files without requiring MongoDB. This enables the system to work in a standalone mode with locally imported data.

## Features

✅ **File Upload Support** - Upload JSON files directly from your local machine  
✅ **No MongoDB Required** - Data is stored in-memory for immediate querying  
✅ **Format Validation** - Automatic validation of JSON structure and required fields  
✅ **Upload History** - View all previously uploaded datasets  
✅ **Data Querying** - Query uploaded data just like database data  
✅ **Automatic Integration** - Uploaded data automatically available for charts and forecasts  

## How to Use

### 1. Prepare Your Data File

Create a JSON file with the following structure:

```json
[
  {
    "city": "Delhi",
    "pm25": 85.5,
    "pm10": 120.3,
    "no2": 42.1,
    "so2": 15.7,
    "co": 0.8,
    "o3": 35.2,
    "timestamp": "2024-03-04T10:00:00Z"
  },
  {
    "city": "Mumbai",
    "pm25": 62.3,
    "pm10": 95.1,
    "no2": 35.2,
    "so2": 12.1,
    "co": 0.6,
    "o3": 38.5,
    "timestamp": "2024-03-04T10:00:00Z"
  }
]
```

### 2. Access Upload Feature

1. Open the Urban Air Pollution Monitor dashboard in your browser
2. Scroll down to the **"📁 Upload Pollution Dataset"** section
3. Click on the file input area or drag and drop your JSON file

### 3. Upload and Query

1. Select your JSON file
2. Click **"📤 Upload Dataset"**
3. Verify the upload success message
4. Select a city from the dropdown to view the uploaded data
5. Charts and forecast data will automatically use the uploaded dataset

### 4. View Upload History

1. Click **"▶ Show Upload History"** to expand the history section
2. See all uploaded files with:
   - Filename
   - Number of records
   - Cities included
   - Upload timestamp

## API Endpoints

### Upload Dataset

**Endpoint:** `POST /api/pollution/upload`

**Required:** Multipart form with file field

**Request:**
```
Content-Type: multipart/form-data

file: <JSON file>
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully uploaded 50 records from pollution_data.json",
  "uploadId": 1,
  "recordsInserted": 50,
  "uploadedFile": "pollution_data.json",
  "timestamp": "2024-03-04T10:15:00Z"
}
```

### Get Upload History

**Endpoint:** `GET /api/pollution/upload/history`

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUploads": 2,
    "totalRecords": 100,
    "availableCities": ["Delhi", "Mumbai", "Bangalore"]
  },
  "uploads": [
    {
      "id": 1,
      "filename": "pollution_data_march.json",
      "uploadTimestamp": "2024-03-04T10:15:00Z",
      "recordCount": 50,
      "cities": ["Delhi", "Mumbai"]
    }
  ]
}
```

### Get Data Sources

**Endpoint:** `GET /api/pollution/data/sources`

**Response:**
```json
{
  "success": true,
  "sources": {
    "mongodb": false,
    "uploadedData": true
  },
  "uploadedDataStats": {
    "available": true,
    "recordCount": 100,
    "cities": ["Delhi", "Mumbai", "Bangalore"],
    "uploadCount": 2
  }
}
```

## Data Format Specifications

### Required Fields

Each pollution record must include:

| Field | Type | Description | Valid Range |
|-------|------|-------------|----|
| `city` | String | City name | Any non-empty string |
| `pm25` | Number | PM2.5 level | 0-500+ µg/m³ |
| `pm10` | Number | PM10 level | 0-500+ µg/m³ |
| `no2` | Number | Nitrogen Dioxide | 0-500+ ppb |
| `so2` | Number | Sulfur Dioxide | 0-500+ ppb |
| `co` | Number | Carbon Monoxide | 0-50+ ppm |
| `o3` | Number | Ozone | 0-500+ ppb |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO String | Data collection time (defaults to upload time) |

## File Constraints

- **Maximum file size:** 10 MB
- **File format:** JSON only
- **Valid structure:** Must be a JSON array at the root level
- **Minimum records:** At least 1 record

## Error Handling

### Common Errors

**No file uploaded:**
```json
{
  "success": false,
  "message": "No file uploaded. Please provide a JSON file."
}
```

**Invalid JSON format:**
```json
{
  "success": false,
  "message": "Invalid JSON format in uploaded file.",
  "error": "Unexpected token _ in JSON at position 15"
}
```

**Missing required fields:**
```json
{
  "success": false,
  "message": "Record 0 in dataset is missing required field: pm25"
}
```

**File size exceeded:**
```json
{
  "success": false,
  "message": "File size exceeds 10MB limit"
}
```

## Use Cases

### 1. Local Development
Test the application without MongoDB:
```bash
npm start  # Frontend
node server.js  # Backend (no MongoDB needed)
```

### 2. Demo/Presentation
Upload sample data and demonstrate functionality without database setup.

### 3. Data Analysis
Upload historical pollution data for analysis and visualization.

### 4. Testing
Load test data for different cities and scenarios.

## Sample Data File

A sample pollution data file is included at:
```
urban-backend/data/sample_pollution.json
```

This can be directly uploaded through the UI.

## Performance Considerations

- **Data Storage:** In-memory storage (limited by available RAM)
- **Query Speed:** Instant (no database latency)
- **Multi-city Support:** Efficient filtering by city name
- **Historical Data:** Supports querying by date range
- **Scalability:** Suitable for datasets up to 100,000+ records depending on system RAM

## Limitations

⚠️ **In-Memory Storage** - Data is lost when the server restarts  
⚠️ **No Persistence** - Use MongoDB for permanent storage  
⚠️ **Single Server** - Data only available on the server where uploaded  
⚠️ **No Concurrent Uploads** - Uploads are processed sequentially  

## Integration with Dashboard

The upload feature is fully integrated with the dashboard:

1. **City Selector** - Uploaded cities appear dynamically
2. **Real-time Charts** - Charts update when new data is uploaded
3. **AQI Calculation** - AQI is calculated for uploaded data
4. **Forecast Data** - Forecast uses uploaded data as baseline

## Backend Implementation Details

### File Structure

```
urban-backend/
├── utils/
│   └── dataStore.js          # In-memory data management
├── controllers/
│   └── pollutionController.js # Upload handlers
├── routes/
│   └── pollutionRoutes.js    # Upload endpoints
└── server.js                  # Server entry point
```

### In-Memory Store (`dataStore.js`)

The `dataStore` module provides:
- `addDataset(records, filename)` - Store uploaded data
- `getPollutionByCity(city)` - Get latest data for city
- `getPollutionHistory(city, days)` - Get historical data
- `getUploadHistory()` - List all uploads
- `getRecordCount()` - Total records stored
- `getAllCities()` - List available cities

## Frontend Implementation

### Components

**UploadDataset.js** - Main upload UI component with:
- File input with drag & drop
- Upload progress
- Success/error messages
- Upload history display
- Format instructions

### Pages Using Upload Feature

1. **Dashboard.js** - Main integration point
2. **Services/api.js** - API calls for upload operations

## Testing

### Test Upload with Sample Data

1. Download or create `test_data.json`:
```json
[
  {
    "city": "TestCity",
    "pm25": 50,
    "pm10": 80,
    "no2": 30,
    "so2": 10,
    "co": 0.5,
    "o3": 40,
    "timestamp": "2024-03-04T10:00:00Z"
  }
]
```

2. Upload through UI and verify success
3. Select city from dropdown
4. Verify charts and data display correctly

## Troubleshooting

### Upload Button Disabled
- Ensure a file is selected
- Check file is valid JSON format

### "No data found for city"
- Verify city name in uploaded file matches dropdown selection
- Check file was successfully uploaded (check history)

### Server Crashes on Upload
- Check file size (limit 10MB)
- Verify JSON is valid (use JSON validator)
- Check available system RAM

### Data Disappears After Server Restart
- This is expected (in-memory storage)
- Re-upload the file or use MongoDB for persistence

## Future Enhancements

🔮 CSV file support  
🔮 Data persistence option  
🔮 Multi-file batch upload  
🔮 Data preview before upload  
🔮 Edit/delete uploaded records  
🔮 Export download functionality  
🔮 Database migration from uploaded data  

## Support

For issues or feature requests:
1. Check the troubleshooting section above
2. Review console logs in browser dev tools
3. Check backend server logs
4. Verify file format matches specifications

---

**Version:** 1.0.0  
**Last Updated:** March 4, 2024
