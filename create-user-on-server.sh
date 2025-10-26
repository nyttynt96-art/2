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
    
    // Now create or update user in database
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Try to find existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@test.com' }
    });
    
    let user;
    
    if (existingUser) {
      console.log('Updating existing user...');
      user = await prisma.user.update({
        where: { email: 'test@test.com' },
        data: {
          password: hashed,
          username: 'testuser',
          fullName: 'Test User',
          role: 'USER',
          isApproved: true,
          referralCode: 'TEST123',
          level: 0,
        }
      });
    } else {
      console.log('Creating new user...');
      user = await prisma.user.create({
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
    }
    
    console.log('User created/updated:', user.id);
    
    // Check if wallet exists
    const existingWallet = await prisma.wallet.findUnique({
      where: { userId: user.id }
    });
    
    if (!existingWallet) {
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
    } else {
      console.log('Wallet already exists');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createUser();
NODE_SCRIPT

echo "Done! Try logging in with test@test.com / test123456"
