import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  BarChart3,
  UserCheck,
  UserX,
  Wallet,
  Award,
  AlertCircle,
  Sparkles,
  Gift,
  Zap,
  Shield,
  Star,
  Activity,
  Crown,
  Globe,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  users: {
    total: number;
    pending: number;
    approved: number;
  };
  tasks: {
    total: number;
    active: number;
  };
  withdrawals: {
    total: number;
    pending: number;
  };
  revenue: {
    total: number;
  };
  recentActivity: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/analytics/summary', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        toast.error('Failed to load dashboard stats');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ [action]: true }),
      });

      if (response.ok) {
        toast.success(`User ${action} successfully`);
        fetchDashboardStats();
      } else {
        toast.error(`Failed to ${action} user`);
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 backdrop-blur-lg border-b border-slate-600/50 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 hover-lift">
              <Link href="/dashboard">
                <Button variant="ghost" className="hover-glow text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <img src="/logo.png" alt="PromoHive" className="h-10 w-10 float-animation brightness-110" />
              <div>
                <h1 className="text-2xl font-bold text-white font-display drop-shadow-lg">Admin Dashboard</h1>
                <p className="text-sm text-slate-300">Manage your platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg border-0 px-3 py-1">
                <Crown className="h-3 w-3 mr-1" />
                Admin Panel
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="card-interactive p-6 bg-brand-gradient text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2 font-display">
                  Welcome to Admin Panel! 👑
                </h2>
                <p className="text-lg opacity-90">
                  Manage users, tasks, withdrawals, and monitor platform performance.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center float-animation">
                  <Crown className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="dashboard-card animate-scale-in hover-lift">
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Total Users</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center float-animation">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">{stats?.users?.total || 0}</div>
              <p className="text-sm text-gray-600 mt-1">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Pending Approvals</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center float-animation">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">{stats?.users?.pending || 0}</div>
              <p className="text-sm text-gray-600 mt-1">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Active Tasks</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center float-animation">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">{stats?.tasks?.active || 0}</div>
              <p className="text-sm text-gray-600 mt-1">
                Available tasks
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-scale-in hover-lift" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="dashboard-card-header">
              <CardTitle className="dashboard-card-title">Pending Withdrawals</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center float-animation">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="dashboard-card-value">{stats?.withdrawals?.pending || 0}</div>
              <p className="text-sm text-gray-600 mt-1">
                Awaiting review
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 animate-slide-up">
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-brand-blue" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="btn-primary btn-touch hover-lift">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Approve Users
                </Button>
                <Button className="btn-secondary btn-touch hover-lift">
                  <Target className="h-4 w-4 mr-2" />
                  Manage Tasks
                </Button>
                <Button className="btn-secondary btn-touch hover-lift">
                  <Wallet className="h-4 w-4 mr-2" />
                  Review Withdrawals
                </Button>
                <Button className="btn-secondary btn-touch hover-lift">
                  <Settings className="h-4 w-4 mr-2" />
                  Platform Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="animate-scale-in">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="hover-glow">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="hover-glow">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="tasks" className="hover-glow">
              <Target className="h-4 w-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="hover-glow">
              <Wallet className="h-4 w-4 mr-2" />
              Withdrawals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Platform Overview */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="card-interactive animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-brand-blue" />
                    Platform Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="font-medium">Total Users</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">{stats?.users?.total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="font-medium">Approved Users</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">{stats?.users?.approved || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                        <span className="font-medium">Pending Users</span>
                      </div>
                      <span className="text-xl font-bold text-yellow-600">{stats?.users?.pending || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <Target className="h-5 w-5 text-purple-600 mr-3" />
                        <span className="font-medium">Active Tasks</span>
                      </div>
                      <span className="text-xl font-bold text-purple-600">{stats?.tasks?.active || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-interactive animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-brand-pink" />
                    Financial Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                        <span className="font-medium">Total Revenue</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">${stats?.revenue?.total?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Wallet className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="font-medium">Total Withdrawals</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">{stats?.withdrawals?.total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                        <span className="font-medium">Pending Withdrawals</span>
                      </div>
                      <span className="text-xl font-bold text-yellow-600">{stats?.withdrawals?.pending || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-purple-600 mr-3" />
                        <span className="font-medium">Platform Health</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Excellent
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="card-interactive animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-brand-blue" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest platform activities and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentActivity?.length > 0 ? (
                    stats.recentActivity.slice(0, 5).map((activity, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover-lift animate-scale-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Activity className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{activity.description}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {activity.type}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-8">
            <Card className="card-interactive animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-brand-blue" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">User Management</h3>
                  <p className="text-gray-600 mb-4">
                    Manage user accounts, approve registrations, and handle user-related tasks.
                  </p>
                  <Button className="btn-primary hover-glow">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-8">
            <Card className="card-interactive animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-brand-blue" />
                  Task Management
                </CardTitle>
                <CardDescription>
                  Create and manage platform tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Task Management</h3>
                  <p className="text-gray-600 mb-4">
                    Create new tasks, manage existing ones, and monitor task performance.
                  </p>
                  <Button className="btn-primary hover-glow">
                    <Target className="h-4 w-4 mr-2" />
                    Manage Tasks
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-8">
            <Card className="card-interactive animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2 text-brand-blue" />
                  Withdrawal Management
                </CardTitle>
                <CardDescription>
                  Review and process withdrawal requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Wallet className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Withdrawal Management</h3>
                  <p className="text-gray-600 mb-4">
                    Review pending withdrawal requests and process payments.
                  </p>
                  <Button className="btn-primary hover-glow">
                    <Wallet className="h-4 w-4 mr-2" />
                    Manage Withdrawals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Admin Tools */}
        <div className="mt-8 animate-slide-up">
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-brand-blue" />
                Admin Tools
              </CardTitle>
              <CardDescription>
                Advanced administrative functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Database</h3>
                  <p className="text-sm text-gray-600">Manage database and backups</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: '1s' }}>
                    <Globe className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                  <p className="text-sm text-gray-600">Platform analytics and reports</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: '2s' }}>
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                  <p className="text-sm text-gray-600">Security settings and logs</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: '3s' }}>
                    <Settings className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Settings</h3>
                  <p className="text-sm text-gray-600">Platform configuration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}