'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'full' | 'symbol' | 'wordmark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  linkToHome?: boolean
}

export function Logo({ variant = 'full', size = 'md', className, linkToHome = true }: LogoProps) {
  const params = useParams()
  const locale = params?.locale as string || 'tr'

  const sizes = {
    sm: { height: 40, width: 150 },
    md: { height: 50, width: 200 },
    lg: { height: 60, width: 250 },
    xl: { height: 80, width: 300 }
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }
  
  const logoImage = (
    <Image
      src="/assets/logo.svg"
      alt="Cevaplıyoruz Logo"
      width={sizes[size].width}
      height={sizes[size].height}
      className={cn('object-contain', className)}
      priority
    />
  )
  
  const wordmark = (
    <span className={cn(
      'font-bold text-navy dark:text-white',
      textSizes[size],
      className
    )}>
      Cevaplıyoruz
    </span>
  )

  const renderContent = () => {
    if (variant === 'symbol') return logoImage
    if (variant === 'wordmark') return wordmark
    return logoImage
  }

  if (linkToHome) {
    return (
      <Link href={`/${locale}`} className="block">
        {renderContent()}
      </Link>
    )
  }
  
  return renderContent()
}
