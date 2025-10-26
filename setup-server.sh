#!/bin/bash

# Server Initial Setup Script for PromoHive
# Run this script on a fresh Ubuntu 24.04 LTS server

set -e

echo "🔧 PromoHive Server Setup Starting..."
echo "======================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Step 1: Update system
echo -e "${BLUE}[1/8]${NC} Updating system..."
apt-get update -y
apt-get upgrade -y

# Step 2: Install essential tools
echo -e "${BLUE}[2/8]${NC} Installing essential tools..."
apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Step 3: Install Node.js 20.x
echo -e "${BLUE}[3/8]${NC} Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"
echo -e "${GREEN}✅ npm version: $NPM_VERSION${NC}"

# Step 4: Install PM2
echo -e "${BLUE}[4/8]${NC} Installing PM2..."
npm install -g pm2
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Step 5: Install PostgreSQL
echo -e "${BLUE}[5/8]${NC} Installing PostgreSQL..."
apt-get install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Step 6: Install Nginx
echo -e "${BLUE}[6/8]${NC} Installing Nginx..."
apt-get install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Step 7: Configure firewall
echo -e "${BLUE}[7/8]${NC} Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow OpenSSH
    ufw allow 'Nginx Full'
    ufw --force enable
fi

# Step 8: Create app user
echo -e "${BLUE}[8/8]${NC} Creating application user..."
if ! id "promohive" &>/dev/null; then
    useradd -m -s /bin/bash promohive
    usermod -aG sudo promohive
    echo -e "${GREEN}✅ User 'promohive' created${NC}"
else
    echo -e "${YELLOW}⚠️  User 'promohive' already exists${NC}"
fi

# Create app directory
APP_DIR="/var/www/promohive"
mkdir -p "$APP_DIR"
chown -R promohive:promohive "$APP_DIR"

echo ""
echo -e "${GREEN}======================================"
echo "✅ Server Setup Completed Successfully!"
echo "======================================"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "   1. Clone your repository:"
echo "      git clone https://github.com/nyttynt96-art/2.git $APP_DIR"
echo ""
echo "   2. Run the deployment script:"
echo "      cd $APP_DIR && bash deploy.sh"
echo ""
echo -e "${YELLOW}📊 Installed Software:${NC}"
echo "   • Node.js: $NODE_VERSION"
echo "   • npm: $NPM_VERSION"
echo "   • PM2: $(pm2 -v)"
echo "   • PostgreSQL: $(psql --version)"
echo "   • Nginx: $(nginx -v 2>&1)"
echo ""
echo -e "${GREEN}Ready for deployment!${NC}"

