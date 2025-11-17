'use client'

import React, { useState, useEffect } from 'react'
import { Instagram, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'

export default function IntegrationsPage() {
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const t = useTranslations('settings')

  useEffect(() => {
    // Check for success/error in URL params
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    const username = searchParams.get('username')

    if (success && username) {
      // Add connected account to list
      setConnectedAccounts([
        {
          id: Date.now().toString(),
          platform: 'instagram',
          username,
          connectedAt: new Date(),
          status: 'active',
        },
      ])
    }

    // TODO: Load connected accounts from API/database
    // fetchConnectedAccounts()
  }, [searchParams])

  const handleConnectInstagram = async () => {
    setLoading(true)
    try {
      // Redirect to Instagram OAuth
      const userId = 'current-user-id' // TODO: Get from session/auth
      window.location.href = `/api/instagram/auth?userId=${userId}`
    } catch (error) {
      console.error('Failed to connect Instagram:', error)
      setLoading(false)
    }
  }

  const handleDisconnect = async (accountId: string) => {
    // TODO: Implement disconnect
    setConnectedAccounts(connectedAccounts.filter(acc => acc.id !== accountId))
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Header */}
      <header className="flex items-center justify-between sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-10 py-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Connect your social media accounts and services
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Instagram Integration Card */}
          <div className="bg-white dark:bg-gray-900/50 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Instagram size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Instagram
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Connect your Instagram Business account to receive and reply to DMs automatically
                  </p>
                </div>
              </div>
            </div>

            {/* Connected Accounts */}
            {connectedAccounts.filter(acc => acc.platform === 'instagram').length > 0 && (
              <div className="mb-6 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Connected Accounts
                </h4>
                {connectedAccounts
                  .filter(acc => acc.platform === 'instagram')
                  .map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                          <Instagram size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            @{account.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Connected {new Date(account.connectedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                          <CheckCircle size={16} />
                          Active
                        </span>
                        <button
                          onClick={() => handleDisconnect(account.id)}
                          className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Connect Button */}
            {connectedAccounts.filter(acc => acc.platform === 'instagram').length === 0 && (
              <button
                onClick={handleConnectInstagram}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Instagram size={20} />
                    Connect Instagram Account
                    <ExternalLink size={16} />
                  </>
                )}
              </button>
            )}

            {/* Features List */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Features
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  Receive Instagram DMs in your unified inbox
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  AI-powered automatic responses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  Sentiment analysis and auto-labeling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  Real-time message notifications
                </li>
              </ul>
            </div>
          </div>

          {/* Other Integrations Placeholder */}
          <div className="bg-white dark:bg-gray-900/50 p-8 rounded-lg border border-gray-200 dark:border-gray-800 opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <ExternalLink size={24} className="text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  More Integrations Coming Soon
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  WhatsApp, Email, and more integrations will be available soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

