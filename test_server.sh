#!/bin/bash

echo "=== اختبار حالة قاعدة البيانات ==="
cd /var/www/promohive
npm run prisma:studio
