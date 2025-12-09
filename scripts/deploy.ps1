# PowerShell deployment script for Faisal Center Management System

Write-Host "🚀 Starting deployment process..." -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm run install-all

# Generate secrets if .env doesn't exist
if (-not (Test-Path "backend\.env")) {
    Write-Host "`n🔐 Generating secrets..." -ForegroundColor Yellow
    Set-Location backend
    node scripts/generate-secrets.js
    Set-Location ..
    Write-Host "⚠️  Please update backend\.env with your MongoDB URI and other settings" -ForegroundColor Yellow
}

# Build frontend
Write-Host "`n🏗️  Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
Set-Location ..

# Check if build was successful
if (-not (Test-Path "frontend\build")) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Frontend build completed" -ForegroundColor Green

# Production build check
Write-Host "`n📋 Production readiness check..." -ForegroundColor Yellow

# Check environment variables
if (-not (Test-Path "backend\.env")) {
    Write-Host "❌ backend\.env file not found" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Environment file exists" -ForegroundColor Green

# Summary
Write-Host "`n✅ Deployment preparation complete!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Review backend\.env file"
Write-Host "   2. Update REACT_APP_API_URL in frontend\.env for production"
Write-Host "   3. Run 'npm run seed' in backend to create admin user"
Write-Host "   4. Deploy using your preferred platform (see DEPLOYMENT.md)"
Write-Host ""

