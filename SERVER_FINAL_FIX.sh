#!/bin/bash

cd /var/www/promohive

echo "==========================================="
echo "إصلاح نهائي لملف App.tsx وإزالة BOM"
echo "==========================================="

# Save backup
cp src/App.tsx src/App.tsx.backup

# Remove BOM using dd
echo "1. إزالة BOM باستخدام dd..."
dd if=src/App.tsx of=src/App.tsx.noBOM bs=1 skip=3 2>/dev/null
if [ -f src/App.tsx.noBOM ]; then
    mv src/App.tsx.noBOM src/App.tsx
fi

# Alternative: use tail
echo "2. إزالة BOM باستخدام tail..."
tail -c +4 src/App.tsx > src/App.tsx.tmp 2>/dev/null
if [ -f src/App.tsx.tmp ]; then
    mv src/App.tsx.tmp src/App.tsx
fi

# Check if BOM exists
echo ""
echo "3. التحقق من BOM (يجب ألا تظهر ef bb bf):"
head -c 3 src/App.tsx | od -An -tx1 || true

# Pull latest changes
echo ""
echo "4. سحب أحدث التحديثات..."
git stash 2>/dev/null || true
git pull origin main

# Build
echo ""
echo "5. بناء التطبيق..."
npm run build

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "✅ البناء نجح!"
else
    echo "❌ البناء فشل، استخدام النسخة الاحتياطية..."
    cp src/App.tsx.backup src/App.tsx
    npm run build
fi

# Restart
echo ""
echo "6. إعادة تشغيل PM2..."
pm2 restart promohive-server
pm2 save

# Show logs
echo ""
echo "7. السجلات (آخر 20 سطر):"
sleep 2
pm2 logs promohive-server --lines 20 --nostream

echo ""
echo "✅ تم!"

