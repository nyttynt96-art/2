#!/bin/bash

echo "🔥 Complete Server Reset..."
echo "===================================="

cd /var/www/promohive

# 1. Pull latest
echo ""
echo "📥 Pulling latest code..."
git pull origin main

# 2. Copy .env
echo ""
echo "📝 Ensuring .env exists..."
if [ ! -f .env ]; then
    cat > .env << 'EOF'
DATABASE_URL="postgresql://promohive:PromoHive@2025@localhost:5432/promohive"
JWT_SECRET="promohive-super-secret-jwt-key-2025"
JWT_REFRESH_SECRET="promohive-super-secret-refresh-key-2025"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
PORT=3002
NODE_ENV="production"
CORS_ORIGIN="https://globalpromonetwork.store"
PLATFORM_URL="https://globalpromonetwork.store"
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="promohive@globalpromonetwork.store"
SMTP_PASS="PromoHive@2025!"
SMTP_FROM="promohive@globalpromonetwork.store"
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"
LOG_LEVEL="info"
BCRYPT_SALT_ROUNDS="12"
EOF
fi

# 3. Clean and rebuild
echo ""
echo "🧹 Cleaning old build..."
rm -rf dist
rm -rf node_modules/.cache

# 4. Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm ci

# 5. Build
echo ""
echo "🔨 Building..."
npm run build

# 6. Restart
echo ""
echo "🔄 Restarting..."
pm2 stop all
pm2 flush
pm2 restart all

# 7. Wait
sleep 5

# 8. Show status
echo ""
echo "📊 Server Status:"
pm2 status

# 9. Show recent logs
echo ""
echo "📋 Recent Logs:"
pm2 logs promohive-server --lines 15 --nostream

# 10. Test
echo ""
echo "🌐 Testing..."
curl -I https://globalpromonetwork.store

echo ""
echo "✅ Complete reset done!"
echo ""

