import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

/**
 * Execute operations within a transaction
 */
export async function withTransaction<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    return await operation(tx)
  })
}

/**
 * Execute operations with retry logic for transaction conflicts
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error

      // Only retry on specific Prisma errors
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === 'P2034' || error.code === 'P2028') // Transaction conflicts
      ) {
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = Math.min(100 * Math.pow(2, attempt), 1000)
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }
      }

      // If it's not a retryable error, throw immediately
      throw error
    }
  }

  throw lastError
}

/**
 * Batch operations with transaction
 */
export async function batchUpdate<T>(
  ids: string[],
  updateFn: (tx: Prisma.TransactionClient, id: string) => Promise<T>
): Promise<T[]> {
  return await withTransaction(async (tx) => {
    const results: T[] = []
    for (const id of ids) {
      const result = await updateFn(tx, id)
      results.push(result)
    }
    return results
  })
}

/**
 * Batch delete with transaction
 */
export async function batchDelete(
  model: keyof typeof prisma,
  ids: string[]
): Promise<number> {
  return await withTransaction(async (tx) => {
    const modelClient = (tx as any)[model]
    const result = await modelClient.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
    return result.count
  })
}
