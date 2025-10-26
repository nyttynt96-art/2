#!/bin/bash

echo "======================================"
echo "🚀 نشر PromoHive - البناء الكامل"
echo "======================================"
echo ""

cd /var/www/promohive

echo "📥 سحب التحديثات من Git..."
git pull origin main

echo ""
echo "📦 تحديث المكتبات..."
npm install

echo ""
echo "🔨 بناء المشروع..."
npm run build

echo ""
echo "🔄 إعادة تشغيل التطبيق..."
pm2 restart promohive-server
pm2 save

echo ""
echo "✅ تم النشر بنجاح!"
echo ""
echo "📊 حالة PM2:"
pm2 status

echo ""
echo "📋 السجلات الأخيرة:"
pm2 logs promohive-server --lines 10 --nostream

echo ""
echo "======================================"
echo "🌐 الموقع جاهز على: https://globalpromonetwork.store"
echo "======================================"

