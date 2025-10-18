import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authOptions } from '../auth'
import { prisma } from '../prisma'
import { compare } from 'bcryptjs'

// Mock dependencies
vi.mock('../prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
  hash: vi.fn(),
}))

describe('Authentication System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('NextAuth Configuration', () => {
    it('should use JWT session strategy', () => {
      expect(authOptions.session?.strategy).toBe('jwt')
    })

    it('should have correct sign-in page', () => {
      expect(authOptions.pages?.signIn).toBe('/login')
    })

    it('should have credentials provider configured', () => {
      expect(authOptions.providers).toHaveLength(1)
      expect(authOptions.providers[0]).toHaveProperty('authorize')
      expect((authOptions.providers[0] as any).name).toBe('Credentials')
    })

    it('should have JWT callback configured', () => {
      expect(authOptions.callbacks).toBeDefined()
      expect(authOptions.callbacks?.jwt).toBeDefined()
      expect(typeof authOptions.callbacks?.jwt).toBe('function')
    })

    it('should have session callback configured', () => {
      expect(authOptions.callbacks).toBeDefined()
      expect(authOptions.callbacks?.session).toBeDefined()
      expect(typeof authOptions.callbacks?.session).toBe('function')
    })
  })

  describe('Credentials Provider - Login Flow', () => {
    const credentialsProvider = authOptions.providers[0]
    const authorize = (credentialsProvider as any).authorize!

    // Helper to properly call the async authorize function
    const callAuthorize = (credentials: any) =>
      authorize(credentials, {} as any)

    it('should authenticate valid user credentials', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_password',
        role: 'CLIENT',
        serviceType: 'funding',
      }

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)
      vi.mocked(compare).mockResolvedValue(true as never)

      const result = await callAuthorize({
        email: 'test@example.com',
        password: 'correct_password',
      })

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CLIENT',
        serviceType: 'funding',
      })

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
      expect(compare).toHaveBeenCalledWith('correct_password', 'hashed_password')
    })

    it('should reject non-existent user (invalid email)', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      await expect(callAuthorize({
        email: 'nonexistent@example.com',
        password: 'password',
      })).rejects.toThrow('Invalid email or password')

      expect(compare).not.toHaveBeenCalled()
    })

    it('should reject invalid password', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_password',
        role: 'CLIENT',
        serviceType: 'funding',
      }

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)
      vi.mocked(compare).mockResolvedValue(false as never)

      await expect(callAuthorize({
        email: 'test@example.com',
        password: 'wrong_password',
      })).rejects.toThrow('Invalid email or password')

      expect(compare).toHaveBeenCalledWith('wrong_password', 'hashed_password')
    })

    it('should reject missing email', async () => {
      await expect(callAuthorize({
        email: '',
        password: 'password',
      })).rejects.toThrow('Email and password required')

      expect(prisma.user.findUnique).not.toHaveBeenCalled()
    })

    it('should reject missing password', async () => {
      await expect(callAuthorize({
        email: 'test@example.com',
        password: '',
      })).rejects.toThrow('Email and password required')

      expect(prisma.user.findUnique).not.toHaveBeenCalled()
    })

    it('should authenticate admin user', async () => {
      const mockAdmin = {
        id: 'admin-123',
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'hashed_password',
        role: 'ADMIN',
        serviceType: null,
      }

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockAdmin as any)
      vi.mocked(compare).mockResolvedValue(true as never)

      const result = await callAuthorize({
        email: 'admin@example.com',
        password: 'admin_password',
      })

      expect(result).toMatchObject({
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      })
    })

    it('should authenticate staff user', async () => {
      const mockStaff = {
        id: 'staff-123',
        email: 'staff@example.com',
        name: 'Staff User',
        password: 'hashed_password',
        role: 'STAFF',
        serviceType: null,
      }

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockStaff as any)
      vi.mocked(compare).mockResolvedValue(true as never)

      const result = await callAuthorize({
        email: 'staff@example.com',
        password: 'staff_password',
      })

      expect(result?.role).toBe('STAFF')
    })

    it('should handle database errors', async () => {
      vi.mocked(prisma.user.findUnique).mockRejectedValue(
        new Error('Database connection failed')
      )

      await expect(callAuthorize({
        email: 'test@example.com',
        password: 'password',
      })).rejects.toThrow()
    })
  })

  describe('JWT Callback - Token Management', () => {
    const jwtCallback = authOptions.callbacks?.jwt

    if (!jwtCallback) {
      throw new Error('JWT callback not defined')
    }

    it('should add user data to token on first login', async () => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CLIENT',
        serviceType: 'funding',
      }

      const token = await jwtCallback({
        token: {},
        user: user as any,
      } as any)

      expect(token).toMatchObject({
        id: 'user-123',
        role: 'CLIENT',
        serviceType: 'funding',
      })
    })

    it('should preserve token data on subsequent requests', async () => {
      const existingToken = {
        id: 'user-123',
        role: 'CLIENT',
        serviceType: 'funding',
        iat: 1234567890,
        exp: 1234567890,
      }

      const token = await jwtCallback({
        token: existingToken,
        user: undefined,
      } as any)

      expect(token).toEqual(existingToken)
    })

    it('should handle admin token', async () => {
      const user = {
        id: 'admin-123',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN',
        serviceType: undefined,
      }

      const token = await jwtCallback({
        token: {},
        user: user as any,
      } as any)

      expect(token.role).toBe('ADMIN')
      expect(token.id).toBe('admin-123')
    })
  })

  describe('Session Callback - Session Creation', () => {
    const sessionCallback = authOptions.callbacks?.session

    if (!sessionCallback) {
      throw new Error('Session callback not defined')
    }

    it('should create session with user data from token', async () => {
      const token = {
        id: 'user-123',
        role: 'CLIENT',
        serviceType: 'funding',
      }

      const session = await sessionCallback({
        session: {
          user: {
            email: 'test@example.com',
            name: 'Test User',
          },
          expires: new Date().toISOString(),
        },
        token: token as any,
      } as any)

      expect(session.user).toMatchObject({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CLIENT',
        serviceType: 'funding',
      })
    })

    it('should create admin session correctly', async () => {
      const token = {
        id: 'admin-123',
        role: 'ADMIN',
        serviceType: undefined,
      }

      const session = await sessionCallback({
        session: {
          user: {
            email: 'admin@example.com',
            name: 'Admin User',
          },
          expires: new Date().toISOString(),
        },
        token: token as any,
      } as any)

      expect(session.user.role).toBe('ADMIN')
      expect(session.user.id).toBe('admin-123')
    })

    it('should create staff session correctly', async () => {
      const token = {
        id: 'staff-123',
        role: 'STAFF',
        serviceType: undefined,
      }

      const session = await sessionCallback({
        session: {
          user: {
            email: 'staff@example.com',
            name: 'Staff User',
          },
          expires: new Date().toISOString(),
        },
        token: token as any,
      } as any)

      expect(session.user.role).toBe('STAFF')
    })
  })

  describe('Authentication Flow Integration', () => {
    it('should complete full authentication flow for client user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'client@example.com',
        name: 'Client User',
        password: 'hashed_password',
        role: 'CLIENT',
        serviceType: 'funding',
      }

      // Step 1: Authorize
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)
      vi.mocked(compare).mockResolvedValue(true as never)

      const authProvider = (authOptions.providers[0] as any)
      const authorizedUser = await authProvider.authorize(
        {
          email: 'client@example.com',
          password: 'password123',
        },
        {} as any
      )

      expect(authorizedUser).toBeDefined()

      // Step 2: JWT Callback
      const jwtCallback = authOptions.callbacks?.jwt!
      const token = await jwtCallback({
        token: {},
        user: authorizedUser as any,
      } as any)

      expect(token.id).toBe('user-123')
      expect(token.role).toBe('CLIENT')

      // Step 3: Session Callback
      const sessionCallback = authOptions.callbacks?.session!
      const session = await sessionCallback({
        session: {
          user: {
            email: 'client@example.com',
            name: 'Client User',
          },
          expires: new Date().toISOString(),
        },
        token: token as any,
      } as any)

      expect(session.user).toMatchObject({
        id: 'user-123',
        email: 'client@example.com',
        role: 'CLIENT',
        serviceType: 'funding',
      })
    })
  })
})
