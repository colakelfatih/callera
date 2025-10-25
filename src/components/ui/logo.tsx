import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps extends React.SVGAttributes<SVGSVGElement> {
  variant?: 'full' | 'symbol' | 'wordmark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ variant = 'full', size = 'md', className, ...props }: LogoProps) {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12'
  }
  
  const symbol = (
    <svg
      viewBox="0 0 48 48"
      className={cn(sizes[size], className)}
      {...props}
    >
      <defs>
        <linearGradient id="callera-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2F80ED" />
          <stop offset="100%" stopColor="#0E1B3D" />
        </linearGradient>
      </defs>
      
      {/* Call wave + flow line + dot symbol */}
      <path
        d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
        fill="url(#callera-gradient)"
      />
      
      {/* Flow line */}
      <path
        d="M8 24L40 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Communication dot */}
      <circle cx="24" cy="24" r="3" fill="white" />
    </svg>
  )
  
  const wordmark = (
    <span className="font-display font-bold text-navy dark:text-white">
      Callera
    </span>
  )
  
  if (variant === 'symbol') return symbol
  if (variant === 'wordmark') return wordmark
  
  return (
    <div className="flex items-center gap-3">
      {symbol}
      {wordmark}
    </div>
  )
}
