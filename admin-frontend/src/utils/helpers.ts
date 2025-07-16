// src/utils/helpers.ts
export const helpers = {
  debounce: <T extends (...args: any[]) => any>(func: T, delay: number): T => {
    let timeoutId: ReturnType<typeof setTimeout>
    return ((...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }) as T
  },

  throttle: <T extends (...args: any[]) => any>(func: T, limit: number): T => {
    let inThrottle: boolean
    return ((...args: any[]) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }) as T
  },

  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as any
    if (obj instanceof Array) return obj.map(item => helpers.deepClone(item)) as any
    if (typeof obj === 'object') {
      const cloned: any = {}
      Object.keys(obj).forEach(key => {
        cloned[key] = helpers.deepClone((obj as any)[key])
      })
      return cloned
    }
    return obj
  },

  generateId: (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  },

  isEmptyObject: (obj: any): boolean => {
    return Object.keys(obj).length === 0
  },

  removeEmptyFields: (obj: Record<string, any>): Record<string, any> => {
    const result: Record<string, any> = {}
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
        result[key] = obj[key]
      }
    })
    return result
  },

  scrollToTop: (behavior: ScrollBehavior = 'smooth'): void => {
    window.scrollTo({ top: 0, behavior })
  },

  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error('Failed to copy text: ', err)
      return false
    }
  },

  downloadFile: (data: any, filename: string, type: string = 'application/json'): void => {
    const blob = new Blob([data], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },

  getQueryParams: (): Record<string, string> => {
    const params: Record<string, string> = {}
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  },

  setQueryParams: (params: Record<string, string>): void => {
    const urlParams = new URLSearchParams(window.location.search)
    Object.keys(params).forEach(key => {
      if (params[key]) {
        urlParams.set(key, params[key])
      } else {
        urlParams.delete(key)
      }
    })
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`)
  },

  isMobile: (): boolean => {
    return window.innerWidth <= 768
  },

  isTablet: (): boolean => {
    return window.innerWidth > 768 && window.innerWidth <= 1024
  },

  isDesktop: (): boolean => {
    return window.innerWidth > 1024
  },

  sleep: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  retry: async <T>(fn: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> => {
    let lastError: Error
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        if (i < maxRetries - 1) {
          await helpers.sleep(delay)
        }
      }
    }
    throw lastError!
  },
}