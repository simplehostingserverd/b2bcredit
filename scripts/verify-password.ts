
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { config } from 'dotenv';

// Load environment variables from .env.development
config({ path: '.env.development' });

const prisma = new PrismaClient();

async function verifyAdminPassword() {
  console.log('Verifying admin credentials...');

  const adminEmail = 'admin@b2bcredit.com';
  const adminPassword = 'newadminpassword';

  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!adminUser) {
      console.error(`Error: Admin user with email '${adminEmail}' not found.`);
      return;
    }

    console.log('Admin user found. Verifying password...');

    const isPasswordValid = await compare(adminPassword, adminUser.password);

    if (isPasswordValid) {
      console.log('✅ Password is valid!');
    } else {
      console.error('❌ Error: Password is NOT valid!');
    }
  } catch (error) {
    console.error('An error occurred during verification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAdminPassword();
