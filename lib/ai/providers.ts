// Free AI Model Providers

export interface AIProvider {
  name: string
  apiKey?: string
  baseURL: string
  models: string[]
  free: boolean
}

export const AI_PROVIDERS = {
  GROQ: {
    name: 'Groq',
    baseURL: 'https://api.groq.com/openai/v1',
    models: [
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
    ],
    free: true,
    description: 'Fast inference with Llama models',
  },
  HUGGINGFACE: {
    name: 'Hugging Face',
    baseURL: 'https://api-inference.huggingface.co/models',
    models: [
      'meta-llama/Meta-Llama-3-8B-Instruct',
      'mistralai/Mixtral-8x7B-Instruct-v0.1',
      'microsoft/Phi-3-mini-4k-instruct',
      'google/gemma-2-9b-it',
    ],
    free: true,
    description: 'Hugging Face Inference API (free tier)',
  },
  TOGETHER: {
    name: 'Together AI',
    baseURL: 'https://api.together.xyz/v1',
    models: [
      'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      'mistralai/Mixtral-8x7B-Instruct-v0.1',
      'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
    ],
    free: true,
    description: 'Together AI (free credits)',
  },
}

export const DEFAULT_MODEL = 'llama-3.1-8b-instant'
export const DEFAULT_PROVIDER = 'GROQ'
