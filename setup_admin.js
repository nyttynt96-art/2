// Setup Admin User - Direct Database Connection
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@promohive.com' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash('Admin@123', 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@promohive.com',
        password: passwordHash,
        fullName: 'System Administrator',
        role: 'SUPER_ADMIN',
        level: 10,
        isApproved: true,
        referralCode: 'ADMIN01'
      }
    });

    // Create wallet for admin
    await prisma.wallet.create({
      data: {
        userId: admin.id,
        balance: 0,
        pendingBalance: 0,
        totalEarned: 0,
        totalWithdrawn: 0
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@promohive.com');
    console.log('Password: Admin@123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();

