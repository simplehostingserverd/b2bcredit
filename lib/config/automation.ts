/**
 * Blog Automation Configuration Loader
 * Loads and validates configuration from YAML file and environment variables
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import yaml from 'js-yaml'

export interface AutomationConfig {
  system: {
    name: string
    version: string
    environment: string
  }
  performance_goals: {
    traffic_increase_target: number
    leads_per_1000_visits: number
    avg_dwell_time_seconds: number
    optimization_frequency_days: number
  }
  content: {
    style: string
    tone: string
    min_word_count: number
    max_word_count: number
    target_audience: string
    seo: {
      primary_keyword_density: number
      min_headings: number
      min_internal_links: number
      min_external_links: number
      readability_target: number
    }
    schema_types: string[]
  }
  agents: {
    planner: AgentConfig
    writer: AgentConfig
    optimizer: AgentConfig
    publisher: AgentConfig
    distributor: AgentConfig
    analytics: AgentConfig
    lead: AgentConfig
  }
  integrations: Record<string, any>
  database: Record<string, any>
  queue: Record<string, any>
  jobs: Record<string, any>
  logging: Record<string, any>
  monitoring: Record<string, any>
  rate_limits: Record<string, any>
  content_storage: Record<string, any>
  security: Record<string, any>
  compliance: Record<string, any>
}

export interface AgentConfig {
  enabled: boolean
  [key: string]: any
}

class ConfigLoader {
  private config: AutomationConfig | null = null

  /**
   * Load configuration from YAML file with environment variable substitution
   */
  load(): AutomationConfig {
    if (this.config) {
      return this.config
    }

    try {
      const configPath = join(process.cwd(), 'config', 'blog-automation.yaml')
      const fileContents = readFileSync(configPath, 'utf8')

      // Replace environment variables
      const processedContents = this.substituteEnvVars(fileContents)

      // Parse YAML
      this.config = yaml.load(processedContents) as AutomationConfig

      // Validate configuration
      this.validate()

      return this.config
    } catch (error) {
      console.error('Failed to load automation configuration:', error)
      throw new Error('Invalid automation configuration')
    }
  }

  /**
   * Substitute environment variables in configuration
   */
  private substituteEnvVars(content: string): string {
    return content.replace(/\${([^}]+)}/g, (match, envVar) => {
      const value = process.env[envVar]
      if (value === undefined) {
        console.warn(`Environment variable ${envVar} not found, using empty string`)
        return ''
      }
      return value
    })
  }

  /**
   * Validate configuration structure and values
   */
  private validate(): void {
    if (!this.config) {
      throw new Error('Configuration not loaded')
    }

    // Validate required sections
    const requiredSections = ['system', 'agents', 'content']
    for (const section of requiredSections) {
      if (!(section in this.config)) {
        throw new Error(`Missing required configuration section: ${section}`)
      }
    }

    // Validate content requirements
    if (this.config.content.min_word_count >= this.config.content.max_word_count) {
      throw new Error('min_word_count must be less than max_word_count')
    }

    // Validate performance goals
    if (this.config.performance_goals.traffic_increase_target <= 0 ||
        this.config.performance_goals.traffic_increase_target > 1) {
      throw new Error('traffic_increase_target must be between 0 and 1')
    }
  }

  /**
   * Get configuration for a specific agent
   */
  getAgentConfig(agentName: keyof AutomationConfig['agents']): AgentConfig {
    const config = this.load()
    return config.agents[agentName]
  }

  /**
   * Check if an agent is enabled
   */
  isAgentEnabled(agentName: keyof AutomationConfig['agents']): boolean {
    const agentConfig = this.getAgentConfig(agentName)
    return agentConfig.enabled
  }

  /**
   * Get content requirements
   */
  getContentRequirements() {
    const config = this.load()
    return config.content
  }

  /**
   * Get performance goals
   */
  getPerformanceGoals() {
    const config = this.load()
    return config.performance_goals
  }

  /**
   * Get integration config
   */
  getIntegration(name: string) {
    const config = this.load()
    return config.integrations[name] || null
  }

  /**
   * Reload configuration (useful for hot reloading)
   */
  reload(): AutomationConfig {
    this.config = null
    return this.load()
  }
}

// Export singleton instance
export const automationConfig = new ConfigLoader()

// Export helper functions
export function getConfig(): AutomationConfig {
  return automationConfig.load()
}

export function getAgentConfig(agentName: keyof AutomationConfig['agents']): AgentConfig {
  return automationConfig.getAgentConfig(agentName)
}

export function isAgentEnabled(agentName: keyof AutomationConfig['agents']): boolean {
  return automationConfig.isAgentEnabled(agentName)
}
