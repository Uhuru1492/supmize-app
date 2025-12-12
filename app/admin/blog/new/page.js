'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { marked } from 'marked'

export default function NewBlogPost() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: 'Safety',
    author: 'Supmize Team',
    read_time: 5,
    published: false
  })

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth !== 'true') {
      router.push('/admin')
    }
  }, [])

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    })
  }

  const calculateReadTime = (text) => {
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const handleContentChange = (e) => {
    const content = e.target.value
    setFormData({
      ...formData,
      content,
      read_time: calculateReadTime(content)
    })
  }

  const insertMarkdown = (syntax) => {
    const textarea = document.getElementById('content-textarea')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = formData.content
    const before = text.substring(0, start)
    const selected = text.substring(start, end)
    const after = text.substring(end)

    let newText = ''
    let newCursorPos = start

    switch(syntax) {
      case 'bold':
        newText = before + '**' + (selected || 'bold text') + '**' + after
        newCursorPos = start + 2
        break
      case 'italic':
        newText = before + '*' + (selected || 'italic text') + '*' + after
        newCursorPos = start + 1
        break
      case 'h2':
        newText = before + '\n## ' + (selected || 'Heading 2') + '\n' + after
        newCursorPos = start + 4
        break
      case 'h3':
        newText = before + '\n### ' + (selected || 'Heading 3') + '\n' + after
        newCursorPos = start + 5
        break
      case 'link':
        newText = before + '[' + (selected || 'link text') + '](url)' + after
        newCursorPos = end + 3
        break
      case 'list':
        newText = before + '\n- ' + (selected || 'List item') + '\n' + after
        newCursorPos = start + 3
        break
      case 'image':
        newText = before + '\n![Alt text](image-url)\n' + after
        newCursorPos = start + 3
        break
    }

    setFormData({ ...formData, content: newText })
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          ...formData,
          published_at: formData.published ? new Date().toISOString() : null
        }])
        .select()

      if (error) throw error

      alert('Post created successfully!')
      router.push('/admin/blog')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create post: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const previewHtml = marked(formData.content || '')

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/blog')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-gray-900">New Blog Post</h1>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition"
          >
            {showPreview ? '✏️ Edit' : '👁 Preview'}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {showPreview ? (
          // PREVIEW MODE
          <div className="bg-white rounded-xl shadow-sm border p-12">
            <div className="max-w-3xl mx-auto">
              {formData.category && (
                <div className="mb-4">
                  <span className="text-teal-600 font-semibold text-sm uppercase tracking-wide">
                    {formData.category}
                  </span>
                </div>
              )}
              
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight" style={{fontFamily: 'Georgia, serif'}}>
                {formData.title || 'Your Title Here'}
              </h1>

              {formData.excerpt && (
                <p className="text-xl text-gray-600 mb-6" style={{fontFamily: 'Georgia, serif'}}>
                  {formData.excerpt}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 pb-6 border-b mb-12">
                <span>By {formData.author}</span>
                <span>•</span>
                <span>{formData.read_time} min read</span>
              </div>

              {formData.featured_image && (
                <img src={formData.featured_image} alt={formData.title} className="w-full mb-12 rounded-xl" />
              )}

              <div 
                className="article-content"
                style={{fontFamily: 'Georgia, serif', fontSize: '21px', lineHeight: '1.68'}}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        ) : (
          // EDIT MODE
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8">
                
                {/* Title */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none text-2xl font-bold"
                    placeholder="Your compelling headline..."
                    required
                  />
                </div>

                {/* Slug */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    www.supmize.com/blog/{formData.slug || 'post-slug'}
                  </p>
                </div>

                {/* Category & Read Time */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    >
                      <option>Safety</option>
                      <option>Interactions</option>
                      <option>Research</option>
                      <option>Optimization</option>
                      <option>Money Saving</option>
                      <option>News</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Read Time
                    </label>
                    <input
                      type="number"
                      value={formData.read_time}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-calculated</p>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Excerpt (SEO Description)
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="A compelling summary that will appear on the blog listing..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.excerpt.length}/160 characters (ideal for SEO)
                  </p>
                </div>

                {/* Featured Image */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="https://i.imgur.com/..."
                  />
                  {formData.featured_image && (
                    <img src={formData.featured_image} alt="Preview" className="mt-3 w-full h-48 object-cover rounded-lg" />
                  )}
                </div>

                {/* Formatting Toolbar */}
                <div className="mb-3 flex flex-wrap gap-2 pb-3 border-b">
                  <button type="button" onClick={() => insertMarkdown('bold')} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded font-bold text-sm">
                    B
                  </button>
                  <button type="button" onClick={() => insertMarkdown('italic')} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded italic text-sm">
                    I
                  </button>
                  <button type="button" onClick={() => insertMarkdown('h2')} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded font-bold text-sm">
                    H2
                  </button>
                  <button type="button" onClick={() => insertMarkdown('h3')} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded font-bold text-sm">
                    H3
                  </button>
                  <button type="button" onClick={() => insertMarkdown('link')} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm">
                    🔗 Link
                  </button>
                  <button type="button" onClick={() => insertMarkdown('list')} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm">
                    • List
                  </button>
                  <button type="button" onClick={() => insertMarkdown('image')} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm">
                    🖼 Image
                  </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content (Markdown) *
                  </label>
                  <textarea
                    id="content-textarea"
                    value={formData.content}
                    onChange={handleContentChange}
                    rows="25"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none font-mono text-sm leading-relaxed"
                    placeholder="Start writing your article..."
                    required
                    style={{tabSize: 2}}
                  />
                </div>

                {/* Publish Toggle */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-900 block">
                        {formData.published ? '✅ Published' : '📝 Draft'}
                      </span>
                      <span className="text-xs text-gray-600">
                        {formData.published ? 'Visible to everyone' : 'Only visible to you'}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-lg font-bold hover:from-teal-700 hover:to-teal-800 transition disabled:opacity-50"
                  >
                    {saving ? 'Creating...' : formData.published ? '✅ Publish Now' : '📝 Save as Draft'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => router.push('/admin/blog')}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>

            {/* Sidebar - Quick Guide */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  📝 Formatting Guide
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-mono text-xs bg-gray-50 p-2 rounded mb-1">## Heading 2</p>
                    <p className="text-gray-600 text-xs">Major sections</p>
                  </div>

                  <div>
                    <p className="font-mono text-xs bg-gray-50 p-2 rounded mb-1">### Heading 3</p>
                    <p className="text-gray-600 text-xs">Sub-sections</p>
                  </div>

                  <div>
                    <p className="font-mono text-xs bg-gray-50 p-2 rounded mb-1">**bold text**</p>
                    <p className="text-gray-600 text-xs">Emphasis</p>
                  </div>

                  <div>
                    <p className="font-mono text-xs bg-gray-50 p-2 rounded mb-1">*italic text*</p>
                    <p className="text-gray-600 text-xs">Light emphasis</p>
                  </div>

                  <div>
                    <p className="font-mono text-xs bg-gray-50 p-2 rounded mb-1">- List item</p>
                    <p className="text-gray-600 text-xs">Bullet points</p>
                  </div>

                  <div>
                    <p className="font-mono text-xs bg-gray-50 p-2 rounded mb-1">[text](url)</p>
                    <p className="text-gray-600 text-xs">Links</p>
                  </div>

                  <div>
                    <p className="font-mono text-xs bg-gray-50 p-2 rounded mb-1">![alt](url)</p>
                    <p className="text-gray-600 text-xs">Images</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">✍️ Writing Tips</h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li>• Start with a personal story</li>
                    <li>• Use short paragraphs (3-4 sentences)</li>
                    <li>• Include subheadings every 300 words</li>
                    <li>• Add images to break up text</li>
                    <li>• End with a clear CTA</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
