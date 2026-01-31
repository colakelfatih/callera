import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  // Base classes with flex for icon alignment
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    // Primary Orange Button
    primary: 'bg-primary text-white shadow-sm hover:bg-primary-600 hover:shadow-md active:bg-primary-700',
    // Secondary/White Button
    secondary: 'bg-white dark:bg-navy-800 text-navy dark:text-white border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary dark:hover:border-primary-400',
    // Outline Button - subtle border style
    outline: 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500',
    // Ghost Button
    ghost: 'text-navy dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-7 py-3.5 text-lg gap-2.5'
  }
  
  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
