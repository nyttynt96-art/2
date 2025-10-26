#!/bin/bash

echo "🔧 Complete Database Setup..."
echo "===================================="

cd /var/www/promohive

# 1. Create database and user
echo ""
echo "1️⃣ Creating database and user..."
sudo -u postgres psql << 'SQL'
-- Create user if not exists
CREATE USER promohive WITH PASSWORD 'PromoHive@2025';
ALTER USER promohive CREATEDB;

-- Create database if not exists
SELECT 'CREATE DATABASE promohive OWNER promohive'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'promohive')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE promohive TO promohive;
SQL

# 2. Update .env
echo ""
echo "2️⃣ Updating .env..."
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

# 3. Run Prisma migrations
echo ""
echo "3️⃣ Running Prisma migrations..."
npx prisma migrate deploy || npx prisma db push --accept-data-loss

# 4. Generate Prisma client
echo ""
echo "4️⃣ Generating Prisma client..."
npx prisma generate

# 5. Create admin user
echo ""
echo "5️⃣ Creating admin user..."
node setup_admin.js

echo ""
echo "✅ Complete setup done!"
echo "===================================="
echo "Email: admin@promohive.com"
echo "Password: Admin@123"

