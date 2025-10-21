import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { config } from 'dotenv'

config({ path: '.env.development' })

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