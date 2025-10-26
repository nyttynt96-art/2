# 📋 دليل النشر الكامل - Complete Deployment Guide

## ✅ الإصلاحات المنجزة

### 1. إصلاح Rate Limiter
- ✅ استبدال `rateLimit` بـ `keyGenerator` مخصص
- ✅ استخدام `X-Forwarded-For` من Nginx للـ IP detection
- ✅ إزالة تحذيرات `ERR_ERL_PERMISSIVE_TRUST_PROXY`

### 2. تحديث Vite Config
- ✅ إضافة `define` لـ `process.env.NODE_ENV`
- ✅ إزالة تحذير Vite CJS

### 3. إصلاح BOM في App.tsx
- ✅ إزالة Byte Order Mark من الملف
- ✅ إزالة بيانات Admin Login من صفحة Login

---

## 🚀 خطوات النشر على السيرفر

### الخطوة 1: إصلاح مشكلة BOM

```bash
cd /var/www/promohive

# استعادة الملف من Git
git checkout src/App.tsx

# إزالة BOM باستخدام awk (الطريقة الصحيحة)
awk 'NR==1{sub(/^\xef\xbb\xbf/,"")}{print}' src/App.tsx > src/App.tsx.tmp
mv src/App.tsx.tmp src/App.tsx

# التحقق من بداية الملف (يجب أن تظهر: import)
head -c 10 src/App.tsx

# يجب أن تظهر النتيجة: import Rea
```

### الخطوة 2: سحب التحديثات وبناء التطبيق

```bash
# سحب آخر التحديثات
git pull origin main

# بناء التطبيق
npm run build

# التحقق من نجاح البناء
if [ $? -eq 0 ]; then
    echo "✅ البناء نجح"
else
    echo "❌ البناء فشل - راجع الأخطاء أعلاه"
    exit 1
fi
```

### الخطوة 3: إعادة تشغيل PM2

```bash
# إعادة تشغيل التطبيق
pm2 restart promohive-server

# حفظ حالة PM2
pm2 save
```

### الخطوة 4: التحقق من السجلات

```bash
# عرض آخر 50 سطر من السجلات
pm2 logs promohive-server --lines 50 --nostream

# يجب ألا تظهر:
# - أخطاء ERR_ERL_PERMISSIVE_TRUST_PROXY
# - أخطاء BOM
# - أخطاء بناء
```

---

## 📝 السكريبت الموجود في المستودع

يمكنك استخدام السكريبت التالي من المستودع:

```bash
cd /var/www/promohive

# سحب السكريبت
git pull origin main

# تشغيل السكريبت
chmod +x RESTORE_AND_FIX_BOM.sh
./RESTORE_AND_FIX_BOM.sh
```

---

## ⚙️ التحقق من الإعدادات

### 1. ملف .env

```bash
# تحقق من ملف .env على السيرفر
cat .env | grep -E "DATABASE_URL|JWT_SECRET|NODE_ENV"
```

### 2. Nginx Configuration

```bash
# تحقق من تكوين Nginx
sudo cat /etc/nginx/sites-available/promohive.conf
```

يجب أن يحتوي على:
```nginx
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

### 3. PM2 Status

```bash
# التحقق من حالة PM2
pm2 status

# عرض استخدام الموارد
pm2 monit
```

---

## 🐛 حل المشاكل الشائعة

### مشكلة 1: لا تزال أخطاء Rate Limiter تظهر

```bash
# تأكد من تحديث src/index.ts على السيرفر
git pull origin main
npm run build
pm2 restart promohive-server
```

### مشكلة 2: BOM لا يزال موجود

```bash
# استخدم الطريقة التالية
git checkout src/App.tsx
awk 'NR==1{sub(/^\xef\xbb\xbf/,"")}{print}' src/App.tsx > src/App.tsx.tmp
mv src/App.tsx.tmp src/App.tsx
npm run build
```

### مشكلة 3: البناء يفشل

```bash
# مسح node_modules وإعادة التثبيت
rm -rf node_modules dist
npm install
npm run build
```

---

## 📊 التحقق النهائي

بعد التنفيذ، تحقق من:

```bash
# 1. التطبيق يعمل
curl https://globalpromonetwork.store/health

# 2. PM2 بدون أخطاء
pm2 logs promohive-server --lines 20 --nostream | grep -i error

# 3. البناء ناجح
ls -lh dist/assets/

# 4. قاعدة البيانات متصلة
pm2 logs promohive-server --lines 10 | grep -i database
```

---

## ✅ قائمة التحقق النهائية

- [ ] إزالة BOM من App.tsx
- [ ] البناء نجح بدون أخطاء
- [ ] لا توجد أخطاء في PM2 logs
- [ ] Rate Limiter يعمل بدون تحذيرات
- [ ] الموقع يعمل بشكل طبيعي
- [ ] قاعدة البيانات متصلة
- [ ] API endpoints تعمل

---

## 📞 في حالة وجود مشاكل

إذا واجهت مشاكل:

1. **تحقق من السجلات:**
   ```bash
   pm2 logs promohive-server --lines 100
   ```

2. **تحقق من Git:**
   ```bash
   git log --oneline -5
   git status
   ```

3. **إعادة تعيين كاملة:**
   ```bash
   cd /var/www/promohive
   git reset --hard origin/main
   npm install
   npm run build
   pm2 restart promohive-server
   ```

---

✅ **تم رفع جميع الإصلاحات على GitHub!**
