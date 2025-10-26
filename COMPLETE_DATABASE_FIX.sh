#!/bin/bash

echo "=========================================="
echo "إصلاح قاعدة البيانات - PromoHive"
echo "=========================================="
echo ""

cd /var/www/promohive

# تحديث حساب الأدمن
echo "📝 تحديث حساب الأدمن..."
npx prisma db execute --stdin <<'EOF'
UPDATE "User" 
SET email = 'admin@promohive.com', 
    password = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5LyY5Fp.OqQXa', 
    role = 'SUPER_ADMIN', 
    "isApproved" = true, 
    level = 3,
    "fullName" = 'Admin User'
WHERE username = 'admin';
EOF

echo ""
echo "✅ تم تحديث حساب الأدمن"
echo ""

# عرض جميع المستخدمين
echo "📋 المستخدمون الحاليون:"
npx prisma db execute --stdin <<'EOF'
SELECT id, email, username, role, "isApproved", level FROM "User" ORDER BY "createdAt" DESC LIMIT 10;
EOF

echo ""
echo "=========================================="
echo "✨ بيانات تسجيل الدخول:"
echo "=========================================="
echo "📧 Email: admin@promohive.com"
echo "🔑 Password: test123456"
echo "=========================================="
echo ""

# إعادة تشغيل التطبيق
echo "🔄 إعادة تشغيل التطبيق..."
pm2 restart promohive-server
pm2 save

echo ""
echo "✅ تم إصلاح قاعدة البيانات وإعادة تشغيل التطبيق!"
echo "🌐 جرب تسجيل الدخول الآن على: https://globalpromonetwork.store/login"

