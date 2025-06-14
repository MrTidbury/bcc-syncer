import { useState, useEffect } from 'react'
import Login from './components/Login'
import BookingList, { getBookingCountByStatus } from './components/BookingList'
import { PowerIcon } from '@heroicons/react/24/outline'

interface User {
  email: string
  name: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [visibleTab, setVisibleTab] = useState(0)
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in')

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/check')
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = async (email: string) => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Tab info
  const tabs = [
    { label: 'Active', status: 'active' },
    { label: 'Pending', status: 'pending' },
    { label: 'Rejected', status: 'rejected' },
  ];

  // Handle tab change with fade animation
  const handleTabChange = (idx: number) => {
    if (idx === activeTab) return;
    setFadeState('fade-out');
    setTimeout(() => {
      setActiveTab(idx);
      setVisibleTab(idx);
      setFadeState('fade-in');
    }, 300); // match fade duration
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <Login onLogin={handleLogin} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-blue-700">Berkshire Caravan Center</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-sm shadow-sm">{user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <PowerIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6 lg:px-8 w-full max-w-4xl mx-auto">
        <div className="mb-8 relative">
          <div className="flex space-x-0 border-b border-gray-200">
            {tabs.map((tab, idx) => (
              <button
                key={tab.status}
                onClick={() => handleTabChange(idx)}
                className={
                  (activeTab === idx
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-500 hover:text-blue-600') +
                  ' flex-1 text-center relative pb-3 text-base transition-colors duration-300 bg-transparent border-none outline-none focus:outline-none'
                }
                style={{ position: 'relative' }}
              >
                {tab.label} ({getBookingCountByStatus(tab.status)})
              </button>
            ))}
          </div>
          {/* Animated underline */}
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300"
            style={{
              width: 'calc(100% / 3)',
              transform: `translateX(${activeTab * 100}%)`,
            }}
          />
        </div>
        <div className="relative min-h-[200px]">
          <div
            key={tabs[visibleTab].status}
            className={`rounded-2xl bg-white p-6 shadow-xl transition-opacity duration-300 ${fadeState === 'fade-in' ? 'opacity-100' : 'opacity-0'}`}
          >
            <BookingList status={tabs[visibleTab].status} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
