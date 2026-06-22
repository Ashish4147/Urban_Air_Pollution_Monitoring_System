# Urban Air Pollution System - Startup Script
# Starts all three services: Backend, ML Service, Frontend

Write-Host "=== Urban Air Pollution Monitoring System ===" -ForegroundColor Cyan
Write-Host "Starting all services in new windows..." -ForegroundColor Yellow

Start-Sleep -Seconds 1

# Start Backend Server
Write-Host "`n[1/3] Starting Backend (Port 5001)..." -ForegroundColor Green
Start-Process PowerShell -NoNewWindow -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\saiki\Desktop\fullstack_project\urban-backend'; npm start"

Start-Sleep -Seconds 3

# Start ML Service
Write-Host "[2/3] Starting ML Service (Port 5000)..." -ForegroundColor Green
Start-Process PowerShell -NoNewWindow -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\saiki\Desktop\fullstack_project\urban-ml'; python app.py"

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "[3/3] Starting Frontend (Port 3000)..." -ForegroundColor Green
Start-Process PowerShell -NoNewWindow -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\saiki\Desktop\fullstack_project\urban-frontend'; npm start"

Write-Host "`n" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  All Services Started!" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Backend:     http://localhost:5001/api/health" -ForegroundColor Yellow
Write-Host "  ML Service:  http://localhost:5000/health" -ForegroundColor Yellow
Write-Host "  Frontend:    http://localhost:3000" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
