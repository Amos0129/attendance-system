// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)