import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '../route'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware/rbac'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}))

// Mock RBAC
vi.mock('@/lib/middleware/rbac', () => ({
  requireAdmin: vi.fn(),
}))

// Mock rate limiting
vi.mock('@/lib/middleware/api-wrapper', () => ({
  wrapAdminRoute: (handler: any) => handler,
}))

describe('GET /api/admin/users', () => {
  const mockAdminUser = {
    id: 'admin-123',
    email: 'admin@example.com',
    role: 'ADMIN',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return paginated users for admin', async () => {
    const mockUsers = [
      {
        id: 'user-1',
        email: 'user1@example.com',
        name: 'User One',
        role: 'CLIENT',
        serviceType: 'funding',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-2',
        email: 'user2@example.com',
        name: 'User Two',
        role: 'CLIENT',
        serviceType: 'formation',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    vi.mocked(requireAdmin).mockResolvedValue({
      user: mockAdminUser,
      error: null,
    } as any)

    vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any)
    vi.mocked(prisma.user.count).mockResolvedValue(2)

    const request = new Request('http://localhost:3000/api/admin/users?page=1&limit=20')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data).toHaveLength(2)
    expect(data.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 2,
      pages: 1,
      hasNext: false,
      hasPrev: false,
    })
  })

  it('should filter users by search query', async () => {
    const mockUsers = [
      {
        id: 'user-1',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'CLIENT',
        serviceType: 'funding',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    vi.mocked(requireAdmin).mockResolvedValue({
      user: mockAdminUser,
      error: null,
    } as any)

    vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any)
    vi.mocked(prisma.user.count).mockResolvedValue(1)

    const request = new Request(
      'http://localhost:3000/api/admin/users?search=john&page=1&limit=20'
    )

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data).toHaveLength(1)
    expect(data.data[0].email).toBe('john@example.com')

    // Verify search filter was applied
    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            { email: { contains: 'john', mode: 'insensitive' } },
            { name: { contains: 'john', mode: 'insensitive' } },
          ]),
        }),
      })
    )
  })

  it('should filter users by role', async () => {
    const mockAdmins = [
      {
        id: 'admin-1',
        email: 'admin1@example.com',
        name: 'Admin User',
        role: 'ADMIN',
        serviceType: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    vi.mocked(requireAdmin).mockResolvedValue({
      user: mockAdminUser,
      error: null,
    } as any)

    vi.mocked(prisma.user.findMany).mockResolvedValue(mockAdmins as any)
    vi.mocked(prisma.user.count).mockResolvedValue(1)

    const request = new Request(
      'http://localhost:3000/api/admin/users?role=ADMIN&page=1&limit=20'
    )

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data).toHaveLength(1)
    expect(data.data[0].role).toBe('ADMIN')

    // Verify role filter was applied
    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          role: 'ADMIN',
        }),
      })
    )
  })

  it('should reject unauthorized access', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({
      user: null,
      error: {
        json: () =>
          Promise.resolve({
            error: 'Forbidden',
          }),
        status: 403,
      },
    } as any)

    const request = new Request('http://localhost:3000/api/admin/users')

    const response = await GET(request)

    expect(response.status).toBe(403)
  })

  it('should handle pagination correctly', async () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: `user-${i}`,
      email: `user${i}@example.com`,
      name: `User ${i}`,
      role: 'CLIENT',
      serviceType: 'funding',
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    vi.mocked(requireAdmin).mockResolvedValue({
      user: mockAdminUser,
      error: null,
    } as any)

    vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any)
    vi.mocked(prisma.user.count).mockResolvedValue(50)

    const request = new Request('http://localhost:3000/api/admin/users?page=2&limit=20')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.pagination).toEqual({
      page: 2,
      limit: 20,
      total: 50,
      pages: 3,
      hasNext: true,
      hasPrev: true,
    })

    // Verify skip and take were calculated correctly
    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 20, // (page 2 - 1) * 20
        take: 20,
      })
    )
  })

  it('should exclude password from response', async () => {
    const mockUsers = [
      {
        id: 'user-1',
        email: 'user1@example.com',
        name: 'User One',
        role: 'CLIENT',
        serviceType: 'funding',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    vi.mocked(requireAdmin).mockResolvedValue({
      user: mockAdminUser,
      error: null,
    } as any)

    vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any)
    vi.mocked(prisma.user.count).mockResolvedValue(1)

    const request = new Request('http://localhost:3000/api/admin/users')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)

    // Verify select excludes password field
    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          password: false,
        }),
      })
    )
  })

  it('should handle database errors gracefully', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({
      user: mockAdminUser,
      error: null,
    } as any)

    vi.mocked(prisma.user.count).mockRejectedValue(
      new Error('Database connection failed')
    )

    const request = new Request('http://localhost:3000/api/admin/users')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBeDefined()
  })
})
