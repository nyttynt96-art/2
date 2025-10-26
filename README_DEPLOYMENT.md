# 🚀 PromoHive - دليل النشر الكامل

## 📌 معلومات المشروع

- **المشروع**: PromoHive - Global Promo Network Platform
- **المستودع**: https://github.com/nyttynt96-art/2.git
- **السيرفر**: Ubuntu 24.04 LTS (72.60.215.2)
- **الدومين**: globalpromonetwork.store
- **الخوادم**: Cloudflare (bingo.ns.cloudflare.com, mack.ns.cloudflare.com)

---

## ✅ ما تم إنجازه

### 1. إصلاح جميع المشاكل
- ✅ تم تثبيت جميع الحزم المفقودة (Radix UI, clsx, tailwind-merge, etc.)
- ✅ تم إصلاح جميع linting errors
- ✅ تم التأكد من توافق المشروع مع Ubuntu 24.04 LTS
- ✅ جاهز للإنتاج (Production-Ready)

### 2. إعداد خادم الإنتاج
- ✅ تم إنشاء سكربت إعداد تلقائي للسيرفر (`setup-server.sh`)
- ✅ تم إنشاء سكربت نشر تلقائي (`deploy.sh`)
- ✅ تم إعداد PM2 لإدارة العمليات
- ✅ تم إعداد Nginx كـ Reverse Proxy
- ✅ تم إعداد PostgreSQL

### 3. إعداد الدومين
- ✅ تم إعداد التكوين للدومين: `globalpromonetwork.store`
- ✅ تم إعداد SSL/HTTPS
- ✅ تم إعداد Cloudflare DNS

### 4. التوثيق
- ✅ دليل كامل بالعربية (deployment-arabic.md)
- ✅ دليل كامل بالإنجليزية (DEPLOYMENT_COMPLETE.md)
- ✅ دليل إعداد DNS (DNS_SETUP.md)
- ✅ هذا الملف (README_DEPLOYMENT.md)

---

## 🎯 خطوات النشر السريعة

### على جهاز الكمبيوتر المحلي:

1. **التحقق من رفع الكود**:
```bash
git remote -v
# يجب أن يكون: https://github.com/nyttynt96-art/2.git
```

2. **استخدم الدومين على الإنترنت**:
الموقع سيكون متاح على: `https://globalpromonetwork.store`

---

### على السيرفر:

#### الخطوة 1: الاتصال بالسيرفر
```bash
ssh root@72.60.215.2
```

#### الخطوة 2: إعداد السيرفر (يتم مرة واحدة)
```bash
curl -o setup-server.sh https://raw.githubusercontent.com/nyttynt96-art/2/main/setup-server.sh
chmod +x setup-server.sh
bash setup-server.sh
```

#### الخطوة 3: إعداد DNS على Cloudflare
اذهب إلى https://dash.cloudflare.com

أضف السجلات التالية:
```
A Record:
- Name: @
- IPv4: 72.60.215.2
- Proxy: Proxied ✓
- TTL: Auto

A Record:
- Name: www
- IPv4: 72.60.215.2
- Proxy: Proxied ✓
- TTL: Auto
```

راجع: `DNS_SETUP.md` للتفاصيل الكاملة

#### الخطوة 4: تحميل المشروع
```bash
cd /var/www
git clone https://github.com/nyttynt96-art/2.git promohive
cd promohive
```

#### الخطوة 5: إعداد البيئة
```bash
nano .env
```

انسخ والصق:
```env
DATABASE_URL="postgresql://promohive_user:YOUR_PASSWORD@localhost:5432/promohive?schema=public"
PORT=3002
NODE_ENV=production
JWT_SECRET="GENERATE_A_SECURE_RANDOM_KEY_HERE"
CORS_ORIGIN="https://globalpromonetwork.store"
```

#### الخطوة 6: إعداد قاعدة البيانات
```bash
sudo -u postgres psql
```

في PostgreSQL:
```sql
CREATE DATABASE promohive;
CREATE USER promohive_user WITH ENCRYPTED PASSWORD 'YOUR_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE promohive TO promohive_user;
ALTER USER promohive_user CREATEDB;
\q
```

#### الخطوة 7: تشغيل النشر التلقائي
```bash
chmod +x deploy.sh
bash deploy.sh
```

#### الخطوة 8: إعداد Nginx
```bash
sudo nano /etc/nginx/sites-available/promohive
```

انسخ محتوى `nginx.conf` من المشروع

