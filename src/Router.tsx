import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage, RoleSelectPage, DashboardPage } from './pages';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default Router;