import { prisma } from '@/lib/prisma'

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  BULK_DELETE = 'BULK_DELETE',
}

export interface AuditLogEntry {
  userId: string
  action: AuditAction
  resource: string
  resourceId: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

/**
 * Logs an audit entry to the database
 */
export async function logAudit(entry: AuditLogEntry) {
  try {
    // Save to database
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId,
        details: entry.details || {},
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    })

    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('AUDIT LOG:', JSON.stringify(entry, null, 2))
    }
  } catch (error) {
    // Never let audit logging break the main flow
    console.error('Failed to log audit entry:', error)

    // Fallback to console logging if database fails
    console.log('AUDIT LOG (fallback):', JSON.stringify(entry, null, 2))
  }
}

/**
 * Extract IP address from request
 */
export function getIpAddress(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  return request.headers.get('x-real-ip') || 'unknown'
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown'
}

/**
 * Create audit log entry from request
 */
export async function auditRequest(
  request: Request,
  userId: string,
  action: AuditAction,
  resource: string,
  resourceId: string,
  details?: Record<string, any>
) {
  await logAudit({
    userId,
    action,
    resource,
    resourceId,
    details,
    ipAddress: getIpAddress(request),
    userAgent: getUserAgent(request),
  })
}

/**
 * Wrapper for audited operations
 */
export async function withAudit<T>(
  operation: () => Promise<T>,
  auditEntry: AuditLogEntry
): Promise<T> {
  const result = await operation()
  await logAudit(auditEntry)
  return result
}
