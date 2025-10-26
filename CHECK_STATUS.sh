#!/bin/bash

echo "🔍 Checking Server Status..."
echo "===================================="

cd /var/www/promohive

# Clear old logs
echo ""
echo "🧹 Clearing old logs..."
pm2 flush

# Check if new code is running
echo ""
echo "📋 Checking compiled code..."
if grep -q "trust proxy" dist/index.js; then
    echo "✅ Trust proxy fix is in compiled code"
else
    echo "❌ Trust proxy fix is NOT in compiled code"
fi

# Restart to get fresh logs
echo ""
echo "🔄 Restarting with fresh logs..."
pm2 restart all

# Wait a bit
sleep 3

# Check new logs
echo ""
echo "📋 New Logs:"
pm2 logs promohive-server --lines 10

echo ""
echo "✅ Status check completed!"

