/**
 * Base Agent Class
 * All autonomous agents extend this base class
 */

import { prisma } from '@/lib/prisma'
import { AgentConfig } from '@/lib/config/automation'

export type AgentType = 'PLANNER' | 'WRITER' | 'OPTIMIZER' | 'PUBLISHER' | 'DISTRIBUTOR' | 'ANALYTICS' | 'LEAD'
export type TaskType = 'RESEARCH' | 'GENERATE' | 'OPTIMIZE' | 'PUBLISH' | 'DISTRIBUTE' | 'ANALYZE'
export type AgentStatus = 'SUCCESS' | 'FAILED' | 'PARTIAL'

export interface AgentResult {
  status: AgentStatus
  data?: any
  metrics?: Record<string, any>
  errors?: string[]
  warnings?: string[]
}

export interface TaskInput {
  [key: string]: any
}

export interface TaskOutput {
  [key: string]: any
}

export abstract class BaseAgent {
  protected agentType: AgentType
  protected config: AgentConfig
  protected startTime: number = 0
  protected errors: string[] = []
  protected warnings: string[] = []

  constructor(agentType: AgentType, config: AgentConfig) {
    this.agentType = agentType
    this.config = config
  }

  /**
   * Main execution method - must be implemented by each agent
   */
  abstract execute(input: TaskInput): Promise<AgentResult>

  /**
   * Validate input before execution
   */
  protected abstract validateInput(input: TaskInput): boolean

  /**
   * Start tracking execution time
   */
  protected startTracking(): void {
    this.startTime = Date.now()
    this.errors = []
    this.warnings = []
  }

  /**
   * Stop tracking and return duration
   */
  protected stopTracking(): number {
    return Date.now() - this.startTime
  }

  /**
   * Log agent activity to database
   */
  protected async logActivity(
    action: string,
    status: AgentStatus,
    input?: any,
    output?: any,
    metrics?: any,
    errorMessage?: string
  ): Promise<void> {
    try {
      const duration = this.stopTracking()

      await prisma.agentLog.create({
        data: {
          agentType: this.agentType,
          action,
          status,
          input: input || undefined,
          output: output || undefined,
          metrics: metrics || undefined,
          errorMessage,
          duration
        }
      })
    } catch (error) {
      console.error('Failed to log agent activity:', error)
      // Don't throw - logging failure shouldn't stop execution
    }
  }

  /**
   * Create a content task in the database
   */
  protected async createTask(
    taskType: TaskType,
    topicId?: string,
    input?: any,
    scheduledFor?: Date
  ): Promise<string> {
    const task = await prisma.contentTask.create({
      data: {
        agentType: this.agentType,
        taskType,
        topicId,
        input: input || undefined,
        scheduledFor,
        status: 'PENDING'
      }
    })
    return task.id
  }

  /**
   * Update a content task
   */
  protected async updateTask(
    taskId: string,
    status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED',
    output?: any,
    errorMessage?: string
  ): Promise<void> {
    await prisma.contentTask.update({
      where: { id: taskId },
      data: {
        status,
        output: output || undefined,
        errorMessage,
        ...(status === 'IN_PROGRESS' && { startedAt: new Date() }),
        ...(status === 'COMPLETED' || status === 'FAILED' ? { completedAt: new Date() } : {})
      }
    })
  }

  /**
   * Add an error
   */
  protected addError(error: string): void {
    this.errors.push(error)
    console.error(`[${this.agentType}] Error:`, error)
  }

  /**
   * Add a warning
   */
  protected addWarning(warning: string): void {
    this.warnings.push(warning)
    console.warn(`[${this.agentType}] Warning:`, warning)
  }

  /**
   * Check if agent is enabled in configuration
   */
  protected isEnabled(): boolean {
    return this.config.enabled
  }

  /**
   * Build result object
   */
  protected buildResult(
    status: AgentStatus,
    data?: any,
    metrics?: Record<string, any>
  ): AgentResult {
    return {
      status,
      data,
      metrics,
      errors: this.errors.length > 0 ? this.errors : undefined,
      warnings: this.warnings.length > 0 ? this.warnings : undefined
    }
  }

  /**
   * Run the agent with proper error handling and logging
   */
  async run(input: TaskInput): Promise<AgentResult> {
    this.startTracking()

    // Check if enabled
    if (!this.isEnabled()) {
      const result = this.buildResult('FAILED', null, { disabled: true })
      await this.logActivity('RUN', 'FAILED', input, null, null, 'Agent is disabled')
      return result
    }

    // Validate input
    if (!this.validateInput(input)) {
      this.addError('Invalid input parameters')
      const result = this.buildResult('FAILED')
      await this.logActivity('RUN', 'FAILED', input, null, null, 'Invalid input')
      return result
    }

    try {
      // Execute the agent
      const result = await this.execute(input)

      // Log activity
      await this.logActivity(
        'RUN',
        result.status,
        input,
        result.data,
        result.metrics,
        result.errors?.join(', ')
      )

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.addError(errorMessage)

      const result = this.buildResult('FAILED')
      await this.logActivity('RUN', 'FAILED', input, null, null, errorMessage)

      return result
    }
  }
}
