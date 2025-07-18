// src/types/common.ts
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface TableColumn<T = any> {
  key: keyof T
  title: string
  width?: number
  render?: (value: any, record: T) => React.ReactNode
  sortable?: boolean
}

export interface FormFieldProps {
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}