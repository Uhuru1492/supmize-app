'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPanel() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [stats, setStats] = useState({
    totalUsers: 0,
    proUsers: 0,
    freeUsers: 0,
    newsletterSubs: 0,
    contactMessages: 0,
    totalAnalyses: 0,
    totalShopChecks: 0,
    totalSupplements: 0,
    todaySignups: 0,
    blogPosts: 0
  })
  const [newsletters, setNewsletters] = useState([])
  const [contacts, setContacts] = useState([])
  const [users, setUsers] = useState([])
  const [shopChecks, setShopChecks] = useState([])
  const [supplements, setSupplements] = useState([])
  const [loading, setLoading] = useState(true)

  const ADMIN_PASSWORD = 'supmize2025admin'

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
      fetchAllData()
    } else {
      alert('Incorrect password')
    }
  }

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchAllData()
    }
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    
    const [usersData, newsletterData, contactData, analysisData, shopCheckData, blogData, supplementsData] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('newsletter_subscribers').select('*'),
      supabase.from('contact_messages').select('*'),
      supabase.from('analysis_history').select('*'),
      supabase.from('shop_check_history').select('*, users(email)'),
      supabase.from('blog_posts').select('*'),
      supabase.from('supplements').select('*, users(email)')
    ])

    const totalUsers = usersData.data?.length || 0
    const proUsers = usersData.data?.filter(u => u.is_pro)?.length || 0
    
    const today = new Date().toISOString().split('T')[0]
    const todaySignups = usersData.data?.filter(u => 
      u.created_at?.startsWith(today)
    )?.length || 0

    setStats({
      totalUsers,
      proUsers,
      freeUsers: totalUsers - proUsers,
      newsletterSubs: newsletterData.data?.length || 0,
      contactMessages: contactData.data?.length || 0,
      totalAnalyses: analysisData.data?.length || 0,
      totalShopChecks: shopCheckData.data?.length || 0,
      totalSupplements: supplementsData.data?.length || 0,
      todaySignups,
      blogPosts: blogData.data?.length || 0
    })

    setNewsletters(newsletterData.data || [])
    setContacts(contactData.data || [])
    setUsers(usersData.data || [])
    setShopChecks(shopCheckData.data || [])
    setSupplements(supplementsData.data || [])
    
    setLoading(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
  }

  const exportNewsletterCSV = () => {
    const csv = newsletters.map(n => n.email).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'newsletter-subscribers.csv'
    a.click()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-br from-teal-600 to-teal-700 text-white w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold mb-4">
              🔐
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600">Enter password to access admin panel</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-lg font-bold hover:from-teal-700 hover:to-teal-800 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold">
              💊
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Supmize Admin</h1>
              <p className="text-xs text-gray-500">Manage app & website</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/blog')}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-600"
            >
              📝 Blog
            </button>
            <button
              onClick={() => router.push('/admin/newsletter')}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600"
            >
              📧 Newsletter
            </button>
            <button
              onClick={fetchAllData}
              className="text-teal-600 hover:text-teal-700 font-semibold text-sm"
            >
              🔄
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto">
            {['overview', 'users', 'shop-checks', 'supplements', 'newsletter', 'contacts'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-semibold border-b-2 transition whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="text-3xl mb-2">👥</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                    <div className="text-xs text-green-600 mt-2">+{stats.todaySignups} today</div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="text-3xl mb-2">⭐</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.proUsers}</div>
                    <div className="text-sm text-gray-600">Pro Subscribers</div>
                    <div className="text-xs text-gray-500 mt-2">{stats.freeUsers} free users</div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="text-3xl mb-2">💊</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.totalSupplements}</div>
                    <div className="text-sm text-gray-600">Total Supplements</div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="text-3xl mb-2">📸</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.totalShopChecks}</div>
                    <div className="text-sm text-gray-600">Shop Checks</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="text-3xl mb-2">📧</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.newsletterSubs}</div>
                    <div className="text-sm text-gray-600">Newsletter Subscribers</div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="text-3xl mb-2">📝</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.blogPosts}</div>
                    <div className="text-sm text-gray-600">Blog Posts</div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="text-3xl mb-2">💬</div>
                    <div className="text-3xl font-bold text-gray-900">{stats.contactMessages}</div>
                    <div className="text-sm text-gray-600">Contact Messages</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Revenue (Estimated)</h3>
                  <div className="text-3xl font-bold text-teal-700 mb-2">
                    ${(stats.proUsers * 9.99).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Monthly recurring revenue</div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Users ({stats.totalUsers})</h2>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {users.slice(0, 50).map((user, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                              user.is_pro ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {user.is_pro ? 'Pro' : 'Free'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'shop-checks' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop Checks ({stats.totalShopChecks})</h2>
                
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Supplement</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Result</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {shopChecks.slice(0, 50).map((check, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{check.users?.email || 'Unknown'}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{check.supplement_name || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                              check.result?.toLowerCase().includes('safe') 
                                ? 'bg-green-100 text-green-800' 
                                : check.result?.toLowerCase().includes('warning')
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {check.result || 'Analyzed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(check.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'supplements' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">User Supplements ({stats.totalSupplements})</h2>
                
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Supplement</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Dosage</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Timing</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Added</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {supplements.slice(0, 50).map((supp, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{supp.users?.email || 'Unknown'}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-700">{supp.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{supp.dosage || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{supp.timing || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(supp.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'newsletter' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Newsletter Subscribers ({stats.newsletterSubs})</h2>
                  <button
                    onClick={exportNewsletterCSV}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700"
                  >
                    📥 Export CSV
                  </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subscribed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {newsletters.map((sub, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{sub.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{sub.source || 'website'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(sub.subscribed_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Messages ({stats.contactMessages})</h2>
                
                <div className="space-y-4">
                  {contacts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                      <div className="text-4xl mb-4">📭</div>
                      <p className="text-gray-600">No contact messages yet</p>
                    </div>
                  ) : (
                    contacts.map((msg, i) => (
                      <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-bold text-gray-900">{msg.name}</div>
                            <div className="text-sm text-gray-600">{msg.email}</div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(msg.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-700 mb-2">
                          {msg.subject}
                        </div>
                        <div className="text-sm text-gray-600 whitespace-pre-wrap">
                          {msg.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
