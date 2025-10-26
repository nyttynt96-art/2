# 🚀 دليل النشر الكامل - PromoHive على Ubuntu 24.04 LTS

## ✅ تم رفع المشروع على GitHub
**المستودع**: https://github.com/nyttynt96-art/2.git

---

## 📋 المتطلبات

- سيرفر Ubuntu 24.04 LTS (العنوان: 72.60.215.2)
- الدومين: globalpromonetwork.store
- وصول Root عبر SSH
- معرفة أساسية بأوامر Linux

---

## 🔧 خطوات النشر على السيرفر

### الخطوة 1: الاتصال بالسيرفر

افتح Terminal على جهازك واتصل بالسيرفر:

```bash
ssh root@72.60.215.2
```

### الخطوة 2: إعداد السيرفر

قم بتشغيل سكربت الإعداد التلقائي:

```bash
curl -o setup-server.sh https://raw.githubusercontent.com/nyttynt96-art/2/main/setup-server.sh
chmod +x setup-server.sh
bash setup-server.sh
```

**ماذا يفعل هذا السكربت؟**
- يثبت Node.js 20.x
- يثبت PM2 (مدير العمليات)
- يثبت PostgreSQL
- يثبت Nginx
- يثبت Git والبرامج الأساسية
- ينشئ مستخدم `promohive` للتطبيق

### الخطوة 3: إعداد قاعدة البيانات

```bash
sudo -u postgres psql
```

في شيل PostgreSQL، نفذ الأوامر التالية:

```sql
CREATE DATABASE promohive;
CREATE USER promohive_user WITH ENCRYPTED PASSWORD 'ادخل_كلمة_مرور_قوية_هنا';
GRANT ALL PRIVILEGES ON DATABASE promohive TO promohive_user;
ALTER USER promohive_user CREATEDB;
\q
```

**ملاحظة مهمة**: استبدل `ادخل_كلمة_مرور_قوية_هنا` بكلمة مرور قوية واحفظها!

### الخطوة 4: تحميل المشروع

```bash
cd /var/www
git clone https://github.com/nyttynt96-art/2.git promohive
cd promohive
chown -R promohive:promohive /var/www/promohive
```

### الخطوة 5: إعداد ملف البيئة

```bash
nano .env
```

انسخ والصق الإعدادات التالية:

```env
# Database
DATABASE_URL="postgresql://promohive_user:كلمة_المرور@localhost:5432/promohive?schema=public"

# Server
PORT=3002
NODE_ENV=production

# JWT Secret (قم بتغييره إلى مفتاح عشوائي قوي)
JWT_SECRET="قم_بوضع_مفتاح_عشوائي_قوي_هنا"

# CORS
CORS_ORIGIN="https://globalpromonetwork.store"

# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="بريدك@gmail.com"
SMTP_PASS="كلمة_مرور_التطبيق"
SMTP_FROM="PromoHive <noreply@globalpromonetwork.store>"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**احفظ الملف**: اضغط `Ctrl+O` ثم `Enter` ثم `Ctrl+X`

### الخطوة 6: تشغيل السكربت التلقائي للنشر

```bash
chmod +x deploy.sh
bash deploy.sh
```

هذا السكربت سيقوم بـ:
- تثبيت جميع الحزم المطلوبة
- إنشاء Prisma Client
- تشغيل migrations قاعدة البيانات
- بناء المشروع
- تشغيل التطبيق على PM2

### الخطوة 7: إعداد Nginx مع الدومين

```bash
sudo nano /etc/nginx/sites-available/promohive
```

انسخ والصق التالي:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name globalpromonetwork.store www.globalpromonetwork.store;

    client_max_body_size 10M;

    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name globalpromonetwork.store www.globalpromonetwork.store;

    # SSL certificates (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/globalpromonetwork.store/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/globalpromonetwork.store/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
    }

    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
    }

    # Error pages
    error_page 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

**احفظ الملف**: `Ctrl+O` ثم `Enter` ثم `Ctrl+X`

تفعيل الموقع:

```bash
sudo ln -s /etc/nginx/sites-available/promohive /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### الخطوة 8: إعداد SSL Certificate (HTTPS)

