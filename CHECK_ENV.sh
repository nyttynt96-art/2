#!/bin/bash

# ============================================
# Check Environment Variables on Server
# ============================================

echo "🔍 Checking Environment Variables..."
echo "===================================="
echo ""

cd /var/www/promohive

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo ""
    echo "Creating .env from example..."
    cp env.production .env
    echo "✅ Created .env"
fi

echo ""
echo "📋 Current Environment Variables:"
echo "===================================="
echo ""
echo "SMTP_HOST: $(grep SMTP_HOST .env | cut -d '=' -f2)"
echo "SMTP_PORT: $(grep SMTP_PORT .env | cut -d '=' -f2)"
echo "SMTP_USER: $(grep SMTP_USER .env | cut -d '=' -f2)"
echo "SMTP_PASS: $(grep SMTP_PASS .env | cut -d '=' -f2)"
echo "SMTP_FROM: $(grep SMTP_FROM .env | cut -d '=' -f2)"
echo "PLATFORM_URL: $(grep PLATFORM_URL .env | cut -d '=' -f2)"
echo ""

echo "📋 User Status:"
echo "===================================="
echo "Creating admin check..."
echo ""

