# AI-Driven Web-Based Urban Air Pollution Monitoring and Forecasting System

## 🌍 Project Overview

A comprehensive full-stack web application for real-time urban air quality monitoring and AI-powered pollution forecasting. The system provides interactive dashboards, advanced analytics, and predictive modeling using modern web technologies.

### Key Features

- **📊 Real-time Dashboard**: Modern UI with current pollution levels and AQI
- **📈 Advanced Analytics**: Average analysis, peak hours, and city comparisons
- **🔮 AI Forecasting**: 7-day pollution predictions using ARIMA models
- **🚨 Smart Alerts**: Automatic notifications when thresholds are exceeded
- **📁 Data Upload**: CSV dataset import with validation
- **🎨 Modern UI**: Responsive design with Tailwind CSS and Chart.js

## 🏗️ Architecture

```
urban-air-pollution-system/
├── backend/                    # Node.js Express API
│   ├── controllers/           # Business logic
│   ├── routes/               # API endpoints
│   ├── models/               # MongoDB schemas
│   ├── services/             # ML communication
│   ├── utils/                # AQI calculator
│   └── server.js             # Express app
├── frontend/                  # React application
│   ├── components/           # Reusable UI components
│   ├── views/               # Page components
│   ├── services/            # API client
│   └── App.js               # Main app
└── ml-service/               # Python Flask microservice
    ├── app.py               # Flask API
    ├── model.py             # ARIMA forecasting
    └── requirements.txt     # Python dependencies
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14+)
- **Python** (v3.8+)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Step 1: Setup Backend

```bash
cd urban-backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/urban-pollution
ML_SERVICE_URL=http://localhost:5000
PORT=5001
NODE_ENV=development
```

Start backend:
```bash
npm run dev  # Development with auto-reload
# or
npm start    # Production
```

### Step 2: Setup ML Microservice

```bash
cd urban-ml
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python app.py
```

### Step 3: Setup Frontend

```bash
cd urban-frontend
npm install
npm start
```

### Step 4: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **ML Service**: http://localhost:5000

## 📊 API Documentation

### Backend Endpoints

#### Data Management
- `POST /api/pollution/upload` - Upload CSV dataset
- `GET /api/pollution/cities` - Get available cities

#### Analytics
- `GET /api/pollution/:city` - Current pollution data
- `GET /api/pollution/average/:city/:pollutant` - Daily averages
- `GET /api/pollution/peakhours/:city/:pollutant` - Hourly patterns
- `GET /api/pollution/compare/:pollutant` - City comparisons
- `GET /api/pollution/forecast/:city/:pollutant` - AI forecasts
- `GET /api/pollution/alerts` - Pollution alerts

### ML Service
- `POST /predict` - Generate forecasts from historical data

## 🎯 Usage Guide

### 1. Upload Dataset
- Use the sample CSV file: `sample_pollution_data.csv`
- Required columns: sensor_id, city, latitude, longitude, timestamp, co2, co, pm25, pm10, no2, so2, o3

### 2. Dashboard Navigation
- **Dashboard**: Overview with current data
- **Average Pollutant**: Daily average analysis
- **Peak Hours**: Hourly pollution patterns
- **Compare Cities**: Cross-city comparisons
- **Forecast**: AI-powered predictions
- **Alerts**: Threshold violation notifications

### 3. Interactive Features
- Select cities and pollutants from dropdowns
- View real-time charts and analytics
- Monitor forecast predictions
- Receive automatic alerts

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/urban-pollution
ML_SERVICE_URL=http://localhost:5000
PORT=5001
NODE_ENV=development
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5001/api
```

## 📋 Dataset Format

CSV columns (all required):
- `sensor_id`: Unique sensor identifier
- `city`: City name (lowercase)
- `latitude`: GPS latitude
- `longitude`: GPS longitude
- `timestamp`: ISO datetime string
- `co2`: CO₂ concentration (ppm)
- `co`: CO concentration (ppm)
- `pm25`: PM2.5 (µg/m³)
- `pm10`: PM10 (µg/m³)
- `no2`: NO₂ (ppb)
- `so2`: SO₂ (ppb)
- `o3`: O₃ (ppb)

## 🚨 Alert Thresholds

- **PM2.5**: > 100 µg/m³
- **PM10**: > 150 µg/m³
- **CO**: > 9 ppm
- **NO₂**: > 80 ppb
- **SO₂**: > 80 ppb
- **O₃**: > 120 ppb

## 🧪 Testing

### Sample Data
Upload `sample_pollution_data.csv` to test all features.

