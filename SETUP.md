# SETUP AND INSTALLATION GUIDE

## Prerequisites

Before starting, ensure you have:
- Node.js v14+ installed ([Download](https://nodejs.org/))
- Python 3.8+ installed ([Download](https://www.python.org/))
- MongoDB installed locally or Atlas account ([Get MongoDB](https://www.mongodb.com/))
- Git installed ([Download](https://git-scm.com/))

---

## Step-by-Step Installation

### 1. Backend Setup (Node.js + Express)

```bash
# Navigate to backend directory
cd urban-backend

# Install dependencies
npm install

# Create .env file (already provided, verify settings)
# Edit .env file and ensure MongoDB connection string is correct:
# MONGODB_URI=mongodb://localhost:27017/urban-pollution
# ML_SERVICE_URL=http://localhost:5000

# Verify installation
npm list

# Start backend server
npm start
```

**Expected Output:**
```
✓ MongoDB connected successfully
✓ Backend server running on http://localhost:5001
```

---

### 2. ML Microservice Setup (Python + Flask)

```bash
# Navigate to ML directory
cd urban-ml

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows CMD:
venv\Scripts\activate
# On Windows PowerShell:
venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# You should see (venv) prefix in terminal

# Upgrade pip
python -m pip install --upgrade pip

# Install Python dependencies
pip install -r requirements.txt

# Verify installation
pip list

# Start ML service
python app.py
```

**Expected Output:**
```
✓ Starting ML Microservice...
✓ Running on http://0.0.0.0:5000
```

---

### 3. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd urban-frontend

# Install dependencies
npm install

# Verify environment variables in .env
# REACT_APP_API_URL=http://localhost:5001/api

# Start React development server
npm start
```

**Expected Output:**
```
Compiled successfully!
Local: http://localhost:3000
```

Browser will open at `http://localhost:3000` automatically.

---

## Verification Checklist

### ✅ Check Backend Health

```bash
# Open new terminal and run:
curl http://localhost:5001/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Backend server is running",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### ✅ Check ML Service Health

```bash
# Open new terminal and run:
curl http://localhost:5000/health
```

Should return:
```json
{
  "success": true,
  "message": "ML Microservice is running",
  "service": "ARIMA PM2.5 Forecasting"
}
```

### ✅ Check Frontend

Open http://localhost:3000 in your browser. You should see the Urban Air Pollution Monitor dashboard.

---

## Testing the System

### 1. Add Sample Pollution Data

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

### 2. Fetch Data

```bash
# Get latest pollution data
curl http://localhost:5001/api/pollution/delhi

# Get historical data (last 7 days)
curl http://localhost:5001/api/pollution/history/delhi?days=7

# Get forecast
curl http://localhost:5001/api/forecast/delhi
```

### 3. Use Frontend Dashboard

1. Go to http://localhost:3000
2. Select a city from dropdown
3. View real-time pollution data
4. See 7-day forecast
5. Check AQI alerts

---

## Troubleshooting

### Problem: MongoDB Connection Error

**Error:**
```
✗ MongoDB connection failed: connect ECONNREFUSED
```

**Solutions:**
- Start MongoDB service:
  ```bash
  # On Windows:
  mongod
  # On macOS (if installed via Homebrew):
  brew services start mongodb-community
  # On Linux:
  sudo systemctl start mongod
  ```
- Or use MongoDB Atlas (cloud):
  - Update `MONGODB_URI` in `.env`:
    ```
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/urban-pollution
    ```

---

### Problem: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE :::5001
```

**Solutions:**
```bash
# Windows - Find and kill process using port 5001
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5001
kill -9 <PID>
```

---

### Problem: Module Not Found

**Error:**
```
Cannot find module 'express'
```

**Solutions:**
```bash
# Backend
cd urban-backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd urban-frontend
rm -rf node_modules package-lock.json
npm install
```

---

### Problem: Python Virtual Environment Not Activating

**Solutions:**
```bash
# Ensure pip and venv are installed
python -m pip install --upgrade pip
python -m venv venv

# Verify activation with:
python --version  # Should show correct Python version
pip list          # Should show venv packages
```

---

### Problem: Flask Not Starting

**Error:**
```
ModuleNotFoundError: No module named 'flask'
```

**Solutions:**
```bash
# Make sure virtual environment is activated (should see (venv) prefix)
source venv/bin/activate  # or venv\Scripts\activate for Windows

# Reinstall requirements
pip install -r requirements.txt

# Verify installations
pip list
```

---

## Development Workflow

### Terminal 1: Backend
```bash
cd urban-backend
npm run dev  # Auto-reload on changes
```

### Terminal 2: ML Service
```bash
cd urban-ml
source venv/bin/activate  # or venv\Scripts\activate
python app.py
```

### Terminal 3: Frontend
```bash
cd urban-frontend
npm start
```

All three services should run simultaneously on their respective ports.

---

## Database Setup

### Using Local MongoDB

1. **Start MongoDB:**
   ```bash
   mongod
   ```

2. **Verify Connection:**
   ```bash
   mongosh
   # or older versions:
   mongo
   ```

3. **Check Database:**
   ```javascript
   use admin
   db.version()  // Shows MongoDB version
   ```

### Using MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string
4. Update `.env` in backend:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/urban-pollution
   ```

---

## Environment Configuration

### Backend (.env)
```
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/urban-pollution
# For Atlas: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database

# ML Service
ML_SERVICE_URL=http://localhost:5000

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
# API Configuration
REACT_APP_API_URL=http://localhost:5001/api
```

---

## Building for Production

### Backend
```bash
cd urban-backend
npm install --production
# Deploy on Node.js server
```

### ML Service
```bash
cd urban-ml
pip install -r requirements.txt
# Deploy with Gunicorn or Docker
```

### Frontend
```bash
cd urban-frontend
npm run build
# Deploy build/ directory to web server
```

---

## Common CORS Issues

If frontend can't connect to backend:

1. **Check CORS headers** in backend:
   ```bash
   # Should see Access-Control-Allow-Origin header
   curl -i http://localhost:5001/api/pollution/delhi
   ```

2. **Update .env** in backend:
   ```
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Clear browser cache:**
   - DevTools → Application → Cache Storage → Clear

---

## Performance Tips

1. **Add database indexes:**
   ```javascript
   db.pollutions.createIndex({ city: 1, timestamp: -1 })
   ```

2. **Increase Node memory:**
   ```bash
   NODE_OPTIONS=--max-old-space-size=4096 npm start
   ```

3. **Use clustering for multiple cores:**
   - Implement PM2 or Node cluster module

4. **Cache responses:**
   - Add Redis layer between frontend and backend

---

## Next Steps

1. ✅ Install all services
2. ✅ Verify all running (health checks)
3. ✅ Add sample pollution data
4. ✅ Test through frontend dashboard
5. 📅 Consider deploying to cloud (AWS, Heroku, Vercel)
6. 🔐 Add authentication and authorization
7. 📊 Scale with more cities and data

---

## Support & Debugging

### Enable Debug Logging

**Backend:**
```bash
DEBUG=* npm start
```

**Frontend:**
```bash
# React DevTools:
# Chrome/Firefox: Install React DevTools extension
# Check console and network tabs for errors
```

### Check Logs

```bash
# Backend logs (terminal where npm start runs)
# ML logs (terminal where python app.py runs)
# Frontend logs (browser DevTools Console)
```

---

## Success Indicators

✅ Backend running on http://localhost:5001
✅ ML Service running on http://localhost:5000
✅ Frontend running on http://localhost:3000
✅ All services connected and passing health checks
✅ Dashboard loads without CORS errors
✅ Can select city and view pollution data
✅ Forecast appears after selecting city
✅ AQI alerts show when AQI > 100
✅ Charts render correctly
✅ No errors in browser console

---

And you're done! 🎉 Your complete full-stack Urban Air Pollution Monitoring System is ready to use!
