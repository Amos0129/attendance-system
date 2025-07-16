// src/components/common/Footer.tsx
import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-white/50 text-sm">
            © 2024 出勤管理系統. All rights reserved.
          </div>
          <div className="flex space-x-6 text-white/50 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              說明文件
            </a>
            <a href="#" className="hover:text-white transition-colors">
              聯絡我們
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}