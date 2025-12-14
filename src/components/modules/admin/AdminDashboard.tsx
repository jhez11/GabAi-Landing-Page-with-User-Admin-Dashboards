import React, { useEffect, useState, createElement } from 'react';
import { Users, MessageSquare, GraduationCap, TrendingUp, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { motion } from 'framer-motion';
interface Analytics {
  totalUsers: number;
  totalConversations: number;
  totalCourses: number;
  totalScholarships: number;
  userGrowth: number;
  conversationGrowth: number;
}
export function AdminDashboardHome() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalConversations: 0,
    totalCourses: 0,
    totalScholarships: 0,
    userGrowth: 0,
    conversationGrowth: 0
  });
  const [conversationData, setConversationData] = useState<Array<{
    day: string;
    count: number;
  }>>([]);
  useEffect(() => {
    loadAnalytics();
  }, []);
  const loadAnalytics = () => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('gabai_registered_users') || '[]');
      const courses = JSON.parse(localStorage.getItem('gabai_courses') || '[]');
      const scholarships = JSON.parse(localStorage.getItem('gabai_scholarships') || '[]');
      // Calculate total conversations from all users with error handling
      let totalConversations = 0;
      registeredUsers.forEach((userObj: any) => {
        try {
          if (userObj && userObj.user && userObj.user.id) {
            const chatSessions = JSON.parse(localStorage.getItem(`gabai_chat_sessions_${userObj.user.id}`) || '[]');
            totalConversations += chatSessions.length;
          }
        } catch (err) {
          console.error('Error loading chat sessions for user:', err);
        }
      });
      // Mock growth data (in real app, compare with previous period)
      const userGrowth = registeredUsers.length > 0 ? 12.5 : 0;
      const conversationGrowth = totalConversations > 0 ? 8.3 : 0;
      setAnalytics({
        totalUsers: registeredUsers.length,
        totalConversations,
        totalCourses: courses.length,
        totalScholarships: scholarships.length,
        userGrowth,
        conversationGrowth
      });
      // Generate conversation data for the last 7 days
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const data = days.map(day => ({
        day,
        count: Math.floor(Math.random() * 50) + 10
      }));
      setConversationData(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Set default values on error
      setAnalytics({
        totalUsers: 0,
        totalConversations: 0,
        totalCourses: 0,
        totalScholarships: 0,
        userGrowth: 0,
        conversationGrowth: 0
      });
    }
  };
  const downloadReport = () => {
    try {
      const report = {
        generatedAt: new Date().toISOString(),
        analytics,
        conversationData
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gabai-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    }
  };
  const stats = [{
    title: 'Total Users',
    value: analytics.totalUsers,
    change: `+${analytics.userGrowth}%`,
    icon: Users,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30'
  }, {
    title: 'Conversations',
    value: analytics.totalConversations,
    change: `+${analytics.conversationGrowth}%`,
    icon: MessageSquare,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30'
  }, {
    title: 'Courses',
    value: analytics.totalCourses,
    change: 'Active',
    icon: GraduationCap,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30'
  }, {
    title: 'Scholarships',
    value: analytics.totalScholarships,
    change: 'Available',
    icon: TrendingUp,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30'
  }];
  const maxCount = Math.max(...conversationData.map(d => d.count), 1);
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Monitor system activity and performance
          </p>
        </div>
        <Button onClick={downloadReport} className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" /> Download Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => <motion.div key={stat.title} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: index * 0.1
      }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>)}
      </div>

      {/* Conversation Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversations This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversationData.map((data, index) => <motion.div key={data.day} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: index * 0.1
          }} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-muted-foreground">
                  {data.day}
                </div>
                <div className="flex-1 h-10 bg-muted rounded-lg overflow-hidden relative">
                  <motion.div initial={{
                width: 0
              }} animate={{
                width: `${data.count / maxCount * 100}%`
              }} transition={{
                delay: index * 0.1 + 0.3,
                duration: 0.5
              }} className="h-full bg-gradient-to-r from-primary to-secondary flex items-center justify-end pr-3">
                    <span className="text-xs font-bold text-white">
                      {data.count}
                    </span>
                  </motion.div>
                </div>
              </motion.div>)}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[{
              action: 'New user registered',
              user: 'Juan Dela Cruz',
              time: '2 minutes ago'
            }, {
              action: 'Course updated',
              user: 'Admin',
              time: '15 minutes ago'
            }, {
              action: 'New conversation started',
              user: 'Maria Clara',
              time: '1 hour ago'
            }, {
              action: 'Scholarship added',
              user: 'Admin',
              time: '2 hours ago'
            }].map((activity, index) => <motion.div key={index} initial={{
              opacity: 0,
              x: -10
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: index * 0.1
            }} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </motion.div>)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="h-5 w-5" />
                <span className="text-xs">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <GraduationCap className="h-5 w-5" />
                <span className="text-xs">Add Course</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs">View Chats</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Download className="h-5 w-5" />
                <span className="text-xs">Export Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}