# Upload Feature - Setup Verification Checklist

Use this checklist to verify the Upload Dataset feature is properly installed and working.

## ✅ Backend Setup

- [ ] Node.js v14+ installed
  ```bash
  node --version
  ```

- [ ] Dependencies installed
  ```bash
  cd urban-backend
  npm install
  ```
  Look for: ✓ `multer` in node_modules

- [ ] `utils/dataStore.js` exists
  ```bash
  ls urban-backend/utils/dataStore.js
  ```

- [ ] `package.json` includes multer
  ```bash
  grep "multer" urban-backend/package.json
  ```
  Should show: `"multer": "^1.4.5-lts.1"`

- [ ] Backend can start
  ```bash
  cd urban-backend
  node server.js
  ```
  Should show:
  ```
  ✓ Backend server running on http://localhost:5001
  ```

- [ ] Upload endpoint accessible
  ```bash
  curl http://localhost:5001/api/pollution/data/sources
  ```
  Should return JSON with data sources info

---

## ✅ Frontend Setup

- [ ] Frontend dependencies installed
  ```bash
  cd urban-frontend
  npm install
  ```

- [ ] `UploadDataset.js` component exists
  ```bash
  ls urban-frontend/src/components/UploadDataset.js
  ```

- [ ] Dashboard imports UploadDataset
  ```bash
  grep "import.*UploadDataset" urban-frontend/src/components/Dashboard.js
  ```

- [ ] API service has upload functions
  ```bash
  grep "uploadDataset" urban-frontend/src/services/api.js
  ```
  Should show:
  - `uploadDataset(formData)`
  - `getUploadHistory()`
  - `getDataSources()`

- [ ] Frontend starts
  ```bash
  cd urban-frontend
  npm start
  ```
  Should open browser at `http://localhost:3000`

---

## ✅ Feature Verification

- [ ] Upload section visible
  - Open `http://localhost:3000`
  - Scroll down
  - See "📁 Upload Pollution Dataset" section

- [ ] File input works
  - Click file input area
  - Select a JSON file
  - File name appears in UI

- [ ] Upload succeeds with sample data
  - Use `urban-backend/data/sample_pollution.json`
  - Click upload
  - See success message: "Successfully uploaded X records"

- [ ] Upload history visible
  - Click "▶ Show Upload History"
  - See uploaded file listed
  - Shows file name, record count, cities

- [ ] Data accessible
  - Select a city from dropdown (from uploaded data)
  - See pollution data displayed
  - Charts and metrics appear

- [ ] Validation works
  - Try uploading non-JSON file
  - See error message
  - Try uploading invalid JSON
  - See error message

---

## 🔍 API Testing

### Test with curl

**1. Health Check:**
```bash
curl http://localhost:5001/api/health
```
Expected: `{"success":true,"message":"Backend server is running"...}`

**2. Check Data Sources:**
```bash
curl http://localhost:5001/api/pollution/data/sources
```
Expected: JSON with `uploadedData: true` (after upload)

**3. Get Upload History:**
```bash
curl http://localhost:5001/api/pollution/upload/history
```
Expected: JSON with uploads array

**4. Upload File (using curl):**
```bash
curl -X POST \
  -F "file=@urban-backend/data/sample_pollution.json" \
  http://localhost:5001/api/pollution/upload
```
Expected: Success response with upload ID and record count

---

## 📋 Data File Verification

- [ ] Sample data file exists
  ```bash
  ls urban-backend/data/sample_pollution.json
  ```

- [ ] Sample data is valid JSON
  ```bash
  node -e "console.log(JSON.parse(require('fs').readFileSync('urban-backend/data/sample_pollution.json', 'utf8')))"
  ```
  Should parse without errors

- [ ] All required fields present
  Sample record should have:
  - city ✓
  - pm25 ✓
  - pm10 ✓
  - no2 ✓
  - so2 ✓
  - co ✓
  - o3 ✓

---

## 🚨 Troubleshooting

### Backend won't start
- [ ] Port 5001 is available: `netstat -an | grep 5001`
- [ ] Node.js is installed: `node --version`
- [ ] Dependencies installed: Check `node_modules/multer`
- [ ] Correct directory: Run from `urban-backend` folder

### Upload endpoint not found
- [ ] Backend server running on 5001
- [ ] Routes defined correctly in `routes/pollutionRoutes.js`
- [ ] Check route order (specific routes before `:city`)
- [ ] Restart backend after changes

### Frontend can't connect
- [ ] Backend running on 5001
- [ ] Frontend running on 3000
- [ ] Check `REACT_APP_API_URL` in `.env` or defaults to localhost:5001
- [ ] Check browser console for CORS errors

### Upload fails with "Invalid JSON"
- [ ] Validate JSON at jsonlint.com
- [ ] Ensure root element is array `[...]`
- [ ] Check all records have required fields
- [ ] File not corrupted (try opening in text editor)

### No data appears after upload
- [ ] Check upload success message
- [ ] Verify city name in data matches dropdown
- [ ] Check Upload History to confirm upload
- [ ] Try different city name
- [ ] Check browser console for errors

### Charts don't update
- [ ] Backend data endpoint returning data (test with curl)
- [ ] City selected matches uploaded data
- [ ] Check browser console for errors
- [ ] Try refreshing page

---

## 📊 Performance Checks

- [ ] Upload speed reasonable (< 5 seconds for 1000 records)
- [ ] UI responsive during upload
- [ ] No memory leaks (check with DevTools)
- [ ] Charts render quickly after data loads

---

## 📝 Documentation Verification

Verify documentation files exist:

- [ ] `UPLOAD_FEATURE.md` - Complete feature guide
- [ ] `QUICK_START_UPLOAD.md` - Quick start guide
- [ ] `IMPLEMENTATION_SUMMARY.md` - Technical summary

---

## ✅ Final Sign-Off

- [ ] Backend working ✓
- [ ] Frontend working ✓
- [ ] Upload functional ✓
- [ ] Data queryable ✓
- [ ] Charts updating ✓
- [ ] All docs present ✓

**Status:** Ready for Production ✅

---

## 🆘 Getting Help

1. Check documentation files first
2. Review error messages carefully
3. Check browser console (F12)
4. Check server logs
5. Try sample data file
6. Verify all files created/modified
7. Ensure dependencies installed

---

## 📞 Support Resources

- **Documentation:** See UPLOAD_FEATURE.md
- **Quick Start:** See QUICK_START_UPLOAD.md
- **Implementation:** See IMPLEMENTATION_SUMMARY.md
- **Sample Data:** `urban-backend/data/sample_pollution.json`

---

**Last Updated:** March 4, 2024  
**Version:** 1.0.0
