#!/bin/bash

echo "Fixing App.tsx encoding directly..."

cd /var/www/promohive

# Pull latest changes
git pull origin main

# Fix BOM and encoding issues in App.tsx
node -e "
const fs = require('fs');
try {
  let content = fs.readFileSync('src/App.tsx', 'utf8');
  // Remove BOM
  content = content.replace(/^\uFEFF/, '');
  // Remove any invisible characters at the start
  content = content.replace(/^[\x00-\x20]+/, '');
  fs.writeFileSync('src/App.tsx', content);
  console.log('Fixed App.tsx encoding');
} catch(e) {
  console.error('Error:', e.message);
}
"

# Remove dist and rebuild
rm -rf dist
npm run build

# Restart
pm2 restart promohive-server
pm2 save

echo "Done!"

