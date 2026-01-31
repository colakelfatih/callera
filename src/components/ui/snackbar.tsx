'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

export type SnackbarType = 'success' | 'error' | 'info' | 'warning'

interface SnackbarProps {
  message: string
  type?: SnackbarType
  duration?: number
  onClose: () => void
  isVisible: boolean
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const styles = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
  warning: 'bg-amber-600',
}

export function Snackbar({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose,
  isVisible 
}: SnackbarProps) {
  const [isShowing, setIsShowing] = useState(false)
  const Icon = icons[type]

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true)
      const timer = setTimeout(() => {
        setIsShowing(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible && !isShowing) return null

  return (
    <div 
      className={`fixed top-6 right-6 z-[100] transition-all duration-300 ${
        isShowing 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 translate-x-8'
      }`}
    >
      <div className={`${styles[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-md`}>
        <Icon size={20} className="shrink-0" />
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button 
          onClick={() => {
            setIsShowing(false)
            setTimeout(onClose, 300)
          }}
          className="p-1 hover:bg-white/20 rounded transition-colors shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// Hook for managing snackbar state
export function useSnackbar() {
  const [snackbar, setSnackbar] = useState<{
    message: string
    type: SnackbarType
    isVisible: boolean
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  })

  const showSnackbar = (message: string, type: SnackbarType = 'success') => {
    setSnackbar({ message, type, isVisible: true })
  }

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isVisible: false }))
  }

  return { snackbar, showSnackbar, hideSnackbar }
}
