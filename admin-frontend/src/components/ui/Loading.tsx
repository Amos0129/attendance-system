// src/components/ui/Loading.tsx
import React from 'react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = '載入中...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const Container = fullScreen ? 'div' : React.Fragment
  const containerProps = fullScreen 
    ? { className: 'min-h-screen bg-auth-gradient flex items-center justify-center' }
    : {}

  return (
    <Container {...containerProps}>
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4`}></div>
        <p className="text-white/70 text-sm">{text}</p>
      </div>
    </Container>
  )
}