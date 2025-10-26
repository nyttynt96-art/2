#!/bin/bash

# ============================================
# Update Server Script
# ============================================

echo "🔄 Updating PromoHive Server..."
echo "===================================="

cd /var/www/promohive

# 1. Pull latest changes
echo ""
echo "📥 Pulling latest changes..."
git pull origin main

# 2. Update .env file
echo ""
echo "📝 Updating .env file..."
if [ -f env.server.final ]; then
    cp env.server.final .env
    echo "✅ .env updated"
else
    echo "⚠️ env.server.final not found"
fi

# 3. Install dependencies (if needed)
echo ""
echo "📦 Installing dependencies..."
npm ci --production=false

# 4. Build project
echo ""
echo "🔨 Building project..."
npm run build

# 5. Restart PM2
echo ""
echo "🔄 Restarting PM2..."
pm2 restart all

# 6. Show status
echo ""
echo "📊 Application Status:"
pm2 status

# 7. Check for errors
echo ""
echo "📋 Checking for errors..."
pm2 logs promohive-server --err --lines 10

echo ""
echo "✅ Update completed!"
echo "===================================="

