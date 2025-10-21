// AI Client for Free Models

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIResponse {
  content: string
  model: string
  provider: string
  tokensUsed?: number
}

export class AIClient {
  private provider: string
  private apiKey: string
  private baseURL: string
  private model: string

  constructor(provider: string = 'GROQ', model?: string) {
    this.provider = provider
    
    // Get API key from environment
    if (provider === 'GROQ') {
      this.apiKey = process.env.GROQ_API_KEY || ''
      this.baseURL = 'https://api.groq.com/openai/v1'
      this.model = model || 'llama-3.1-8b-instant'
    } else if (provider === 'HUGGINGFACE') {
      this.apiKey = process.env.HUGGINGFACE_API_KEY || ''
      this.baseURL = 'https://api-inference.huggingface.co/models'
      this.model = model || 'meta-llama/Meta-Llama-3-8B-Instruct'
    } else if (provider === 'TOGETHER') {
      this.apiKey = process.env.TOGETHER_API_KEY || ''
      this.baseURL = 'https://api.together.xyz/v1'
      this.model = model || 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'
    } else {
      throw new Error(`Unknown provider: ${provider}`)
    }
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error(`API key not configured for ${this.provider}. Set ${this.provider}_API_KEY environment variable.`)
    }

    try {
      if (this.provider === 'GROQ' || this.provider === 'TOGETHER') {
        // OpenAI-compatible API
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
          }),
        })

        if (!response.ok) {
          const error = await response.text()
          throw new Error(`${this.provider} API error: ${error}`)
        }

        const data = await response.json()
        return {
          content: data.choices[0].message.content,
          model: this.model,
          provider: this.provider,
          tokensUsed: data.usage?.total_tokens,
        }
      } else if (this.provider === 'HUGGINGFACE') {
        // Hugging Face API
        const response = await fetch(`${this.baseURL}/${this.model}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            inputs: messages[messages.length - 1].content,
            parameters: {
              max_new_tokens: 2000,
              temperature: 0.7,
              return_full_text: false,
            },
          }),
        })

        if (!response.ok) {
          const error = await response.text()
          throw new Error(`Hugging Face API error: ${error}`)
        }

        const data = await response.json()
        const content = Array.isArray(data) ? data[0].generated_text : data.generated_text

        return {
          content,
          model: this.model,
          provider: this.provider,
        }
      }

      throw new Error(`Unsupported provider: ${this.provider}`)
    } catch (error) {
      console.error('AI Client error:', error)
      throw error
    }
  }

  async analyzeApplication(application: any): Promise<string> {
    const prompt = `You are a business credit analyst. Analyze this business funding application and provide:
1. Risk Assessment (Low/Medium/High)
2. Key Strengths
3. Key Concerns
4. Recommendation (Approve/Reject/Request More Info)
5. Brief reasoning

Application Details:
- Business: ${application.businessName}
- Type: ${application.businessType}
- Industry: ${application.industry || 'Not specified'}
- Revenue (Annual): $${application.annualRevenue?.toLocaleString() || 'Not provided'}
- Revenue (Monthly): $${application.monthlyRevenue?.toLocaleString() || 'Not provided'}
- Credit Score: ${application.creditScore || 'Not provided'}
- Existing Debt: $${application.existingDebt?.toLocaleString() || 'Not provided'}
- Funding Requested: $${application.fundingAmount?.toLocaleString() || 'Not provided'}
- Purpose: ${application.fundingPurpose || 'Not specified'}
- Years in Business: ${application.dateEstablished ? Math.floor((Date.now() - new Date(application.dateEstablished).getTime()) / (365 * 24 * 60 * 60 * 1000)) : 'Not provided'}

Provide a concise analysis in 5-7 bullet points.`

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are an expert business credit analyst. Provide clear, concise analysis of funding applications.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    const response = await this.chat(messages)
    return response.content
  }

  async generateRejectionLetter(application: any, reason: string): Promise<string> {
    const prompt = `Generate a professional, empathetic rejection letter for a business funding application.

Business: ${application.businessName}
Applicant: ${application.user?.name}
Reason: ${reason}

The letter should:
- Be professional but empathetic
- Briefly explain the decision
- Offer alternative suggestions or next steps
- End on an encouraging note
- Be 3-4 paragraphs max

Do not include placeholders like [Your Company]. Just write the body of the letter.`

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a professional business correspondence writer. Write clear, empathetic rejection letters.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    const response = await this.chat(messages)
    return response.content
  }

  async generateApprovalLetter(application: any): Promise<string> {
    const prompt = `Generate a professional approval letter for a business funding application.

Business: ${application.businessName}
Applicant: ${application.user?.name}
Funding Amount: $${application.fundingAmount?.toLocaleString()}

The letter should:
- Congratulate the applicant
- Confirm the approved amount
- Mention next steps
- Be professional and encouraging
- Be 3-4 paragraphs max

Do not include placeholders. Just write the body of the letter.`

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a professional business correspondence writer. Write clear, professional approval letters.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    const response = await this.chat(messages)
    return response.content
  }
}

// Factory function
export function createAIClient(provider?: string, model?: string): AIClient {
  return new AIClient(provider, model)
}
