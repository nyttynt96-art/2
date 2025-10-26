#!/bin/bash

cd /var/www/promohive

echo "==========================================="
echo "إصلاح مشكلة BOM في App.tsx وإعادة البناء"
echo "==========================================="
echo ""

echo "1. إزالة BOM من App.tsx..."
sed -i '1s/^\xEF\xBB\xBF//' src/App.tsx

echo ""
echo "2. التحقق من src/index.ts (Rate Limiter fix)..."
if grep -q "keyGenerator" src/index.ts; then
    echo "✅ Rate Limiter fix موجود"
else
    echo "❌ Rate Limiter fix غير موجود - يحتاج git pull"
    git pull origin main
fi

echo ""
echo "3. بناء التطبيق..."
npm run build

echo ""
echo "4. إعادة تشغيل التطبيق..."
pm2 restart promohive-server

echo ""
echo "5. حفظ حالة PM2..."
pm2 save

echo ""
echo "6. عرض السجلات..."
echo "==========================================="
sleep 2
pm2 logs promohive-server --lines 50 --nostream

echo ""
echo "✅ تم!"
echo ""
echo "يجب ألا تظهر أخطاء BOM ولا أخطاء ERR_ERL_PERMISSIVE_TRUST_PROXY."

