#!/bin/bash

echo "=== إصلاح كلمة مرور الأدمن ==="
cd /var/www/promohive

# كلمة المرور المشفرة الصحيحة لـ test123456
HASHED_PASSWORD='$2b$12$m3EnQGdLNRJuK9NmObpym.9U52zKOqw1mYqXNMBWjvISZRMOBJQLS'

echo "تحديث كلمة مرور الأدمن..."
npx prisma db execute --stdin <<EOF
UPDATE "User" 
SET password = '$HASHED_PASSWORD',
    email = 'admin@promohive.com',
    role = 'SUPER_ADMIN',
    "isApproved" = true,
    level = 3
WHERE username = 'admin';
EOF

echo ""
echo "=== التحقق من الحساب ==="
npx prisma db execute --stdin <<EOF
SELECT email, username, role, "isApproved", level FROM "User" WHERE username = 'admin';
EOF

echo ""
echo "✅ تم إصلاح كلمة المرور!"
echo "📧 Email: admin@promohive.com"
echo "🔑 Password: test123456"
echo ""
echo "🔄 إعادة تشغيل التطبيق..."
pm2 restart promohive-server
pm2 save

echo ""
echo "✅ جاهز! جرب تسجيل الدخول الآن."

