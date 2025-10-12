import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@b2bcredit.com' },
    update: {},
    create: {
      email: 'admin@b2bcredit.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  console.log('Created admin user:', admin.email)

  // Create sample client
  const clientPassword = await hash('client123', 12)
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      password: clientPassword,
      name: 'John Doe',
      role: 'CLIENT',
    },
  })

  console.log('Created client user:', client.email)

  // Create sample application for client
  await prisma.application.upsert({
    where: { userId: client.id },
    update: {},
    create: {
      userId: client.id,
      businessName: 'Acme Corporation',
      businessType: 'LLC',
      ein: '12-3456789',
      industry: 'Technology',
      annualRevenue: 500000,
      monthlyRevenue: 45000,
      creditScore: 720,
      fundingAmount: 100000,
      fundingPurpose: 'Business expansion and equipment purchase',
      status: 'DRAFT',
    },
  })

  console.log('Created sample application')

  // Create sample leads
  await prisma.lead.createMany({
    data: [
      {
        businessName: 'Tech Startup Inc',
        contactName: 'Jane Smith',
        email: 'jane@techstartup.com',
        phone: '555-0100',
        industry: 'Technology',
        yearsInBusiness: 2,
        annualRevenue: 250000,
        status: 'NEW',
        source: 'Website',
      },
      {
        businessName: 'Retail Solutions LLC',
        contactName: 'Bob Johnson',
        email: 'bob@retail.com',
        phone: '555-0200',
        industry: 'Retail',
        yearsInBusiness: 5,
        annualRevenue: 750000,
        status: 'CONTACTED',
        source: 'Referral',
      },
    ],
  })

  console.log('Created sample leads')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
