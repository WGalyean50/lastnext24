import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from './components';

// Lazy load pages for better code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const RoleSelectPage = React.lazy(() => import('./pages/RoleSelectPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullPage size="lg" text="Loading..." />}>
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<HomePage />} />
          
          {/* Role Selection */}
          <Route path="/role-select" element={<RoleSelectPage />} />
          
          {/* Dashboard (main app) */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Catch-all redirect to homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;