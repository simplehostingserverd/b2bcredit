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
  const [seoScore, setSeoScore] = useState(0)
  const [keywords, setKeywords] = useState('')
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([])
  const [isGeneratingPost, setIsGeneratingPost] = useState(false)
  const [readabilityScore, setReadabilityScore] = useState(0)
  const [tone, setTone] = useState('Neutral')

  const fetchKeywordSuggestions = async (query: string) => {
    if (query.length < 3) {
      setKeywordSuggestions([])
      return
    }

    try {
      const response = await fetch('/api/ai/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      if (response.ok) {
        const data = await response.json()
        setKeywordSuggestions(data.keywords || [])
      }
    } catch (error) {
      console.error('Error fetching keyword suggestions:', error)
    }
  }

  const generateAIPost = async () => {
    if (!keywords || isGeneratingPost) return

    setIsGeneratingPost(true)
    try {
      const response = await fetch('/api/ai/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: keywords }),
      })

      if (response.ok) {
        const data = await response.json()
        if (editor) {
          editor.commands.setContent(data.post)
        }
      } else {
        console.error('Failed to generate AI post')
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error('Error generating AI post:', error)
    } finally {
      setIsGeneratingPost(false)
    }
  }

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
      const htmlContent = editor.getHTML()
      const textContent = editor.getText()
      onChange(htmlContent)
      calculateSEO(textContent, keywords)
      calculateReadability(textContent)
      detectTone(textContent)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  })

  const calculateSEO = useCallback((text: string, currentKeywords: string) => {
    let score = 0
    const words = text.split(' ').length

    // Word count
    if (words >= 1500) score += 25
    else if (words >= 1000) score += 20
    else if (words >= 500) score += 15
    else score += 5

    // Headings
    const h1Count = (text.match(/<h1>/g) || []).length
    const h2Count = (text.match(/<h2>/g) || []).length
    const h3Count = (text.match(/<h3>/g) || []).length
    if (h1Count === 1) score += 15
    if (h2Count >= 3) score += 15
    if (h3Count >= 5) score += 10

    // Links
    const linkCount = (text.match(/<a /g) || []).length
    if (linkCount >= 3) score += 10

    // Images
    const imageCount = (text.match(/<img /g) || []).length
    if (imageCount >= 1) score += 5

    // Lists
    const listCount = (text.match(/<(ul|ol)>/g) || []).length
    if (listCount >= 2) score += 5

    // Keyword optimization
    const keywordDensity = calculateKeywordDensity(text, currentKeywords)
    if (keywordDensity >= 1 && keywordDensity <= 3) score += 15
    else if (keywordDensity > 0) score += 5

    setSeoScore(Math.min(score, 100))
  }, [])

  const calculateKeywordDensity = (text: string, currentKeywords: string): number => {
    if (!currentKeywords) return 0

    const words = text.toLowerCase().split(/\s+/)
    const totalWords = words.length
    const seoKeywords = currentKeywords.toLowerCase().split(',').map(k => k.trim()).filter(Boolean)

    if (seoKeywords.length === 0) return 0

    const keywordCount = words.filter(word =>
      seoKeywords.some(keyword => word.includes(keyword))
    ).length

    return totalWords > 0 ? (keywordCount / totalWords) * 100 : 0
  }

  const calculateReadability = useCallback((text: string) => {
    const sentences = text.split(/[.!?]+/).length - 1
    const words = text.split(/\s+/).length
    const syllables = text.split(/\s+/).reduce((acc, word) => acc + countSyllables(word), 0)

    if (sentences === 0 || words === 0) {
      setReadabilityScore(0)
      return
    }

    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
    setReadabilityScore(Math.max(0, Math.min(100, score)))
  }, [])

  const countSyllables = (word: string): number => {
    word = word.toLowerCase()
    if (word.length <= 3) return 1
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    word = word.replace(/^y/, '')
    const match = word.match(/[aeiouy]{1,2}/g)
    return match ? match.length : 0
  }

  const detectTone = useCallback((text: string) => {
    const lowerText = text.toLowerCase()
    const formalWords = ['sincerely', 'regards', 'therefore', 'however']
    const casualWords = ['hey', 'cool', 'awesome', 'btw']
    const optimisticWords = ['great', 'amazing', 'excellent', 'positive']

    let toneScore = 0
    if (formalWords.some(word => lowerText.includes(word))) toneScore++
    if (casualWords.some(word => lowerText.includes(word))) toneScore--
    if (optimisticWords.some(word => lowerText.includes(word))) toneScore += 0.5

    if (toneScore > 0.5) setTone('Formal')
    else if (toneScore < -0.5) setTone('Casual')
    else if (toneScore > 0) setTone('Optimistic')
    else setTone('Neutral')
  }, [])

  const insertSEOTemplate = useCallback(() => {
    if (!editor) return

    const template = `
<h1>Compelling SEO-Optimized Title</h1>
<p><strong>Introduction:</strong> Start with your primary keyword and hook the reader.</p>
<h2>Section 1: Main Topic</h2>
<p>Elaborate on the main topic, using your primary and secondary keywords naturally.</p>
<h3>Subsection 1.1</h3>
<p>Dive deeper into a specific aspect of the main topic.</p>
<h2>Section 2: Related Topic</h2>
<p>Discuss a related topic to provide more value and context.</p>
<ul>
  <li>Key point 1</li>
  <li>Key point 2</li>
</ul>
<h2>Conclusion</h2>
<p>Summarize the key takeaways and include a call-to-action.</p>
`
    editor.commands.setContent(template)
  }, [editor])

  if (!editor) {
    return <div className="animate-pulse h-96 bg-white/10 rounded-lg"></div>
  }

  const keywordDensity = calculateKeywordDensity(editor.getText(), keywords)

  return (
    <div className="border border-white/20 rounded-lg bg-white/5">
      {/* Editor Toolbar */}
      <div className="border-b border-white/20 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Text Formatting */}
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bold') ? 'bg-purple-500/20' : ''}`} title="Bold"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('italic') ? 'bg-purple-500/20' : ''}`} title="Italic"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20H6v-2h4v2zm4-16H6v2h8V4zm4 8H6v4h12v-4z" /></svg></button>
          
          {/* Headings */}
          <select onChange={(e) => { const level = parseInt(e.target.value) as 1 | 2 | 3; if (level > 0) { editor.chain().focus().toggleHeading({ level }).run() } else { editor.chain().focus().setParagraph().run() } }} className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm">
            <option value="0">Paragraph</option>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
          </select>

          {/* Lists */}
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bulletList') ? 'bg-purple-500/20' : ''}`} title="Bullet List"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('orderedList') ? 'bg-purple-500/20' : ''}`} title="Numbered List"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg></button>
          
          {/* Quote */}
          <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('blockquote') ? 'bg-purple-500/20' : ''}`} title="Quote"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg></button>

          {/* Table */}
          <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="p-2 rounded hover:bg-white/10" title="Insert Table"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg></button>

          {/* Code Block */}
          <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('codeBlock') ? 'bg-purple-500/20' : ''}`} title="Code Block"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg></button>

          {/* Image Tools */}
          <div className="flex items-center space-x-1">
            <ImageUpload editor={editor} onImageUploaded={(url) => console.log('Image uploaded:', url)} />
            <ImageManager editor={editor} onImageSelect={(url) => console.log('Image selected:', url)} />
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <button onClick={insertSEOTemplate} className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors text-sm" title="Insert SEO Template">SEO Template</button>
          </div>
        </div>

        {/* SEO & Keyword Section */}
        <div className="mt-4 space-y-4">
          {/* Keyword Input */}
          <div>
            <label className="text-sm text-white/70 mb-1 block">Topic / Target Keywords</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={keywords}
                onChange={(e) => {
                  setKeywords(e.target.value)
                  fetchKeywordSuggestions(e.target.value)
                  calculateSEO(editor.getText(), e.target.value)
                }}
                placeholder="Enter a topic to generate a post or keywords..."
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={generateAIPost}
                disabled={isGeneratingPost || !keywords}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center"
              >
                {isGeneratingPost ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate Post'
                )}
              </button>
            </div>
          </div>

          {/* Keyword Suggestions */}
          {keywordSuggestions.length > 0 && (
            <div>
              <label className="text-sm text-white/70 mb-1 block">Suggestions</label>
              <div className="flex flex-wrap gap-2">
                {keywordSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const newKeywords = [...new Set([...keywords.split(','), suggestion].map(k => k.trim()).filter(Boolean))].join(', ')
                      setKeywords(newKeywords)
                      calculateSEO(editor.getText(), newKeywords)
                    }}
                    className="bg-white/10 text-white/80 px-2 py-1 rounded hover:bg-purple-500/30 transition-colors text-xs"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Section */}
          <div className="flex items-center gap-6 text-sm text-white/70">
            <div>
              SEO Score:
              <span className={`ml-2 font-semibold ${seoScore >= 80 ? 'text-green-400' : seoScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {seoScore}/100
              </span>
            </div>
            <div>
              Density: <span className="font-semibold text-white">{keywordDensity.toFixed(2)}%</span>
            </div>
            <div>
              Readability: 
              <span className={`ml-2 font-semibold ${readabilityScore >= 60 ? 'text-green-400' : readabilityScore >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                {readabilityScore.toFixed(0)}
              </span>
            </div>
            <div>
              Tone: <span className="font-semibold text-white">{tone}</span>
            </div>
            <div className="flex-1 bg-white/10 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all ${seoScore >= 80 ? 'bg-green-400' : seoScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`} style={{ width: `${seoScore}%` }}></div>
            </div>
            <button onClick={() => setIsPreview(!isPreview)} className="text-sm text-purple-400 hover:text-purple-300">
              {isPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        {isPreview ? (
          <div className="p-4"><div className="prose prose-lg prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: editor.getHTML() }} /></div>
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