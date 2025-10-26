#!/bin/bash

# ============================================
# Fix Common Issues Script
# ============================================

set -e

echo "🔧 Fixing common issues..."
echo "===================================="

cd /var/www/promohive

# 1. Fix permissions
echo ""
echo "🔐 Fixing permissions..."
chmod -R 755 /var/www/promohive
chown -R promohive:promohive /var/www/promohive

# 2. Clear PM2 logs
echo ""
echo "📝 Clearing PM2 logs..."
pm2 flush
pm2 reloadLogs

# 3. Fix node_modules issues
echo ""
echo "📦 Fixing node_modules..."
rm -rf node_modules/.cache
npm cache clean --force

# 4. Restart all services
echo ""
echo "🔄 Restarting services..."
pm2 restart all

# 5. Check Nginx
echo ""
echo "🌐 Checking Nginx..."
nginx -t
systemctl reload nginx

# 6. Show status
echo ""
echo "📊 Final Status:"
echo "===================================="
pm2 status
echo ""
echo "Nginx status:"
systemctl status nginx --no-pager -l
echo ""

# 7. Show recent errors
echo "📋 Recent PM2 errors (last 20 lines):"
pm2 logs promohive-server --lines 20 --err

echo ""
echo "✅ Fix issues script completed!"
echo ""

