import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ChatProvider } from './contexts/ChatContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
function ProtectedRoute({
  children,
  requiredRole
}: {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}) {
  const {
    user,
    isLoading
  } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return <>{children}</>;
}
export function App() {
  return <ThemeProvider defaultTheme="system" storageKey="gabai-theme">
      <AuthProvider>
        <DataProvider>
          <ChatProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route path="/dashboard/*" element={<ProtectedRoute requiredRole="user">
                      <DashboardLayout />
                    </ProtectedRoute>}>
                  <Route path="*" element={<UserDashboard />} />
                </Route>

                <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin">
                      <DashboardLayout />
                    </ProtectedRoute>}>
                  <Route path="*" element={<AdminDashboard />} />
                </Route>
              </Routes>
            </Router>
          </ChatProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>;
}