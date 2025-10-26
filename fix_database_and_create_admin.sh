#!/bin/bash

echo "🔧 Fixing Database & Creating Admin..."
echo "===================================="

# 1. Set PostgreSQL password for promohive user
echo ""
echo "1️⃣ Setting PostgreSQL password..."
sudo -u postgres psql -c "ALTER USER promohive PASSWORD 'PromoHive@2025';" || echo "User might not exist"

# 2. Update .env with correct DATABASE_URL
echo ""
echo "2️⃣ Updating .env..."
cd /var/www/promohive
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

# 3. Create admin using postgres user directly
echo ""
echo "3️⃣ Creating admin user..."
sudo -u postgres psql promohive << 'SQL'
INSERT INTO "User" ("id", "username", "email", "password", "fullName", "role", "level", "isApproved", "isSuspended", "referralCode", "createdAt", "updatedAt") 
SELECT 
    gen_random_uuid()::text,
    'admin',
    'admin@promohive.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5hFLFkWM3v3ge',
    'System Administrator',
    'SUPER_ADMIN',
    10,
    true,
    false,
    'ADMIN01',
    NOW(),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM "User" WHERE email = 'admin@promohive.com');

-- Create wallet if needed
INSERT INTO "Wallet" ("id", "userId", "balance", "pendingBalance", "totalEarned", "totalWithdrawn", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid()::text,
    u."id",
    0,
    0,
    0,
    0,
    NOW(),
    NOW()
FROM "User" u
WHERE u.email = 'admin@promohive.com'
AND NOT EXISTS (SELECT 1 FROM "Wallet" w WHERE w."userId" = u."id");

-- Show result
SELECT email, role, "isApproved" FROM "User" WHERE email = 'admin@promohive.com';
SQL

echo ""
echo "✅ Done!"
echo "Email: admin@promohive.com"
echo "Password: Admin@123"

