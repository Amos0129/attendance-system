// src/components/ui/Input.tsx
import React from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  className,
  ...props
}) => {
  return (
    <div className="mb-6">
      {label && (
        <label className="block text-slate-200 text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40",
            "transition-all duration-200 backdrop-blur-sm",
            icon && "pl-12",
            rightIcon && "pr-12",
            error && "border-red-500/50 focus:ring-red-500/40",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}