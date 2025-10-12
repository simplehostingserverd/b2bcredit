import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProgressSchema = z.object({
  businessType: z.string().optional(),
  yearsInOperation: z.string().optional(),
  currentCreditScore: z.string().optional(),
  einNumber: z.string().optional(),
  einUploaded: z.boolean().optional(),
  bankConnected: z.boolean().optional(),
  tradeLines: z.string().optional(),
  creditGoal: z.string().optional(),
  painPoints: z.array(z.string()).optional(),
  preferredCommunication: z.string().optional(),
  referralSource: z.string().optional(),
  budgetForPremium: z.string().optional(),
  teamSize: z.string().optional(),
  currentStep: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { onboarding: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ onboarding: user.onboarding })
  } catch (error) {
    console.error('Error fetching onboarding progress:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = updateProgressSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { onboarding: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate completion percentage based on filled fields
    const calculateCompletion = (profile: any) => {
      const fields = [
        'businessType',
        'yearsInOperation',
        'currentCreditScore',
        'einNumber',
        'creditGoal',
        'preferredCommunication',
      ]

      const filledFields = fields.filter(
        (field) => profile[field] && profile[field] !== ''
      ).length

      const booleanFields = ['einUploaded', 'bankConnected']
      const filledBooleans = booleanFields.filter(
        (field) => profile[field] === true
      ).length

      const totalFields = fields.length + booleanFields.length
      const totalFilled = filledFields + filledBooleans

      return Math.round((totalFilled / totalFields) * 100)
    }

    // Update or create onboarding profile
    const updatedData = {
      ...data,
      completionPercentage: 0, // Will be calculated
    }

    let onboarding
    if (user.onboarding) {
      const merged = { ...user.onboarding, ...data }
      updatedData.completionPercentage = calculateCompletion(merged)

      onboarding = await prisma.onboardingProfile.update({
        where: { userId: user.id },
        data: updatedData,
      })
    } else {
      updatedData.completionPercentage = calculateCompletion(data)

      onboarding = await prisma.onboardingProfile.create({
        data: {
          userId: user.id,
          ...updatedData,
        },
      })
    }

    return NextResponse.json({
      message: 'Onboarding progress updated',
      onboarding,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error updating onboarding progress:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
