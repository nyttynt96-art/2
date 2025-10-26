#!/bin/bash

echo "Fixing App.tsx encoding on server..."

cd /var/www/promohive

# Remove BOM from App.tsx
sed -i '1s/^\xEF\xBB\xBF//' src/App.tsx

# Or use a more robust approach with node
node -e "
const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/^\uFEFF/, '').replace(/^/, '');
fs.writeFileSync('src/App.tsx', content);
console.log('Fixed encoding issues');
"

echo "Rebuilding..."
npm run build

echo "Restarting..."
pm2 restart promohive-server

echo "Done!"

