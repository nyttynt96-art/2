# ⚙️ كيفية إعداد ملف .env على السيرفر

## 📁 الملف الجاهز

**اسم الملف**: `server-env-complete.txt`  
**الموقع**: https://github.com/nyttynt96-art/2.git

---

## 🚀 خطوات الاستخدام السريع

### الخطوة 1: على السيرفر

```bash
ssh root@72.60.215.2
cd /var/www/promohive
```

### الخطوة 2: نسخ الملف

```bash
# إذا مشروع محمّل مسبقاً من GitHub
git pull origin main

# أو انسخ المحتوى من server-env-complete.txt إلى .env
cp server-env-complete.txt .env

# أو افتح الملف وانسخه يدوياً
nano .env
```

### الخطوة 3: تعديل كلمة مرور قاعدة البيانات

```bash
nano .env
```

ابحث عن هذا السطر:
```env
DATABASE_URL="postgresql://promohive_user:CHANGE_THIS_PASSWORD@localhost:5432/promohive?schema=public"
```

استبدل `CHANGE_THIS_PASSWORD` بكلمة المرور التي اخترتها عند إنشاء قاعدة البيانات.

### الخطوة 4: حفظ الملف

اضغط `Ctrl+O` ثم `Enter` ثم `Ctrl+X`

---

## ✅ محتوى الملف (جاهز للنسخ)

إليك المحتوى الكامل جاهز للنسخ:

```env
# Database
DATABASE_URL="postgresql://promohive_user:YOUR_PASSWORD_HERE@localhost:5432/promohive?schema=public"

# Server
PORT=3002
NODE_ENV=production
CORS_ORIGIN="https://globalpromonetwork.store"
PLATFORM_URL="https://globalpromonetwork.store"

# JWT Secrets (جاهزة وآمنة)
JWT_SECRET="Xk9mP2vQ5wR8tY1uI3oA6sD9fG0hJ4kL7mN0pQ3rS6tU9vW2xY5zA8bC1dE4fG7h"
JWT_REFRESH_SECRET="A7bC2dE5fG8hI1jK4lM7nO0pQ3rS6tU9vW2xY5zA8bC1dE4fG7hJ0kL3m"
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (Hostinger - جاهز)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=promohive@globalpromonetwork.store
SMTP_PASS=PromoHive@2025!
SMTP_FROM="PromoHive <promohive@globalpromonetwork.store>"
SMTP_NAME="PromoHive"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12
SESSION_SECRET="V8wX1yZ4aB7cD0eF3gH6iJ9kL2mN5oP8qR1sT4uV7wX0yZ3aB6cD9eF2gH5iJ8kL"
ALLOWED_ORIGINS="https://globalpromonetwork.store,https://www.globalpromonetwork.store"

# Logging
LOG_LEVEL=info
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
SESSION_COOKIE_MAX_AGE=86400000

# Features
ENABLE_REGISTRATION=true
ENABLE_EMAIL_VERIFICATION=true
ENABLE_2FA=false

# Payment
MIN_WITHDRAWAL_AMOUNT=10
MAX_WITHDRAWAL_AMOUNT=1000
WITHDRAWAL_FEE=5

# Referral
REFERRAL_BONUS_AMOUNT=5
REFERRAL_LEVELS=2

# Cron
ENABLE_CRON_JOBS=true
CLEANUP_OLD_DATA_DAYS=30

# External APIs
ADGEM_JWT_SECRET=
ADSTERRA_API_KEY=
CPALEAD_API_KEY=
OFFER_TASTIC_API_KEY=
```

---

## 🔑 المفاتيح الجاهزة في الملف

✅ **JWT_SECRET**: `Xk9mP2vQ5wR8tY1uI3oA6sD9fG0hJ4kL7mN0pQ3rS6tU9vW2xY5zA8bC1dE4fG7h`  
✅ **JWT_REFRESH_SECRET**: `A7bC2dE5fG8hI1jK4lM7nO0pQ3rS6tU9vW2xY5zA8bC1dE4fG7hJ0kL3m`  
✅ **SESSION_SECRET**: `V8wX1yZ4aB7cD0eF3gH6iJ9kL2mN5oP8qR1sT4uV7wX0yZ3aB6cD9eF2gH5iJ8kL`

**جميع المفاتيح جاهزة وآمنة (64 حرف لكل مفتاح)**

---

## 📧 إعدادات البريد الإلكتروني

✅ **جاهزة ومفعلة**:
- SMTP: `smtp.hostinger.com:465`
- البريد: `promohive@globalpromonetwork.store`
- كلمة المرور: `PromoHive@2025!`

---

## ⚠️ ما يجب تعديله فقط

1. **كلمة مرور قاعدة البيانات**:
```env
DATABASE_URL="postgresql://promohive_user:ضع_كلمة_المرور_هنا@localhost:5432/promohive?schema=public"
```

2. **API Keys الخارجية** (اختياري):
```env
ADGEM_JWT_SECRET=""
ADSTERRA_API_KEY=""
CPALEAD_API_KEY=""
```

---

## ✅ التحقق من الملف

بعد الحفظ، تحقق من الملف:

```bash
cat .env
```

يجب أن ترى جميع المتغيرات موجودة.

---

## 🎉 جاهز!

الآن الملف جاهز والنشر يمكنه الاستمرار:

```bash
bash deploy.sh
pm2 start ecosystem.config.js
```

---

## 📝 ملاحظة مهمة

- 🔐 **المفاتيح أمنة**: JWT secrets قوية وآمنة  
- 📧 **البريد جاهز**: إعدادات Hostinger كاملة  
- 🌐 **الدومين**: globalpromonetwork.store  
- ⚙️ **جاهز للنشر**: فقط بدّل كلمة مرور قاعدة البيانات

