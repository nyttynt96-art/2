#!/bin/bash

echo "======================================"
echo "🔄 إعادة بناء كاملة من الصفر"
echo "======================================"
echo ""

cd /var/www/promohive

echo "1. إيقاف التطبيق..."
pm2 stop promohive-server

echo ""
echo "2. حذف كل شيء وإعادة البدء..."
rm -rf dist
rm -rf node_modules
rm -rf .next
rm -rf .cache

echo ""
echo "3. سحب الكود من Git..."
git fetch origin main
git reset --hard origin/main
git clean -fd

echo ""
echo "4. إعادة تثبيت المكتبات..."
npm install

echo ""
echo "5. بناء المشروع من الصفر..."
npm run build

echo ""
echo "6. التحقق من dist/index.js..."
if grep -A2 "trust proxy" dist/index.js | grep -q "app.set('trust proxy', 1)"; then
    echo "✅ الكود الصحيح موجود: trust proxy = 1"
else
    echo "❌ مشكلة في الكود!"
    grep -A2 "trust proxy" dist/index.js
fi

echo ""
echo "7. إعادة تشغيل التطبيق..."
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "8. انتظار 5 ثواني..."
sleep 5

echo ""
echo "9. السجلات الجديدة:"
pm2 logs promohive-server --lines 10 --nostream

echo ""
echo "======================================"
echo "✅ تمت إعادة البناء الكاملة!"
echo "======================================"
echo "🌐 جرب الموقع الآن: https://globalpromonetwork.store"
echo ""

