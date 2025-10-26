#!/bin/bash

echo "======================================"
echo "🧹 تنظيف كامل وإعادة بناء"
echo "======================================"
echo ""

cd /var/www/promohive

echo "1. سحب التحديثات..."
git pull origin main

echo ""
echo "2. حذف dist و node_modules/.cache..."
rm -rf dist
rm -rf node_modules/.cache

echo ""
echo "3. إعادة بناء كامل..."
npm run build

echo ""
echo "4. التحقق من dist/index.js..."
if grep -q "app.set('trust proxy', 1)" dist/index.js; then
    echo "✅ الكود الجديد موجود!"
else
    echo "❌ الكود القديم موجود!"
fi

echo ""
echo "5. إعادة تشغيل التطبيق..."
pm2 restart promohive-server
pm2 save

echo ""
echo "6. التحقق من السجلات الجديدة..."
sleep 3
pm2 logs promohive-server --lines 10 --nostream

echo ""
echo "======================================"
echo "✅ تم التنظيف وإعادة البناء!"
echo "======================================"

