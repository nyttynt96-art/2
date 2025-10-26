#!/bin/bash

echo "Creating test user..."

# Create user
psql $DATABASE_URL << EOF
INSERT INTO "User" (
  id,
  email,
  username,
  password,
  "fullName",
  role,
  "isApproved",
  "referralCode",
  level,
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'test@test.com',
  'testuser',
  '\$2a\$06\$DC5wMDp7SHG2QqkmeiEqwefkj4oVizvdRNbveN4tZpYT47SWvLPVu',
  'Test User',
  'USER',
  true,
  'TEST123',
  0,
  NOW(),
  NOW()
) RETURNING id;
EOF

# Create wallet for the user
psql $DATABASE_URL << EOF
INSERT INTO "Wallet" (id, "userId", balance, "pendingBalance", "totalEarned", "totalWithdrawn", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 0, 0, 0, 0, NOW(), NOW()
FROM "User" WHERE email = 'test@test.com';
EOF

echo "User created!"
echo "Email: test@test.com"
echo "Password: test123456"

