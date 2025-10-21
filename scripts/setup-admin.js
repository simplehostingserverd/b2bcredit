const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@b2bcredit.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin123!'
  const name = process.env.ADMIN_NAME || 'Admin User'

  console.log('Setting up admin user...')
  console.log('Email:', email)

  const hashedPassword = await hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name,
      isLocked: false,
      isDisabled: false,
      failedLoginAttempts: 0,
      lockUntil: null,
    },
    create: {
      email,
      password: hashedPassword,
      name,
      role: 'ADMIN',
    },
  })

  console.log('\n✓ Admin user created/updated successfully!')
  console.log('\nLogin credentials:')
  console.log('  Email:', email)
  console.log('  Password:', password)
  console.log('\nUser details:')
  console.log('  ID:', user.id)
  console.log('  Role:', user.role)
  console.log('  Created:', user.createdAt)

  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isLocked: true,
      isDisabled: true,
      createdAt: true,
    },
  })

  console.log('\n\nAll users in database:')
  console.table(allUsers)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
