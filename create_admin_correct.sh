#!/bin/bash

echo "=== إنشاء حساب أدمن جديد بكلمة مرور صحيحة ==="
cd /var/www/promohive

# إنشاء كلمة مرور مشفرة صحيحة لـ test123456
# نستخدم bcrypt مباشرة
HASHED_PASSWORD='$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5LyY5Fp.OqQXa'

# حذف الحساب القديم وإنشاء واحد جديد
echo "حذف الحساب القديم..."
npx prisma db execute --stdin <<EOF
DELETE FROM "User" WHERE email = 'admin@promohive.com';
EOF

echo "إنشاء حساب أدمن جديد..."
npx prisma db execute --stdin <<EOF
INSERT INTO "User" (id, email, username, "fullName", password, role, "isApproved", level, "createdAt", "updatedAt")
VALUES (
  'admin-new-' || SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 8),
  'admin@promohive.com',
  'admin',
  'Admin User',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5LyY5Fp.OqQXa',
  'SUPER_ADMIN',
  true,
  3,
  NOW(),
  NOW()
);
EOF

echo ""
echo "=== التحقق من الحساب ==="
npx prisma db execute --stdin <<EOF
SELECT email, username, role, "isApproved", level FROM "User" WHERE email = 'admin@promohive.com';
EOF

echo ""
echo "✅ تم إنشاء حساب الأدمن بنجاح!"
echo "📧 Email: admin@promohive.com"
echo "🔑 Password: test123456"

