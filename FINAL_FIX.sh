#!/bin/bash

# ============================================
# Final Fix - Rebuild on Server
# ============================================

echo "🔧 Final Fix - Rebuilding on Server..."
echo "===================================="

cd /var/www/promohive

# 1. Pull latest
echo ""
echo "📥 Pulling latest code..."
git pull origin main

# 2. Clean old build
echo ""
echo "🧹 Cleaning old build..."
rm -rf dist

# 3. Fresh build
echo ""
echo "🔨 Building fresh..."
npm run build

# 4. Clear logs and restart
echo ""
echo "🔄 Clearing logs and restarting..."
pm2 flush
pm2 restart all

# 5. Wait for startup
sleep 5

# 6. Check logs for errors
echo ""
echo "📋 Checking for errors..."
pm2 logs promohive-server --err --lines 10

# 7. Check if trust proxy is in the code
echo ""
echo "🔍 Verifying trust proxy fix..."
if grep -q "trust proxy" dist/src/index.js 2>/dev/null; then
    echo "✅ Trust proxy is in the code!"
else
    echo "⚠️ Trust proxy not found in compiled code"
fi

echo ""
echo "✅ Fix completed!"

