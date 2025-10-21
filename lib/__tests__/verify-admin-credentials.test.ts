
import { describe, it, expect } from 'vitest';
import { compare } from 'bcryptjs';

// Manually set the database URL for this test
process.env.DATABASE_URL="postgresql://postgres:postgres@localhost:5432/b2b_credit_db";

import { prisma } from '../prisma';

describe('Admin Credentials Verification', () => {
  it('should have a valid password for the admin user', async () => {
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@b2bcredit.com' },
    });

    expect(adminUser).toBeDefined();
    expect(adminUser).not.toBeNull();

    if (adminUser) {
      const isPasswordValid = await compare('newadminpassword', adminUser.password);
      expect(isPasswordValid).toBe(true);
    }
  });
});