### API Testing
```bash
# Health checks
curl http://localhost:5001/api/health
curl http://localhost:5000/health

# Get cities
curl http://localhost:5001/api/pollution/cities

# Get current data
curl http://localhost:5001/api/pollution/delhi

# Get forecast
curl http://localhost:5001/api/pollution/forecast/delhi/pm25
```

## 🛠️ Development

### Adding New Features
1. Update backend routes and controllers
2. Add frontend components in `views/`
3. Update API service functions
4. Test with sample data

### Code Style
- Backend: ESLint configuration
- Frontend: React best practices
- ML Service: PEP 8 compliance

## 📈 Performance

- **Real-time Updates**: 5-minute refresh intervals
- **Data Processing**: Optimized MongoDB queries
- **Forecasting**: ARIMA model with 7-day predictions
- **UI Responsiveness**: Tailwind CSS for mobile-first design

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests and documentation
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- ARIMA implementation using Statsmodels
- Chart visualization with Chart.js
- UI design with Tailwind CSS
- MongoDB for data persistence

---

## 📁 Project Structure

```
fullstack_project/
├── urban-backend/           # Node.js Express API
│   ├── config/db.js         # MongoDB connection
│   ├── models/Pollution.js  # Mongoose schema
│   ├── controllers/         # Business logic
│   ├── routes/              # API endpoints
│   ├── services/            # ML communication
│   ├── utils/               # AQI calculator
│   ├── server.js            # Express app
│   ├── package.json         # Dependencies
│   └── .env                 # Configuration
│
├── urban-ml/                # Python Flask microservice
│   ├── app.py               # Flask API
│   ├── model.py             # ARIMA model
│   └── requirements.txt     # Python packages
│
└── urban-frontend/          # React app
    ├── public/              # Static files
    ├── src/
    │   ├── components/      # React components
    │   ├── services/        # API client
    │   ├── App.js           # Main app
    │   └── index.js         # Entry point
    ├── package.json         # Dependencies
    └── .env                 # Configuration
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** (v14+)
- **Python** (v3.8+)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Step 1: Setup Backend

```bash
# Navigate to backend directory
cd urban-backend

# Install dependencies
npm install

# Create/update .env file with your MongoDB URI
# Edit .env and set:
# MONGODB_URI=mongodb://localhost:27017/urban-pollution
# ML_SERVICE_URL=http://localhost:5000

# Start backend server
npm start
# or for development with auto-reload:
npm run dev
```

Backend runs on: **http://localhost:5001**

### Step 2: Setup ML Microservice

```bash
# Navigate to ML directory
cd urban-ml

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

ML Service runs on: **http://localhost:5000**

### Step 3: Setup Frontend

```bash
# Navigate to frontend directory
cd urban-frontend

# Install dependencies
npm install

# Start React development server
npm start
```

Frontend runs on: **http://localhost:3000**

---

## ✅ Verify Installation

Check that all three services are running:

1. **Backend Health**: `curl http://localhost:5001/api/health`
   ```json
   {
     "success": true,
     "message": "Backend server is running",
     "timestamp": "2024-01-15T10:30:00Z"
   }
   ```

2. **ML Service Health**: `curl http://localhost:5000/health`
   ```json
   {
     "success": true,
     "message": "ML Microservice is running",
     "service": "ARIMA PM2.5 Forecasting"
   }
   ```

3. **Frontend**: Open http://localhost:3000 in browser

---

## 📊 API Documentation

### Backend REST Endpoints

#### 1. Add Pollution Data
```http
POST /api/pollution
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

**Response:**
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

#### 2. Get Latest Pollution Data
```http
GET /api/pollution/{city}
```

Example: `GET /api/pollution/delhi`

**Response:**
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
      "severity": "medium"
    }
  }
}
```

#### 3. Get Historical Data
```http
GET /api/pollution/history/{city}?days=30
```

Returns array of pollution records for the last N days.

#### 4. Get PM2.5 Forecast
```http
GET /api/forecast/{city}
```

Example: `GET /api/forecast/delhi`

**Response:**
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

### ML Microservice Endpoints

#### Forecast Endpoint
```http
POST /predict
Content-Type: application/json

{
  "values": [45.2, 52.1, 48.5, 55.3, 60.1, 58.9, 62.3, 65.1]
}
```

**Query Parameters:**
- `days` (1-30): Number of days to forecast (default: 7)
- `ci` (true/false): Include confidence intervals (default: false)

**Response:**
```json
{
  "success": true,
  "forecast": [67.2, 68.5, 66.3, 65.1, 67.8, 69.2, 66.5],
  "forecast_length": 7
}
```

---

## 📋 Sample Data for Testing

### Example Pollution Record

