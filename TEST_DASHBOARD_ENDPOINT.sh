#!/bin/bash

echo "Testing dashboard endpoint with different scenarios..."

echo ""
echo "1. Without authentication:"
curl -i https://globalpromonetwork.store/api/user/dashboard 2>&1 | grep -E "HTTP|Location|Set-Cookie|error"

echo ""
echo "2. With test user cookies:"
curl -i -H "Cookie: $(cat cookies.txt 2>/dev/null || echo '')" \
  https://globalpromonetwork.store/api/user/dashboard 2>&1 | grep -E "HTTP|error" | head -5

echo ""
echo "3. Backend logs show:"
pm2 logs promohive-server --lines 10 --nostream | grep -i "dashboard\|user\|auth"

