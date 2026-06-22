# Postman Collection for Testing

## Import Instructions

1. Open Postman
2. Click **Import** button
3. Choose **Raw text** or **File**
4. Paste the content below
5. Click **Import**

## Environment Setup

Before running requests, create an Environment:

1. Click **Environments** (left sidebar)
2. Click **Create**
3. Add variables:

```
backend_url: http://localhost:5001
ml_url: http://localhost:5000
city: delhi
forecast_days: 7
```

---

## API Request Examples

### 1. Backend Health Check

```
GET http://localhost:5001/api/health
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Backend server is running",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 2. ML Service Health Check

```
GET http://localhost:5000/health
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "ML Microservice is running",
  "service": "ARIMA PM2.5 Forecasting"
}
```

---

### 3. Add Pollution Data - Delhi

```
POST http://localhost:5001/api/pollution
Content-Type: application/json

{
  "city": "Delhi",
  "pm25": 85.5,
  "pm10": 120.3,
  "no2": 42.1,
  "so2": 15.7,
  "co": 0.8,
  "o3": 35.2
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Pollution data recorded successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "city": "delhi",
    "pm25": 85.5,
    "pm10": 120.3,
    "no2": 42.1,
    "so2": 15.7,
    "co": 0.8,
    "o3": 35.2,
    "timestamp": "2024-01-15T10:30:00Z",
    "aqi": {
      "aqi": 156,
      "category": "Unhealthy for Sensitive Groups",
      "color": "#FF7E00",
      "severity": "medium"
    }
  }
}
```

---

### 4. Add Pollution Data - Mumbai

```
POST http://localhost:5001/api/pollution
Content-Type: application/json

{
  "city": "Mumbai",
  "pm25": 62.3,
  "pm10": 95.1,
  "no2": 35.2,
  "so2": 12.1,
  "co": 0.6,
  "o3": 38.5
}
```

---

### 5. Add Pollution Data - Bangalore

```
POST http://localhost:5001/api/pollution
Content-Type: application/json

{
  "city": "Bangalore",
  "pm25": 45.2,
  "pm10": 78.9,
  "no2": 28.3,
  "so2": 10.2,
  "co": 0.5,
  "o3": 42.1
}
```

---

### 6. Get Current Pollution Data

```
GET http://localhost:5001/api/pollution/delhi
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "city": "delhi",
    "pm25": 85.5,
    "pm10": 120.3,
    "no2": 42.1,
    "so2": 15.7,
    "co": 0.8,
    "o3": 35.2,
    "timestamp": "2024-01-15T10:30:00Z",
    "aqi": {
      "aqi": 156,
      "category": "Unhealthy for Sensitive Groups",
      "color": "#FF7E00",
      "severity": "medium",
      "breakdown": {
        "pm25": 150,
        "pm10": 87,
        "no2": 53,
        "o3": 45
      }
    }
  }
}
```

---

### 7. Get Historical Data (30 days)

```
GET http://localhost:5001/api/pollution/history/delhi?days=30
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "city": "delhi",
      "pm25": 85.5,
      "pm10": 120.3,
      "no2": 42.1,
      "so2": 15.7,
      "co": 0.8,
      "o3": 35.2,
      "timestamp": "2024-01-15T10:30:00Z",
      "aqi": 156
    }
  ]
}
```

---

### 8. Get PM2.5 Forecast

```
GET http://localhost:5001/api/forecast/delhi
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "city": "delhi",
    "forecast": [82.5, 79.3, 85.1, 90.2, 87.5, 84.2, 81.9],
    "daysAhead": 7,
    "generatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 9. ML Service - Forecast with Historical Data

```
POST http://localhost:5000/predict
Content-Type: application/json

{
  "values": [45.2, 52.1, 48.5, 55.3, 60.1, 58.9, 62.3, 65.1, 68.2, 70.1]
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "forecast": [67.2, 68.5, 66.3, 65.1, 67.8, 69.2, 66.5],
  "forecast_length": 7
}
```

