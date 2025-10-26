#!/bin/bash

# ============================================
# PromoHive Cleanup Script
# Removes temporary files, caches, and build artifacts
# ============================================

set -e

echo "🧹 Starting cleanup process..."
echo "===================================="

# Navigate to project directory
cd /var/www/promohive

# 1. Stop PM2 processes
echo ""
echo "🛑 Stopping PM2 processes..."
pm2 stop all || true

# 2. Remove node_modules
echo ""
echo "🗑️ Removing node_modules..."
rm -rf node_modules

# 3. Remove build directories
echo ""
echo "🗑️ Removing build directories..."
rm -rf dist
rm -rf .next
rm -rf .vite
rm -rf .turbo
rm -rf .turbo_cache

# 4. Remove cache directories
echo ""
echo "🗑️ Removing cache directories..."
rm -rf .cache
rm -rf node_modules/.cache
rm -rf .parcel-cache
rm -rf .rollup-cache
rm -rf .eslintcache

# 5. Remove log files
echo ""
echo "🗑️ Removing log files..."
find . -name "*.log" -type f -delete
rm -rf logs/*.log || true

# 6. Remove temporary files
echo ""
echo "🗑️ Removing temporary files..."
find . -name ".DS_Store" -type f -delete
find . -name "Thumbs.db" -type f -delete
find . -name "*.tmp" -type f -delete
find . -name "*.temp" -type f -delete

# 7. Clean npm cache
echo ""
echo "🗑️ Cleaning npm cache..."
npm cache clean --force

# 8. Clean pm2 logs
echo ""
echo "🗑️ Cleaning PM2 logs..."
pm2 flush

# 9. Remove lock file to force fresh install (optional)
echo ""
echo "⚠️ Removing package-lock.json for fresh install..."
read -p "Do you want to remove package-lock.json? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f package-lock.json
    echo "✅ package-lock.json removed"
fi

echo ""
echo "✅ Cleanup completed!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Install dependencies: npm install"
echo "2. Build the project: npm run build"
echo "3. Start with PM2: pm2 start ecosystem.config.js"
echo ""

