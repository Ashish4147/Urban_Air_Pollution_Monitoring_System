# SYSTEM STATUS INSTRUCTIONS

## URBAN AIR POLLUTION MONITORING SYSTEM - STARTUP

Your full-stack application has been deployed and is ready to run!

---

## ✅ WHAT'S BEEN CREATED:

### Backend (Node.js + Express + MongoDB)
- Location: `urban-backend/`
- Port: **5001**
- Status: Running
- Health Check: `http://localhost:5001/api/health`

### ML Microservice (Python Flask + ARIMA)
- Location: `urban-ml/`
- Port: **5000**
- Status: Starting
- Health Check: `http://localhost:5000/health`

### Frontend (React)
- Location: `urban-frontend/`
- Port: **3000**
- Status: Starting
- URL: `http://localhost:3000`

---

## 🔧 IMPORTANT: SETUP MONGODB

Before the system can work fully, you need MongoDB running:

### Option 1: Local MongoDB
```powershell
# Download: https://www.mongodb.com/try/download/community
# Install it, then run:
mongod
```

### Option 2: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create database cluster
4. Get connection string
5. Update `urban-backend\.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/urban-pollution
   ```

---

## 🚀 RUNNING YOUR SYSTEM

### Quick Start (All in one command):
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force 
& "c:\Users\saiki\Desktop\fullstack_project\start-all.ps1"
```

This launches three new PowerShell windows:
1. **Backend** - http://localhost:5001
2. **ML Service** - http://localhost:5000  
3. **Frontend** - http://localhost:3000

### Manual Start (In 3 separate terminals):

**Terminal 1 - Backend:**
```powershell
cd c:\Users\saiki\Desktop\fullstack_project\urban-backend
npm start
```

**Terminal 2 - ML Service:**
```powershell
cd c:\Users\saiki\Desktop\fullstack_project\urban-ml
python app.py
```

**Terminal 3 - Frontend:**
```powershell
cd c:\Users\saiki\Desktop\fullstack_project\urban-frontend
npm start
```

---

## 📊 ACCESSING THE APPLICATION

Once all services are running:

1. **Frontend Dashboard**: http://localhost:3000
   - Select a city from dropdown
   - View real-time pollution data
   - See 7-day forecast
   - Check AQI alerts

2. **Backend APIs**: http://localhost:5001/api
   - Health Check: `/api/health`
   - Add Data: `POST /api/pollution`
   - Get Data: `GET /api/pollution/:city`
   - Get Forecast: `GET /api/forecast/:city`

3. **ML Service**: http://localhost:5000
   - Health Check: `/health`
   - Forecast Endpoint: `POST /predict`

---

## 🧪 TESTING WITH SAMPLE DATA

### Using Postman:
1. Import the requests from `POSTMAN_GUIDE.md`
2. Add sample pollution data
3. Fetch and forecast

### Using curl:
```powershell
# Add data
Invoke-WebRequest -Uri "http://localhost:5001/api/pollution" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{
    "city": "delhi",
    "pm25": 85.5,
    "pm10": 120.3,
    "no2": 42.1,
    "so2": 15.7,
    "co": 0.8,
    "o3": 35.2
  }'

# Get data
Invoke-WebRequest "http://localhost:5001/api/pollution/delhi"

# Get forecast
Invoke-WebRequest "http://localhost:5001/api/forecast/delhi"
```

---

## 📚 DOCUMENTATION FILES

- **README.md** - Complete project overview & API docs
- **SETUP.md** - Detailed installation guide
- **POSTMAN_GUIDE.md** - API testing with Postman
- **SAMPLE_DATA.md** - Test data & MongoDB documents
- **ARCHITECTURE.md** - System design & data flow

---

## 🐛 TROUBLESHOOTING

### Backend Won't Start
```
Error: listen EADDRINUSE :::5001
Solution: Port 5001 is in use. Kill the process:
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

### MongoDB Connection Error
```
Error: MongoDB connection failed
Solution: Start MongoDB or use MongoDB Atlas
Update MONGODB_URI in urban-backend\.env
```

### Frontend Won't Load
```
Error: Cannot reach backend
Solution: 
1. Verify backend is running on 5001
2. Check REACT_APP_API_URL in urban-frontend\.env
3. Clear browser cache
```

### ML Service Issues
```
Error: Python modules not found
Solution:
cd urban-ml
python -m pip install -r requirements.txt
```

---

## ✨ FEATURES

✅ Real-time pollution monitoring
✅ Automatic AQI calculation (6 categories)
✅ AI-powered 7-day forecasting
✅ Interactive charts & dashboards
✅ Multi-city support
✅ Smart alerts (AQI > 100)
✅ Historical data tracking
✅ RESTful APIs
✅ Production-ready code

---

## 🎯 NEXT STEPS

1. **Setup MongoDB** (choose Local or Atlas)
2. **Start Backend**: `npm start` in urban-backend
3. **Start ML Service**: `python app.py` in urban-ml
4. **Start Frontend**: `npm start` in urban-frontend
5. **Open Browser**: http://localhost:3000
6. **Add Test Data**: Use Postman guide or curl commands
7. **Monitor**: Select cities and view air quality data

---

## 📞 QUICK REFERENCE

| Service | Port | URL | Status Check |
|---------|------|-----|--------------|
| Backend | 5001 | http://localhost:5001 | /api/health |
| ML | 5000 | http://localhost:5000 | /health |
| Frontend | 3000 | http://localhost:3000 | Browser |

---

## 🎉 YOU'RE ALL SET!

Your complete full-stack Urban Air Pollution Monitoring & Forecasting System is ready to go!

Start the services and visit http://localhost:3000 to see it in action! 🚀
