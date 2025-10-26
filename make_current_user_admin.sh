#!/bin/bash

echo "🔧 Making Current User Admin..."
echo "===================================="

cd /var/www/promohive

echo ""
echo "Please enter your email address:"
read USER_EMAIL

if [ -z "$USER_EMAIL" ]; then
    echo "❌ Email is required!"
    exit 1
fi

# Update user to SUPER_ADMIN
sudo -u postgres psql promohive -c "UPDATE \"User\" SET role='SUPER_ADMIN', \"isApproved\"=true WHERE email='$USER_EMAIL';"

# Show result
echo ""
echo "✅ Updated user:"
sudo -u postgres psql promohive -c "SELECT email, role, \"isApproved\" FROM \"User\" WHERE email='$USER_EMAIL';"

echo ""
echo "✅ Done! You can now access admin panel."
echo "Go to: https://globalpromonetwork.store/admin"

