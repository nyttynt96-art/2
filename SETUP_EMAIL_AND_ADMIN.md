# إعداد البريد الإلكتروني وصفحة الأدمن

## المشكلة 1: البريد الإلكتروني

### الإعدادات الصحيحة:

ابدأ بتحرير `.env` على السيرفر:

```bash
nano /var/www/promohive/.env
```

**أضف هذه الإعدادات:**

```bash
# ============================================
# Email Configuration (Hostinger)
# ============================================
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=promohive@globalpromonetwork.store
SMTP_PASS=PromoHive@2025!
SMTP_FROM=promohive@globalpromonetwork.store
PLATFORM_URL=https://globalpromonetwork.store
```

### اختبار البريد:

```bash
cd /var/www/promohive

node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'promohive@globalpromonetwork.store',
    pass: 'PromoHive@2025!'
  }
});
transporter.verify((err, success) => {
  if (err) console.error('❌ Error:', err.message);
  else console.log('✅ SMTP is working!');
});
"
```

---

## المشكلة 2: صفحة الأدمن لا تظهر

### السبب:
الحساب الشخصي ليس أدمن، يجب إنشاء حساب أدمن أو رفع صلاحيات الحساب الحالي.

### الحل - إنشاء حساب أدمن:

```bash
cd /var/www/promohive

# تشغيل السكريبت
psql $DATABASE_URL -f CREATE_ADMIN_USER.sql
```

**معلومات تسجيل الدخول:**
- **Email**: `admin@promohive.com`
- **Password**: `Admin@123`

### أو رفع صلاحيات الحساب الحالي:

استبدل `YOUR_EMAIL_HERE` بأيميلك:

```bash
psql $DATABASE_URL -c "UPDATE \"User\" SET role='SUPER_ADMIN', \"isApproved\"=true WHERE email='YOUR_EMAIL_HERE';"
```

---

## التحقق من الحالة

### 1. تحقق من البريد:

```bash
# إرسال رسالة اختبار
cd /var/www/promohive

node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'promohive@globalpromonetwork.store',
    pass: 'PromoHive@2025!'
  }
});

transporter.sendMail({
  from: 'PromoHive <promohive@globalpromonetwork.store>',
  to: 'your-email@example.com',
  subject: 'Test Email from PromoHive',
  html: '<h1>Email is working!</h1>'
}, (err, info) => {
  if (err) console.error('❌', err.message);
  else console.log('✅ Email sent!', info.messageId);
});
"
```

### 2. تحقق من حساب الأدمن:

```bash
psql $DATABASE_URL -c "SELECT email, role, \"isApproved\" FROM \"User\" WHERE role='SUPER_ADMIN' OR role='ADMIN';"
```

---

## الخطوات الكاملة

### على السيرفر - فحص كل شيء:

```bash
cd /var/www/promohive

# 1. التحقق من .env
echo "=== Email Settings ==="
cat .env | grep SMTP

# 2. إنشاء حساب أدمن
psql $DATABASE_URL -f CREATE_ADMIN_USER.sql

# 3. فحص الحسابات
psql $DATABASE_URL -c "SELECT email, role FROM \"User\";"

# 4. إعادة تشغيل
pm2 restart all

# 5. فحص السجلات
pm2 logs promohive-server --lines 20
```

---

## تسجيل الدخول كأدمن

1. افتح: https://globalpromonetwork.store/login
2. **Email**: `admin@promohive.com`
3. **Password**: `Admin@123`
4. بعد تسجيل الدخول: https://globalpromonetwork.store/admin

---

## اختبار البريد مع حساب جديد

1. افتح: https://globalpromonetwork.store/register
2. سجّل حساب جديد
3. يرجى تفقد صندوق الوارد - ستجد رسالة ترحيب من PromoHive

---

## استكشاف الأخطاء

### إذا لم يعمل البريد:

```bash
# فحص السجلات
pm2 logs promohive-server | grep -i email

# اختبار الاتصال
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'promohive@globalpromonetwork.store',
    pass: 'PromoHive@2025!'
  }
});
transporter.verify((err, success) => {
  console.log(err ? '❌ '+err.message : '✅ Working!');
});
"
```

### إذا لم تعمل صفحة الأدمن:

```bash
# فحص صلاحياتك
psql $DATABASE_URL -c "SELECT email, role, \"isApproved\" FROM \"User\" WHERE email='your-email@example.com';"

# رفع صلاحياتك
psql $DATABASE_URL -c "UPDATE \"User\" SET role='SUPER_ADMIN' WHERE email='your-email@example.com';"
```

---

## معلومات مهمة

| العنصر | القيمة |
|--------|--------|
| SMTP Server | smtp.hostinger.com |
| Port | 465 |
| Security | SSL/TLS |
| Username | promohive@globalpromonetwork.store |
| Password | PromoHive@2025! |
| Admin Email | admin@promohive.com |
| Admin Password | Admin@123 |

