import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { wrapStrictRoute } from '@/lib/middleware/api-wrapper'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  businessName: z.string().optional(),
  serviceType: z.enum(['formation', 'funding'], {
    required_error: 'Please select a service type',
  }),
})

async function handler(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name, businessName, serviceType } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user and initial application
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        serviceType,
        role: 'CLIENT',
        applications: businessName ? {
          create: {
            businessName,
            businessType: serviceType === 'formation' ? 'LLC' : 'LLC',
            status: 'DRAFT',
          },
        } : undefined,
        onboarding: {
          create: {
            completionPercentage: 0,
            currentStep: 'welcome',
          },
        },
      },
    })

    // Send welcome email asynchronously
    try {
      const { sendWelcomeEmail } = await import('@/lib/services/onboarding-email')
      await sendWelcomeEmail(user.id)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail registration if email fails
    }

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          serviceType: user.serviceType,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// Export with strict rate limiting (10 requests per minute)
export const POST = wrapStrictRoute(handler)
