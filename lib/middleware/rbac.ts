import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export type UserRole = 'ADMIN' | 'STAFF' | 'CLIENT'

export interface AuthenticatedUser {
  id: string
  email: string
  name?: string | null
  role: UserRole
}

/**
 * Middleware to verify user is authenticated
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      ),
      user: null,
    }
  }

  const user = session.user as AuthenticatedUser

  return { user, error: null }
}

/**
 * Middleware to verify user has one of the allowed roles
 */
export async function requireRoles(allowedRoles: UserRole[]) {
  const { user, error } = await requireAuth()

  if (error) {
    return { user: null, error }
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return {
      error: NextResponse.json(
        {
          error: 'Forbidden. You do not have permission to access this resource.',
          requiredRoles: allowedRoles,
        },
        { status: 403 }
      ),
      user: null,
    }
  }

  return { user, error: null }
}

/**
 * Middleware to verify user is an admin
 */
export async function requireAdmin() {
  return requireRoles(['ADMIN'])
}

/**
 * Middleware to verify user is admin or staff
 */
export async function requireAdminOrStaff() {
  return requireRoles(['ADMIN', 'STAFF'])
}

/**
 * Check if user owns a resource
 */
export function isResourceOwner(user: AuthenticatedUser, resourceUserId: string): boolean {
  return user.id === resourceUserId
}

/**
 * Require user to be owner or admin
 */
export async function requireOwnerOrAdmin(resourceUserId: string) {
  const { user, error } = await requireAuth()

  if (error) {
    return { user: null, error }
  }

  if (!user) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
      user: null,
    }
  }

  const isOwner = isResourceOwner(user, resourceUserId)
  const isAdmin = user.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    return {
      error: NextResponse.json(
        { error: 'Forbidden. You can only access your own resources.' },
        { status: 403 }
      ),
      user: null,
    }
  }

  return { user, error: null }
}
