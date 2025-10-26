#!/bin/bash

echo "Final fix for App.tsx..."

cd /var/www/promohive

# Delete the problematic App.tsx
rm src/App.tsx

# Get clean version from git
git show dc6a4eb:src/App.tsx > src/App.tsx

# Verify the file
if [ -s src/App.tsx ]; then
  echo "✓ Got clean App.tsx"
  
  # Rebuild
  rm -rf dist
  npm run build
  
  # Restart
  pm2 restart promohive-server
  pm2 save
  
  echo "✓ Done!"
else
  echo "✗ Failed to get clean version"
fi

