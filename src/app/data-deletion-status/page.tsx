'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'

function DataDeletionStatusContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const [status, setStatus] = useState<'loading' | 'completed' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!code) {
      setStatus('error')
      setMessage('No confirmation code provided.')
      return
    }

    // Check the deletion status
    fetch(`/api/facebook/data-deletion?code=${code}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'completed') {
          setStatus('completed')
          setMessage(data.message || 'Your data has been successfully deleted.')
        } else {
          setStatus('error')
          setMessage(data.error || 'Unable to verify deletion status.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Unable to check deletion status. Please try again later.')
      })
  }, [code])

  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
      {status === 'loading' && (
        <>
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <h1 className="text-xl font-semibold text-navy dark:text-white mb-2">
            Checking Status...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we verify your data deletion request.
          </p>
        </>
      )}

      {status === 'completed' && (
        <>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-navy dark:text-white mb-2">
            Data Deletion Complete
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {message}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Confirmation Code: <code className="bg-gray-100 dark:bg-navy-700 px-2 py-1 rounded">{code}</code>
          </p>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-navy dark:text-white mb-2">
            Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {message}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            If you need assistance, please contact{' '}
            <a href="mailto:privacy@cevapliyoruz.com" className="text-primary hover:underline">
              privacy@cevapliyoruz.com
            </a>
          </p>
        </>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-400">
          Cevaplıyoruz - www.cevapliyoruz.com
        </p>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
      <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
      <h1 className="text-xl font-semibold text-navy dark:text-white mb-2">
        Loading...
      </h1>
    </div>
  )
}

export default function DataDeletionStatusPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 flex items-center justify-center p-4">
      <Suspense fallback={<LoadingFallback />}>
        <DataDeletionStatusContent />
      </Suspense>
    </div>
  )
}
