// src/components/ui/Card.tsx
import React from 'react'
import { cn } from '../../utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8 text-white relative overflow-hidden",
      className
    )}>
      {/* 背景裝飾 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 to-purple-600/8 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/15 to-transparent rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/15 to-transparent rounded-full blur-xl pointer-events-none"></div>
      
      {/* 內容 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}