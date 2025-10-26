import React, { useState } from 'react'
import { Route, Switch } from 'wouter'
import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import DashboardPage from './pages/Dashboard'
import TasksPage from './pages/Tasks'
import ReferralsPage from './pages/Referrals'
import WithdrawalsPage from './pages/Withdrawals'
import LevelUpgrade from './pages/LevelUpgrade'
import AdminDashboard from './pages/admin/AdminDashboard'
import NotFoundPage from './pages/NotFound'

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
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

// Auth Context
const AuthContext = React.createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    window.location.href = '/dashboard'
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/tasks" component={TasksPage} />
          <Route path="/referrals" component={ReferralsPage} />
          <Route path="/withdrawals" component={WithdrawalsPage} />
          <Route path="/level-upgrade" component={LevelUpgrade} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/profile" component={DashboardPage} />
          <Route path="/luck-wheel" component={DashboardPage} />
          <Route path="/mining" component={DashboardPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </AuthProvider>
    </NotificationProvider>
  )
}

export default App

