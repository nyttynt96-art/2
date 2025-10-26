#!/bin/bash

cd /var/www/promohive

echo "==========================================="
echo "إصلاح كامل لملف App.tsx"
echo "==========================================="

# حفظ الملف بدون BOM
echo "1. قراءة الملف وإعادة كتابته بدون BOM..."
cat src/App.tsx | sed '1s/^\xEF\xBB\xBF//' > src/App.tsx.tmp
mv src/App.tsx.tmp src/App.tsx

# التحقق من BOM
echo ""
echo "2. التحقق من أول 3 بايتات (يجب ألا تظهر ef bb bf):"
head -c 3 src/App.tsx | od -An -tx1

# إذا استمرت المشكلة، استخدم head وtail
if head -c 3 src/App.tsx | od -An -tx1 | grep -q "ef bb bf"; then
    echo "3. محاولة طريقة أخرى لإزالة BOM..."
    tail -c +4 src/App.tsx > src/App.tsx.tmp
    mv src/App.tsx.tmp src/App.tsx
fi

# التحقق مرة أخرى
echo ""
echo "4. التحقق النهائي:"
head -c 3 src/App.tsx | od -An -tx1

# سحب التحديثات
echo ""
echo "5. سحب التحديثات..."
git stash 2>/dev/null
git pull origin main

# بناء
echo ""
echo "6. بناء التطبيق..."
npm run build

# إعادة تشغيل
echo ""
echo "7. إعادة تشغيل PM2..."
pm2 restart promohive-server
pm2 save

# السجلات
echo ""
echo "8. السجلات..."
sleep 2
pm2 logs promohive-server --lines 30 --nostream

