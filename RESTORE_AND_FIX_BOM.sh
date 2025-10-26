#!/bin/bash

cd /var/www/promohive

echo "==========================================="
echo "استعادة الملف وإزالة BOM بشكل صحيح"
echo "==========================================="

# 1. استعادة الملف الأصلي من Git
echo "1. استعادة الملف من Git..."
git checkout src/App.tsx

# 2. التحقق من BOM
echo ""
echo "2. فحص BOM (الأول بايتات)..."
head -c 3 src/App.tsx | od -An -tx1

# 3. إزالة BOM باستخدام awk
echo ""
echo "3. إزالة BOM باستخدام awk..."
awk 'NR==1{sub(/^\xef\xbb\xbf/,"")}{print}' src/App.tsx > src/App.tsx.tmp
if [ -s src/App.tsx.tmp ]; then
    mv src/App.tsx.tmp src/App.tsx
    echo "✅ تم إزالة BOM"
else
    echo "❌ فشل - استعادة الأصل"
    git checkout src/App.tsx
fi

# 4. التحقق من بداية الملف
echo ""
echo "4. التحقق من أول 6 أحرف (يجب أن تكون 'import'):"
head -c 6 src/App.tsx

# 5. بناء التطبيق
echo ""
echo "5. بناء التطبيق..."
npm run build

# 6. إذا نجح، إعادة تشغيل
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ البناء نجح!"
    echo "6. إعادة تشغيل PM2..."
    pm2 restart promohive-server
    pm2 save
    
    echo ""
    echo "7. السجلات (آخر 30 سطر)..."
    sleep 2
    pm2 logs promohive-server --lines 30 --nostream
    
    echo ""
    echo "✅ تم بنجاح!"
else
    echo ""
    echo "❌ البناء فشل"
fi

