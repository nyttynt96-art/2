# Create Test User Directly on Server

Run these commands on the server:

```bash
# First, create the user
psql $DATABASE_URL << 'EOF'
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
  '$2a$06$DC5wMDp7SHG2QqkmeiEqwefkj4oVizvdRNbveN4tZpYT47SWvLPVu',
  'Test User',
  'USER',
  true,
  'TEST123',
  0,
  NOW(),
  NOW()
) RETURNING id;
EOF
```

```bash
# Then create the wallet
psql $DATABASE_URL << 'EOF'
INSERT INTO "Wallet" (
  id, 
  "userId", 
  balance, 
  "pendingBalance", 
  "totalEarned", 
  "totalWithdrawn", 
  "createdAt", 
  "updatedAt"
)
SELECT 
  gen_random_uuid(), 
  id, 
  0, 
  0, 
  0, 
  0, 
  NOW(), 
  NOW()
FROM "User" 
WHERE email = 'test@test.com';
EOF
```

After that, login with:
- Email: `test@test.com`
- Password: `test123456`

