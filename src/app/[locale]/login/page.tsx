'use client'

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { authClient } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/ui/logo'
import { Mail, Lock, Loader2, AlertCircle, Shield, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('auth')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // 2FA states
  const [requires2FA, setRequires2FA] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [twoFactorCode, setTwoFactorCode] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // First check if user has 2FA enabled (no password check yet)
      const checkResponse = await fetch('/api/auth/check-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const checkData = await checkResponse.json()

      if (!checkResponse.ok) {
        setError(checkData.error || 'Failed to check 2FA status')
        setLoading(false)
        return
      }

      if (checkData.requires2FA) {
        // User has 2FA enabled - show 2FA input
        // Store email/password to use after 2FA verification
        setRequires2FA(true)
        setUserId(checkData.userId)
        setLoading(false)
        return
      }

      // No 2FA - proceed with normal login
      await completeLogin()
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || t('loginError'))
      setLoading(false)
    }
  }

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setError('Lütfen 6 haneli doğrulama kodunu girin')
      setLoading(false)
      return
    }

    try {
      // Verify 2FA code first
      const verifyResponse = await fetch('/api/auth/verify-2fa-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: twoFactorCode }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok) {
        setError(verifyData.error || 'Doğrulama kodu hatalı')
        setLoading(false)
        return
      }

      // 2FA verified - now complete login with BetterAuth
      await completeLogin()
    } catch (err: any) {
      console.error('2FA verify error:', err)
      setError(err.message || 'Doğrulama başarısız')
      setLoading(false)
    }
  }

  const completeLogin = async () => {
    try {
      // Add timeout to prevent infinite waiting
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - please check your connection')), 10000)
      })

      const result = await Promise.race([
        authClient.signIn.email({
          email,
          password,
        }),
        timeoutPromise,
      ]) as any

      console.log('Login result:', result)

      if (result.error) {
        setError(result.error.message || t('loginError'))
        setLoading(false)
        // If login fails after 2FA, go back to login screen
        if (requires2FA) {
          setRequires2FA(false)
          setTwoFactorCode('')
        }
      } else if (result.data) {
        // Redirect to dashboard
        router.push(`/${locale}/dashboard`)
        router.refresh()
      } else {
        // No error but no data - might be successful
        router.push(`/${locale}/dashboard`)
        router.refresh()
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || t('loginError'))
      setLoading(false)
      // If login fails after 2FA, go back to login screen
      if (requires2FA) {
        setRequires2FA(false)
        setTwoFactorCode('')
      }
    }
  }

  const goBackToLogin = () => {
    setRequires2FA(false)
    setUserId(null)
    setTwoFactorCode('')
    setError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-primary/5 dark:from-navy-900 dark:via-navy-800 dark:to-navy-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {requires2FA ? (
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  İki Faktörlü Doğrulama
                </div>
              ) : (
                t('loginTitle')
              )}
            </CardTitle>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
              {requires2FA 
                ? 'Authenticator uygulamanızdaki 6 haneli kodu girin'
                : t('loginSubtitle')}
            </p>
          </CardHeader>
          <CardContent>
            {requires2FA ? (
              // 2FA Verification Form
              <form onSubmit={handle2FASubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="2fa-code" className="block text-sm font-medium text-navy dark:text-gray-300 mb-2">
                    Doğrulama Kodu
                  </label>
                  <input
                    id="2fa-code"
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      setTwoFactorCode(value)
                      setError('')
                    }}
                    required
                    autoFocus
                    className="w-full text-center text-2xl font-mono tracking-[0.5em] py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-navy-700 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="000000"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading || twoFactorCode.length !== 6}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Doğrulanıyor...
                    </>
                  ) : (
                    'Doğrula ve Giriş Yap'
                  )}
                </Button>

                <button
                  type="button"
                  onClick={goBackToLogin}
                  className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Giriş ekranına dön
                </button>
              </form>
            ) : (
              // Normal Login Form
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-navy dark:text-gray-300 mb-2">
                    {t('email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-navy-700 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder={t('emailPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-navy dark:text-gray-300 mb-2">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-navy-700 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder={t('passwordPlaceholder')}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('loggingIn')}
                    </>
                  ) : (
                    t('login')
                  )}
                </Button>
              </form>
            )}

            {!requires2FA && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('noAccount')}{' '}
                  <a
                    href={`/${locale}/register`}
                    className="text-primary font-semibold hover:underline"
                  >
                    {t('register')}
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
