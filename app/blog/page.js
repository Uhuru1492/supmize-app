import Link from 'next/link'
import { supabase } from '@/lib/supabase'

async function getBlogPosts() {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
  
  return data || []
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50">
      
      {/* Header */}
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

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Supplement Safety Blog
          </h1>
          <p className="text-xl text-gray-600">
            Evidence-based articles on supplement safety, interactions, and optimization
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Check back soon for our first articles!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link 
                  key={post.id} 
                  href={{`/blog/${post.slug}`}
                  className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition overflow-hidden group"
                >
                  {post.featured_image && (
                    <div className="h-48 bg-gradient-to-br from-teal-100 to-orange-100 overflow-hidden">
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {post.category && (
                      <span className="inline-block bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                        {post.category}
                      </span>
                    )}
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(post.published_at).toLocaleDateString()}</span>
                      <span>{post.read_time || '5'} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 px-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Weekly Safety Tips</h2>
          <p className="text-xl mb-6 opacity-90">
            Join our newsletter for evidence-based supplement advice
          </p>
          <Link 
            href="/#newsletter"
            className="inline-block bg-white text-teal-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Subscribe Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <Link href="/" className="hover:text-white mx-3 text-sm">Home</Link>
            <Link href="/blog" className="hover:text-white mx-3 text-sm">Blog</Link>
            <Link href="/contact" className="hover:text-white mx-3 text-sm">Contact</Link>
            <Link href="/privacy" className="hover:text-white mx-3 text-sm">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white mx-3 text-sm">Terms & Conditions</Link>
          </div>
          <p className="text-sm">© 2025 Voise Limited. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
