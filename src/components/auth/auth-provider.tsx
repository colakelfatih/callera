'use client'

import React from 'react'
import { createAuthClient } from 'better-auth/react'

// Get baseURL from environment or use current origin
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

