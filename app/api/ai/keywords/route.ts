import { NextResponse } from 'next/server'

const fetchKeywordSuggestions = async (query: string): Promise<string[]> => {
  console.log(`Fetching keyword suggestions for query: "${query}"`);

  if (!query) {
    return [];
  }

  // Mock keyword suggestions based on the query
  // In a real implementation, you could use:
  // - Google Keyword Planner API
  // - SEMrush API
  // - Ahrefs API
  // - Or an AI model to generate semantic keywords

  const baseKeywords: Record<string, string[]> = {
    'business': ['small business', 'business plan', 'business credit', 'business funding', 'business formation'],
    'credit': ['business credit', 'credit score', 'credit card', 'credit building', 'credit line'],
    'funding': ['business funding', 'startup funding', 'funding options', 'funding sources', 'capital funding'],
    'llc': ['llc formation', 'llc benefits', 'llc vs corporation', 'llc taxes', 'llc requirements'],
    'loan': ['business loan', 'small business loan', 'sba loan', 'loan application', 'loan approval']
  }

  const lowerQuery = query.toLowerCase()
  const matchedKeywords: string[] = []

  // Find matching keywords
  Object.entries(baseKeywords).forEach(([key, keywords]) => {
    if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
      matchedKeywords.push(...keywords)
    }
  })

  // If no matches, generate generic suggestions based on query words
  if (matchedKeywords.length === 0) {
    const words = query.split(' ')
    words.forEach(word => {
      if (word.length > 3) {
        matchedKeywords.push(
          `${word} guide`,
          `${word} tips`,
          `${word} strategies`,
          `best ${word}`,
          `how to ${word}`
        )
      }
    })
  }

  // Remove duplicates and limit results
  const uniqueKeywords = Array.from(new Set(matchedKeywords))
  console.log(`Returning ${uniqueKeywords.length} suggestions.`)
  return uniqueKeywords.slice(0, 15)
};

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (typeof query !== 'string') {
      return NextResponse.json({ error: 'Invalid query format' }, { status: 400 });
    }

    const keywords = await fetchKeywordSuggestions(query);
    return NextResponse.json({ keywords });

  } catch (error) {
    console.error('Error in keyword suggestion API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}