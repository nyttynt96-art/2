-- Create test user with hashed password and wallet
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

