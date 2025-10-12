import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST, PATCH } from '../route'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    application: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

describe('GET /api/applications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return application for authenticated user', async () => {
    const mockSession = {
      user: { id: 'user-123', email: 'test@example.com' },
    }
    const mockApplication = {
      id: 'app-123',
      userId: 'user-123',
      businessName: 'Acme Corp',
      businessType: 'LLC',
      status: 'DRAFT',
      documents: [],
    }

    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
    vi.mocked(prisma.application.findFirst).mockResolvedValue(mockApplication as any)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(mockApplication)
    expect(prisma.application.findFirst).toHaveBeenCalledWith({
      where: { userId: 'user-123' },
      include: { documents: true },
    })
  })

  it('should return 401 for unauthenticated user', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
    expect(prisma.application.findFirst).not.toHaveBeenCalled()
  })

  it('should handle database errors gracefully', async () => {
    const mockSession = {
      user: { id: 'user-123', email: 'test@example.com' },
    }

    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
    vi.mocked(prisma.application.findFirst).mockRejectedValue(
      new Error('Database error')
    )

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to fetch application')
  })
})

describe('POST /api/applications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create new application for authenticated user', async () => {
    const mockSession = {
      user: { id: 'user-123', email: 'test@example.com' },
    }
    const createdAt = new Date()
    const updatedAt = new Date()
    const mockApplication = {
      id: 'app-123',
      userId: 'user-123',
      businessName: 'Acme Corp',
      businessType: 'LLC',
      status: 'DRAFT',
      createdAt,
      updatedAt,
    }

    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
    vi.mocked(prisma.application.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.application.create).mockResolvedValue(mockApplication as any)

    const request = new Request('http://localhost:3000/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Acme Corp',
        businessType: 'LLC',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data).toEqual({
      ...mockApplication,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    })
    expect(prisma.application.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        businessName: 'Acme Corp',
        businessType: 'LLC',
        userId: 'user-123',
      }),
    })
  })

  it('should return 401 for unauthenticated user', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    const request = new Request('http://localhost:3000/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Acme Corp',
        businessType: 'LLC',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
    expect(prisma.application.create).not.toHaveBeenCalled()
  })

  it('should reject creation if application already exists', async () => {
    const mockSession = {
      user: { id: 'user-123', email: 'test@example.com' },
    }
    const existingApplication = {
      id: 'app-123',
      userId: 'user-123',
      businessName: 'Existing Corp',
    }

    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
    vi.mocked(prisma.application.findFirst).mockResolvedValue(existingApplication as any)

    const request = new Request('http://localhost:3000/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'New Corp',
        businessType: 'LLC',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Application already exists')
    expect(prisma.application.create).not.toHaveBeenCalled()
  })

  it('should validate business type enum', async () => {
    const mockSession = {
      user: { id: 'user-123', email: 'test@example.com' },
    }

    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

    const request = new Request('http://localhost:3000/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Acme Corp',
        businessType: 'INVALID_TYPE',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('Invalid')
    expect(prisma.application.create).not.toHaveBeenCalled()
  })

  it('should require business name', async () => {
    const mockSession = {
      user: { id: 'user-123', email: 'test@example.com' },
    }

    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)

    const request = new Request('http://localhost:3000/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: '',
        businessType: 'LLC',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(prisma.application.create).not.toHaveBeenCalled()
  })

  it('should handle optional fields correctly', async () => {
    const mockSession = {
      user: { id: 'user-123', email: 'test@example.com' },
    }
    const mockApplication = {
      id: 'app-123',
      userId: 'user-123',
      businessName: 'Acme Corp',
      businessType: 'LLC',
      industry: 'Technology',
      annualRevenue: 1000000,
      fundingAmount: 50000,
      status: 'DRAFT',
    }

    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
    vi.mocked(prisma.application.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.application.create).mockResolvedValue(mockApplication as any)

    const request = new Request('http://localhost:3000/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Acme Corp',
        businessType: 'LLC',
        industry: 'Technology',
        annualRevenue: 1000000,
        fundingAmount: 50000,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(prisma.application.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        industry: 'Technology',
        annualRevenue: 1000000,
        fundingAmount: 50000,
      }),
    })
  })
})

describe('PATCH /api/applications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should update existing application', async () => {
    const mockSession = {
      user: { id: 'user-123', email: 'test@example.com' },
    }
    const existingApplication = {
      id: 'app-123',
      userId: 'user-123',
      businessName: 'Acme Corp',
      businessType: 'LLC',
    }
    const updatedApplication = {
      ...existingApplication,
      businessName: 'Updated Corp',
      industry: 'Technology',
    }

    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
    vi.mocked(prisma.application.findFirst).mockResolvedValue(existingApplication as any)
    vi.mocked(prisma.application.update).mockResolvedValue(updatedApplication as any)

    const request = new Request('http://localhost:3000/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Updated Corp',
        industry: 'Technology',
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(updatedApplication)
    expect(prisma.application.update).toHaveBeenCalledWith({
      where: { id: 'app-123' },
      data: expect.objectContaining({
        businessName: 'Updated Corp',
        industry: 'Technology',
        updatedAt: expect.any(Date),
      }),
    })
  })

  it('should return 401 for unauthenticated user', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    const request = new Request('http://localhost:3000/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Updated Corp',
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
    expect(prisma.application.update).not.toHaveBeenCalled()
  })

  it('should return 404 if application does not exist', async () => {
    const mockSession = {
      user: { id: 'user-123', email: 'test@example.com' },
    }

    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
    vi.mocked(prisma.application.findFirst).mockResolvedValue(null)

    const request = new Request('http://localhost:3000/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Updated Corp',
      }),
    })

    const response = await PATCH(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Application not found')
    expect(prisma.application.update).not.toHaveBeenCalled()
  })

  it('should allow partial updates', async () => {
    const mockSession = {
      user: { id: 'user-123', email: 'test@example.com' },
    }
    const existingApplication = {
      id: 'app-123',
      userId: 'user-123',
      businessName: 'Acme Corp',
      businessType: 'LLC',
      industry: 'Technology',
    }

    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
    vi.mocked(prisma.application.findFirst).mockResolvedValue(existingApplication as any)
    vi.mocked(prisma.application.update).mockResolvedValue({
      ...existingApplication,
      fundingAmount: 50000,
    } as any)

    const request = new Request('http://localhost:3000/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fundingAmount: 50000,
      }),
    })

    const response = await PATCH(request)

    expect(response.status).toBe(200)
    expect(prisma.application.update).toHaveBeenCalledWith({
      where: { id: 'app-123' },
      data: expect.objectContaining({
        fundingAmount: 50000,
      }),
    })
  })
})
