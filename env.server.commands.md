# 🔧 أوامر السيرفر لإعداد ملف .env

## الخطوة 1: توليد مفاتيح JWT قوية

على السيرفر، نفذ:
```bash
openssl rand -base64 32
```

انسخ الناتج واستخدمه في:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `SESSION_SECRET`

## الخطوة 2: إنشاء ملف .env

```bash
cd /var/www/promohive
nano .env
```

## الخطوة 3: انسخ والصق الإعدادات التالية

```env
DATABASE_URL="postgresql://promohive_user:YOUR_PASSWORD@localhost:5432/promohive?schema=public"

PORT=3002
NODE_ENV=production
CORS_ORIGIN="https://globalpromonetwork.store"
PLATFORM_URL="https://globalpromonetwork.store"

JWT_SECRET="PASTE_FROM_OPENSSL_HERE"
JWT_REFRESH_SECRET="PASTE_FROM_OPENSSL_HERE"
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
SESSION_SECRET="PASTE_FROM_OPENSSL_HERE"
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
```

## الخطوة 4: احفظ الملف

اضغط: `Ctrl+O` ثم `Enter` ثم `Ctrl+X`

---

## 🔐 ملف .env جاهز للإنتاج

استخدم الملف: `env.production.ready` كقاعدة واملأ القيم المطلوبة.

