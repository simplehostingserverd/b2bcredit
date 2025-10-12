'use client'

import { useState } from 'react'

interface BlogTemplate {
  id: string
  name: string
  description: string
  template: string
  targetKeywords: string[]
  wordCount: string
}

interface BlogTemplatesProps {
  onTemplateSelect: (template: string) => void
  className?: string
}

const blogTemplates: BlogTemplate[] = [
  {
    id: 'how-to-guide',
    name: 'How-To Guide',
    description: 'Step-by-step instructional content for business processes',
    targetKeywords: ['how to', 'guide', 'tutorial', 'step by step'],
    wordCount: '2000-3000',
    template: `# How to [Primary Keyword]: Complete Guide for [Target Audience]

## Introduction

[Hook with pain point or benefit] Are you struggling with [specific problem]? You're not alone. [Statistics or relatable scenario]. In this comprehensive guide, you'll learn exactly how to [achieve desired outcome] with proven strategies that work.

## Why [Topic] Matters for [Your Audience]

Before diving into the how-to, let's understand why this matters:

### [Benefit 1]
- [Specific advantage]
- [Measurable outcome]
- [Real-world example]

### [Benefit 2]
- [Specific advantage]
- [Measurable outcome]
- [Real-world example]

## [Primary Keyword] Fundamentals

### What is [Primary Keyword]?
[Clear, comprehensive definition with context for your audience]

### Why Businesses Need [Primary Keyword]
- **Risk mitigation**: [How it prevents problems]
- **Cost savings**: [Financial benefits]
- **Growth acceleration**: [How it drives business success]

## Step-by-Step Guide to [Primary Keyword]

### Step 1: [Preparation/Planning Phase]
**What to do:**
1. [Specific action item]
2. [Specific action item]
3. [Specific action item]

**Tools needed:**
- [Tool/resource 1]
- [Tool/resource 2]

**Common mistakes to avoid:**
- [Mistake 1 and solution]
- [Mistake 2 and solution]

### Step 2: [Implementation Phase]
**Detailed process:**
1. [Sub-step 1]
2. [Sub-step 2]
3. [Sub-step 3]

**Pro tips:**
- [Expert tip 1]
- [Expert tip 2]

### Step 3: [Execution/Launch Phase]
**Action items:**
1. [Execution step 1]
2. [Execution step 2]
3. [Execution step 3]

## Best Practices for [Primary Keyword]

### [Best Practice Category 1]
- [Tip 1 with explanation]
- [Tip 2 with explanation]
- [Tip 3 with explanation]

### [Best Practice Category 2]
- [Advanced technique 1]
- [Advanced technique 2]
- [Expert-level strategy]

## Common Challenges and Solutions

### Challenge 1: [Common Problem]
**Symptoms:**
- [Symptom 1]
- [Symptom 2]

**Solutions:**
1. [Solution approach 1]
2. [Solution approach 2]
3. [Prevention strategy]

### Challenge 2: [Another Common Problem]
**Why it happens:**
- [Root cause 1]
- [Root cause 2]

**How to overcome:**
1. [Solution 1]
2. [Solution 2]

## Tools and Resources for [Primary Keyword]

### Essential Tools
1. **[Tool 1]** - [Brief description and why it's valuable]
2. **[Tool 2]** - [Brief description and use case]
3. **[Tool 3]** - [Brief description and benefits]

### Free Resources
- [Resource 1] - [What's included]
- [Resource 2] - [Value proposition]
- [Resource 3] - [Unique benefit]

## Measuring Success with [Primary Keyword]

### Key Metrics to Track
- **Metric 1**: [What to measure and why]
- **Metric 2**: [What to measure and target]
- **Metric 3**: [Success indicators]

### Tools for Measurement
- [Analytics tool 1]
- [Tracking tool 2]
- [Reporting tool 3]

## Next Steps After [Primary Keyword]

### Immediate Actions (First 30 Days)
1. [Action 1] - [Timeline and expected outcome]
2. [Action 2] - [Timeline and expected outcome]
3. [Action 3] - [Timeline and expected outcome]

### Long-term Strategy (3-6 Months)
- [Strategic goal 1]
- [Strategic goal 2]
- [Strategic goal 3]

## Frequently Asked Questions

### [FAQ 1]?
[Comprehensive answer with actionable advice]

### [FAQ 2]?
[Detailed response with examples]

### [FAQ 3]?
[Expert answer with best practices]

## Conclusion

[Summary of key takeaways] By implementing these strategies, you'll be able to [achieve main benefit] and [secondary benefit].

**Ready to get started?** [Call-to-action with next step]

---

*Need personalized guidance? Contact our experts for help with [specific service related to topic].*`
  },
  {
    id: 'listicle',
    name: 'List-Based Article',
    description: 'Curated lists of tools, tips, or strategies',
    targetKeywords: ['best', 'top', 'list', 'tips', 'strategies'],
    wordCount: '1500-2500',
    template: `# [Number] Best [Topic] for [Target Audience] in 2024

## Introduction

[Compelling hook] Looking for the best [topic] to [achieve goal]? With so many options available, choosing the right [topic] can be overwhelming.

In this comprehensive guide, I've curated the top [number] [topic] that [target audience] are using successfully in 2024.

## Why [Topic] Matter for [Your Business Type]

### The Impact of Quality [Topic]
- **Performance improvement**: [Measurable benefit]
- **ROI enhancement**: [Financial impact]
- **Competitive advantage**: [Market positioning benefit]

### Current Trends in [Topic]
- [Trend 1 and its significance]
- [Trend 2 and market adoption]
- [Trend 3 and future implications]

## [Number] Best [Topic] for [Target Audience]

### 1. [Top Option 1]
**Overview:**
[Brief description of what makes this option special]

**Key Features:**
- [Feature 1] - [Benefit/explanation]
- [Feature 2] - [Benefit/explanation]
- [Feature 3] - [Benefit/explanation]

**Pros:**
- [Advantage 1]
- [Advantage 2]
- [Advantage 3]

**Cons:**
- [Limitation 1] (and how to mitigate)
- [Limitation 2] (and workaround)

**Best For:**
- [Specific use case 1]
- [Specific use case 2]

**Pricing:** [Cost information]
**Website:** [Link to official site]

### 2. [Option 2]
**Overview:**
[Compelling description and unique value proposition]

**Key Features:**
- [Feature 1] - [Detailed benefit]
- [Feature 2] - [Detailed benefit]
- [Feature 3] - [Detailed benefit]

**Pros:**
- [Major advantage 1]
- [Major advantage 2]
- [Major advantage 3]

**Cons:**
- [Minor limitation 1]
- [Minor limitation 2]

**Best For:**
- [Ideal user/scenario 1]
- [Ideal user/scenario 2]

**Pricing:** [Cost structure]
**Website:** [Official link]

### 3. [Option 3]
**Overview:**
[Unique selling proposition and positioning]

**Key Features:**
- [Differentiating feature 1]
- [Differentiating feature 2]
- [Differentiating feature 3]

**Pros:**
- [Competitive advantage 1]
- [Competitive advantage 2]
- [Competitive advantage 3]

**Cons:**
- [Consideration 1]
- [Consideration 2]

**Best For:**
- [Niche application 1]
- [Niche application 2]

**Pricing:** [Pricing model]
**Website:** [Official site]

### 4. [Option 4]
**Overview:**
[Value proposition and target market focus]

**Key Features:**
- [Core feature 1]
- [Core feature 2]
- [Core feature 3]

**Pros:**
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

**Cons:**
- [Drawback 1]
- [Drawback 2]

**Best For:**
- [Specific scenario 1]
- [Specific scenario 2]

**Pricing:** [Cost information]
**Website:** [Link]

### 5. [Option 5]
**Overview:**
[Unique approach or methodology]

**Key Features:**
- [Specialized feature 1]
- [Specialized feature 2]
- [Specialized feature 3]

**Pros:**
- [Advantage 1]
- [Advantage 2]
- [Advantage 3]

**Cons:**
- [Limitation 1]
- [Limitation 2]

**Best For:**
- [Target use case 1]
- [Target use case 2]

**Pricing:** [Pricing details]
**Website:** [Official link]

## How to Choose the Right [Topic] for Your Business

### Assessment Framework
1. **Define your needs**: [Criteria 1]
2. **Set your budget**: [Budget consideration]
3. **Consider your timeline**: [Time factor]
4. **Evaluate your expertise**: [Skill requirement]

### Decision Matrix
| Factor | Weight | Option A | Option B | Option C |
|--------|--------|----------|----------|----------|
| [Factor 1] | [Weight] | [Score] | [Score] | [Score] |
| [Factor 2] | [Weight] | [Score] | [Score] | [Score] |

## Implementation Guide

### Getting Started Checklist
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]
- [ ] [Task 4]

### First 30 Days Plan
**Week 1:**
1. [Milestone 1]
2. [Milestone 2]

**Week 2-4:**
1. [Milestone 3]
2. [Milestone 4]

## Success Stories

### Case Study 1: [Company Type]
**Challenge:** [Problem they faced]
**Solution:** [How they used your recommended option]
**Results:** [Measurable outcomes]

### Case Study 2: [Different Company Type]
**Challenge:** [Different problem]
**Solution:** [Alternative approach]
**Results:** [Different but impressive results]

## Conclusion

[Summary of key insights] The best [topic] for your business depends on your specific needs, budget, and goals. [Final recommendation or key takeaway]

**Ready to implement?** [Strong call-to-action with next step]

---

*Need help choosing the right solution for your business? Our experts can provide personalized recommendations based on your specific situation.*`
  },
  {
    id: 'ultimate-guide',
    name: 'Ultimate Guide',
    description: 'Comprehensive, in-depth guides for complex topics',
    targetKeywords: ['ultimate guide', 'complete guide', 'comprehensive', 'in-depth'],
    wordCount: '3000-5000',
    template: `# The Ultimate Guide to [Complex Topic] for [Specific Audience]

## Executive Summary

[Brief overview] This comprehensive guide covers everything you need to know about [complex topic], from basic concepts to advanced strategies. Whether you're a beginner or experienced professional, you'll find actionable insights to [achieve specific goal].

**What you'll learn:**
- [Key learning outcome 1]
- [Key learning outcome 2]
- [Key learning outcome 3]
- [Key learning outcome 4]

## Chapter 1: Understanding [Complex Topic]

### 1.1 The Fundamentals
[Core concepts and definitions]

**Key Terms:**
- **[Term 1]**: [Definition and importance]
- **[Term 2]**: [Definition and context]
- **[Term 3]**: [Definition and application]

### 1.2 Historical Context
- [Origin and evolution]
- [Key milestones]
- [Current state of the industry/field]

### 1.3 Why It Matters in 2024
- [Current relevance]
- [Market trends]
- [Future predictions]

## Chapter 2: Getting Started

### 2.1 Prerequisites and Requirements
**Before you begin:**
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

**Essential knowledge:**
- [Concept 1]
- [Concept 2]
- [Concept 3]

### 2.2 Initial Setup Process
**Step-by-step setup:**
1. [Detailed step 1]
2. [Detailed step 2]
3. [Detailed step 3]
4. [Detailed step 4]

### 2.3 Common Beginner Mistakes
- [Mistake 1] and how to avoid it
- [Mistake 2] and the solution
- [Mistake 3] and prevention strategy

## Chapter 3: Core Strategies and Techniques

### 3.1 [Strategy Category 1]
**Technique 1: [Specific Method]**
- [Detailed explanation]
- [Step-by-step process]
- [Tools and resources needed]
- [Expected results and timeline]

**Technique 2: [Alternative Method]**
- [Different approach]
- [When to use this method]
- [Pros and cons comparison]

### 3.2 [Strategy Category 2]
**Advanced Technique 1:**
- [Complex concept explanation]
- [Implementation guide]
- [Optimization tips]

**Advanced Technique 2:**
- [Sophisticated strategy]
- [Risk management]
- [Success measurement]

### 3.3 Integration Strategies
**Combining Methods:**
- [How technique 1 + 2 work together]
- [Synergy benefits]
- [Implementation challenges and solutions]

## Chapter 4: Tools and Technology

### 4.1 Essential Tools
**Category 1 Tools:**
1. **[Tool 1]** - [Description, features, use case]
2. **[Tool 2]** - [Description, advantages, pricing]
3. **[Tool 3]** - [Description, unique features]

**Category 2 Tools:**
1. **[Tool 4]** - [Specialized application]
2. **[Tool 5]** - [Integration capabilities]
3. **[Tool 6]** - [Automation features]

### 4.2 Technology Stack Recommendations
**For Beginners:**
- [Simple, user-friendly options]
- [Low learning curve tools]
- [Cost-effective solutions]

**For Advanced Users:**
- [Professional-grade tools]
- [Advanced features]
- [Scalability considerations]

### 4.3 Integration and Automation
**API Connections:**
- [Integration method 1]
- [Integration method 2]
- [Automation workflows]

## Chapter 5: Measurement and Optimization

### 5.1 Key Performance Indicators
**Primary KPIs:**
- [KPI 1]: [Definition, measurement, targets]
- [KPI 2]: [Definition, tracking, benchmarks]
- [KPI 3]: [Definition, analysis, optimization]

**Secondary KPIs:**
- [Supporting metric 1]
- [Supporting metric 2]
- [Supporting metric 3]

### 5.2 Analytics and Reporting
**Tools for Measurement:**
- [Analytics platform 1]
- [Reporting tool 2]
- [Dashboard solution 3]

**Creating Reports:**
- [Report structure]
- [Frequency recommendations]
- [Stakeholder communication]

### 5.3 Continuous Improvement
**Optimization Process:**
1. [Monitor and measure]
2. [Identify opportunities]
3. [Test and implement]
4. [Measure results]
5. [Scale successful changes]

## Chapter 6: Advanced Topics

### 6.1 [Advanced Concept 1]
**Deep dive explanation:**
- [Technical details]
- [Implementation challenges]
- [Expert-level strategies]

### 6.2 [Advanced Concept 2]
**Sophisticated techniques:**
- [Complex methodology]
- [Risk assessment]
- [Success factors]

### 6.3 Emerging Trends
**Future Developments:**
- [Trend 1 and implications]
- [Trend 2 and opportunities]
- [Trend 3 and preparation strategies]

## Chapter 7: Case Studies and Examples

### 7.1 Success Story 1
**Company/Individual:** [Name and background]
**Challenge:** [Specific problem they faced]
**Solution:** [How they applied concepts from this guide]
**Results:** [Measurable outcomes and benefits]

### 7.2 Success Story 2
**Different Context:** [Alternative application or industry]
**Challenge:** [Unique problem]
**Solution:** [Adapted approach]
**Results:** [Different but equally impressive outcomes]

### 7.3 Lessons Learned
**Key Takeaways:**
- [Lesson 1 from case studies]
- [Lesson 2 from real-world application]
- [Lesson 3 from results analysis]

## Chapter 8: Troubleshooting and Support

### 8.1 Common Problems and Solutions
**Problem Category 1:**
- [Symptom 1]: [Root cause and fix]
- [Symptom 2]: [Diagnosis and solution]
- [Symptom 3]: [Prevention strategy]

**Problem Category 2:**
- [Issue 1]: [Troubleshooting steps]
- [Issue 2]: [Resolution process]
- [Issue 3]: [Best practices to avoid]

### 8.2 Getting Help
**Support Resources:**
- [Community forums]
- [Professional services]
- [Educational resources]

**When to Seek Expert Help:**
- [Situation 1 requiring professional assistance]
- [Situation 2 needing specialized expertise]
- [Situation 3 warranting consultation]

## Conclusion

[Comprehensive summary] This ultimate guide has covered everything from basic concepts to advanced strategies for [complex topic].

**Key takeaways:**
- [Major insight 1]
- [Major insight 2]
- [Major insight 3]

**Next steps:**
1. [Immediate action 1]
2. [Short-term goal 1]
3. [Long-term strategy 1]

## Appendices

### Appendix A: Glossary
- **[Term 1]**: [Complete definition]
- **[Term 2]**: [Detailed explanation]
- **[Term 3]**: [Technical description]

### Appendix B: Resources
**Recommended Reading:**
- [Book/resource 1]
- [Book/resource 2]
- [Book/resource 3]

**Online Communities:**
- [Community 1]
- [Community 2]
- [Community 3]

### Appendix C: Templates and Checklists
**Implementation Checklist:**
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

**Strategy Template:**
[Reusable framework for readers to apply]

---

*This guide is regularly updated to reflect the latest developments in [topic]. Bookmark this page and check back for updates, or subscribe to our newsletter for notifications about new content and industry insights.*`
  }
]

