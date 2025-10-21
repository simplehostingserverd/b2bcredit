import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Function to fetch internal link suggestions based on content
const fetchInternalLinkSuggestions = async (currentContent: string): Promise<{ title: string; url: string }[]> => {
  console.log('Fetching internal link suggestions...');

  if (!currentContent) {
    return [];
  }

  try {
    // Fetch published blog posts from database
    const allPosts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          lte: new Date()
        }
      },
      select: {
        title: true,
        slug: true,
        tags: true,
        excerpt: true
      },
      take: 50 // Limit to most recent 50 posts for performance
    });

    const lowerCaseContent = currentContent.toLowerCase();

    // Score each post based on keyword matches
    const scoredPosts = allPosts.map(post => {
      let score = 0;
      const postKeywords = post.title.toLowerCase().split(/\s+/);
      const postTags = post.tags || [];

      // Check title keywords
      postKeywords.forEach(keyword => {
        if (keyword.length > 4 && lowerCaseContent.includes(keyword)) {
          score += 2; // Title matches are worth more
        }
      });

      // Check tags
      postTags.forEach(tag => {
        if (lowerCaseContent.includes(tag.toLowerCase())) {
          score += 3; // Tag matches are worth even more
        }
      });

      // Check excerpt
      if (post.excerpt && lowerCaseContent.includes(post.excerpt.toLowerCase().substring(0, 50))) {
        score += 1;
      }

      return {
        title: post.title,
        url: `/blog/${post.slug}`,
        score
      };
    });

    // Filter and sort by score
    const suggestions = scoredPosts
      .filter(post => post.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5) // Return top 5 suggestions
      .map(({ title, url }) => ({ title, url }));

    console.log(`Returning ${suggestions.length} internal link suggestions.`);
    return suggestions;
  } catch (error) {
    console.error('Error fetching blog posts for internal links:', error);
    // Return empty array on error
    return [];
  }
};

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (typeof content !== 'string') {
      return NextResponse.json({ error: 'Invalid content format' }, { status: 400 });
    }

    const suggestions = await fetchInternalLinkSuggestions(content);
    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error('Error in internal-links API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}