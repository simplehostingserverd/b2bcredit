import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { wrapPublicRoute } from '@/lib/middleware/api-wrapper'

const leadSchema = z.object({
  businessName: z.string().min(1),
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  industry: z.string().optional(),
  yearsInBusiness: z.number().optional(),
  annualRevenue: z.number().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
})

async function handler(req: Request) {
  try {
    const body = await req.json()
    const data = leadSchema.parse(body)

    const lead = await prisma.lead.create({
      data,
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}

// Export with public rate limiting (30 requests per minute)
export const POST = wrapPublicRoute(handler)
