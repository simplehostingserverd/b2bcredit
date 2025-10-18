import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'
import { prisma } from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    lead: {
      create: vi.fn(),
    },
  },
}))

// Mock rate limiting
vi.mock('@/lib/middleware/api-wrapper', () => ({
  wrapPublicRoute: (handler: any) => handler,
}))

describe('POST /api/leads', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a lead successfully', async () => {
    const mockLead = {
      id: 'lead-123',
      businessName: 'Acme Corp',
      contactName: 'John Doe',
      email: 'john@acme.com',
      phone: '555-1234',
      industry: 'Technology',
      yearsInBusiness: 5,
      annualRevenue: 1000000,
      status: 'NEW',
      source: 'website',
      notes: null,
      assignedToId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(prisma.lead.create).mockResolvedValue(mockLead)

    const request = new Request('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Acme Corp',
        contactName: 'John Doe',
        email: 'john@acme.com',
        phone: '555-1234',
        industry: 'Technology',
        yearsInBusiness: 5,
        annualRevenue: 1000000,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.businessName).toBe('Acme Corp')
    expect(data.email).toBe('john@acme.com')
    expect(prisma.lead.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        businessName: 'Acme Corp',
        contactName: 'John Doe',
        email: 'john@acme.com',
      }),
    })
  })

  it('should create a minimal lead with only required fields', async () => {
    const mockLead = {
      id: 'lead-456',
      businessName: 'Simple LLC',
      contactName: 'Jane Smith',
      email: 'jane@simple.com',
      phone: null,
      industry: null,
      yearsInBusiness: null,
      annualRevenue: null,
      status: 'NEW',
      source: null,
      notes: null,
      assignedToId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(prisma.lead.create).mockResolvedValue(mockLead)

    const request = new Request('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Simple LLC',
        contactName: 'Jane Smith',
        email: 'jane@simple.com',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.businessName).toBe('Simple LLC')
  })

  it('should reject invalid email', async () => {
    const request = new Request('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Acme Corp',
        contactName: 'John Doe',
        email: 'invalid-email',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBeDefined()
    expect(prisma.lead.create).not.toHaveBeenCalled()
  })

  it('should reject missing required fields', async () => {
    const request = new Request('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Acme Corp',
        // Missing contactName and email
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBeDefined()
    expect(prisma.lead.create).not.toHaveBeenCalled()
  })

  it('should handle database errors gracefully', async () => {
    vi.mocked(prisma.lead.create).mockRejectedValue(
      new Error('Database connection failed')
    )

    const request = new Request('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Acme Corp',
        contactName: 'John Doe',
        email: 'john@acme.com',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to create lead')
  })

  it('should accept optional fields', async () => {
    const mockLead = {
      id: 'lead-789',
      businessName: 'Tech Startup',
      contactName: 'Bob Builder',
      email: 'bob@tech.com',
      phone: '555-9999',
      industry: 'Software',
      yearsInBusiness: 2,
      annualRevenue: 500000,
      status: 'NEW',
      source: 'referral',
      notes: 'Interested in funding',
      assignedToId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(prisma.lead.create).mockResolvedValue(mockLead)

    const request = new Request('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Tech Startup',
        contactName: 'Bob Builder',
        email: 'bob@tech.com',
        phone: '555-9999',
        industry: 'Software',
        yearsInBusiness: 2,
        annualRevenue: 500000,
        source: 'referral',
        notes: 'Interested in funding',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.notes).toBe('Interested in funding')
    expect(data.source).toBe('referral')
  })
})