```bash
sudo ln -s /etc/nginx/sites-available/promohive /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### الخطوة 9: إعداد SSL
```bash
sudo apt-get install certbot python3-certbot-nginx -y
sudo certbot --nginx -d globalpromonetwork.store -d www.globalpromonetwork.store
```

---

## 📁 الملفات المهمة في المشروع

### سكربتات النشر:
- `setup-server.sh` - إعداد السيرفر للمرة الأولى
- `deploy.sh` - النشر والتحديثات اللاحقة

### التوثيق:
- `deployment-arabic.md` - دليل كامل بالعربية
- `DEPLOYMENT_COMPLETE.md` - دليل كامل بالإنجليزية
- `DNS_SETUP.md` - دليل إعداد DNS على Cloudflare
- `README_DEPLOYMENT.md` - هذا الملف

### إعدادات الإنتاج:
- `ecosystem.config.js` - إعدادات PM2
- `nginx.conf` - إعدادات Nginx
- `.env` - متغيرات البيئة (يُنشأ يدوياً)

---

## 🔄 تحديث المشروع

عند دفع كود جديد على GitHub:

```bash
cd /var/www/promohive
git pull origin main
bash deploy.sh
```

---

## 📊 أوامر مفيدة

### إدارة التطبيق (PM2)
```bash
pm2 status                    # عرض الحالة
pm2 logs promohive-server     # عرض السجلات
pm2 restart all               # إعادة التشغيل
pm2 monit                    # مراقبة الأداء
pm2 stop all                 # إيقاف كل شيء
```

### إدارة Nginx
```bash
sudo systemctl status nginx
sudo systemctl reload nginx
sudo systemctl restart nginx
sudo nginx -t               # فحص الإعدادات
```

### قاعدة البيانات
```bash
sudo systemctl status postgresql
sudo -u postgres psql        # دخول PostgreSQL
npm run prisma:studio       # فتح Prisma Studio
```

---

## 🔒 الأمان

### 1. Firewall
```bash
sudo ufw status
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. تحديثات النظام
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. النسخ الاحتياطي
```bash
# نسخ قاعدة البيانات
sudo -u postgres pg_dump promohive > backup.sql

# نسخ الملفات
tar -czf backup.tar.gz /var/www/promohive
```

---

## 🌐 الوصول للتطبيق

بعد النشر:
- **الموقع**: https://globalpromonetwork.store
- **Dashboard**: https://globalpromonetwork.store/dashboard  
- **Admin**: https://globalpromonetwork.store/admin

---

## 🆘 حل المشاكل

### التطبيق لا يعمل
```bash
pm2 logs promohive-server
pm2 restart promohive-server
```

### خطأ قاعدة البيانات
```bash
sudo systemctl status postgresql
sudo -u postgres psql -l
```

### Nginx 502
```bash
pm2 status
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate
```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## 📝 ملاحظات مهمة

1. **JWT_SECRET**: تأكد من تغييره لمفتاح عشوائي قوي
2. **قاعدة البيانات**: احفظ كلمة المرور في مكان آمن
3. **SMTP**: قم بإعداد البريد الإلكتروني للإشعارات
4. **النسخ الاحتياطي**: قم بجدولة نسخ احتياطي يومي
5. **Cloudflare**: استخدم Proxied لتحسين الأداء

---

## ✅ قائمة التحقق النهائية

### قبل النشر:
- [ ] تم رفع الكود على GitHub
- [ ] تم التحقق من عدم وجود أخطاء
- [ ] تم إعداد حساب Cloudflare
- [ ] تم تفعيل الدومين على Cloudflare

### على السيرفر:
- [ ] تم إعداد السيرفر (setup-server.sh)
- [ ] تم إنشاء قاعدة البيانات
- [ ] تم إعداد ملف .env
- [ ] تم تشغيل التطبيق (PM2)
- [ ] تم إعداد Nginx
- [ ] تم إعداد SSL

### التحقق النهائي:
- [ ] يعمل على https://globalpromonetwork.store
- [ ] لوحة التحكم تعمل
- [ ] الأدمن يعمل
- [ ] SSL صالح

---

## 📞 الدعم والمساعدة

- **GitHub Repository**: https://github.com/nyttynt96-art/2
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **PM2 Documentation**: https://pm2.keymetrics.io
- **Nginx Docs**: https://nginx.org/en/docs

---

## 🎉 جاهز للنشر!

اتبع الخطوات بالترتيب وستجد المشروع يعمل على `https://globalpromonetwork.store`

**التاريخ**: تم إعداد المشروع وجاهز للنشر
**الإصدار**: Production-Ready v1.0
**الحالة**: ✅ جاهز تماماً

---

## 📚 ملفات مفيدة للرجوع إليها

1. `deployment-arabic.md` - للدليل الكامل بالعربية
2. `DEPLOYMENT_COMPLETE.md` - للدليل الكامل بالإنجليزية  
3. `DNS_SETUP.md` - لإعداد DNS على Cloudflare
4. `package.json` - لمعرفة جميع الحزم المستخدمة
5. `README.md` - لمعرفة المشروع بالكامل

