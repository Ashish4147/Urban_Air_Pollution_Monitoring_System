# Sample Test Data

## MongoDB Sample Documents

### Database: `urban-pollution`
### Collection: `pollutions`

---

## Sample Document 1: Delhi - High Pollution

```json
{
  "_id": ObjectId("65a1f2b3c4d5e6f7a8b9c0d1"),
  "city": "delhi",
  "timestamp": ISODate("2024-01-15T10:30:00.000Z"),
  "pm25": 85.5,
  "pm10": 120.3,
  "no2": 42.1,
  "so2": 15.7,
  "co": 0.8,
  "o3": 35.2,
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z"),
  "__v": 0
}
```

### AQI Calculation for Delhi:
- PM2.5 AQI: 150 (High)
- PM10 AQI: 87 (Moderate)
- NO2 AQI: 53 (Good)
- O3 AQI: 45 (Good)
- **Overall AQI: 156** (Unhealthy for Sensitive Groups)

---

## Sample Document 2: Mumbai - Moderate Pollution

```json
{
  "_id": ObjectId("65a1f2b3c4d5e6f7a8b9c0d2"),
  "city": "mumbai",
  "timestamp": ISODate("2024-01-15T11:15:00.000Z"),
  "pm25": 62.3,
  "pm10": 95.1,
  "no2": 35.2,
  "so2": 12.1,
  "co": 0.6,
  "o3": 38.5,
  "createdAt": ISODate("2024-01-15T11:15:00.000Z"),
  "updatedAt": ISODate("2024-01-15T11:15:00.000Z"),
  "__v": 0
}
```

### AQI Calculation for Mumbai:
- PM2.5 AQI: 100 (Moderate)
- PM10 AQI: 68 (Good)
- NO2 AQI: 47 (Good)
- O3 AQI: 42 (Good)
- **Overall AQI: 100** (Moderate)

---

## Sample Document 3: Bangalore - Low Pollution

```json
{
  "_id": ObjectId("65a1f2b3c4d5e6f7a8b9c0d3"),
  "city": "bangalore",
  "timestamp": ISODate("2024-01-15T12:00:00.000Z"),
  "pm25": 45.2,
  "pm10": 78.9,
  "no2": 28.3,
  "so2": 10.2,
  "co": 0.5,
  "o3": 42.1,
  "createdAt": ISODate("2024-01-15T12:00:00.000Z"),
  "updatedAt": ISODate("2024-01-15T12:00:00.000Z"),
  "__v": 0
}
```

### AQI Calculation for Bangalore:
- PM2.5 AQI: 75 (Moderate)
- PM10 AQI: 58 (Good)
- NO2 AQI: 41 (Good)
- O3 AQI: 48 (Good)
- **Overall AQI: 75** (Moderate)

---

## Sample Forecast Data

### 7-Day PM2.5 Forecast for Delhi

```json
{
  "city": "delhi",
  "forecast": [82.5, 79.3, 85.1, 90.2, 87.5, 84.2, 81.9],
  "daysAhead": 7,
  "generatedAt": "2024-01-15T14:00:00.000Z"
}
```

**Day-by-day breakdown:**
- Day 1: 82.5 µg/m³ (High)
- Day 2: 79.3 µg/m³ (High)
- Day 3: 85.1 µg/m³ (High)
- Day 4: 90.2 µg/m³ (Very High)
- Day 5: 87.5 µg/m³ (High)
- Day 6: 84.2 µg/m³ (High)
- Day 7: 81.9 µg/m³ (High)

**Forecast Trend:** Slight increase in mid-week, then stabilizes

---

## Historical Data Series (30 days)

```json
{
  "city": "delhi",
  "period": "30 days",
  "dataPoints": 30,
  "data": [
    {
      "date": "2023-12-16",
      "pm25": 72.1,
      "timestamp": "2023-12-16T10:00:00Z",
      "aqi": 142
    },
    {
      "date": "2023-12-17",
      "pm25": 78.5,
      "timestamp": "2023-12-17T10:00:00Z",
      "aqi": 155
    },
    {
      "date": "2023-12-18",
      "pm25": 85.2,
      "timestamp": "2023-12-18T10:00:00Z",
      "aqi": 168
    },
    {
      "date": "2023-12-19",
      "pm25": 92.1,
      "timestamp": "2023-12-19T10:00:00Z",
      "aqi": 182
    },
    {
      "date": "2023-12-20",
      "pm25": 88.3,
      "timestamp": "2023-12-20T10:00:00Z",
      "aqi": 175
    }
  ],
  "statistics": {
    "average": 81.5,
    "max": 95.2,
    "min": 55.3,
    "trend": "increasing"
  }
}
```

---

## Pollutant Reference Ranges

### Good Air Quality (AQI < 50)
```json
{
  "city": "bangalore",
  "pm25": 12.0,
  "pm10": 35.0,
  "no2": 40.0,
  "so2": 10.0,
  "co": 1.0,
  "o3": 35.0
}
```

