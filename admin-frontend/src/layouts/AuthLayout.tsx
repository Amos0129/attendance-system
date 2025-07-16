// src/layouts/AuthLayout.tsx
import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-auth-gradient flex items-center justify-center">
      {children}
    </div>
  )
}