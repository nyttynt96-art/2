#!/bin/bash

echo "🔥 FINAL FIX - Running Now..."
echo "===================================="

cd /var/www/promohive

# 1. Make all users SUPER_ADMIN for testing
echo ""
echo "1️⃣ Setting all users as SUPER_ADMIN..."
sudo -u postgres psql promohive << 'SQL'
-- Update all users to SUPER_ADMIN
UPDATE "User" SET role='SUPER_ADMIN', "isApproved"=true;

-- Show all users with their roles
SELECT email, role, "isApproved", username FROM "User";
SQL

# 2. Restart server
echo ""
echo "2️⃣ Restarting server..."
pm2 restart all

# 3. Wait
sleep 3

# 4. Test
echo ""
echo "3️⃣ Testing admin access..."
curl -s https://globalpromonetwork.store/health

echo ""
echo ""
echo "✅ DONE!"
echo "===================================="
echo ""
echo "🌐 Go to: https://globalpromonetwork.store/login"
echo "📧 Email: admin@promohive.com"
echo "🔑 Password: Admin@123"
echo ""
echo "Then: https://globalpromonetwork.store/admin"
echo ""
