'use client'

import React, { useEffect, useState } from 'react'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

declare global {
  interface Window {
    FB: any
    fbAsyncInit: () => void
  }
}

interface WhatsAppEmbeddedSignupProps {
  configId: string
  appId: string
  onSuccess?: (data: { wabaId: string; phoneNumberId: string; phoneNumber?: string }) => void
  onError?: (error: string) => void
}

export function WhatsAppEmbeddedSignup({
  configId,
  appId,
  onSuccess,
  onError,
}: WhatsAppEmbeddedSignupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    // Load Facebook JS SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v24.0',
      })
    }

    // Load SDK script
    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'
    document.body.appendChild(script)

    // Listen for Embedded Signup events
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.facebook.com' && event.origin !== 'https://web.facebook.com') {
        return
      }

      try {
        const data = JSON.parse(event.data)
        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          if (data.event === 'FINISH') {
            const { phone_number_id, waba_id, phone_number } = data.data
            console.log('WhatsApp Embedded Signup completed:', {
              phoneNumberId: phone_number_id,
              wabaId: waba_id,
              phoneNumber: phone_number,
            })

            setStatus('success')
            setMessage('WhatsApp Business hesabı başarıyla bağlandı!')
            setIsLoading(false)

            if (onSuccess) {
              onSuccess({
                wabaId: waba_id,
                phoneNumberId: phone_number_id,
                phoneNumber: phone_number,
              })
            }
          } else if (data.event === 'CANCEL') {
            const { current_step } = data.data
            console.warn('WhatsApp Embedded Signup cancelled at:', current_step)
            setStatus('error')
            setMessage('Bağlantı işlemi iptal edildi')
            setIsLoading(false)

            if (onError) {
              onError('User cancelled the signup flow')
            }
          } else if (data.event === 'ERROR') {
            const { error_message } = data.data
            console.error('WhatsApp Embedded Signup error:', error_message)
            setStatus('error')
            setMessage(`Hata: ${error_message}`)
            setIsLoading(false)

            if (onError) {
              onError(error_message)
            }
          }
        }
      } catch (e) {
        // Not a JSON response, ignore
        console.log('Non-JSON message received:', event.data)
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src*="sdk.js"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [appId, onSuccess, onError])

  const fbLoginCallback = (response: any) => {
    if (response.authResponse) {
      const code = response.authResponse.code
      console.log('Facebook login code received:', code)

      // Send code to backend to exchange for token
      setIsLoading(true)
      setStatus('loading')
      setMessage('Token alınıyor...')

      fetch('/api/whatsapp/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then(async (res) => {
          const data = await res.json()
          if (!res.ok) {
            throw new Error(data.error || 'Token exchange failed')
          }
          setStatus('success')
          setMessage('WhatsApp Business hesabı başarıyla bağlandı!')
          setIsLoading(false)

          if (onSuccess && data.wabaId && data.phoneNumberId) {
            onSuccess({
              wabaId: data.wabaId,
              phoneNumberId: data.phoneNumberId,
              phoneNumber: data.phoneNumber,
            })
          }
        })
        .catch((error) => {
          console.error('Token exchange error:', error)
          setStatus('error')
          setMessage(`Hata: ${error.message}`)
          setIsLoading(false)

          if (onError) {
            onError(error.message)
          }
        })
    } else {
      console.error('Facebook login failed:', response)
      setStatus('error')
      setMessage('Facebook girişi başarısız')
      setIsLoading(false)

      if (onError) {
        onError('Facebook login failed')
      }
    }
  }

  const launchWhatsAppSignup = () => {
    if (!window.FB) {
      alert('Facebook SDK yükleniyor, lütfen bekleyin...')
      return
    }

    setIsLoading(true)
    setStatus('loading')
    setMessage('WhatsApp Business hesabı bağlanıyor...')

    window.FB.login(
      fbLoginCallback,
      {
        config_id: configId,
        response_type: 'code',
        override_default_response_type: true,
        extras: { version: 'v3' },
      }
    )
  }

  return (
    <div className="space-y-4">
      <button
        onClick={launchWhatsAppSignup}
        disabled={isLoading || status === 'success'}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Bağlanıyor...
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle size={20} />
            Bağlandı
          </>
        ) : (
          <>
            <span>WhatsApp Business Hesabını Bağla</span>
          </>
        )}
      </button>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-start gap-3 ${
            status === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : status === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
          }`}
        >
          {status === 'success' ? (
            <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          ) : status === 'error' ? (
            <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          ) : (
            <Loader2 size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 animate-spin" />
          )}
          <p
            className={`text-sm ${
              status === 'success'
                ? 'text-green-800 dark:text-green-300'
                : status === 'error'
                  ? 'text-red-800 dark:text-red-300'
                  : 'text-blue-800 dark:text-blue-300'
            }`}
          >
            {message}
          </p>
        </div>
      )}
    </div>
  )
}
