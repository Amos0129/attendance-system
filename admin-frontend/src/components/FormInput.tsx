import React from 'react'

type Props = {
  type: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FormInput({ type, placeholder, value, onChange }: Props) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      aria-label={placeholder}
      autoComplete={type === 'password' ? 'current-password' : 'username'}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 mb-4 border border-accent rounded-lg shadow-sm 
                 focus:outline-none focus:ring-2 focus:ring-primary transition duration-200"
    />
  )
}
