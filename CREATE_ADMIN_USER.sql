-- Create Admin User
-- Run this SQL script to create an admin user

-- First, check if user exists
DO $$
DECLARE
    admin_exists INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_exists FROM "User" WHERE email = 'admin@promohive.com';
    
    IF admin_exists = 0 THEN
        -- User doesn't exist, create it
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
        ) VALUES (
            gen_random_uuid()::text,
            'admin',
            'admin@promohive.com',
            '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5hFLFkWM3v3ge', -- Password: Admin@123
            'System Administrator',
            'SUPER_ADMIN',
            10,
            true,
            false,
            'ADMIN01',
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Admin user created: admin@promohive.com / Admin@123';
    ELSE
        RAISE NOTICE 'Admin user already exists';
    END IF;
END $$;

-- Create admin wallet
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
    "id",
    0,
    0,
    0,
    0,
    NOW(),
    NOW()
FROM "User"
WHERE email = 'admin@promohive.com'
AND NOT EXISTS (
    SELECT 1 FROM "Wallet" WHERE "userId" = "User"."id"
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

