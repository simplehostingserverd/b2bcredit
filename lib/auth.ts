import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from './prisma'
import { errorResponses } from './utils/errors'

// Database connection health check
async function checkDatabaseConnection() {
  try {
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection health check failed:', error)
    return false
  }
}

// Environment configuration validation
function validateEnvironmentVariables() {
  const requiredEnvVars = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  }

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }

  // Validate NEXTAUTH_URL format
  try {
    new URL(process.env.NEXTAUTH_URL!)
  } catch {
    throw new Error('NEXTAUTH_URL must be a valid URL')
  }

  // Validate NEXTAUTH_SECRET length (minimum 32 characters for security)
  if (process.env.NEXTAUTH_SECRET!.length < 32) {
    throw new Error('NEXTAUTH_SECRET must be at least 32 characters long')
  }
}

// Validate environment variables and database connection on module load
try {
  validateEnvironmentVariables()
  const dbHealthy = await checkDatabaseConnection()
  if (!dbHealthy) {
    throw new Error('Database connection failed')
  }
} catch (error) {
    console.error('System initialization failed:', (error as Error).message)
    // In production, this would be a critical error
    if (process.env.NODE_ENV === 'production') {
      throw error
    }
  }

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          // Check database connection first
          await prisma.$queryRaw`SELECT 1`
        } catch (dbError) {
          console.error('Database connection error during authentication:', dbError)
          throw new Error('Service temporarily unavailable. Please try again later.')
        }

        let user
        try {
          user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })
        } catch (dbError) {
          console.error('Database error during user lookup:', dbError)
          throw new Error('Service temporarily unavailable. Please try again later.')
        }

        if (!user) {
          throw new Error('Invalid email or password')
        }

        // Check if account is locked
        if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
          const lockTimeRemaining = Math.ceil((user.lockUntil.getTime() - Date.now()) / (1000 * 60))
          throw new Error(`Account locked. Please try again in ${lockTimeRemaining} minutes.`)
        }

        // Check if account is disabled
        if (user.isDisabled) {
          throw new Error('Account is disabled. Please contact support.')
        }

        let isPasswordValid
        try {
          isPasswordValid = await compare(credentials.password, user.password)
        } catch (compareError) {
          console.error('Password comparison error:', compareError)
          throw new Error('Service temporarily unavailable. Please try again later.')
        }

        if (!isPasswordValid) {
          // Track failed login attempts
          const failedAttempts = (user.failedLoginAttempts || 0) + 1
          const lockoutThreshold = 5
          
          let updateData: any = {
            failedLoginAttempts: failedAttempts,
            lastFailedLogin: new Date(),
          }
          
          // Lock account after threshold reached
          if (failedAttempts >= lockoutThreshold) {
            const lockDuration = 30 // 30 minutes
            updateData.isLocked = true
            updateData.lockUntil = new Date(Date.now() + lockDuration * 60 * 1000)
            updateData.failedLoginAttempts = 0
          }
          
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: updateData,
            })
          } catch (updateError) {
            console.error('Failed to update user login attempts:', updateError)
            // Don't throw here as we still want to show the generic error
          }
          
          throw new Error('Invalid email or password')
        }

        // Reset failed attempts on successful login
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: 0,
              lastLogin: new Date(),
              isLocked: false,
              lockUntil: null,
            },
          })
        } catch (resetError) {
          console.error('Failed to reset user login attempts:', resetError)
          // Don't throw here as authentication was successful
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          serviceType: user.serviceType || undefined,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        // Initial sign-in
        token.id = user.id;
        token.role = user.role;
        token.serviceType = user.serviceType;
        token.lastSignIn = Date.now();
      }
      
      // Add session refresh logic
      if (token && token.sub) {
        const now = Date.now()
        const lastSignIn = token.lastSignIn as number || now
        const sessionAge = now - lastSignIn
        
        // Refresh token if session is older than 24 hours but younger than 30 days
        if (sessionAge > 24 * 60 * 60 * 1000 && sessionAge < 30 * 24 * 60 * 60 * 1000) {
          try {
            const user = await prisma.user.findUnique({
              where: { id: token.sub },
              select: {
                id: true,
                role: true,
                serviceType: true,
                isDisabled: true,
                isLocked: true,
                lockUntil: true,
              }
            })
            
            if (user && !user.isDisabled && !user.isLocked) {
              token.lastSignIn = now
            } else {
              // User is disabled or locked, clear session
              return { ...token, error: 'DISABLED_ACCOUNT' }
            }
          } catch (error) {
            console.error('Session refresh error:', error)
            // Continue with existing token if refresh fails
          }
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.serviceType = token.serviceType as string;
        
        // Add session metadata for debugging
        ;(session as any).sessionExpires = Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days from now
        ;(session as any).lastRefreshed = token.lastSignIn as number || Date.now()
        
        // Handle disabled/locked accounts
        if (token.error === 'DISABLED_ACCOUNT') {
          ;(session as any).error = 'DISABLED_ACCOUNT'
        }
      }
      return session;
    },
  },
}
