# Quick Start: Upload Dataset Feature

## 🚀 Get Started in 5 Minutes

### Step 1: Install Backend Dependency

The `multer` package has already been added to `package.json`. Install it:

```bash
cd urban-backend
npm install
```

### Step 2: Start the Backend (Without MongoDB)

```bash
cd urban-backend
node server.js
```

You should see:
```
✓ Backend server running on http://localhost:5001
✓ Environment: development
```

### Step 3: Start the Frontend

In a new terminal:

```bash
cd urban-frontend
npm install  # if not already installed
npm start
```

The app will open at `http://localhost:3000`

### Step 4: Upload Your Data

1. **Scroll down** to the **"📁 Upload Pollution Dataset"** section
2. **Click the file input** or **drag & drop** your JSON file
3. **Click "📤 Upload Dataset"**
4. **Wait for success message**

### Step 5: View Your Data

1. **Select a city** from the dropdown (from your uploaded file)
2. **View charts and metrics** - they'll use your uploaded data
3. **Success!** 🎉

---

## 📄 Sample Data File

Use the pre-made sample data file:

```
urban-backend/data/sample_pollution.json
```

Or create your own:

```json
[
  {
    "city": "Delhi",
    "pm25": 85.5,
    "pm10": 120.3,
    "no2": 42.1,
    "so2": 15.7,
    "co": 0.8,
    "o3": 35.2
  },
  {
    "city": "Mumbai",
    "pm25": 62.3,
    "pm10": 95.1,
    "no2": 35.2,
    "so2": 12.1,
    "co": 0.6,
    "o3": 38.5
  }
]
```

---

## ✨ Key Features

✅ **No MongoDB needed** - Works offline  
✅ **Instant upload** - File processed in memory  
✅ **View history** - See all your uploads  
✅ **Auto-integration** - Charts use uploaded data automatically  
✅ **Validation** - Checks data format automatically  

---

## 🔧 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/pollution/upload` | Upload JSON file |
| GET | `/api/pollution/upload/history` | View upload history |
| GET | `/api/pollution/data/sources` | Check available data |
| GET | `/api/pollution/:city` | Get city data (queries uploaded first) |
| GET | `/api/pollution/history/:city` | Get historical data |

---

## ❌ Troubleshooting

### Upload button disabled
- ✓ Select a JSON file first

### "Invalid JSON format" error
- ✓ Use a JSON validator (jsonlint.com)
- ✓ Ensure root element is an array `[...]`

### No data appears after upload
- ✓ Check upload success message
- ✓ Verify city name case matches
- ✓ Check Upload History section

### Server won't start
- ✓ Check port 5001 is available
- ✓ Ensure Node.js is installed
- ✓ Run from `urban-backend` folder

---

## 📋 Requirements

- **Node.js** v14+
- **npm** or **yarn**
- **JSON file** with pollution data

---

## 🎯 Next Steps

1. ✅ Upload sample data
2. ✅ Select a city and view charts
3. ✅ Try uploading your own data
4. ✅ Read [UPLOAD_FEATURE.md](UPLOAD_FEATURE.md) for advanced usage

---

**Need help?** Check the full documentation in [UPLOAD_FEATURE.md](UPLOAD_FEATURE.md)
