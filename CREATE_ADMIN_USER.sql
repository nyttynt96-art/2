-- Create Admin User for PromoHive
-- Password: Admin@123

-- Insert admin user if not exists
INSERT INTO "User" (
    "id",
    "username",
    "email",
    "password",
    "fullName",
    "role",
    "level",
    "isApproved",
    "isSuspended",
    "referralCode",
    "createdAt",
    "updatedAt"
) 
SELECT 
    gen_random_uuid()::text,
    'admin',
    'admin@promohive.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5hFLFkWM3v3ge',
    'System Administrator',
    'SUPER_ADMIN',
    10,
    true,
    false,
    'ADMIN01',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "User" WHERE email = 'admin@promohive.com'
);

-- Create admin wallet if not exists
INSERT INTO "Wallet" (
    "id",
    "userId",
    "balance",
    "pendingBalance",
    "totalEarned",
    "totalWithdrawn",
    "createdAt",
    "updatedAt"
)
SELECT 
    gen_random_uuid()::text,
    u."id",
    0,
    0,
    0,
    0,
    NOW(),
    NOW()
FROM "User" u
WHERE u.email = 'admin@promohive.com'
AND NOT EXISTS (
    SELECT 1 FROM "Wallet" w WHERE w."userId" = u."id"
);

-- Display admin user info
SELECT 
    "id",
    "username",
    "email",
    "role",
    "level",
    "isApproved"
FROM "User"
WHERE email = 'admin@promohive.com';

