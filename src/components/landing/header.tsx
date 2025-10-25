'use client'

import React, { useState } from 'react'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="flex items-center justify-between whitespace-nowrap py-6">
      <Logo size="md" />
      
      <nav className="hidden md:flex items-center gap-8">
        <a 
          href="#features" 
          className="text-sm font-medium leading-normal text-navy/80 dark:text-gray-300 hover:text-navy dark:hover:text-white transition-colors"
        >
          Features
        </a>
        <a 
          href="#pricing" 
          className="text-sm font-medium leading-normal text-navy/80 dark:text-gray-300 hover:text-navy dark:hover:text-white transition-colors"
        >
          Pricing
        </a>
        <a 
          href="#about" 
          className="text-sm font-medium leading-normal text-navy/80 dark:text-gray-300 hover:text-navy dark:hover:text-white transition-colors"
        >
          About
        </a>
      </nav>
      
      <div className="flex items-center gap-4">
        <Button size="sm">
          Request Demo
        </Button>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-navy-800 border-t border-gray-200 dark:border-gray-700 md:hidden">
          <nav className="flex flex-col p-4 space-y-4">
            <a href="#features" className="text-sm font-medium text-navy dark:text-white">Features</a>
            <a href="#pricing" className="text-sm font-medium text-navy dark:text-white">Pricing</a>
            <a href="#about" className="text-sm font-medium text-navy dark:text-white">About</a>
          </nav>
        </div>
      )}
    </header>
  )
}
