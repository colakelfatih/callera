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
  const baseClasses = 'font-bold rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20'
  
  const variants = {
    primary: 'bg-primary text-white shadow-sm hover:shadow-lg',
    secondary: 'bg-gray-200/50 dark:bg-white/10 text-navy dark:text-white hover:bg-gray-200 dark:hover:bg-white/20',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-navy dark:text-white hover:bg-gray-100 dark:hover:bg-navy-700'
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
