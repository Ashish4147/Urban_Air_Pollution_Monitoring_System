# Project Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │             React Frontend (Port 3000)                       │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │ Dashboard Component                                    │  │  │
│  │  │  ├─ CitySelector                                       │  │  │
│  │  │  ├─ PollutionChart                                     │  │  │
│  │  │  ├─ ForecastChart                                      │  │  │
│  │  │  ├─ AlertBanner                                        │  │  │
│  │  │  └─ API Service Layer                                  │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                    HTTP CORS (Axios)
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │            Express.js Backend (Port 5001)                    │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  Routes: pollution/* endpoints                          │  │  │
│  │  │  ├─ POST /pollution (add data)                         │  │  │
│  │  │  ├─ GET /pollution/:city (current data)                │  │  │
│  │  │  ├─ GET /pollution/history/:city (historical)          │  │  │
│  │  │  └─ GET /forecast/:city (forecast)                     │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  Controllers: Business Logic                            │  │  │
│  │  │  ├─ addPollutionData()                                 │  │  │
│  │  │  ├─ getPollutionByCity()                               │  │  │
│  │  │  ├─ getPollutionHistory()                              │  │  │
│  │  │  └─ getForecast()                                      │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  Services: External Integration                         │  │  │
│  │  │  └─ forecastService.js (calls ML service)              │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  Utilities: Helper Functions                            │  │  │
│  │  │  └─ aqiCalculator.js (AQI computation)                │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
         │                                              │
    JSON/REST                                      HTTP/AXIOS
         │                                              │
         ▼                                              ▼
┌─────────────────────┐              ┌──────────────────────────────┐
│   DATA LAYER        │              │   ML MICROSERVICE            │
│                     │              │                              │
│  MongoDB            │              │  Flask (Port 5000)           │
│  ┌────────────────┐ │              │  ┌──────────────────────┐   │
│  │ pollutions     │ │              │  │ ARIMA Model          │   │
│  │ collection     │ │              │  │  ├─ Forecast()       │   │
│  │                │ │              │  │  └─ Get Confidence()  │   │
│  │ indexes:       │ │              │  │                      │   │
│  │ city:1,        │ │              │  │ Statsmodels Library  │   │
│  │ timestamp:-1   │ │              │  │  ├─ pandas           │   │
│  └────────────────┘ │              │  │  ├─ numpy            │   │
│                     │              │  │  └─ arima.model      │   │
└─────────────────────┘              │  └──────────────────────┘   │
                                     └──────────────────────────────┘
```

---

## Data Flow Diagram

### Scenario: User Selects City

```
1. User selects city from dropdown
   ↓
2. Frontend: Dashboard.useEffect() triggered
   ↓
3. API Call: getPollutionByCity("delhi")
   ↓
4. Backend: GET /api/pollution/delhi
   ↓
5. Controller: pollutionController.getPollutionByCity()
   ↓
6. Model: Pollution.findOne({ city: "delhi" }).sort({ timestamp: -1 })
   ↓
7. Database: MongoDB returns latest record
   ↓
8. Utility: calculateAQI(pollutionData)
   ↓
9. Response: Send JSON to frontend with AQI
   ↓
10. Frontend: Update state and render Dashboard
    ↓
11. Components: Render PollutionChart, AlertBanner, etc.
```

### Scenario: Forecast Request

```
1. Dashboard component loads forecast data
   ↓
2. API Call: getPollutionForecast("delhi")
   ↓
3. Backend: GET /api/forecast/delhi
   ↓
4. Controller: pollutionController.getForecast()
   ↓
5. Service: getPollutionForecast("delhi")
   ↓
6. Get Historical: Pollution.find({ city: "delhi" }).sort({ timestamp: 1 })
   ↓
7. Database: Returns 30 days of PM2.5 values
   ↓
8. ML Service Call: axios.post("http://localhost:5000/predict", { values: [...] })
   ↓
9. Flask: Receives PM2.5 array
   ↓
10. ARIMA Model: Fits ARIMA (1,1,1) to historical data
    ↓
11. Forecast: Generates 7-day predictions
    ↓
12. Response: Returns forecast array to backend
    ↓
13. Backend: Formats response and sends to frontend
    ↓
14. Frontend: Renders ForecastChart with predictions
```

---

## Component Hierarchy

```
App
├── Dashboard (main orchestrator)
│   ├── CitySelector (controlled component)
│   │   └── select dropdown
│   ├── AlertBanner (conditional render)
│   │   └─ Shows when AQI > 100
│   ├── PollutionChart (bar chart)
│   │   └── Chart.js Bar component
│   ├── ForecastChart (line chart)
│   │   └── Chart.js Line component
│   └── Metrics Display
│       └── 6 metric cards (PM2.5, PM10, etc.)
```

---

## File Relationships

```
Controllers
└── pollutionController.js
    ├── Imports: Pollution model
    ├── Imports: aqiCalculator utility
    └── Imports: forecastService

Services
└── forecastService.js
    ├── Imports: Pollution model
    ├── Calls: ML microservice via axios
    └── Returns: Forecast data

Utils
└── aqiCalculator.js
    ├── Used by: pollutionController
    └── Returns: AQI and category

Models
└── Pollution.js
    ├── Uses: Mongoose schema
    └── Used by: Controllers, Services

Routes
└── pollutionRoutes.js
    ├── Maps URLs to: pollutionController
    ├── Exports to: server.js
    └── CRUD operations

Server
└── server.js
    ├── Imports: connectDB, routes
    ├── Mounts: pollutionRoutes to /api/pollution
    └── Starts: Express server on port 5001
```

---

## Request/Response Flow

### Example: GET /api/pollution/delhi

```
┌─────────────────────────────────────────────────────────┐
│ REQUEST                                                 │
│ GET http://localhost:5001/api/pollution/delhi           │
│ Headers: Accept: application/json                       │
└─────────────────────────────────────────────────────────┘

↓ Route Matching ↓

┌─────────────────────────────────────────────────────────┐
│ ROUTE HANDLER                                           │
│ router.get('/:city',                                    │
│   pollutionController.getPollutionByCity)               │
└─────────────────────────────────────────────────────────┘

↓ Request Parsing ↓

┌─────────────────────────────────────────────────────────┐
│ CONTROLLER                                              │
│ - Extract city: "delhi"                                 │
│ - Validate input                                        │
│ - Query database                                        │
└─────────────────────────────────────────────────────────┘

↓ Database Query ↓

┌─────────────────────────────────────────────────────────┐
│ MODEL/DATABASE                                          │
│ Pollution.findOne({ city: "delhi" })                    │
│ .sort({ timestamp: -1 })                                │
│ ↓                                                       │
│ MongoDB retrieves latest record                         │
└─────────────────────────────────────────────────────────┘

↓ AQI Calculation ↓

┌─────────────────────────────────────────────────────────┐
│ UTILITY                                                 │
│ calculateAQI({                                          │
│   pm25: 85.5, pm10: 120.3, no2: 42.1, o3: 35.2         │
│ })                                                      │
│ ↓                                                       │
│ Returns: { aqi: 156, category: "Unhealthy..." }         │
└─────────────────────────────────────────────────────────┘

↓ Response Assembly ↓

┌─────────────────────────────────────────────────────────┐
│ RESPONSE                                                │
│ Status: 200                                             │
│ Body: {                                                 │
│   success: true,                                        │
│   data: {                                               │
│     ...(pollution data),                                │
│     aqi: { aqi: 156, category: "...", ... }             │
│   }                                                     │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
Request arrives
    │
    ├─ Route exists?
    │  ├─ No → 404 error
    │  └─ Yes ↓
    │
    ├─ Valid parameters?
    │  ├─ No → 400 (Bad Request)
    │  └─ Yes ↓
    │
    ├─ Database query succeeds?
    │  ├─ No → 500 (Server Error)
    │  ├─ Found data? → Process
    │  └─ No data? → 404 (Not Found)
    │
    ├─ Calculation succeeds?
    │  ├─ No → 500 (Server Error)
    │  └─ Yes ↓
    │
    └─ Return 200 (Success)
```

---

## Deployment Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      CLOUD DEPLOYMENT                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────┐        ┌──────────────────┐         │
│  │ Frontend        │        │ Backend          │         │
│  │ (Vercel/AWS)    │───────→│ (Heroku/AWS)     │         │
│  │ React App       │        │ Node.js          │         │
│  │ Port: 443       │        │ Port: 443        │         │
│  └─────────────────┘        └──────────────────┘         │
│                                     │                     │
│                                     └────────────┐        │
│                                                   │        │
│  ┌─────────────────────────────────────────┐    │        │
│  │ ML Service (AWS Lambda / Container)     │    │        │
│  │ Python Flask                            │←───┘        │
│  │ Port: 443                               │             │
│  └─────────────────────────────────────────┘             │
│           │                                              │
│           └──────────────────┐                           │
│                              │                           │
│      ┌───────────────────────┴──────────────────┐        │
│      │ MongoDB Atlas (Cloud)                    │        │
│      │ Managed Database Service                 │        │
│      │ Automatic backups & scaling              │        │
│      └────────────────────────────────────────┘        │
│                                                        │
└────────────────────────────────────────────────────────────┘
```

---

## Tech Stack Summary

| Layer | Component | Technology |
|-------|-----------|------------|
| **Frontend** | UI Framework | React 18 |
| | HTTP Client | Axios |
| | Charts | Chart.js + react-chartjs-2 |
| | Styling | Inline CSS |
| **Backend** | Server | Node.js +Express |
| | Database ODM | Mongoose |
| | HTTP Client | Axios |
| | Validation | Built-in |
| **ML** | Framework | Flask |
| | Algorithm | ARIMA (statsmodels) |
| | Data Processing | Pandas + NumPy |
| **Database** | Type | MongoDB (NoSQL) |
| |Deployment | Local or Atlas (Cloud) |

---

## Key Design Patterns

1. **MVC Architecture**: Clean separation of concerns
2. **Service Layer Pattern**: Business logic in services
3. **Singleton Pattern**: Single database connection
4. **Observer Pattern**: React state updates trigger re-renders
5. **Factory Pattern**: Controller creates appropriate responses

---

## Scalability Considerations

1. **Database Indexing**: city + timestamp index for fast queries
2. **Caching**: Add Redis for frequently accessed data
3. **Pagination**: Limit returned records
4. **Load Balancing**: Multiple backend instances
5. **API Rate Limiting**: Prevent abuse
6. **Microservices**: Already separated ML service
7. **Database Sharding**: Shard by city for large datasets

---

This architecture ensures:
✅ Clean code organization
✅ Easy testing and debugging
✅ Clear separation of concerns
✅ Scalability for future growth
✅ Maintainability and extensibility
