import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Function to remove markdown formatting from content
function cleanMarkdownContent(content: string): string {
  return content
    // Remove markdown headers (#, ##, ###, ####, #####, ######) with following line breaks
    .replace(/^#{1,6}\s+.*$/gm, (match) => {
      // Extract just the text without the # symbols
      return match.replace(/^#{1,6}\s+/, '')
    })
    // Remove bold markdown (**text**) - handle nested properly
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')
    // Remove italic markdown (*text*) - be careful not to match bold
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
    // Remove underline markdown (__text__)
    .replace(/__([^\n]+)__/g, '$1')
    // Remove inline code (`code`)
    .replace(/`([^`\n]+)`/g, '$1')
    // Remove code blocks (```code```) including multi-line
    .replace(/```[\s\S]*?```/g, '')
    // Remove list markers (-, *, + followed by space) at start of line
    .replace(/^[\s]*[-*+]\s+/gm, '')
    // Remove numbered list markers (1. , 2. , etc.) at start of line
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove emphasis markers that weren't caught above
    .replace(/\*{1,2}([^*\n]+)\*{1,2}/g, '$1')
    // Clean up multiple line breaks
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Clean up extra whitespace left from removed formatting
    .replace(/\n\s*\n/g, '\n\n')
    // Remove trailing spaces from lines
    .replace(/[ \t]+$/gm, '')
    // Trim whitespace from start and end
    .trim()
}

async function cleanBlogContent() {
  try {
    console.log('Starting blog content cleaning...')

    // Get all published blog posts
    const posts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' }
    })

    console.log(`Found ${posts.length} published blog posts to clean`)

    // Clean each post's content
    for (const post of posts) {
      const cleanedContent = cleanMarkdownContent(post.content)

      if (cleanedContent !== post.content) {
        await prisma.blogPost.update({
          where: { id: post.id },
          data: { content: cleanedContent }
        })
        console.log(`Cleaned content for: ${post.title}`)
      } else {
        console.log(`No changes needed for: ${post.title}`)
      }
    }

    console.log('Blog content cleaning completed successfully!')
  } catch (error) {
    console.error('Error cleaning blog content:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanBlogContent()