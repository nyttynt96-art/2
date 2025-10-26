# 🌐 إعداد DNS للدومين globalpromonetwork.store

## ✅ معلومات الخوادم

تم تفعيل Cloudflare على الدومين، والخوادم الحالية:
- **Primary Nameserver**: `bingo.ns.cloudflare.com`
- **Secondary Nameserver**: `mack.ns.cloudflare.com`

---

## 📋 سجلات DNS المطلوبة على Cloudflare

قم بتسجيل الدخول إلى [Cloudflare Dashboard](https://dash.cloudflare.com) واذهب للدومين `globalpromonetwork.store`

### السجلات المطلوبة:

#### 1. A Record (IPv4) - الرئيسي
```
Type: A
Name: @
Content: 72.60.215.2
Proxy status: ✓ Proxied (Orange Cloud)
TTL: Auto
```

#### 2. A Record - www
```
Type: A
Name: www
Content: 72.60.215.2
Proxy status: ✓ Proxied (Orange Cloud)
TTL: Auto
```

---

## 🔧 خطوات الإعداد على Cloudflare

### الخطوة 1: الدخول لـ Cloudflare
1. اذهب إلى: https://dash.cloudflare.com
2. اختر الدومين: `globalpromonetwork.store`
3. اضغط على "DNS" من القائمة الجانبية

### الخطوة 2: إضافة A Record الرئيسي
1. اضغط "Add record"
2. اختر النوع: `A`
3. Name: `@`
4. IPv4 address: `72.60.215.2`
5. **Proxy status**: ✓ Proxied (Orange Cloud) - **مهم جداً**
6. TTL: Auto
7. اضغط "Save"

### الخطوة 3: إضافة A Record للـ www
1. اضغط "Add record"
2. اختر النوع: `A`
3. Name: `www`
4. IPv4 address: `72.60.215.2`
5. **Proxy status**: ✓ Proxied (Orange Cloud) - **مهم جداً**
6. TTL: Auto
7. اضغط "Save"

---

## ⚠️ إعدادات SSL/TLS على Cloudflare

### الخطوة 4: إعداد SSL/TLS
1. اذهب إلى `SSL/TLS` في القائمة الجانبية
2. Encryption mode: اختر **"Full"** أو **"Full (strict)"**
   - Full: سريع وإخفاء الطلب
   - Full (strict): الأكثر أماناً (يتطلب شهادة SSL من السيرفر)

**مقترح للبداية**: استخدم `Full`

### الخطوة 5: إعدادات إضافية
1. **SSL/TLS** → **Edge Certificates**: تأكد أن "Always Use HTTPS" مفعل
2. **SSL/TLS** → **Origin Server**: 
   - خذ الشهادة من Cloudflare للسيرفر (اختياري ولكن موصى به)
   - أو استخدم Let's Encrypt على السيرفر

---

## 🔒 الأمان (Security)

### في قسم Security → Settings:

1. **Security Level**: Medium (متوازن)
2. **WAF (Web Application Firewall)**: مفعل
   - يساعد في حماية الموقع من الهجمات
3. **Rate Limiting**: مفعل
   - يحد من محاولات الدخول المتكررة
4. **Bot Fight Mode**: مفعل
   - يحمي من البوتات الضارة

---

## 🌍 التوجيه (Routing) - اختياري

### في قسم Routing → Page Rules:
لإعادة توجيه HTTP إلى HTTPS (لو لم يكن مفعل تلقائياً):

```
Rule Name: Force HTTPS
URL Pattern: http://globalpromonetwork.store/*
Setting: Always Use HTTPS
Status: ✓ Enabled
```

---

## 📊 نموذج السجلات النهائية على Cloudflare

بعد الإعداد، يجب أن تبدو القائمة كالتالي:

```
DNS Records:
┌─────────────────────────────────────────────────────────────┐
│ Type │ Name │ Content    │ Proxy │ TTL │ Status │
├──────┼──────┼────────────┼───────┼─────┼────────┤
│ A    │ @    │ 72.60.215.2│   ✓   │Auto │ Active │
│ A    │ www  │ 72.60.215.2│   ✓   │Auto │ Active │
└─────────────────────────────────────────────────────────────┘
```

---

## ⏱️ وقت الانتشار (Propagation)

بعد إضافة السجلات:
- ⏱️ **الوقت المتوقع**: 5-30 دقيقة (مع Cloudflare Proxy)
- 🌍 **الانتشار الكامل**: قد يصل إلى 48 ساعة (نادراً)

**للتحقق**:
```bash
# افحص السجلات
nslookup globalpromonetwork.store
dig globalpromonetwork.store
```

---

## ✅ قائمة التحقق

- [ ] تم إضافة A Record للـ `@` 
- [ ] تم إضافة A Record للـ `www`
- [ ] تم تفعيل Cloudflare Proxy (Orange Cloud)
- [ ] تم إعداد SSL/TLS على Full
- [ ] تم تفعيل "Always Use HTTPS"
- [ ] تم تفعيل WAF
- [ ] انتظار الانتشار (5-30 دقيقة)

---

## 🔍 التحقق من الإعداد

### من الخادم:
```bash
# تحقق من Nginx
sudo nginx -t

# تحقق من التطبيق
pm2 status

# تحقق من SSL
sudo certbot certificates
```

### من المتصفح:
1. افتح: `https://globalpromonetwork.store`
2. اضغط على أيقونة القفل في شريط العنوان
3. تحقق أن الشهادة صالحة

---

## 🆘 حل المشاكل

### الدومين لا يعمل بعد الانتشار
```bash
# تحقق من السجلات
nslookup globalpromonetwork.store
ping globalpromonetwork.store

# تحقق من Nginx على السيرفر
sudo systemctl status nginx
```

### SSL Certificate غير صالح
```bash
# على السيرفر، نفذ:
sudo certbot renew
sudo systemctl reload nginx
```

### Cloudflare 502 Bad Gateway
- تحقق أن التطبيق يعمل: `pm2 status`
- تحقق من logs: `pm2 logs`
- تحقق من Nginx: `sudo systemctl status nginx`

---

## 📝 ملاحظات مهمة

1. **Cloudflare Proxy**: 
   - يساعد في تحسين الأداء
   - يوفر DDoS Protection
   - يخفّض تحميل السيرفر

2. **SSL Mode: Full**:
   - Cloudflare يوفر شهادة للزوار
   - السيرفر يحتاج شهادة SSL (من Let's Encrypt)

3. **التجديد التلقائي**:
   - Let's Encrypt يجدد تلقائياً كل 90 يوم
   - Cloudflare يدير الشهادات تلقائياً

---

## ✅ مبروك! DNS جاهز

بعد الانتشار، الموقع سيكون متاحاً على:
- ✅ https://globalpromonetwork.store
- ✅ https://www.globalpromonetwork.store

---

## 🚀 الخطوة التالية

بعد تأكد أن DNS يعمل:

1. **على السيرفر**: نفذ سكربت النشر
```bash
ssh root@72.60.215.2
cd /var/www/promohive
bash deploy.sh
```

2. **إعداد SSL**: 
```bash
sudo certbot --nginx -d globalpromonetwork.store -d www.globalpromonetwork.store
```

3. **التحقق النهائي**:
```bash
curl https://globalpromonetwork.store
```

---

## 📞 الدعم

- Cloudflare Support: https://support.cloudflare.com
- Documentation: deployment-arabic.md
- Server Status: `pm2 monit` على السيرفر

