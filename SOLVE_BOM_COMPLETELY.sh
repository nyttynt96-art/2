#!/bin/bash

cd /var/www/promohive

echo "==========================================="
echo "حل مشكلة BOM بشكل نهائي"
echo "==========================================="

# الطريقة 1: استخدام sed لإزالة BOM
echo "1. محاولة إزالة BOM باستخدام sed..."
sed -i '1s/^\xEF\xBB\xBF//' src/App.tsx 2>/dev/null || true

# الطريقة 2: استخدام awk
echo "2. محاولة إزالة BOM باستخدام awk..."
awk 'NR==1{sub(/^\xef\xbb\xbf/,"")}{print}' src/App.tsx > src/App.tsx.tmp 2>/dev/null
mv src/App.tsx.tmp src/App.tsx 2>/dev/null || true

# الطريقة 3: استخدام Perl إذا كان متوفراً
if command -v perl &> /dev/null; then
    echo "3. إزالة BOM باستخدام Perl..."
    perl -i -pe 's/^\xef\xbb\xbf//' src/App.tsx 2>/dev/null || true
fi

# التحقق من أول بايت
echo ""
echo "4. التحقق من أول 3 بايتات..."
head -c 3 src/App.tsx | od -An -tx1

# التحقق من أن الملف يبدأ بـ "import"
echo ""
echo "5. التحقق من أول 6 أحرف..."
head -c 6 src/App.tsx

# بناء
echo ""
echo "6. بناء التطبيق..."
npm run build

# إذا نجح البناء
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ البناء نجح!"
    
    # إعادة تشغيل
    echo "7. إعادة تشغيل PM2..."
    pm2 restart promohive-server
    pm2 save
    
    # السجلات
    echo ""
    echo "8. السجلات (آخر 20 سطر)..."
    sleep 2
    pm2 logs promohive-server --lines 20 --nostream
    
    echo ""
    echo "✅ تم بنجاح!"
else
    echo ""
    echo "❌ البناء فشل. محاولة الاستعادة..."
    git checkout src/App.tsx
    
    # محاولة مرة أخرى
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ نجح البناء بعد الاستعادة"
        pm2 restart promohive-server
        pm2 save
    fi
fi

