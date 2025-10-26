import React, { useState } from 'react'
import { Route, Switch } from 'wouter'

// Navigation Component
function Navigation() {
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
            <a href="/login" className="text-gray-700 hover:text-blue-500 transition-colors">Login</a>
            <a href="/register" className="text-gray-700 hover:text-blue-500 transition-colors">Register</a>
            <a href="/dashboard" className="text-gray-700 hover:text-blue-500 transition-colors">Dashboard</a>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Home component
function Home() {
  return (
    <div>
      <Navigation />
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
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Login attempt with email: ${formData.email}`)
    // Here you would normally handle the login logic
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
            Login
          </h2>
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
        </div>
      </div>
    </div>
  )
}

// Register component
function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthdate: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    alert(`Registration attempt for: ${formData.fullName} (${formData.email})`)
    // Here you would normally handle the registration logic
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
            Register
          </h2>
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
  const [stats] = useState({
    balance: 5.00,
    tasksCompleted: 0,
    referrals: 0,
    level: 0
  })

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          
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
              <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                View Tasks
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Referral Program</h3>
              <p className="text-gray-600 mb-4">Invite friends and earn bonuses</p>
              <button className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition-colors">
                Invite Friends
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Withdraw Earnings</h3>
              <p className="text-gray-600 mb-4">Minimum $10 to withdraw</p>
              <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// NotFound component
function NotFound() {
  return (
    <div>
      <Navigation />
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
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default App