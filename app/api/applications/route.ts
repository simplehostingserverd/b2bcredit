import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const applicationSchema = z.object({
  businessName: z.string().min(1),
  businessType: z.enum(['SOLE_PROPRIETORSHIP', 'PARTNERSHIP', 'LLC', 'CORPORATION', 'S_CORPORATION', 'NON_PROFIT']),
  ein: z.string().optional(),
  dateEstablished: z.string().optional(),
  businessAddress: z.string().optional(),
  businessCity: z.string().optional(),
  businessState: z.string().optional(),
  businessZip: z.string().optional(),
  industry: z.string().optional(),
  annualRevenue: z.number().optional(),
  monthlyRevenue: z.number().optional(),
  creditScore: z.number().optional(),
  existingDebt: z.number().optional(),
  fundingAmount: z.number().optional(),
  fundingPurpose: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    const application = await prisma.application.findFirst({
      where: { userId },
      include: { documents: true },
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error('Error fetching application:', error)
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await req.json()
    const data = applicationSchema.parse(body)

    // Check if user already has an application
    const existingApplication = await prisma.application.findFirst({
      where: { userId },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Application already exists' },
        { status: 400 }
      )
    }

    const application = await prisma.application.create({
      data: {
        ...data,
        userId,
        dateEstablished: data.dateEstablished ? new Date(data.dateEstablished) : null,
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating application:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await req.json()
    const data = applicationSchema.partial().parse(body)

    const application = await prisma.application.findFirst({
      where: { userId },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    const updatedApplication = await prisma.application.update({
      where: { id: application.id },
      data: {
        ...data,
        dateEstablished: data.dateEstablished ? new Date(data.dateEstablished) : undefined,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedApplication)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error updating application:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}
