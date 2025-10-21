import { NextRequest, NextResponse } from 'next/server'
import { requireAdminOrStaff } from '@/lib/middleware/rbac'
import { createAIClient } from '@/lib/ai/client'
import { errorResponses } from '@/lib/utils/errors'

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAdminOrStaff()
    if (authError) return authError

    const body = await request.json()
    const { application, action } = body

    if (!application) {
      return errorResponses.badRequest('Application data is required')
    }

    // Get AI provider from env or use default (Groq)
    const provider = process.env.AI_PROVIDER || 'GROQ'
    const aiClient = createAIClient(provider)

    let result: string

    switch (action) {
      case 'analyze':
        result = await aiClient.analyzeApplication(application)
        break
      case 'generateRejection':
        if (!body.reason) {
          return errorResponses.badRequest('Rejection reason is required')
        }
        result = await aiClient.generateRejectionLetter(application, body.reason)
        break
      case 'generateApproval':
        result = await aiClient.generateApprovalLetter(application)
        break
      default:
        return errorResponses.badRequest('Invalid action')
    }

    return NextResponse.json({
      success: true,
      result,
      provider,
      model: aiClient['model'],
    })
  } catch (error: any) {
    console.error('AI Analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'AI analysis failed' },
      { status: 500 }
    )
  }
}
