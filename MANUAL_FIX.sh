#!/bin/bash

cd /var/www/promohive

echo "Manual fix starting..."

# 1. Get clean App.tsx
echo "Fetching clean App.tsx..."
rm -f src/App.tsx
git checkout HEAD~15 -- src/App.tsx 2>/dev/null || git checkout dc6a4eb -- src/App.tsx 2>/dev/null || (
  echo "Creating minimal App.tsx..."
  cat > src/App.tsx << 'APPEOF'
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

const NotificationContext = React.createContext()

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const showNotification = (message, type = 'info') => {
    const id = Date.now()
    setNotifications([...notifications, { id, message, type }])
    setTimeout(() => setNotifications(n => n.filter(not => not.id !== id)), 5000)
  }

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ showNotification, removeNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map(notification => (
          <div key={notification.id} className={`p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white`}>
            {notification.message}
            <button onClick={() => removeNotification(notification.id)} className="ml-4">✕</button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

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
          <Route component={NotFoundPage} />
        </Switch>
      </AuthProvider>
    </NotificationProvider>
  )
}

export default App
APPEOF
)

echo "✓ App.tsx fixed"

# 2. Clean and rebuild
echo "Cleaning dist..."
rm -rf dist

echo "Building..."
npm run build

if [ $? -eq 0 ]; then
  echo "✓ Build successful"
  
  echo "Restarting..."
  pm2 restart promohive-server
  pm2 save
  
  echo "✓ Done!"
else
  echo "✗ Build failed"
  exit 1
fi

