// src/utils/formatters.ts
export const formatters = {
  date: (date: string | Date): string => {
    const d = new Date(date)
    return d.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  },

  time: (date: string | Date): string => {
    const d = new Date(date)
    return d.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
    })
  },

  datetime: (date: string | Date): string => {
    const d = new Date(date)
    return d.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  },

  percentage: (value: number): string => {
    return `${(value * 100).toFixed(1)}%`
  },

  currency: (value: number): string => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
    }).format(value)
  },

  truncate: (str: string, length: number): string => {
    if (str.length <= length) return str
    return str.substring(0, length) + '...'
  },

  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },

  phoneNumber: (value: string): string => {
    // 格式化手機號碼：0912345678 -> 0912-345-678
    if (value.length === 10) {
      return `${value.slice(0, 4)}-${value.slice(4, 7)}-${value.slice(7)}`
    }
    return value
  },

  fileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`
  },
}