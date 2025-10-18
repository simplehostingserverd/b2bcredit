import { NextResponse } from 'next/server'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

export interface ApiResponse<T> {
  data: T
  message?: string
  timestamp: string
}

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

/**
 * Creates a paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse<PaginatedResponse<T>> {
  const pages = Math.ceil(total / limit)

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
  })
}

/**
 * Calculates pagination skip value
 */
export function getPaginationParams(page: number = 1, limit: number = 20) {
  const normalizedPage = Math.max(1, page)
  const normalizedLimit = Math.min(Math.max(1, limit), 100) // Max 100 items per page
  const skip = (normalizedPage - 1) * normalizedLimit

  return { skip, take: normalizedLimit, page: normalizedPage, limit: normalizedLimit }
}

/**
 * Build search filter for Prisma
 */
export function buildSearchFilter(
  search: string | undefined,
  fields: string[]
): any {
  if (!search || search.trim() === '') {
    return {}
  }

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: search,
        mode: 'insensitive',
      },
    })),
  }
}

/**
 * Build date range filter for Prisma
 */
export function buildDateRangeFilter(
  field: string,
  startDate?: string,
  endDate?: string
): any {
  const filter: any = {}

  if (startDate || endDate) {
    filter[field] = {}
    if (startDate) {
      filter[field].gte = new Date(startDate)
    }
    if (endDate) {
      filter[field].lte = new Date(endDate)
    }
  }

  return filter
}

/**
 * Merge multiple filters
 */
export function mergeFilters(...filters: any[]): any {
  return filters.reduce((acc, filter) => {
    return { ...acc, ...filter }
  }, {})
}
