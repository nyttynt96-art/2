#!/bin/bash

echo "Testing Dashboard API endpoint..."

# Test the dashboard API
curl -i -X GET 'https://globalpromonetwork.store/api/user/dashboard' \
  -H 'Content-Type: application/json' \
  --cookie-jar cookies.txt \
  --cookie cookies.txt

echo ""
echo "If you get 401, you need to login first."
echo "To login, run:"
echo "curl -X POST 'https://globalpromonetwork.store/api/auth/login' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"test@test.com\",\"password\":\"test123456\"}' \\"
echo "  --cookie-jar cookies.txt \\"
echo "  --cookie cookies.txt"

