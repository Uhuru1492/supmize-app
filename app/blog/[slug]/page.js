import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { marked } from 'marked'

// Configure marked for better paragraph handling
marked.setOptions({
  breaks: true,        // Convert single line breaks to <br>
  gfm: true,          // GitHub Flavored Markdown
  headerIds: true,
  mangle: false,
  sanitize: false
})

async function getBlogPost(slug) {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  
  return data
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params
  const post = await getBlogPost(resolvedParams.slug)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-teal-600 hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const htmlContent = marked(post.content || '')

  return (
    <div className="min-h-screen bg-white">
      
      {/* Minimal Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-70 transition">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold">
              💊
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Supmize</span>
          </Link>
          <nav className="flex gap-8 text-[15px]">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition">Home</Link>
            <Link href="/blog" className="text-gray-900 font-medium">Blog</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article className="pb-20">
        
        {/* Hero Section */}
        <div className="max-w-[680px] mx-auto px-6 pt-16 pb-12">
          
          {/* Category */}
          {post.category && (
            <div className="mb-4">
              <span className="text-teal-600 font-semibold text-sm uppercase tracking-wide">
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-[42px] leading-[1.15] md:text-[52px] md:leading-[1.1] font-bold text-gray-900 mb-8 tracking-tight" style={{fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif'}}>
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-[22px] leading-[1.5] text-gray-600 mb-8" style={{fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif'}}>
              {post.excerpt}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 text-[15px] text-gray-500 pb-8 border-b border-gray-200">
            <span>By {post.author || 'Supmize Team'}</span>
            <span>•</span>
            <time>{new Date(post.published_at).toLocaleDateString('en-US', { 
              month: 'long',
              day: 'numeric', 
              year: 'numeric' 
            })}</time>
            <span>•</span>
            <span>{post.read_time || '5'} min read</span>
          </div>

        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="my-12">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full max-w-[1400px] mx-auto h-auto"
            />
          </div>
        )}

        {/* Article Body */}
        <div className="max-w-[680px] mx-auto px-6">
          <div 
            className="article-content"
            style={{fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif'}}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        {/* CTA Section */}
        <div className="max-w-[680px] mx-auto px-6 mt-16">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-6">💊</div>
            <h3 className="text-3xl font-bold text-white mb-4" style={{fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif'}}>
              Stop Guessing With Your Supplements
            </h3>
            <p className="text-[19px] leading-relaxed text-gray-300 mb-8 max-w-xl mx-auto">
              Get instant AI analysis of your supplement stack. Know exactly what works, what doesn't, and when to take everything.
            </p>
            <a 
              href="https://apps.apple.com/app/supmize/id6756226894"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-[17px] hover:bg-gray-100 transition"
            >
              Try Supmize Free →
            </a>
            <p className="mt-4 text-sm text-gray-400">Free analysis • No credit card required</p>
          </div>
        </div>

      </article>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold">
                💊
              </div>
              <span className="text-lg font-bold text-gray-900">Supmize</span>
            </div>
            <div className="flex gap-8 text-[15px] text-gray-600">
              <Link href="/" className="hover:text-gray-900 transition">Home</Link>
              <Link href="/blog" className="hover:text-gray-900 transition">Blog</Link>
              <Link href="/contact" className="hover:text-gray-900 transition">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            © 2025 Voise Limited. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Enhanced CSS for Article Content */}
      <style jsx global>{`
        .article-content {
          color: rgba(0, 0, 0, 0.84);
          font-size: 21px;
          line-height: 1.68;
          letter-spacing: -0.003em;
        }

        /* Paragraphs - CRITICAL FIX */
        .article-content p {
          margin-bottom: 28px;
          margin-top: 0;
        }

        .article-content p:last-child {
          margin-bottom: 0;
        }

        /* Headings */
        .article-content h2 {
          font-size: 36px;
          line-height: 1.22;
          font-weight: 700;
          margin-top: 56px;
          margin-bottom: 20px;
          letter-spacing: -0.022em;
          color: #0d1117;
        }

        .article-content h3 {
          font-size: 28px;
          line-height: 1.3;
          font-weight: 700;
          margin-top: 40px;
          margin-bottom: 16px;
          letter-spacing: -0.018em;
          color: #0d1117;
        }

        /* Text styling */
        .article-content strong {
          font-weight: 700;
          color: #0d1117;
        }

        .article-content em {
          font-style: italic;
        }

        /* Links */
        .article-content a {
          color: #0d7377;
          text-decoration: underline;
          text-decoration-color: rgba(13, 115, 119, 0.3);
          text-underline-offset: 2px;
          text-decoration-thickness: 1px;
          transition: all 0.2s;
        }

        .article-content a:hover {
          text-decoration-color: rgba(13, 115, 119, 1);
        }

        /* Lists */
        .article-content ul, 
        .article-content ol {
          margin-top: 24px;
          margin-bottom: 32px;
          padding-left: 30px;
        }

        .article-content li {
          margin-bottom: 14px;
          padding-left: 8px;
          line-height: 1.68;
        }

        .article-content li::marker {
          color: #0d7377;
          font-weight: 700;
        }

        /* Nested lists */
        .article-content li > ul,
        .article-content li > ol {
          margin-top: 12px;
          margin-bottom: 0;
        }

        /* Blockquotes */
        .article-content blockquote {
          margin: 40px 0;
          padding: 24px 32px;
          border-left: 4px solid #0d7377;
          background: #f6fffe;
          font-style: italic;
          color: rgba(0, 0, 0, 0.75);
        }

        .article-content blockquote p {
          margin-bottom: 0;
        }

        /* Images */
        .article-content img {
          width: 100%;
          height: auto;
          margin: 48px 0;
          border-radius: 8px;
          display: block;
        }

        /* Code */
        .article-content code {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', 'Source Code Pro', monospace;
          font-size: 18px;
          background: #f6f8fa;
          padding: 3px 6px;
          border-radius: 4px;
          color: #0d1117;
        }

        .article-content pre {
          background: #0d1117;
          color: #f6f8fa;
          padding: 24px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 32px 0;
          font-size: 16px;
          line-height: 1.6;
        }

        .article-content pre code {
          background: none;
          padding: 0;
          color: inherit;
        }

        /* Line breaks */
        .article-content br {
          content: "";
          display: block;
          margin-bottom: 14px;
        }
      `}</style>

    </div>
  )
}
