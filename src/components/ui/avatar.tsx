import React from 'react'
import { cn, getInitials } from '@/lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ name, src, size = 'md', className, ...props }: AvatarProps) {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base'
  }
  
  return (
    <div
      className={cn(
        'rounded-full bg-primary text-white flex items-center justify-center font-bold',
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  )
}
