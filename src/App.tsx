import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'wouter'

// Navigation Component
function Navigation({ user, onLogout }) {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
              PromoHive
            </h1>
          </div>
          <div className="flex space-x-4">
            <a href="/" className="text-gray-700 hover:text-blue-500 transition-colors">Home</a>
            {!user ? (
              <>
                <a href="/login" className="text-gray-700 hover:text-blue-500 transition-colors">Login</a>
                <a href="/register" className="text-gray-700 hover:text-blue-500 transition-colors">Register</a>
              </>
            ) : (
              <>
                <a href="/dashboard" className="text-gray-700 hover:text-blue-500 transition-colors">Dashboard</a>
                <a href="/tasks" className="text-gray-700 hover:text-blue-500 transition-colors">Tasks</a>
                <a href="/referrals" className="text-gray-700 hover:text-blue-500 transition-colors">Referrals</a>
                <a href="/withdrawals" className="text-gray-700 hover:text-blue-500 transition-colors">Withdrawals</a>
                {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
                  <a href="/admin" className="text-gray-700 hover:text-blue-500 transition-colors">Admin</a>
                ) : null}
                <button 
                  onClick={onLogout}
                  className="text-gray-700 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Auth Context
const AuthContext = React.createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Home component
function Home() {
  return (
    <div>
      <Navigation user={null} onLogout={() => {}} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
              PromoHive
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Global Promo Network Platform - Earn money by completing promotional tasks, referrals, and multi-level marketing
            </p>
            <div className="space-x-4">
              <a 
                href="/register" 
                className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 inline-block"
              >
                Get Started
              </a>
              <a 
                href="/login" 
                className="border-2 border-blue-500 text-blue-500 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 inline-block"
              >
                Login
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose PromoHive?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-4">Earn Money</h3>
              <p className="text-gray-600">Complete tasks and earn real money through our platform</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-4">Referral System</h3>
              <p className="text-gray-600">Invite friends and earn bonuses from their activities</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-4">Easy Tasks</h3>
              <p className="text-gray-600">Simple tasks like following social media, downloading apps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Login component
function Login() {
  const { login } = React.useContext(AuthContext)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    // Check for admin login
    if (formData.email === 'admin@promohive.com' && formData.password === 'Admin123!') {
      login({
        id: 'admin-001',
        email: 'admin@promohive.com',
        username: 'superadmin',
        fullName: 'Super Administrator',
        role: 'SUPER_ADMIN',
        level: 3,
        isApproved: true
      })
      window.location.href = '/admin'
      return
    }
    
    // Regular user login (simplified for demo)
    if (formData.email && formData.password) {
      login({
        id: 'user-001',
        email: formData.email,
        username: 'user123',
        fullName: 'Regular User',
        role: 'USER',
        level: 0,
        isApproved: true
      })
      window.location.href = '/dashboard'
    } else {
      setError('Please fill in all fields')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div>
      <Navigation user={null} onLogout={() => {}} />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
            Login
          </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white py-3 rounded-md font-semibold hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">Don't have an account? 
              <a href="/register" className="text-blue-500 hover:text-blue-600 font-semibold ml-1">
                Register here
              </a>
            </p>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-semibold">Admin Login:</p>
            <p className="text-sm text-blue-600">Email: admin@promohive.com</p>
            <p className="text-sm text-blue-600">Password: Admin123!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Register component
function Register() {
  const { login } = React.useContext(AuthContext)
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthdate: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    
    // Simulate registration
    setSuccess('Registration successful! Your account is pending admin approval.')
    
    // Auto-login after registration (for demo)
    setTimeout(() => {
      login({
        id: 'user-' + Date.now(),
        email: formData.email,
        username: formData.username,
        fullName: formData.fullName,
        role: 'USER',
        level: 0,
        isApproved: false
      })
      window.location.href = '/dashboard'
    }, 2000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div>
      <Navigation user={null} onLogout={() => {}} />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
            Register
          </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birthdate</label>
              <input 
                type="date" 
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Create a password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm your password"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white py-3 rounded-md font-semibold hover:from-pink-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Register
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">Already have an account? 
              <a href="/login" className="text-blue-500 hover:text-blue-600 font-semibold ml-1">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard component
function Dashboard() {
  const { user, logout, loading } = React.useContext(AuthContext)
  const [stats, setStats] = useState({
    balance: user?.role === 'SUPER_ADMIN' ? 1000.00 : 5.00,
    tasksCompleted: 0,
    referrals: 0,
    level: user?.level || 0
  })

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Check if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a 
            href="/login" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navigation user={user} onLogout={logout} />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
            Welcome, {user.fullName}!
          </h1>
          
          {!user.isApproved && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              <strong>Account Pending:</strong> Your account is waiting for admin approval. You'll receive an email once approved.
            </div>
          )}
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Balance</h3>
                  <p className="text-2xl font-bold text-green-600">${stats.balance}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Tasks Completed</h3>
                  <p className="text-2xl font-bold text-blue-600">{stats.tasksCompleted}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-pink-100 rounded-full">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Referrals</h3>
                  <p className="text-2xl font-bold text-pink-600">{stats.referrals}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Level</h3>
                  <p className="text-2xl font-bold text-purple-600">L{stats.level}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Available Tasks</h3>
              <p className="text-gray-600 mb-4">Complete tasks to earn money</p>
              <a href="/tasks" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors inline-block text-center">
                View Tasks
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Referral Program</h3>
              <p className="text-gray-600 mb-4">Invite friends and earn bonuses</p>
              <a href="/referrals" className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors inline-block text-center">
                Invite Friends
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Withdraw Earnings</h3>
              <p className="text-gray-600 mb-4">Minimum $10 to withdraw</p>
              <a href="/withdrawals" className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors inline-block text-center">
                Withdraw
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tasks component
function Tasks() {
  const { user, logout, loading } = React.useContext(AuthContext)
  const [tasks] = useState([
    {
      id: 1,
      title: 'Follow Instagram Account',
      description: 'Follow our Instagram account and like 5 recent posts',
      reward: 2.50,
      type: 'MANUAL',
      status: 'ACTIVE'
    },
    {
      id: 2,
      title: 'Join Telegram Group',
      description: 'Join our Telegram group and stay active for 7 days',
      reward: 5.00,
      type: 'MANUAL',
      status: 'ACTIVE'
    },
    {
      id: 3,
      title: 'Download Mobile App',
      description: 'Download and install our mobile app',
      reward: 3.00,
      type: 'MANUAL',
      status: 'ACTIVE'
    }
  ])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Check if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a 
            href="/login" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navigation user={user} onLogout={logout} />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
            Available Tasks
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
              <div key={task.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                <p className="text-gray-600 mb-4">{task.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {task.type}
                  </span>
                  <span className="text-2xl font-bold text-green-600">${task.reward}</span>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white py-2 rounded-md hover:from-blue-600 hover:to-pink-600 transition-all duration-300">
                  Start Task
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Referrals component
function Referrals() {
  const { user, logout, loading } = React.useContext(AuthContext)
  const [referralCode] = useState('PH' + Math.random().toString(36).substr(2, 8).toUpperCase())

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Check if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a 
            href="/login" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navigation user={user} onLogout={logout} />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
            Referral Program
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Your Referral Code</h3>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <code className="text-2xl font-mono font-bold text-blue-600">{referralCode}</code>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(referralCode)}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Copy Code
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Referral Rewards</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Level 1 Referral</span>
                  <span className="font-bold text-green-600">$2.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Level 2 Referral</span>
                  <span className="font-bold text-green-600">$1.25</span>
                </div>
                <div className="flex justify-between">
                  <span>Level 3 Referral</span>
                  <span className="font-bold text-green-600">$0.75</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Withdrawals component
function Withdrawals() {
  const { user, logout, loading } = React.useContext(AuthContext)
  const [formData, setFormData] = useState({
    amount: '',
    walletAddress: '',
    network: 'USDT'
  })
  const [balance] = useState(user?.role === 'SUPER_ADMIN' ? 1000.00 : 5.00)

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Check if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a 
            href="/login" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (parseFloat(formData.amount) < 10) {
      alert('Minimum withdrawal amount is $10')
      return
    }
    if (parseFloat(formData.amount) > balance) {
      alert('Insufficient balance')
      return
    }
    alert('Withdrawal request submitted! It will be processed within 24 hours.')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div>
      <Navigation user={user} onLogout={logout} />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
            Withdraw Earnings
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Withdrawal Request</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
                  <input 
                    type="number" 
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount"
                    min="10"
                    step="0.01"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Available balance: ${balance}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">USDT Wallet Address</label>
                  <input 
                    type="text" 
                    name="walletAddress"
                    value={formData.walletAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your USDT wallet address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Network</label>
                  <select 
                    name="network"
                    value={formData.network}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USDT">USDT (TRC20)</option>
                    <option value="USDT_ERC20">USDT (ERC20)</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-md font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300"
                >
                  Submit Withdrawal Request
                </button>
              </form>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Withdrawal History</h3>
              <div className="text-center text-gray-500 py-8">
                <p>No withdrawal requests yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Dashboard component
function AdminDashboard() {
  const { user, logout, loading } = React.useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('overview')
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'USER', isApproved: false, balance: 0 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'USER', isApproved: true, balance: 15.50 },
    { id: 3, name: 'Admin User', email: 'admin@promohive.com', role: 'SUPER_ADMIN', isApproved: true, balance: 1000 }
  ])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Check if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a 
            href="/login" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  // Check if user doesn't have admin privileges
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin panel.</p>
          <a 
            href="/dashboard" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navigation user={user} onLogout={logout} />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          
          {/* Admin Tabs */}
          <div className="bg-white rounded-lg shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {[
                  { id: 'overview', name: 'Overview' },
                  { id: 'users', name: 'Users' },
                  { id: 'tasks', name: 'Tasks' },
                  { id: 'withdrawals', name: 'Withdrawals' },
                  { id: 'settings', name: 'Settings' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">1,234</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-sm font-medium text-gray-500">Active Tasks</h3>
                <p className="text-3xl font-bold text-green-600">45</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-sm font-medium text-gray-500">Pending Withdrawals</h3>
                <p className="text-3xl font-bold text-yellow-600">12</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                <p className="text-3xl font-bold text-purple-600">$12,345</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">User Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.balance}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-green-600 hover:text-green-900">Approve</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium mb-4">Task Management</h3>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                Create New Task
              </button>
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium mb-4">Withdrawal Requests</h3>
              <div className="text-center text-gray-500 py-8">
                <p>No pending withdrawal requests</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-medium mb-4">Platform Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                  <input type="text" defaultValue="PromoHive" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Bonus</label>
                  <input type="number" defaultValue="5.00" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Withdrawal</label>
                  <input type="number" defaultValue="10.00" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// NotFound component
function NotFound() {
  return (
    <div>
      <Navigation user={null} onLogout={() => {}} />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-gray-400 mb-4">404</h1>
          <p className="text-2xl text-gray-600 mb-8">Page not found</p>
          <a 
            href="/" 
            className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/referrals" component={Referrals} />
      <Route path="/withdrawals" component={Withdrawals} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
          </AuthProvider>
  )
}

export default App