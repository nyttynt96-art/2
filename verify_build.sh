#!/bin/bash

echo "=== التحقق من البناء الجديد ==="
cd /var/www/promohive

echo "1. التحقق من trust proxy في dist/index.js:"
grep -n "trust proxy" dist/index.js | head -3

echo ""
echo "2. التحقق من وقت الملفات:"
ls -lh dist/index.js

echo ""
echo "3. السجلات الجديدة:"
pm2 logs promohive-server --lines 5 --nostream

