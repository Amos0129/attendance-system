// src/components/ui/Alert.tsx
import React from 'react'
import { cn } from '../../utils/cn'

interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info'
  children: React.ReactNode
  className?: string
}

export const Alert: React.FC<AlertProps> = ({ type, children, className }) => {
  const styles = {
    error: "bg-red-500/20 border-red-500/50 text-red-200",
    success: "bg-green-500/20 border-green-500/50 text-green-200",
    warning: "bg-yellow-500/20 border-yellow-500/50 text-yellow-200",
    info: "bg-blue-500/20 border-blue-500/50 text-blue-200"
  }

  return (
    <div className={cn(
      "border text-sm px-4 py-3 rounded-xl mb-6 backdrop-blur-sm",
      styles[type],
      className
    )}>
      <div className="flex items-center">
        <div className={cn(
          "w-2 h-2 rounded-full mr-2",
          type === 'error' && "bg-red-500",
          type === 'success' && "bg-green-500",
          type === 'warning' && "bg-yellow-500",
          type === 'info' && "bg-blue-500"
        )}></div>
        {children}
      </div>
    </div>
  )
}