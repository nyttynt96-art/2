import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'wouter'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Referrals from './pages/Referrals'
import Withdrawals from './pages/Withdrawals'
import Profile from './pages/Profile'
import LuckWheel from './pages/LuckWheel'
import MiningContracts from './pages/MiningContracts'
import AdminDashboard from './pages/admin/AdminDashboard'
import NotFound from './pages/NotFound'

// Notification Context
const NotificationContext = React.createContext()

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const showNotification = (message, type = 'info') => {
    const id = Date.now()
    const notification = { id, message, type }
    setNotifications([...notifications, notification])
    
    setTimeout(() => {
      setNotifications(notifications.filter(n => n.id !== id))
    }, 5000)
  }

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ showNotification, removeNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              notification.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-blue-500 text-white'
            } animate-slide-in`}
          >
            <div className="flex items-center justify-between">
              <span>{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-4 text-white hover:text-gray-200"
              >
                âœ•
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

// Navigation Component
function Navigation({ user, onLogout }) {
  const supportWhatsApp = '+17253348692'
  const supportEmail = 'promohive@globalpromonetwork.store'

  const navItems = [
    { href: '/', icon: 'ًںڈ ', label: 'Home', loggedIn: false },
    { href: '/dashboard', icon: 'ًں“ٹ', label: 'Dashboard', loggedIn: true },
    { href: '/tasks', icon: 'ًں“‹', label: 'Tasks', loggedIn: true },
    { href: '/referrals', icon: 'ًں‘¥', label: 'Referrals', loggedIn: true },
    { href: '/withdrawals', icon: 'ًں’°', label: 'Withdrawals', loggedIn: true },
    { href: '/luck-wheel', icon: 'ًںژ°', label: 'Luck Wheel', loggedIn: true },
    { href: '/mining', icon: 'â›ڈï¸ڈ', label: 'Mining', loggedIn: true },
    { href: '/profile', icon: 'ًں‘¤', label: 'Profile', loggedIn: true },
    { href: '/admin', icon: 'ًں› ï¸ڈ', label: 'Admin', loggedIn: true, adminOnly: true },
  ]

  const NavIcon = ({ href, icon, label }) => (
    <a 
      href={href} 
      className="group relative flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
      title={label}
    >
      <span className="text-2xl group-hover:animate-bounce">{icon}</span>
      <span className="nav-link hidden sm:inline">{label}</span>
      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </a>
  )

  return (
    <nav className="glass-effect sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <h1 className="text-2xl font-bold gradient-text">
                PromoHive
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {!user ? (
                <>
                  <NavIcon href="/login" icon="ًں”‘" label="Login" />
                  <NavIcon href="/register" icon="ًں“‌" label="Register" />
                </>
              ) : (
                <>
                  {navItems
                    .filter(item => !item.loggedIn || (item.loggedIn && user))
                    .filter(item => !item.adminOnly || (item.adminOnly && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')))
                    .map(item => (
                      <NavIcon key={item.href} href={item.href} icon={item.icon} label={item.label} />
                    ))}
                  <button 
                    onClick={onLogout}
                    className="group flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all duration-300 transform hover:scale-110"
                    title="Logout"
                  >
                    <span className="text-2xl group-hover:animate-pulse">ًںڑھ</span>
                    <span className="text-gray-700 hover:text-red-500 transition-colors duration-200 font-medium hidden sm:inline">Logout</span>
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </button>
                </>
              )}
            </div>
            {/* Support Buttons */}
            <div className="flex space-x-3 border-l border-gray-300 pl-4">
              <a 
                href={`https://wa.me/${supportWhatsApp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 font-medium animate-pulse"
                title="Contact us on WhatsApp"
              >
                <span>ًں“±</span>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
              <a 
                href={`mailto:${supportEmail}`}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:scale-110 transition-all duration-300 font-medium"
                title="Contact us via Email"
              >
                <span>âœ‰ï¸ڈ</span>
                <span className="hidden sm:inline">Email</span>
              </a>
            </div>
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
    <div className="min-h-screen">
      <Navigation user={null} onLogout={() => {}} />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-purple-600 to-pink-600 opacity-95"></div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="animate-float">
            {/* PromoHive Logo */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="PromoHive Logo" 
                  className="w-48 md:w-64 h-auto drop-shadow-2xl animate-bounce-slow border-4 border-white/30 rounded-2xl p-2 bg-white/10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/20 rounded-2xl blur-2xl"></div>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 text-shadow">
              PromoHive
            </h1>
            <p className="text-xl md:text-2xl text-white mb-2 max-w-3xl mx-auto opacity-90">
              GLOBAL PROMO NETWORK
            </p>
            <p className="text-lg md:text-xl text-white mb-8 max-w-3xl mx-auto opacity-75">
              Earn money by completing promotional tasks, referrals, and multi-level marketing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/register" 
                className="btn-primary text-lg px-8 py-4 transform hover:scale-110 transition-all duration-300 shadow-2xl"
              >
                Get Started Now âœ¨
              </a>
              <a 
                href="/login" 
                className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-600 transform hover:scale-110 transition-all duration-300"
              >
                Login ًں”‘
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-12 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <div className="text-5xl font-bold text-white mb-2 animate-pulse">$127,845</div>
              <div className="text-white/80 text-sm font-medium">Total Earnings Paid</div>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <div className="text-5xl font-bold text-white mb-2 animate-pulse">12,847</div>
              <div className="text-white/80 text-sm font-medium">Active Users</div>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <div className="text-5xl font-bold text-white mb-2 animate-pulse">45,239</div>
              <div className="text-white/80 text-sm font-medium">Tasks Completed</div>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <div className="text-5xl font-bold text-white mb-2 animate-pulse">$8,521</div>
              <div className="text-white/80 text-sm font-medium">Pending Withdrawals</div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Bonus Banner */}
      <section className="py-12 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-white/20 backdrop-blur-lg rounded-2xl px-8 py-6 border border-white/30 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg animate-pulse">
              ًںژپ Seize the Opportunity!
            </h2>
            <p className="text-xl md:text-2xl text-white mb-4 drop-shadow-md">
              Sign up for a new account and earn $5 instantly!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/register" 
                className="btn-primary text-lg px-8 py-4 bg-white text-green-600 hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 shadow-2xl font-bold"
              >
                Get Your $5 Bonus ًںڑ€
              </a>
              <span className="text-white text-sm opacity-80">
                Available to all new users
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Why Choose PromoHive?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the most advanced promotional platform with cutting-edge features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="stats-card animate-float delay-100">
              <div className="stats-icon bg-blue-100 text-blue-600 mb-4">
                ًں’°
              </div>
              <h3 className="text-xl font-semibold mb-3">Earn Money</h3>
              <p className="text-gray-600">Complete tasks and earn real money through our advanced platform</p>
            </div>
            
            <div className="stats-card animate-float delay-200">
              <div className="stats-icon bg-pink-100 text-pink-600 mb-4">
                ًں‘¥
              </div>
              <h3 className="text-xl font-semibold mb-3">Referral System</h3>
              <p className="text-gray-600">Invite friends and earn bonuses from their activities</p>
            </div>
            
            <div className="stats-card animate-float delay-300">
              <div className="stats-icon bg-purple-100 text-purple-600 mb-4">
                ًںژ°
              </div>
              <h3 className="text-xl font-semibold mb-3">Luck Wheel</h3>
              <p className="text-gray-600">Spin the wheel daily and win up to $0.30 per spin</p>
            </div>
            
            <div className="stats-card animate-float delay-400">
              <div className="stats-icon bg-green-100 text-green-600 mb-4">
                â›ڈï¸ڈ
              </div>
              <h3 className="text-xl font-semibold mb-3">Mining Contracts</h3>
              <p className="text-gray-600">Invest in mining contracts and earn passive income</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="stats-value gradient-text mb-2">10,000+</div>
              <div className="stats-label">Active Users</div>
            </div>
            <div className="text-center">
              <div className="stats-value gradient-text mb-2">$500K+</div>
              <div className="stats-label">Paid Out</div>
            </div>
            <div className="text-center">
              <div className="stats-value gradient-text mb-2">50+</div>
              <div className="stats-label">Countries</div>
            </div>
            <div className="text-center">
              <div className="stats-value gradient-text mb-2">99.9%</div>
              <div className="stats-label">Uptime</div>
            </div>
          </div>
        </div>
      </section>
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
    
    if (formData.email === 'admin@promohive.com' && formData.password === 'Admin123!') {
      login({
        id: 'admin-001',
        email: 'admin@promohive.com',
        username: 'superadmin',
        fullName: 'Super Administrator',
        role: 'SUPER_ADMIN',
        level: 3,
        isApproved: true,
        balance: 1000.00,
        dailySpins: 0,
        lastSpinDate: null
      })
      window.location.href = '/admin'
      return
    }
    
    if (formData.email && formData.password) {
      login({
        id: 'user-' + Date.now(),
        email: formData.email,
        username: 'user123',
        fullName: 'Regular User',
        role: 'USER',
        level: 0,
        isApproved: true,
        balance: 5.00,
        dailySpins: 0,
        lastSpinDate: null
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center py-12">
      <Navigation user={null} onLogout={() => {}} />
      <div className="card max-w-md w-full mx-4 glass-effect">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h2 className="text-3xl font-bold gradient-text">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
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
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          <button 
            type="submit"
            className="btn-primary w-full"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">Don't have an account? 
            <a href="/register" className="text-blue-500 hover:text-blue-600 font-semibold ml-1">
              Create one here
            </a>
          </p>
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
    
    setSuccess('Registration successful! Your account is pending admin approval.')
    
    setTimeout(() => {
      login({
        id: 'user-' + Date.now(),
        email: formData.email,
        username: formData.username,
        fullName: formData.fullName,
        role: 'USER',
        level: 0,
        isApproved: false,
        balance: 0.00,
        dailySpins: 0,
        lastSpinDate: null
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center py-12">
      <Navigation user={null} onLogout={() => {}} />
      <div className="card max-w-md w-full mx-4 glass-effect">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h2 className="text-3xl font-bold gradient-text">Join PromoHive</h2>
          <p className="text-gray-600 mt-2">Create your account and start earning</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
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
              className="form-input"
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
              className="form-input"
              placeholder="Choose a username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
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
              className="form-select"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
            <input 
              type="date" 
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="form-input"
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
              className="form-input"
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
              className="form-input"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button 
            type="submit"
            className="btn-secondary w-full"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">Already have an account? 
            <a href="/login" className="text-blue-500 hover:text-blue-600 font-semibold ml-1">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Include remaining components here (Profile, Dashboard, LuckWheel, MiningContracts, AdminDashboard, NotFound, Tasks, Referrals, Withdrawals)...

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/tasks" component={Tasks} />
          <Route path="/referrals" component={Referrals} />
          <Route path="/withdrawals" component={Withdrawals} />
          <Route path="/profile" component={Profile} />
          <Route path="/luck-wheel" component={LuckWheel} />
          <Route path="/mining" component={MiningContracts} />
          <Route path="/admin" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </AuthProvider>
    </NotificationProvider>
  )
}

export default App
