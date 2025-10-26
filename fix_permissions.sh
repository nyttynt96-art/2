#!/bin/bash

echo "🔧 Fixing Database Permissions..."
echo "===================================="

# Grant all privileges
sudo -u postgres psql << 'SQL'
-- Grant usage and create on schema
GRANT USAGE ON SCHEMA public TO promohive;
GRANT CREATE ON SCHEMA public TO promohive;

-- Grant privileges on database
GRANT ALL PRIVILEGES ON DATABASE promohive TO promohive;

-- Connect to database and grant on all tables
\c promohive

-- Grant privileges on all tables in public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO promohive;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO promohive;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO promohive;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO promohive;

-- Make promohive owner of public schema
ALTER SCHEMA public OWNER TO promohive;
SQL

cd /var/www/promohive

# Now run Prisma migrations
echo ""
echo "Running Prisma migrations..."
npx prisma db push --accept-data-loss --force-reset || echo "Migration failed"

# Create admin
echo ""
echo "Creating admin user..."
node setup_admin.js

echo "✅ Done!"

