import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { marked } from 'marked'

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
  const post = await getBlogPost(params.slug)

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50">
      
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold">
              💊
            </div>
            <span className="text-xl font-bold text-gray-900">Supmize</span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-teal-600">Home</Link>
            <Link href="/blog" className="text-teal-600 font-semibold">Blog</Link>
            <Link href="/contact" className="text-gray-600 hover:text-teal-600">Contact</Link>
          </nav>
        </div>
      </header>

      <article className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          
          <Link 
            href="/blog"
            className="text-teal-600 hover:text-teal-700 font-semibold mb-8 inline-block"
          >
            ← Back to Blog
          </Link>

          {post.category && (
            <span className="inline-block bg-teal-100 text-teal-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              {post.category}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-600 mb-8 pb-8 border-b">
            <span>{new Date(post.published_at).toLocaleDateString('en-GB', { 
              day: 'numeric',
              month: 'long', 
              year: 'numeric' 
            })}</span>
            <span>•</span>
            <span>{post.read_time || '5'} min read</span>
            {post.author && (
              <>
                <span>•</span>
                <span>By {post.author}</span>
              </>
            )}
          </div>

          {post.featured_image && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:my-6 prose-ol:my-6
              prose-li:text-gray-700 prose-li:my-2
              prose-blockquote:border-l-4 prose-blockquote:border-teal-500 
              prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
              prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-pre:bg-gray-900 prose-pre:text-gray-100"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <div className="mt-12 p-8 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-3">Try Supmize Today</h3>
            <p className="mb-6 opacity-90">Get AI-powered supplement safety analysis</p>
            <a 
              href="https://apps.apple.com/app/supmize/id6756226894"
              target="_blank"
              className="inline-block bg-white text-teal-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Download Now
            </a>
          </div>

        </div>
      </article>

      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <Link href="/" className="hover:text-white mx-3 text-sm">Home</Link>
            <Link href="/blog" className="hover:text-white mx-3 text-sm">Blog</Link>
            <Link href="/contact" className="hover:text-white mx-3 text-sm">Contact</Link>
          </div>
          <p className="text-sm">© 2025 Voise Limited. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
