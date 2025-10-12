import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    const application = await prisma.application.findFirst({
      where: { userId },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    if (application.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Application already submitted' },
        { status: 400 }
      )
    }

    const updatedApplication = await prisma.application.update({
      where: { id: application.id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    })

    return NextResponse.json(updatedApplication)
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}
