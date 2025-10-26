# 🔧 أوامر إصلاح قاعدة البيانات

## الخطوة 1: تحديث حساب الأدمن الموجود
```bash
cd /var/www/promohive
npx prisma db execute --stdin <<< "UPDATE \"User\" SET email = 'admin@promohive.com', password = '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5LyY5Fp.OqQXa', role = 'SUPER_ADMIN', \"isApproved\" = true, level = 3 WHERE username = 'admin';"
```

## الخطوة 2: التحقق من المستخدمين
```bash
npx prisma db execute --stdin <<< "SELECT id, email, username, role, \"isApproved\" FROM \"User\";"
```

## الخطوة 3: إعادة تشغيل التطبيق
```bash
pm2 restart promohive-server
```

## 📝 بيانات تسجيل الدخول:
- **Email:** admin@promohive.com
- **Password:** test123456

---

## أوامر مختصرة (انسخ والصق):
```bash
cd /var/www/promohive && git pull origin main && npx prisma db execute --stdin <<< "UPDATE \"User\" SET email = 'admin@promohive.com', password = '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5LyY5Fp.OqQXa', role = 'SUPER_ADMIN', \"isApproved\" = true, level = 3 WHERE username = 'admin';" && pm2 restart promohive-server && pm2 save
```

