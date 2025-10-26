#!/bin/bash

echo "=== التحقق من المستخدمين في قاعدة البيانات ==="
cd /var/www/promohive

# عرض جميع المستخدمين
npx prisma db execute --stdin <<'EOF'
SELECT id, email, username, role, "isApproved", level, LEFT(password, 20) as password_preview FROM "User" ORDER BY "createdAt" DESC LIMIT 5;
EOF

