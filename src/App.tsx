import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
import { useEffect } from 'react';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Referrals from './pages/Referrals';
import Withdrawals from './pages/Withdrawals';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/referrals" component={Referrals} />
      <Route path="/withdrawals" component={Withdrawals} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add custom cursor effects for interactive elements
    const addCursorEffects = () => {
      const interactiveElements = document.querySelectorAll('button, a, [role="button"], .hover-lift, .hover-glow');
      
      interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
          document.body.style.cursor = 'pointer';
        });
        
        element.addEventListener('mouseleave', () => {
          document.body.style.cursor = 'default';
        });
      });
    };

    // Initialize cursor effects after a short delay
    setTimeout(addCursorEffects, 100);

    // Add intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-scale-in, .animate-slide-up, .animate-slide-down');
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AuthProvider>
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 212, 255, 0.15)',
                },
              }}
            />
            <Router />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
