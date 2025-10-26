#!/bin/bash

cd /var/www/promohive

echo "==========================================="
echo "حل مشكلة التغييرات المحلية وإعادة التطبيق"
echo "==========================================="
echo ""

echo "1. حفظ التغييرات المحلية..."
git stash

echo ""
echo "2. سحب التحديثات من GitHub..."
git pull origin main

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
echo "6. عرض السجلات (التحقق من عدم وجود أخطاء)..."
echo "==========================================="
sleep 2
pm2 logs promohive-server --lines 30 --nostream

echo ""
echo "✅ تم!"
echo ""
echo "تحقق من عدم وجود أخطاء ERR_ERL_PERMISSIVE_TRUST_PROXY في السجلات أعلاه."

