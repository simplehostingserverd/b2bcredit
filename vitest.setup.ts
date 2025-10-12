import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'

// Mock environment variables
process.env.DATABASE_URL = 'file:./test.db'
process.env.NEXTAUTH_SECRET = 'test-secret-key-for-testing-only'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Suppress console.error in tests for cleaner output
global.console.error = vi.fn()

// Mock Next.js server-only imports
vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map()),
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
  })),
}))

// Mock next-auth
vi.mock('next-auth', () => ({
  default: vi.fn(),
}))

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}))

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks()
})