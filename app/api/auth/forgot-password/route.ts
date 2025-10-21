import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authRateLimit } from '@/lib/middleware/auth-rate-limit'
import { errorResponses } from '@/lib/utils/errors'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting to prevent abuse
    const rateLimitResult = await authRateLimit(request)
    if (!rateLimitResult.allowed && rateLimitResult.error) {
      return rateLimitResult.error
    }

    const { email } = await request.json()

    if (!email) {
      return errorResponses.badRequest('Email is required')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return errorResponses.badRequest('Invalid email format')
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        isDisabled: true,
        isLocked: true,
      }
    })

    if (!user) {
      // Don't reveal whether user exists for security
      return NextResponse.json(
        {
          message: 'If an account with this email exists, a password reset link has been sent.',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      )
    }

    // Check if account is disabled or locked
    if (user.isDisabled || user.isLocked) {
      return errorResponses.forbidden('Account access is restricted. Please contact support.')
    }

    // Generate password reset token
    const resetToken = crypto.randomUUID()
    const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour expiry

    // Store reset token in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Send password reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`
    
    try {
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name || 'User',
        resetUrl,
      })
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Don't reveal email failure to user for security
      return NextResponse.json(
        {
          message: 'If an account with this email exists, a password reset link has been sent.',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        message: 'If an account with this email exists, a password reset link has been sent.',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Password reset request error:', error)
    return errorResponses.internalError()
  }
}