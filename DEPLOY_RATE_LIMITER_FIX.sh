#!/bin/bash

echo "==========================================="
echo "تطبيق إصلاح معدل الطلبات (Rate Limiter Fix)"
echo "==========================================="
echo ""

cd /var/www/promohive

echo "1. سحب التحديثات من GitHub..."
git pull origin main

echo ""
echo "2. بناء التطبيق..."
npm run build

echo ""
echo "3. إعادة تشغيل التطبيق..."
pm2 restart promohive-server

echo ""
echo "4. حفظ حالة PM2..."
pm2 save

echo ""
echo "5. عرض أحدث 30 سطر من السجلات..."
echo "==========================================="
pm2 logs promohive-server --lines 30 --nostream

echo ""
echo "✅ تم تطبيق الإصلاح بنجاح!"
echo ""
echo "تحقق من عدم وجود أخطاء ERR_ERL_PERMISSIVE_TRUST_PROXY في السجلات أعلاه."

