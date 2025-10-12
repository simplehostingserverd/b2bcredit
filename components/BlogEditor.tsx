'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { CharacterCount } from '@tiptap/extension-character-count'
import { common, createLowlight } from 'lowlight'
import { useCallback, useState } from 'react'
import ImageUpload from './ImageUpload'
import ImageManager from './ImageManager'

const lowlight = createLowlight(common)

interface BlogEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing your blog post...'
}) => {
  const [isPreview, setIsPreview] = useState(false)
  const [seoScore, setSeoScore] = useState(85)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-400 underline hover:text-purple-300',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
      calculateSEO(editor.getText())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  })

  const calculateSEO = useCallback((text: string) => {
    let score = 0
    const words = text.split(' ').length

    // Word count (aim for 1500+ words)
    if (words >= 1500) score += 25
    else if (words >= 1000) score += 20
    else if (words >= 500) score += 15
    else score += 5

    // Headings (H1, H2, H3 structure)
    const h1Count = (text.match(/<h1>/g) || []).length
    const h2Count = (text.match(/<h2>/g) || []).length
    const h3Count = (text.match(/<h3>/g) || []).length

    if (h1Count === 1) score += 15
    if (h2Count >= 3) score += 15
    if (h3Count >= 5) score += 10

    // Links (internal/external)
    const linkCount = (text.match(/<a /g) || []).length
    if (linkCount >= 3) score += 10

    // Images (visual content)
    const imageCount = (text.match(/<img /g) || []).length
    if (imageCount >= 1) score += 5

    // Lists (structured content)
    const listCount = (text.match(/<(ul|ol)>/g) || []).length
    if (listCount >= 2) score += 5

    // Keyword optimization (basic check)
    const keywordDensity = calculateKeywordDensity(text)
    if (keywordDensity >= 1 && keywordDensity <= 3) score += 10

    setSeoScore(Math.min(score, 100))
  }, [])

  const calculateKeywordDensity = (text: string): number => {
    // This is a simplified keyword density calculation
    // In a real implementation, you'd analyze for target keywords
    const words = text.toLowerCase().split(/\s+/)
    const totalWords = words.length

    // Count common SEO keywords (simplified example)
    const seoKeywords = ['business', 'credit', 'funding', 'startup', 'llc', 'company']
    const keywordCount = words.filter(word =>
      seoKeywords.some(keyword => word.includes(keyword))
    ).length

    return totalWords > 0 ? (keywordCount / totalWords) * 100 : 0
  }

  const insertSEOTemplate = useCallback(() => {
    if (!editor) return

    const template = `
<h1>Compelling SEO-Optimized Title</h1>

<p><strong>Introduction paragraph</strong> with your primary keyword naturally placed. Hook readers with a compelling opening that addresses their pain points and preview the value they'll get from reading.</p>

<h2>Primary Section with Target Keyword</h2>

<p>Provide comprehensive information about your topic. Use your primary keyword naturally throughout the content, aiming for 1-2% keyword density.</p>

<h3>Subsection for Better Organization</h3>

<p>Break down complex topics into digestible sections. Each section should provide unique value and build upon previous information.</p>

<h2>Secondary Important Topic</h2>

<p>Address related topics that your audience cares about. This helps establish topical authority and keeps readers engaged longer.</p>

<h3>Key Benefits or Features</h3>

<ul>
<li><strong>Benefit 1:</strong> Clear, measurable outcome readers will achieve</li>
<li><strong>Benefit 2:</strong> Another valuable result or advantage</li>
<li><strong>Benefit 3:</strong> Third compelling reason to care about this topic</li>
</ul>

<blockquote>
<p>Include an insightful quote or key statistic that supports your main points.</p>
</blockquote>

<h2>Implementation or Action Steps</h2>

<ol>
<li><strong>Step 1:</strong> Clear, actionable first step</li>
<li><strong>Step 2:</strong> Second logical action to take</li>
<li><strong>Step 3:</strong> Third step in the process</li>
</ol>

<h2>Common Challenges and Solutions</h2>

<p>Address potential obstacles readers might face and provide practical solutions.</p>

<h2>Conclusion and Call-to-Action</h2>

<p>Summarize key takeaways and guide readers toward next steps. Include relevant internal links to related content.</p>

<p><a href="/related-article">Related: Read more about this topic</a></p>
    `

    editor.commands.setContent(template)
  }, [editor])

  if (!editor) {
    return <div className="animate-pulse h-96 bg-white/10 rounded-lg"></div>
  }

  return (
    <div className="border border-white/20 rounded-lg bg-white/5">
      {/* Editor Toolbar */}
      <div className="border-b border-white/20 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Text Formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bold') ? 'bg-purple-500/20' : ''}`}
            title="Bold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive('italic') ? 'bg-purple-500/20' : ''}`}
            title="Italic"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20H6v-2h4v2zm4-16H6v2h8V4zm4 8H6v4h12v-4z" />
            </svg>
          </button>

          {/* Headings */}
          <select
            onChange={(e) => {
              const level = parseInt(e.target.value) as 1 | 2 | 3
              if (level > 0) {
                editor.chain().focus().toggleHeading({ level }).run()
              } else {
                editor.chain().focus().setParagraph().run()
              }
            }}
            className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm"
          >
            <option value="0">Paragraph</option>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
          </select>

          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bulletList') ? 'bg-purple-500/20' : ''}`}
            title="Bullet List"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive('orderedList') ? 'bg-purple-500/20' : ''}`}
            title="Numbered List"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </button>

          {/* Quote */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive('blockquote') ? 'bg-purple-500/20' : ''}`}
            title="Quote"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </button>

          {/* Table */}
          <button
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className="p-2 rounded hover:bg-white/10"
            title="Insert Table"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>

          {/* Code Block */}
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-white/10 ${editor.isActive('codeBlock') ? 'bg-purple-500/20' : ''}`}
            title="Code Block"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </button>

          {/* Image Tools */}
          <div className="flex items-center space-x-1">
            <ImageUpload editor={editor} onImageUploaded={(url) => {
              // Image already inserted by ImageUpload component
              console.log('Image uploaded:', url)
            }} />

            <ImageManager editor={editor} onImageSelect={(url) => {
              // Image already inserted by ImageManager component
              console.log('Image selected:', url)
            }} />
          </div>

          <div className="ml-auto flex items-center space-x-2">
            {/* SEO Template */}
            <button
              onClick={insertSEOTemplate}
              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors text-sm"
              title="Insert SEO Template"
            >
              SEO Template
            </button>
          </div>
        </div>

        {/* SEO Score */}
        <div className="mt-4 flex items-center gap-4">
          <div className="text-sm text-white/70">
            SEO Score:
            <span className={`ml-2 font-semibold ${seoScore >= 80 ? 'text-green-400' : seoScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
              {seoScore}/100
            </span>
          </div>

          <div className="flex-1 bg-white/10 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${seoScore >= 80 ? 'bg-green-400' : seoScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
              style={{ width: `${seoScore}%` }}
            ></div>
          </div>

          <button
            onClick={() => setIsPreview(!isPreview)}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        {isPreview ? (
          <div className="p-4">
            <div
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            />
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      {/* Word Count & Read Time */}
      <div className="border-t border-white/20 p-4 bg-white/5">
        <div className="flex justify-between items-center text-sm text-white/70">
          <div>
            Words: <span className="text-white">{editor.storage.characterCount.words()}</span>
          </div>
          <div>
            Read Time: <span className="text-white">{Math.ceil(editor.storage.characterCount.words() / 200)} min</span>
          </div>
          <div>
            Characters: <span className="text-white">{editor.storage.characterCount.characters()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogEditor