// src/utils/validators.ts
import { FORM_VALIDATION } from './constants'

export interface ValidationResult {
  isValid: boolean
  message?: string
}

export const validators = {
  username: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: '使用者名稱不能為空' }
    }
    
    if (value.length < FORM_VALIDATION.USERNAME.MIN_LENGTH) {
      return { isValid: false, message: `使用者名稱至少需要 ${FORM_VALIDATION.USERNAME.MIN_LENGTH} 個字符` }
    }
    
    if (value.length > FORM_VALIDATION.USERNAME.MAX_LENGTH) {
      return { isValid: false, message: `使用者名稱不能超過 ${FORM_VALIDATION.USERNAME.MAX_LENGTH} 個字符` }
    }
    
    if (!FORM_VALIDATION.USERNAME.PATTERN.test(value)) {
      return { isValid: false, message: '使用者名稱只能包含字母、數字、底線和連字符' }
    }
    
    return { isValid: true }
  },

  password: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: '密碼不能為空' }
    }
    
    if (value.length < FORM_VALIDATION.PASSWORD.MIN_LENGTH) {
      return { isValid: false, message: `密碼至少需要 ${FORM_VALIDATION.PASSWORD.MIN_LENGTH} 個字符` }
    }
    
    if (value.length > FORM_VALIDATION.PASSWORD.MAX_LENGTH) {
      return { isValid: false, message: `密碼不能超過 ${FORM_VALIDATION.PASSWORD.MAX_LENGTH} 個字符` }
    }
    
    return { isValid: true }
  },

  email: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: '電子郵件不能為空' }
    }
    
    if (!FORM_VALIDATION.EMAIL.PATTERN.test(value)) {
      return { isValid: false, message: '請輸入有效的電子郵件地址' }
    }
    
    return { isValid: true }
  },

  required: (value: any): ValidationResult => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return { isValid: false, message: '此欄位為必填' }
    }
    return { isValid: true }
  },

  minLength: (min: number) => (value: string): ValidationResult => {
    if (value.length < min) {
      return { isValid: false, message: `至少需要 ${min} 個字符` }
    }
    return { isValid: true }
  },

  maxLength: (max: number) => (value: string): ValidationResult => {
    if (value.length > max) {
      return { isValid: false, message: `不能超過 ${max} 個字符` }
    }
    return { isValid: true }
  },

  pattern: (pattern: RegExp, message: string) => (value: string): ValidationResult => {
    if (!pattern.test(value)) {
      return { isValid: false, message }
    }
    return { isValid: true }
  },

  number: (value: string): ValidationResult => {
    if (isNaN(Number(value))) {
      return { isValid: false, message: '請輸入有效的數字' }
    }
    return { isValid: true }
  },

  phoneNumber: (value: string): ValidationResult => {
    const phonePattern = /^09\d{8}$/
    if (!phonePattern.test(value)) {
      return { isValid: false, message: '請輸入有效的手機號碼（格式：09xxxxxxxx）' }
    }
    return { isValid: true }
  },

  date: (value: string): ValidationResult => {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return { isValid: false, message: '請輸入有效的日期' }
    }
    return { isValid: true }
  },

  confirmPassword: (password: string) => (value: string): ValidationResult => {
    if (value !== password) {
      return { isValid: false, message: '密碼確認不符' }
    }
    return { isValid: true }
  }
}

// 表單驗證函數
export const validateForm = (values: Record<string, any>, rules: Record<string, ((value: any) => ValidationResult)[]>): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field]
    const value = values[field]
    
    for (const rule of fieldRules) {
      const result = rule(value)
      if (!result.isValid) {
        errors[field] = result.message || '驗證失敗'
        break
      }
    }
  })
  
  return errors
}