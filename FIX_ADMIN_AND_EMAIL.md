# إصلاح مشكلة صفحة الأدمن وإعدادات البريد الإلكتروني

## المشكلة 1: صفحة الأدمن لا تظهر

**السبب**: تحتاج إلى حساب أدمن (role='ADMIN' أو 'SUPER_ADMIN')

### الحل:

#### على السيرفر:

```bash
cd /var/www/promohive

# 1. التحقق من إعدادات .env
cat .env | grep SMTP

# 2. إنشاء مستخدم أدمن
psql postgresql://promohive:PromoHive@2025@localhost:5432/promohive -f CREATE_ADMIN_USER.sql

# 3. تسجيل الدخول بحساب الأدمن
# Email: admin@promohive.com
# Password: Admin@123
```

---

## المشكلة 2: رسالة البريد الإلكتروني لم تصل

**السبب**: إعدادات SMTP غير صحيحة أو كلمة السر غير محددة

### الحل:

#### 1. تحرير ملف .env على السيرفر:

```bash
cd /var/www/promohive
nano .env
```

#### 2. تأكد من إعدادات البريد الإلكتروني:

```bash
# Email Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=promohive@globalpromonetwork.store
SMTP_PASS=PromoHive@2025!
SMTP_FROM=promohive@globalpromonetwork.store
PLATFORM_URL=https://globalpromonetwork.store
```

#### 3. إعادة تشغيل الخادم:

```bash
pm2 restart all
pm2 logs promohive-server --lines 50
```

---

## اختيارات سريعة:

### Option 1: إنشاء حساب أدمن (يُنصح به)

```bash
cd /var/www/promohive
git pull origin main

# إنشاء مستخدم أدمن في قاعدة البيانات
psql $DATABASE_URL -f CREATE_ADMIN_USER.sql

# إعادة تشغيل
pm2 restart all
```

**تسجيل الدخول**:
- Email: `admin@promohive.com`
- Password: `Admin@123`

---

### Option 2: تحويل حسابك الحالي إلى أدمن

```bash
cd /var/www/promohive

# استبدل YOUR_EMAIL بأيميلك
psql $DATABASE_URL -c "UPDATE \"User\" SET role='SUPER_ADMIN', \"isApproved\"=true WHERE email='YOUR_EMAIL';"

# إعادة التشغيل
pm2 restart all
```

---

### Option 3: فحص سجلات البريد الإلكتروني

```bash
# عرض سجلات الخادم
pm2 logs promohive-server --lines 100

# فحص الأخطاء
pm2 logs promohive-server --err --lines 50
```

---

## تأكيد الإصلاح:

### 1. تسجيل الدخول كأدمن:
- اذهب إلى: https://globalpromonetwork.store/login
- Email: `admin@promohive.com`
- Password: `Admin@123`

### 2. الوصول إلى صفحة الأدمن:
- https://globalpromonetwork.store/admin

### 3. اختبار البريد الإلكتروني:
- سجّل حساب جديد
- تحقق من وصول رسالة الترحيب

---

## معلومات الاتصال:

| العنصر | القيمة |
|--------|--------|
| SMTP Host | smtp.hostinger.com |
| SMTP Port | 465 |
| SMTP User | promohive@globalpromonetwork.store |
| SMTP Pass | PromoHive@2025! |
| Admin Email | admin@promohive.com |
| Admin Pass | Admin@123 |

---

## استكشاف الأخطاء:

### إذا لم تعمل صفحة الأدمن:

```bash
# 1. تحقق من role المستخدم
psql $DATABASE_URL -c "SELECT email, role, \"isApproved\" FROM \"User\";"

# 2. إذا كنت تريد تغيير role للمستخدم الحالي
psql $DATABASE_URL -c "UPDATE \"User\" SET role='SUPER_ADMIN' WHERE email='your-email@example.com';"

# 3. إعادة التشغيل
pm2 restart all
```

### إذا لم تصل رسالة البريد الإلكتروني:

```bash
# 1. فحص إعدادات SMTP
cd /var/www/promohive
cat .env | grep SMTP

# 2. اختبار الاتصال بـ SMTP
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
  if (err) console.error('❌', err);
  else console.log('✅ SMTP connection successful!');
});
"

# 3. إعادة تشغيل
pm2 restart all
```

---

## ملاحظات مهمة:

1. **كلمة مرور الأدمن**: `Admin@123` - غيرها بعد أول تسجيل دخول!
2. **البريد الإلكتروني**: تأكد من أن كلمة سر البريد صحيحة (`PromoHive@2025!`)
3. **SSL**: تأكد من أن `SMTP_SECURE=true`
4. **Port**: استخدم `465` للـ SSL

---

## بعد التنفيذ:

1. ✅ تسجيل الدخول كأدمن
2. ✅ الوصول إلى صفحة الأدمن
3. ✅ إرسال رسائل البريد الإلكتروني
4. ✅ الموافقة على المستخدمين الجدد

