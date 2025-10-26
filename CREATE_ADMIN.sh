#!/bin/bash

# ============================================
# Create Admin User Script
# ============================================

echo "🔧 Creating Admin User..."
echo "===================================="

cd /var/www/promohive

# Use the DATABASE_URL from .env
source .env

# Create admin user
psql "$DATABASE_URL" << 'SQL'
-- Insert admin user if not exists
INSERT INTO "User" (
    "id",
    "username",
    "email",
    "password",
    "fullName",
    "role",
    "level",
    "isApproved",
    "isSuspended",
    "referralCode",
    "createdAt",
    "updatedAt"
) 
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
WHERE NOT EXISTS (
    SELECT 1 FROM "User" WHERE email = 'admin@promohive.com'
);

-- Create wallet for admin if not exists
INSERT INTO "Wallet" (
    "id",
    "userId",
    "balance",
    "pendingBalance",
    "totalEarned",
    "totalWithdrawn",
    "createdAt",
    "updatedAt"
)
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
AND NOT EXISTS (
    SELECT 1 FROM "Wallet" w WHERE w."userId" = u."id"
);

-- Display result
SELECT email, role, "isApproved" FROM "User" WHERE email = 'admin@promohive.com';
SQL

echo ""
echo "✅ Admin user created!"
echo "Email: admin@promohive.com"
echo "Password: Admin@123"
echo ""

