#!/bin/bash

cd /var/www/promohive

echo "==========================================="
echo "إصلاح BOM والبناء المباشر"
echo "==========================================="

# 1. حفظ نسخة احتياطية
cp src/App.tsx src/App.tsx.backup.$(date +%s)

# 2. إزالة BOM باستخدام tail (الطريقة المؤكدة)
echo ""
echo "1. إزالة BOM من App.tsx..."
tail -c +4 src/App.tsx > src/App.tsx.tmp
if [ $? -eq 0 ] && [ -s src/App.tsx.tmp ]; then
    mv src/App.tsx.tmp src/App.tsx
    echo "✅ تم إزالة BOM بنجاح"
else
    echo "⚠️ استعادة النسخة الاحتياطية"
    cp src/App.tsx.backup.* src/App.tsx
fi

# 3. التحقق من وجود BOM
echo ""
echo "2. التحقق من BOM (يجب ألا تظهر ef bb bf):"
head -c 3 src/App.tsx | od -An -tx1

# 4. بناء التطبيق
echo ""
echo "3. بناء التطبيق..."
npm run build

# 5. التحقق من نجاح البناء
if [ $? -eq 0 ]; then
    echo "✅ البناء نجح!"
    
    # 6. إعادة تشغيل PM2
    echo ""
    echo "4. إعادة تشغيل PM2..."
    pm2 restart promohive-server
    pm2 save
    
    # 7. عرض السجلات
    echo ""
    echo "5. السجلات (آخر 30 سطر):"
    sleep 2
    pm2 logs promohive-server --lines 30 --nostream
    
    echo ""
    echo "✅ تم بنجاح!"
else
    echo "❌ البناء فشل!"
    echo "استعادة النسخة الاحتياطية..."
    cp src/App.tsx.backup.* src/App.tsx
    npm run build
fi

