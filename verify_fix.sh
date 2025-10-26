#!/bin/bash

cd /var/www/promohive

echo "=== التحقق من dist/index.js ==="
grep -B2 -A2 "trust proxy" dist/index.js

echo ""
echo "=== تصحيح مباشر في dist/index.js ==="
sed -i "s/app.set('trust proxy', true)/app.set('trust proxy', 1)/g" dist/index.js

echo "✅ تم التصحيح"
echo ""
echo "=== التحقق من التصحيح ==="
grep -B2 -A2 "trust proxy" dist/index.js

echo ""
echo "=== إعادة تشغيل التطبيق ==="
pm2 restart promohive-server
pm2 save

