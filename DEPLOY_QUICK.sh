#!/bin/bash

# ============================================
# Quick Deployment Script (Recommended)
# Fast deployment without full cleanup
# ============================================

set -e

echo "🚀 Quick Deployment Started..."
echo "===================================="

cd /var/www/promohive

# Clean minimal files
echo "🧹 Cleaning minimal cache..."
rm -rf dist
rm -rf node_modules/.cache

# Git pull
echo "📥 Pulling latest code..."
git pull origin main

# Build
echo "🔨 Building..."
npm run build

# Restart
echo "🔄 Restarting..."
pm2 restart all

# Status
echo ""
echo "📊 Status:"
pm2 status

echo ""
echo "✅ Quick deployment done!"
echo "🌐 https://globalpromonetwork.store"

