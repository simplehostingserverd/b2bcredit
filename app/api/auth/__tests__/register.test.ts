import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../register/route'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  hash: vi.fn(),
}))

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should register a new user successfully', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedPassword123',
      role: 'CLIENT',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(hash).mockResolvedValue('hashedPassword123' as never)
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser)

    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'SecurePass123',
        name: 'Test User',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.message).toBe('User registered successfully')
    expect(data.user).toEqual({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
    })
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    })
    expect(hash).toHaveBeenCalledWith('SecurePass123', 12)
  })

  it('should create user with business name and application', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'business@example.com',
      name: 'Business Owner',
      password: 'hashedPassword123',
      role: 'CLIENT',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(hash).mockResolvedValue('hashedPassword123' as never)
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser)

    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'business@example.com',
        password: 'SecurePass123',
        name: 'Business Owner',
        businessName: 'Acme Corp',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'business@example.com',
        password: 'hashedPassword123',
        name: 'Business Owner',
        role: 'CLIENT',
        applications: {
          create: {
            businessName: 'Acme Corp',
            businessType: 'LLC',
            status: 'DRAFT',
          },
        },
      },
    })
  })

  it('should reject registration if user already exists', async () => {
    const existingUser = {
      id: 'user-123',
      email: 'existing@example.com',
      name: 'Existing User',
      password: 'hashedPassword',
      role: 'CLIENT',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser)

    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'existing@example.com',
        password: 'SecurePass123',
        name: 'Test User',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('User with this email already exists')
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it('should reject invalid email', async () => {
    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'SecurePass123',
        name: 'Test User',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid email address')
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it('should reject short password', async () => {
    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'short',
        name: 'Test User',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Password must be at least 8 characters')
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it('should reject missing name', async () => {
    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'SecurePass123',
        name: '',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Name is required')
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it('should handle database errors gracefully', async () => {
    vi.mocked(prisma.user.findUnique).mockRejectedValue(
      new Error('Database connection failed')
    )

    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'SecurePass123',
        name: 'Test User',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Something went wrong')
  })

  it('should hash password with bcrypt before storing', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedPassword123',
      role: 'CLIENT',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(hash).mockResolvedValue('hashedPassword123' as never)
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser)

    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'MyPlainPassword123',
        name: 'Test User',
      }),
    })

    await POST(request)

    expect(hash).toHaveBeenCalledWith('MyPlainPassword123', 12)
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          password: 'hashedPassword123',
        }),
      })
    )
  })
})