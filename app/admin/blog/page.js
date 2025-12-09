'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BlogManagement() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth !== 'true') {
      router.push('/admin')
      return
    }

    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    setPosts(data || [])
    setLoading(false)
  }

  const deletePost = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    await supabase.from('blog_posts').delete().eq('id', id)
    fetchPosts()
  }

  const togglePublish = async (id, currentStatus) => {
    await supabase
      .from('blog_posts')
      .update({ published: !currentStatus })
      .eq('id', id)
    
    fetchPosts()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Admin
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Blog Management</h1>
              <p className="text-xs text-gray-500">{posts.length} posts</p>
            </div>
          </div>
          <Link
            href="/admin/blog/new"
            className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700"
          >
            + New Post
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600 mb-6">Create your first post to get started</p>
            <Link
              href="/admin/blog/new"
              className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700"
            >
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500">/blog/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-teal-100 text-teal-800 text-xs font-semibold px-2 py-1 rounded">
                        {post.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(post.id, post.published)}
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded ${
                          post.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/blog/edit/${post.id}`}
                          className="text-teal-600 hover:text-teal-700 text-sm font-semibold"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}
