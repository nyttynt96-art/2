#!/bin/bash

cd /var/www/promohive

echo "1. Pulling latest changes..."
git pull origin main

echo "2. Getting clean App.tsx..."
# Use the version from before the problem
git show dc6a4eb~5:src/App.tsx > src/App.tsx 2>/dev/null || git show HEAD~20:src/App.tsx > src/App.tsx

echo "3. Removing old dist..."
rm -rf dist

echo "4. Building..."
npm run build

echo "5. Restarting PM2..."
pm2 restart promohive-server
pm2 save

echo "Done!"

