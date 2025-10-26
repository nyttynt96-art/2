# 🚀 الأوامر النهائية للسيرفر - نسخ ولصق جاهزة

## الخطوة 1: اتصال بالسيرفر
```bash
ssh root@72.60.215.2
```

## الخطوة 2: إنشاء ملف .env
```bash
cd /var/www/promohive
nano .env
```

## الخطوة 3: انسخ والصق هذا الكود بالكامل:

```env
# PromoHive Production Environment - READY FOR SERVER
DATABASE_URL="postgresql://promohive_user:PromoHiveSecure2025@localhost:5432/promohive?schema=public"
PORT=3002
NODE_ENV=production
CORS_ORIGIN="https://globalpromonetwork.store"
PLATFORM_URL="https://globalpromonetwork.store"
JWT_SECRET="Xk9mP2vQ5wR8tY1uI3oA6sD9fG0hJ4kL7mN0pQ3rS6tU9vW2xY5zA8bC1dE4fG7h"
JWT_REFRESH_SECRET="A7bC2dE5fG8hI1jK4lM7nO0pQ3rS6tU9vW2xY5zA8bC1dE4fG7hJ0kL3m"
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=promohive@globalpromonetwork.store
SMTP_PASS=PromoHive@2025!
SMTP_FROM="PromoHive <promohive@globalpromonetwork.store>"
SMTP_NAME="PromoHive"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_SALT_ROUNDS=12
SESSION_SECRET="V8wX1yZ4aB7cD0eF3gH6iJ9kL2mN5oP8qR1sT4uV7wX0yZ3aB6cD9eF2gH5iJ8kL"
ALLOWED_ORIGINS="https://globalpromonetwork.store,https://www.globalpromonetwork.store"
LOG_LEVEL=info
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
SESSION_COOKIE_MAX_AGE=86400000
ENABLE_REGISTRATION=true
ENABLE_EMAIL_VERIFICATION=true
ENABLE_2FA=false
MIN_WITHDRAWAL_AMOUNT=10
MAX_WITHDRAWAL_AMOUNT=1000
WITHDRAWAL_FEE=5
REFERRAL_BONUS_AMOUNT=5
REFERRAL_LEVELS=2
ENABLE_CRON_JOBS=true
CLEANUP_OLD_DATA_DAYS=30
ADGEM_JWT_SECRET=
ADSTERRA_API_KEY=
CPALEAD_API_KEY=
OFFER_TASTIC_API_KEY=
```

## الخطوة 4: حفظ الملف
```
اضغط: Ctrl+O
ثم اضغط: Enter
ثم اضغط: Ctrl+X
```

## الخطوة 5: إنشاء قاعدة البيانات
```bash
sudo -u postgres psql
```

في PostgreSQL:
```sql
CREATE DATABASE promohive;
CREATE USER promohive_user WITH ENCRYPTED PASSWORD 'PromoHiveSecure2025';
GRANT ALL PRIVILEGES ON DATABASE promohive TO promohive_user;
ALTER USER promohive_user CREATEDB;
\q
```

## الخطوة 6: النشر
```bash
bash deploy.sh
pm2 start ecosystem.config.js
pm2 save
```

## الخطوة 7: التحقق
```bash
pm2 status
pm2 logs
```

---

## ✅ جاهز! الموقع يعمل على:
- https://globalpromonetwork.store

