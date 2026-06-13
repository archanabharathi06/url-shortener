import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ROUTES } from './constants/routes';

// Layouts
import AppLayout from './components/layout/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PublicStatsPage from './pages/PublicStatsPage';
import NotFoundPage from './pages/NotFoundPage';

// Common
import { Toaster } from './components/common/Toast';
import Skeleton from './components/common/Skeleton';

// Protected Route Guard HOC
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 border-4 border-slate-200 border-t-brand rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-400">Restoring session...</span>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

// Public Route Guard (Redirects to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 border-4 border-slate-200 border-t-brand rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-400">Loading...</span>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Marketing Landing */}
          <Route path={ROUTES.LANDING} element={<LandingPage />} />

          {/* Auth Pages */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.SIGNUP}
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          {/* Protected App Routes inside layout shell */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={`${ROUTES.ANALYTICS}/:urlId`} element={<AnalyticsPage />} />
          </Route>

          {/* Unprotected Shareable Stats Page */}
          <Route path={`${ROUTES.PUBLIC_STATS}/:shortCode`} element={<PublicStatsPage />} />

          {/* Fallback 404 Pages */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        
        {/* Global Toast Alerts */}
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
