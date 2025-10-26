#!/bin/bash

echo "Creating test user with bcrypt hashed password..."

# Use Node.js to create a user with proper bcrypt hash
node << 'NODE_SCRIPT'
const bcrypt = require('bcrypt');

async function createUser() {
  try {
    const password = 'test123456';
    const hashed = await bcrypt.hash(password, 12);
    console.log('Password hash:', hashed);
    
    // Now create user in database
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        username: 'testuser',
        password: hashed,
        fullName: 'Test User',
        role: 'USER',
        isApproved: true,
        referralCode: 'TEST123',
        level: 0,
      }
    });
    
    console.log('User created:', user.id);
    
    // Create wallet
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
        pendingBalance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
      }
    });
    
    console.log('Wallet created:', wallet.id);
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createUser();
NODE_SCRIPT

echo "Done! Try logging in with test@test.com / test123456"

