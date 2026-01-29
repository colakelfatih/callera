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
  // Hepsiburada style base classes
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    // Hepsiburada Orange Button
    primary: 'bg-primary text-white shadow-sm hover:bg-primary-600 hover:shadow-md active:bg-primary-700',
    // Hepsiburada Secondary/White Button
    secondary: 'bg-white dark:bg-navy-800 text-navy dark:text-white border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary dark:hover:border-primary-400',
    // Hepsiburada Outline Button
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white',
    // Hepsiburada Ghost Button
    ghost: 'text-navy dark:text-white hover:bg-primary-50 dark:hover:bg-navy-700 hover:text-primary'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
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
