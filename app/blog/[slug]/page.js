import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { marked } from 'marked'
import '../../blog-styles.css'

marked.setOptions({
  breaks: true,
  gfm: true,
  pedantic: false,
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

      <article className="pb-20">
        
        <div className="max-w-[680px] mx-auto px-6 pt-16 pb-12">
          
          {post.category && (
            <div className="mb-4">
              <span className="text-teal-600 font-semibold text-sm uppercase tracking-wide">
                {post.category}
              </span>
            </div>
          )}

          <h1 className="text-[42px] leading-[1.15] md:text-[52px] md:leading-[1.1] font-bold text-gray-900 mb-8 tracking-tight" style={{fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif'}}>
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-[22px] leading-[1.5] text-gray-600 mb-8" style={{fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif'}}>
              {post.excerpt}
            </p>
          )}

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

        {/* Featured Image - Constrained width */}
        {post.featured_image && post.featured_image.trim() !== '' && (
          <div className="max-w-[900px] mx-auto px-6 my-12">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        )}

        <div className="max-w-[680px] mx-auto px-6">
          <div 
            className="article-content"
            style={{fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif'}}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

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

    </div>
  )
}
