# الأوامر المباشرة لإصلاح مشكلة BOM

## على السيرفر، نفذ هذه الأوامر واحدة تلو الأخرى:

```bash
cd /var/www/promohive

# 1. استعادة الملف
git checkout src/App.tsx

# 2. إزالة BOM باستخدام awk (الأفضل)
awk 'NR==1{sub(/^\xef\xbb\xbf/,"")}{print}' src/App.tsx > src/App.tsx.tmp
mv src/App.tsx.tmp src/App.tsx

# 3. التحقق من بداية الملف (يجب أن تظهر "i")
head -c 6 src/App.tsx

# 4. بناء التطبيق
npm run build

# 5. إذا نجح البناء، إعادة تشغيل
pm2 restart promohive-server
pm2 save

# 6. عرض السجلات
pm2 logs promohive-server --lines 30 --nostream
```

## إذا فشل الأمر awK، جرب هذا:

```bash
cd /var/www/promohive

# استعادة
git checkout src/App.tsx

# إزالة BOM باستخدام sed
sed -i '1s/^\xEF\xBB\xBF//' src/App.tsx

# بناء
npm run build
pm2 restart promohive-server
pm2 save
```

## ملاحظة:
المشكلة هي أن السيرفر يستخدم repo مختلف (3) بينما نحن نرفع إلى (2).

