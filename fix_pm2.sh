#!/bin/bash

echo "=== حالة PM2 الحالية ==="
pm2 list

echo ""
echo "=== إعادة تشغيل جميع التطبيقات ==="
pm2 restart all
pm2 save

echo ""
echo "=== حالة PM2 بعد التشغيل ==="
pm2 status

echo ""
echo "=== السجلات الأخيرة ==="
pm2 logs --lines 20

