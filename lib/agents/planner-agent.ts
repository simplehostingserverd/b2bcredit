/**
 * PlannerAgent - Topic Discovery & Keyword Research
 *
 * Responsibilities:
 * - Discover trending B2B credit/funding topics
 * - Research keywords and calculate SEO metrics
 * - Cluster keywords semantically
 * - Prioritize topics based on opportunity scores
 * - Create content calendar
 */

import { BaseAgent, AgentResult, TaskInput } from './base-agent'
import { prisma } from '@/lib/prisma'
import { getAgentConfig } from '@/lib/config/automation'
import axios from 'axios'
import * as cheerio from 'cheerio'

export interface TopicDiscoveryInput extends TaskInput {
  count?: number
  categories?: string[]
  source?: 'trending' | 'competitor' | 'manual'
}

export interface Keyword {
  keyword: string
  searchVolume?: number
  difficulty?: number
  cpc?: number
  trend?: 'up' | 'down' | 'stable'
}

export interface DiscoveredTopic {
  topic: string
  category?: string
  primaryKeyword?: string
  keywords: Keyword[]
  searchIntent?: 'informational' | 'commercial' | 'transactional' | 'navigational'
  competitorUrls?: string[]
  opportunityScore: number
}

export class PlannerAgent extends BaseAgent {
  // B2B Credit & Funding related seed topics
  private seedTopics = [
    'business credit building',
    'small business funding',
    'startup capital',
    'business line of credit',
    'commercial credit score',
    'business credit cards',
    'SBA loans',
    'LLC formation for credit',
    'vendor credit accounts',
    'business cash flow management',
    'corporate credit building',
    'business credit repair',
    'net 30 accounts',
    'trade credit',
    'business credit monitoring',
    'business credit vs personal credit',
    'business loan approval',
    'business credit requirements',
    'business credit benefits',
    'business credit mistakes'
  ]

  constructor() {
    const config = getAgentConfig('planner')
    super('PLANNER', config)
    this.config = config
  }

  protected validateInput(input: TopicDiscoveryInput): boolean {
    // Basic validation - count should be reasonable
    if (input.count && (input.count < 1 || input.count > 100)) {
      this.addError('Count must be between 1 and 100')
      return false
    }
    return true
  }

  async execute(input: TopicDiscoveryInput): Promise<AgentResult> {
    const { count = 10, source = 'trending' } = input

    try {
      let topics: DiscoveredTopic[] = []

      // Discover topics based on source
      switch (source) {
        case 'trending':
          topics = await this.discoverTrendingTopics(count)
          break
        case 'competitor':
          topics = await this.analyzeCompetitorContent(count)
          break
        case 'manual':
          topics = this.generateFromSeeds(count)
          break
        default:
          topics = await this.discoverTrendingTopics(count)
      }

      // Research keywords for each topic
      for (const topic of topics) {
        topic.keywords = await this.researchKeywords(topic.topic)
        topic.primaryKeyword = this.selectPrimaryKeyword(topic.keywords)
      }

      // Calculate opportunity scores
      topics = topics.map(topic => ({
        ...topic,
        opportunityScore: this.calculateOpportunityScore(topic)
      }))

      // Sort by opportunity score
      topics.sort((a, b) => b.opportunityScore - a.opportunityScore)

      // Save to database
      const savedTopics = await this.saveTopics(topics)

      return this.buildResult('SUCCESS', {
        topics: savedTopics,
        count: savedTopics.length
      }, {
        source,
        avgOpportunityScore: topics.reduce((sum, t) => sum + t.opportunityScore, 0) / topics.length
      })

    } catch (error) {
      this.addError(error instanceof Error ? error.message : 'Unknown error')
      return this.buildResult('FAILED')
    }
  }

