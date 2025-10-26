#!/bin/bash

# PromoHive Production Deployment Script for Ubuntu 24.04 LTS
# This script automates the deployment process on the server

set -e

echo "🚀 PromoHive Deployment Script Starting..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Update system
echo -e "${YELLOW}Updating system packages...${NC}"
apt-get update -y
apt-get upgrade -y

# Install Node.js 20.x
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Installing PM2...${NC}"
    npm install -g pm2
fi

# Install Nginx
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}Installing Nginx...${NC}"
    apt-get install -y nginx
fi

# Install PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}Installing PostgreSQL...${NC}"
    apt-get install -y postgresql postgresql-contrib
fi

# Install Git
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}Installing Git...${NC}"
    apt-get install -y git
fi

# Create app directory
APP_DIR="/var/www/promohive"
if [ ! -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Creating app directory...${NC}"
    mkdir -p "$APP_DIR"
fi

# Set up project
cd "$APP_DIR"

# Clone or pull latest code
if [ -d ".git" ]; then
    echo -e "${YELLOW}Pulling latest changes...${NC}"
    git pull origin main
else
    echo -e "${YELLOW}Repository not found. Please clone the repository first.${NC}"
    echo -e "${YELLOW}Run: git clone https://github.com/nyttynt96-art/2.git $APP_DIR${NC}"
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install --production

# Generate Prisma Client
echo -e "${YELLOW}Generating Prisma Client...${NC}"
npx prisma generate

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
npx prisma migrate deploy

# Build the application
echo -e "${YELLOW}Building application...${NC}"
npm run build

# Set up environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from example...${NC}"
    if [ -f "env.example" ]; then
        cp env.example .env
        echo -e "${RED}⚠️  Please configure .env file with your settings!${NC}"
    fi
fi

# Restart or start PM2
echo -e "${YELLOW}Starting application with PM2...${NC}"
pm2 restart ecosystem.config.js --update-env || pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Enable PM2 to start on boot
pm2 startup

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}Your application is now running on PM2${NC}"

# Display PM2 status
pm2 status

echo ""
echo -e "${GREEN}=========================================="
echo "📊 Application Status:"
echo "=========================================="
echo -e "${GREEN}✅ Application deployed and running${NC}"
echo -e "${YELLOW}📝 Don't forget to:${NC}"
echo "   1. Configure .env file with your settings"
echo "   2. Set up Nginx reverse proxy"
echo "   3. Configure SSL certificate"
echo ""
echo -e "${GREEN}Useful commands:${NC}"
echo "   pm2 logs          - View logs"
echo "   pm2 status        - Check status"
echo "   pm2 restart all   - Restart all apps"
echo "=========================================="

