#!/bin/bash

echo "=== تحديث حسابات المستخدمين في قاعدة البيانات ==="

# تحديث حساب المستخدم التجريبي
echo "تحديث حساب المستخدم التجريبي..."
npx prisma db execute --stdin <<< "UPDATE \"User\" SET password = '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5LyY5Fp.OqQXa', \"isApproved\" = true WHERE email = 'test@test.com';"

# تحديث أو إنشاء حساب الأدمن
echo "تحديث حساب الأدمن..."
npx prisma db execute --stdin <<< "UPDATE \"User\" SET email = 'admin@promohive.com', username = 'admin', \"fullName\" = 'Admin User', password = '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5LyY5Fp.OqQXa', role = 'SUPER_ADMIN', \"isApproved\" = true, level = 3 WHERE username = 'admin';"

echo "=== عرض جميع المستخدمين ==="
npx prisma db execute --stdin <<< "SELECT id, email, username, role, \"isApproved\" FROM \"User\";"

echo ""
echo "✅ تم تحديث الحسابات بنجاح!"
echo "📧 Email: admin@promohive.com | Password: test123456"
echo "📧 Email: test@test.com | Password: test123456"