  /**
   * Discover trending topics using various free sources
   */
  private async discoverTrendingTopics(count: number): Promise<DiscoveredTopic[]> {
    const topics: DiscoveredTopic[] = []

    try {
      // Method 1: Analyze Reddit business communities
      const redditTopics = await this.scrapeRedditTrends()
      topics.push(...redditTopics)

      // Method 2: Check business news sites for trending topics
      const newsTopics = await this.scrapeBusinessNews()
      topics.push(...newsTopics)

      // Method 3: Use seed topics with variations
      const seedTopics = this.generateFromSeeds(Math.max(count - topics.length, 5))
      topics.push(...seedTopics)

    } catch (error) {
      this.addWarning(`Failed to discover trending topics: ${error}`)
      // Fallback to seed topics
      return this.generateFromSeeds(count)
    }

    // Remove duplicates and limit to count
    const uniqueTopics = this.deduplicateTopics(topics)
    return uniqueTopics.slice(0, count)
  }

  /**
   * Scrape Reddit for trending business topics
   */
  private async scrapeRedditTrends(): Promise<DiscoveredTopic[]> {
    const topics: DiscoveredTopic[] = []

    try {
      const subreddits = ['smallbusiness', 'Entrepreneur', 'startups', 'business']

      for (const subreddit of subreddits.slice(0, 2)) { // Limit to avoid rate limits
        const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`

        const response = await axios.get(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; B2BCreditBot/1.0)' },
          timeout: 5000
        })

        const posts = response.data?.data?.children || []

        for (const post of posts) {
          const title = post.data?.title || ''

          // Extract business-related topics
          if (this.isRelevantTopic(title)) {
            topics.push({
              topic: this.cleanTopicTitle(title),
              category: 'business_funding',
              keywords: [],
              searchIntent: 'informational',
              competitorUrls: [],
              opportunityScore: 0
            })
          }
        }
      }
    } catch (error) {
      this.addWarning('Reddit scraping failed, using alternative methods')
    }

    return topics
  }

  /**
   * Scrape business news for trending topics
   */
  private async scrapeBusinessNews(): Promise<DiscoveredTopic[]> {
    const topics: DiscoveredTopic[] = []

    try {
      // Scrape business news RSS feeds (free sources)
      const sources = [
        'https://www.entrepreneur.com/topic/small-business',
        'https://www.inc.com/small-business'
      ]

      // For demo, just add some current trending topics
      // In production, implement actual RSS/scraping
      const trendingNow = [
        'AI tools for small business',
        'Remote team management',
        '2025 small business tax changes',
        'Business credit in economic downturn'
      ]

      topics.push(...trendingNow.map(topic => ({
        topic,
        category: 'business_management',
        keywords: [],
        searchIntent: 'informational' as const,
        competitorUrls: [],
        opportunityScore: 0
      })))

    } catch (error) {
      this.addWarning('News scraping failed')
    }

    return topics
  }

  /**
   * Generate topics from seed list with variations
   */
  private generateFromSeeds(count: number): DiscoveredTopic[] {
    const topics: DiscoveredTopic[] = []

    // Shuffle and select
    const shuffled = this.seedTopics.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, count)

    for (const topic of selected) {
      // Add variations
      const variations = this.generateTopicVariations(topic)
      const randomVariation = variations[Math.floor(Math.random() * variations.length)]

      topics.push({
        topic: randomVariation,
        category: 'business_credit',
        keywords: [],
        searchIntent: 'informational',
        competitorUrls: [],
        opportunityScore: 0
      })
    }

    return topics
  }

  /**
   * Generate topic variations (how to, guide, tips, etc.)
   */
  private generateTopicVariations(baseTopic: string): string[] {
    return [
      `How to ${baseTopic}`,
      `Complete guide to ${baseTopic}`,
      `${baseTopic}: tips and strategies`,
      `Best practices for ${baseTopic}`,
      `${baseTopic} for beginners`,
      `${baseTopic} in 2025`,
      `Common mistakes in ${baseTopic}`,
      `${baseTopic}: what you need to know`
    ]
  }

  /**
   * Research keywords for a topic
   * Uses free keyword suggestion APIs and generates semantic variations
   */
  private async researchKeywords(topic: string): Promise<Keyword[]> {
    const keywords: Keyword[] = []

    // Add the topic itself as primary keyword
    keywords.push({
      keyword: topic.toLowerCase(),
      searchVolume: this.estimateSearchVolume(topic),
      difficulty: this.estimateDifficulty(topic),
      trend: 'stable'
    })

    // Generate semantic variations
    const variations = this.generateKeywordVariations(topic)
    for (const variation of variations) {
      keywords.push({
        keyword: variation,
        searchVolume: this.estimateSearchVolume(variation),
        difficulty: this.estimateDifficulty(variation),
        trend: 'stable'
      })
    }

    // Add related long-tail keywords
    const longTail = this.generateLongTailKeywords(topic)
    keywords.push(...longTail)

    return keywords.slice(0, 15) // Limit to top 15
  }

  /**
   * Generate keyword variations
   */
  private generateKeywordVariations(keyword: string): string[] {
    const variations: string[] = []

    // Question-based variations
    variations.push(`what is ${keyword}`)
    variations.push(`how to ${keyword}`)
    variations.push(`why ${keyword}`)
    variations.push(`${keyword} tips`)
    variations.push(`${keyword} guide`)
    variations.push(`best ${keyword}`)

    // Add year for timely content
    const year = new Date().getFullYear()
    variations.push(`${keyword} ${year}`)

    return variations
  }

  /**
   * Generate long-tail keyword variations
   */
  private generateLongTailKeywords(topic: string): Keyword[] {
    const templates = [
      `${topic} for small business`,
      `${topic} requirements`,
      `${topic} benefits`,
      `${topic} vs personal`,
      `how long does ${topic} take`,
      `${topic} step by step`,
      `${topic} checklist`,
      `${topic} mistakes to avoid`
    ]

    return templates.map(kw => ({
      keyword: kw,
      searchVolume: this.estimateSearchVolume(kw),
      difficulty: this.estimateDifficulty(kw),
      trend: 'stable' as const
    }))
  }

  /**
   * Estimate search volume based on keyword characteristics
   * This is a simplified estimation - in production, use Google Keyword Planner API
   */
  private estimateSearchVolume(keyword: string): number {
    const wordCount = keyword.split(' ').length

    // Shorter keywords typically have higher volume
    if (wordCount <= 2) return Math.floor(Math.random() * 5000) + 1000
    if (wordCount <= 4) return Math.floor(Math.random() * 2000) + 500
    return Math.floor(Math.random() * 500) + 100
  }

  /**
   * Estimate SEO difficulty (0-100)
   * Simplified estimation based on keyword length and competitiveness
   */
  private estimateDifficulty(keyword: string): number {
    const wordCount = keyword.split(' ').length
    const hasNumbers = /\d/.test(keyword)

    let difficulty = 50 // Base difficulty

    // Shorter keywords are harder to rank for
    if (wordCount <= 2) difficulty += 30
    else if (wordCount <= 3) difficulty += 15
    else difficulty -= 10

    // Long-tail and specific keywords are easier
    if (hasNumbers || keyword.includes('how to') || keyword.includes('best')) {
      difficulty -= 15
    }

    return Math.min(Math.max(difficulty, 10), 90)
  }

  /**
   * Select the best primary keyword
   */
  private selectPrimaryKeyword(keywords: Keyword[]): string {
    if (keywords.length === 0) return ''

    // Score each keyword
    const scored = keywords.map(kw => ({
      keyword: kw.keyword,
      score: (kw.searchVolume || 0) / ((kw.difficulty || 50) + 1)
    }))

    // Sort by score (high volume, low difficulty)
    scored.sort((a, b) => b.score - a.score)

    return scored[0].keyword
  }

  /**
   * Calculate opportunity score (0-100)
   * Based on search volume, difficulty, and relevance
   */
  private calculateOpportunityScore(topic: DiscoveredTopic): number {
    const keywords = topic.keywords
    if (keywords.length === 0) return 50

    const avgVolume = keywords.reduce((sum, kw) => sum + (kw.searchVolume || 0), 0) / keywords.length
    const avgDifficulty = keywords.reduce((sum, kw) => sum + (kw.difficulty || 50), 0) / keywords.length

    // Higher volume = better
    // Lower difficulty = better
    const volumeScore = Math.min(avgVolume / 100, 50)
    const difficultyScore = Math.max(50 - avgDifficulty / 2, 0)

    return Math.round(volumeScore + difficultyScore)
  }

  /**
   * Analyze competitor content for topic ideas
   */
  private async analyzeCompetitorContent(count: number): Promise<DiscoveredTopic[]> {
    // In production, scrape competitor blogs
    // For now, return seed topics
    this.addWarning('Competitor analysis not yet implemented, using seed topics')
    return this.generateFromSeeds(count)
  }

  /**
   * Check if topic is relevant to B2B credit/funding
   */
  private isRelevantTopic(title: string): boolean {
    const relevantKeywords = [
      'business', 'credit', 'funding', 'loan', 'capital',
      'startup', 'small business', 'entrepreneur', 'llc',
      'financing', 'cash flow', 'revenue'
    ]

    const lowerTitle = title.toLowerCase()
    return relevantKeywords.some(kw => lowerTitle.includes(kw))
  }

  /**
   * Clean and standardize topic titles
   */
  private cleanTopicTitle(title: string): string {
    // Remove Reddit-specific formatting
    let cleaned = title.replace(/\[.*?\]/g, '').trim()

    // Limit length
    if (cleaned.length > 100) {
      cleaned = cleaned.substring(0, 100) + '...'
    }

    return cleaned
  }

  /**
   * Remove duplicate topics
   */
  private deduplicateTopics(topics: DiscoveredTopic[]): DiscoveredTopic[] {
    const seen = new Set<string>()
    const unique: DiscoveredTopic[] = []

    for (const topic of topics) {
      const normalized = topic.topic.toLowerCase().trim()
      if (!seen.has(normalized)) {
        seen.add(normalized)
        unique.push(topic)
      }
    }

    return unique
  }

  /**
   * Save discovered topics to database
   */
  private async saveTopics(topics: DiscoveredTopic[]): Promise<any[]> {
    const saved = []

    for (const topic of topics) {
      // Check if topic already exists
      const existing = await prisma.contentTopic.findFirst({
        where: {
          topic: topic.topic
        }
      })

      if (existing) {
        this.addWarning(`Topic already exists: ${topic.topic}`)
        continue
      }

      // Create new topic
      const created = await prisma.contentTopic.create({
        data: {
          topic: topic.topic,
          category: topic.category,
          primaryKeyword: topic.primaryKeyword,
          secondaryKeywords: topic.keywords.map(kw => kw.keyword),
          searchVolume: topic.keywords.reduce((sum, kw) => sum + (kw.searchVolume || 0), 0),
          difficulty: topic.keywords.reduce((sum, kw) => sum + (kw.difficulty || 50), 0) / topic.keywords.length,
          priority: topic.opportunityScore,
          searchIntent: topic.searchIntent,
          competitorUrls: topic.competitorUrls || [],
          status: 'DISCOVERED'
        }
      })

      // Create keyword records
      for (const keyword of topic.keywords.slice(0, 10)) { // Limit to top 10
        await prisma.contentKeyword.create({
          data: {
            keyword: keyword.keyword,
            searchVolume: keyword.searchVolume,
            difficulty: keyword.difficulty,
            cpc: keyword.cpc,
            trend: keyword.trend,
            topicId: created.id
          }
        })
      }

      saved.push(created)
    }

    return saved
  }
}

// Export a singleton instance for easy use
export const plannerAgent = new PlannerAgent()