---

### 10. ML Service - Forecast with Confidence Intervals

```
POST http://localhost:5000/predict?days=7&ci=true
Content-Type: application/json

{
  "values": [45.2, 52.1, 48.5, 55.3, 60.1, 58.9, 62.3, 65.1, 68.2, 70.1]
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "forecast": [67.2, 68.5, 66.3, 65.1, 67.8, 69.2, 66.5],
  "forecast_length": 7,
  "lower_ci": [60.1, 58.9, 59.2, 58.5, 58.3, 57.9, 57.1],
  "upper_ci": [74.3, 78.1, 73.4, 71.7, 77.3, 80.5, 75.9]
}
```

---

## Testing Workflow

### Complete Test Sequence

1. **Verify Services**
   - Health Check Backend
   - Health Check ML

2. **Add Test Data**
   - Add Delhi data
   - Add Mumbai data
   - Add Bangalore data

3. **Fetch Data**
   - Get Current Pollution (Delhi)
   - Get Historical Data (Delhi)

4. **Get Forecast**
   - Get Forecast (Backend)
   - Get Forecast (ML Service directly)

5. **Different Cities**
   - Repeat steps 3-4 for Mumbai and Bangalore

---

## Postman Scripts

### Pre-request Script (Add Random Data)

```javascript
// Generate random city
const cities = ['delhi', 'mumbai', 'bangalore', 'beijing', 'newyork', 'london'];
const randomCity = cities[Math.floor(Math.random() * cities.length)];
pm.environment.set("city", randomCity);

// Generate random pollution values
const randomPM25 = Math.floor(Math.random() * 150) + 20;
pm.environment.set("pm25", randomPM25);
```

### Tests Script (Validate Response)

```javascript
// Check status code
pm.test("Status code is 200/201", function() {
    pm.expect([200, 201]).to.include(pm.response.code);
});

// Check success property
pm.test("Response has success property", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.equal(true);
});

// Check data exists
pm.test("Response has data", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.exist;
});

// Log response time
pm.test("Response time is acceptable", function() {
    pm.expect(pm.response.responseTime).to.be.below(5000);
});
```

---

## Error Testing

### Test Invalid City

```
GET http://localhost:5001/api/pollution/invalidcity
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "No pollution data found for city: invalidcity"
}
```

---

### Test Missing Required Fields

```
POST http://localhost:5001/api/pollution
Content-Type: application/json

{
  "city": "Delhi"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "All pollution parameters are required"
}
```

---

### Test Invalid Data

```
POST http://localhost:5000/predict
Content-Type: application/json

{
  "values": []
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Minimum 7 data points required, got 0"
}
```

---

## Performance Testing

### Load Test - Add Many Records

Create a script that:
1. Loops 100 times
2. Sends POST to `/api/pollution` with random data
3. Measures average response time

```javascript
// Run in Postman Console
for (let i = 0; i < 10; i++) {
  pm.sendRequest({
    url: "http://localhost:5001/api/pollution",
    method: "POST",
    header: {
      "Content-Type": "application/json"
    },
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        city: "delhi",
        pm25: Math.random() * 100,
        pm10: Math.random() * 150,
        no2: Math.random() * 50,
        so2: Math.random() * 30,
        co: Math.random() * 3,
        o3: Math.random() * 100
      })
    }
  }, function(err, response) {
    console.log(response.code);
  });
}
```

---

## Export/Share Collection

1. Click collection name
2. Click **...** (three dots)
3. Click **Export**
4. Choose format (JSON v2.1 recommended)
5. Save file

---

## Tips & Tricks

- Use **{{backend_url}}** variable instead of hardcoding URLs
- Use **Postman Tests** tab to validate responses
- Use **Pre-request Scripts** to generate test data
- Save responses as **Examples** for reference
- Use **Collections Runner** to execute multiple tests

---

That's it! You can now test all API endpoints comprehensively. 🚀