### Moderate Air Quality (AQI 51-100)
```json
{
  "city": "mumbai",
  "pm25": 35.4,
  "pm10": 98.0,
  "no2": 82.0,
  "so2": 25.0,
  "co": 1.9,
  "o3": 65.0
}
```

### Unhealthy for Sensitive Groups (AQI 101-150)
```json
{
  "city": "delhi",
  "pm25": 55.4,
  "pm10": 155.0,
  "no2": 200.0,
  "so2": 35.0,
  "co": 2.4,
  "o3": 75.0
}
```

### Unhealthy (AQI 151-200)
```json
{
  "city": "beijing",
  "pm25": 150.4,
  "pm10": 250.0,
  "no2": 400.0,
  "so2": 63.0,
  "co": 4.4,
  "o3": 85.0
}
```

### Very Unhealthy (AQI 201-300)
```json
{
  "city": "lahore",
  "pm25": 250.4,
  "pm10": 350.0,
  "no2": 600.0,
  "so2": 100.0,
  "co": 8.5,
  "o3": 115.0
}
```

---

## Testing Data - Bulk Insert

To populate database with sample data, use this MongoDB insert command:

```javascript
db.pollutions.insertMany([
  {
    "city": "delhi",
    "timestamp": new Date("2024-01-15T08:00:00Z"),
    "pm25": 78.2,
    "pm10": 110.5,
    "no2": 38.1,
    "so2": 13.5,
    "co": 0.7,
    "o3": 32.1
  },
  {
    "city": "delhi",
    "timestamp": new Date("2024-01-15T09:00:00Z"),
    "pm25": 81.5,
    "pm10": 115.3,
    "no2": 40.2,
    "so2": 14.1,
    "co": 0.75,
    "o3": 33.5
  },
  {
    "city": "delhi",
    "timestamp": new Date("2024-01-15T10:00:00Z"),
    "pm25": 85.5,
    "pm10": 120.3,
    "no2": 42.1,
    "so2": 15.7,
    "co": 0.8,
    "o3": 35.2
  },
  {
    "city": "mumbai",
    "timestamp": new Date("2024-01-15T10:00:00Z"),
    "pm25": 62.3,
    "pm10": 95.1,
    "no2": 35.2,
    "so2": 12.1,
    "co": 0.6,
    "o3": 38.5
  },
  {
    "city": "bangalore",
    "timestamp": new Date("2024-01-15T10:00:00Z"),
    "pm25": 45.2,
    "pm10": 78.9,
    "no2": 28.3,
    "so2": 10.2,
    "co": 0.5,
    "o3": 42.1
  }
])
```

---

## ARIMA Model Test Data

### Historical Time Series (for ML forecasting)

```json
{
  "values": [45.2, 52.1, 48.5, 55.3, 60.1, 58.9, 62.3, 65.1, 68.2, 70.1],
  "description": "10-day PM2.5 historical data"
}
```

**Forecast Output:**
```json
{
  "forecast": [67.2, 68.5, 66.3, 65.1, 67.8, 69.2, 66.5]
}
```

---

## API Request/Response Examples

### Request: Add Pollution Data

```bash
curl -X POST http://localhost:5001/api/pollution \
  -H "Content-Type: application/json" \
  -d '{
    "city": "delhi",
    "pm25": 85.5,
    "pm10": 120.3,
    "no2": 42.1,
    "so2": 15.7,
    "co": 0.8,
    "o3": 35.2
  }'
```

### Response: 201 Created

```json
{
  "success": true,
  "message": "Pollution data recorded successfully",
  "data": {
    "_id": "65a1f2b3c4d5e6f7a8b9c0d1",
    "city": "delhi",
    "pm25": 85.5,
    "pm10": 120.3,
    "no2": 42.1,
    "so2": 15.7,
    "co": 0.8,
    "o3": 35.2,
    "timestamp": "2024-01-15T10:30:00.000Z",
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

## Unit Measurements Reference

| Pollutant | Unit | Scale | Color |
|-----------|------|-------|-------|
| PM2.5 | µg/m³ | 0-250+ | Red gradient |
| PM10 | µg/m³ | 0-350+ | Blue gradient |
| NO₂ | ppb | 0-1200+ | Yellow gradient |
| SO₂ | ppb | 0-500+ | Green gradient |
| CO | ppm | 0-50+ | Purple gradient |
| O₃ | ppb | 0-200+ | Orange gradient |

---

## Tips for Testing

1. **Create multiple records** for same city to test historical data
2. **Use different timestamps** to simulate real data flow
3. **Vary pollutant levels** to test AQI categorization
4. **Test boundary values** (e.g., AQI exactly at 100)
5. **Add data regularly** to build time-series for accurate forecasts

---

Happy Testing! 🎯