```json
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

### MongoDB Document Sample

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "city": "delhi",
  "timestamp": ISODate("2024-01-15T10:30:00.000Z"),
  "pm25": 85.5,
  "pm10": 120.3,
  "no2": 42.1,
  "so2": 15.7,
  "co": 0.8,
  "o3": 35.2,
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

---

## 🧪 Postman Testing Guide

### Create Postman Collection

1. **Import or Create Collection**: "Urban Pollution API"

2. **Add Environment Variables:**
   - `backend_url`: http://localhost:5001
   - `city`: delhi
   - `ml_url`: http://localhost:5000

3. **Test Requests:**

#### Request 1: Health Check
```
GET {{backend_url}}/api/health
```

#### Request 2: Add Pollution Data
```
POST {{backend_url}}/api/pollution
Content-Type: application/json

{
  "city": "delhi",
  "pm25": {{$randomInt(30, 150)}},
  "pm10": {{$randomInt(50, 200)}},
  "no2": {{$randomInt(20, 80)}},
  "so2": {{$randomInt(5, 50)}},
  "co": {{$randomInt(0, 3)}},
  "o3": {{$randomInt(20, 100)}}
}
```

#### Request 3: Get Current Data
```
GET {{backend_url}}/api/pollution/{{city}}
```

#### Request 4: Get Historical Data
```
GET {{backend_url}}/api/pollution/history/{{city}}?days=7
```

#### Request 5: Get Forecast
```
GET {{backend_url}}/api/forecast/{{city}}
```

#### Request 6: ML Forecast
```
POST {{ml_url}}/predict
Content-Type: application/json

{
  "values": [45.2, 52.1, 48.5, 55.3, 60.1, 58.9, 62.3, 65.1, 68.2, 70.1]
}
```

### Testing Scripts

**Pre-request Script (Add Random Data):**
```javascript
// Generate sample data
const cities = ['delhi', 'mumbai', 'bangalore'];
pm.environment.set("city", cities[Math.floor(Math.random() * cities.length)]);
```

**Tests Script (Verify Response):**
```javascript
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Response has success property", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.equal(true);
});

pm.test("Response has required data", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an('object');
});
```

---

## 🔧 Configuration Files

### Backend (.env)
```
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/urban-pollution
ML_SERVICE_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5001/api
```

### Database Connection String

**Local MongoDB:**
```
mongodb://localhost:27017/urban-pollution
```

**MongoDB Atlas (Cloud):**
```
mongodb+srv://username:password@cluster0.mongodb.net/urban-pollution?retryWrites=true&w=majority
```

---

## 📈 AQI Categories

| AQI Range | Category | Color | Severity |
|-----------|----------|-------|----------|
| 0-50 | Good | 🟢 | Low |
| 51-100 | Moderate | 🟡 | Moderate |
| 101-150 | Unhealthy for Sensitive Groups | 🟠 | Medium |
| 151-200 | Unhealthy | 🔴 | High |
| 201-300 | Very Unhealthy | 🟣 | Very High |
| 301+ | Hazardous | ⚫ | Hazardous |

---

## 🐛 Troubleshooting

### Backend Won't Connect to MongoDB
- **Check**: MongoDB service is running
- **Fix**: Update `MONGODB_URI` in `.env` file
- **Test**: `mongosh` (or `mongo` in older versions)

### ML Service Not Responding
- **Check**: Flask server is running on port 5000
- **Fix**: Install dependencies: `pip install -r requirements.txt`
- **Test**: `curl http://localhost:5000/health`

### Frontend Can't Reach Backend
- **Check**: Backend is running on port 5001
- **Fix**: Update `REACT_APP_API_URL` in `.env`
- **Clear**: Browser cache and refresh

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5001
kill -9 <PID>
```

---

## 📚 Technology Stack Details

### Backend
- **Express.js**: Web framework
- **Mongoose**: MongoDB ODM
- **Axios**: HTTP client for ML service
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variables

### ML Service
- **Flask**: Lightweight web framework
- **Statsmodels**: ARIMA time-series model
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing

### Frontend
- **React**: UI library
- **Axios**: API client
- **Chart.js**: Data visualization
- **React-ChartJS-2**: React wrapper for Chart.js

---

## 🎯 Features

✅ Real-time pollution data collection
✅ Automatic AQI calculation
✅ 7-day AI-powered forecasting
✅ Interactive charts and visualizations
✅ Air quality alerts
✅ Historical trend analysis
✅ Multi-city support
✅ Responsive design
✅ Production-ready architecture

---

## 📞 Support

For issues or questions:
1. Check error messages in browser console
2. Check backend logs in terminal
3. Verify all services are running
4. Check environment configurations

---

## 📄 License

MIT License - Feel free to use and modify this project.
