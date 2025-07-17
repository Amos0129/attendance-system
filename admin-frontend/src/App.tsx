// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import { EmployeePage } from './pages/EmployeePage'
import { DashboardLayoutWrapper } from './layouts/DashboardLayoutWrapper'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes with layout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayoutWrapper />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeePage />} />
            {/* 其他登入後頁面都寫在這 */}
          </Route>

          {/* Redirect root path */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
