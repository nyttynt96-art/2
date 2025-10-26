#!/bin/bash

cd /var/www/promohive

echo "==========================================="
echo "إزالة BOM من App.tsx على السيرفر"
echo "==========================================="

# Method 1: استخدام sed لإزالة BOM
echo "1. محاولة إزالة BOM باستخدام sed..."
sed -i '1s/^\xEF\xBB\xBF//' src/App.tsx

# Method 2: إذا لم ينجح sed، استخدم tail
echo "2. محاولة إزالة BOM باستخدام tail..."
head -c 3 src/App.tsx | od -An -tx1 | grep -q "ef bb bf" && tail -c +4 src/App.tsx > src/App.tsx.tmp && mv src/App.tsx.tmp src/App.tsx

# Method 3: استخدام iconv لإعادة كتابة الملف
echo "3. إعادة كتابة الملف باستخدام iconv..."
iconv -f UTF-8 -t UTF-8 src/App.tsx > src/App.tsx.tmp 2>/dev/null && mv src/App.tsx.tmp src/App.tsx

# Method 4: استخدام dos2unix إذا كان متوفراً
if command -v dos2unix &> /dev/null; then
    echo "4. استخدام dos2unix..."
    dos2unix src/App.tsx 2>/dev/null
fi

# Method 5: استخدام awk لإزالة BOM
echo "5. إزالة BOM باستخدام awk..."
awk 'NR==1{sub(/^\xef\xbb\xbf/,"")}{print}' src/App.tsx > src/App.tsx.tmp && mv src/App.tsx.tmp src/App.tsx

echo ""
echo "6. سحب التحديثات من GitHub..."
git stash 2>/dev/null
git pull origin main

echo ""
echo "7. التحقق من محتوى الملف (الأحرف الثلاثة الأولى)..."
head -c 3 src/App.tsx | od -An -tx1

echo ""
echo "8. بناء التطبيق..."
npm run build

echo ""
echo "9. إعادة تشغيل PM2..."
pm2 restart promohive-server
pm2 save

echo ""
echo "10. عرض السجلات..."
sleep 2
pm2 logs promohive-server --lines 30 --nostream

echo ""
echo "✅ تم!"

