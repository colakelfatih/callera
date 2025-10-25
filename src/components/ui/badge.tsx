import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  children: React.ReactNode
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-gray-300',
    success: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
    error: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
    info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
  }
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
