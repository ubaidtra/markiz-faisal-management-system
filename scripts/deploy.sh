#!/bin/bash

# Deployment script for Faisal Center Management System

set -e

echo "🚀 Starting deployment process..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"

# Install dependencies
echo -e "\n${YELLOW}📦 Installing dependencies...${NC}"
npm run install-all

# Generate secrets if .env doesn't exist
if [ ! -f "backend/.env" ]; then
    echo -e "\n${YELLOW}🔐 Generating secrets...${NC}"
    cd backend
    node scripts/generate-secrets.js
    cd ..
    echo -e "${YELLOW}⚠️  Please update backend/.env with your MongoDB URI and other settings${NC}"
fi

# Build frontend
echo -e "\n${YELLOW}🏗️  Building frontend...${NC}"
cd frontend
npm run build
cd ..

# Check if build was successful
if [ ! -d "frontend/build" ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Frontend build completed${NC}"

# Production build check
echo -e "\n${YELLOW}📋 Production readiness check...${NC}"

# Check environment variables
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ backend/.env file not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment file exists${NC}"

# Summary
echo -e "\n${GREEN}✅ Deployment preparation complete!${NC}"
echo -e "\n📝 Next steps:"
echo -e "   1. Review backend/.env file"
echo -e "   2. Update REACT_APP_API_URL in frontend/.env for production"
echo -e "   3. Run 'npm run seed' in backend to create admin user"
echo -e "   4. Deploy using your preferred platform (see DEPLOYMENT.md)"
echo -e "\n"

