#!/bin/bash

echo "=== Backend Status Check ==="

echo ""
echo "1. PM2 Status:"
pm2 list

echo ""
echo "2. PM2 Logs (last 50 lines):"
pm2 logs promohive-server --lines 50 --nostream

echo ""
echo "3. Testing API endpoint:"
curl -v http://localhost:3002/health 2>&1

echo ""
echo "4. Checking if backend routes exist:"
ls -la dist/ | grep -E "index|routes"