```bash
sudo apt-get install certbot python3-certbot-nginx -y
sudo certbot --nginx -d globalpromonetwork.store -d www.globalpromonetwork.store
```

اتبع التعليمات للحصول على الشهادة.

### الخطوة 9: التحقق من التشغيل

تحقق من حالة التطبيق:

```bash
pm2 status
pm2 logs
```

تحقق من Nginx:

```bash
sudo systemctl status nginx
```

---

## ✅ تم النشر بنجاح!

الآن يمكنك الوصول للتطبيق على: **https://globalpromonetwork.store**

---

## 🔄 تحديث المشروع (عندما يحدث تغيير في الكود)

عند رفع كود جديد على GitHub:

```bash
cd /var/www/promohive
git pull origin main
npm install
npx prisma generate
npm run build
pm2 restart ecosystem.config.js
```

أو استخدم السكربت التلقائي:

```bash
bash deploy.sh
```

---

## 📊 أوامر مفيدة

### PM2 (إدارة التطبيق)

```bash
pm2 status              # عرض حالة التطبيقات
pm2 logs promohive-server   # عرض السجلات
pm2 restart all         # إعادة تشغيل جميع التطبيقات
pm2 stop all           # إيقاف جميع التطبيقات
pm2 monit              # مراقبة الأداء
```

### قاعدة البيانات

```bash
npm run prisma:studio  # فتح Prisma Studio لإدارة قاعدة البيانات
sudo systemctl status postgresql  # التحقق من PostgreSQL
```

### Nginx

```bash
sudo systemctl reload nginx    # إعادة تحميل الإعدادات
sudo systemctl restart nginx   # إعادة تشغيل Nginx
sudo nginx -t                   # التحقق من صحة الإعدادات
sudo tail -f /var/log/nginx/error.log  # عرض سجلات الأخطاء
```

---

## 🔒 الأمان

### 1. إعداد Firewall

```bash
sudo ufw status
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### 2. تحديث النظام بانتظام

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. نسخ احتياطي

قم بعمل نسخ احتياطي لقاعدة البيانات:

```bash
sudo -u postgres pg_dump promohive > backup.sql
```

---

## 🆘 حل المشاكل

### التطبيق لا يعمل

```bash
pm2 logs promohive-server
pm2 restart promohive-server
```

### خطأ في قاعدة البيانات

```bash
sudo systemctl status postgresql
sudo -u postgres psql -c "\l"
```

### بورت مستخدم

```bash
sudo lsof -i :3002
sudo kill -9 <PID>
```

### خطأ Nginx 502

```bash
# تحقق من التطبيق
pm2 status

# تحقق من السجلات
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🌐 الوصول إلى التطبيق

- **الرئيسي**: https://globalpromonetwork.store
- **WWW**: https://www.globalpromonetwork.store
- **لوحة التحكم**: https://globalpromonetwork.store/dashboard
- **الأدمن**: https://globalpromonetwork.store/admin

---

## 📝 ملاحظات مهمة

1. **بيانات الادمن**: يتم إنشاؤها تلقائياً عند first seed
2. **JWT_SECRET**: قم بتغييره إلى مفتاح عشوائي قوي
3. **البريد الإلكتروني**: قم بإعداد SMTP للإشعارات
4. **النسخ الاحتياطي**: قم بجدولة نسخ احتياطي يومي
5. **SSL**: تم إعداده تلقائياً بواسطة Certbot

---

## ✅ قائمة التحقق النهائية

- [ ] تم تثبيت جميع المتطلبات
- [ ] تم إعداد قاعدة البيانات
- [ ] تم تحميل المشروع من GitHub
- [ ] تم إعداد ملف .env
- [ ] تم تشغيل التطبيق على PM2
- [ ] تم إعداد Nginx مع الدومين
- [ ] تم إعداد SSL (HTTPS)
- [ ] تم فتح الجدار الناري للمنافذ
- [ ] التطبيق يعمل وجاهز للاستخدام

---

## 🎉 مبروك! تم نشر PromoHive بنجاح! 🎉

للأسئلة أو الدعم، راجع الملفات التالية:
- `DEPLOYMENT_COMPLETE.md` - النسخة الإنجليزية
- `README.md` - وثائق المشروع
- سجلات التطبيق في `/var/www/promohive/logs/`

