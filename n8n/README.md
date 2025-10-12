# n8n Blog Automation Setup

This directory contains the configuration and workflows for automating blog content distribution and SEO optimization using n8n.

## Overview

The automation system handles:
- **Social Media Posting**: Automatically post new blog content to LinkedIn and Twitter
- **Newsletter Distribution**: Send new blog posts to email subscribers
- **SEO Monitoring**: Track keyword rankings and content performance
- **Content Research**: Suggest new topics based on trending keywords

## Quick Start

### 1. Install n8n

```bash
# Using npm
npm install -g n8n

# Or using Docker
docker run -it --rm --name n8n -p 5678:5678 n8n/n8n
```

### 2. Import Workflows

1. Start n8n (`n8n` command or access via browser)
2. Go to the workflows section
3. Click "Import from File"
4. Select `workflows/blog-automation.json`
5. Configure the required credentials

### 3. Configure Environment Variables

Add these variables to your n8n instance:

```bash
# Social Media APIs
LINKEDIN_ACCESS_TOKEN=your_linkedin_token
LINKEDIN_PERSON_URN=your_linkedin_profile_urn
LINKEDIN_API_URL=https://api.linkedin.com/v2

TWITTER_BEARER_TOKEN=your_twitter_token
TWITTER_API_URL=https://api.twitter.com/2

# Email Service
EMAIL_SERVICE_URL=your_email_service_webhook
EMAIL_API_KEY=your_email_service_key

# SEO Tools
SEO_TOOL_API=your_seo_analysis_service
SEO_API_KEY=your_seo_tool_key

# Blog API
BLOG_API_URL=https://your-domain.com/api
```

### 4. Set Up Webhooks

Configure your blog to trigger n8n webhooks:

```javascript
// In your blog post creation/update logic
const triggerN8nAutomation = async (event, data) => {
  await fetch('YOUR_N8N_WEBHOOK_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data })
  })
}

// Trigger on blog post publish
await triggerN8nAutomation('blog_post_published', {
  postId: 'post-id',
  title: 'Post Title',
  slug: 'post-slug',
  excerpt: 'Post excerpt...',
  url: 'https://your-domain.com/blog/post-slug',
  author: 'Author Name',
  publishedAt: new Date().toISOString(),
  tags: ['tag1', 'tag2']
})
```

## Available Automations

### 1. Blog Post Published

**Triggers:**
- New blog post goes live
- Draft post is published

**Actions:**
- Post to LinkedIn company page
- Tweet on Twitter
- Send newsletter to subscribers
- Run SEO analysis
- Track in analytics

### 2. SEO Monitoring

**Triggers:**
- Daily scheduled check
- New post published

**Actions:**
- Check keyword rankings
- Monitor competitor content
- Analyze content gaps
- Suggest new topics

### 3. Content Research

**Triggers:**
- Weekly scheduled research
- Low-performing content detected

**Actions:**
- Research trending topics
- Analyze competitor strategies
- Suggest content ideas
- Generate content briefs

## Workflow Details

### Social Media Integration

#### LinkedIn Posting
- Posts as company updates
- Includes post title, excerpt, and link
- Adds relevant hashtags
- Schedules for optimal times

#### Twitter Posting
- Creates engaging tweets under 280 characters
- Includes link and call-to-action
- Uses relevant hashtags
- Mentions influencers when appropriate

### Newsletter Integration

#### Email Templates
- **New Post Notification**: Announces latest content
- **Weekly Digest**: Summarizes week's best posts
- **Topic-Specific**: Targeted content for subscriber interests

#### Subscriber Management
- Automatic list segmentation
- Open rate tracking
- Click-through monitoring
- Unsubscribe handling

### SEO Optimization

#### Content Analysis
- Keyword density optimization
- Readability scoring
- Internal linking suggestions
- Meta tag optimization

#### Performance Tracking
- Organic traffic monitoring
- Search ranking positions
- Content engagement metrics
- Conversion tracking

## Customization

### Adding New Platforms

1. Create new node in workflow
2. Configure API credentials
3. Add posting logic
4. Test thoroughly

### Modifying Triggers

1. Edit webhook trigger conditions
2. Update event filters
3. Test with sample data
4. Monitor for issues

### Custom Analytics

1. Add new tracking nodes
2. Configure data collection
3. Set up reporting dashboards
4. Schedule regular reports

## Monitoring and Maintenance

### Health Checks
- Monitor workflow executions
- Check for failed runs
- Review error logs
- Update API tokens

### Performance Optimization
- Monitor execution times
- Optimize slow nodes
- Scale for high volume
- Regular cleanup

### Backup and Recovery
- Export workflows regularly
- Document configurations
- Test disaster recovery
- Update documentation

## Troubleshooting

### Common Issues

**Webhook failures:**
- Check n8n webhook URL
- Verify API credentials
- Review network connectivity

**Social media posting errors:**
- Validate API tokens
- Check rate limits
- Verify content format

**Email delivery issues:**
- Confirm email service configuration
- Check bounce rates
- Monitor spam filters

### Debug Mode

Enable debug logging in n8n:
1. Go to workflow settings
2. Enable execution logging
3. Check detailed error messages
4. Test with sample data

## Security Considerations

### API Security
- Use HTTPS for all API calls
- Rotate API tokens regularly
- Limit token permissions
- Monitor for unauthorized access

### Data Protection
- Encrypt sensitive data in workflows
- Use secure credential storage
- Regular security audits
- Compliance with data protection laws

## Support and Resources

### Documentation
- [n8n Official Docs](https://docs.n8n.io/)
- [n8n Community Forum](https://community.n8n.io/)
- [n8n YouTube Channel](https://www.youtube.com/c/n8n-io)

### API References
- [LinkedIn Marketing API](https://docs.microsoft.com/en-us/linkedin/marketing/)
- [Twitter API v2](https://developer.twitter.com/en/docs/twitter-api)
- [Google Analytics API](https://developers.google.com/analytics)

## Cost Optimization

### n8n Cloud
- Start with free tier (3,000 executions/month)
- Upgrade based on usage
- Monitor execution counts
- Optimize workflow efficiency

### API Costs
- Monitor LinkedIn API usage
- Track Twitter API calls
- Optimize SEO tool usage
- Consider caching strategies

## Next Steps

1. **Set up n8n** instance (self-hosted or cloud)
2. **Import workflows** and configure credentials
3. **Test with sample data** before going live
4. **Monitor performance** and optimize as needed
5. **Scale automation** as your blog grows

This automation system will significantly boost your blog's reach and efficiency, allowing you to focus on creating great content while the technology handles distribution and optimization.