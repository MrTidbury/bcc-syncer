import { useState } from 'react'
import { LockClosedIcon } from '@heroicons/react/24/outline'

interface LoginProps {
  onLogin: (email: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email')
      return
    }
    onLogin(email)
  }

  return (
    <section style={{ backgroundColor: 'rgb(248, 249, 250)' }} className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Top Accent Bar - outside the card, matches card radius */}
        <div className="w-full h-2 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 rounded-t-xl" />
        <div className="bg-white rounded-xl shadow-2xl sm:px-12 transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
          <div className="py-10 px-8">
            {/* Lock Icon */}
            <div className="flex justify-center mb-4 mt-2">
              <span className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full">
                <LockClosedIcon className="h-8 w-8 text-blue-600" />
              </span>
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-1">BCCC Rally Admin</h2>
            <p className="text-center text-base text-gray-500 mb-6">Sign in with your email to manage bookings for this rally</p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  Rally Officer Email
                </label>
                <div className="mt-1">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-md text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
} 