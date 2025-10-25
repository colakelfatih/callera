'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Play, MessageSquare, Phone, Mail, Instagram } from 'lucide-react'

export function Hero() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="flex flex-col gap-8 text-center lg:text-left">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-black leading-tight tracking-tighter text-navy dark:text-white sm:text-5xl lg:text-6xl">
              An AI assistant that calls your customers for you.
            </h1>
            <p className="text-base font-normal leading-relaxed text-navy/70 dark:text-gray-400 sm:text-lg">
              Social messages, calls, and CRM in one flow. Upload, teach, and let it talk.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Button size="lg">
              Request Demo
            </Button>
            <Button variant="secondary" size="lg">
              Try Free
            </Button>
          </div>
          
          <div className="mt-8">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 text-center lg:text-left">
              TRUSTED BY THE WORLD'S MOST INNOVATIVE TEAMS
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-8 gap-y-4 opacity-60 dark:opacity-40">
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="relative w-full aspect-[4/3] lg:aspect-square">
          <div className="absolute w-full h-full" style={{ perspective: '1000px' }}>
            {/* Unified Inbox Mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] sm:w-[70%] lg:w-[90%] transform transition-transform duration-500 ease-in-out hover:rotate-y-0" 
                 style={{ transform: 'rotateY(-10deg) rotateX(10deg) translateZ(50px)' }}>
              <div className="relative w-full bg-white dark:bg-navy rounded-xl shadow-2xl overflow-hidden p-2 sm:p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-navy-900 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="block w-3 h-3 bg-red-400 rounded-full"></span>
                    <span className="block w-3 h-3 bg-yellow-400 rounded-full"></span>
                    <span className="block w-3 h-3 bg-green-400 rounded-full"></span>
                  </div>
                  <div className="text-xs font-semibold text-gray-500">Unified Inbox</div>
                  <div></div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-2 p-2 bg-primary/10 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center font-bold text-primary text-sm">JS</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-sm text-navy dark:text-white">John Smith</p>
                        <p className="text-xs text-gray-400">10:32 AM</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Just following up on our conversation...</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 p-2 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-600 text-sm">AW</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-sm text-navy dark:text-white">Alice Wonders</p>
                        <p className="text-xs text-gray-400">9:15 AM</p>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Can we reschedule for tomorrow?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Calling Mockup */}
            <div className="absolute bottom-[-10%] right-[-10%] sm:bottom-[-5%] sm:right-[-5%] lg:bottom-[-10%] lg:right-[-5%] w-[60%] sm:w-[50%] lg:w-[55%] bg-white dark:bg-navy rounded-xl shadow-2xl p-2 sm:p-4 border border-gray-200 dark:border-gray-700 transition-transform duration-500 ease-in-out hover:scale-105" 
                 style={{ transform: 'rotateY(15deg) rotateX(-5deg) translateZ(100px)' }}>
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-primary">AI OUTBOUND CALL</p>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="mt-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-navy dark:text-white">Calling Jane Doe...</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">00:12</p>
                </div>
              </div>
              
              <div className="mt-4 flex gap-1 h-8 items-end">
                {[...Array(11)].map((_, i) => (
                  <span 
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