export default function BlogTemplates({ onTemplateSelect, className = '' }: BlogTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<BlogTemplate | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleTemplateSelect = (template: BlogTemplate) => {
    setSelectedTemplate(template)
    setShowModal(true)
  }

  const handleConfirmTemplate = () => {
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate.template)
      setShowModal(false)
      setSelectedTemplate(null)
    }
  }

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">Content Templates</h3>

        <div className="grid gap-4">
          {blogTemplates.map((template) => (
            <div
              key={template.id}
              className="card-dark rounded-lg p-4 hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white">{template.name}</h4>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                  {template.wordCount} words
                </span>
              </div>

              <p className="text-white/70 text-sm mb-3">{template.description}</p>

              <div className="flex flex-wrap gap-1">
                {template.targetKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Preview Modal */}
      {showModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/20">
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedTemplate.name} Template</h3>
                <p className="text-white/70 text-sm mt-1">{selectedTemplate.description}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/70 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="bg-white/5 rounded-lg p-4 font-mono text-sm text-white/90 whitespace-pre-line">
                {selectedTemplate.template.substring(0, 1000)}
                {selectedTemplate.template.length > 1000 && '...'}
              </div>
            </div>

            <div className="p-6 border-t border-white/20 flex justify-between items-center">
              <div className="text-sm text-white/60">
                <p>Target: {selectedTemplate.wordCount} words</p>
                <p>Keywords: {selectedTemplate.targetKeywords.join(', ')}</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmTemplate}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}