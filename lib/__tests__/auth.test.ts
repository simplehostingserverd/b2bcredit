import { describe, it, expect } from 'vitest'
import { authOptions } from '../auth'

describe('NextAuth Configuration', () => {
  describe('Configuration', () => {
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

    it('should have provider authorize function configured', () => {
      const provider = authOptions.providers[0] as any
      expect(provider.authorize).toBeDefined()
      expect(typeof provider.authorize).toBe('function')
    })
  })
})
