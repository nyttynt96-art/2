#!/bin/bash

echo "Checking API status..."

echo ""
echo "1. Checking API endpoint:"
curl -i http://localhost:3002/api/user/dashboard 2>&1 | head -20

echo ""
echo "2. PM2 logs (last 30 lines):"
pm2 logs promohive-server --lines 30 --nostream

echo ""
echo "3. Checking dist folder:"
ls -lh dist/ | head -10

echo ""
echo "4. API routes in built files:"
grep -r "api/user/dashboard" dist/ || echo "Not found in dist"

